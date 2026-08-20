"use client";

import { api } from "./client";

const opts = { cart: true };

export function getCart() {
  return api.get("/cart", opts);
}

export function addCartItem({ productId, qty = 1, variantId = null, color = null }) {
  const body = { productId, qty };
  if (variantId) body.variantId = variantId;
  if (color) body.color = color;
  return api.post("/cart/items", body, opts);
}

// variantId + color are threaded via query string so the same product
// added at two variants or two colors can be updated / removed
// independently.
function lineQuery(variantId, color) {
  const q = {};
  if (variantId) q.variantId = variantId;
  if (color) q.color = color;
  return Object.keys(q).length ? q : undefined;
}

export function updateCartItem(productId, qty, variantId = null, color = null) {
  return api.patch(
    `/cart/items/${productId}`,
    { qty },
    { ...opts, query: lineQuery(variantId, color) }
  );
}

export function removeCartItem(productId, variantId = null, color = null) {
  return api.delete(`/cart/items/${productId}`, {
    ...opts,
    query: lineQuery(variantId, color),
  });
}

export function applyPromo(code) {
  return api.post("/cart/promo", { code }, opts);
}
