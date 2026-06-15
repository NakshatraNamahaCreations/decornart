"use client";

import { useEffect, useMemo, useState } from "react";
import {
  categoryOptions,
  occasionOptions,
  priceRanges,
  sortOptions,
} from "@/lib/data/shopFilters";
import { listProducts } from "@/lib/api/products";
import { resolveProductImage } from "@/lib/productImages";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import Breadcrumb from "@/components/ui/Breadcrumb/Breadcrumb";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import SortBar from "./SortBar/SortBar";
import ProductGrid from "./ProductGrid/ProductGrid";
import styles from "./Shop.module.css";

const SEARCH_DEBOUNCE_MS = 220;

const EMPTY_FILTERS = {
  categories: [],
  occasions: [],
  priceRangeId: null,
};

export default function Shop() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addItem } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();
  const [adding, setAdding] = useState(() => new Set());

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

  // Fetch products whenever filters/sort/search change. The backend handles
  // filtering/sorting/pagination — we just translate UI state into query params.
  useEffect(() => {
    const controller = new AbortController();
    const range = priceRanges.find((r) => r.id === filters.priceRangeId);

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // The backend takes a single category/occasion — pick the first
        // selected; the rest are filtered client-side below.
        const data = await listProducts({
          q: debouncedSearch || undefined,
          category: filters.categories[0],
          occasion: filters.occasions[0],
          minPrice: range?.min,
          maxPrice: range?.max != null && range.max !== Infinity ? range.max : undefined,
          sort,
          limit: 60,
        });
        setProducts(data || []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [debouncedSearch, filters.categories, filters.occasions, filters.priceRangeId, sort]);

  const toggleArrayValue = (key, value) =>
    setFilters((prev) => {
      const current = new Set(prev[key]);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      return { ...prev, [key]: Array.from(current) };
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

  const handleAddToCart = async (productId) => {
    setAdding((prev) => new Set(prev).add(productId));
    try {
      await addItem(productId, 1);
    } catch {
      /* error toast can be wired here; silent for now */
    }
  };

  const activeFilterCount =
    filters.categories.length +
    filters.occasions.length +
    (filters.priceRangeId ? 1 : 0) +
    (debouncedSearch ? 1 : 0);

  // The backend only filters by a single category/occasion at a time; apply
  // any extra selected values client-side so the UI feels correct.
  const filteredProducts = useMemo(() => {
    const categorySet = new Set(filters.categories);
    const occasionSet = new Set(filters.occasions);
    return products
      .filter((p) => {
        if (categorySet.size && !categorySet.has(p.category)) return false;
        if (
          occasionSet.size &&
          !(p.occasions || []).some((o) => occasionSet.has(o))
        )
          return false;
        return true;
      })
      .map((p) => ({ ...p, image: resolveProductImage(p) }));
  }, [products, filters.categories, filters.occasions]);

  // Wishlist hooks expect a Set-like API (`has`); ProductCard reads boolean.
  const wishlistSet = useMemo(
    () => ({ has: (productId) => isWished(productId) }),
    [isWished]
  );
  const addedSet = useMemo(() => ({ has: (id) => adding.has(id) }), [adding]);

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop" },
            ]}
          />
          <span className="eyebrow">The full atelier</span>
          <h1 className={styles.title}>All bouquets</h1>
          <p className={styles.intro}>
            Hand-tied compositions across every collection — filter by
            occasion, style and price to find one that fits the moment.
          </p>
        </div>

        <div className={styles.layout}>
          <FilterSidebar
            categoryOptions={categoryOptions}
            occasionOptions={occasionOptions}
            priceRanges={priceRanges}
            searchValue={searchInput}
            filters={filters}
            activeFilterCount={activeFilterCount}
            onSearchChange={setSearchInput}
            onToggleCategory={(id) => toggleArrayValue("categories", id)}
            onToggleOccasion={(id) => toggleArrayValue("occasions", id)}
            onSetPriceRange={setPriceRange}
            onClear={clearFilters}
            isDrawerOpen={drawerOpen}
            onCloseDrawer={() => setDrawerOpen(false)}
          />

          <div className={styles.results}>
            <SortBar
              count={filteredProducts.length}
              sort={sort}
              sortOptions={sortOptions}
              activeFilterCount={activeFilterCount}
              onSortChange={setSort}
              onOpenFilters={() => setDrawerOpen(true)}
            />
            {error ? (
              <div className={styles.error || ""} style={{ padding: "2rem 0" }}>
                Could not load products: {error.message}
              </div>
            ) : loading && filteredProducts.length === 0 ? (
              <div style={{ padding: "2rem 0", opacity: 0.6 }}>Loading…</div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                wishlist={wishlistSet}
                added={addedSet}
                onToggleWishlist={toggleWish}
                onAddToCart={handleAddToCart}
                onClear={clearFilters}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
