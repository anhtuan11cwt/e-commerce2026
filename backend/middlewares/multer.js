import multer from "multer";

const storage = multer.memoryStorage();

export const uploadFiles = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
  storage: storage,
}).array("images", 10); // Max 10 images per upload

export default uploadFiles;
