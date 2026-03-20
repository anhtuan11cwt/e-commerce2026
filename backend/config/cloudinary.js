import cloudinary from "cloudinary";

const connectCloudinary = () => {
  cloudinary.v2.config({
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    cloud_name: process.env.CLOUD_NAME,
  });
};

export default connectCloudinary;
