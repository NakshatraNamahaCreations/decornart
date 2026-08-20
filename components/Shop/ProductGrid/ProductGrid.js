"use client";

import { useRef } from "react";
import Image from "next/image";
import { FiHeart, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/gsap";
import ProductCard from "@/components/ui/ProductCard/ProductCard";
import Price from "@/components/ui/Price/Price";
import { resolveProductImageHover } from "@/lib/productImages";
import styles from "./ProductGrid.module.css";

function ProductRow({
  product,
  isWished,
  isAdded,
  onToggleWishlist,
  onAddToCart,
  priority,
}) {
  const { id, slug, name, price, compareAt, occasion, image, description } =
    product;
  const href = `/product/${slug || id}`;
  const hoverImage = resolveProductImageHover(product);

  return (
    <article className={styles.row}>
      <a href={href} className={styles.rowMedia} aria-label={name}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 40vw, 220px"
          priority={priority}
          className={styles.rowPrimaryImg}
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 640px) 40vw, 220px"
            className={styles.rowHoverImg}
          />
        )}
      </a>

      <div className={styles.rowBody}>
        <div className={styles.rowTop}>
          {occasion ? (
            <span className={styles.rowEyebrow}>{occasion}</span>
          ) : null}
          <h3 className={styles.rowName}>
            <a href={href}>{name}</a>
          </h3>
          {description ? (
            <p className={styles.rowCopy}>{description}</p>
          ) : null}
        </div>

        <div className={styles.rowFoot}>
          <div className={styles.rowPrice}>
            <Price amount={price} compareAt={compareAt} size="md" />
          </div>

          <div className={styles.rowActions}>
            {onToggleWishlist ? (
              <button
                type="button"
                onClick={() => onToggleWishlist(id)}
                aria-pressed={isWished}
                aria-label={
                  isWished ? "Remove from wishlist" : "Add to wishlist"
                }
                className={`${styles.rowWish} ${
                  isWished ? styles.rowWishOn : ""
                }`}
              >
                <FiHeart aria-hidden="true" />
              </button>
            ) : null}

            {onAddToCart ? (
              <button
                type="button"
                onClick={() => onAddToCart(id)}
                className={`${styles.rowAddBtn} ${
                  isAdded ? styles.rowAddBtnDone : ""
                }`}
              >
                <FiShoppingBag aria-hidden="true" />
                {isAdded ? "Added" : "Add to cart"}
              </button>
            ) : null}

            <a href={href} className={styles.rowViewBtn}>
              View <FiArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProductGrid({
  products,
  view = "grid",
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
        <p className={styles.emptyTitle}>No products match those filters.</p>
        <p className={styles.emptyCopy}>
          Try clearing a category, picking a different color, or broadening the price range.
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

  const isList = view === "list";
  return (
    <div
      ref={root}
      className={`${styles.grid} ${isList ? styles.list : ""}`}
    >
      {products.map((p, i) => (
        <div key={p.id} className={styles.cell}>
          {isList ? (
            <ProductRow
              product={p}
              isWished={wishlist.has(p.id)}
              isAdded={added.has(p.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              priority={i < 4}
            />
          ) : (
            <ProductCard
              product={p}
              isWished={wishlist.has(p.id)}
              isAdded={added.has(p.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={i < 4}
            />
          )}
        </div>
      ))}
    </div>
  );
}
