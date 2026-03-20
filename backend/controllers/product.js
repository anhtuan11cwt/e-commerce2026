import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";
import { bufferGenerator } from "../utils/bufferGenerator.js";
import tryCatch from "../utils/tryCatch.js";

export const createProduct = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "Bạn không phải là quản trị viên" });
  }

  const { title, about, category, price, stock } = req.body;

  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "Không có file để tải lên" });
  }

  const imagesPromise = files.map(async (file) => {
    const fileUri = bufferGenerator(file);
    const result = await cloudinary.uploader.upload(fileUri.content, {
      folder: "e-commerce2026",
    });
    return { id: result.public_id, url: result.secure_url };
  });

  const images = await Promise.all(imagesPromise);

  const product = await Product.create({
    about,
    category,
    images,
    price,
    stock,
    title,
  });

  res.status(201).json({ message: "Tạo sản phẩm thành công", product });
});

export const getAllProducts = tryCatch(async (req, res) => {
  const { search, category, page, sortByPrice } = req.query;

  const filter = {};

  if (search) {
    filter.title = { $options: "i", $regex: search };
  }

  if (category) {
    filter.category = category;
  }

  const limit = 8;
  const skip = (Number(page) - 1) * limit || 0;

  let sortOption = { createdAt: -1 };

  if (sortByPrice === "lowToHigh") {
    sortOption = { price: 1 };
  } else if (sortByPrice === "highToLow") {
    sortOption = { price: -1 };
  }

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const categories = await Product.distinct("category");
  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  const newProducts = await Product.find().sort({ createdAt: -1 }).limit(4);

  res.status(200).json({
    categories,
    new_products: newProducts,
    products,
    total_pages: totalPages,
  });
});
