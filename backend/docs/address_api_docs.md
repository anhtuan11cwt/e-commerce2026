# Address API – Tài liệu Postman

**Base URL**: `http://localhost:5000`  
**Prefix**: `/api/address`

---

## Mô hình dữ liệu (MongoDB)

| Trường        | Kiểu   | Bắt buộc | Mô tả                          |
| ------------- | ------ | -------- | ------------------------------ |
| `address`     | string | Có       | Địa chỉ giao hàng              |
| `phoneNumber` | number | Có       | Số điện thoại liên hệ          |
| `user`        | ObjectId | Có     | Tham chiếu tới User            |
| `createdAt`   | Date   | Tự động  | Thời điểm tạo (`timestamps`)   |
| `updatedAt`   | Date   | Tự động  | Thời điểm cập nhật (`timestamps`) |

---

## 1. Thêm địa chỉ mới

- **Method**: POST
- **URL**: `http://localhost:5000/api/address/new`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
  - `Content-Type: application/json`
- **Body** (JSON):
  - `address` (string): Nội dung địa chỉ
  - `phoneNumber` (number): Số điện thoại

- **Response**:
  - 201 (thành công):

```json
{
  "address": {
    "_id": "...",
    "address": "123 Đường ABC, Quận 1, TP.HCM",
    "phoneNumber": 901234567,
    "user": "...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "Thêm địa chỉ thành công"
}
```

  - 403 (không có token hoặc token không hợp lệ):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

  - 500 (lỗi máy chủ / validation MongoDB, ví dụ thiếu trường bắt buộc):

```json
{
  "message": "..."
}
```

---

## 2. Lấy danh sách địa chỉ của người dùng hiện tại

- **Method**: GET
- **URL**: `http://localhost:5000/api/address/`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`

- **Response**:
  - 200 (thành công): Mảng các địa chỉ thuộc `req.user`:

```json
[
  {
    "_id": "...",
    "address": "123 Đường ABC",
    "phoneNumber": 901234567,
    "user": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

  - 403 (không có token):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

---

## 3. Lấy một địa chỉ theo ID

- **Method**: GET
- **URL**: `http://localhost:5000/api/address/{id}`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
- **Path Parameters**:
  - `id` (string): `_id` của địa chỉ trong MongoDB

- **Response**:
  - 200 (thành công): Document địa chỉ (hoặc `null` nếu không tìm thấy ID hợp lệ)

```json
{
  "_id": "...",
  "address": "123 Đường ABC",
  "phoneNumber": 901234567,
  "user": "...",
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

---

## 4. Xóa địa chỉ

- **Method**: DELETE
- **URL**: `http://localhost:5000/api/address/{id}`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
- **Path Parameters**:
  - `id` (string): `_id` của địa chỉ cần xóa

- **Response**:
  - 200 (thành công):

```json
{
  "message": "Xóa địa chỉ thành công"
}
```

  - 403 (không có token):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

  - 500 (không tìm thấy địa chỉ thuộc user hiện tại hoặc ID không hợp lệ — có thể xảy ra khi gọi `deleteOne` trên `null`):

```json
{
  "message": "..."
}
```

---

## Ghi chú chung

- **Xác thực**: Tất cả endpoint đều dùng middleware `isAuth` — cần JWT hợp lệ trong header `Authorization: Bearer ...`.
- **Gắn user**: Khi thêm địa chỉ (`POST /new`), `user` được gán tự động từ token, không cần gửi trong body.
- **Danh sách & xóa**: Chỉ trả về / cho phép xóa địa chỉ thuộc đúng user đang đăng nhập (trừ `GET /:id` hiện lấy theo ID mà không lọc theo `user` — client nên chỉ dùng ID lấy từ danh sách của chính user).
- **Đăng ký route**: Trong `index.js`, mount tại `app.use("/api/address", addressRoutes)`.
