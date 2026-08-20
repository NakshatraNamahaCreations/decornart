"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import { listProducts } from "@/lib/api/products";
import { resolveProductImage } from "@/lib/productImages";
import prod1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import prod2 from "@/assets/butterfly-luxury/luxury1.jpeg";
import prod3 from "@/assets/butterfly-signature/signature1.jpeg";
import prod4 from "@/assets/for-mother-gift/for-mother4.jpeg";
import prod5 from "@/assets/for-you-bouquet/for-you4.jpeg";
import prod6 from "@/assets/luxe-dual/luxe-dual3.jpeg";
import prod7 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import prod8 from "@/assets/luxe-rose/luxe-rose4.jpeg";
import styles from "./Bestsellers.module.css";

const DEMO_PRODUCTS = [
  { id: "d1", slug: "butterfly-gift-box",  name: "Butterfly Gift Box", price: 650, isNew: true,  image: prod1 },
  { id: "d2", slug: "butterlfy-luxe-bouquet-basket", name: "Butterfly Luxury Bouquet Basket", price: 850, isNew: false, image: prod2 },
  { id: "d3", slug: "butterfly-signature", name: "Butterfly Signature Hand Bag", price: 700, isNew: true,  image: prod3 },
  { id: "d4", slug: "for-mom-with-love",   name: "For Mom With Love Gift Box", price: 750, isNew: false, image: prod4 },
  { id: "d5", slug: "just-for-you-bouquet-basket", name: "Just For You Bouquet Basket", price: 900, isNew: false, image: prod5 },
  { id: "d6", slug: "floral-gift-basket", name: "Floral Gift Basket", price: 1049, isNew: false, image: prod6 },
  { id: "d7", slug: "heart-bouquet-basket", name: "Heart Bouquet Basket", price: 279, isNew: true, image: prod7 },
  { id: "d8", slug: "rose-gift-box-with-led", name: "Rose Gift Box With LED", price: 459, isNew: false, image: prod8 },
];

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Bestsellers() {
  const root = useRef(null);
  const { addItem } = useCart();
  const [added, setAdded] = useState(() => new Set());
  const [wishlist, setWishlist] = useState(() => new Set());
  // Real bestsellers from the backend. Falls back to the local DEMO_PRODUCTS
  // so the section still renders during dev / on API failure — but real
  // products carry a Mongo `id` that the cart accepts.
  const [apiProducts, setApiProducts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listProducts({ limit: 6, status: "active", bestseller: true })
      .then((res) => {
        const rows = Array.isArray(res) ? res : res?.items || [];
        if (!cancelled) setApiProducts(rows);
      })
      .catch(() => {
        if (!cancelled) setApiProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const products = apiProducts && apiProducts.length
    ? apiProducts.slice(0, 6).map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        isNew: p.isBestseller || p.isNew,
        image: resolveProductImage(p),
        real: true,
      }))
    : DEMO_PRODUCTS.slice(0, 6).map((p) => ({ ...p, real: false }));

  const addToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product?.real) return;
    setAdded((prev) => new Set(prev).add(product.id));
    try {
      await addItem(product.id, 1);
      // Dispatch the same event the Shop page uses so the Navbar's cart
      // toast (with thumbnail + name + price) fires — keeps every "added
      // to cart" affordance visually consistent across the site.
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cart:item-added", {
            detail: {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              qty: 1,
            },
          })
        );
      }
    } catch {
      setAdded((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      /* silently ignore — the Navbar toast only fires on success */
    }
  };

  const toggleWishlist = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("wishlist:item-added", { detail: { productId } })
          );
        }
      }
      return next;
    });
  };

  useGSAP(
    () => {
      if (!products.length) return;
      gsap.from(`.${styles.card}`, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 85%" },
      });
    },
    { scope: root, dependencies: [products.length] }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <div className={styles.head}>
          <span className={styles.viewAllSpacer} aria-hidden="true">
            View all reviews <span>→</span>
          </span>
          <span className={styles.headRule} aria-hidden="true" />
          <h2 className={styles.heading}>Best Sellers</h2>
          <span className={styles.headRule} aria-hidden="true" />
          <a href="/shop" className={styles.viewAll}>
            View all <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className={styles.grid}>
          {products.map((p) => {
            const isAdded = added.has(p.id);
            const isWished = wishlist.has(p.id);
            return (
              <a key={p.id} href={`/product/${p.slug}`} className={styles.card}>
                <div className={styles.media}>
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 860px) 45vw, 240px"
                      unoptimized
                    />
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  {p.isNew ? (
                    <span className={styles.badge}>Best Seller</span>
                  ) : null}
                </div>

                <div className={styles.info}>
                  <h3 className={styles.name}>{p.name}</h3>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{inr.format(p.price)}</span>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(e, p.id)}
                        className={`${styles.iconBtn} ${isWished ? styles.wished : ""}`}
                        aria-label={
                          isWished
                            ? `Remove ${p.name} from wishlist`
                            : `Add ${p.name} to wishlist`
                        }
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
                            fill={isWished ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => addToCart(e, p)}
                        className={`${styles.iconBtn} ${isAdded ? styles.added : ""}`}
                        aria-label={
                          isAdded ? "Added to cart" : `Add ${p.name} to cart`
                        }
                      >
                        {isAdded ? (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M5 12.5l4.5 4.5L19 7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M5 6h2l1.6 9.5a1.5 1.5 0 0 0 1.5 1.3h6.8a1.5 1.5 0 0 0 1.5-1.2L21 9H8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle cx="10.5" cy="20" r="1.2" fill="currentColor" />
                            <circle cx="17.5" cy="20" r="1.2" fill="currentColor" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
