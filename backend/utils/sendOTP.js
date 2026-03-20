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

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="text-align: center; color: #333;">Xác thực Email</h2>
        <p>Xin chào,</p>
        <p>Đây là mã OTP của bạn để xác thực đăng nhập:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; background: #f5f5f5; padding: 12px 32px; font-size: 28px; font-weight: bold; letter-spacing: 6px; border-radius: 6px; color: #333;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 13px;">Mã này sẽ hết hạn sau <b>5 phút</b>. Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #aaa; font-size: 12px; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
      </div>
    `,
    subject: "Mã xác thực OTP của bạn",
    to: email,
  });
};

export default sendOTP;
