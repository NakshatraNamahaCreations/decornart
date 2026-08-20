"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { banners as staticBanners } from "@/lib/data/banners";
import { listBanners } from "@/lib/api/banners";
import styles from "./Hero.module.css";

const AUTO_MS = 3000;

// Cache of the last successfully fetched banner rows. Lives outside the
// component so it survives unmounts (SPA nav) AND page reloads (via
// sessionStorage). Without this, every fresh mount briefly renders the
// hardcoded `staticBanners` while the API re-fetches — the "flash of old
// images" glitch. With this, only the first-ever tab visit shows the
// static fallback; every subsequent mount / reload is seamless.
const CACHE_KEY = "decornart:homepage-hero-banners";
let cachedApiRows = null;

// Tracks whether Hero has completed its copy reveal at least once in this
// tab. On the first visit the reveal is gated on the Preloader dispatching
// `preloader:done` (with a 4s fallback). On subsequent mounts — e.g. the
// shopper navigates back to home from /shop — the Preloader may not fire
// its event again, so the fallback timer runs and the title/subtitle stay
// invisible for ~4s. This flag lets us skip the wait and reveal the copy
// synchronously on re-mount.
let hasRevealedOnce = false;

// Mirrors Preloader's sessionStorage flag. When it's set, the Preloader
// hands off synchronously via requestAnimationFrame — but since Hero is
// dynamically imported (ssr:false), it may mount *after* that rAF has
// already fired. In that race the `preloader:done` event has no listener
// and Hero would wait the full 4s fallback. Reading the same flag lets
// Hero know to skip the wait entirely on refreshes within a session.
const PRELOADER_SESSION_KEY = "Decor N Art:preloaded";
function preloaderAlreadyDone() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage?.getItem(PRELOADER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function loadCache() {
  if (typeof window === "undefined") return null;
  if (cachedApiRows) return cachedApiRows;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedApiRows = parsed;
      return parsed;
    }
  } catch {
    /* corrupt storage — ignore */
  }
  return null;
}

function saveCache(rows) {
  cachedApiRows = rows;
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(rows));
  } catch {
    /* quota exceeded / private mode — module cache still works this tab */
  }
}

// Homepage hero copy (eyebrow, script accent, subtitle, brand colours) lives
// in staticBanners. When the admin publishes homepage-hero banners we treat
// their title / image / CTA as an override but keep the static defaults so
// no admin-added slide ever looks stripped bare on the storefront.
function mergeApiSlides(apiRows) {
  if (!Array.isArray(apiRows) || apiRows.length === 0) return staticBanners;
  const base = staticBanners[0] || {};
  return apiRows.map((row) => ({
    ...base,
    id: `api-${row.id}`,
    bgImage: row.image || base.bgImage,
    eyebrow: row.eyebrow || base.eyebrow,
    title: row.title || base.title,
    // If the admin provided a script line, use their exact text (empty
    // string == they cleared it, so hide it). Otherwise fall back to the
    // static default.
    script: row.script !== undefined ? row.script : base.script,
    scriptStyle: row.scriptStyle || "script",
    subtitle: row.subtitle || base.subtitle,
    indexLabel: row.title || base.indexLabel,
    primaryCta: row.href
      ? { label: row.ctaLabel || "Shop now", href: row.href }
      : base.primaryCta,
    secondaryCta: base.secondaryCta,
  }));
}

export default function Hero() {
  const root = useRef(null);
  const copyRef = useRef(null);
  const revealedRef = useRef(false);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  // Seed initial state from the persisted cache (sessionStorage → module
  // var). Only the first-ever tab visit starts null and falls back to
  // staticBanners while the API responds; every subsequent mount / reload
  // reads the cache synchronously — no flash of old images.
  const [apiRows, setApiRows] = useState(() => loadCache());

  // Fetch admin-published hero banners on mount. Refreshes the cache so a
  // shopper who's already seen the site once picks up newly-published
  // banners the moment the response lands.
  useEffect(() => {
    let cancelled = false;
    listBanners("homepage-hero")
      .then((rows) => {
        if (cancelled) return;
        if (Array.isArray(rows) && rows.length > 0) {
          saveCache(rows);
          setApiRows(rows);
        }
      })
      .catch(() => {
        /* fall back to staticBanners / cached rows silently */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const banners = useMemo(() => mergeApiSlides(apiRows), [apiRows]);
  const b = banners[Math.min(current, banners.length - 1)];
  const primaryCta = b.primaryCta ?? b.cta;
  const secondaryCta = b.secondaryCta;

  useGSAP(
    () => {
      // Only hide the copy on the very first cold visit. On re-mounts in
      // the same tab (module flag) OR any refresh after Preloader has
      // already run once this session (sessionStorage flag), the copy
      // paints visible on the first frame — no waiting for events or the
      // 4s fallback timer.
      if (!hasRevealedOnce && !preloaderAlreadyDone()) {
        gsap.set(copyRef.current.children, { y: 32, opacity: 0 });
      }
    },
    { scope: root }
  );

  // First reveal — fires once when preloader hands off (with fallback timer).
  useEffect(() => {
    const reveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      hasRevealedOnce = true;
      gsap.to(copyRef.current.children, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });
    };

    // Preloader has already finished at some point this session — either
    // an SPA re-mount in this tab, or a refresh where Preloader hands off
    // synchronously. Copy is already visible from useGSAP above; just mark
    // the ref so the slide-change animation runs normally.
    if (hasRevealedOnce || preloaderAlreadyDone()) {
      revealedRef.current = true;
      hasRevealedOnce = true;
      return undefined;
    }

    window.addEventListener("preloader:done", reveal);
    const fallback = setTimeout(reveal, 4000);
    return () => {
      window.removeEventListener("preloader:done", reveal);
      clearTimeout(fallback);
    };
  }, []);

  // Animate copy in on slide change (skip first mount — handled by reveal).
  useEffect(() => {
    if (!revealedRef.current) return;
    gsap.fromTo(
      copyRef.current.children,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
      }
    );
  }, [current]);

  // Auto-rotate — pauses on hover, disabled under reduced motion. `banners`
  // is included in deps so the interval re-syncs after the API list swaps in.
  useEffect(() => {
    if (paused) return undefined;
    if (banners.length < 2) return undefined;
    const mql =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mql?.matches) return undefined;
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % banners.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, banners.length]);

  const goTo = (next) => {
    if (next === current) return;
    // Animate the outgoing copy, then swap.
    gsap.to(copyRef.current.children, {
      y: -16,
      opacity: 0,
      duration: 0.32,
      stagger: 0.03,
      ease: "power2.in",
      onComplete: () => setCurrent(next),
    });
  };

  return (
    <section
      ref={root}
      className={styles.hero}
      style={{ "--hero-bg": b.accentBg, "--accent": b.accent }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Layered backgrounds — cross-fade between slides via opacity.
          Uses next/image so PNGs are served as AVIF/WebP, resized per viewport,
          and lazy-loaded past the first slide. */}
      {banners.map((slide, i) => (
        <span
          key={slide.id}
          className={`${styles.bgStage} ${i === current ? styles.bgStageActive : ""}`}
          aria-hidden="true"
        >
          <Image
            src={slide.bgImage}
            alt=""
            fill
            sizes="100vw"
            quality={78}
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            className={styles.bgImg}
          />
        </span>
      ))}

      <div className={styles.inner}>
        <span className={styles.mark}>Decor N Art — est. atelier</span>

        <div className={styles.main}>
          <div className={styles.copyCol}>
            <div ref={copyRef} className={styles.copy}>
              {b.eyebrow && (
                <span className={styles.eyebrow}>{b.eyebrow}</span>
              )}
              <h1 className={styles.title}>{b.title}</h1>
              {b.script && (
                <span
                  className={`${styles.script} ${
                    styles[`scriptStyle_${b.scriptStyle || "script"}`] || ""
                  }`}
                >
                  {b.script}
                </span>
              )}
              <p className={styles.subtitle}>{b.subtitle}</p>
              <div className={styles.ctaRow}>
                {primaryCta && (
                  <a href={primaryCta.href} className={styles.cta}>
                    <span>{primaryCta.label}</span>
                    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
                {secondaryCta && (
                  <a href={secondaryCta.href} className={styles.ctaGhost}>
                    {secondaryCta.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <div
          className={styles.dots}
          role="tablist"
          aria-label="Hero slides"
        >
          {banners.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Show slide ${i + 1}: ${slide.indexLabel || slide.id}`}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      <span className={styles.scrollCue}>Scroll</span>
    </section>
  );
}
