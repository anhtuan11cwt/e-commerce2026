import express from "express";
import {
  changePassword,
  loginUser,
  myProfile,
  registerUser,
  testUserRoute,
  updateProfile,
} from "../controllers/user.js";
import { isAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/test", testUserRoute);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.put("/me/update", isAuth, updateProfile);
router.put("/me/password", isAuth, changePassword);

export default router;
