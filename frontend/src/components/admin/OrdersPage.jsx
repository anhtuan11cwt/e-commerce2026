import axios from "axios";
import Cookies from "js-cookie";
import { Search, ShoppingBag } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [search, setSearch] = useState("");
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

  const updateOrderStatus = async (orderId, newStatus) => {
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

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();
    const email = order.user?.email?.toLowerCase() || "";
    const id = order._id.toLowerCase();
    return email.includes(keyword) || id.includes(keyword);
  });

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-2xl">
          Quản lý đơn hàng ({orders.length})
        </h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo Email hoặc ID..."
            value={search}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  className="py-8 text-center text-muted-foreground"
                  colSpan={6}
                >
                  Không tìm thấy đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const status = statusMap[order.status] || statusMap.pending;
                return (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Link
                        className="font-mono text-primary text-sm hover:underline"
                        to={`/order/${order._id}`}
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {order.user?.email || "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {format_vnd(order.subTotal)}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.className}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {moment(order.createdAt).format("DD-MMM-YYYY")}
                    </TableCell>
                    <TableCell className="text-right">
                      <select
                        className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        value={order.status}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {search && (
        <p className="text-muted-foreground text-sm">
          Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
        </p>
      )}
    </div>
  );
}

export default OrdersPage;
