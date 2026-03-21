import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useUserData } from "@/context/userContext.js";

function Register() {
  const { registerUser, btnLoading } = useUserData();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    await registerUser(name, email, password);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
      <Card className="mx-auto mt-10 w-full max-w-[300px] md:max-w-[400px]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản mới để bắt đầu</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                disabled={btnLoading}
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
                type="text"
                value={name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Địa chỉ email</Label>
              <Input
                disabled={btnLoading}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@email.com"
                required
                type="email"
                value={email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  className="pr-10"
                  disabled={btnLoading}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  disabled={btnLoading}
                  onClick={() => setShowPassword((prev) => !prev)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  </span>
                </button>
              </div>
            </div>
            <div className="space-y-2 pb-4">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  className="pr-10"
                  disabled={btnLoading}
                  id="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                />
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  disabled={btnLoading}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  type="button"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  </span>
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col">
            <Button
              className="w-full"
              disabled={btnLoading}
              size="lg"
              type="submit"
            >
              {btnLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Đăng ký"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-6 text-center text-muted-foreground text-sm">
        Đã có tài khoản?{" "}
        <button
          className="cursor-pointer font-medium text-primary hover:underline"
          onClick={() => navigate("/login")}
          type="button"
        >
          Đăng nhập
        </button>
      </p>
    </div>
  );
}

export default Register;
