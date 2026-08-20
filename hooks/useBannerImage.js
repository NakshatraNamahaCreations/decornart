"use client";

import { useEffect, useState } from "react";
import { listBanners } from "@/lib/api/banners";

// Per-slot cache lives outside the hook so it survives unmounts (SPA nav)
// and — via sessionStorage — page reloads too. Without this, every fresh
// mount briefly renders the hardcoded fallback while the API re-fetches,
// causing a flash of the old image.
//
// Both positive results (backend URL) AND negative results ("__none__")
// are cached, so subsequent visits render the correct image immediately
// — either the admin's real image, or the bundled fallback — never a
// flash of the wrong one.
const memory = new Map();
const STORAGE_PREFIX = "decornart:banner-image:";
const NONE = "__none__";

function readStored(slot) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage?.getItem(STORAGE_PREFIX + slot);
    return raw || null;
  } catch {
    return null;
  }
}

function writeStored(slot, value) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.sessionStorage?.setItem(STORAGE_PREFIX + slot, value);
    else window.sessionStorage?.removeItem(STORAGE_PREFIX + slot);
  } catch {
    /* quota / private mode — module cache is still fine for this tab */
  }
}

/**
 * Fetches the active banner for `slot` and returns the admin-uploaded image
 * URL if one exists, otherwise `fallback`. Used by page-hero components so
 * an admin can swap the background without a code change while the page
 * still renders normally if no banner has been published.
 *
 * First-ever visit with a real banner uploaded returns `null` briefly
 * (until the fetch resolves) so the caller can render nothing / an empty
 * background instead of flashing the bundled fallback. Cached visits are
 * synchronous with no flash.
 */
export function useBannerImage(slot, fallback) {
  const cached = memory.get(slot) ?? readStored(slot);
  const [src, setSrc] = useState(() => {
    if (cached === NONE) return fallback ?? null;
    if (cached) return cached;
    return null;
  });

  useEffect(() => {
    let cancelled = false;
    listBanners(slot)
      .then((rows) => {
        if (cancelled) return;
        const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        const next = row?.image || "";
        if (next) {
          memory.set(slot, next);
          writeStored(slot, next);
          setSrc(next);
        } else {
          // Confirmed there's no banner for this slot — cache the
          // negative result so the next visit renders the fallback
          // instantly (no flash), and switch to the fallback now.
          memory.set(slot, NONE);
          writeStored(slot, NONE);
          setSrc(fallback ?? null);
        }
      })
      .catch(() => {
        // On error keep the current src (null on first visit) — better
        // an empty hero briefly than a fallback → real image swap.
      });
    return () => {
      cancelled = true;
    };
  }, [slot, fallback]);

  return src;
}

export default useBannerImage;
