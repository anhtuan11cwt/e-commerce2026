import { ArrowRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

function Hero() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[url('/bg%20image.jpg')] bg-cover bg-center bg-no-repeat px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-muted-foreground text-sm">
            <ShoppingBag className="h-4 w-4" />
            Mua sắm dễ dàng, giao hàng nhanh chóng
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Khám phá sản phẩm
            <span className="text-primary"> chất lượng cao</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Hàng ngàn sản phẩm đa dạng với giá tốt nhất. Trải nghiệm mua sắm
            trực tuyến tiện lợi và an toàn tại QuickCart.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/products")} size="lg">
              Mua ngay
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate("/products")}
              size="lg"
              variant="outline"
            >
              Xem sản phẩm
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
