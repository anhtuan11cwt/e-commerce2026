# Tài liệu API (backend)

Mô tả endpoint cho Postman / client. **Base URL** mặc định: `http://localhost:5000` (đổi theo biến môi trường khi triển khai).

| Tài liệu | Prefix / ghi chú |
| -------- | ---------------- |
| [User](user_api_docs.md) | `/api/user` |
| [Email chào mừng (SMTP)](sendWelcome_email.md) | Tiện ích sau đăng ký |
| [Product](product_api_docs.md) | `/api/product` |
| [Cart](cart_api_docs.md) | `/api/cart` |
| [Order](order_api_docs.md) | `/api/order` |
| [Address](address_api_docs.md) | `/api/address` |

**Lưu ý**: JWT chỉ nhận qua `POST /api/user/login`. Đăng ký (`POST /api/user/register`) không trả token; sau đăng ký có thể gửi email chào mừng (xem [sendWelcome_email.md](sendWelcome_email.md)) nếu đã cấu hình `EMAIL` / `EMAIL_PASSWORD`.
