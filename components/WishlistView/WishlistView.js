"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAuth } from "@/components/providers/AuthProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCart } from "@/components/providers/CartProvider";
import { resolveProductImage } from "@/lib/productImages";
import styles from "./WishlistView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const SORTS = [
  { id: "added", label: "Recently added" },
  { id: "low", label: "Price · low to high" },
  { id: "high", label: "Price · high to low" },
  { id: "az", label: "A — Z" },
];

export default function WishlistView() {
  const root = useRef(null);
  const { isAuthed, isLoading } = useAuth();
  const { items: wishItems, remove } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(() => new Set());
  const [sort, setSort] = useState("added");

  const items = useMemo(() => {
    const list = [...wishItems];
    if (sort === "low") return list.sort((a, b) => a.price - b.price);
    if (sort === "high") return list.sort((a, b) => b.price - a.price);
    if (sort === "az") return list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [wishItems, sort]);

  const subtotal = items.reduce((sum, p) => sum + (p.price || 0), 0);

  const handleRemove = (productId) => {
    remove(productId).catch(() => {});
  };

  const addToCart = async (productId) => {
    setAdded((prev) => new Set(prev).add(productId));
    try {
      await addItem(productId, 1);
    } catch {
      setAdded((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const moveAllToCart = async () => {
    for (const p of items) {
      // eslint-disable-next-line no-await-in-loop
      await addToCart(p.productId || p.id);
    }
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.head} > *`, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(`.${styles.card}`, {
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.4,
      });
    },
    { scope: root, dependencies: [items.length] }
  );

  if (!isLoading && !isAuthed) {
    return (
      <section className={styles.section}>
        <div className="container">
          <div className={styles.empty}>
            <h2 className={styles.emptyHeading}>
              Sign in to <em>save bouquets</em>.
            </h2>
            <p className={styles.emptyCopy}>
              Your wishlist follows you across devices — sign in to start
              saving the pieces you love.
            </p>
            <div className={styles.emptyActions}>
              <a href="/login" className={styles.cta}>
                Sign in <span aria-hidden="true">→</span>
              </a>
              <a href="/shop" className={styles.ghost}>
                Browse the shop
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <span className={styles.eyebrow}>— Saved by you</span>
            <h1 className={styles.heading}>
              Your <em>wishlist</em>.
            </h1>
            <p className={styles.lead}>
              The bouquets you've kept an eye on — composed by hand, ready
              when you are.
            </p>
          </div>

          {items.length > 0 && (
            <div className={styles.headRight}>
              <div className={styles.count}>
                <span className={styles.countNum}>
                  {String(items.length).padStart(2, "0")}
                </span>
                <span className={styles.countLabel}>
                  {items.length === 1 ? "Saved piece" : "Saved pieces"}
                </span>
              </div>
              <div className={styles.subtotal}>
                <span className={styles.subtotalLabel}>Subtotal</span>
                <span className={styles.subtotalValue}>
                  {inr.format(subtotal)}
                </span>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.toolbar}>
            <div className={styles.sort}>
              <span className={styles.sortLabel}>Sort</span>
              <div className={styles.selectWrap}>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className={styles.select}
                  aria-label="Sort wishlist"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <span className={styles.selectCaret} aria-hidden="true">
                  ↓
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={moveAllToCart}
              className={styles.moveAll}
            >
              Move all to cart <span aria-hidden="true">→</span>
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyMark} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className={styles.emptyHeading}>
              Nothing saved <em> yet</em>.
            </h2>
            <p className={styles.emptyCopy}>
              When you find a bouquet you'd like to come back to, tap the
              heart — it'll keep its place here.
            </p>
            <div className={styles.emptyActions}>
              <a href="/shop" className={styles.cta}>
                Browse the shop <span aria-hidden="true">→</span>
              </a>
              <a href="/handmade" className={styles.ghost}>
                See this week's drop
              </a>
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((p) => {
              const productId = p.productId || p.id;
              const isAdded = added.has(productId);
              return (
                <article key={productId} className={styles.card}>
                  <a href={`/product/${p.slug}`} className={styles.imageWrap}>
                    <Image
                      src={resolveProductImage(p)}
                      alt={p.name}
                      fill
                      sizes="(max-width: 760px) 90vw, 30vw"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(productId);
                      }}
                      className={styles.remove}
                      aria-label={`Remove ${p.name} from wishlist`}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </a>

                  <div className={styles.meta}>
                    <div className={styles.metaText}>
                      <h3 className={styles.name}>
                        <a href={`/product/${p.slug}`}>{p.name}</a>
                      </h3>
                      <span className={styles.occasion}>{p.category}</span>
                    </div>
                    <span className={styles.price}>{inr.format(p.price)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(productId)}
                    className={`${styles.addToCart} ${
                      isAdded ? styles.added : ""
                    }`}
                  >
                    {isAdded ? "Added ✓" : "Add to cart"}
                    {!isAdded && <span aria-hidden="true">→</span>}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
