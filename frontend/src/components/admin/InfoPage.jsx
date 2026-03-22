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
  const maxSold = Math.max(...(stats.data?.map((d) => d.sold || 0) || [1]), 1);

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

      {/* Product Sales Chart */}
      {stats.data && stats.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sản phẩm đã bán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.data.map((item) => (
                <div className="flex items-center gap-3" key={item.title}>
                  <span className="w-32 truncate font-medium text-sm sm:w-48">
                    {item.title}
                  </span>
                  <div className="flex-1">
                    <div className="h-6 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${Math.max((item.sold / maxSold) * 100, item.sold > 0 ? 8 : 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right font-mono text-muted-foreground text-sm">
                    {item.sold}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default InfoPage;
