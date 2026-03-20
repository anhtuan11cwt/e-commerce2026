import jwt from "jsonwebtoken";
import User from "../models/user.js";
import tryCatch from "../utils/tryCatch.js";

export const testUserRoute = (_req, res) => {
  res.json({ message: "User route hoạt động" });
};

export const registerUser = tryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập tên, email và mật khẩu" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Email đã được đăng ký" });
  }

  const user = await User.create({ email, name, password });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.status(201).json({ message: "Đăng ký thành công", token, user });
});

export const loginUser = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.status(200).json({ message: "Đăng nhập thành công", token, user });
});

export const myProfile = tryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});
