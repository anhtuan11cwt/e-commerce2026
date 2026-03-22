import {
  KeyRound,
  LogOut,
  Mail,
  Pencil,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartData } from "@/context/cartContext.js";
import { useUserData } from "@/context/userContext.js";

function Account() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, changePassword, btnLoading } =
    useUserData();
  const { setTotalItem } = useCartData();

  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogout = () => {
    setTotalItem(0);
    logout();
  };

  const handleOpenProfile = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setProfileOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ email, name });
    setProfileOpen(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    await changePassword(oldPassword, newPassword);
    setOldPassword("");
    setNewPassword("");
    setPasswordOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="mb-8 font-bold text-2xl tracking-tight sm:text-3xl">
        Tài khoản của tôi
      </h1>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-2xl text-primary">
            {getInitials(user?.name)}
          </div>
          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
            <h2 className="font-bold text-xl">{user?.name}</h2>
            <p className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Mail className="h-3.5 w-3.5" />
              {user?.email}
            </p>
            <div className="mt-2">
              {user?.role === "admin" ? (
                <Badge className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Quản trị viên
                </Badge>
              ) : (
                <Badge className="gap-1" variant="secondary">
                  <User className="h-3 w-3" />
                  Khách hàng
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
          <CardDescription>Chi tiết về tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tên</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Vai trò</span>
            <span className="font-medium">
              {user?.role === "admin" ? "Quản trị viên" : "Khách hàng"}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ngày tham gia</span>
            <span className="font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            className="flex-1"
            onClick={handleOpenProfile}
            variant="outline"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Cập nhật thông tin
          </Button>
          <Dialog onOpenChange={setProfileOpen} open={profileOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cập nhật thông tin</DialogTitle>
                <DialogDescription>
                  Thay đổi tên hoặc email của bạn
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="update-name">Tên</Label>
                    <Input
                      id="update-name"
                      onChange={(e) => setName(e.target.value)}
                      required
                      value={name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="update-email">Email</Label>
                    <Input
                      id="update-email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                      value={email}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    onClick={() => setProfileOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Hủy
                  </Button>
                  <Button disabled={btnLoading} type="submit">
                    {btnLoading ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            className="flex-1"
            onClick={() => setPasswordOpen(true)}
            variant="outline"
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Đổi mật khẩu
          </Button>
          <Dialog onOpenChange={setPasswordOpen} open={passwordOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogDescription>
                  Nhập mật khẩu cũ và mật khẩu mới
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">Mật khẩu cũ</Label>
                    <Input
                      id="old-password"
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      type="password"
                      value={oldPassword}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input
                      id="new-password"
                      minLength={6}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      type="password"
                      value={newPassword}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    onClick={() => setPasswordOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Hủy
                  </Button>
                  <Button disabled={btnLoading} type="submit">
                    {btnLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            className="flex-1"
            onClick={() => navigate("/orders")}
            variant="outline"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Đơn hàng của tôi
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigate("/products")}
            variant="outline"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Tiếp tục mua sắm
          </Button>
          <Button
            className="flex-1"
            onClick={handleLogout}
            variant="destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Account;
