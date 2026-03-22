import { ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartData } from "@/context/cartContext.js";
import { useUserData } from "@/context/userContext.js";

const navLinks = [
  { label: "Trang chủ", path: "/" },
  { label: "Sản phẩm", path: "/products" },
];

function Navbar() {
  const navigate = useNavigate();

  // Auth state from Context
  const { user, isAuth, loading, logout } = useUserData();
  const { totalItem, setTotalItem } = useCartData();

  const handleLogout = () => {
    setTotalItem(0);
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          className="flex cursor-pointer items-center gap-2"
          onClick={() => navigate("/")}
          type="button"
        >
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold tracking-tight">QuickCart</span>
        </button>

        {/* Nav Links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.path}>
              <button
                className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => navigate(link.path)}
                type="button"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Button
            className="relative"
            onClick={() => navigate("/cart")}
            size="icon"
            variant="ghost"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItem > 0 && (
              <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItem}
              </span>
            )}
            <span className="sr-only">Giỏ hàng</span>
          </Button>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <User className="h-5 w-5" />
                <span className="sr-only">Tài khoản</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {loading ? (
                <DropdownMenuItem disabled>Đang tải...</DropdownMenuItem>
              ) : isAuth ? (
                <>
                  <DropdownMenuLabel className="w-full truncate">
                    {user?.email ?? "Tài khoản"}
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    Tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    Đơn hàng
                  </DropdownMenuItem>
                  {user && user.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  Đăng nhập
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
