import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Vui lòng đăng nhập" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: "Vui lòng đăng nhập" });
    }

    req.user = user;
    next();
  } catch {
    res.status(500).json({ message: "Vui lòng đăng nhập" });
  }
};
