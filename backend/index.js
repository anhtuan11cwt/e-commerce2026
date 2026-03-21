import dotenv from "dotenv";
import express from "express";
import connectCloudinary from "./config/cloudinary.js";
import addressRoutes from "./routes/address.js";
import cartRoutes from "./routes/cart.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import connectDB from "./utils/db.js";

dotenv.config();

connectCloudinary();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.get("/", (_req, res) => {
  res.json({ message: "Máy chủ đang chạy" });
});

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);

app.listen(PORT, () => {
  console.log(`Máy chủ đang chạy trên cổng ${PORT}`);
});
