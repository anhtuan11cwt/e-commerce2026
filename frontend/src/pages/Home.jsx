import { ArrowRight, ShoppingBag, Truck } from "lucide-react";

import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { useProductData } from "@/context/productContext";

function Home() {
  const { loading, newProd } = useProductData();

  return (
    <div>
      <Hero />

      {/* Sản phẩm mới nhất */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-bold text-xl tracking-tight">
          Sản phẩm mới nhất
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                className="h-[340px] animate-pulse rounded-xl bg-muted"
                key={i.toString()}
              />
            ))}
          </div>
        ) : newProd && newProd.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {newProd.map((element) => (
              <ProductCard key={element._id} latest="yes" product={element} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Không có sản phẩm nào</p>
        )}
      </section>

      {/* Tính năng nổi bật */}
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
