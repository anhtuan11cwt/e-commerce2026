import { Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format_vnd } from "@/utils/format_vnd";

function ProductCard({ product, latest }) {
  const navigate = useNavigate();

  return (
    <div className="group/card flex flex-col overflow-hidden rounded-xl border border-border bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-md">
      <div className="relative h-[220px] overflow-hidden bg-muted sm:h-[260px]">
        <Link to={`/product/${product._id}`}>
          <img
            alt={product.title}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover/card:scale-110"
            loading="lazy"
            src={product.images?.[0]?.url}
          />
        </Link>
        {latest === "yes" && (
          <Badge className="absolute left-3 top-3 bg-green-500 text-white shadow-sm">
            Mới
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="truncate font-semibold text-sm">
          {product.title?.slice(0, 30)}
        </h3>
        <p className="line-clamp-2 text-muted-foreground text-xs">
          {product.about?.slice(0, 60)}
        </p>
        <div className="mt-auto pt-2">
          <p className="font-bold text-base">{format_vnd(product.price)}</p>
        </div>
        <Button
          className="w-full"
          onClick={() => navigate(`/product/${product._id}`)}
          size="sm"
          variant="outline"
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Xem sản phẩm
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
