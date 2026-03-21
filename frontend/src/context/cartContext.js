import { createContext, useContext } from "react";

export const CartContext = createContext(undefined);

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? "http://localhost:5000";

export function useCartData() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartData phải được dùng bên trong CartProvider");
  }
  return context;
}

export const cartData = useCartData;
