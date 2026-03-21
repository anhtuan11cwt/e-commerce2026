import express from "express";
import {
  getAllOrders,
  getMyOrder,
  getOrdersAdmin,
  getStats,
  newOrderCOD,
  updateStatus,
} from "../controllers/order.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new/cod", isAuth, newOrderCOD);
router.get("/all", isAuth, getAllOrders);
router.get("/admin/all", isAuth, getOrdersAdmin);
router.get("/stats", isAuth, getStats);
router.get("/:id", isAuth, getMyOrder);
router.post("/:id", isAuth, updateStatus);

export default router;
