import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartData } from "@/context/cartContext.js";
import { format_vnd } from "@/utils/format_vnd";

function Cart() {
  const navigate = useNavigate();
  const { cart, totalItem, subtotal, updateCart, removeFromCart } =
    useCartData();

  const handleUpdateQuantity = async (action, id) => {
    try {
      await updateCart(action, id);
    } catch {
      toast.error("Cập nhật số lượng thất bại");
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
    } catch {
      toast.error("Xóa sản phẩm thất bại");
    }
  };

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 font-bold text-2xl">Giỏ hàng trống</h1>
        <p className="mb-6 text-center text-muted-foreground">
          Bạn chưa có sản phẩm nào trong giỏ hàng.
        </p>
        <Button onClick={() => navigate("/products")} size="lg">
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="mb-8 font-bold text-2xl tracking-tight sm:text-3xl">
        Giỏ hàng
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <div
              className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center"
              key={item._id}
            >
              {/* Product Image */}
              <Link className="shrink-0" to={`/product/${item.product._id}`}>
                <img
                  alt={item.product.title}
                  className="h-24 w-24 rounded-lg bg-muted object-contain p-2 sm:h-28 sm:w-28"
                  loading="lazy"
                  src={item.product.images?.[0]?.url}
                />
              </Link>

              {/* Product Info */}
              <div className="flex flex-1 flex-col gap-2">
                <Link
                  className="font-semibold text-base hover:underline sm:text-lg"
                  to={`/product/${item.product._id}`}
                >
                  {item.product.title}
                </Link>
                <p className="font-bold text-lg text-primary">
                  {format_vnd(item.product.price)}
                </p>

                {/* Quantity Controls & Remove */}
                <div className="mt-1 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border">
                    <Button
                      className="h-9 rounded-r-none"
                      disabled={item.quantity <= 1}
                      onClick={() => handleUpdateQuantity("DEC", item._id)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="flex h-9 w-10 items-center justify-center font-medium text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      className="h-9 rounded-l-none"
                      disabled={item.quantity >= item.product.stock}
                      onClick={() => handleUpdateQuantity("INC", item._id)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleRemove(item._id)}
                    size="icon-sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Xóa sản phẩm</span>
                  </Button>
                </div>
              </div>

              {/* Line total */}
              <div className="shrink-0 text-right">
                <p className="font-bold text-base sm:text-lg">
                  {format_vnd(item.product.price * item.quantity)}
                </p>
                <p className="text-muted-foreground text-xs">
                  {item.quantity} × {format_vnd(item.product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="self-start rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-xl">Tóm tắt đơn hàng</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tổng sản phẩm</span>
              <span className="font-medium">{totalItem}</span>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="font-medium text-base">Tổng cộng</span>
              <span className="font-bold text-lg">{format_vnd(subtotal)}</span>
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            disabled={cart.length === 0}
            onClick={() => navigate("/checkout")}
            size="lg"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
