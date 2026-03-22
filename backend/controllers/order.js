import Stripe from "stripe";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import tryCatch from "../utils/tryCatch.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export const getUserSpendingStats = tryCatch(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId }).populate("items.product");

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.subTotal, 0);

  const statusCounts = {};
  for (const order of orders) {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  }

  const monthlySpending = {};
  for (const order of orders) {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlySpending[key] = (monthlySpending[key] || 0) + order.subTotal;
  }

  const productCounts = {};
  for (const order of orders) {
    for (const item of order.items) {
      const productId =
        item.product?._id?.toString() || item.product?.toString();
      const productName =
        item.name || item.product?.title || "Sản phẩm không xác định";
      if (!productCounts[productId]) {
        productCounts[productId] = {
          name: productName,
          quantity: 0,
          totalSpent: 0,
        };
      }
      productCounts[productId].quantity += item.quantity;
      productCounts[productId].totalSpent += item.price * item.quantity;
    }
  }

  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const monthlyData = Object.entries(monthlySpending)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ amount, month }));

  res.json({
    monthlySpending: monthlyData,
    statusCounts,
    topProducts,
    totalOrders,
    totalSpent,
  });
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

export const newOrderOnline = tryCatch(async (req, res) => {
  const { method, phone, address } = req.body;

  const cart = await Cart.find({ user: req.user._id }).populate(
    "product",
    "title price images",
  );

  if (cart.length === 0) {
    return res.status(400).json({ message: "Giỏ hàng trống" });
  }

  const line_items = cart.map((item) => {
    const imageUrl = item.product.images?.[0]?.url;
    const productData = { name: item.product.title };
    if (imageUrl) {
      productData.images = [imageUrl];
    }
    return {
      price_data: {
        currency: "vnd",
        product_data: productData,
        unit_amount: Math.round(item.product.price),
      },
      quantity: item.quantity,
    };
  });

  let subTotal = 0;
  cart.forEach((item) => {
    subTotal += item.product.price * item.quantity;
  });

  const session = await stripe.checkout.sessions.create({
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
    line_items,
    metadata: {
      address,
      method,
      phone: phone.toString(),
      subTotal: subTotal.toString(),
      userId: req.user._id.toString(),
    },
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/order-processing?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.json({ url: session.url });
});

export const verifyPayment = tryCatch(async (req, res) => {
  const { sessionId } = req.query;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return res.status(400).json({ message: "Thanh toán chưa hoàn tất" });
  }

  const existingOrder = await Order.findOne({ paymentInfo: sessionId });
  if (existingOrder) {
    return res.status(400).json({ message: "Đơn hàng đã tồn tại" });
  }

  const { userId, method, phone, address } = session.metadata;

  const cart = await Cart.find({ user: userId }).populate(
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
    paidAt: new Date().toISOString(),
    paymentInfo: sessionId,
    phoneNumber: Number(phone),
    subTotal,
    user: userId,
  });

  for (const item of order.items) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  await Cart.deleteMany({ user: userId });

  const user = await Order.findById(order._id).populate("user");
  sendOrderConfirmation(user.user.email, order._id, items, subTotal);

  res.json({ message: "Thanh toán thành công", order });
});
