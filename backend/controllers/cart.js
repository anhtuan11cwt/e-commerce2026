import Cart from "../models/cart.js";
import Product from "../models/product.js";
import tryCatch from "../utils/tryCatch.js";

export const addToCart = tryCatch(async (req, res) => {
  const { product: productId, quantity = 1 } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({
    product: productId,
    user: userId,
  }).populate("product");

  if (cart) {
    const newQty = cart.quantity + quantity;
    if (newQty > cart.product.stock) {
      return res.status(400).json({ message: "Hết hàng" });
    }

    cart.quantity = newQty;
    await cart.save();

    return res.status(200).json({ message: "Đã thêm vào giỏ hàng" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  if (quantity > product.stock) {
    return res.status(400).json({ message: "Hết hàng" });
  }

  await Cart.create({
    product: productId,
    quantity,
    user: userId,
  });

  res.status(201).json({ message: "Đã thêm vào giỏ hàng" });
});

export const removeFromCart = tryCatch(async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  await cart.deleteOne();

  res.status(200).json({ message: "Đã xóa khỏi giỏ hàng" });
});

export const updateCart = tryCatch(async (req, res) => {
  const { action } = req.query;
  const { id } = req.body;

  const cart = await Cart.findById(id).populate("product");

  if (action === "INC") {
    if (cart.quantity >= cart.product.stock) {
      return res.status(400).json({ message: "Hết hàng" });
    }

    cart.quantity += 1;
    await cart.save();

    return res.status(200).json({ message: "Đã cập nhật giỏ hàng" });
  }

  if (action === "DEC") {
    if (cart.quantity <= 1) {
      return res
        .status(400)
        .json({ message: "Bạn chỉ có 1 sản phẩm, không thể giảm thêm" });
    }

    cart.quantity -= 1;
    await cart.save();

    return res.status(200).json({ message: "Đã cập nhật giỏ hàng" });
  }

  res.status(400).json({ message: "Hành động không hợp lệ" });
});

export const fetchCart = tryCatch(async (req, res) => {
  const cart = await Cart.find({ user: req.user._id }).populate("product");

  let subTotal = 0;

  cart.forEach((item) => {
    subTotal += item.product.price * item.quantity;
  });

  const sumOfQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  res.status(200).json({ cart, subTotal, sumOfQuantity });
});
