"use client";

import { api } from "./client";

// Fetch coupons currently redeemable (active, in-window, under usage limit).
// Passes the auth token when present so the backend can hide any coupon the
// signed-in shopper has already exhausted per-user.
export function listPublicCoupons() {
  return api.get("/coupons");
}
