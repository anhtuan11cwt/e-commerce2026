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
| `paidAt`      | string   | Không    | Thời điểm thanh toán (ISO string; đơn Online sau khi Stripe xác nhận) |
| `paymentInfo` | string   | Không    | ID phiên Stripe Checkout (`session.id`) — chỉ đơn thanh toán online |
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

## 2. Tạo phiên thanh toán online (Stripe Checkout)

- **Method**: POST
- **URL**: `http://localhost:5000/api/order/new/online`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
  - `Content-Type: application/json`
- **Body** (JSON): Giống COD — `method` (ví dụ `"Online"`), `phone`, `address`. Metadata gửi sang Stripe để dùng khi xác nhận thanh toán.

**Luồng xử lý (server)**:

1. Lấy giỏ hàng user, populate `product` (`title`, `price`, `images`).
2. Nếu giỏ trống → 400.
3. Tạo `line_items` cho Stripe: tiền tệ `vnd`, `unit_amount` = giá sản phẩm (số nguyên), ảnh đầu tiên (nếu có) đưa vào `product_data.images`.
4. Tạo Stripe Checkout Session (`mode: "payment"`, `payment_method_types: ["card"]`), `metadata`: `address`, `method`, `phone`, `subTotal`, `userId`; `success_url` trỏ về `{FRONTEND_URL}/order-processing?session_id={CHECKOUT_SESSION_ID}`; `cancel_url` về `{FRONTEND_URL}/cart`.
5. **Chưa** tạo Order, **chưa** trừ kho — chỉ trả URL thanh toán.

- **Response**:
  - 200 (thành công):

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

  - 400 (giỏ hàng trống): như mục 1.

**Biến môi trường** (máy chủ): `STRIPE_SECRET_KEY`, `FRONTEND_URL`.

---

## 3. Xác nhận thanh toán online (sau redirect từ Stripe)

- **Method**: POST
- **URL**: `http://localhost:5000/api/order/verify/payment?sessionId={CHECKOUT_SESSION_ID}`
- **Authorization**: Có (user phải là người đã đăng nhập khi tạo session; `sessionId` khớp phiên Stripe)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
- **Query**:
  - `sessionId` (string): ID phiên Stripe Checkout (cùng giá trị với query `session_id` trên `success_url`)

**Luồng xử lý (server)**:

1. `stripe.checkout.sessions.retrieve(sessionId)`.
2. Nếu `payment_status !== "paid"` → 400.
3. Nếu đã tồn tại Order có `paymentInfo === sessionId` → 400 (tránh tạo trùng).
4. Đọc `userId`, `method`, `phone`, `address` từ `session.metadata`; lấy giỏ theo `userId`.
5. Nếu giỏ trống → 400 (ví dụ đã xử lý trước đó).
6. Tạo Order (có `paidAt`, `paymentInfo: sessionId`, `phoneNumber` từ metadata), cập nhật `stock` / `sold`, xóa giỏ, gửi email xác nhận.

- **Response**:
  - 200 (thành công):

```json
{
  "message": "Thanh toán thành công",
  "order": { "...": "document Order mới tạo" }
}
```

  - 400:

```json
{ "message": "Thanh toán chưa hoàn tất" }
```

```json
{ "message": "Đơn hàng đã tồn tại" }
```

```json
{ "message": "Giỏ hàng trống" }
```

---

## 4. Lấy danh sách đơn hàng của user hiện tại

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

## 5. Lấy tất cả đơn hàng (admin)

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

## 6. Thống kê đơn hàng (admin)

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

## 7. Chi tiết một đơn hàng theo ID

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

## 8. Cập nhật trạng thái đơn hàng (admin)

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

---

## 9. Thống kê chi tiêu của người dùng (User hiện tại)

- **Method**: GET
- **URL**: `http://localhost:5000/api/order/spending/stats`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`

- **Response**:
  - 200 (thành công): Trả về thống kê tổng hợp của người dùng đang đăng nhập.

```json
{
  "monthlySpending": [
    { "month": "2024-01", "amount": 500000 },
    { "month": "2024-02", "amount": 750000 }
  ],
  "statusCounts": {
    "pending": 2,
    "completed": 5,
    "cancelled": 1
  },
  "topProducts": [
    {
      "name": "Tên sản phẩm",
      "quantity": 10,
      "totalSpent": 1000000
    }
  ],
  "totalOrders": 8,
  "totalSpent": 1250000
}
```

- **Chi tiết các trường**:
  - `monthlySpending`: Danh sách chi tiêu theo từng tháng (YYYY-MM).
  - `statusCounts`: Số lượng đơn hàng theo từng trạng thái.
  - `topProducts`: Top 5 sản phẩm được mua nhiều nhất của người dùng này (được chọn dựa trên số lượng mua).
  - `totalOrders`: Tổng số đơn hàng đã đặt.
  - `totalSpent`: Tổng số tiền đã chi tiêu (tính theo `subTotal`).

---

## Ghi chú chung

- **Đăng ký route** (`index.js`): `app.use("/api/order", orderRoutes)` — toàn bộ endpoint đặt hàng nằm dưới prefix `/api/order`.
- **Thứ tự route** (`routes/order.js`): Các đường dẫn cố định (`/new/cod`, `/new/online`, `/verify/payment`, `/all`, `/admin/all`, `/stats`, `/spending/stats`) khai báo **trước** `GET /:id` và `POST /:id` để không bị khớp nhầm `id`.
- **Xác thực**: Mọi route order dùng `isAuth` — JWT trong `Authorization: Bearer ...`. Email xác nhận COD lấy từ `req.user.email`; sau thanh toán online, email lấy từ user populate trên đơn.
- **COD vs Online**: COD tạo đơn và trừ kho ngay tại `POST /new/cod`. Online chỉ tạo phiên Stripe tại `POST /new/online`; đơn và trừ kho xảy ra tại `POST /verify/payment` khi thanh toán thành công.
- **Nguồn dữ liệu khi tạo đơn**: Sản phẩm và số lượng lấy từ **giỏ hàng**, không gửi `items` trong body.
- **Stripe** (`controllers/order.js`): `Stripe` khởi tạo với `process.env.STRIPE_SECRET_KEY`.
- **Email xác nhận** (`utils/sendOrderConfirmation.js`): Nodemailer, SMTP Gmail (`smtp.gmail.com`, cổng 465, SSL). Biến môi trường: `EMAIL`, `EMAIL_PASSWORD`. Trong controller, gửi mail **không** `await` — response HTTP có thể trả về trước khi email gửi xong.

**Controller**: `controllers/order.js` — `getAllOrders`, `getOrdersAdmin`, `getMyOrder`, `updateStatus`, `getStats`, `getUserSpendingStats`, `newOrderCOD`, `newOrderOnline`, `verifyPayment`.  
**Routes**: `routes/order.js`.
