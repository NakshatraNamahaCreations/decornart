"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authApi from "@/lib/api/auth";
import { getAccessToken, clearTokens } from "@/lib/api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | guest | authed

  const loadUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setStatus("guest");
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
      setStatus("authed");
    } catch {
      clearTokens();
      setUser(null);
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      setUser(data.user);
      setStatus("authed");
      return data.user;
    },
    []
  );

  const register = useCallback(async (payload) => {
    // No token side-effects: the caller (RegisterModal) routes the shopper to
    // the login screen after a successful signup.
    const data = await authApi.register(payload);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setStatus("guest");
  }, []);

  const addAddress = useCallback(async (address) => {
    const addresses = await authApi.addAddress(address);
    setUser((prev) => (prev ? { ...prev, addresses } : prev));
    return addresses;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isAuthed: status === "authed",
        isLoading: status === "loading",
        login,
        register,
        logout,
        addAddress,
        refresh: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
