import axios from "axios";
import jsCookie from "js-cookie";
import {
  BarChart3,
  CreditCard,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SERVER_URL } from "@/context/cartContext.js";
import { format_vnd } from "@/utils/format_vnd";

const statusLabels = {
  cancelled: "Đã hủy",
  delivered: "Đã giao",
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đang giao",
};

const statusColors = {
  cancelled: "#ef4444",
  delivered: "#22c55e",
  pending: "#eab308",
  processing: "#3b82f6",
  shipped: "#a855f7",
};

function SpendingStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const token = jsCookie.get("token");
      const { data } = await axios.get(
        `${SERVER_URL}/api/order/spending/stats`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setStats(data);
    } catch {
      toast.error("Không thể tải thống kê chi tiêu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <Loading />;
  }

  if (!stats) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24">
        <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 font-bold text-2xl">Không có dữ liệu</h1>
        <p className="mb-6 text-center text-muted-foreground">
          Chưa có đơn hàng nào để thống kê.
        </p>
        <Button onClick={() => navigate("/products")} size="lg">
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  const statusData = Object.entries(stats.statusCounts).map(
    ([status, count]) => ({
      fill: statusColors[status] || "#6b7280",
      name: statusLabels[status] || status,
      value: count,
    }),
  );

  const monthlyData = stats.monthlySpending.map((item) => ({
    amount: item.amount,
    month: item.month,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
            Thống kê chi tiêu
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Tổng quan về lịch sử mua hàng của bạn
          </p>
        </div>
        <Button onClick={() => navigate("/orders")} variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Xem đơn hàng
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Tổng chi tiêu
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-primary">
              {format_vnd(stats.totalSpent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Tổng đơn hàng
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Trung bình/đơn
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {stats.totalOrders > 0
                ? format_vnd(Math.round(stats.totalSpent / stats.totalOrders))
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Spending Chart */}
        {monthlyData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Chi tiêu theo tháng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer height={300} width="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ bottom: 20, left: 10, right: 10, top: 10 }}
                >
                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: "var(--color-muted-foreground)",
                      fontSize: 12,
                    }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: "var(--color-muted-foreground)",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      value >= 1_000_000
                        ? `${(value / 1_000_000).toFixed(0)}tr`
                        : value >= 1_000
                          ? `${(value / 1_000).toFixed(0)}k`
                          : value
                    }
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        return (
                          <div
                            className="rounded-lg border p-3 shadow-lg"
                            style={{
                              backgroundColor: "var(--color-card)",
                              borderColor: "var(--color-border)",
                              color: "var(--color-card-foreground)",
                            }}
                          >
                            <p className="font-medium text-sm">
                              {payload[0].payload.month}
                            </p>
                            <p className="font-bold text-primary text-sm">
                              {format_vnd(payload[0].value)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="var(--color-primary)"
                    name="Chi tiêu"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Order Status Pie Chart */}
        {statusData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng theo trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer height={300} width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={statusData}
                    dataKey="value"
                    innerRadius={60}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={true}
                    outerRadius={100}
                  >
                    {statusData.map((entry) => (
                      <Cell fill={entry.fill} key={entry.name} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      color: "var(--color-card-foreground)",
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: "var(--color-card-foreground)" }}>
                        {value}
                      </span>
                    )}
                    verticalAlign="bottom"
                  />
                  <text
                    fill="var(--color-card-foreground)"
                    fontSize={14}
                    textAnchor="middle"
                    x="50%"
                    y="50%"
                  >
                    <tspan dy="-6" x="50%">
                      {stats.totalOrders}
                    </tspan>
                    <tspan
                      dy="20"
                      fill="var(--color-muted-foreground)"
                      fontSize={12}
                      x="50%"
                    >
                      Đơn hàng
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Products */}
      {stats.topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sản phẩm mua nhiều nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.name}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {product.quantity} sản phẩm
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-primary text-sm">
                      {format_vnd(product.totalSpent)}
                    </span>
                  </div>
                  {index < stats.topProducts.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SpendingStats;
