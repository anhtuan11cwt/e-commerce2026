import axios from "axios";
import Cookies from "js-cookie";
import {
  AlertCircle,
  Minus,
  Pencil,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loading } from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartData } from "@/context/cartContext";
import { SERVER_URL, useProductData } from "@/context/productContext";
import { useUserData } from "@/context/userContext";
import { format_vnd } from "@/utils/format_vnd";

function ProductPage() {
  const { id } = useParams();
  const { isAuth, user } = useUserData();
  const { fetchProduct, product, productLoading, relatedProduct } =
    useProductData();
  const { addToCart } = useCartData();

  const [quantity, setQuantity] = useState(1);
  const [btnLoading, setBtnLoading] = useState(false);

  // Admin update state
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [updateBtnLoading, setUpdateBtnLoading] = useState(false);
  const [updatedImages, setUpdatedImages] = useState(null);

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

  const updateHandler = () => {
    setShow(!show);
    if (product) {
      setTitle(product.title || "");
      setAbout(product.about || "");
      setStock(String(product.stock || ""));
      setPrice(String(product.price || ""));
      setCategory(product.category || "");
    }
  };

  const submitHandler = async () => {
    setUpdateBtnLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.put(
        `${SERVER_URL}/api/product/${id}`,
        { about, category, price: Number(price), stock: Number(stock), title },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Cập nhật sản phẩm thành công");
      fetchProduct(id);
      setShow(false);
    } catch (error) {
      const message =
        error?.response?.data?.message ?? "Cập nhật sản phẩm thất bại";
      toast.error(message);
    } finally {
      setUpdateBtnLoading(false);
    }
  };

  const handleSubmitImage = async () => {
    if (!updatedImages || updatedImages.length === 0) {
      toast.error("Vui lòng chọn hình ảnh mới");
      return;
    }

    setUpdateBtnLoading(true);
    try {
      const formData = new FormData();
      for (const image of updatedImages) {
        formData.append("files", image);
      }

      const token = Cookies.get("token");
      await axios.post(
        `${SERVER_URL}/api/product/product-image/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Cập nhật hình ảnh thành công");
      fetchProduct(id);
      setUpdatedImages(null);
    } catch (error) {
      const message =
        error?.response?.data?.message ?? "Cập nhật hình ảnh thất bại";
      toast.error(message);
    } finally {
      setUpdateBtnLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: 0 });
    fetchProduct(id);
    setQuantity(1);
  }, [id, fetchProduct]);

  if (productLoading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 font-bold text-2xl">Không tìm thấy sản phẩm</h1>
        <p className="mb-6 text-muted-foreground">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <Link to="/products">Quay lại cửa hàng</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuth) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    setBtnLoading(true);
    try {
      const data = await addToCart(product._id, quantity);
      toast.success(data.message || "Đã thêm vào giỏ hàng");
      setQuantity(1);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Thêm vào giỏ hàng thất bại";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Đường dẫn */}
      <nav className="mb-6 text-muted-foreground text-sm">
        <Link className="hover:text-foreground hover:underline" to="/">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link className="hover:text-foreground hover:underline" to="/products">
          Sản phẩm
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* Chi tiết sản phẩm */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-14">
        {/* Băng chuyển ảnh */}
        <div className="flex w-full justify-center lg:w-1/2">
          {product.images && product.images.length > 0 ? (
            <Carousel className="w-full max-w-[290px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-full">
              <CarouselContent>
                {product.images.map((img, index) => (
                  <CarouselItem key={img.id || index}>
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-muted">
                      <img
                        alt={`${product.title} - Hình ${index + 1}`}
                        className="h-full w-full object-contain p-6"
                        loading="lazy"
                        src={img.url}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {product.images.length > 1 && (
                <>
                  <CarouselPrevious className="-left-4 sm:-left-6" />
                  <CarouselNext className="-right-4 sm:-right-6" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="flex aspect-square w-full max-w-[500px] items-center justify-center rounded-xl bg-muted">
              <p className="text-muted-foreground">Không có hình ảnh</p>
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex w-full flex-col gap-5 lg:w-1/2">
          <div>
            <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
              {product.title}
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Danh mục:{" "}
              <span className="text-foreground">{product.category}</span>
            </p>
          </div>

          <div className="font-bold text-3xl text-primary">
            {format_vnd(product.price)}
          </div>

          <div className="h-px bg-border" />

          <div>
            <h2 className="mb-2 font-semibold text-lg">Mô tả</h2>
            <p className="leading-relaxed text-muted-foreground">
              {product.about}
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Tình trạng tồn kho */}
          <div>
            {product.stock <= 0 ? (
              <div className="flex items-center gap-2 font-semibold text-destructive">
                <AlertCircle className="h-5 w-5" />
                Hết hàng
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Còn lại:{" "}
                <span className="font-medium text-foreground">
                  {product.stock} sản phẩm
                </span>
              </p>
            )}
          </div>

          {/* Chọn số lượng và thêm vào giỏ */}
          {user?.role !== "admin" && product.stock > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-lg border">
                <Button
                  className="h-11 rounded-r-none"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  size="icon"
                  variant="ghost"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="flex h-11 w-12 items-center justify-center font-medium text-sm">
                  {quantity}
                </span>
                <Button
                  className="h-11 rounded-l-none"
                  disabled={quantity >= product.stock}
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  size="icon"
                  variant="ghost"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                className="h-11 flex-1 sm:flex-none"
                disabled={btnLoading}
                onClick={handleAddToCart}
                size="lg"
              >
                {btnLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Đang thêm...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Thêm vào giỏ hàng
                  </span>
                )}
              </Button>
            </div>
          )}

          {user?.role !== "admin" && !isAuth && product.stock > 0 && (
            <p className="text-muted-foreground text-sm">
              Vui lòng{" "}
              <Link className="text-primary hover:underline" to="/login">
                đăng nhập
              </Link>{" "}
              để thêm sản phẩm vào giỏ hàng
            </p>
          )}

          {user?.role !== "admin" && product.stock <= 0 && !isAuth && (
            <p className="text-muted-foreground text-sm">
              Vui lòng{" "}
              <Link className="text-primary hover:underline" to="/login">
                đăng nhập
              </Link>{" "}
              để mua hàng
            </p>
          )}
        </div>
      </div>

      {/* Admin Edit Section */}
      {user?.role === "admin" && (
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Quản lý sản phẩm</h2>
            <Button
              onClick={updateHandler}
              size="sm"
              variant={show ? "destructive" : "outline"}
            >
              {show ? (
                <>
                  <X className="mr-1.5 h-4 w-4" />
                  Đóng
                </>
              ) : (
                <>
                  <Pencil className="mr-1.5 h-4 w-4" />
                  Chỉnh sửa
                </>
              )}
            </Button>
          </div>

          {show && (
            <div className="mt-6 space-y-6">
              {/* Text Update Form */}
              <div className="space-y-4">
                <h3 className="font-medium text-muted-foreground text-sm">
                  Cập nhật thông tin
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-title">Tiêu đề</Label>
                    <Input
                      id="admin-title"
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nhập tên sản phẩm"
                      value={title}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-about">Mô tả</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
                      id="admin-about"
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Nhập mô tả sản phẩm"
                      value={about}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-category">Danh mục</Label>
                    <select
                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30"
                      id="admin-category"
                      onChange={(e) => setCategory(e.target.value)}
                      value={category}
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
                    <div className="space-y-1.5">
                      <Label htmlFor="admin-price">Giá (VNĐ)</Label>
                      <Input
                        id="admin-price"
                        min="0"
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        type="number"
                        value={price}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="admin-stock">Số lượng</Label>
                      <Input
                        id="admin-stock"
                        min="0"
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="0"
                        type="number"
                        value={stock}
                      />
                    </div>
                  </div>
                </div>
                <Button disabled={updateBtnLoading} onClick={submitHandler}>
                  {updateBtnLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Đang cập nhật...
                    </span>
                  ) : (
                    "Cập nhật sản phẩm"
                  )}
                </Button>
              </div>

              {/* Image Update Form */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-medium text-muted-foreground text-sm">
                  Cập nhật hình ảnh
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-images">Chọn hình ảnh mới</Label>
                    <Input
                      accept="image/*"
                      id="admin-images"
                      multiple
                      onChange={(e) =>
                        setUpdatedImages(Array.from(e.target.files))
                      }
                      type="file"
                    />
                  </div>
                </div>
                <Button
                  disabled={updateBtnLoading}
                  onClick={handleSubmitImage}
                  variant="secondary"
                >
                  {updateBtnLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Đang cập nhật...
                    </span>
                  ) : (
                    "Cập nhật hình ảnh"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sản phẩm liên quan */}
      {relatedProduct && relatedProduct.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-bold text-xl tracking-tight">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProduct.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductPage;
