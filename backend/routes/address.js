import express from "express";
import {
  addAddress,
  deleteAddress,
  getAllAddress,
  getSingleAddress,
} from "../controllers/address.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuth, addAddress);
router.get("/", isAuth, getAllAddress);
router.get("/:id", isAuth, getSingleAddress);
router.delete("/:id", isAuth, deleteAddress);

export default router;
