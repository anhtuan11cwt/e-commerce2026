# Cart API – Tài liệu Postman

**Base URL**: `http://localhost:5000`  
**Prefix**: `/api/cart`

---

## 1. Thêm sản phẩm vào giỏ hàng

- **Method**: POST
- **URL**: `http://localhost:5000/api/cart/add`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
  - `Content-Type: application/json`
- **Body** (JSON):
  - `product` (string): ID của sản phẩm cần thêm

- **Response**:
  - 201 (thêm mới thành công):

```json
{
  "message": "Đã thêm vào giỏ hàng"
}
```

  - 200 (tăng số lượng thành công):

```json
{
  "message": "Đã thêm vào giỏ hàng"
}
```

  - 400 (hết hàng):

```json
{
  "message": "Hết hàng"
}
```

  - 404 (không tìm thấy sản phẩm):

```json
{
  "message": "Không tìm thấy sản phẩm"
}
```

  - 403 (không có token):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

---

## 2. Lấy danh sách giỏ hàng

- **Method**: GET
- **URL**: `http://localhost:5000/api/cart/all`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`

- **Response**:
  - 200 (thành công):

```json
{
  "cart": [
    {
      "_id": "...",
      "product": {
        "_id": "...",
        "title": "Tên sản phẩm",
        "about": "Mô tả sản phẩm",
        "category": "danh_muc",
        "price": 100000,
        "stock": 50,
        "images": [
          {
            "id": "public_id",
            "url": "https://res.cloudinary.com/..."
          }
        ]
      },
      "quantity": 2,
      "user": "..."
    }
  ],
  "subTotal": 200000,
  "sumOfQuantity": 2
}
```

  - 403 (không có token):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

---

## 3. Xóa sản phẩm khỏi giỏ hàng

- **Method**: GET
- **URL**: `http://localhost:5000/api/cart/remove/{id}`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
- **Path Parameters**:
  - `id` (string): ID của mục giỏ hàng cần xóa (là `_id` của cart, không phải product ID)

- **Response**:
  - 200 (thành công):

```json
{
  "message": "Đã xóa khỏi giỏ hàng"
}
```

  - 403 (không có token):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

---

## 4. Cập nhật số lượng sản phẩm trong giỏ hàng

- **Method**: POST
- **URL**: `http://localhost:5000/api/cart/update?action={ACTION}`
- **Authorization**: Có (yêu cầu đăng nhập)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
  - `Content-Type: application/json`
- **Query Parameters**:
  - `action` (string): Hành động cần thực hiện
    - `INC`: Tăng số lượng lên 1
    - `DEC`: Giảm số lượng xuống 1
- **Body** (JSON):
  - `id` (string): ID của mục giỏ hàng cần cập nhật

- **Response** (tăng số lượng - INC):
  - 200 (thành công):

```json
{
  "message": "Đã cập nhật giỏ hàng"
}
```

  - 400 (hết hàng):

```json
{
  "message": "Hết hàng"
}
```

- **Response** (giảm số lượng - DEC):
  - 200 (thành công):

```json
{
  "message": "Đã cập nhật giỏ hàng"
}
```

  - 400 (không thể giảm):

```json
{
  "message": "Bạn chỉ có 1 sản phẩm, không thể giảm thêm"
}
```

  - 400 (hành động không hợp lệ):

```json
{
  "message": "Hành động không hợp lệ"
}
```

  - 403 (không có token):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

---

## Ghi chú chung

- **Xác thực**: Tất cả các endpoint giỏ hàng đều yêu cầu đăng nhập (JWT token).
- **Cart ID vs Product ID**: Khi xóa hoặc cập nhật giỏ hàng, sử dụng `_id` của document Cart (cart item ID), không phải product ID.
- **Kiểm tra tồn kho**: Hệ thống tự động kiểm tra số lượng tồn kho trước khi thêm hoặc tăng số lượng.
- **Giới hạn giảm**: Không thể giảm số lượng xuống dưới 1, cần xóa sản phẩm nếu muốn loại bỏ hoàn toàn.
- **subTotal**: Tổng tiền được tính tự động dựa trên `price × quantity` của từng sản phẩm.
- **sumOfQuantity**: Tổng số lượng tất cả các mục trong giỏ hàng.
