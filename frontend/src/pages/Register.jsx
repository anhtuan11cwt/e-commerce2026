import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: implement register API call
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UserPlus className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Đăng ký</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Tạo tài khoản mới để bắt đầu
        </p>
      </div>

      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block font-medium text-sm" htmlFor="name">
            Họ và tên
          </label>
          <input
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
            id="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            required
            type="text"
            value={name}
          />
        </div>
        <div>
          <label className="mb-1.5 block font-medium text-sm" htmlFor="email">
            Địa chỉ email
          </label>
          <input
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@email.com"
            required
            type="email"
            value={email}
          />
        </div>
        <div>
          <label
            className="mb-1.5 block font-medium text-sm"
            htmlFor="password"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-ring"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
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
        <div>
          <label
            className="mb-1.5 block font-medium text-sm"
            htmlFor="confirmPassword"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-ring"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
            />
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
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
        <Button className="w-full" size="lg" type="submit">
          Đăng ký
        </Button>
      </form>

      <p className="mt-6 text-muted-foreground text-sm">
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
