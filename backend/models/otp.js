import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  expiresAt: {
    default: () => new Date(Date.now() + 5 * 60 * 1000),
    expires: 0,
    type: Date,
  },
  otp: {
    required: true,
    type: Number,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
