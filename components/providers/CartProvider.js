"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import * as cartApi from "@/lib/api/cart";
import { useAuth } from "./AuthProvider";

const EMPTY = {
  owner: null,
  items: [],
  promoCode: null,
  summary: {
    subtotal: 0,
    gst: 0,
    gstRate: 0.05,
    shipping: 0,
    discount: 0,
    total: 0,
    freeShippingOver: 2500,
    toFreeShipping: 2500,
  },
};

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { status } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inFlight = useRef(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart();
      setCart(data || EMPTY);
    } catch (e) {
      setError(e);
      setCart(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch whenever auth state resolves (guest -> authed or vice versa).
  useEffect(() => {
    if (status === "loading") return;
    refresh();
  }, [status, refresh]);

  const guard = useCallback(async (remote) => {
    const token = ++inFlight.current;
    try {
      const data = await remote();
      if (token === inFlight.current) setCart(data || EMPTY);
      return data;
    } catch (e) {
      setError(e);
      throw e;
    }
  }, []);

  const addItem = useCallback(
    (productId, qty = 1) =>
      guard(() => cartApi.addCartItem({ productId, qty })),
    [guard]
  );

  const updateItem = useCallback(
    (productId, qty) => guard(() => cartApi.updateCartItem(productId, qty)),
    [guard]
  );

  const removeItem = useCallback(
    (productId) => guard(() => cartApi.removeCartItem(productId)),
    [guard]
  );

  const applyPromo = useCallback(
    (code) => guard(() => cartApi.applyPromo(code)),
    [guard]
  );

  const itemCount = (cart.items || []).reduce((s, l) => s + (l.qty || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        itemCount,
        refresh,
        addItem,
        updateItem,
        removeItem,
        applyPromo,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
