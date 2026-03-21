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
| `method`      | string   | Có       | Phương thức thanh toán / giao nhận (ví dụ `COD`, `Online`) |
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
7. Gửi email xác nhận đơn (xem **Ghi chú chung**).

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

  - 500 (lỗi máy chủ / MongoDB):

```json
{
  "message": "..."
}
```

---

## 2. Lấy danh sách đơn hàng của user hiện tại

- **Method**: GET
- **URL**: `http://localhost:5000/api/order/all`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`

- **Response**:
  - 200 (thành công): Mảng các đơn của `req.user._id`, **mới nhất trước** (đảo thứ tự so với kết quả `find`).

```json
[
  {
    "_id": "...",
    "address": "...",
    "items": [...],
    "method": "COD",
    "phoneNumber": 901234567,
    "status": "pending",
    "subTotal": 200000,
    "user": "...",
    "createdAt": "..."
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

## 3. Lấy tất cả đơn hàng (admin)

- **Method**: GET
- **URL**: `http://localhost:5000/api/order/admin/all`
- **Authorization**: Có; **chỉ `role === "admin"`**
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`

- **Response**:
  - 200 (thành công): Danh sách đơn, `user` được populate, sắp xếp `createdAt` giảm dần.

```json
[
  {
    "_id": "...",
    "address": "...",
    "items": [...],
    "method": "COD",
    "phoneNumber": 901234567,
    "status": "pending",
    "subTotal": 200000,
    "user": {
      "_id": "...",
      "name": "...",
      "email": "..."
    },
    "createdAt": "..."
  }
]
```

  - 403 (không phải admin):

```json
{
  "message": "Bạn không phải admin"
}
```

---

## 4. Thống kê đơn hàng (admin)

- **Method**: GET
- **URL**: `http://localhost:5000/api/order/stats`
- **Authorization**: Có; **chỉ admin**
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`

- **Response**:
  - 200 (thành công):

```json
{
  "codCount": 10,
  "onlineCount": 5,
  "data": [
    { "sold": 100, "title": "Tên sản phẩm" }
  ]
}
```

  - `codCount` / `onlineCount`: Số đơn có `method` lần lượt `"COD"` và `"Online"`.
  - `data`: Mỗi sản phẩm — `sold` và `title` (toàn bộ sản phẩm trong DB).

  - 403 (không phải admin):

```json
{
  "message": "Bạn không phải admin"
}
```

---

## 5. Chi tiết một đơn hàng theo ID

- **Method**: GET
- **URL**: `http://localhost:5000/api/order/{id}`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
- **Path Parameters**:
  - `id` (string): `_id` của Order

- **Response**:
  - 200 (thành công): Một document đơn, `items.product` và `user` được populate.

```json
{
  "_id": "...",
  "address": "...",
  "items": [
    {
      "name": "...",
      "price": 100000,
      "product": {
        "_id": "...",
        "title": "...",
        "price": 100000
      },
      "quantity": 2
    }
  ],
  "method": "COD",
  "phoneNumber": 901234567,
  "status": "pending",
  "subTotal": 200000,
  "user": { "_id": "...", "name": "...", "email": "..." },
  "createdAt": "..."
}
```

  - 404 (không tìm thấy đơn):

```json
{
  "message": "Không tìm thấy đơn hàng"
}
```

  - 403 (không có token):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

---

## 6. Cập nhật trạng thái đơn hàng (admin)

- **Method**: POST
- **URL**: `http://localhost:5000/api/order/{id}`
- **Authorization**: Có; **chỉ admin**
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
  - `Content-Type: application/json`
- **Path Parameters**:
  - `id` (string): `_id` của Order
- **Body** (JSON):
  - `status` (string): Trạng thái mới (ghi đè trường `status` trên document)

- **Response**:
  - 200 (thành công):

```json
{
  "message": "Cập nhật trạng thái thành công",
  "order": {
    "_id": "...",
    "status": "đang_giao",
    "...": "..."
  }
}
```

  - 404 (không tìm thấy đơn):

```json
{
  "message": "Không tìm thấy đơn hàng"
}
```

  - 403 (không phải admin):

```json
{
  "message": "Bạn không phải admin"
}
```

---

## Ghi chú chung

- **Đăng ký route** (`index.js`): `app.use("/api/order", orderRoutes)` — toàn bộ endpoint đặt hàng nằm dưới prefix `/api/order`.
- **Thứ tự route**: Các đường dẫn cố định (`/all`, `/admin/all`, `/stats`, `/new/cod`) được khai báo trước `/:id` để không bị nhầm với ID.
- **Xác thực**: Các handler dùng middleware `isAuth` — cần JWT trong `Authorization: Bearer ...`. Email xác nhận đơn lấy từ `req.user.email`.
- **Nguồn dữ liệu khi tạo đơn COD**: Sản phẩm và số lượng lấy từ **giỏ hàng** của user, không gửi `items` trong body.
- **Email xác nhận** (`utils/sendOrderConfirmation.js`): Nodemailer, SMTP Gmail (`smtp.gmail.com`, cổng 465, SSL). Biến môi trường: `EMAIL`, `EMAIL_PASSWORD`. Trong controller, gửi mail **không** `await` — response 201 có thể trả về trước khi email gửi xong.

**Controller**: `controllers/order.js` — `getAllOrders`, `getOrdersAdmin`, `getMyOrder`, `updateStatus`, `getStats`, `newOrderCOD`.  
**Routes**: `routes/order.js`.
