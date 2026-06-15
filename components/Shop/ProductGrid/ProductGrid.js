"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import ProductCard from "@/components/ui/ProductCard/ProductCard";
import styles from "./ProductGrid.module.css";

export default function ProductGrid({
  products,
  wishlist,
  added,
  onToggleWishlist,
  onAddToCart,
  onClear,
}) {
  const root = useRef(null);

  // One-shot reveal on mount only. Filter re-renders don't replay it.
  useGSAP(
    () => {
      gsap.from(`.${styles.cell}`, {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
      });
    },
    { scope: root }
  );

  if (products.length === 0) {
    return (
      <div ref={root} className={styles.empty}>
        <p className={styles.emptyTitle}>No bouquets match those filters.</p>
        <p className={styles.emptyCopy}>
          Try clearing one of the categories or broadening the price range.
        </p>
        <button
          type="button"
          onClick={onClear}
          className={styles.emptyAction}
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div ref={root} className={styles.grid}>
      {products.map((p, i) => (
        <div key={p.id} className={styles.cell}>
          <ProductCard
            product={p}
            isWished={wishlist.has(p.id)}
            isAdded={added.has(p.id)}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={i < 4}
          />
        </div>
      ))}
    </div>
  );
}
