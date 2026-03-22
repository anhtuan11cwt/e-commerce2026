# Email chào mừng (`sendWelcomeEmail`)

Tiện ích: `backend/utils/sendWelcomeEmail.js`

## Vai trò

Sau khi **đăng ký thành công** (`POST /api/user/register`), controller gọi bất đồng bộ `sendWelcomeEmail(email, name)`. Email HTML gồm lời chào và nút link tới trang đăng nhập (`{FRONTEND_URL}/login`).

## Hành vi lỗi

Lỗi gửi mail **không** làm fail request đăng ký: lỗi được `catch` và `console.error` trên server; client vẫn nhận `201` như tài liệu [User API](user_api_docs.md).

## Cấu hình SMTP (Gmail)

| Biến môi trường | Mô tả |
| ---------------- | ----- |
| `EMAIL` | Địa chỉ Gmail dùng gửi (`from` / `auth.user`) |
| `EMAIL_PASSWORD` | App Password Gmail (không dùng mật khẩu đăng nhập thường) |
| `FRONTEND_URL` | Base URL frontend cho link “Đăng nhập ngay”; mặc định `http://localhost:5173` nếu không set |

Transport: `smtp.gmail.com`, cổng `465`, `secure: true` (Nodemailer).

Tham chiếu mẫu biến: `backend/.env.example`.
