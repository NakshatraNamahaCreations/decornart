"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import {
  FiHeart,
  FiX,
  FiEye,
  FiShoppingBag,
  FiShare2,
  FiBell,
  FiArrowRight,
  FiRotateCcw,
  FiUsers,
  FiChevronDown,
} from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLoginModal } from "@/components/LoginModal/LoginModalContext";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCart } from "@/components/providers/CartProvider";
import { resolveProductImage, getProductImage } from "@/lib/productImages";
import heroImg from "@/assets/orderbg.png";
import newsletterImg from "@/assets/vase.png";
import styles from "./WishlistView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const SORTS = [
  { id: "added", label: "Recently Added" },
  { id: "low", label: "Price · Low to High" },
  { id: "high", label: "Price · High to Low" },
  { id: "az", label: "A — Z" },
];

const HERO_FEATURES = [
  {
    id: "save",
    icon: <FiHeart />,
    title: "Save Your Favourites",
    copy: "Keep everything you love in one place",
  },
  {
    id: "notify",
    icon: <FiBell />,
    title: "Never Miss Out",
    copy: "Get notified when items you love are back",
  },
  {
    id: "move",
    icon: <FiShoppingBag />,
    title: "Easy to Move",
    copy: "Move to cart anytime when you're ready",
  },
];

const SUGGESTIONS = [
  {
    id: "s-giftcard",
    slug: "beautiful-gift-card",
    name: "beautiful Gift Card",
    variant: "Floral",
    price: 129,
    image: getProductImage("blush-editorial"),
  },
  {
    id: "s-keychain",
    slug: "daisy-keychain",
    name: "Daisy Keychain",
    variant: "Yellow",
    price: 199,
    image: getProductImage("morning-marigold"),
  },
];

const TRUST = [
  {
    id: "checkout",
    icon: <FiShoppingBag />,
    title: "Secure Checkout",
    copy: "100% safe & secure",
  },
  {
    id: "beautiful",
    icon: <FaHeart />,
    title: "Curated with Love",
    copy: "Crafted with passion",
  },
  {
    id: "returns",
    icon: <FiRotateCcw />,
    title: "Damage Protection",
    copy: "Replacement for transit-damaged items",
  },
  {
    id: "happy",
    icon: <FiUsers />,
    title: "10,000+ Happy Customers",
    copy: "Thank you for trusting us",
  },
];

export default function WishlistView() {
  const root = useRef(null);
  const { isAuthed, isLoading } = useAuth();
  const { openLogin } = useLoginModal();
  const { items: wishItems, remove } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(() => new Set());
  const [sort, setSort] = useState("added");
  const [sortOpen, setSortOpen] = useState(false);
  const [alertsOn, setAlertsOn] = useState(false);

  const items = useMemo(() => {
    const list = [...wishItems];
    if (sort === "low") return list.sort((a, b) => a.price - b.price);
    if (sort === "high") return list.sort((a, b) => b.price - a.price);
    if (sort === "az")
      return list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [wishItems, sort]);

  const subtotal = items.reduce((sum, p) => sum + (p.price || 0), 0);

  const activeSort = SORTS.find((s) => s.id === sort) || SORTS[0];

  const handleRemove = (productId) => {
    remove(productId).catch(() => {});
  };

  const addToCart = async (productId) => {
    setAdded((prev) => new Set(prev).add(productId));
    try {
      await addItem(productId, 1);
      // "Move to cart" semantics: the wishlist should no longer hold an item
      // that's already sitting in the cart.
      await remove(productId).catch(() => {});
    } catch {
      setAdded((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const moveAllToCart = async () => {
    // Snapshot the list up-front — remove() mutates `items` after each call.
    const snapshot = items.map((p) => p.productId || p.id);
    for (const productId of snapshot) {
      // eslint-disable-next-line no-await-in-loop
      await addToCart(productId);
    }
  };

  const shareWishlist = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator?.share) {
      navigator.share({ title: "My DecorNArt Wishlist", url }).catch(() => {});
    } else if (navigator?.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.heroCopy} > *`, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(`.${styles.card}`, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.06,
        ease: "power2.out",
        delay: 0.35,
      });
    },
    { scope: root, dependencies: [items.length] }
  );

  if (!isLoading && !isAuthed) {
    return (
      <main ref={root} className={styles.page}>
        <section className={styles.hero} aria-label="Wishlist">
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
                My Wishlist{" "}
                <span aria-hidden="true" className={styles.heroHeart}>
                  <FaHeart />
                </span>
              </h1>
              <p className={styles.heroLead}>
                Your favourite picks, saved with love.
                <br />
                Sign in to keep them across every visit.
              </p>
            </div>
          </div>
        </section>
        <div className={`container ${styles.container}`}>
          <div className={styles.empty}>
            <span className={styles.emptyMark} aria-hidden="true">
              <FiHeart />
            </span>
            <h2 className={styles.emptyHeading}>
              Sign in to save your favourites
            </h2>
            <p className={styles.emptyCopy}>
              Your wishlist follows you across devices — sign in to keep the
              pieces you love.
            </p>
            <div className={styles.emptyActions}>
              <button
                type="button"
                onClick={openLogin}
                className={styles.emptyBtnPrimary}
              >
                Sign In <FiArrowRight />
              </button>
              <Link href="/shop" className={styles.emptyBtnGhost}>
                Browse the shop
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Wishlist">
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
              My Wishlist{" "}
              <span aria-hidden="true" className={styles.heroHeart}>
                <FaHeart />
              </span>
            </h1>
            <p className={styles.heroLead}>
              Your favourite picks, saved with love.
              <br />
              They&rsquo;re just a click away from being yours.
            </p>
            <ul className={styles.heroFeatures}>
              {HERO_FEATURES.map((f) => (
                <li key={f.id} className={styles.heroFeature}>
                  <span className={styles.heroFeatureIcon} aria-hidden="true">
                    {f.icon}
                  </span>
                  <span className={styles.heroFeatureText}>
                    <strong>{f.title}</strong>
                    <span>{f.copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyMark} aria-hidden="true">
              <FiHeart />
            </span>
            <h2 className={styles.emptyHeading}>Nothing saved yet</h2>
            <p className={styles.emptyCopy}>
              When you find something you love, tap the heart — it&rsquo;ll
              wait for you right here.
            </p>
            <div className={styles.emptyActions}>
              <Link href="/shop" className={styles.emptyBtnPrimary}>
                Browse the shop <FiArrowRight />
              </Link>
              <Link href="/beautiful" className={styles.emptyBtnGhost}>
                See this week&rsquo;s drop
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ─────────── 2. Toolbar ─────────── */}
            <section className={styles.toolbar}>
              <span className={styles.itemsCount}>
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </span>

              <div className={styles.sortWrap}>
                <span className={styles.sortLabel}>Sort by:</span>
                <button
                  type="button"
                  className={styles.sortBtn}
                  onClick={() => setSortOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                >
                  {activeSort.label}
                  <FiChevronDown
                    className={`${styles.sortChev} ${
                      sortOpen ? styles.sortChevOpen : ""
                    }`}
                  />
                </button>
                {sortOpen && (
                  <ul className={styles.sortMenu} role="listbox">
                    {SORTS.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          className={`${styles.sortOption} ${
                            sort === s.id ? styles.sortOptionActive : ""
                          }`}
                          onClick={() => {
                            setSort(s.id);
                            setSortOpen(false);
                          }}
                          role="option"
                          aria-selected={sort === s.id}
                        >
                          {s.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                className={styles.shareBtn}
                onClick={shareWishlist}
              >
                Share Wishlist <FiShare2 />
              </button>
            </section>

            {/* ─────────── 3. Grid + Sidebar ─────────── */}
            <div className={styles.layout}>
              <section
                className={styles.grid}
                aria-label="Saved products"
              >
                {items.map((p) => {
                  const productId = p.productId || p.id;
                  const isAdded = added.has(productId);
                  return (
                    <article key={productId} className={styles.card}>
                      <Link
                        href={`/product/${p.slug}`}
                        className={styles.imageWrap}
                      >
                        <Image
                          src={resolveProductImage(p)}
                          alt={p.name}
                          fill
                          sizes="(max-width: 720px) 90vw, 22vw"
                          className={styles.cardImg}
                        />
                        <span
                          className={styles.heartBadge}
                          aria-hidden="true"
                        >
                          <FaHeart />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemove(productId);
                          }}
                          className={styles.removeBtn}
                          aria-label={`Remove ${p.name} from wishlist`}
                        >
                          <FiX />
                        </button>
                      </Link>

                      <div className={styles.cardBody}>
                        <h3 className={styles.cardName}>
                          <Link href={`/product/${p.slug}`}>{p.name}</Link>
                          {p.variant && (
                            <span className={styles.cardVariant}>
                              ({p.variant})
                            </span>
                          )}
                        </h3>
                        <span className={styles.cardPrice}>
                          {inr.format(p.price)}
                        </span>
                        {p.category && (
                          <span className={styles.cardTag}>{p.category}</span>
                        )}
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          onClick={() => addToCart(productId)}
                          className={`${styles.moveBtn} ${
                            isAdded ? styles.moveBtnAdded : ""
                          }`}
                        >
                          {isAdded ? "Added ✓" : "Move to Cart"}
                        </button>
                        <Link
                          href={`/product/${p.slug}`}
                          className={styles.viewBtn}
                          aria-label={`View ${p.name}`}
                        >
                          <FiEye />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </section>

              <aside className={styles.sidebar} aria-label="Wishlist summary">
                {/* Summary card */}
                <section className={styles.summaryCard}>
                  <header className={styles.summaryHead}>
                    <h2 className={styles.summaryTitle}>Wishlist Summary</h2>
                    <span className={styles.summaryHeart} aria-hidden="true">
                      <FiHeart />
                    </span>
                  </header>
                  <p className={styles.summaryMeta}>
                    {items.length} {items.length === 1 ? "item" : "items"} in
                    your wishlist
                  </p>
                  <div className={styles.summaryRow}>
                    <span>Estimated Total</span>
                    <strong>{inr.format(subtotal)}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={moveAllToCart}
                    className={styles.summaryPrimary}
                  >
                    Move All to Cart <FiShoppingBag />
                  </button>
                  <button
                    type="button"
                    onClick={shareWishlist}
                    className={styles.summaryGhost}
                  >
                    Share Wishlist <FiShare2 />
                  </button>
                </section>

                {/* Price drop alerts */}
                <section className={styles.alertCard}>
                  <span className={styles.alertIcon} aria-hidden="true">
                    <FiBell />
                  </span>
                  <div className={styles.alertBody}>
                    <strong>Price Drop Alerts</strong>
                    <span>
                      We&rsquo;ll notify you when the price drops on items in
                      your wishlist.
                    </span>
                    <button
                      type="button"
                      onClick={() => setAlertsOn((v) => !v)}
                      className={`${styles.alertBtn} ${
                        alertsOn ? styles.alertBtnOn : ""
                      }`}
                    >
                      {alertsOn ? "Alerts On" : "Turn On Alerts"}
                    </button>
                  </div>
                </section>

                {/* Suggestions */}
                <section className={styles.suggestCard}>
                  <header className={styles.suggestHead}>
                    <h3 className={styles.suggestTitle}>
                      You May Also Love{" "}
                      <span
                        aria-hidden="true"
                        className={styles.suggestHeart}
                      >
                        <FaHeart />
                      </span>
                    </h3>
                  </header>
                  <ul className={styles.suggestList}>
                    {SUGGESTIONS.map((s) => (
                      <li key={s.id} className={styles.suggestRow}>
                        <Link
                          href={`/product/${s.slug}`}
                          className={styles.suggestMedia}
                        >
                          <Image
                            src={s.image}
                            alt={s.name}
                            fill
                            sizes="64px"
                            className={styles.suggestImg}
                          />
                        </Link>
                        <div className={styles.suggestBody}>
                          <strong>
                            {s.name}{" "}
                            <span className={styles.suggestVariant}>
                              ({s.variant})
                            </span>
                          </strong>
                          <span>{inr.format(s.price)}</span>
                        </div>
                        <button
                          type="button"
                          className={styles.suggestAdd}
                          onClick={() => addToCart(s.id)}
                          aria-label={`Add ${s.name} to cart`}
                        >
                          <FiShoppingBag />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <Link href="/shop" className={styles.suggestMore}>
                    Explore More Products <FiArrowRight />
                  </Link>
                </section>
              </aside>
            </div>
          </>
        )}

        {/* ─────────── 4. Trust strip ─────────── */}
        <section className={styles.trustStrip} aria-label="Why shop with us">
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
    </main>
  );
}
