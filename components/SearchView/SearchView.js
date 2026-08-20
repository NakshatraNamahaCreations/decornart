"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaStar, FaFire } from "react-icons/fa";
import {
  FiSearch,
  FiCamera,
  FiMic,
  FiGrid,
  FiList,
  FiHeart,
  FiShoppingBag,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEye,
  FiX,
  FiZap,
  FiGift,
  FiArrowRight,
  FiShield,
  FiRotateCcw,
  FiUsers,
  FiSliders,
} from "react-icons/fi";
import heroImg from "@/assets/orderbg.png";
import {
  searchHero,
  searchModes,
  trendingSearches,
  recentlyViewed,
  recentSearches,
  collectionsToExplore,
  filterGroups,
  products,
  sortOptions,
  searchMeta,
  pagination,
  trustStrip,
  customOrder,
} from "@/lib/data/searchDemo";
import styles from "./SearchView.module.css";

const MODE_ICONS = {
  ai: <FiZap />,
  image: <FiCamera />,
  voice: <FiMic />,
  category: <FiGrid />,
};

const TRUST_ICONS = {
  checkout: <FiShield />,
  beautiful: <FaHeart />,
  returns: <FiRotateCcw />,
  happy: <FiUsers />,
};

function Stars({ value, size = 12 }) {
  return (
    <span
      className={styles.stars}
      style={{ fontSize: `${size}px` }}
      aria-label={`${value} out of 5 stars`}
    >
      <FaStar aria-hidden="true" />
      <span>{value.toFixed(1)}</span>
    </span>
  );
}

export default function SearchView() {
  const root = useRef(null);
  const [query, setQuery] = useState(searchMeta.query);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState(sortOptions[0]);
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState(2000);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [wishlist, setWishlist] = useState(() => new Set());
  const [recentQueries, setRecentQueries] = useState(recentSearches);
  const [checked, setChecked] = useState(() => {
    const initial = new Set();
    filterGroups.category.forEach((c) => c.checked && initial.add(`cat:${c.id}`));
    filterGroups.availability.forEach((a) => a.checked && initial.add(`avail:${a.id}`));
    return initial;
  });

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("wishlist:item-added", { detail: { productId: id } })
          );
        }
      }
      return next;
    });
  };

  const toggleCheck = (key) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clearAll = () => {
    setChecked(new Set());
    setSelectedPrice(null);
    setPriceRange(2000);
  };

  const removeRecent = (item) => {
    setRecentQueries((prev) => prev.filter((r) => r !== item));
  };

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Search">
        <div className={styles.heroDeco} aria-hidden="true">
          <Image
            src={heroImg}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              {searchHero.title}
              <span aria-hidden="true" className={styles.heroHeart}>
                <FaHeart />
              </span>
            </h1>
            <p className={styles.heroLead}>
              <em>{searchHero.lead}</em>
            </p>

            <form
              className={styles.searchBar}
              onSubmit={(e) => e.preventDefault()}
              role="search"
            >
              <span className={styles.searchIcon} aria-hidden="true">
                <FiSearch />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
                placeholder={searchHero.placeholder}
                aria-label="Search products"
              />
              <button
                type="button"
                className={styles.searchIconBtn}
                aria-label="Search by image"
              >
                <FiCamera />
              </button>
              <button
                type="button"
                className={styles.searchIconBtn}
                aria-label="Voice search"
              >
                <FiMic />
              </button>
              <button type="submit" className={styles.searchSubmit}>
                Search
              </button>
            </form>

            <div className={styles.tryRow}>
              <span className={styles.tryLabel}>Try:</span>
              <ul className={styles.tryChips}>
                {searchHero.tryChips.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      className={styles.tryChip}
                      onClick={() => setQuery(c)}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Search mode cards ─────────── */}
        <section className={styles.modeStrip} aria-label="Ways to search">
          {searchModes.map((m) => (
            <article key={m.id} className={styles.modeCard}>
              <span className={styles.modeIcon} aria-hidden="true">
                {MODE_ICONS[m.id]}
              </span>
              <span className={styles.modeText}>
                <strong>{m.title}</strong>
                <span>{m.copy}</span>
              </span>
            </article>
          ))}
        </section>

        {/* ─────────── 3. Quick access row ─────────── */}
        <section className={styles.quickRow} aria-label="Quick access">
          {/* Trending */}
          <article className={styles.quickCard}>
            <header className={styles.quickHead}>
              <FaFire className={styles.quickIconFire} aria-hidden="true" />
              <h3 className={styles.quickTitle}>Trending Searches</h3>
            </header>
            <ul className={styles.trendingList}>
              {trendingSearches.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    className={styles.trendingChip}
                    onClick={() => setQuery(t)}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </article>

          {/* Recently viewed */}
          <article className={styles.quickCard}>
            <header className={styles.quickHead}>
              <FiEye className={styles.quickIconAlt} aria-hidden="true" />
              <h3 className={styles.quickTitle}>Recently Viewed</h3>
            </header>
            <ul className={styles.viewedList}>
              {recentlyViewed.map((r) => (
                <li key={r.id} className={styles.viewedItem}>
                  <Image
                    src={r.src}
                    alt={r.alt}
                    fill
                    sizes="60px"
                    className={styles.viewedImg}
                  />
                </li>
              ))}
            </ul>
          </article>

          {/* Recent searches */}
          <article className={styles.quickCard}>
            <header className={styles.quickHead}>
              <FiClock className={styles.quickIconAlt} aria-hidden="true" />
              <h3 className={styles.quickTitle}>Recent Searches</h3>
            </header>
            <ul className={styles.recentList}>
              {recentQueries.map((r) => (
                <li key={r} className={styles.recentItem}>
                  <button
                    type="button"
                    className={styles.recentText}
                    onClick={() => setQuery(r)}
                  >
                    {r}
                  </button>
                  <button
                    type="button"
                    className={styles.recentRemove}
                    onClick={() => removeRecent(r)}
                    aria-label={`Remove ${r}`}
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
          </article>

          {/* Collections to explore */}
          <article className={styles.quickCard}>
            <header className={styles.quickHead}>
              <FiZap className={styles.quickIconAlt} aria-hidden="true" />
              <h3 className={styles.quickTitle}>Collections to Explore</h3>
            </header>
            <ul className={styles.collectionList}>
              {collectionsToExplore.map((c) => (
                <li key={c.id} className={styles.collectionItem}>
                  <span className={styles.collectionMedia}>
                    <Image
                      src={c.src}
                      alt={c.label}
                      fill
                      sizes="48px"
                      className={styles.collectionImg}
                    />
                  </span>
                  <span className={styles.collectionLabel}>{c.label}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        {/* ─────────── 4. Filter + Results ─────────── */}
        <div className={styles.resultsLayout}>
          {/* Sidebar filters */}
          <aside className={styles.filterCard} aria-label="Filter results">
            <header className={styles.filterHead}>
              <h2 className={styles.filterTitle}>
                <FiSliders aria-hidden="true" /> Filter Results
              </h2>
              <button
                type="button"
                className={styles.clearAll}
                onClick={clearAll}
              >
                Clear All
              </button>
            </header>

            <FilterSection title="Product Category">
              {filterGroups.category.map((c) => (
                <CheckRow
                  key={c.id}
                  label={c.label}
                  count={c.count}
                  checked={checked.has(`cat:${c.id}`)}
                  onChange={() => toggleCheck(`cat:${c.id}`)}
                />
              ))}
              <button type="button" className={styles.viewMore}>
                + View More
              </button>
            </FilterSection>

            <FilterSection title="Price Range">
              <input
                type="range"
                min={0}
                max={2000}
                step={50}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className={styles.priceRange}
                aria-label="Price range"
              />
              <div className={styles.priceEdges}>
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString("en-IN")}+</span>
              </div>
              <div className={styles.priceGrid}>
                {filterGroups.price.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`${styles.priceBtn} ${
                      selectedPrice === p.id ? styles.priceBtnActive : ""
                    }`}
                    onClick={() => setSelectedPrice(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Color">
              <ul className={styles.colorRow}>
                {filterGroups.colors.map((c) => (
                  <li key={c.id} className={styles.colorItem}>
                    <button
                      type="button"
                      className={`${styles.colorSwatch} ${
                        checked.has(`col:${c.id}`) ? styles.colorSwatchActive : ""
                      }`}
                      style={{ background: c.value }}
                      onClick={() => toggleCheck(`col:${c.id}`)}
                      aria-label={`Color ${c.id}`}
                    />
                    <span className={styles.colorName}>{c.id}</span>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className={styles.colorSwatchMore}
                    aria-label="More colors"
                  >
                    +
                  </button>
                </li>
              </ul>
            </FilterSection>

            <FilterSection title="Occasion">
              {filterGroups.occasion.map((o) => (
                <CheckRow
                  key={o.id}
                  label={o.label}
                  checked={checked.has(`occ:${o.id}`)}
                  onChange={() => toggleCheck(`occ:${o.id}`)}
                />
              ))}
              <button type="button" className={styles.viewMore}>
                + View More
              </button>
            </FilterSection>

            <FilterSection title="Product Type">
              {filterGroups.productType.map((t) => (
                <CheckRow
                  key={t.id}
                  label={t.label}
                  checked={checked.has(`type:${t.id}`)}
                  onChange={() => toggleCheck(`type:${t.id}`)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Availability">
              {filterGroups.availability.map((a) => (
                <CheckRow
                  key={a.id}
                  label={a.label}
                  count={a.count}
                  checked={checked.has(`avail:${a.id}`)}
                  onChange={() => toggleCheck(`avail:${a.id}`)}
                />
              ))}
            </FilterSection>

            <button
              type="button"
              className={styles.clearAllBtn}
              onClick={clearAll}
            >
              Clear All Filters <FiRotateCcw />
            </button>
          </aside>

          {/* Results */}
          <section className={styles.resultsCol}>
            <header className={styles.resultsHead}>
              <div>
                <h2 className={styles.resultsTitle}>
                  Showing results for{" "}
                  <em className={styles.resultsQuery}>&ldquo;{query}&rdquo;</em>
                </h2>
                <p className={styles.resultsMeta}>
                  {searchMeta.total} Products Found
                </p>
              </div>
              <div className={styles.resultsControls}>
                <div className={styles.sortWrap}>
                  <span className={styles.sortLabel}>Sort by:</span>
                  <button
                    type="button"
                    className={styles.sortBtn}
                    onClick={() => setSortOpen((v) => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={sortOpen}
                  >
                    {sort.label}
                    <FiChevronDown
                      className={`${styles.sortChev} ${
                        sortOpen ? styles.sortChevOpen : ""
                      }`}
                    />
                  </button>
                  {sortOpen && (
                    <ul className={styles.sortMenu} role="listbox">
                      {sortOptions.map((opt) => (
                        <li key={opt.id}>
                          <button
                            type="button"
                            className={`${styles.sortOption} ${
                              sort.id === opt.id ? styles.sortOptionActive : ""
                            }`}
                            onClick={() => {
                              setSort(opt);
                              setSortOpen(false);
                            }}
                            role="option"
                            aria-selected={sort.id === opt.id}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={styles.viewToggle}>
                  <button
                    type="button"
                    className={`${styles.viewBtn} ${
                      viewMode === "grid" ? styles.viewBtnActive : ""
                    }`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                  >
                    <FiGrid />
                  </button>
                  <button
                    type="button"
                    className={`${styles.viewBtn} ${
                      viewMode === "list" ? styles.viewBtnActive : ""
                    }`}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </header>

            <ul
              className={`${styles.productGrid} ${
                viewMode === "list" ? styles.productList : ""
              }`}
            >
              {products.map((p) => (
                <li key={p.id} className={styles.productCard}>
                  <Link
                    href={`/product/${p.id}`}
                    className={styles.productMedia}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 720px) 45vw, 220px"
                      className={styles.productImg}
                    />
                    {p.badge && (
                      <span
                        className={`${styles.productBadge} ${
                          p.badge.includes("OFF") ? styles.productBadgeDeal : ""
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </Link>
                  <div className={styles.productBody}>
                    <h3 className={styles.productName}>
                      <Link href={`/product/${p.id}`}>
                        {p.name}
                        {p.variant && (
                          <span className={styles.productVariant}>
                            ({p.variant})
                          </span>
                        )}
                      </Link>
                    </h3>
                    <div className={styles.productPrice}>
                      <strong>{p.priceFmt}</strong>
                      {p.strikeFmt && <span>{p.strikeFmt}</span>}
                    </div>
                    <div className={styles.productFoot}>
                      <Stars value={p.rating} />
                      <span className={styles.productReviews}>
                        ({p.reviews})
                      </span>
                      <div className={styles.productActions}>
                        <button
                          type="button"
                          className={`${styles.iconBtn} ${
                            wishlist.has(p.id) ? styles.iconBtnOn : ""
                          }`}
                          onClick={() => toggleWishlist(p.id)}
                          aria-label={`Add ${p.name} to wishlist`}
                        >
                          <FiHeart />
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtnDark}
                          aria-label={`Add ${p.name} to cart`}
                        >
                          <FiShoppingBag />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <nav className={styles.pagination} aria-label="Search pagination">
              <button
                type="button"
                className={styles.pageBtn}
                aria-label="Previous page"
                disabled
              >
                <FiChevronLeft />
              </button>
              {pagination.visible.map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} className={styles.pageEllipsis}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.pageBtn} ${
                      p === pagination.current ? styles.pageBtnActive : ""
                    }`}
                    aria-current={p === pagination.current ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                className={styles.pageBtn}
                aria-label="Next page"
              >
                <FiChevronRight />
              </button>
            </nav>

            {/* Custom order banner */}
            <section className={styles.customBanner}>
              <span className={styles.customIcon} aria-hidden="true">
                <FiGift />
              </span>
              <div className={styles.customCopy}>
                <strong>{customOrder.title}</strong>
                <span>{customOrder.lead}</span>
              </div>
              <Link
                href={customOrder.cta.href}
                className={styles.customBtn}
              >
                {customOrder.cta.label} <FiArrowRight />
              </Link>
            </section>
          </section>
        </div>

        {/* ─────────── 5. Trust strip ─────────── */}
        <section className={styles.trustStrip} aria-label="Why shop with us">
          <ul className={styles.trustList}>
            {trustStrip.map((t) => (
              <li key={t.id} className={styles.trustRow}>
                <span className={styles.trustIcon} aria-hidden="true">
                  {TRUST_ICONS[t.id]}
                </span>
                <span className={styles.trustText}>
                  <strong>{t.title}</strong>
                  <span>{t.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

/* ── Sub-components ────────────────────────────────────────────── */

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className={styles.filterSection}>
      <button
        type="button"
        className={styles.filterSectionHead}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <FiChevronDown
          className={`${styles.filterChev} ${open ? styles.filterChevOpen : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className={styles.filterBody}>{children}</div>}
    </section>
  );
}

function CheckRow({ label, count, checked, onChange }) {
  return (
    <label className={styles.checkRow}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.checkbox}
      />
      <span className={styles.checkLabel}>
        {label}
        {typeof count === "number" && (
          <span className={styles.checkCount}> ({count})</span>
        )}
      </span>
    </label>
  );
}
