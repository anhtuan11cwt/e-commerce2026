import mongoose from "mongoose";
import passwordHashPlugin from "../plugins/passwordHash.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    name: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      default: "user",
      enum: ["admin", "user"],
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.plugin(passwordHashPlugin);

const User = mongoose.model("User", userSchema);

export default User;
