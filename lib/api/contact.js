"use client";

import { api } from "./client";

export function sendContactMessage({ name, email, phone, subject, message, type }) {
  return api.post(
    "/contact",
    { name, email, phone, subject, message, type },
    { auth: false }
  );
}
