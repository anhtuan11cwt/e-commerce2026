# Nền tảng E-Commerce MERN Full-Stack

Một ứng dụng web full-stack giàu tính năng dành cho nền tảng thương mại điện tử, được xây dựng bằng **MERN** stack (MongoDB, Express.js, React, Node.js).
Ứng dụng này cung cấp một cửa hàng kỹ thuật số hoàn chỉnh với các tính năng: xác thực người dùng, danh mục sản phẩm, giỏ hàng, thanh toán an toàn thông qua Stripe, theo dõi đơn hàng và bảng điều khiển (dashboard) dành cho quản trị viên.

## 🚀 Các Tính Năng Chính

### Tính năng cho Người dùng
- **Xác thực người dùng:** Đăng ký, đăng nhập và xác thực OTP sử dụng JWT.
- **Danh mục sản phẩm:** Xem danh sách sản phẩm, xem trang chi tiết sản phẩm và tìm kiếm.
- **Giỏ hàng:** Thêm, cập nhật và xóa sản phẩm khỏi giỏ hàng.
- **Thanh toán bảo mật:** Hoàn tất giao dịch một cách mượt mà với tích hợp thanh toán Stripe.
- **Quản lý đơn hàng:** Theo dõi trạng thái đơn hàng và xem lịch sử đặt hàng.
- **Bảng điều khiển tài khoản:** Quản lý hồ sơ người dùng, theo dõi thống kê chi tiêu và xem chi tiết tài khoản.

### Tính năng cho Quản trị viên (Admin)
- **Tổng quan Dashboard:** Theo dõi các số liệu thống kê quan trọng của nền tảng (ví dụ: tổng doanh thu, số lượng người dùng, đơn hàng) thông qua biểu đồ trực quan bằng Recharts.
- **Quản lý sản phẩm:** Thêm, sửa, và xóa sản phẩm (hình ảnh được tải lên thông qua Cloudinary).
- **Xử lý đơn hàng:** Quản lý đơn hàng của khách và cập nhật trạng thái giao hàng.
- **Quản lý Người dùng & Quyền hạn:** Cổng Admin được bảo mật bằng cơ chế phân quyền (role-based authorization).

## 💻 Tech Stack (Công nghệ sử dụng)

### Frontend (Giao diện người dùng)
- **React 19** với **Vite** giúp phát triển và build ứng dụng nhanh, tối ưu.
- **React Router v7** định tuyến cho ứng dụng single-page.
- **Tailwind CSS v4** & **shadcn/ui** cung cấp phong cách thiết kế hiện đại, responsive cùng với các component sẵn có.
- **Recharts** để hiển thị dữ liệu chi tiêu và số liệu thống kê cho admin.
- **Axios** dùng để gọi API và tương tác với backend.
- **Stripe Elements** hỗ trợ xử lý thanh toán trên giao diện.

### Backend (Máy chủ)
- **Node.js** & **Express.js** làm framework xây dựng REST API.
- **MongoDB** với **Mongoose** dùng làm cơ sở dữ liệu mô hình hóa sản phẩm, người dùng, đơn hàng...
- **Stripe API** để thiết lập quy trình bảo mật và xác nhận thanh toán.
- **Cloudinary** kết hợp với **Multer** và **datauri** để xử lý việc tải ảnh sản phẩm.
- **Nodemailer** tính năng gửi email giao dịch (như mã OTP và cập nhật đơn hàng).
- **Bcryptjs** & **JSON Web Tokens (JWT)** dùng để bảo mật mật khẩu và phiên đăng nhập của người dùng.

## 🛠️ Yêu cầu cài đặt (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt và thiết lập các phần sau:
- **Node.js** (Phiên bản v18.0 trở lên)
- **MongoDB** (Phiên bản chạy offline ở local hoặc dùng MongoDB Atlas)
- **Tài khoản Stripe** (Để lấy test keys của API thanh toán)
- **Tài khoản Cloudinary** (Dùng để lưu trữ hình ảnh)
- **Tài khoản Gmail / Mật khẩu ứng dụng (App Password)** (Dành cho Nodemailer gửi thư)

## ⚙️ Cài đặt Biến Môi Trường (Environment Variables)

Tạo một file `.env` trong thư mục `backend` dựa trên cấu trúc của file `.env.example`:

```env
# MongoDB Connection (Kết nối DB)
MONGO_URL=mongodb://localhost:27017/ecommerce2026

# Server Port (Cổng máy chủ)
PORT=5000

# Cloudinary Credentials (Thông tin cấu hình Cloudinary)
CLOUD_NAME=your-cloud-name
CLOUD_API_KEY=your-cloud-api-key
CLOUD_API_SECRET=your-cloud-api-secret

# Stripe Keys (Khóa kết nối Stripe)
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_SECRET_KEY=sk_test_your-secret-key

# Frontend URL (Dành cho CORS / Đường link gửi trong Email)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Cấu hình gửi mail Nodemailer qua Gmail SMTP)
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

*(Nếu bạn thiết lập các biến ở frontend, hãy đảm bảo public key của Stripe được gán vào `VITE_STRIPE_PUBLIC_KEY` hoặc các biến môi trường cấu hình trong Vite của bạn.)*

## 📦 Cài đặt & Chạy ứng dụng nhanh

1. **Clone repository (Tải mã nguồn về):**
   ```bash
   git clone <repository-url>
   cd e-commerce
   ```

2. **Thiết lập Backend:**
   Điều hướng vào thư mục `backend`, cài đặt các thư viện (dependencies) và khởi động server.
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *Backend sẽ chạy ở địa chỉ `http://localhost:5000` (mặc định).*

3. **Thiết lập Frontend:**
   Mở một terminal (cửa sổ dòng lệnh) mới, điều hướng tới thư mục `frontend`, cài đặt package và khởi động Vite server.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend sẽ chạy ở địa chỉ `http://localhost:5173`.*

## 📂 Cấu trúc thư mục dự án

```text
e-commerce/
├── backend/
│   ├── config/        # Các cấu hình về database và các dịch vụ khác
│   ├── controllers/   # Logic xử lý request cho auth, products, orders, v.v.
│   ├── docs/          # Tài liệu hướng dẫn sử dụng API
│   ├── middlewares/   # Các hàm trung gian như Authentication, upload, và xử lý lỗi
│   ├── models/        # Các schema định nghĩa cấu trúc dữ liệu Mongoose
│   ├── plugins/       # Tích hợp dịch vụ bên thứ ba (Stripe, Cloudinary)
│   ├── routes/        # Định nghĩa các route cho API bằng Express
│   └── utils/         # Các hàm tiện ích hỗ trợ (Helper functions)
└── frontend/
    ├── public/        # Các tài nguyên tĩnh (Static assets)
    └── src/
        ├── assets/    # Lưu trữ hình ảnh, icons, kiểu dáng cục bộ (styles)
        ├── components/# Các React components dùng lại được (Navbar, Footer, UI)
        ├── context/   # React Context API để quản lý state global (dữ liệu user)
        ├── lib/       # File thiết lập và các hàm hỗ trợ chung
        ├── pages/     # Component tương ứng với các trang chính trong ứng dụng
        └── utils/     # Các hàm hỗ trợ dùng chung cho Frontend
```

## 📜 Các Scripts có sẵn

### Backend (`backend/package.json`)
- `npm run dev`: Chạy Node.js server với Nodemon (tự động reload khi code thay đổi).
- `npm start`: Chạy server trong môi trường production (sử dụng `node`).
- `npm run lint` / `npm run check`: Chạy ESLint hoặc Biome để kiểm tra và định dạng code.

### Frontend (`frontend/package.json`)
- `npm run dev`: Chạy frontend Vite ở chế độ development.
- `npm run build`: Build ứng dụng React để chuẩn bị cho quá trình deploy (production).
- `npm run preview`: Xem trước bản build trên máy cá nhân.
- `npm run lint` / `npm run check`: Kiểm tra và định dạng source code phía frontend.
