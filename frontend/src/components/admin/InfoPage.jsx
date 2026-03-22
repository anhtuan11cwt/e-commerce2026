import axios from "axios";
import Cookies from "js-cookie";
import {
  BarChart3,
  CreditCard,
  Package,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Loading } from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVER_URL } from "@/context/cartContext.js";

function InfoPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${SERVER_URL}/api/order/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data);
    } catch {
      toast.error("Không thể tải thống kê");
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
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Không có dữ liệu thống kê</p>
      </div>
    );
  }

  const totalSold =
    stats.data?.reduce((sum, item) => sum + (item.sold || 0), 0) || 0;
  const totalOrders = (stats.codCount || 0) + (stats.onlineCount || 0);

  const paymentData = [
    { fill: "#8884d8", name: "Online", value: stats.onlineCount || 0 },
    { fill: "#82ca9d", name: "COD", value: stats.codCount || 0 },
  ];

  const percentageData = paymentData.map((item) => ({
    ...item,
    percentage:
      totalOrders > 0
        ? Number.parseFloat(((item.value / totalOrders) * 100).toFixed(2))
        : 0,
  }));

  const productData = (stats.data || []).filter((item) => item.sold > 0);

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-2xl">Thống kê</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Tổng đơn hàng
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              COD
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.codCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Online
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.onlineCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Đã bán
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalSold}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment Methods - Quantity */}
        <Card>
          <CardHeader>
            <CardTitle>Phương thức thanh toán (Số lượng)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={300} width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={paymentData}
                  dataKey="value"
                  innerRadius={60}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={true}
                  outerRadius={100}
                >
                  {paymentData.map((entry) => (
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
                <text
                  fill="var(--color-card-foreground)"
                  fontSize={14}
                  textAnchor="middle"
                  x="50%"
                  y="50%"
                >
                  <tspan dy="-6" x="50%">
                    {totalOrders}
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

        {/* Payment Methods - Percentage */}
        <Card>
          <CardHeader>
            <CardTitle>Phương thức thanh toán (Tỷ lệ %)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={300} width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={percentageData}
                  dataKey="percentage"
                  innerRadius={60}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  labelLine={true}
                  outerRadius={100}
                >
                  {percentageData.map((entry) => (
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
                  formatter={(value) => [`${value}%`, "Tỷ lệ"]}
                />
                <text
                  fill="var(--color-card-foreground)"
                  fontSize={14}
                  textAnchor="middle"
                  x="50%"
                  y="50%"
                >
                  <tspan dy="-6" x="50%">
                    {totalOrders}
                  </tspan>
                  <tspan
                    dy="20"
                    fill="var(--color-muted-foreground)"
                    fontSize={12}
                    x="50%"
                  >
                    Người dùng
                  </tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart - Products Sold */}
      {productData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sản phẩm đã bán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={400} width="100%">
              <BarChart
                data={productData}
                margin={{ bottom: 20, left: 10, right: 10, top: 10 }}
              >
                <XAxis
                  angle={-45}
                  dataKey="title"
                  height={60}
                  interval={0}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="rounded-lg border bg-white p-3 shadow-lg dark:bg-zinc-900">
                          <p className="font-medium text-sm">
                            {payload[0].payload.title}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Đã bán:{" "}
                            <span className="font-bold text-foreground">
                              {payload[0].value}
                            </span>{" "}
                            sản phẩm
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="sold" fill="#8884d8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default InfoPage;
