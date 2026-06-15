"use client";

import { api } from "./client";

export function getWishlist() {
  return api.get("/wishlist");
}

export function addToWishlist(productId) {
  return api.post("/wishlist/items", { productId });
}

export function removeFromWishlist(productId) {
  return api.delete(`/wishlist/items/${productId}`);
}
