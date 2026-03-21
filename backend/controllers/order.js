import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import sendOrderConfirmation from "../utils/sendOrderConfirmation.js";
import tryCatch from "../utils/tryCatch.js";

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
