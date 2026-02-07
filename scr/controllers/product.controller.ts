import { Request, Response } from "express";
import { RequestWithFile } from "../middlewares/upload.middleware";
import Product from "../models/product.models";

export const createProduct = async (
  req: RequestWithFile,
  res: Response,
): Promise<void> => {
  try {
    const productData = req.body;

    if (req.file) {
      // Store complete URL for easier frontend access
      productData.imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }

    const product = new Product(productData);
    await product.save();

    // Get all products with populated category
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

export const updateProduct = async (
  req: RequestWithFile,
  res: Response,
): Promise<void> => {
  try {
    const productData = req.body;
    if (req.file) {
      // Store complete URL for easier frontend access
      productData.imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true },
    );
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

