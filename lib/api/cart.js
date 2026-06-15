"use client";

import { api } from "./client";

const opts = { cart: true };

export function getCart() {
  return api.get("/cart", opts);
}

export function addCartItem({ productId, qty = 1 }) {
  return api.post("/cart/items", { productId, qty }, opts);
}

export function updateCartItem(productId, qty) {
  return api.patch(`/cart/items/${productId}`, { qty }, opts);
}

export function removeCartItem(productId) {
  return api.delete(`/cart/items/${productId}`, opts);
}

export function applyPromo(code) {
  return api.post("/cart/promo", { code }, opts);
}
