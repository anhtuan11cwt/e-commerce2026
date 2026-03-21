import { ArrowRight, ShoppingBag, Truck } from "lucide-react";

import Hero from "@/components/Hero";

function Home() {
  return (
    <div>
      <Hero />

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
