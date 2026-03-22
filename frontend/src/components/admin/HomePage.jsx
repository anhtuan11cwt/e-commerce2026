import axios from "axios";
import Cookies from "js-cookie";
import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Loading } from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SERVER_URL, useProductData } from "@/context/productContext.js";

const categoriesList = [
  "Điện thoại",
  "Laptop",
  "Máy tính bảng",
  "Phụ kiện",
  "Đồng hồ",
  "Thời trang",
  "Gia dụng",
  "Khác",
];

function HomePage() {
  const { loading, nextPage, page, previousPage, products, totalPages } =
    useProductData();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    category: "",
    price: "",
    stock: "",
    title: "",
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Vui lòng chọn hình ảnh");
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("about", formData.about);
      form.append("category", formData.category);
      form.append("price", formData.price);
      form.append("stock", formData.stock);

      for (const image of images) {
        form.append("images", image);
      }

      const token = Cookies.get("token");
      await axios.post(`${SERVER_URL}/api/product/new`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Thêm sản phẩm thành công");
      setOpen(false);
      setFormData({
        about: "",
        category: "",
        price: "",
        stock: "",
        title: "",
      });
      setImages([]);
      window.location.reload();
    } catch (error) {
      const message =
        error?.response?.data?.message ?? "Thêm sản phẩm thất bại";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Tất cả sản phẩm</h2>
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin sản phẩm và tải lên ít nhất một hình ảnh.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  name="title"
                  onChange={handleChange}
                  placeholder="Nhập tên sản phẩm"
                  required
                  value={formData.title}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">Mô tả</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
                  id="about"
                  name="about"
                  onChange={handleChange}
                  placeholder="Nhập mô tả sản phẩm"
                  required
                  value={formData.about}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30"
                  id="category"
                  name="category"
                  onChange={handleChange}
                  required
                  value={formData.category}
                >
                  <option value="">Chọn danh mục</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VNĐ)</Label>
                  <Input
                    id="price"
                    min="0"
                    name="price"
                    onChange={handleChange}
                    placeholder="0"
                    required
                    type="number"
                    value={formData.price}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Số lượng</Label>
                  <Input
                    id="stock"
                    min="0"
                    name="stock"
                    onChange={handleChange}
                    placeholder="0"
                    required
                    type="number"
                    value={formData.stock}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Hình ảnh</Label>
                <Input
                  accept="image/*"
                  id="images"
                  multiple
                  onChange={handleFileChange}
                  type="file"
                />
              </div>
              <DialogFooter>
                <Button
                  disabled={submitting}
                  onClick={() => setOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button disabled={submitting} type="submit">
                  {submitting ? "Đang thêm..." : "Thêm sản phẩm"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Grid */}
      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p>Chưa có sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product._id} latest="no" product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={
                  page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={previousPage}
                text="Trước"
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-3 py-2 text-muted-foreground text-sm">
                Trang {page} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                onClick={nextPage}
                text="Sau"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default HomePage;
