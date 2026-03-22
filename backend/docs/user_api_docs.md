# User API – Tài liệu Postman

**Base URL**: `http://localhost:5000`  
**Prefix**: `/api/user`

---

## 1. Test route

- **Method**: GET
- **URL**: `http://localhost:5000/api/user/test`
- **Authorization**: Không
- **Response**:
  - 200 (thành công):

```json
{
  "message": "User route hoạt động"
}
```

---

## 2. Đăng ký tài khoản

- **Method**: POST
- **URL**: `http://localhost:5000/api/user/register`
- **Authorization**: Không
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "123456"
}
```

- **Response**:
  - 201 (thành công): Tạo tài khoản; **không** trả JWT. Client cần gọi `POST /api/user/login` để lấy token.

```json
{
  "message": "Đăng ký thành công. Vui lòng đăng nhập."
}
```

  - 400 (thiếu trường):

```json
{
  "message": "Vui lòng nhập tên, email và mật khẩu"
}
```

  - 400 (mật khẩu < 6 ký tự):

```json
{
  "message": "Mật khẩu phải có ít nhất 6 ký tự"
}
```

  - 400 (email đã tồn tại):

```json
{
  "message": "Email đã được đăng ký"
}
```

---

## 3. Đăng nhập

- **Method**: POST
- **URL**: `http://localhost:5000/api/user/login`
- **Authorization**: Không
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

- **Response**:
  - 200 (thành công):

```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "role": "user"
  }
}
```

  - 400 (thiếu trường):

```json
{
  "message": "Vui lòng nhập email và mật khẩu"
}
```

  - 400 (sai email hoặc mật khẩu):

```json
{
  "message": "Email hoặc mật khẩu không đúng"
}
```

---

## 4. Lấy thông tin cá nhân (Profile)

- **Method**: GET
- **URL**: `http://localhost:5000/api/user/me`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}` (token nhận được từ đăng nhập)
- **Response**:
  - 200 (thành công):

```json
{
  "_id": "...",
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "...",
  "updatedAt": "..."
}
```

  - 403 (không có token):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

  - 500 (token không hợp lệ/hết hạn):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

---

## 5. Cập nhật hồ sơ (tên, email)

- **Method**: PUT
- **URL**: `http://localhost:5000/api/user/me/update`
- **Authorization**: Có (`Bearer {JWT_TOKEN}`)
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON): ít nhất một trong hai trường `name`, `email`:

```json
{
  "name": "Nguyen Van B",
  "email": "new@example.com"
}
```

- **Response**:
  - 200 (thành công):

```json
{
  "message": "Cập nhật thông tin thành công",
  "user": {
    "_id": "...",
    "email": "new@example.com",
    "name": "Nguyen Van B",
    "role": "user"
  }
}
```

  - 400 (không gửi trường nào để cập nhật):

```json
{
  "message": "Vui lòng cung cấp thông tin cần cập nhật"
}
```

  - 400 (email đã được tài khoản khác dùng):

```json
{
  "message": "Email đã được sử dụng"
}
```

  - 404 (không tìm thấy user — hiếm khi xảy ra nếu token hợp lệ):

```json
{
  "message": "Không tìm thấy người dùng"
}
```

---

## 6. Đổi mật khẩu

- **Method**: PUT
- **URL**: `http://localhost:5000/api/user/me/password`
- **Authorization**: Có (`Bearer {JWT_TOKEN}`)
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "oldPassword": "123456",
  "newPassword": "newsecret"
}
```

- **Response**:
  - 200 (thành công):

```json
{
  "message": "Đổi mật khẩu thành công"
}
```

  - 400 (thiếu trường):

```json
{
  "message": "Vui lòng nhập mật khẩu cũ và mật khẩu mới"
}
```

  - 400 (mật khẩu mới dưới 6 ký tự):

```json
{
  "message": "Mật khẩu mới phải có ít nhất 6 ký tự"
}
```

  - 400 (mật khẩu cũ sai):

```json
{
  "message": "Mật khẩu cũ không đúng"
}
```

  - 404:

```json
{
  "message": "Không tìm thấy người dùng"
}
```

---

## Ghi chú chung

- **JWT Token**: Chỉ **đăng nhập** (`POST /login`) trả về `token` trong body. Token hết hạn sau 15 ngày.
- **Đăng ký**: Chỉ tạo user; không cấp JWT — luồng client thường chuyển sang trang đăng nhập. Sau khi tạo tài khoản thành công, server gọi `sendWelcomeEmail` (Gmail SMTP qua Nodemailer). Nếu gửi mail lỗi, lỗi chỉ ghi log server; response đăng ký vẫn 201.
- **Email chào mừng (SMTP)**: Cần biến môi trường `EMAIL`, `EMAIL_PASSWORD` (App Password Gmail), và tùy chọn `FRONTEND_URL` (mặc định `http://localhost:5173`) cho link “Đăng nhập ngay” trong email. Xem `backend/.env.example`.
- **Xác thực**: Gửi token qua header `Authorization: Bearer {token}` cho các API cần xác thực (`/me`, `/me/update`, `/me/password`).
- **Role mặc định**: `user`
