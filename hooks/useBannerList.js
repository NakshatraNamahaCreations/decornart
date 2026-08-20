"use client";

import { useEffect, useState } from "react";
import { listBanners } from "@/lib/api/banners";

// Multi-banner variant of useBannerImage. Fetches every active banner in
// `slot` and returns the full row array so callers can render one card per
// row. Returns `fallback` when the admin hasn't added any banners yet.
const memory = new Map();
const STORAGE_PREFIX = "decornart:banner-list:";

function readStored(slot) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage?.getItem(STORAGE_PREFIX + slot);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(slot, rows) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage?.setItem(STORAGE_PREFIX + slot, JSON.stringify(rows));
  } catch {
    /* quota / private mode — module cache still works this tab */
  }
}

/**
 * Returns { rows, isFallback }. `rows` is either the admin-published banner
 * list for `slot` (mapped through `mapRow` if provided) or `fallback` when
 * the admin hasn't published any. `isFallback` lets the caller branch on
 * things that don't apply to admin rows (e.g. custom text colour presets).
 */
export function useBannerList(slot, fallback, mapRow) {
  const cached = memory.get(slot) ?? readStored(slot);
  const [rows, setRows] = useState(cached);

  useEffect(() => {
    let cancelled = false;
    listBanners(slot)
      .then((next) => {
        if (cancelled) return;
        if (Array.isArray(next) && next.length > 0) {
          memory.set(slot, next);
          writeStored(slot, next);
          setRows(next);
        }
      })
      .catch(() => {
        /* silent — fallback keeps the UI intact */
      });
    return () => {
      cancelled = true;
    };
  }, [slot]);

  if (Array.isArray(rows) && rows.length > 0) {
    return {
      rows: mapRow ? rows.map(mapRow) : rows,
      isFallback: false,
    };
  }
  return { rows: fallback, isFallback: true };
}

export default useBannerList;
