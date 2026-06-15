"use client";

import { api, setTokens, clearTokens, getRefreshToken } from "./client";

export async function register({ name, email, password, phone }) {
  const data = await api.post("/auth/register", { name, email, password, phone });
  setTokens(data);
  return data;
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

export async function refresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const data = await api.post("/auth/refresh", { refreshToken }, { auth: false });
  setTokens(data);
  return data;
}
