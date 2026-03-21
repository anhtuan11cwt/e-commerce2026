import { Facebook, ShoppingBag, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const footerLinks = [
  { label: "Về chúng tôi", path: "/about" },
  { label: "Liên hệ", path: "/contact" },
  { label: "Chính sách bảo mật", path: "/privacy" },
  { label: "Điều khoản sử dụng", path: "/terms" },
];

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="mb-3 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">QuickCart</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Cửa hàng trực tuyến cho mọi nhu cầu của bạn. Khám phá hàng ngàn
              sản phẩm chất lượng với giá tốt nhất.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <button
                className="cursor-pointer text-muted-foreground text-sm transition-colors hover:text-foreground hover:underline"
                key={link.path}
                onClick={() => navigate(link.path)}
                type="button"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social */}
          <div>
            <p className="mb-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Theo dõi chúng tôi
            </p>
            <div className="flex items-center gap-3">
              <a
                aria-label="Facebook"
                className="cursor-pointer text-muted-foreground transition-opacity hover:opacity-75"
                href="https://facebook.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                aria-label="Twitter"
                className="cursor-pointer text-muted-foreground transition-opacity hover:opacity-75"
                href="https://twitter.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border/60" />

        <p className="text-center text-muted-foreground text-xs">
          © {new Date().getFullYear()} QuickCart. Mọi quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
