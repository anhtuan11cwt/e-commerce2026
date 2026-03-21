import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  address: { required: true, type: String },
  createdAt: { default: Date.now, type: Date },
  items: [
    {
      name: { required: true, type: String },
      price: { required: true, type: Number },
      product: {
        ref: "Product",
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
      quantity: { required: true, type: Number },
    },
  ],
  method: { required: true, type: String },
  paidAt: { type: String },
  paymentInfo: { type: String },
  phoneNumber: { required: true, type: Number },
  status: { default: "pending", type: String },
  subTotal: { required: true, type: Number },
  user: { ref: "User", required: true, type: mongoose.Schema.Types.ObjectId },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
