"use client";

import { api } from "./client";

export function subscribe(email, source) {
  return api.post("/newsletter/subscribe", { email, source }, { auth: false });
}
