import axios from "axios";
import Cookies from "js-cookie";
import { ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SERVER_URL } from "@/context/cartContext.js";
import { format_vnd } from "@/utils/format_vnd";

const statusMap = {
  cancelled: { className: "bg-red-500 text-white", label: "Đã hủy" },
  delivered: { className: "bg-green-500 text-white", label: "Đã giao" },
  pending: { className: "bg-yellow-500 text-white", label: "Chờ xử lý" },
  processing: { className: "bg-blue-500 text-white", label: "Đang xử lý" },
  shipped: { className: "bg-purple-500 text-white", label: "Đang giao" },
};

const statusOptions = [
  { label: "Chờ xử lý", value: "pending" },
  { label: "Đang xử lý", value: "processing" },
  { label: "Đang giao", value: "shipped" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
];

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${SERVER_URL}/api/order/admin/all`, {
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

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${SERVER_URL}/api/order/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Cập nhật trạng thái thành công");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 font-bold text-xl">Chưa có đơn hàng</h2>
        <p className="text-muted-foreground text-sm">
          Chưa có đơn hàng nào trong hệ thống
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-2xl">Quản lý đơn hàng ({orders.length})</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
          const status = statusMap[order.status] || statusMap.pending;
          return (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-mono text-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Khách hàng</span>
                  <span className="font-medium truncate">
                    {order.user?.name || order.user?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số sản phẩm</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tổng tiền</span>
                  <span className="font-bold text-primary">
                    {format_vnd(order.subTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Thanh toán</span>
                  <span>{order.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ngày đặt</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-2">
                <select
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  value={order.status}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersPage;
