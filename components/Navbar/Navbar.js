"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import logo from "@/assets/decor-logo.png";
import styles from "./Navbar.module.css";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "#" },
  { label: "Categories", href: "#" },
  { label: "DIY & Blog", href: "#" },
  { label: "Collections", href: "#"},
  { label: "About", href: "#t" },
  { label: "Contact", href: "#" },
];

const AccountIcon = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" focusable="false">
    <circle cx="12" cy="9" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const WishIcon = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" focusable="false">
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
const CartIcon = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" focusable="false">
    <path d="M5 7h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 7zM9 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="m15.8 15.8 4.2 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef(null);
  const { itemCount } = useCart();
  const { user, isAuthed } = useAuth();

  useEffect(() => {
    setScrolled(false);
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
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
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
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
      <div className="container" style={{maxWidth:"1480px"}}>
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
              sizes="(max-width: 860px) 72px, 78px"
            />
          </a>

          <nav className={styles.linksNav} aria-label="Primary">
            <ul className={styles.links}>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={isLinkActive(l.href) ? styles.active : ""}
                    aria-current={isLinkActive(l.href) ? "page" : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.right}>
            <form className={styles.search} role="search" onSubmit={submitSearch}>
              <button type="submit" className={styles.searchBtn} aria-label="Search">
                <SearchIcon />
              </button>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search ribbons, yarn, baskets…"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className={styles.actions}>
              <a
                href={isAuthed ? "/account" : "/login"}
                className={styles.account}
                aria-label={isAuthed ? "My account" : "Login or register"}
              >
                <AccountIcon />
              </a>
              <a href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
                <WishIcon />
              </a>
              <a href="/cart" className={styles.cart} aria-label="Cart">
                <CartIcon />
                {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div id="mobile-menu" className={styles.panel} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile">
          <ul className={styles.panelLinks}>
            {LINKS.map((l) => (
              <li key={l.href}>
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
        </nav>

        <form className={styles.panelSearch} role="search" onSubmit={submitSearch}>
          <SearchIcon />
          <input
            type="search"
            placeholder="Search ribbons, yarn, baskets…"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className={styles.panelFoot}>
          <a href={isAuthed ? "/account" : "/login"}>
            <AccountIcon />
            <span>{isAuthed ? user?.name?.split(" ")[0] || "My account" : "Login / Register"}</span>
          </a>
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
