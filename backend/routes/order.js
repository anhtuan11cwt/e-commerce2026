import express from "express";
import {
  getAllOrders,
  getMyOrder,
  getOrdersAdmin,
  getStats,
  newOrderCOD,
  newOrderOnline,
  updateStatus,
  verifyPayment,
} from "../controllers/order.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new/cod", isAuth, newOrderCOD);
router.post("/new/online", isAuth, newOrderOnline);
router.post("/verify/payment", isAuth, verifyPayment);
router.get("/all", isAuth, getAllOrders);
router.get("/admin/all", isAuth, getOrdersAdmin);
router.get("/stats", isAuth, getStats);
router.get("/:id", isAuth, getMyOrder);
router.post("/:id", isAuth, updateStatus);

export default router;
