import { ArrowRight, ShoppingBag, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-muted-foreground text-sm">
          <ShoppingBag className="h-4 w-4" />
          Mua sắm dễ dàng, giao hàng nhanh chóng
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Khám phá sản phẩm
          <span className="text-primary"> chất lượng cao</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Hàng ngàn sản phẩm đa dạng với giá tốt nhất. Trải nghiệm mua sắm trực
          tuyến tiện lợi và an toàn tại QuickCart.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/product")} size="lg">
            Mua ngay
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            onClick={() => navigate("/product")}
            size="lg"
            variant="outline"
          >
            Xem sản phẩm
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Giao hàng nhanh</h3>
            <p className="text-muted-foreground text-sm">
              Giao hàng toàn quốc trong 2-5 ngày làm việc
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Sản phẩm chính hãng</h3>
            <p className="text-muted-foreground text-sm">
              100% sản phẩm chính hãng, bảo hành đầy đủ
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Đổi trả dễ dàng</h3>
            <p className="text-muted-foreground text-sm">
              Chính sách đổi trả trong 7 ngày nếu không hài lòng
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
