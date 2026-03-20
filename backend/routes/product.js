import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  updateProductImage,
} from "../controllers/product.js";
import { isAuth } from "../middlewares/auth.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", isAuth, uploadFiles, createProduct);
router.get("/all", getAllProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", isAuth, updateProduct);
router.post("/product-image/:id", isAuth, uploadFiles, updateProductImage);

export default router;
