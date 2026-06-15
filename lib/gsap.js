"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins exactly once, on the client. Import { gsap, ScrollTrigger,
// useGSAP } from this module everywhere instead of registering per-component.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger, useGSAP };
