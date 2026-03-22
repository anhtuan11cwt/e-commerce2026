import axios from "axios";
import jsCookie from "js-cookie";
import { CreditCard, Loader2, MapPin, Truck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SERVER_URL, useCartData } from "@/context/cartContext.js";
import { format_vnd } from "@/utils/format_vnd";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, subtotal, fetchCart } = useCartData();

  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const token = jsCookie.get("token");

  const fetchAddress = useCallback(async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddress(data);
    } catch {
      toast.error("Không thể tải thông tin địa chỉ");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const paymentHandler = async () => {
    if (!address || !method) return;
    setBtnLoading(true);

    if (method === "COD") {
      try {
        const { data } = await axios.post(
          `${SERVER_URL}/api/order/new/cod`,
          {
            address: id,
            method,
            phone: address.phoneNumber,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success(data.message);
        fetchCart();
        navigate("/orders");
      } catch (error) {
        toast.error(error.response?.data?.message || "Đặt hàng thất bại");
      } finally {
        setBtnLoading(false);
      }
    } else if (method === "Online") {
      try {
        const { data } = await axios.post(
          `${SERVER_URL}/api/order/new/online`,
          {
            address: id,
            method,
            phone: address.phoneNumber,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        window.location.href = data.url;
      } catch {
        toast.error("Không thể tạo phiên thanh toán");
        setBtnLoading(false);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="mb-8 font-bold text-2xl tracking-tight sm:text-3xl">
        Thanh toán
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Shipping Address */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg">
              <MapPin className="h-5 w-5" />
              Địa chỉ giao hàng
            </h2>
            {address ? (
              <div className="space-y-2">
                <p className="font-medium">{address.address}</p>
                <p className="text-muted-foreground text-sm">
                  Số điện thoại: {address.phoneNumber}
                </p>
              </div>
            ) : (
              <p className="text-destructive text-sm">Không tìm thấy địa chỉ</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-lg">
              <CreditCard className="h-5 w-5" />
              Phương thức thanh toán
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  method === "Online"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setMethod("Online")}
                type="button"
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    method === "Online"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Thanh toán trực tuyến</p>
                  <p className="text-muted-foreground text-xs">
                    Thẻ tín dụng / ghi nợ qua Stripe
                  </p>
                </div>
              </button>

              <button
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  method === "COD"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setMethod("COD")}
                type="button"
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    method === "COD"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Truck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Thanh toán khi nhận</p>
                  <p className="text-muted-foreground text-xs">
                    Trả tiền mặt khi nhận hàng (COD)
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 font-semibold text-lg">Sản phẩm</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div className="flex items-center gap-4" key={item._id}>
                  <img
                    alt={item.product.title}
                    className="h-16 w-16 rounded-lg bg-muted object-contain p-1"
                    loading="lazy"
                    src={item.product.images?.[0]?.url}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.quantity} × {format_vnd(item.product.price)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {format_vnd(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="self-start rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-xl">Tóm tắt đơn hàng</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tổng sản phẩm</span>
              <span className="font-medium">{cart.length}</span>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="font-medium text-base">Tổng cộng</span>
              <span className="font-bold text-lg">{format_vnd(subtotal)}</span>
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            disabled={!address || cart.length === 0 || !method || btnLoading}
            onClick={paymentHandler}
            size="lg"
          >
            {btnLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : method === "COD" ? (
              "Đặt hàng"
            ) : (
              "Thanh toán"
            )}
          </Button>

          {!method && (
            <p className="mt-2 text-center text-muted-foreground text-xs">
              Vui lòng chọn phương thức thanh toán
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payment;
