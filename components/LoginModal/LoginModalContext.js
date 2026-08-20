"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthModalContext = createContext({
  mode: null,
  openLogin: () => {},
  openRegister: () => {},
  openForgot: () => {},
  closeLogin: () => {},
});

export function LoginModalProvider({ children }) {
  const [mode, setMode] = useState(null);

  const openLogin = useCallback(() => setMode("login"), []);
  const openRegister = useCallback(() => setMode("register"), []);
  const openForgot = useCallback(() => setMode("forgot"), []);
  const closeLogin = useCallback(() => setMode(null), []);

  const value = useMemo(
    () => ({
      mode,
      isOpen: mode === "login",
      isRegisterOpen: mode === "register",
      isForgotOpen: mode === "forgot",
      openLogin,
      openRegister,
      openForgot,
      closeLogin,
      close: closeLogin,
    }),
    [mode, openLogin, openRegister, openForgot, closeLogin]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useLoginModal() {
  return useContext(AuthModalContext);
}
