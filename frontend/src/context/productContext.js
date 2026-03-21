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
