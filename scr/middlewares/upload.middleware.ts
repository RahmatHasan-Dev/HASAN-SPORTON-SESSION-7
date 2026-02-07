import multer, { diskStorage, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

export interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

const storage = diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, uploadDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqeSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqeSuffix + path.extname(file.originalname))
    },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else{
        cb(new Error("Hanya gambar yang boleh"));
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5 * 1024 * 1024} // maksimal 5 MB
});

