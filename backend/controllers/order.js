import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import tryCatch from "../utils/tryCatch.js";

export const getAllOrders = tryCatch(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders.reverse());
});

export const getOrdersAdmin = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không phải admin" });
  }
  const orders = await Order.find().populate("user").sort({ createdAt: -1 });
  res.json(orders);
});

export const getMyOrder = tryCatch(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("user");
  if (!order) {
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  }
  res.json(order);
});

export const updateStatus = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không phải admin" });
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  }
  order.status = req.body.status;
  await order.save();
  res.json({ message: "Cập nhật trạng thái thành công", order });
});

export const getStats = tryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không phải admin" });
  }
  const codCount = await Order.countDocuments({ method: "COD" });
  const onlineCount = await Order.countDocuments({ method: "Online" });
  const products = await Product.find();
  const data = products.map((product) => ({
    sold: product.sold,
    title: product.title,
  }));
  res.json({ codCount, data, onlineCount });
});

export const newOrderCOD = tryCatch(async (req, res) => {
  const { method, phone, address } = req.body;

  const cart = await Cart.find({ user: req.user._id }).populate(
    "product",
    "title price",
  );

  if (cart.length === 0) {
    return res.status(400).json({ message: "Giỏ hàng trống" });
  }

  let subTotal = 0;
  const items = cart.map((item) => {
    subTotal += item.product.price * item.quantity;
    return {
      name: item.product.title,
      price: item.product.price,
      product: item.product._id,
      quantity: item.quantity,
    };
  });

  const order = await Order.create({
    address,
    items,
    method,
    phoneNumber: phone,
    subTotal,
    user: req.user._id,
  });

  for (const item of order.items) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  await Cart.deleteMany({ user: req.user._id });

  sendOrderConfirmation(req.user.email, order._id, items, subTotal);

  res.status(201).json({ message: "Tạo đơn hàng thành công", order });
});
