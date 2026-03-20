import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  product: {
    ref: "Product",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  quantity: {
    required: true,
    type: Number,
  },
  user: {
    ref: "User",
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
