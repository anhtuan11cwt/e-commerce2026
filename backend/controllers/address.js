import Address from "../models/address.js";
import tryCatch from "../utils/tryCatch.js";

export const addAddress = tryCatch(async (req, res) => {
  const { address, phoneNumber } = req.body;

  const newAddress = await Address.create({
    address,
    phoneNumber,
    user: req.user._id,
  });

  res
    .status(201)
    .json({ address: newAddress, message: "Thêm địa chỉ thành công" });
});

export const getAllAddress = tryCatch(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });

  res.status(200).json(addresses);
});

export const getSingleAddress = tryCatch(async (req, res) => {
  const address = await Address.findById(req.params.id);

  res.status(200).json(address);
});

export const deleteAddress = tryCatch(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  await address.deleteOne();

  res.status(200).json({ message: "Xóa địa chỉ thành công" });
});
