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
  - 201 (thành công):

```json
{
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
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
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
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
  - `Authorization: Bearer {JWT_TOKEN}` (token nhận được từ đăng ký/đăng nhập)
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

## Ghi chú chung

- **JWT Token**: Sau khi đăng ký/đăng nhập, server trả về token trong response body. Token hết hạn sau 15 ngày.
- **Xác thực**: Gửi token qua header `Authorization: Bearer {token}` cho các API cần xác thực.
- **Role mặc định**: `user`
