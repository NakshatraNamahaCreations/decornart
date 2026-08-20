"use client";

import { useEffect, useState } from "react";
import { listBanners } from "@/lib/api/banners";

// Full-record variant of useBannerImage. Returns the entire top-priority
// admin-published banner row for `slot` — image plus all editorial fields
// (eyebrow, title, script, scriptStyle, subtitle, ctaLabel, href,
// imageMobile). Each field is either the admin value or "" so callers can
// fall back with a simple `banner.title || "Fallback title"` expression.
//
// Cache mirrors useBannerImage: per-slot module cache + sessionStorage so
// SPA navigations and page reloads never flash the fallback copy after the
// first successful fetch.
const memory = new Map();
const STORAGE_PREFIX = "decornart:banner-content:";

const EMPTY = Object.freeze({
  image: "",
  imageMobile: "",
  eyebrow: "",
  title: "",
  script: "",
  scriptStyle: "script",
  subtitle: "",
  ctaLabel: "",
  href: "",
  loaded: false,
});
const NONE = Object.freeze({ ...EMPTY, loaded: true });

function normalize(row) {
  if (!row || typeof row !== "object") return NONE;
  return {
    image: row.image || "",
    imageMobile: row.imageMobile || "",
    eyebrow: row.eyebrow || "",
    title: row.title || "",
    script: row.script || "",
    scriptStyle: row.scriptStyle || "script",
    subtitle: row.subtitle || "",
    ctaLabel: row.ctaLabel || "",
    href: row.href || "",
    loaded: true,
  };
}

function readStored(slot) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage?.getItem(STORAGE_PREFIX + slot);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStored(slot, value) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage?.setItem(STORAGE_PREFIX + slot, JSON.stringify(value));
  } catch {
    /* quota / private mode — module cache is still fine for this tab */
  }
}

// Attach a `text(field, fallback)` helper so callers can write
//   {banner.text("title", "Fallback title")}
// and never see the fallback flash to the admin's real copy: while
// `loaded === false` we return "" (empty text, JSX shape preserved),
// and once loaded we return either the backend value or the fallback.
function withHelpers(row) {
  return {
    ...row,
    text(field, fallback) {
      if (!row.loaded) return "";
      return row[field] || fallback || "";
    },
  };
}

export function useBannerContent(slot) {
  const cached = memory.get(slot) ?? readStored(slot);
  // Start with EMPTY (loaded: false) so callers can distinguish
  // "haven't fetched yet" from "fetched, backend has no banner"
  // (NONE = same shape but loaded: true).
  const [row, setRow] = useState(cached || EMPTY);

  useEffect(() => {
    let cancelled = false;
    listBanners(slot)
      .then((rows) => {
        if (cancelled) return;
        const top = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        if (top) {
          const next = normalize(top);
          memory.set(slot, next);
          writeStored(slot, next);
          setRow(next);
        } else {
          // Confirmed the slot is empty — cache that so subsequent
          // visits render the caller's fallback with no flash, and
          // flip to `loaded: true` now so `.loaded` gates render.
          memory.set(slot, NONE);
          writeStored(slot, NONE);
          setRow(NONE);
        }
      })
      .catch(() => {
        // Backend unreachable / slot 500 — flip to NONE so callers gate on
        // `loaded` render their static fallback instead of an empty hero.
        // We don't cache the failure so the next mount can retry.
        if (cancelled) return;
        setRow(NONE);
      });
    return () => {
      cancelled = true;
    };
  }, [slot]);

  return withHelpers(row);
}

export default useBannerContent;