"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  FiShield,
  FiTruck,
  FiRotateCcw,
  FiAward,
} from "react-icons/fi";
import {
  categoryOptions as fallbackCategoryOptions,
  occasionOptions,
  priceRanges,
  sortOptions,
} from "@/lib/data/shopFilters";
import { listProducts } from "@/lib/api/products";
import { listCategories } from "@/lib/api/categories";
import { resolveProductImage } from "@/lib/productImages";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import Breadcrumb from "@/components/ui/Breadcrumb/Breadcrumb";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import ProductGrid from "./ProductGrid/ProductGrid";
import shopHeroImg from "@/assets/banner-collection.png";
import { useBannerContent } from "@/hooks/useBannerContent";
import styles from "./Shop.module.css";

const TRUST_ITEMS = [
  {
    id: "secure",
    title: "100% Secure Payment",
    copy: "SSL Encrypted",
    icon: <FiShield aria-hidden="true" focusable="false" />,
  },
  {
    id: "ships",
    title: "Ships in 24 Hours",
    copy: "Pan India Delivery",
    icon: <FiTruck aria-hidden="true" focusable="false" />,
  },
  {
    id: "returns",
    title: "Damage Protection",
    copy: "Replacement for \ntransit-damaged items",
    icon: <FiRotateCcw aria-hidden="true" focusable="false" />,
  },
  {
    id: "quality",
    title: "Premium Quality",
    copy: "Carefully Selected",
    icon: <FiAward aria-hidden="true" focusable="false" />,
  },
];

// Hex values for the color names admins set on products. Anything not in
// this map falls back to a neutral swatch so the picker still renders.
// Kept in sync with the admin ProductForm's swatch palette.
const COLOR_HEX = {
  "Rose Red": "#c93848",
  "Blood Red": "#7a0d0d",
  "Wine Red": "#5c1a2b",
  Purple: "#7a3fbf",
  "Dark Purple": "#3f1d5c",
  Pink: "#ff8fb4",
  "Dark Pink": "#d94f8a",
  Peach: "#ffbfa0",
  "Peach Pink": "#ffb0b0",
  "Lemon Yellow": "#fff275",
  "Pumpkin Yellow": "#f5b800",
  Orange: "#ff8324",
  "Olive Green": "#7d8a2e",
  "Dark Green": "#1f5c2b",
  "Army Green": "#4b5320",
  "Fluorescent Green": "#39ff14",
  "Royal Blue": "#1d3fc0",
  "Ice Blue": "#bfe4ee",
  "Lake Blue": "#2a7d9b",
  Lavender: "#c8a2d8",
  "Light Brown": "#b98c5b",
  "Dark Brown": "#4a2b1c",
  Beige: "#e6d3b3",
  "Light Grey": "#c9c9c9",
  "Dark Grey": "#5a5a5a",
  Black: "#111111",
  White: "#ffffff",
};

const FEATURE_STRIP = [
  {
    id: "beautiful",
    title: "Curated with Love",
    copy: "Every piece is crafted with passion & care",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "trusted",
    title: "Trusted by Creators",
    copy: "Loved by 10,000+ creators across India",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "bulk",
    highlight: true,
    title: "Bulk Orders & Wholesale",
    copy: "Special prices for bulk buyers",
    cta: { label: "Enquire Now", href: "/wholesale" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 8l8-4 8 4-8 4-8-4z" strokeLinejoin="round" />
        <path d="M4 12l8 4 8-4" strokeLinejoin="round" />
        <path d="M4 16l8 4 8-4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "packaging",
    title: "Custom Packaging",
    copy: "Perfect for your brand, gifting & events",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 8h18v12H3z" strokeLinejoin="round" />
        <path d="M3 8l3-4h12l3 4" strokeLinejoin="round" />
        <path d="M12 4v16" />
      </svg>
    ),
  },
  {
    id: "safe",
    title: "Safe & Secure",
    copy: "Your payments are always protected",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const SEARCH_DEBOUNCE_MS = 220;

const EMPTY_FILTERS = {
  categories: [],
  occasions: [],
  colors: [],
  priceRangeId: null,
  // Availability is a MULTI-select checkbox facet. Empty array = no
  // filter. Any combination of "in-stock" / "out-of-stock" / "new-
  // arrival" / "best-seller" narrows results (see `matchesAvailability`
  // and `availabilityToQuery` for exact semantics).
  availability: [],
  // Material multi-select facet. Empty array = no filter. Backend
  // accepts comma-separated slugs on the `material` query param.
  materials: [],
};

// Storefront material facet (mirror the admin form's MATERIAL_OPTIONS).
const MATERIAL_OPTIONS = [
  { id: "paper", label: "Paper" },
  { id: "wood", label: "Wood" },
  { id: "cotton", label: "Cotton" },
  { id: "glass", label: "Glass" },
  { id: "jute", label: "Jute" },
];

// Availability filter options shown in the sidebar. Single-select — only
// one at a time. All four are applied client-side against the fetched
// products (in-stock / out-of-stock read `stock`, the flags read the
// admin-set booleans).
const AVAILABILITY_OPTIONS = [
  { id: "in-stock", label: "In Stock" },
  { id: "out-of-stock", label: "Out of Stock" },
  { id: "new-arrival", label: "New Arrival" },
  { id: "best-seller", label: "Best Seller" },
];

// Single-value predicate — used by `matchesAvailability` for each
// checked box. Stock semantics stay permissive so both stock buckets
// surface something when legacy docs carry stock as null / missing.
function matchesSingleAvailability(product, av) {
  const raw = product?.stock;
  const isExplicitlyZero = raw === 0 || raw === "0";
  const isMissing = raw == null;
  switch (av) {
    case "in-stock":
      return !isExplicitlyZero;
    case "out-of-stock":
      return isExplicitlyZero || isMissing;
    case "new-arrival":
      return !!product?.isNew;
    case "best-seller":
      return !!product?.isBestseller;
    default:
      return true;
  }
}

// Multi-select checkbox facet. A product passes when it satisfies EVERY
// checked box (AND semantics — matches how the backend combines params).
// Empty array = no filter.
function matchesAvailability(product, availability) {
  if (!Array.isArray(availability) || availability.length === 0) return true;
  return availability.every((av) => matchesSingleAvailability(product, av));
}

// Match a product against the selected materials facet. OR semantics —
// product passes when ANY of its materials is in the selected list.
// Missing/empty materials array on the product means no match unless the
// facet itself is empty (all products pass when no filter is set).
function matchesMaterials(product, materials) {
  if (!Array.isArray(materials) || materials.length === 0) return true;
  const own = Array.isArray(product?.materials) ? product.materials : [];
  if (own.length === 0) return false;
  const wanted = new Set(materials.map((m) => String(m).toLowerCase()));
  return own.some((m) => wanted.has(String(m).toLowerCase()));
}

// Serialise the selected materials into the backend's comma-separated
// `?material=paper,wood` query. Empty array → no param.
function materialsToQuery(materials) {
  if (!Array.isArray(materials) || materials.length === 0) return {};
  return { material: materials.join(",") };
}

// Translate the checkbox facet into backend query fields.
//   - Only one of stockStatus=in|out can be sent per request. If both
//     boxes are checked, we drop stockStatus (any stock passes) so the
//     rest of the filters still apply.
//   - isNew / bestseller are independent AND-filters.
function availabilityToQuery(availability) {
  if (!Array.isArray(availability) || availability.length === 0) return {};
  const q = {};
  const set = new Set(availability);
  const hasIn = set.has("in-stock");
  const hasOut = set.has("out-of-stock");
  if (hasIn && !hasOut) q.stockStatus = "in";
  else if (hasOut && !hasIn) q.stockStatus = "out";
  if (set.has("new-arrival")) q.isNew = true;
  if (set.has("best-seller")) q.bestseller = true;
  return q;
}

export default function Shop() {
  const heroBanner = useBannerContent("shop-hero");
  const heroSrc = heroBanner.loaded ? heroBanner.image || shopHeroImg : null;

  // Seed the search field from `?q=` on the URL so the Navbar's search form
  // (which pushes `/shop?q=…`) actually filters the grid. Without this the
  // page mounts with an empty local search state and the query is lost.
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(
    initialQuery.trim().toLowerCase()
  );

  // Keep the local field in sync if the shopper navigates between `/shop`
  // and `/shop?q=xyz` (e.g. hits the Navbar search again from this page).
  useEffect(() => {
    const q = searchParams?.get("q") || "";
    setSearchInput((prev) => (prev === q ? prev : q));
  }, [searchParams]);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [products, setProducts] = useState([]);
  // Separate "full match set" used only for sidebar facet counts so
  // category / colour tallies reflect every matching product across all
  // pages instead of just the 30 rendered in the current page's grid.
  const [productsForCounts, setProductsForCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remoteCategories, setRemoteCategories] = useState(null);
  // Server-driven pagination — 30 products per page. Reset to page 1
  // whenever any filter changes so the shopper doesn't land on an
  // out-of-range page after narrowing the results.
  const PAGE_SIZE = 32;
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  // Fetch admin-managed categories from the backend. Falls back to the
  // bundled static list if the request fails or returns an empty array,
  // so the sidebar is never empty.
  useEffect(() => {
    let cancelled = false;
    listCategories()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) setRemoteCategories(data);
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    if (remoteCategories && remoteCategories.length > 0) {
      return remoteCategories.map((c) => ({ id: c.slug, label: c.name }));
    }
    return fallbackCategoryOptions;
  }, [remoteCategories]);

  const { addItem } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();
  const [adding, setAdding] = useState(() => new Set());

  // Scroll target for the "Shop by color" swatches AND the pagination
  // buttons — clicking either jumps the viewport up to the start of the
  // product grid so the new page's cards are immediately visible.
  const resultsRef = useRef(null);
  // Set by pagination clicks so the scroll only fires *after* the new
  // page's products have committed to the DOM. Scrolling before the
  // fetch resolves clamps to max-scroll and drops the shopper at the
  // footer when the new page has fewer rows than the previous one.
  const pendingScrollRef = useRef(false);

  // Scroll to just above the results block, accounting for the sticky
  // navbar so the header + first row of cards land in the viewport
  // instead of behind the navbar. Clamped to the current max-scroll so
  // a shorter page (e.g. one that just shrank from a filter change)
  // doesn't overshoot to the footer.
  const scrollToResults = () => {
    const el = resultsRef.current;
    if (!el || typeof window === "undefined") return;
    const NAV_OFFSET = 120;
    const target =
      el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    const maxScroll =
      (document.documentElement.scrollHeight || 0) - window.innerHeight;
    const clamped = Math.max(0, Math.min(target, Math.max(0, maxScroll)));
    window.scrollTo({ top: clamped, behavior: "smooth" });
  };

  // Filter clicks fire two scrolls:
  //   1. immediate — instant feedback, uses the current (pre-refetch) layout
  //   2. deferred (via pendingScrollRef effect) — corrects the position
  //      once the new products render and the layout settles
  // The second smooth scroll interrupts the first and wins.
  const markFilterChanged = () => {
    pendingScrollRef.current = true;
    // Two rAFs so React has a chance to commit the filter state update
    // (which may collapse or re-flow the sidebar/chip strip) before we
    // read positions and start the smooth scroll.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => scrollToResults())
    );
  };

  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedSearch(searchInput.trim().toLowerCase()),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    document.documentElement.classList.add("app-locked");
    return () => document.documentElement.classList.remove("app-locked");
  }, [drawerOpen]);

  // Fetch products whenever search/price/sort/category change. When exactly
  // one category is selected we push that filter to the backend so pagination
  // walks only the category-matching set — otherwise page 1 could be empty
  // while a filtered match sits on page 2. Multi-category selections still
  // fall back to client-side filtering (see `filteredProducts` below).
  useEffect(() => {
    const controller = new AbortController();
    const range = priceRanges.find((r) => r.id === filters.priceRangeId);
    const singleCategory =
      filters.categories.length === 1 ? filters.categories[0] : undefined;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data, meta: respMeta } = await listProducts(
          {
            q: debouncedSearch || undefined,
            category: singleCategory,
            occasion:
              (filters.occasions || []).length > 0
                ? filters.occasions.join(",")
                : undefined,
            minPrice: range?.min,
            maxPrice:
              range?.max != null && range.max !== Infinity ? range.max : undefined,
            sort,
            page,
            limit: PAGE_SIZE,
            ...availabilityToQuery(filters.availability),
            ...materialsToQuery(filters.materials),
          },
          { envelope: true }
        );
        setProducts(data || []);
        setMeta(respMeta || null);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e);
          setProducts([]);
          setMeta(null);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [
    debouncedSearch,
    filters.categories,
    filters.occasions,
    filters.priceRangeId,
    filters.availability,
    sort,
    page,
  ]);

  // Sidebar facet counts should reflect the total match set, not just the
  // 30 items on the current page. Second lightweight fetch keyed off the
  // same filters minus `page` — pulls up to 1000 rows in one call.
  useEffect(() => {
    const controller = new AbortController();
    const range = priceRanges.find((r) => r.id === filters.priceRangeId);
    async function loadCounts() {
      try {
        const { data } = await listProducts(
          {
            q: debouncedSearch || undefined,
            occasion:
              (filters.occasions || []).length > 0
                ? filters.occasions.join(",")
                : undefined,
            minPrice: range?.min,
            maxPrice:
              range?.max != null && range.max !== Infinity ? range.max : undefined,
            sort,
            page: 1,
            limit: 1000,
            ...availabilityToQuery(filters.availability),
            ...materialsToQuery(filters.materials),
          },
          { envelope: true }
        );
        setProductsForCounts(data || []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setProductsForCounts([]);
        }
      }
    }
    loadCounts();
    return () => controller.abort();
  }, [
    debouncedSearch,
    filters.occasions,
    filters.priceRangeId,
    filters.availability,
    filters.materials,
    sort,
  ]);

  // Any filter/search/sort change should send the shopper back to page 1.
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.categories,
    filters.occasions,
    filters.colors,
    filters.priceRangeId,
    filters.availability,
    filters.materials,
    sort,
  ]);

  // Run any pending pagination scroll once the new page's products have
  // committed to the DOM. Waiting for `loading` to flip back to false and
  // `products` to change avoids the "clamped to footer" bug where a scroll
  // fired before the shorter page rendered overshoots the new max-scroll.
  useEffect(() => {
    if (!pendingScrollRef.current || loading) return;
    pendingScrollRef.current = false;
    // requestAnimationFrame lets the browser paint the new grid first so
    // getBoundingClientRect() reads the settled layout, not the stale one.
    requestAnimationFrame(() => scrollToResults());
  }, [loading, products]);

  // Categories, occasions, colours, and price are all single-select — only
  // one filter of each kind can be active at a time. Clicking an already-
  // active chip clears that filter. Radio-style behaviour matches the
  // backend's single-value query params and stops "empty page 1" cases
  // where a multi-category selection couldn't be pushed to the server.
  const setSingleValue = (key, value) =>
    setFilters((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      const isActive = current.length === 1 && current[0] === value;
      return { ...prev, [key]: isActive ? [] : [value] };
    });

  const setPriceRange = (id) =>
    setFilters((prev) => ({
      ...prev,
      priceRangeId: prev.priceRangeId === id ? null : id,
    }));

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
  };

  // Build the "Active Filters" chip strip data. Each chip carries its
  // display label and the exact remove-handler for that single filter so
  // clicking × narrows the intent (drop just this filter) instead of
  // clearing everything.
  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (debouncedSearch) {
      chips.push({
        key: "search",
        type: "Search",
        value: `"${searchInput}"`,
        onRemove: () => setSearchInput(""),
      });
    }
    for (const catId of filters.categories) {
      const opt = categoryOptions.find((c) => c.id === catId);
      chips.push({
        key: `cat:${catId}`,
        type: "Category",
        value: opt?.label || catId,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            categories: prev.categories.filter((c) => c !== catId),
          })),
      });
    }
    for (const occId of filters.occasions) {
      const opt = occasionOptions.find((o) => o.id === occId);
      chips.push({
        key: `occ:${occId}`,
        type: "Occasion",
        value: opt?.label || occId,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            occasions: prev.occasions.filter((o) => o !== occId),
          })),
      });
    }
    for (const color of filters.colors) {
      chips.push({
        key: `col:${color}`,
        type: "Color",
        value: color,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            colors: prev.colors.filter((c) => c !== color),
          })),
      });
    }
    if (filters.priceRangeId) {
      const range = priceRanges.find((r) => r.id === filters.priceRangeId);
      chips.push({
        key: "price",
        type: "Price",
        value: range?.label || filters.priceRangeId,
        onRemove: () => setFilters((prev) => ({ ...prev, priceRangeId: null })),
      });
    }
    for (const availId of filters.availability || []) {
      const opt = AVAILABILITY_OPTIONS.find((o) => o.id === availId);
      chips.push({
        key: `avail:${availId}`,
        type: "Availability",
        value: opt?.label || availId,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            availability: (prev.availability || []).filter((a) => a !== availId),
          })),
      });
    }
    for (const matId of filters.materials || []) {
      const opt = MATERIAL_OPTIONS.find((o) => o.id === matId);
      chips.push({
        key: `mat:${matId}`,
        type: "Material",
        value: opt?.label || matId,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            materials: (prev.materials || []).filter((m) => m !== matId),
          })),
      });
    }
    return chips;
  }, [
    debouncedSearch,
    searchInput,
    filters.categories,
    filters.occasions,
    filters.colors,
    filters.priceRangeId,
    filters.availability,
    filters.materials,
    categoryOptions,
  ]);

  const handleAddToCart = async (productId) => {
    setAdding((prev) => new Set(prev).add(productId));
    try {
      await addItem(productId, 1);
      const p = filteredProducts.find((x) => x.id === productId);
      if (p && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cart:item-added", {
            detail: {
              id: p.id,
              name: p.name,
              price: p.price,
              image: p.image,
              qty: 1,
            },
          })
        );
      }
    } catch {
      /* silently ignore — Navbar toast only fires on success */
    }
  };

  const activeFilterCount =
    filters.categories.length +
    filters.occasions.length +
    filters.colors.length +
    (filters.priceRangeId ? 1 : 0) +
    (debouncedSearch ? 1 : 0);

  // The backend only filters by a single category/occasion at a time; apply
  // any extra selected values client-side so the UI feels correct.
  // Full match set (up to 1000) with every client-side filter applied.
  // We paginate this client-side so filters the backend doesn't know
  // about (colors, multi-category) still surface their matches on
  // page 1 instead of scattering them across server pages.
  const filteredAll = useMemo(() => {
    const categorySet = new Set(filters.categories);
    const occasionSet = new Set(filters.occasions);
    const colorSet = new Set(filters.colors);
    const source =
      productsForCounts.length > 0 ? productsForCounts : products;
    return source
      .filter((p) => {
        if (categorySet.size && !categorySet.has(p.category)) return false;
        if (
          occasionSet.size &&
          !(p.occasions || []).some((o) => occasionSet.has(o))
        )
          return false;
        if (
          colorSet.size &&
          !(p.colors || []).some((c) => colorSet.has(c))
        )
          return false;
        if (!matchesAvailability(p, filters.availability)) return false;
        if (!matchesMaterials(p, filters.materials)) return false;
        return true;
      })
      .map((p) => ({ ...p, image: resolveProductImage(p) }));
  }, [
    productsForCounts,
    products,
    filters.categories,
    filters.occasions,
    filters.colors,
    filters.availability,
    filters.materials,
  ]);

  // Client-side page slice of the fully-filtered set.
  const filteredProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAll.slice(start, start + PAGE_SIZE);
  }, [filteredAll, page]);

  // Pagination meta derived from the client-filtered total. Replaces
  // server `meta` for display, so the count text and pagination
  // controls always reflect what the shopper actually sees.
  const displayMeta = useMemo(() => {
    const total = filteredAll.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    return {
      total,
      pages,
      page,
      hasPrev: page > 1,
      hasNext: page < pages,
    };
  }, [filteredAll, page]);

  // Show the full 27-color preset palette in the sidebar and the "Shop by
  // color" section — matches the admin form's swatch palette so every color
  // an admin can pick is browsable here. Clicking a swatch filters products
  // whose `colors` array contains that exact name; an empty grid is fine
  // (existing "No products match" empty state handles it).
  const availableColors = useMemo(() => Object.keys(COLOR_HEX), []);

  // Wishlist hooks expect a Set-like API (`has`); ProductCard reads boolean.
  const wishlistSet = useMemo(
    () => ({ has: (productId) => isWished(productId) }),
    [isWished]
  );
  const addedSet = useMemo(() => ({ has: (id) => adding.has(id) }), [adding]);

  return (
    <main className={styles.page}>
      {/* Hero banner — full-bleed image with left-anchored cream scrim. */}
      <section className={styles.hero} aria-label="Shop">
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
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop" },
            ]}
          />
          <h1 className={styles.heroTitle}>
            {heroBanner.text("title", "Shop All")}
          </h1>
          <p className={styles.heroScript}>
            {heroBanner.text(
              "script",
              <>
                Everything you need to create magic
                <span aria-hidden="true"> ♥</span>
              </>
            )}
          </p>
          <p className={styles.heroLead}>
            {heroBanner.text(
              "subtitle",
              <>
                Premium craft supplies for every creator,<br />
                every idea, every moment.
              </>
            )}
          </p>
          <a href="#shop-products" className={styles.heroCta}>
            Start Shopping
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </section>

      <div className="container">
        {/* Trust strip — 4 assurances on the left, sort + view toggle on the right. */}
        <section className={styles.trust}>
          <div className={styles.trustItems}>
            {TRUST_ITEMS.map((t) => (
              <div key={t.id} className={styles.trustItem}>
                <span className={styles.trustIcon} aria-hidden="true">
                  {t.icon}
                </span>
                <span className={styles.trustText}>
                  <strong>{t.title}</strong>
                  <span>{t.copy}</span>
                </span>
              </div>
            ))}
          </div>
          <div className={styles.trustControls}>
            <label className={styles.sortLabel}>
              <span>Sort by:</span>
              <select
                className={styles.sortSelect}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
              >
                {sortOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.viewToggle} role="group" aria-label="View mode">
              <button
                type="button"
                className={`${styles.viewBtn} ${view === "grid" ? styles.viewBtnActive : ""}`}
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
              >
                Grid
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${view === "list" ? styles.viewBtnActive : ""}`}
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
              >
                List
              </button>
            </div>
          </div>
        </section>

        {activeFilterChips.length > 0 && (
          <section
            className={styles.activeChips}
            aria-label="Active filters"
          >
            <span className={styles.activeChipsLabel}>
              Active Filters ({activeFilterChips.length}):
            </span>
            <ul className={styles.activeChipsList}>
              {activeFilterChips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    className={styles.activeChip}
                    onClick={chip.onRemove}
                    aria-label={`Remove ${chip.type}: ${chip.value}`}
                    title={`Remove ${chip.type}: ${chip.value}`}
                  >
                    <span className={styles.activeChipText}>
                      <span className={styles.activeChipType}>{chip.type}:</span>{" "}
                      {chip.value}
                    </span>
                    <span className={styles.activeChipClose} aria-hidden="true">
                      ×
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {activeFilterChips.length > 1 && (
              <button
                type="button"
                className={styles.activeChipsClear}
                onClick={clearFilters}
              >
                Clear all
              </button>
            )}
          </section>
        )}

        <div id="shop-products" className={styles.layout}>
          <FilterSidebar
            categoryOptions={categoryOptions}
            occasionOptions={occasionOptions}
            priceRanges={priceRanges}
            searchValue={searchInput}
            filters={filters}
            activeFilterCount={activeFilterCount}
            products={productsForCounts.length > 0 ? productsForCounts : products}
            availableColors={availableColors}
            colorHex={COLOR_HEX}
            onSearchChange={setSearchInput}
            onToggleCategory={(id) => {
              setSingleValue("categories", id);
              markFilterChanged();
            }}
            onToggleOccasion={(id) => {
              setFilters((prev) => {
                const current = Array.isArray(prev.occasions)
                  ? prev.occasions
                  : [];
                const next = current.includes(id)
                  ? current.filter((o) => o !== id)
                  : [...current, id];
                return { ...prev, occasions: next };
              });
              markFilterChanged();
            }}
            onToggleColor={(name) => {
              setFilters((prev) => ({
                ...prev,
                colors:
                  prev.colors.length === 1 && prev.colors[0] === name
                    ? []
                    : [name],
              }));
              markFilterChanged();
            }}
            onSetPriceRange={(id) => {
              setPriceRange(id);
              markFilterChanged();
            }}
            availabilityOptions={AVAILABILITY_OPTIONS}
            onSetAvailability={(id) => {
              setFilters((prev) => {
                const current = Array.isArray(prev.availability)
                  ? prev.availability
                  : [];
                const next = current.includes(id)
                  ? current.filter((a) => a !== id)
                  : [...current, id];
                return { ...prev, availability: next };
              });
              markFilterChanged();
            }}
            materialOptions={MATERIAL_OPTIONS}
            onToggleMaterial={(id) => {
              setFilters((prev) => {
                const current = Array.isArray(prev.materials)
                  ? prev.materials
                  : [];
                const next = current.includes(id)
                  ? current.filter((m) => m !== id)
                  : [...current, id];
                return { ...prev, materials: next };
              });
              markFilterChanged();
            }}
            onClear={() => {
              clearFilters();
              markFilterChanged();
            }}
            isDrawerOpen={drawerOpen}
            onCloseDrawer={() => setDrawerOpen(false)}
          />

          <div className={styles.results} ref={resultsRef}>
            <div className={styles.resultsHead}>
              <span className={styles.count}>
                {(() => {
                  const total = displayMeta.total;
                  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
                  const to = Math.min(page * PAGE_SIZE, total);
                  return (
                    <>
                      Showing {from}&ndash;{to} of {total} products
                    </>
                  );
                })()}
              </span>
              <button
                type="button"
                className={styles.mobileFilterBtn}
                onClick={() => setDrawerOpen(true)}
                aria-label="Open filters"
              >
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </button>
            </div>
            {error ? (
              <div className={styles.error || ""} style={{ padding: "2rem 0" }}>
                Could not load products: {error.message}
              </div>
            ) : loading && filteredProducts.length === 0 ? (
              <div style={{ padding: "2rem 0", opacity: 0.6 }}>Loading&hellip;</div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                view={view}
                wishlist={wishlistSet}
                added={addedSet}
                onToggleWishlist={toggleWish}
                onAddToCart={handleAddToCart}
                onClear={clearFilters}
              />
            )}

            {displayMeta.pages > 1 && (
              <nav
                className={styles.pagination}
                aria-label="Product pagination"
              >
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    pendingScrollRef.current = true;
                  }}
                  disabled={!displayMeta.hasPrev || loading}
                  aria-label="Previous page"
                >
                  ‹ Prev
                </button>
                {Array.from({ length: displayMeta.pages }).map((_, i) => {
                  const n = i + 1;
                  const active = n === page;
                  return (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.pageBtn} ${
                        active ? styles.pageBtnActive : ""
                      }`}
                      onClick={() => {
                        if (active) return;
                        setPage(n);
                        pendingScrollRef.current = true;
                      }}
                      aria-current={active ? "page" : undefined}
                      disabled={loading}
                    >
                      {n}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => {
                    setPage((p) => Math.min(displayMeta.pages, p + 1));
                    pendingScrollRef.current = true;
                  }}
                  disabled={!displayMeta.hasNext || loading}
                  aria-label="Next page"
                >
                  Next ›
                </button>
              </nav>
            )}

            {/* Shop by color — single-select. Clicking a swatch replaces
                whatever colour was chosen before; clicking the active one
                clears the filter. Distinct from the sidebar's multi-select. */}
            <section className={styles.colorPicker}>
              <div className={styles.colorHead}>
                <h2 className={styles.colorHeading}>Shop Pipe Cleaners by Color</h2>
                <a href="/category/pipe-cleaners" className={styles.colorViewAll}>
                  View All
                  <span aria-hidden="true">→</span>
                </a>
              </div>
              <ul className={styles.colorGrid}>
                {availableColors.slice(0, 13).map((name) => {
                  const hex = COLOR_HEX[name] || "#c9c9c9";
                  const on = filters.colors.includes(name);
                  return (
                    <li key={name} className={styles.colorItem}>
                      <button
                        type="button"
                        className={`${styles.colorSwatch} ${
                          on ? styles.colorSwatchActive : ""
                        }`}
                        style={{ background: hex }}
                        aria-label={`Filter by ${name}`}
                        aria-pressed={on}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            colors:
                              prev.colors.length === 1 && prev.colors[0] === name
                                ? []
                                : [name],
                          }));
                          const el = resultsRef.current;
                          if (el) {
                            // Scroll further up than the grid's top edge so
                            // the sort bar / trust strip above it is also
                            // in view, and the sticky navbar doesn't cover
                            // the results header.
                            const top =
                              el.getBoundingClientRect().top +
                              window.scrollY -
                              260;
                            window.scrollTo({ top, behavior: "smooth" });
                          }
                        }}
                      />
                      <span className={styles.colorLabel}>{name}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>

        {/* Bottom feature strip — 5 assurances, middle one is the highlight card. */}
        <section className={styles.features}>
          {FEATURE_STRIP.map((f) =>
            f.highlight ? (
              <div key={f.id} className={styles.featureHighlight}>
                <span className={styles.featureIcon} aria-hidden="true">
                  {f.icon}
                </span>
                <span className={styles.featureText}>
                  <strong>{f.title}</strong>
                  <span>{f.copy}</span>
                </span>
                {f.cta && (
                  <a href={f.cta.href} className={styles.featureCta}>
                    {f.cta.label}
                  </a>
                )}
              </div>
            ) : (
              <div key={f.id} className={styles.featureItem}>
                <span className={styles.featureIcon} aria-hidden="true">
                  {f.icon}
                </span>
                <span className={styles.featureText}>
                  <strong>{f.title}</strong>
                  <span>{f.copy}</span>
                </span>
              </div>
            )
          )}
        </section>
      </div>

    </main>
  );
}
