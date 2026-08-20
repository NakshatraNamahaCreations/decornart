"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import logo from "@/assets/new-logo.png";
import styles from "./Preloader.module.css";

const SESSION_KEY = "Decor N Art:preloaded";

const hasPreloaded = () => {
  if (typeof window === "undefined") return false;
  // Escape hatch for design QA — ?preloader=1 forces the animation to run.
  if (window.location.search.includes("preloader=1")) return false;
  return window.sessionStorage?.getItem(SESSION_KEY) === "1";
};

export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const countRef = useRef(null);

  // Lock page scroll while the loader is up — but only when the loader
  // will actually run. Skip the lock entirely on repeat visits in the
  // same session so the home page is immediately scrollable.
  useIsomorphicLayoutEffect(() => {
    if (hasPreloaded()) return undefined;
    document.documentElement.classList.add("app-locked");
    return () => document.documentElement.classList.remove("app-locked");
  }, []);

  useGSAP(
    () => {
      // Already preloaded this browser session — hide the loader before
      // the first paint and hand off immediately.
      if (hasPreloaded()) {
        if (root.current) root.current.style.display = "none";
        onComplete?.();
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.documentElement.classList.remove("app-locked");
          try {
            window.sessionStorage.setItem(SESSION_KEY, "1");
          } catch (_) {
            // sessionStorage can throw in private mode / disabled storage —
            // safe to ignore; loader will simply show again next mount.
          }
          onComplete?.();
        },
      });

      // 1) Logo scales in from the center as the headline reveal.
      tl.from(`.${styles.logo}`, {
        scale: 0.6,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.6)",
        transformOrigin: "center",
      });

      // 4) Gold line draws left → right in parallel with the counter ticking.
      tl.to(
        `.${styles.line}`,
        { scaleX: 1, duration: 1.4, ease: "power1.inOut" },
        "+=0.1"
      ).to(
        { v: 0 },
        {
          v: 100,
          duration: 1.4,
          ease: "power1.inOut",
          onUpdate() {
            const el = countRef.current;
            if (!el) return;
            const n = Math.round(this.targets()[0].v);
            el.textContent = `${String(n).padStart(2, "0")}%`;
          },
        },
        "<"
      );

      // 5) Inner content clears first — then the panels part to reveal the page.
      tl.to(
        `.${styles.inner}`,
        { opacity: 0, y: -12, duration: 0.5 },
        "+=0.25"
      )
        .to(
          `.${styles.panelTop}`,
          { yPercent: -100, duration: 1, ease: "power4.inOut" },
          "+=0.15"
        )
        .to(
          `.${styles.panelBottom}`,
          { yPercent: 100, duration: 1, ease: "power4.inOut" },
          "<"
        )
        .set(root.current, { display: "none" });
    },
    { scope: root }
  );

  return (
    <div className={styles.loader} ref={root} aria-hidden="true">
      <div className={`${styles.panel} ${styles.panelTop}`} />
      <div className={`${styles.panel} ${styles.panelBottom}`} />

      <div className={styles.inner}>
        <Image
          src={logo}
          alt="Decor N Art"
          className={styles.logo}
          priority
          sizes="(max-width: 860px) 160px, 220px"
        />

        <div className={styles.lineWrap}>
          <div className={styles.line} />
        </div>

        <span ref={countRef} className={styles.count}>00%</span>
      </div>
    </div>
  );
}
