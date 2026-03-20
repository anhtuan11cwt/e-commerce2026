import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import DataUriParser from "datauri/parser.js";

const parser = new DataUriParser();

export const bufferGenerator = (file) => {
  const ext = path.extname(file.originalname);
  return parser.format(ext, file.buffer);
};

export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`, {
      cause: error,
    });
  }
};

export default bufferGenerator;
