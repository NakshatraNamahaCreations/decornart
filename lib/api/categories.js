"use client";

import { api } from "./client";

export function listCategories() {
  return api.get("/categories", { auth: false });
}
