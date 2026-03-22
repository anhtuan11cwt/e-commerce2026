import jwt from "jsonwebtoken";
import User from "../models/user.js";
import sendWelcomeEmail from "../utils/sendWelcomeEmail.js";
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

  await User.create({ email, name, password });

  sendWelcomeEmail(email, name).catch((err) => {
    console.error("Gửi email chào mừng thất bại:", err.message);
  });

  res.status(201).json({
    message: "Đăng ký thành công. Vui lòng đăng nhập.",
  });
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

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    },
  );

  res.status(200).json({
    message: "Đăng nhập thành công",
    token,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

export const myProfile = tryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

export const updateProfile = tryCatch(async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp thông tin cần cập nhật" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy người dùng" });
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    user.email = email;
  }

  if (name) user.name = name;

  await user.save();

  res.status(200).json({
    message: "Cập nhật thông tin thành công",
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

export const changePassword = tryCatch(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập mật khẩu cũ và mật khẩu mới" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy người dùng" });
  }

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Đổi mật khẩu thành công" });
});
