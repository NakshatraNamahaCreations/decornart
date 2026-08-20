"use client";

import { api } from "./client";

// Fetch active + in-window banners for a specific slot. Returns whatever the
// backend has active — callers merge with static fallbacks so the UI is never
// blank if the fetch fails or the admin hasn't populated the slot yet.
export function listBanners(slot, { categorySlug } = {}) {
  return api.get("/banners", {
    query: { slot, ...(categorySlug ? { categorySlug } : {}) },
    auth: false,
  });
}
