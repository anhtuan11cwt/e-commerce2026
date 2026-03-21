import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CartContext, SERVER_URL } from "./cartContext.js";
import { useUserData } from "./userContext.js";

export function CartProvider({ children }) {
  const { isAuth } = useUserData();

  const [cart, setCart] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  const loadCartData = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      return { cart: [], subtotal: 0, totalItem: 0 };
    }

    try {
      const { data } = await axios.get(`${SERVER_URL}/api/cart/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        cart: data.cart,
        subtotal: data.subTotal,
        totalItem: data.sumOfQuantity,
      };
    } catch {
      return { cart: [], subtotal: 0, totalItem: 0 };
    }
  }, []);

  const fetchCart = useCallback(async () => {
    const result = await loadCartData();
    setCart(result.cart);
    setTotalItem(result.totalItem);
    setSubtotal(result.subtotal);
  }, [loadCartData]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${SERVER_URL}/api/cart/add`,
        { product: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchCart();
      return data;
    },
    [fetchCart],
  );

  const updateCart = useCallback(
    async (action, id) => {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${SERVER_URL}/api/cart/update?action=${action}`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchCart();
      return data;
    },
    [fetchCart],
  );

  const removeFromCart = useCallback(
    async (id) => {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${SERVER_URL}/api/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      await fetchCart();
    },
    [fetchCart],
  );

  // Tải giỏ khi mount lần đầu (khi đã đăng nhập và F5 trang)
  useEffect(() => {
    let cancelled = false;
    loadCartData().then((result) => {
      if (!cancelled) {
        setCart(result.cart);
        setTotalItem(result.totalItem);
        setSubtotal(result.subtotal);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [loadCartData]);

  // Tải lại giỏ khi người dùng đăng nhập (isAuth từ false → true)
  useEffect(() => {
    let cancelled = false;
    if (isAuth) {
      loadCartData().then((result) => {
        if (!cancelled) {
          setCart(result.cart);
          setTotalItem(result.totalItem);
          setSubtotal(result.subtotal);
        }
      });
    } else {
      // Xóa giỏ khi đăng xuất (callback async để thỏa eslint)
      Promise.resolve().then(() => {
        if (!cancelled) {
          setCart([]);
          setTotalItem(0);
          setSubtotal(0);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [isAuth, loadCartData]);

  const value = {
    addToCart,
    cart,
    fetchCart,
    removeFromCart,
    setTotalItem,
    subtotal,
    totalItem,
    updateCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
