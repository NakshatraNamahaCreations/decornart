"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import styles from "./Navbar.module.css";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Handmade Bouquets", href: "/handmade" },
  { label: "Blog & DIY", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact"}
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef(null);
  const { itemCount } = useCart();
  const { user, isAuthed } = useAuth();

  useEffect(() => {
    setScrolled(false);
  }, [isHome]);

  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: "top top-=40",
      onUpdate: (self) => setScrolled(self.scroll() > 40),
    });
    return () => st.kill();
  }, {});

  return (
    <header
      ref={ref}
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className="container">
        <div className={styles.topRow}>
          <a href="/" className={styles.brand}>
            Decornart<span>.</span>
          </a>

          <form
            className={styles.search}
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = searchQuery.trim();
              if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
            }}
          >
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search for bouquets, occasions, collections..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className={styles.searchBtn}
              aria-label="Search"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m15.8 15.8 4.2 4.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>

          <div className={styles.actions}>
            <a href={isAuthed ? "/account" : "/login"} className={styles.account}>
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  cx="12"
                  cy="9"
                  r="3.6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span className={styles.accountText}>
                <span className={styles.accountSmall}>Hello,</span>
                <span className={styles.accountStrong}>
                  {isAuthed ? (user?.name?.split(" ")[0] || "My account") : "Login / Register"}
                </span>
              </span>
            </a>

            <a href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a href="/cart" className={styles.cart} aria-label="Cart">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M5 7h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 7zM9 7V5a3 3 0 0 1 6 0v2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={styles.cartBadge}>{itemCount}</span>
            </a>
          </div>
        </div>

        <div className={styles.navRow}>
          <nav className={styles.linksNav}>
            <ul className={styles.links}>
              {LINKS.map((l) => {
                const isActive =
                  l.href === "/"
                    ? pathname === "/"
                    : pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className={isActive ? styles.active : ""}
                      aria-current={isActive ? "page" : undefined}
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
    </header>
  );
}
