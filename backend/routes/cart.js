import express from "express";
import {
  addToCart,
  fetchCart,
  removeFromCart,
  updateCart,
} from "../controllers/cart.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuth, addToCart);
router.get("/remove/:id", isAuth, removeFromCart);
router.post("/update", isAuth, updateCart);
router.get("/all", isAuth, fetchCart);

export default router;
