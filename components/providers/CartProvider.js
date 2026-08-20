"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import * as cartApi from "@/lib/api/cart";
import { clearGuestCartId } from "@/lib/api/client";
import { useAuth } from "./AuthProvider";

const EMPTY = {
  owner: null,
  items: [],
  promoCode: null,
  summary: {
    subtotal: 0,
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
  const prevStatusRef = useRef(status);
  const cartRef = useRef(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

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

  // Refetch whenever auth state resolves. On a fresh guest -> authed transition
  // we first replay any items the shopper had in their guest cart into their
  // authed cart, since the backend keys guest carts on the x-cart-id UUID and
  // an authed GET /cart returns only the user's server-side cart.
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;
    if (status === "loading") return;

    if (prev === "guest" && status === "authed") {
      const guestItems = (cartRef.current.items || [])
        .map((it) => ({
          productId: it.productId ?? it.id,
          qty: it.qty ?? 1,
          variantId: it.variantId ?? null,
          color: it.color ?? null,
        }))
        .filter((it) => it.productId && it.qty > 0);

      if (!guestItems.length) {
        refresh();
        return;
      }

      setLoading(true);
      (async () => {
        for (const it of guestItems) {
          try {
            await cartApi.addCartItem(it);
          } catch {
            // Skip individual failures (e.g. out-of-stock) so the rest of the
            // guest cart still merges.
          }
        }
        clearGuestCartId();
        await refresh();
      })();
      return;
    }

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
    (productId, qty = 1, variantId = null, color = null) =>
      guard(() => cartApi.addCartItem({ productId, qty, variantId, color })),
    [guard]
  );

  const updateItem = useCallback(
    (productId, qty, variantId = null, color = null) =>
      guard(() => cartApi.updateCartItem(productId, qty, variantId, color)),
    [guard]
  );

  const removeItem = useCallback(
    (productId, variantId = null, color = null) =>
      guard(() => cartApi.removeCartItem(productId, variantId, color)),
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
