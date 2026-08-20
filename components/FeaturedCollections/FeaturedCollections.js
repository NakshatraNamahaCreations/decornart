"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { categories as fallbackCategories } from "@/lib/data/categories";
import { listCategories } from "@/lib/api/categories";
import styles from "./FeaturedCollections.module.css";

// SessionStorage cache lives outside the component so SPA re-mounts and
// same-tab refreshes render the last-known list synchronously — no flash of
// the hardcoded fallback while the API re-fetches.
const CACHE_KEY = "decornart:featured-categories";
let cachedRows = null;

function loadCache() {
  if (typeof window === "undefined") return null;
  if (cachedRows) return cachedRows;
  try {
    const raw = window.sessionStorage?.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedRows = parsed;
      return parsed;
    }
  } catch {
    /* corrupt storage — ignore */
  }
  return null;
}

function saveCache(rows) {
  cachedRows = rows;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage?.setItem(CACHE_KEY, JSON.stringify(rows));
  } catch {
    /* quota / private mode */
  }
}

// The admin can leave `image` blank on a category. When that happens we try
// to reuse the bundled asset for the matching hardcoded slug so the tile
// still renders something rather than an empty arch.
const FALLBACK_IMAGE_BY_SLUG = fallbackCategories.reduce((acc, c) => {
  acc[c.id] = c.image;
  return acc;
}, {});

function fromApiRow(row) {
  return {
    slug: row.slug,
    name: row.name,
    image: row.image || FALLBACK_IMAGE_BY_SLUG[row.slug] || "",
  };
}

// Fallback list uses `id` for the slug — normalise so both branches render
// through the same JSX.
const FALLBACK_ROWS = fallbackCategories.map((c) => ({
  slug: c.id,
  name: c.name,
  image: c.image,
}));

export default function FeaturedCollections() {
  const root = useRef(null);
  const gridRef = useRef(null);
  const [rows, setRows] = useState(() => {
    const cached = loadCache();
    return cached ? cached.map(fromApiRow) : FALLBACK_ROWS;
  });

  useEffect(() => {
    let cancelled = false;
    listCategories()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          saveCache(data);
          setRows(data.map(fromApiRow));
        }
      })
      .catch(() => {
        /* silent — fallback stays visible */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      const cards = gridRef.current.querySelectorAll("[data-reveal]");
      gsap.from(cards, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
      });
    },
    { scope: root, dependencies: [rows.length] }
  );

  return (
    <section ref={root} id="categories" className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <header className={styles.head}>
          <h2 className={styles.heading}>Shop by Category</h2>
        </header>

        <div ref={gridRef} className={styles.grid}>
          {rows.map((c) => (
            <a
              key={c.slug}
              href={`/category/${c.slug}`}
              className={styles.card}
              aria-label={`Browse ${c.name}`}
              data-reveal
            >
              <span className={styles.arch}>
                {c.image && (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 560px) 45vw, (max-width: 900px) 30vw, 14vw"
                    className={styles.archImg}
                  />
                )}
              </span>
              <span className={styles.foot}>
                <span className={styles.name}>{c.name}</span>
                <span className={styles.shopNow}>
                  Shop now
                  <span className={styles.arrowSvg} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path
                        d="M5 12h14m-6-6 6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
