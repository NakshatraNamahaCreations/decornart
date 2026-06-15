"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import styles from "./Preloader.module.css";

const SESSION_KEY = "decornart:preloaded";

const hasPreloaded = () =>
  typeof window !== "undefined" &&
  window.sessionStorage?.getItem(SESSION_KEY) === "1";

export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const [count, setCount] = useState(0);

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

      // 1) Botanical sprig appears (small accent above the eyebrow).
      tl.from(`.${styles.sprig}`, {
        scale: 0,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(2)",
        transformOrigin: "center",
      })
        // 2) Eyebrow fades up.
        .from(
          `.${styles.eyebrow}`,
          { y: 14, opacity: 0, duration: 0.5 },
          "-=0.2"
        )
        // 3) Wordmark fades up — the headline reveal.
        .from(
          `.${styles.wordmark}`,
          { y: 32, opacity: 0, duration: 0.8 },
          "-=0.3"
        );

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
            setCount(Math.round(this.targets()[0].v));
          },
        },
        "<"
      );

      // 5) Brief beat, then reveal — inner content fades up out, panels part.
      tl.to(
        `.${styles.inner}`,
        { opacity: 0, y: -12, duration: 0.5 },
        "+=0.25"
      )
        .to(
          `.${styles.panelTop}`,
          { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          "<"
        )
        .to(
          `.${styles.panelBottom}`,
          { yPercent: 100, duration: 0.9, ease: "power4.inOut" },
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
        {/* Small horizontal botanical sprig — curved stem with three leaves. */}
        <svg
          className={styles.sprig}
          viewBox="0 0 80 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M4 12 Q 40 4 76 12"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx="20"
            cy="9"
            rx="4.5"
            ry="2"
            transform="rotate(-25 20 9)"
            fill="currentColor"
          />
          <ellipse
            cx="40"
            cy="5"
            rx="5"
            ry="2.2"
            fill="currentColor"
          />
          <ellipse
            cx="60"
            cy="9"
            rx="4.5"
            ry="2"
            transform="rotate(25 60 9)"
            fill="currentColor"
          />
        </svg>

        <span className={styles.eyebrow}>The Atelier</span>
        <h1 className={styles.wordmark}>Decornart</h1>

        <div className={styles.lineWrap}>
          <div className={styles.line} />
        </div>

        <span className={styles.count}>{String(count).padStart(2, "0")}%</span>
      </div>
    </div>
  );
}
