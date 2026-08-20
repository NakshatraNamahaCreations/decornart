"use client";

import { api } from "./client";

// Public, storefront-safe settings projection. Includes the checkout
// shipping charges (default / express / same-day) and the free-shipping
// threshold so the checkout page can render admin-configurable amounts
// without hardcoding.
export function getPublicSettings() {
  return api.get("/settings", { auth: false });
}
