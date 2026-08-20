"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaStar } from "react-icons/fa";
import {
  FiChevronRight,
  FiChevronDown,
  FiGrid,
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiAward,
  FiTag,
  FiUsers,
  FiRefreshCw,
  FiArrowRight,
} from "react-icons/fi";
import { PiCrownFill } from "react-icons/pi";
import heroImg from "@/assets/craftbg.png";
import bouquetImg from "@/assets/vase.png";
import prod1 from "@/assets/pipecleaners.png";
import prod2 from "@/assets/ribbons.png";
import prod3 from "@/assets/wrapper.png";
import prod4 from "@/assets/craft.png";
import prod5 from "@/assets/pipe.png";
import prod6 from "@/assets/basket.png";
import prod7 from "@/assets/crochet.png";
import prod8 from "@/assets/raw-materials.png";
import { useBannerContent } from "@/hooks/useBannerContent";
import styles from "./CraftEssentialsView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const HERO_VALUES = [
  { id: "quality", title: "Premium Quality", copy: "Crafted to perfection", icon: <PiCrownFill /> },
  { id: "creators", title: "Made for Creators", copy: "Trusted by 10K+ makers", icon: <FaHeart /> },
  { id: "variety", title: "Wide Variety", copy: "Everything in one place", icon: <FiGrid /> },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: <FiRefreshCw /> },
];

const CATEGORIES = [
  { id: "pipe", label: "Pipe Cleaners", image: prod1 },
  { id: "ribbon", label: "Ribbons & Laces", image: prod2 },
  { id: "wrap", label: "Wrapping Sheets", image: prod3 },
  { id: "tools", label: "Craft Tools", image: prod4 },
  { id: "adhesives", label: "Adhesives", image: prod5 },
  { id: "beads", label: "Beads & Charms", image: prod6 },
  { id: "flowers", label: "Flowers & Leaves", image: prod7 },
  { id: "kits", label: "Kits & Combos", image: prod8 },
  { id: "storage", label: "Storage & Others", image: prod1 },
];

const CATEGORY_FILTERS = [
  { id: "pipe", label: "Pipe Cleaners", count: 36 },
  { id: "ribbon", label: "Ribbons & Laces", count: 28 },
  { id: "wrap", label: "Wrapping Sheets", count: 24 },
  { id: "tools", label: "Craft Tools", count: 32 },
  { id: "adhesives", label: "Adhesives", count: 18 },
  { id: "beads", label: "Beads & Charms", count: 42 },
  { id: "flowers", label: "Flowers & Leaves", count: 34 },
  { id: "kits", label: "Kits & Combos", count: 12 },
  { id: "storage", label: "Storage & Others", count: 42 },
];

const PRICE_PRESETS = [
  { id: "u250", label: "Under ₹250", min: 0, max: 250 },
  { id: "250-500", label: "₹250 – ₹500", min: 250, max: 500 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { id: "a1000", label: "Above ₹1,000", min: 1000, max: 100000 },
];

const BRANDS = [
  { id: "decornart", label: "DecorNArt", count: 120 },
  { id: "premium", label: "Premium Picks", count: 68 },
  { id: "bestseller", label: "Best Sellers", count: 48 },
  { id: "new", label: "New Arrivals", count: 32 },
];

const COLORS = [
  { id: "blush", value: "#E8B8B8" },
  { id: "rose", value: "#D67C7C" },
  { id: "lilac", value: "#B7A2D9" },
  { id: "sand", value: "#D9BE9C" },
  { id: "sage", value: "#7C9A6E" },
];

const AVAILABILITY = [
  { id: "in", label: "In Stock", count: 240 },
  { id: "out", label: "Out of Stock", count: 28 },
];

const PRODUCTS = [
  {
    id: "pipe-bundle",
    badge: "Best Seller",
    badgeType: "seller",
    name: "Pipe Cleaners Bundle",
    variant: "6mm – 30cm",
    tag: "100 Strands in Each Bundle",
    rating: 4.9,
    reviews: 128,
    price: 249,
    image: prod1,
  },
  {
    id: "satin-ribbon",
    badge: "New Arrival",
    badgeType: "new",
    name: "Satin Ribbon Roll",
    variant: "25mm x 22m",
    tag: "Premium Quality",
    rating: 4.8,
    reviews: 96,
    price: 149,
    image: prod2,
  },
  {
    id: "korean-wrap",
    badge: "10% OFF",
    badgeType: "sale",
    name: "Korean Wrapping Sheets",
    variant: "Set of 10",
    tag: "Waterproof | Premium",
    rating: 4.7,
    reviews: 72,
    price: 359,
    strike: 399,
    image: prod3,
  },
  {
    id: "mini-glue",
    badge: "Best Seller",
    badgeType: "seller",
    name: "Mini Hot Glue Gun",
    variant: "20W",
    tag: "With 10 Glue Sticks",
    rating: 4.8,
    reviews: 64,
    price: 399,
    image: prod4,
  },
  {
    id: "beads-set",
    badge: "New",
    badgeType: "new",
    name: "Acrylic Beads Set",
    variant: "24 Grids",
    tag: "Multi Color",
    rating: 4.7,
    reviews: 88,
    price: 299,
    image: prod6,
  },
  {
    id: "floral-tape",
    badge: "Best Seller",
    badgeType: "seller",
    name: "Floral Tape",
    variant: "Set of 5 Rolls",
    tag: "Premium Green",
    rating: 4.8,
    reviews: 56,
    price: 129,
    image: prod5,
  },
  {
    id: "artificial-leaves",
    badge: "New Arrival",
    badgeType: "new",
    name: "Artificial Leaves",
    variant: "Pack of 50",
    tag: "Realistic Look",
    rating: 4.6,
    reviews: 42,
    price: 189,
    image: prod7,
  },
  {
    id: "tool-kit",
    badge: "Combo",
    badgeType: "combo",
    name: "Craft Tool Kit",
    variant: "8 in 1",
    tag: "Complete Set",
    rating: 4.9,
    reviews: 38,
    price: 499,
    image: prod8,
  },
];

const TRUST = [
  { id: "quality", title: "Premium Quality", copy: "Curated with care", icon: <PiCrownFill /> },
  { id: "prices", title: "Great Prices", copy: "Best value for creators", icon: <FiTag /> },
  { id: "delivery", title: "Fast Delivery", copy: "Pan India Shipping", icon: <FiTruck /> },
  { id: "loved", title: "Loved by 10,000+ Makers", copy: "Thank you for trusting us", icon: <FaHeart /> },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "new", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const MAX_PRICE = 2000;

export default function CraftEssentialsView() {
  const root = useRef(null);
  const heroBanner = useBannerContent("craft-essentials-hero");
  const heroSrc = heroBanner.loaded ? heroBanner.image || heroImg : null;
  const [activeCat, setActiveCat] = useState("pipe");
  const [checkedCats, setCheckedCats] = useState({ pipe: true });
  const [priceMax, setPriceMax] = useState(MAX_PRICE);
  const [checkedBrands, setCheckedBrands] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);
  const [availability, setAvailability] = useState({ in: true });
  const [sort, setSort] = useState("popular");
  const [newsEmail, setNewsEmail] = useState("");
  const [newsMsg, setNewsMsg] = useState("");

  const toggle = (setter, id) =>
    setter((prev) => ({ ...prev, [id]: !prev[id] }));

  const clearAll = () => {
    setCheckedCats({});
    setPriceMax(MAX_PRICE);
    setCheckedBrands({});
    setSelectedColor(null);
    setAvailability({ in: true });
  };

  const productList = useMemo(() => {
    let list = [...PRODUCTS];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [sort]);

  const submitNewsletter = (e) => {
    e.preventDefault();
    if (!newsEmail.trim()) return setNewsMsg("Please enter your email.");
    setNewsMsg("You're on the list — check your inbox for a welcome note!");
    setNewsEmail("");
  };

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Craft essentials">
        <div className={styles.heroDeco} aria-hidden="true">
          {heroSrc && (
            <Image
              src={heroSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.heroImg}
            />
          )}
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              {heroBanner.text(
                "title",
                <>
                  Craft Essentials{" "}
                  <span aria-hidden="true" className={styles.heroHeart}>
                    <FaHeart />
                  </span>
                </>
              )}
            </h1>
            <span className={styles.heroEyebrow}>
              {heroBanner.text(
                "eyebrow",
                <>
                  Everything you need to create magic{" "}
                  <span aria-hidden="true" className={styles.eyebrowHeart}>
                    <FaHeart />
                  </span>
                </>
              )}
            </span>
            <p className={styles.heroLead}>
              {heroBanner.text(
                "subtitle",
                <>
                  Premium quality craft supplies for
                  <br />
                  beautiful creations.
                </>
              )}
            </p>
            <ul className={styles.heroValues}>
              {HERO_VALUES.map((v) => (
                <li key={v.id} className={styles.heroValueItem}>
                  <span className={styles.heroValueIcon} aria-hidden="true">
                    {v.icon}
                  </span>
                  <span className={styles.heroValueText}>
                    <strong>{v.title}</strong>
                    <span>{v.copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Category tabs ─────────── */}
        <section className={styles.catStrip} aria-label="Categories">
          <ul className={styles.catList}>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`${styles.catCard} ${
                    activeCat === c.id ? styles.catCardActive : ""
                  }`}
                  onClick={() => setActiveCat(c.id)}
                >
                  <span className={styles.catMedia}>
                    <Image
                      src={c.image}
                      alt={c.label}
                      fill
                      sizes="80px"
                      className={styles.catImg}
                    />
                  </span>
                  <span className={styles.catLabel}>{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 3. Breadcrumb + toolbar ─────────── */}
        <nav aria-label="Breadcrumb" className={styles.crumb}>
          <Link href="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <Link href="/shop">Shop</Link>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Craft Essentials</span>
        </nav>

        <div className={styles.toolbar}>
          <span className={styles.countText}>
            Showing 1–24 of <strong>268</strong> products
          </span>
          <div className={styles.toolbarRight}>
            <label className={styles.sortWrap}>
              Sort by:
              <span className={styles.selectWrap}>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className={styles.select}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown aria-hidden="true" />
              </span>
            </label>
            <div className={styles.viewToggle} role="group" aria-label="View">
              <button
                type="button"
                className={`${styles.viewBtn} ${styles.viewBtnActive}`}
                aria-label="Grid view"
                aria-pressed="true"
              >
                <FiGrid />
              </button>
            </div>
          </div>
        </div>

        {/* ─────────── 4. Main content ─────────── */}
        <section className={styles.mainRow}>
          {/* Sidebar filters */}
          <aside className={styles.filterCol} aria-label="Filters">
            <div className={styles.filterHead}>
              <h2>Filter By</h2>
              <button
                type="button"
                className={styles.clearLink}
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>

            <FilterGroup title="Category">
              {CATEGORY_FILTERS.map((c) => (
                <label key={c.id} className={styles.check}>
                  <input
                    type="checkbox"
                    checked={!!checkedCats[c.id]}
                    onChange={() => toggle(setCheckedCats, c.id)}
                  />
                  <span>
                    {c.label} <em>({c.count})</em>
                  </span>
                </label>
              ))}
            </FilterGroup>

            <FilterGroup title="Price Range">
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={50}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className={styles.range}
                aria-label="Maximum price"
              />
              <div className={styles.rangeLabels}>
                <span>₹0</span>
                <span>{inr.format(priceMax)}</span>
              </div>
              <div className={styles.priceGrid}>
                {PRICE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={styles.priceChip}
                    onClick={() => setPriceMax(p.max)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Brand">
              {BRANDS.map((b) => (
                <label key={b.id} className={styles.check}>
                  <input
                    type="checkbox"
                    checked={!!checkedBrands[b.id]}
                    onChange={() => toggle(setCheckedBrands, b.id)}
                  />
                  <span>
                    {b.label} <em>({b.count})</em>
                  </span>
                </label>
              ))}
            </FilterGroup>

            <FilterGroup title="Color">
              <div className={styles.colorRow}>
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    style={{ background: c.value }}
                    className={`${styles.swatch} ${
                      selectedColor === c.id ? styles.swatchActive : ""
                    }`}
                    onClick={() => setSelectedColor(c.id)}
                    aria-label={c.id}
                  />
                ))}
                <button
                  type="button"
                  className={styles.swatchMore}
                  aria-label="More colors"
                >
                  +
                </button>
              </div>
            </FilterGroup>

            <FilterGroup title="Availability">
              {AVAILABILITY.map((a) => (
                <label key={a.id} className={styles.check}>
                  <input
                    type="checkbox"
                    checked={!!availability[a.id]}
                    onChange={() => toggle(setAvailability, a.id)}
                  />
                  <span>
                    {a.label} <em>({a.count})</em>
                  </span>
                </label>
              ))}
            </FilterGroup>

            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearAll}
            >
              Clear All Filters <FiRefreshCw />
            </button>
          </aside>

          {/* Product grid */}
          <div className={styles.gridCol}>
            <ul className={styles.productGrid}>
              {productList.map((p) => (
                <li key={p.id} className={styles.productCard}>
                  <div className={styles.cardMediaWrap}>
                    <span
                      className={`${styles.badge} ${
                        styles[`badge-${p.badgeType}`] || ""
                      }`}
                    >
                      {p.badge}
                    </span>
                    <div className={styles.cardMedia}>
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="240px"
                        className={styles.cardImg}
                      />
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <strong className={styles.cardName}>
                      {p.name}
                      {p.variant && (
                        <span className={styles.cardVariant}>
                          <br />({p.variant})
                        </span>
                      )}
                    </strong>
                    <span className={styles.cardTag}>{p.tag}</span>
                    <div className={styles.cardRating}>
                      <FaStar aria-hidden="true" /> {p.rating}
                      <span>({p.reviews})</span>
                    </div>
                    <div className={styles.cardFoot}>
                      <span className={styles.cardPrice}>
                        {inr.format(p.price)}
                        {p.strike && (
                          <s className={styles.cardStrike}>
                            {inr.format(p.strike)}
                          </s>
                        )}
                      </span>
                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          aria-label={`Wishlist ${p.name}`}
                        >
                          <FiHeart />
                        </button>
                        <button
                          type="button"
                          className={styles.cartBtn}
                          aria-label={`Add ${p.name} to cart`}
                        >
                          <FiShoppingCart />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Trust strip */}
            <section className={styles.trustStrip}>
              <ul className={styles.trustList}>
                {TRUST.map((t) => (
                  <li key={t.id} className={styles.trustRow}>
                    <span className={styles.trustIcon} aria-hidden="true">
                      {t.icon}
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
        </section>
      </div>
    </main>
  );
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.filterGroup}>
      <button
        type="button"
        className={styles.filterGroupHead}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <FiChevronDown
          aria-hidden="true"
          className={open ? styles.chevOpen : ""}
        />
      </button>
      {open && <div className={styles.filterGroupBody}>{children}</div>}
    </div>
  );
}
