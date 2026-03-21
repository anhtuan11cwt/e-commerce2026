import { Filter, X } from "lucide-react";
import { useState } from "react";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useProductData } from "@/context/productContext";

function Products() {
  const {
    categories,
    category,
    clearFilter,
    loading,
    nextPage,
    page,
    previousPage,
    price,
    products,
    search,
    setCategory,
    setPrice,
    setSearch,
    totalPages,
  } = useProductData();

  const [show, setShow] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-border bg-background p-4 transition-transform duration-300 ease-in-out md:sticky md:top-16 md:z-40 md:h-[calc(100vh-4rem)] md:translate-x-0 ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button (mobile) */}
        <button
          aria-label="Đóng bộ lọc"
          className="absolute right-4 top-4 cursor-pointer rounded-md p-1 transition-colors hover:bg-muted md:hidden"
          onClick={() => setShow(false)}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 font-bold text-lg">Bộ lọc</h2>

        {/* Search */}
        <div className="mb-4">
          <Label className="mb-1.5" htmlFor="search-title">
            Tìm kiếm
          </Label>
          <Input
            id="search-title"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tên sản phẩm..."
            type="text"
            value={search}
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <Label className="mb-1.5" htmlFor="category">
            Danh mục
          </Label>
          <select
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Sort */}
        <div className="mb-4">
          <Label className="mb-1.5" htmlFor="price">
            Sắp xếp theo giá
          </Label>
          <select
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            id="price"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          >
            <option value="">Mặc định</option>
            <option value="lowToHigh">Thấp đến Cao</option>
            <option value="highToLow">Cao đến Thấp</option>
          </select>
        </div>

        {/* Clear Filter */}
        <Button className="mt-2 w-full" onClick={clearFilter} variant="outline">
          Xóa bộ lọc
        </Button>
      </div>

      {/* Overlay (mobile) */}
      {show && (
        <button
          aria-label="Đóng overlay"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setShow(false)}
          type="button"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 md:px-8">
        {/* Mobile filter button */}
        <Button
          className="mb-4 cursor-pointer md:hidden"
          onClick={() => setShow(true)}
          size="sm"
          variant="outline"
        >
          <Filter className="mr-1.5 h-4 w-4" />
          Bộ lọc
        </Button>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                className="h-[340px] animate-pulse rounded-xl bg-muted"
                key={i.toString()}
              />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {page !== 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          previousPage();
                        }}
                        text="Trước"
                      />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <span className="px-3 py-2 text-muted-foreground text-sm">
                      Trang {page} / {totalPages}
                    </span>
                  </PaginationItem>
                  {page !== totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          nextPage();
                        }}
                        text="Sau"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground text-sm">
              Không tìm thấy sản phẩm nào
            </p>
            <Button
              className="mt-4 cursor-pointer"
              onClick={clearFilter}
              variant="outline"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
