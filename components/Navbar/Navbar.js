"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useLoginModal } from "@/components/LoginModal/LoginModalContext";
import { listCategories } from "@/lib/api/categories";
import { listProducts } from "@/lib/api/products";
import { resolveProductImage } from "@/lib/productImages";
import logo from "@/assets/new-logo.png";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Categories", href: "/categories", hasDropdown: true },
  { label: "New Arrivals", href: "/collections" },
  { label: "Bulk Orders", href: "/wholesale" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const AccountIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
    <circle cx="12" cy="9" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const WishIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const CartIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
    <path d="M5 7h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 7zM9 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SearchGlyph = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path d="m15.8 15.8 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

// Reduce a full name to at most two uppercase initials for the navbar avatar.
function getInitials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";
  return (first + last).toUpperCase() || "?";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [navCategoriesOpen, setNavCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const ref = useRef(null);
  const searchRef = useRef(null);
  const catalogRef = useRef(null);
  const navCategoriesRef = useRef(null);
  const navCategoriesHoverTimer = useRef(null);
  const { itemCount } = useCart();
  const { user, isAuthed } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length || 0;
  const { openLogin } = useLoginModal();
  const [cartToast, setCartToast] = useState(null);
  const [wishlistToast, setWishlistToast] = useState(null);

  // Load categories once for the CATEGORIES dropdown in the primary nav.
  // Cached in-memory by the browser after the first hit via the backend's
  // Cache-Control header.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listCategories();
        if (!cancelled) setCategories(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setCategories([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Mini-cart preview: any add-to-cart caller can dispatch a
  // `cart:item-added` CustomEvent with { name, price, image, qty }.
  useEffect(() => {
    const onAdded = (e) => {
      const detail = e?.detail;
      if (!detail) return;
      setCartToast({ ...detail, key: Date.now() });
    };
    window.addEventListener("cart:item-added", onAdded);
    return () => window.removeEventListener("cart:item-added", onAdded);
  }, []);

  useEffect(() => {
    const onAdded = () => setWishlistToast({ key: Date.now() });
    window.addEventListener("wishlist:item-added", onAdded);
    return () => window.removeEventListener("wishlist:item-added", onAdded);
  }, []);

  useEffect(() => {
    const onLoginNeeded = () => openLogin();
    window.addEventListener("wishlist:login-required", onLoginNeeded);
    return () =>
      window.removeEventListener("wishlist:login-required", onLoginNeeded);
  }, [openLogin]);

  useEffect(() => {
    if (!cartToast) return undefined;
    const id = setTimeout(() => setCartToast(null), 3500);
    return () => clearTimeout(id);
  }, [cartToast?.key]);

  useEffect(() => {
    if (!wishlistToast) return undefined;
    const id = setTimeout(() => setWishlistToast(null), 2500);
    return () => clearTimeout(id);
  }, [wishlistToast?.key]);

  const formatPrice = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(n)
      : "";

  useEffect(() => {
    setScrolled(false);
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
    setNavCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: "top top-=40",
      onUpdate: (self) => {
        const next = self.scroll() > 40;
        setScrolled((prev) => (prev === next ? prev : next));
      },
    });
    return () => st.kill();
  }, {});

  const submitSearch = (e) => {
    e?.preventDefault?.();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSuggestOpen(false);
    setMenuOpen(false);
  };

  // Debounced live-search — same client-side approach as before.
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      setSuggestLoading(false);
      return undefined;
    }
    setSuggestLoading(true);
    const id = setTimeout(async () => {
      try {
        if (!catalogRef.current) {
          const res = await listProducts({ limit: 500 }, { envelope: true });
          const all = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          catalogRef.current = all;
        }
        const tokens = q.split(/\s+/).filter(Boolean);
        const scored = catalogRef.current
          .map((p) => {
            const hay = [
              p.name,
              p.slug,
              p.category,
              p.occasion,
              ...(Array.isArray(p.occasions) ? p.occasions : []),
              ...(Array.isArray(p.tags) ? p.tags : []),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            const allMatch = tokens.every((t) => hay.includes(t));
            if (!allMatch) return null;
            const nameLower = (p.name || "").toLowerCase();
            const startsWith = nameLower.startsWith(q) ? 0 : 1;
            const nameHit = nameLower.includes(q) ? 0 : 1;
            return { p, rank: startsWith * 2 + nameHit };
          })
          .filter(Boolean)
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 6)
          .map((x) => x.p);
        setSuggestions(scored);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, 180);
    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    if (!suggestOpen) return undefined;
    const onDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [suggestOpen]);

  useEffect(() => {
    if (!navCategoriesOpen) return undefined;
    const onDown = (e) => {
      if (
        navCategoriesRef.current &&
        !navCategoriesRef.current.contains(e.target)
      ) {
        setNavCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [navCategoriesOpen]);

  const openNavCategories = () => {
    clearTimeout(navCategoriesHoverTimer.current);
    setNavCategoriesOpen(true);
  };
  const closeNavCategoriesSoon = () => {
    clearTimeout(navCategoriesHoverTimer.current);
    navCategoriesHoverTimer.current = setTimeout(
      () => setNavCategoriesOpen(false),
      120
    );
  };

  const goToSuggestion = (slug) => {
    setSuggestOpen(false);
    setSearchQuery("");
    router.push(`/product/${encodeURIComponent(slug)}`);
  };

  const isLinkActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      ref={ref}
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${
        menuOpen ? styles.menuOpen : ""
      }`}
    >
      {/* ─────────── Row 1: logo · search · actions ─────────── */}
      <div className={styles.mainRow}>
        <div className="container" style={{ maxWidth: "1480px" }}>
          <div className={styles.bar}>
            <button
              type="button"
              className={styles.burger}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>

            <a href="/" className={styles.brand} aria-label="Decor N Art — home">
              <Image
                src={logo}
                alt="Decor N Art"
                className={styles.brandLogo}
                priority
                sizes="(max-width: 860px) 140px, 200px"
              />
            </a>

            {/* Compact search bar */}
            <form
              ref={searchRef}
              className={styles.search}
              role="search"
              onSubmit={submitSearch}
            >
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search for unique gifts, décor & more..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSuggestOpen(true);
                }}
                onFocus={() => searchQuery.trim() && setSuggestOpen(true)}
                onKeyDown={(e) => e.key === "Escape" && setSuggestOpen(false)}
                autoComplete="off"
              />

              <span className={styles.searchScopeStatic} aria-hidden="true">
                All Categories
              </span>

              <button type="submit" className={styles.searchBtn} aria-label="Search">
                <SearchGlyph />
              </button>

              {suggestOpen && searchQuery.trim() && (
                <div className={styles.suggest} role="listbox">
                  {suggestLoading && suggestions.length === 0 && (
                    <div className={styles.suggestEmpty}>Searching…</div>
                  )}
                  {!suggestLoading && suggestions.length === 0 && (
                    <div className={styles.suggestEmpty}>
                      No products match “{searchQuery.trim()}”
                    </div>
                  )}
                  {suggestions.map((p) => {
                    const img = resolveProductImage(p);
                    return (
                      <button
                        type="button"
                        key={p.id || p.slug}
                        className={styles.suggestItem}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => goToSuggestion(p.slug)}
                        role="option"
                      >
                        <span className={styles.suggestThumb} aria-hidden="true">
                          {img && (
                            <Image src={img} alt="" fill sizes="40px" />
                          )}
                        </span>
                        <span className={styles.suggestBody}>
                          <span className={styles.suggestName}>{p.name}</span>
                          {typeof p.price === "number" && (
                            <span className={styles.suggestPrice}>
                              {formatPrice(p.price)}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                  {suggestions.length > 0 && (
                    <button
                      type="button"
                      className={styles.suggestAll}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={submitSearch}
                    >
                      See all results for “{searchQuery.trim()}”
                    </button>
                  )}
                </div>
              )}
            </form>

            {/* Right: action icons with labels */}
            <div className={styles.actions}>
              <a
                href="/wishlist"
                className={styles.actionBtn}
                aria-label={`Wishlist${wishlistCount ? ` — ${wishlistCount} items` : ""}`}
              >
                <span className={styles.actionIcon}>
                  <WishIcon />
                  {wishlistCount > 0 && (
                    <span className={styles.badge}>{wishlistCount}</span>
                  )}
                </span>
                <span className={styles.actionLabel}>Wishlist</span>
                <span
                  className={`${styles.cartToast} ${
                    wishlistToast ? styles.cartToastShow : ""
                  }`}
                  role="status"
                  aria-live="polite"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className={styles.cartToastArrow} aria-hidden="true" />
                  <span className={styles.cartToastCheck} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path
                        d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className={styles.cartToastBody}>
                    <span className={styles.cartToastLabel}>Added to wishlist</span>
                  </span>
                </span>
              </a>

              {isAuthed ? (
                <a
                  href="/account"
                  className={`${styles.actionBtn} ${styles.actionAuthed}`}
                  aria-label={`My account — ${user?.name || ""}`.trim()}
                  title={user?.name || "My account"}
                >
                  <span className={styles.actionIcon}>
                    <span className={styles.accountInitials} aria-hidden="true">
                      {getInitials(user?.name)}
                    </span>
                  </span>
                  <span className={styles.actionLabel}>
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={openLogin}
                  className={styles.actionBtn}
                  aria-label="Login or register"
                >
                  <span className={styles.actionIcon}>
                    <AccountIcon />
                  </span>
                  <span className={styles.actionLabel}>Account</span>
                </button>
              )}

              <a href="/cart" className={styles.actionBtn} aria-label="Cart">
                <span className={styles.actionIcon}>
                  <CartIcon />
                  {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
                </span>
                <span className={styles.actionLabel}>Cart</span>

                <span
                  className={`${styles.cartToast} ${cartToast ? styles.cartToastShow : ""}`}
                  role="status"
                  aria-live="polite"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className={styles.cartToastArrow} aria-hidden="true" />
                  <span className={styles.cartToastCheck} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path
                        d="M5 12.5l4.5 4.5L19 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {cartToast?.image ? (
                    <span className={styles.cartToastThumb}>
                      <Image src={cartToast.image} alt="" fill sizes="44px" />
                    </span>
                  ) : (
                    <span className={styles.cartToastThumb} aria-hidden="true" />
                  )}
                  <span className={styles.cartToastBody}>
                    <span className={styles.cartToastLabel}>Added to cart</span>
                    <span className={styles.cartToastName}>{cartToast?.name}</span>
                    <span className={styles.cartToastPrice}>
                      {cartToast?.qty > 1 ? `${cartToast.qty} × ` : ""}
                      {formatPrice(cartToast?.price)}
                    </span>
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────── Row 2: primary nav links (centered) ─────────── */}
      <div className={styles.subRow}>
        <div className="container" style={{ maxWidth: "1480px" }}>
          <div className={styles.subRowInner}>
          <nav className={styles.navRow} aria-label="Primary">
            <ul className={styles.navLinks}>
              {NAV_LINKS.map((l) => {
                if (l.hasDropdown) {
                  return (
                    <li
                      key={l.label}
                      ref={navCategoriesRef}
                      className={styles.navItem}
                      onMouseEnter={openNavCategories}
                      onMouseLeave={closeNavCategoriesSoon}
                    >
                      <a
                        href={l.href}
                        className={`${styles.navLink} ${
                          isLinkActive(l.href) ? styles.navLinkActive : ""
                        }`}
                        aria-haspopup="true"
                        aria-expanded={navCategoriesOpen}
                        onClick={(e) => {
                          if (window.matchMedia("(min-width: 861px)").matches) {
                            if (!navCategoriesOpen) {
                              e.preventDefault();
                              setNavCategoriesOpen(true);
                            }
                          }
                        }}
                      >
                        {l.label}
                        <FiChevronDown
                          className={`${styles.navChevron} ${
                            navCategoriesOpen ? styles.navChevronOpen : ""
                          }`}
                          aria-hidden="true"
                        />
                      </a>
                      {navCategoriesOpen && categories.length > 0 && (
                        <div className={styles.dropdown} role="menu">
                          <ul className={styles.dropdownList}>
                            {categories.map((c) => (
                              <li key={c.slug}>
                                <a
                                  href={`/category/${c.slug}`}
                                  className={styles.dropdownItem}
                                  role="menuitem"
                                  onClick={() => setNavCategoriesOpen(false)}
                                >
                                  <span className={styles.dropdownName}>
                                    {c.name}
                                  </span>
                                  {typeof c.count === "number" && (
                                    <span className={styles.dropdownCount}>
                                      {c.count}
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                          <a href="/categories" className={styles.dropdownFoot}>
                            View all categories →
                          </a>
                        </div>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={l.href + l.label} className={styles.navItem}>
                    <a
                      href={l.href}
                      className={`${styles.navLink} ${
                        isLinkActive(l.href) ? styles.navLinkActive : ""
                      }`}
                      aria-current={isLinkActive(l.href) ? "page" : undefined}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div id="mobile-menu" className={styles.panel} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile">
          <ul className={styles.panelLinks}>
            {NAV_LINKS.map((l) => (
              <li key={l.href + l.label}>
                <a
                  href={l.href}
                  className={isLinkActive(l.href) ? styles.panelActive : ""}
                  aria-current={isLinkActive(l.href) ? "page" : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {categories.length > 0 && (
            <details className={styles.panelDetails}>
              <summary>Browse by category</summary>
              <ul className={styles.panelSubLinks}>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <a href={`/category/${c.slug}`}>{c.name}</a>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </nav>

        <form className={styles.panelSearch} role="search" onSubmit={submitSearch}>
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            placeholder="Search for unique gifts, décor & more..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className={styles.panelFoot}>
          {isAuthed ? (
            <a href="/account">
              <AccountIcon />
              <span>{user?.name?.split(" ")[0] || "My account"}</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openLogin();
              }}
              className={styles.panelAccountBtn}
            >
              <AccountIcon />
              <span>Login / Register</span>
            </button>
          )}
          <a href="/wishlist">
            <WishIcon />
            <span>Wishlist</span>
          </a>
        </div>
      </div>

      <button
        type="button"
        className={styles.backdrop}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  );
}
