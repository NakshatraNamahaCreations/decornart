"use client";

import { api } from "./client";

// Fetch active DIY videos, ordered by position. Callers merge with a
// static fallback so the section is never blank if the fetch fails or
// the admin hasn't populated any rows yet.
export function listDiyVideos() {
  return api.get("/diy-videos", { auth: false });
}
