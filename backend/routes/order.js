import express from "express";
import { newOrderCOD } from "../controllers/order.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new/cod", isAuth, newOrderCOD);

export default router;
