import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: implement login API call
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <LogIn className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Nhập thông tin để tiếp tục
        </p>
      </div>

      <form className="w-full space-y-4" onSubmit={handleSubmit}>
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
        <Button className="w-full" size="lg" type="submit">
          Đăng nhập
        </Button>
      </form>

      <p className="mt-6 text-muted-foreground text-sm">
        Chưa có tài khoản?{" "}
        <button
          className="cursor-pointer font-medium text-primary hover:underline"
          onClick={() => navigate("/register")}
          type="button"
        >
          Đăng ký
        </button>
      </p>
    </div>
  );
}

export default Login;
