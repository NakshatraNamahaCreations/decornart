"use client";

import { api } from "./client";

export function listReviews(productId, query = {}) {
  return api.get(`/reviews/product/${productId}`, { query, auth: false });
}

export function createReview(productId, { rating, title, body }) {
  return api.post(`/reviews/product/${productId}`, { rating, title, body });
}
