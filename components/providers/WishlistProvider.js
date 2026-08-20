"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as wishlistApi from "@/lib/api/wishlist";
import { useAuth } from "./AuthProvider";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthed, status } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthed) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await wishlistApi.getWishlist();
      setItems(data?.items || []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  useEffect(() => {
    if (status === "loading") return;
    refresh();
  }, [status, refresh]);

  const add = useCallback(
    async (productId) => {
      if (!isAuthed) {
        // Not signed in — let the UI open the login modal instead of
        // throwing an unhandled rejection into the console.
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("wishlist:login-required"));
        }
        return null;
      }
      const data = await wishlistApi.addToWishlist(productId);
      setItems(data?.items || []);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("wishlist:item-added", { detail: { productId } })
        );
      }
      return data;
    },
    [isAuthed]
  );

  const remove = useCallback(
    async (productId) => {
      if (!isAuthed) return;
      const data = await wishlistApi.removeFromWishlist(productId);
      setItems(data?.items || []);
      return data;
    },
    [isAuthed]
  );

  const has = useCallback(
    (productId) => items.some((i) => (i.productId || i.id) === productId),
    [items]
  );

  const toggle = useCallback(
    async (productId) => (has(productId) ? remove(productId) : add(productId)),
    [add, remove, has]
  );

  return (
    <WishlistContext.Provider
      value={{ items, loading, error, refresh, add, remove, toggle, has }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
