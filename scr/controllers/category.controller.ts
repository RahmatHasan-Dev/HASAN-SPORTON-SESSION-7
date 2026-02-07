import {Request, Response} from "express";
import { RequestWithFile } from "../middlewares/upload.middleware";
import Category from "../models/category.model";

export const createCategory = async (req: RequestWithFile, res: Response ): Promise<void> => {
    try {
        const categoryData = req.body;

        if (req.file) {
            categoryData.imageUrl = req.file.path
        }
        const category = new Category(categoryData);
        await category.save();
        res.status(201).json(category)
    } catch(error) {
        res.status(500).json({message: "Error membuat category", error });
    }
}

export const getCategories = async (req: Request, res: Response ): Promise<void> => {
    try {
        const categories = await Category.find().sort({createdAt: -1});
        res.status(200).json(categories);
    }   catch(error) {
        res.status(500).json({message: "Error fetching categories", error })
    }
}

export const getCategoryById = async (req: Request, res: Response ): Promise<void> => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({message: "Category di cari ngaak ada"});
            return;
        }

        res.status(200).json(category);
    }   catch(error) {
        res.status(500).json({message: "Error fetching category", error })
    }
}

export const updateCategory = async (req: RequestWithFile, res: Response ): Promise<void> => {
    try {
        const categoryData = req.body;
        if (req.file) {
            categoryData.imageUrl = req.file.path
        }
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            categoryData,
            {new: true}
        );
        if (!category) {
            res.status(404).json({message: "Category Not Found"});
            return;
        }
        res.status(200).json(category);
    } catch(error) {
        res.status(500).json({message: "Error updating category", error })
    }
}

export const deleteCategory = async (req: Request, res: Response ): Promise<void> => {
    try {
        const category = await Category.findByIdAndDelete(
            req.params.id,);
        if (!category) {
            res.status(404).json({message: "Category Not Found" });
            return;
        }
        res.status(200).json({message: "Category deleted sukses"});
    } catch(error) {
        res.status(500).json({message: "Error deleting category", error })
    }
};

