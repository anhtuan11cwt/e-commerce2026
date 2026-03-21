import { ShoppingCart } from "lucide-react";

import { useUserData } from "@/context/userContext.js";

function Cart() {
  const { user } = useUserData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <ShoppingCart className="h-16 w-16 text-primary" />
        <h1 className="text-3xl font-bold">Giỏ hàng</h1>
        <p className="text-muted-foreground">
          Chào mừng, {user?.email ?? "Khách"}! Đây là trang giỏ hàng của bạn.
        </p>
      </div>
    </div>
  );
}

export default Cart;
