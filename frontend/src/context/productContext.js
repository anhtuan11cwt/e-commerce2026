import { createContext, useContext } from "react";

export const ProductContext = createContext(undefined);

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? "http://localhost:5000";

export function useProductData() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductData phải được dùng bên trong ProductProvider");
  }
  return context;
}

export function useProductFilter() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error(
      "useProductFilter phải được dùng bên trong ProductProvider",
    );
  }
  const {
    search,
    setSearch,
    category,
    setCategory,
    price,
    setPrice,
    page,
    setPage,
    totalPages,
    categories,
    clearFilter,
    nextPage,
    previousPage,
  } = context;

  return {
    categories,
    category,
    clearFilter,
    nextPage,
    page,
    previousPage,
    price,
    search,
    setCategory,
    setPage,
    setPrice,
    setSearch,
    totalPages,
  };
}
