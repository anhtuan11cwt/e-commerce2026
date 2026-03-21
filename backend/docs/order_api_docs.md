# Order API – Tài liệu Postman

**Base URL**: `http://localhost:5000`  
**Prefix**: `/api/order`

---

## Mô hình dữ liệu (MongoDB)

| Trường        | Kiểu     | Bắt buộc | Mô tả |
| ------------- | -------- | -------- | ----- |
| `address`     | string   | Có       | Địa chỉ giao hàng |
| `createdAt`   | Date     | Mặc định `Date.now` | Thời điểm tạo đơn |
| `items`       | mảng     | Có (qua logic tạo đơn) | Mỗi phần tử: `name`, `price`, `product` (ObjectId), `quantity` |
| `method`      | string   | Có       | Phương thức thanh toán / giao nhận (ví dụ COD) |
| `paidAt`      | string   | Không    | Thời điểm thanh toán (nếu có) |
| `paymentInfo` | string   | Không    | Thông tin thanh toán bổ sung |
| `phoneNumber` | number   | Có       | Số điện thoại liên hệ |
| `status`      | string   | Mặc định `"pending"` | Trạng thái đơn hàng |
| `subTotal`    | number   | Có       | Tổng tiền hàng (tính từ giỏ) |
| `user`        | ObjectId | Có       | Tham chiếu tới User |

---

## 1. Tạo đơn hàng COD (từ giỏ hàng)

- **Method**: POST
- **URL**: `http://localhost:5000/api/order/new/cod`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
  - `Content-Type: application/json`
- **Body** (JSON):
  - `method` (string): Phương thức (ví dụ `"COD"`)
  - `phone` (number): Số điện thoại — lưu vào đơn dưới tên `phoneNumber`
  - `address` (string): Địa chỉ giao hàng

**Luồng xử lý (server)**:

1. Lấy toàn bộ dòng giỏ hàng của `req.user`, populate `product` (lấy `title`, `price`).
2. Nếu giỏ trống → 400.
3. Tính `subTotal` và mảng `items` (snapshot tên, giá, sản phẩm, số lượng).
4. Tạo document Order.
5. Với từng dòng đơn: giảm `stock`, tăng `sold` của Product tương ứng.
6. Xóa toàn bộ cart của user.
7. Gửi email xác nhận đơn (xem mục **Email** dưới đây).

- **Response**:
  - 201 (thành công):

```json
{
  "message": "Tạo đơn hàng thành công",
  "order": {
    "_id": "...",
    "address": "...",
    "createdAt": "...",
    "items": [
      {
        "name": "Tên sản phẩm",
        "price": 100000,
        "product": "...",
        "quantity": 2
      }
    ],
    "method": "COD",
    "phoneNumber": 901234567,
    "status": "pending",
    "subTotal": 200000,
    "user": "..."
  }
}
```

  - 400 (giỏ hàng trống):

```json
{
  "message": "Giỏ hàng trống"
}
```

  - 403 (không có token hoặc token không hợp lệ):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

  - 500 (lỗi máy chủ / MongoDB, ví dụ thiếu trường bắt buộc, lỗi cập nhật tồn kho):

```json
{
  "message": "..."
}
```

---

## Ghi chú chung

- **Đăng ký route** (`index.js`): `app.use("/api/order", orderRoutes)` — toàn bộ endpoint đặt hàng nằm dưới prefix `/api/order`.
- **Xác thực**: Endpoint hiện tại dùng middleware `isAuth` — cần JWT hợp lệ trong header `Authorization: Bearer ...`. Email lấy từ `req.user.email` để gửi xác nhận.
- **Nguồn dữ liệu đơn**: Sản phẩm và số lượng lấy từ **giỏ hàng** của user đã đăng nhập, không gửi danh sách `items` trong body.
- **Email xác nhận** (`utils/sendOrderConfirmation.js`): Dùng Nodemailer, SMTP Gmail (`smtp.gmail.com`, cổng 465, SSL). Biến môi trường: `EMAIL`, `EMAIL_PASSWORD`. Nội dung HTML gồm mã đơn, bảng sản phẩm, tổng tiền. Trong controller, hàm gửi mail được gọi **không** `await` — phản hồi 201 có thể trả về trước khi email gửi xong; lỗi gửi mail không chặn response (cần log/monitor nếu muốn đảm bảo gửi thành công).
