import axios from "axios";
import jsCookie from "js-cookie";
import { ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="mb-8 font-bold text-2xl tracking-tight sm:text-3xl">
        Đơn hàng của tôi
      </h1>

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
                  <span className="text-muted-foreground">Ngày đặt</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => navigate(`/order/${order._id}`)}
                  variant="outline"
                >
                  Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
