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

const sendOrderConfirmation = async (email, orderId, items, subTotal) => {
  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">${item.price.toLocaleString()} VND</td>
      </tr>`,
    )
    .join("");

  await transporter.sendMail({
    from: process.env.EMAIL,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="text-align: center; color: #333;">Xác nhận đơn hàng</h2>
        <p>Xin chào,</p>
        <p>Đơn hàng của bạn đã được đặt thành công. Dưới đây là chi tiết đơn hàng:</p>
        <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e0e0e0;">Sản phẩm</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e0e0e0;">Số lượng</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e0e0e0;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
        <p style="text-align: right; font-size: 18px; font-weight: bold;">Tổng cộng: ${subTotal.toLocaleString()} VND</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #888; font-size: 13px;">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!</p>
        <p style="color: #aaa; font-size: 12px; text-align: center;">Đây là email tự động, vui lòng không trả lời.</p>
      </div>
    `,
    subject: "Order Confirmation",
    to: email,
  });
};

export default sendOrderConfirmation;
