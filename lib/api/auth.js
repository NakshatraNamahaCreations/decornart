"use client";

import { api, setTokens, clearTokens, getRefreshToken } from "./client";

export async function register({ name, email, password, phone }) {
  // Registration deliberately does not persist tokens — the shopper is sent to
  // the login form afterwards so they explicitly sign in.
  return api.post("/auth/register", { name, email, password, phone });
}

export async function login({ email, password }) {
  const data = await api.post("/auth/login", { email, password });
  setTokens(data);
  return data;
}

export async function logout() {
  const refreshToken = getRefreshToken();
  try {
    await api.post("/auth/logout", { refreshToken });
  } catch {
    /* even if the server is unreachable, drop local creds */
  }
  clearTokens();
}

export function me() {
  return api.get("/auth/me");
}

export function addAddress(address) {
  return api.post("/auth/addresses", address);
}

export function updateAddress(id, address) {
  return api.patch(`/auth/addresses/${id}`, address);
}

export function deleteAddress(id) {
  return api.delete(`/auth/addresses/${id}`);
}

export function updateProfile(payload) {
  return api.patch("/auth/me", payload);
}

export function changePassword(payload) {
  return api.post("/auth/password", payload);
}

export async function refresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const data = await api.post("/auth/refresh", { refreshToken }, { auth: false });
  setTokens(data);
  return data;
}

// Password reset — no auth required. Backend always returns 200 so we
// cannot tell whether the email exists; the UI shows a generic confirmation.
export function forgotPassword(email) {
  return api.post("/auth/forgot", { email }, { auth: false });
}

// Consume the token from the reset email to set a new password.
export function resetPassword({ token, newPassword }) {
  return api.post("/auth/reset", { token, newPassword }, { auth: false });
}
