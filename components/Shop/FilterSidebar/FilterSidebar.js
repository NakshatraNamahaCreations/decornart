"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import corporateGiftIcon from "@/assets/corporate-gift-icon.png";
import craftIcon from "@/assets/craft-icon.png";
import crochetIcon from "@/assets/crochet-icon.png";
import flowerIcon from "@/assets/flower-icon.png";
import homeAccentsIcon from "@/assets/home-accents.png";
import pipeCleanerIcon from "@/assets/pipe-cleaner-icon.png";
import ribbonsIcon from "@/assets/ribbon-icon.png";
import wrapperIcon from "@/assets/wrapper-icon.png";
import plantIcon from "@/assets/plant.png";
import giftBoxIcon from "@/assets/gift-box.jpeg";
import giftCardIcon from "@/assets/gift-card.jpeg";
import basketIcon from "@/assets/basket.png";
import styles from "./FilterSidebar.module.css";

const SIZE_OPTIONS = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

// Generic grid SVG reserved for the "All Products" row.
const CATEGORY_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="26"
    height="26"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
  </svg>
);

// Per-slug icon images pulled from /assets. Keys must match the category
// slug the backend serves. Any slug not listed here falls back to the
// generic grid SVG above, so admin-added categories still render safely.
const CATEGORY_ICON_IMAGES = {
  "flower-basket-materials": basketIcon,
  "floral-gift-collections": flowerIcon,
  "gift-cards": giftCardIcon,
  "gift-box": giftBoxIcon,
  "corporate-gifts": corporateGiftIcon,
  "gift-cards": corporateGiftIcon,
  "corporate-gifting": corporateGiftIcon,
  corporate: corporateGiftIcon,
  "pipe-cleaners": pipeCleanerIcon,
  "craft-essentials": craftIcon,
  "crochet-materials": crochetIcon,
  ribbons: ribbonsIcon,
  "ribbons-collection": ribbonsIcon,
  "wrapping-papers": wrapperIcon,
  "premium-wraps": wrapperIcon,
  "home-accents": homeAccentsIcon,
  "artificial-plants": plantIcon,
};

const renderImageIcon = (img) => (
  <Image
    src={img}
    alt=""
    width={32}
    height={32}
    className={styles.catIconImg}
    unoptimized
  />
);

// Keyword → icon fallback. When the admin's category slug isn't in
// CATEGORY_ICON_IMAGES (e.g. they chose "corporate-gift" instead of
// "corporate-gifts", or "home-accent" instead of "home-accents"), match
// against the visible label so the icon still resolves. Ordered so the
// more specific keywords win — "premium wraps" hits "wrap" before
// falling through to the generic gift branch.
const LABEL_KEYWORD_ICONS = [
  { keyword: "corporate", icon: corporateGiftIcon },
  { keyword: "floral", icon: flowerIcon },
  { keyword: "flower", icon: flowerIcon },
  { keyword: "bouquet", icon: flowerIcon },
  { keyword: "home", icon: homeAccentsIcon },
  { keyword: "wrap", icon: wrapperIcon },
  { keyword: "sheet", icon: wrapperIcon },
  { keyword: "paper", icon: wrapperIcon },
  { keyword: "crochet", icon: crochetIcon },
  { keyword: "yarn", icon: crochetIcon },
  { keyword: "pipe", icon: pipeCleanerIcon },
  { keyword: "chenille", icon: pipeCleanerIcon },
  { keyword: "craft", icon: craftIcon },
  { keyword: "essential", icon: craftIcon },
  { keyword: "ribbon", icon: ribbonsIcon },
  { keyword: "plant", icon: plantIcon },
  { keyword: "planter", icon: plantIcon },
  { keyword: "card", icon: giftCardIcon },
  { keyword: "box", icon: giftBoxIcon },
  { keyword: "basket", icon: basketIcon },
  { keyword: "gift", icon: corporateGiftIcon },
];

const iconFor = (slug, label = "") => {
  const bySlug = CATEGORY_ICON_IMAGES[slug];
  if (bySlug) return renderImageIcon(bySlug);
  const lower = String(label).toLowerCase();
  if (lower) {
    for (const { keyword, icon } of LABEL_KEYWORD_ICONS) {
      if (lower.includes(keyword)) return renderImageIcon(icon);
    }
  }
  return CATEGORY_ICON;
};

export default function FilterSidebar({
  categoryOptions,
  occasionOptions = [],
  priceRanges,
  filters,
  activeFilterCount,
  products = [],
  availableColors = [],
  colorHex = {},
  availabilityOptions = [],
  materialOptions = [],
  onToggleCategory,
  onToggleOccasion,
  onToggleColor,
  onSetPriceRange,
  onSetAvailability,
  onToggleMaterial,
  onClear,
  isDrawerOpen,
  onCloseDrawer,
}) {
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const p of products) {
      if (!p?.category) continue;
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);
  // Sort categories by product count (descending) so the busiest ones
  // sit at the top of the sidebar. Ties keep the incoming order stable
  // (`.sort` is stable in modern engines).
  const sortedCategoryOptions = useMemo(
    () =>
      [...categoryOptions].sort(
        (a, b) => (categoryCounts[b.id] ?? 0) - (categoryCounts[a.id] ?? 0)
      ),
    [categoryOptions, categoryCounts]
  );
  const totalProducts = products.length;
  const closeBtnRef = useRef(null);
  const [sizeSel, setSizeSel] = useState(new Set());
  const [colorsExpanded, setColorsExpanded] = useState(false);
  const colorSelected = useMemo(
    () => new Set(filters.colors || []),
    [filters.colors]
  );
  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onCloseDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDrawerOpen, onCloseDrawer]);

  // Collapsible sections — each key defaults to open. Clicking the
  // header caret toggles the panel.
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    availability: true,
    material: true,
    occasion: true,
    color: true,
  });
  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const categorySelected = new Set(filters.categories);
  const visibleColors = colorsExpanded
    ? availableColors
    : availableColors.slice(0, 14);

  const toggleSet = (setState, id) =>
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const clearAll = () => {
    onClear();
    setSizeSel(new Set());
  };

  return (
    <>
      <aside
        className={`${styles.sidebar} ${isDrawerOpen ? styles.open : ""}`}
        aria-label="Filters"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Filters</span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onCloseDrawer}
            className={styles.drawerClose}
            aria-label="Close filters"
          >
            &#10005;
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.head}>
            <span className={styles.headTitle}>Filters</span>
            <button type="button" className={styles.clear} onClick={clearAll}>
              Clear all
            </button>
          </div>

          {/* Categories */}
          <section className={styles.section}>
            <button
              type="button"
              className={styles.sectionToggle}
              onClick={() => toggleSection("categories")}
              aria-expanded={openSections.categories}
              aria-controls="filter-section-categories"
            >
              <span className={styles.sectionTitle}>Categories</span>
              <span
                className={`${styles.sectionCaret} ${
                  openSections.categories ? styles.sectionCaretOpen : ""
                }`}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            {openSections.categories && (
            <ul id="filter-section-categories" className={styles.categoryList}>
              <li>
                <button
                  type="button"
                  className={`${styles.categoryRow} ${
                    categorySelected.size === 0 ? styles.categoryRowActive : ""
                  }`}
                  onClick={clearAll}
                >
                  <span className={styles.catIcon}>{CATEGORY_ICON}</span>
                  <span className={styles.catLabel}>All Products</span>
                  <span className={styles.catCount}>{totalProducts}</span>
                </button>
              </li>
              {sortedCategoryOptions.map((opt) => {
                const active = categorySelected.has(opt.id);
                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      className={`${styles.categoryRow} ${
                        active ? styles.categoryRowActive : ""
                      }`}
                      onClick={() => onToggleCategory(opt.id)}
                    >
                      <span className={styles.catIcon}>{iconFor(opt.id, opt.label)}</span>
                      <span className={styles.catLabel}>{opt.label}</span>
                      <span className={styles.catCount}>
                        {categoryCounts[opt.id] ?? 0}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            )}
          </section>

          {/* Price range — snap slider. Drag the handle along the line to
              step through the discrete buckets (id-based filter state is
              preserved, so URL/analytics don't change). Tooltip above the
              thumb reflects the live selection. */}
          <section className={styles.section}>
            <button
              type="button"
              className={styles.sectionToggle}
              onClick={() => toggleSection("price")}
              aria-expanded={openSections.price}
              aria-controls="filter-section-price"
            >
              <span className={styles.sectionTitle}>Price Range</span>
              <span
                className={`${styles.sectionCaret} ${
                  openSections.price ? styles.sectionCaretOpen : ""
                }`}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            {openSections.price && (() => {
              // idx 0 = "Any price" (clears filter). idx 1..N picks the
              // matching bucket by index into priceRanges.
              const stops = priceRanges.length;
              const currentIdx = filters.priceRangeId
                ? priceRanges.findIndex((r) => r.id === filters.priceRangeId) + 1
                : 0;
              const currentLabel =
                currentIdx === 0 ? "Any price" : priceRanges[currentIdx - 1].label;
              const pct = (currentIdx / stops) * 100;

              return (
                <div
                  id="filter-section-price"
                  className={styles.priceSlider}
                >
                  <div
                    className={styles.priceTooltip}
                    style={{ left: `${pct}%` }}
                  >
                    {currentLabel}
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={stops}
                    step={1}
                    value={currentIdx}
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      onSetPriceRange(idx === 0 ? null : priceRanges[idx - 1].id);
                    }}
                    className={styles.priceRange}
                    style={{
                      background: `linear-gradient(to right, var(--plum-accent) 0% ${pct}%, var(--border) ${pct}% 100%)`,
                    }}
                    aria-label="Price range"
                    aria-valuetext={currentLabel}
                  />
                  <div className={styles.priceTicks} aria-hidden="true">
                    <span>Any</span>
                    <span>₹299</span>
                    <span>₹599</span>
                    <span>₹999</span>
                    <span>₹999+</span>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Availability — In Stock / Out of Stock / New Arrival / Best
              Seller. Single-select radio-style pills (reuses pricePill
              styling for consistency). */}
          {availabilityOptions.length > 0 && (
            <section className={styles.section}>
              <button
                type="button"
                className={styles.sectionToggle}
                onClick={() => toggleSection("availability")}
                aria-expanded={openSections.availability}
                aria-controls="filter-section-availability"
              >
                <span className={styles.sectionTitle}>Availability</span>
                <span
                  className={`${styles.sectionCaret} ${
                    openSections.availability ? styles.sectionCaretOpen : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              {openSections.availability && (
                <ul
                  id="filter-section-availability"
                  className={styles.availabilityList}
                >
                  {availabilityOptions.map((opt) => {
                    const active = Array.isArray(filters.availability)
                      ? filters.availability.includes(opt.id)
                      : false;
                    return (
                      <li key={opt.id}>
                        <label
                          className={`${styles.availabilityRow} ${
                            active ? styles.availabilityRowActive : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className={styles.availabilityCheckbox}
                            checked={active}
                            onChange={() =>
                              onSetAvailability && onSetAvailability(opt.id)
                            }
                          />
                          <span className={styles.availabilityLabel}>
                            {opt.label}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {/* Material — Paper / Wood / Cotton / Glass / Jute. Multi-
              select checkbox facet backed by the product's `materials`
              array. Reuses the Availability checkbox styling. */}
          {materialOptions.length > 0 && (
            <section className={styles.section}>
              <button
                type="button"
                className={styles.sectionToggle}
                onClick={() => toggleSection("material")}
                aria-expanded={openSections.material}
                aria-controls="filter-section-material"
              >
                <span className={styles.sectionTitle}>Material</span>
                <span
                  className={`${styles.sectionCaret} ${
                    openSections.material ? styles.sectionCaretOpen : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              {openSections.material && (
                <ul
                  id="filter-section-material"
                  className={styles.availabilityList}
                >
                  {materialOptions.map((opt) => {
                    const active = Array.isArray(filters.materials)
                      ? filters.materials.includes(opt.id)
                      : false;
                    return (
                      <li key={opt.id}>
                        <label
                          className={`${styles.availabilityRow} ${
                            active ? styles.availabilityRowActive : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className={styles.availabilityCheckbox}
                            checked={active}
                            onChange={() =>
                              onToggleMaterial && onToggleMaterial(opt.id)
                            }
                          />
                          <span className={styles.availabilityLabel}>
                            {opt.label}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {/* Occasion — Birthday, Anniversary, Wedding, Baby Shower,
              House Warming, Festivals. Multi-select checkbox facet
              backed by the product's `occasions` array. */}
          {occasionOptions.length > 0 && (
            <section className={styles.section}>
              <button
                type="button"
                className={styles.sectionToggle}
                onClick={() => toggleSection("occasion")}
                aria-expanded={openSections.occasion}
                aria-controls="filter-section-occasion"
              >
                <span className={styles.sectionTitle}>Occasion</span>
                <span
                  className={`${styles.sectionCaret} ${
                    openSections.occasion ? styles.sectionCaretOpen : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              {openSections.occasion && (
                <ul
                  id="filter-section-occasion"
                  className={styles.availabilityList}
                >
                  {occasionOptions.map((opt) => {
                    const active = Array.isArray(filters.occasions)
                      ? filters.occasions.includes(opt.id)
                      : false;
                    return (
                      <li key={opt.id}>
                        <label
                          className={`${styles.availabilityRow} ${
                            active ? styles.availabilityRowActive : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className={styles.availabilityCheckbox}
                            checked={active}
                            onChange={() =>
                              onToggleOccasion && onToggleOccasion(opt.id)
                            }
                          />
                          <span className={styles.availabilityLabel}>
                            {opt.label}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {/* Color palette — sourced from the actual color variants admins
              set on products via the /api/products response. */}
          {availableColors.length > 0 && (
            <section className={styles.section}>
              <button
                type="button"
                className={styles.sectionToggle}
                onClick={() => toggleSection("color")}
                aria-expanded={openSections.color}
                aria-controls="filter-section-color"
              >
                <span className={styles.sectionTitle}>Color</span>
                <span
                  className={`${styles.sectionCaret} ${
                    openSections.color ? styles.sectionCaretOpen : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              {openSections.color && (
              <>
              <ul id="filter-section-color" className={styles.colorGrid}>
                {visibleColors.map((name) => {
                  const hex = colorHex[name] || "#c9c9c9";
                  const on = colorSelected.has(name);
                  return (
                    <li key={name} className={styles.colorItem}>
                      <button
                        type="button"
                        className={`${styles.colorSwatch} ${
                          on ? styles.colorSwatchActive : ""
                        }`}
                        style={{ background: hex }}
                        onClick={() => onToggleColor && onToggleColor(name)}
                        aria-label={`Filter by ${name}`}
                        aria-pressed={on}
                        title={name}
                      />
                      <span className={styles.colorName}>{name}</span>
                    </li>
                  );
                })}
              </ul>
              {availableColors.length > 14 && (
                <button
                  type="button"
                  className={styles.viewMore}
                  onClick={() => setColorsExpanded((v) => !v)}
                >
                  {colorsExpanded ? "− View less" : "+ View more"}
                </button>
              )}
              </>
              )}
            </section>
          )}

          {/* Size chips */}
          {/* <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Size</h3>
            <div className={styles.sizeChips}>
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`${styles.sizeChip} ${
                    sizeSel.has(s.id) ? styles.sizeChipActive : ""
                  }`}
                  onClick={() => toggleSet(setSizeSel, s.id)}
                  aria-pressed={sizeSel.has(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section> */}

          <button
            type="button"
            className={styles.clearAllBtn}
            onClick={clearAll}
          >
            <span aria-hidden="true" className={styles.clearIcon}>
              &#8635;
            </span>
            Clear All Filters
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
        </div>

        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.apply}
            onClick={onCloseDrawer}
          >
            Show results
          </button>
        </div>
      </aside>

      {isDrawerOpen ? (
        <button
          type="button"
          aria-label="Close filters"
          className={styles.scrim}
          onClick={onCloseDrawer}
          tabIndex={-1}
        />
      ) : null}
    </>
  );
}
