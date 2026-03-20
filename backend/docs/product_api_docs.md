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

## Ghi chú chung

- **Phân trang**: Mỗi trang hiển thị 8 sản phẩm. Sử dụng query param `page` để điều hướng.
- **Tìm kiếm**: Tìm kiếm không phân biệt chữ hoa/thường trong tiêu đề sản phẩm.
- **Sắp xếp**: Sử dụng `sortByPrice=lowToHigh` hoặc `sortByPrice=highToLow` để sắp xếp theo giá.
- **Hình ảnh**: Hình ảnh được lưu trữ trên Cloudinary.
- **Quyền admin**: Chỉ người dùng có `role: "admin"` mới có thể tạo sản phẩm.
