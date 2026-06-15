import { useEffect, useLayoutEffect } from "react";

// Avoids the "useLayoutEffect does nothing on the server" warning while still
// running synchronously on the client where GSAP measurements need it.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
