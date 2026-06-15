"use client";

import { api } from "./client";

export function listProducts(query = {}) {
  return api.get("/products", { query, auth: false });
}

export function getProduct(slug) {
  return api.get(`/products/${encodeURIComponent(slug)}`, { auth: false });
}

export function getRelatedProducts(slug) {
  return api.get(`/products/${encodeURIComponent(slug)}/related`, { auth: false });
}
