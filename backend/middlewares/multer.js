import multer from "multer";

const storage = multer.memoryStorage();

export const uploadFiles = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
  storage: storage,
}).array("files", 10); // Max 10 files per upload

export default uploadFiles;
