import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.EMAIL_PASSWORD,
    user: process.env.EMAIL,
  },
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
});

const sendWelcomeEmail = async (email, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="text-align: center; color: #333; margin-bottom: 24px;">Chào mừng bạn đến với cửa hàng!</h2>
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại cửa hàng của chúng tôi. Tài khoản của bạn đã được tạo thành công!</p>
        <p>Bạn có thể đăng nhập và bắt đầu mua sắm ngay bây giờ.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login"
             style="display: inline-block; background: #333; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Đăng nhập ngay
          </a>
        </div>
        <p style="color: #888; font-size: 13px;">Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #aaa; font-size: 12px; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
      </div>
    `,
    subject: "Chào mừng bạn đã đăng ký!",
    to: email,
  });
};

export default sendWelcomeEmail;
