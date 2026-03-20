import express from "express";
import {
  loginUser,
  myProfile,
  registerUser,
  testUserRoute,
} from "../controllers/user.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/test", testUserRoute);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);

export default router;
