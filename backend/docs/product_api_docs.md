# Product API – Tài liệu Postman

**Base URL**: `http://localhost:5000`  
**Prefix**: `/api/product`

---

## 1. Tạo sản phẩm mới

- **Method**: POST
- **URL**: `http://localhost:5000/api/product/new`
- **Authorization**: Có (yêu cầu đăng nhập và có quyền admin)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
  - `Content-Type: multipart/form-data`
- **Body** (form-data):
  - `title` (text): Tên sản phẩm
  - `about` (text): Mô tả sản phẩm
  - `category` (text): Danh mục sản phẩm
  - `price` (text): Giá sản phẩm (số)
  - `stock` (text): Số lượng tồn kho (số)
  - `files` (file): Hình ảnh sản phẩm (có thể gửi nhiều file)

- **Response**:
  - 201 (thành công):

```json
{
  "message": "Tạo sản phẩm thành công",
  "product": {
    "_id": "...",
    "title": "Tên sản phẩm",
    "about": "Mô tả sản phẩm",
    "category": "danh_muc",
    "price": 100000,
    "stock": 50,
    "sold": 0,
    "images": [
      {
        "id": "public_id",
        "url": "https://res.cloudinary.com/..."
      }
    ],
    "createdAt": "..."
  }
}
```

  - 400 (không có file):

```json
{
  "message": "Không có file để tải lên"
}
```

  - 401 (không phải admin):

```json
{
  "message": "Bạn không phải là quản trị viên"
}
```

  - 403 (không có token):

```json
{
  "message": "Vui lòng đăng nhập"
}
```

---

## 2. Lấy danh sách sản phẩm

- **Method**: GET
- **URL**: `http://localhost:5000/api/product/all`
- **Authorization**: Không
- **Query Parameters** (tùy chọn):
  - `search` (string): Tìm kiếm theo tên sản phẩm
  - `category` (string): Lọc theo danh mục
  - `page` (number): Số trang (mặc định: 1, mỗi trang 8 sản phẩm)
  - `sortByPrice` (string): Sắp xếp theo giá (`lowToHigh` hoặc `highToLow`)

- **Response**:
  - 200 (thành công):

```json
{
  "products": [
    {
      "_id": "...",
      "title": "Tên sản phẩm",
      "about": "Mô tả sản phẩm",
      "category": "danh_muc",
      "price": 100000,
      "stock": 50,
      "sold": 0,
      "images": [
        {
          "id": "public_id",
          "url": "https://res.cloudinary.com/..."
        }
      ],
      "createdAt": "..."
    }
  ],
  "categories": ["danh_muc_1", "danh_muc_2"],
  "total_pages": 5,
  "new_products": [
    {
      "_id": "...",
      "title": "Sản phẩm mới nhất",
      "price": 150000,
      "images": [...]
    }
  ]
}
```

---

## 3. Lấy chi tiết sản phẩm

- **Method**: GET
- **URL**: `http://localhost:5000/api/product/{id}`
- **Authorization**: Không
- **Path Parameters**:
  - `id` (string): ID của sản phẩm

- **Response**:
  - 200 (thành công):

```json
{
  "product": {
    "_id": "...",
    "title": "Tên sản phẩm",
    "about": "Mô tả sản phẩm",
    "category": "danh_muc",
    "price": 100000,
    "stock": 50,
    "sold": 0,
    "images": [
      {
        "id": "public_id",
        "url": "https://res.cloudinary.com/..."
      }
    ],
    "createdAt": "..."
  },
  "relatedProduct": [
    {
      "_id": "...",
      "title": "Sản phẩm liên quan",
      "price": 120000,
      "images": [...]
    }
  ]
}
```

  - 404 (không tìm thấy):

```json
{
  "message": "Không tìm thấy sản phẩm"
}
```

---

## 4. Cập nhật sản phẩm

- **Method**: PUT
- **URL**: `http://localhost:5000/api/product/{id}`
- **Authorization**: Có (yêu cầu đăng nhập và có quyền admin)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
  - `Content-Type: application/json`
- **Path Parameters**:
  - `id` (string): ID của sản phẩm cần cập nhật
- **Body** (JSON, tất cả đều tùy chọn):
  - `title` (string): Tên sản phẩm mới
  - `about` (string): Mô tả sản phẩm mới
  - `stock` (number): Số lượng tồn kho mới
  - `price` (number): Giá sản phẩm mới
  - `category` (string): Danh mục sản phẩm mới

- **Response**:
  - 200 (thành công):

```json
{
  "message": "Cập nhật sản phẩm thành công",
  "product": {
    "_id": "...",
    "title": "Tên sản phẩm đã cập nhật",
    "about": "Mô tả mới",
    "category": "danh_muc_moi",
    "price": 150000,
    "stock": 100,
    "sold": 0,
    "images": [...],
    "createdAt": "..."
  }
}
```

  - 401 (không phải admin):

```json
{
  "message": "Bạn không phải là quản trị viên"
}
```

  - 404 (không tìm thấy):

```json
{
  "message": "Không tìm thấy sản phẩm"
}
```

---

## 5. Cập nhật hình ảnh sản phẩm

- **Method**: POST
- **URL**: `http://localhost:5000/api/product/product-image/{id}`
- **Authorization**: Có (yêu cầu đăng nhập và có quyền admin)
- **Headers**:
  - `Authorization: Bearer {JWT_TOKEN}`
  - `Content-Type: multipart/form-data`
- **Path Parameters**:
  - `id` (string): ID của sản phẩm cần cập nhật hình ảnh
- **Body** (form-data):
  - `files` (file): Hình ảnh sản phẩm mới (có thể gửi nhiều file, sẽ thay thế toàn bộ hình ảnh cũ)

- **Response**:
  - 200 (thành công):

```json
{
  "message": "Image Updated",
  "product": {
    "_id": "...",
    "title": "Tên sản phẩm",
    "images": [
      {
        "id": "public_id_moi",
        "url": "https://res.cloudinary.com/..."
      }
    ],
    "createdAt": "..."
  }
}
```

  - 400 (không có file):

```json
{
  "message": "Không có file để tải lên"
}
```

  - 401 (không phải admin):

```json
{
  "message": "Bạn không phải là quản trị viên"
}
```

  - 404 (không tìm thấy):

```json
{
  "message": "Không tìm thấy sản phẩm"
}
```

---

## Ghi chú chung

- **Phân trang**: Mỗi trang hiển thị 8 sản phẩm. Sử dụng query param `page` để điều hướng.
- **Tìm kiếm**: Tìm kiếm không phân biệt chữ hoa/thường trong tiêu đề sản phẩm.
- **Sắp xếp**: Sử dụng `sortByPrice=lowToHigh` hoặc `sortByPrice=highToLow` để sắp xếp theo giá.
- **Hình ảnh**: Hình ảnh được lưu trữ trên Cloudinary.
- **Quyền admin**: Chỉ người dùng có `role: "admin"` mới có thể tạo sản phẩm.
