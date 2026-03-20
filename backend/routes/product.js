import express from "express";
import { createProduct, getAllProducts } from "../controllers/product.js";
import { isAuth } from "../middlewares/auth.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", isAuth, uploadFiles, createProduct);
router.get("/all", getAllProducts);

export default router;
