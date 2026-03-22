import axios from "axios";
import jsCookie from "js-cookie";
import { AlertCircle, Printer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SERVER_URL } from "@/context/cartContext.js";
import { format_vnd } from "@/utils/format_vnd";

const statusMap = {
  cancelled: { className: "bg-red-500 text-white", label: "Đã hủy" },
  delivered: { className: "bg-green-500 text-white", label: "Đã giao" },
  pending: { className: "bg-yellow-500 text-white", label: "Chờ xử lý" },
  processing: { className: "bg-blue-500 text-white", label: "Đang xử lý" },
  shipped: { className: "bg-purple-500 text-white", label: "Đang giao" },
};

function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const token = jsCookie.get("token");
      const { data } = await axios.get(`${SERVER_URL}/api/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(data);
    } catch {
      toast.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24">
        <AlertCircle className="mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-2 font-bold text-2xl">Không tìm thấy đơn hàng</h1>
        <p className="mb-6 text-muted-foreground">
          Đơn hàng không tồn tại hoặc đã bị xóa.
        </p>
        <Button onClick={() => navigate("/products")} size="lg">
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  const status = statusMap[order.status] || statusMap.pending;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
            Chi tiết đơn hàng
          </h1>
          <p className="mt-1 font-mono text-muted-foreground text-sm">
            #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>
        <Button onClick={() => window.print()} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          In đơn hàng
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Order Summary + Shipping */}
        <div className="space-y-6 lg:col-span-1">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái</span>
                <Badge className={status.className}>{status.label}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thanh toán</span>
                <span className="font-medium">
                  {order.method === "COD"
                    ? "COD (Khi nhận hàng)"
                    : "Đã thanh toán online"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng tiền</span>
                <span className="font-bold text-primary">
                  {format_vnd(order.subTotal)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày đặt</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {order.paidAt && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Ngày thanh toán
                    </span>
                    <span>
                      {order.method === "COD"
                        ? "Thanh toán khi nhận"
                        : new Date(order.paidAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Điện thoại</span>
                <span className="font-medium">{order.phoneNumber || "—"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Địa chỉ</span>
                <span className="max-w-[200px] text-right font-medium">
                  {order.address || "—"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">
                  {order.user?.email || "Khách vãng lai"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Items List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Sản phẩm ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={item._id || index}>
                  <div className="flex gap-4">
                    <Link
                      className="shrink-0"
                      to={`/product/${item.product?._id || item.product}`}
                    >
                      <img
                        alt={item.product?.title || "Sản phẩm"}
                        className="h-20 w-20 rounded-lg bg-muted object-contain p-2"
                        loading="lazy"
                        src={item.product?.images?.[0]?.url}
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          className="font-medium text-sm hover:underline"
                          to={`/product/${item.product?._id || item.product}`}
                        >
                          {item.product?.title || "Sản phẩm"}
                        </Link>
                        <p className="text-muted-foreground text-xs">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-sm text-primary">
                        {format_vnd(item.price)}
                      </p>
                    </div>
                  </div>
                  {index < order.items.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
