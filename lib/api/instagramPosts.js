"use client";

import { api } from "./client";

export function listInstagramPosts() {
  return api.get("/instagram-posts", { auth: false });
}
