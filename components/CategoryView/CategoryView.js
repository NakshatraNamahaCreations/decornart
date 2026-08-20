"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { categories as localCategories } from "@/lib/data/categories";
import { resolveProductImage } from "@/lib/productImages";
import { hexForColorWithOverrides } from "@/lib/colorSwatches";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import ProductCard from "@/components/ui/ProductCard/ProductCard";
import styles from "./CategoryView.module.css";

// Backend list is the source of truth. Fall back to the static list only if
// the fetch fails (empty prop) so the switcher never renders blank.
const LOCAL_FALLBACK = localCategories.map((c) => ({
  slug: c.id,
  name: c.name,
}));

// Walk every product's `colorSwatches` array and collapse them into a
// single { "color name" → "#hex" } lookup so the palette can render
// admin-picked custom hexes without a hardcoded map here. Case-preserving
// on the key so it matches whatever the admin typed.
function buildSwatchOverrides(products) {
  const overrides = {};
  for (const p of products) {
    const rows = Array.isArray(p?.colorSwatches) ? p.colorSwatches : [];
    for (const row of rows) {
      if (row?.color && row?.hex && !overrides[row.color]) {
        overrides[row.color] = row.hex;
      }
    }
  }
  return overrides;
}

// Categories that expose the colour palette. `mode` picks the click
// behaviour: "filter" narrows the grid in place; "navigate" jumps straight
// to the single product with that shade. Both crochet and pipe-cleaner
// pages use "filter" — the storefront's ProductView still handles the
// per-product colour switcher separately.
const COLOR_CATEGORIES = {
  "pipe-cleaners": { mode: "filter" },
  "crochet-materials": { mode: "filter" },
};

export default function CategoryView({ category, products, categories = [] }) {
  const switcherItems = categories.length > 0 ? categories : LOCAL_FALLBACK;
  const root = useRef(null);
  const stripRef = useRef(null);
  const resultsRef = useRef(null);
  const router = useRouter();
  const { addItem } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();
  const [adding, setAdding] = useState(() => new Set());
  const [selectedColor, setSelectedColor] = useState(null);

  // Reset the color filter whenever the shopper switches category — carrying
  // "red" from pipe-cleaners into gift-cards would silently hide everything.
  useEffect(() => {
    setSelectedColor(null);
  }, [category.slug]);

  const colorConfig = COLOR_CATEGORIES[category?.slug];
  const showColorFilter = !!colorConfig;
  const colorMode = colorConfig?.mode || "filter";

  // Merge every product's admin-defined hex overrides so custom shades
  // (colours not in the static COLOR_HEX preset map) still render as the
  // correct chip in the palette.
  const swatchOverrides = useMemo(
    () => (showColorFilter ? buildSwatchOverrides(products) : {}),
    [products, showColorFilter]
  );

  // Unique colour list for the sidebar — built from each product's
  // PRIMARY colour (colors[0]) only. Later entries in `colors` represent
  // sibling variants shown by the product-page swatch picker and must
  // not add extra chips to the category-level filter (that used to let
  // a white yarn appear under a "Dark Green" filter because it listed
  // Dark Green as a sibling swatch).
  const palette = useMemo(() => {
    if (!showColorFilter) return [];
    const seen = new Map();
    for (const p of products) {
      const primary = Array.isArray(p.colors) ? p.colors[0] : null;
      if (!primary) continue;
      const key = String(primary).trim().toLowerCase();
      if (!seen.has(key)) seen.set(key, String(primary).trim());
    }
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
  }, [products, showColorFilter]);

  const cards = useMemo(() => {
    const filtered = !selectedColor
      ? products
      : products.filter((p) => {
          // Strict match on the product's own primary shade. Sibling
          // variant colours listed later in `colors` don't qualify the
          // product for the category filter.
          const primary = Array.isArray(p.colors) ? p.colors[0] : null;
          if (!primary) return false;
          return String(primary).trim().toLowerCase() === selectedColor;
        });
    return filtered.map((p) => ({ ...p, image: resolveProductImage(p) }));
  }, [products, selectedColor]);

  const pickColor = (color) => {
    const key = String(color).trim().toLowerCase();

    // "navigate" categories (e.g. crochet-materials) treat each colour as
    // its own product — jump straight to that SKU's detail page instead of
    // filtering the grid.
    if (colorMode === "navigate") {
      const match = products.find((p) => {
        const colors = Array.isArray(p.colors) ? p.colors : [];
        return colors.some(
          (c) => String(c).trim().toLowerCase() === key
        );
      });
      if (match) {
        router.push(`/product/${match.slug || match.id}`);
      }
      return;
    }

    // Default "filter" behaviour — click the active swatch again to
    // deselect for one-click clear.
    setSelectedColor((prev) => (prev === key ? null : key));
  };

  const clearColors = () => setSelectedColor(null);

  // On a fresh colour pick, bring the results section to the top of the
  // viewport so the shopper sees the filtered grid immediately.
  useEffect(() => {
    if (!selectedColor) return;
    const el = resultsRef.current;
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedColor]);

  // Bring the active chip into view so users land with their category centred.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector(`[data-active="true"]`);
    if (active && typeof active.scrollIntoView === "function") {
      active.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    }
  }, [category.slug]);

  const handleAddToCart = async (productId) => {
    setAdding((prev) => new Set(prev).add(productId));
    try {
      await addItem(productId, 1);
    } catch {
      /* silent */
    }
  };

  const wishlistSet = useMemo(
    () => ({ has: (productId) => isWished(productId) }),
    [isWished]
  );
  const addedSet = useMemo(() => ({ has: (id) => adding.has(id) }), [adding]);

  useGSAP(
    () => {
      gsap.from(`.${styles.heroEyebrow}, .${styles.heroTitle}, .${styles.heroScript}, .${styles.heroLead}, .${styles.heroMeta}, .${styles.heroCta}`, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(`.${styles.heroImage}`, {
        scale: 1.08,
        duration: 1.6,
        ease: "power3.out",
      });
      gsap.from(`.${styles.cell}`, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 88%" },
      });
    },
    { scope: root, dependencies: [category.slug] }
  );

  return (
    <main ref={root} className={styles.page}>
      {/* ── Editorial banner ──
         Admin-published copy (category.bannerContent) wins field-by-field,
         with category name/description as fallbacks so a partial banner
         still renders sensibly. */}
      {(() => {
        const bc = category.bannerContent || {};
        const eyebrow = bc.eyebrow || "The collection";
        const title = bc.title || category.name;
        const lead = bc.subtitle || category.description;
        const scriptText = bc.script || "";
        const scriptStyle = bc.scriptStyle || "script";
        const ctaLabel = bc.ctaLabel || "";
        const ctaHref = bc.href || "";
        return (
          <section className={styles.hero}>
            {category.banner || category.image ? (
              <div className={styles.heroImage}>
                <Image
                  src={category.banner || category.image}
                  alt={title}
                  fill
                  priority
                  sizes="100vw"
                  className={styles.heroImg}
                />
              </div>
            ) : null}
            <span className={styles.heroScrim} aria-hidden="true" />

            <div className={`container ${styles.heroInner}`}>
              <nav className={styles.crumbs} aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span aria-hidden="true">/</span>
                <a href="/categories">Categories</a>
                <span aria-hidden="true">/</span>
                <span className={styles.crumbsActive}>{category.name}</span>
              </nav>

              <span className={styles.heroEyebrow}>{eyebrow}</span>
              <h1 className={styles.heroTitle}>{title}</h1>
              {scriptText && (
                <span
                  className={`${styles.heroScript} ${styles["heroScript_" + scriptStyle] || ""}`}
                >
                  {scriptText}
                </span>
              )}
              {lead && <p className={styles.heroLead}>{lead}</p>}
              <span className={styles.heroMeta}>
                {String(category.count).padStart(2, "0")} {category.count === 1 ? "piece" : "pieces"} in this edit
              </span>
              {ctaLabel && ctaHref && (
                <a href={ctaHref} className={styles.heroCta}>
                  {ctaLabel} <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </section>
        );
      })()}

      {/* ── Sticky category switcher ── */}
      <div className={styles.switcherWrap}>
        <div className="container">
          <div ref={stripRef} className={styles.switcher} role="tablist" aria-label="Switch category">
            {switcherItems.map((c) => {
              const active = c.slug === category.slug;
              return (
                <a
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  role="tab"
                  aria-selected={active}
                  data-active={active}
                  className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                >
                  {c.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <section ref={resultsRef} className={styles.results}>
        <div className="container" style={{ maxWidth: "1480px" }}>
          <div className={styles.resultsHead}>
            <h2 className={styles.resultsTitle}>
              Shop <em>{category.name.toLowerCase()}</em>
            </h2>
            <span className={styles.resultsCount}>
              {cards.length} {cards.length === 1 ? "product" : "products"}
              {selectedColor ? ` · ${selectedColor}` : ""}
            </span>
          </div>

          <div className={palette.length > 0 ? styles.layout : ""}>
            {palette.length > 0 && (
              <aside className={styles.paletteSidebar} aria-label="Filter by colour">
                <div className={styles.paletteHead}>
                  <h3 className={styles.paletteTitle}>Colour</h3>
                  {selectedColor && (
                    <button
                      type="button"
                      onClick={clearColors}
                      className={styles.paletteClear}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <ul className={styles.paletteList}>
                  {palette.map((color) => {
                    const key = color.toLowerCase();
                    const active = selectedColor === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => pickColor(color)}
                          aria-pressed={active}
                          className={`${styles.swatchBtn} ${active ? styles.swatchActive : ""}`}
                        >
                          <span
                            className={styles.swatchDot}
                            style={{ background: hexForColorWithOverrides(color, swatchOverrides) }}
                            aria-hidden="true"
                          />
                          <span className={styles.swatchLabel}>{color}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            )}

            <div className={styles.resultsBody}>
              {cards.length === 0 ? (
                <div className={styles.empty}>
                  <h3 className={styles.emptyTitle}>
                    {selectedColor ? "No matches for that palette." : "Restocking soon."}
                  </h3>
                  <p className={styles.emptyCopy}>
                    {selectedColor
                      ? "Try clearing the colour filter or picking a different shade."
                      : "We're refreshing this category. Browse our other supplies in the meantime."}
                  </p>
                  {selectedColor ? (
                    <button
                      type="button"
                      onClick={clearColors}
                      className={styles.emptyAction}
                    >
                      Clear colour filter
                    </button>
                  ) : (
                    <a href="/categories" className={styles.emptyAction}>
                      See all categories <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className={styles.grid}>
                  {cards.map((p, i) => (
                    <div key={p.id} className={styles.cell}>
                      <ProductCard
                        product={p}
                        isWished={wishlistSet.has(p.id)}
                        isAdded={addedSet.has(p.id)}
                        onToggleWishlist={toggleWish}
                        onAddToCart={handleAddToCart}
                        sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={i < 4}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
