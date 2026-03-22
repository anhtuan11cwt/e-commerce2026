import { Home, Info, Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import HomePage from "@/components/admin/HomePage";
import InfoPage from "@/components/admin/InfoPage";
import OrdersPage from "@/components/admin/OrdersPage";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Sản phẩm", value: "home" },
  { icon: ShoppingBag, label: "Đơn hàng", value: "orders" },
  { icon: Info, label: "Thông tin", value: "info" },
];

function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPageContent = () => {
    switch (selectedPage) {
      case "home":
        return <HomePage />;
      case "orders":
        return <OrdersPage />;
      case "info":
        return <InfoPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background/80 backdrop-blur-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4 lg:justify-center">
          <span className="font-bold text-lg">Menu</span>
          <Button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            size="icon-sm"
            variant="ghost"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Đóng menu</span>
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <Button
              className={`justify-start gap-2 ${
                selectedPage === item.value
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              }`}
              key={item.value}
              onClick={() => {
                setSelectedPage(item.value);
                setSidebarOpen(false);
              }}
              variant="ghost"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-3 border-b border-border px-4">
          <Button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            size="icon"
            variant="ghost"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Mở menu</span>
          </Button>
          <h1 className="font-bold text-xl">Admin Dashboard</h1>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
