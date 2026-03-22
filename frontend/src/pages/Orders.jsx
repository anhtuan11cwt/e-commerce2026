import axios from "axios";
import jsCookie from "js-cookie";
import { Package, ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { SERVER_URL } from "@/context/cartContext.js";
import { format_vnd } from "@/utils/format_vnd";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const token = jsCookie.get("token");
      const { data } = await axios.get(`${SERVER_URL}/api/order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 font-bold text-2xl">Chưa có đơn hàng</h1>
        <p className="mb-6 text-center text-muted-foreground">
          Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!
        </p>
        <Button onClick={() => navigate("/products")} size="lg">
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  const statusMap = {
    cancelled: { color: "bg-red-500", label: "Đã hủy" },
    delivered: { color: "bg-green-500", label: "Đã giao" },
    pending: { color: "bg-yellow-500", label: "Chờ xử lý" },
    processing: { color: "bg-blue-500", label: "Đang xử lý" },
    shipped: { color: "bg-purple-500", label: "Đang giao" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="mb-8 font-bold text-2xl tracking-tight sm:text-3xl">
        Đơn hàng của tôi
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusMap[order.status] || statusMap.pending;
          return (
            <div className="rounded-xl border bg-card p-6" key={order._id}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      Đơn hàng #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-white text-xs ${status.color}`}
                  >
                    {status.label}
                  </span>
                  <span className="font-bold text-sm">
                    {format_vnd(order.subTotal)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-muted-foreground text-xs">
                <span>{order.items.length} sản phẩm</span>
                <span>•</span>
                <span>
                  {order.method === "COD"
                    ? "Thanh toán khi nhận"
                    : "Đã thanh toán"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
