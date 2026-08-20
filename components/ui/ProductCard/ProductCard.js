import Image from "next/image";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Price from "@/components/ui/Price/Price";
import { resolveProductImageHover } from "@/lib/productImages";
import styles from "./ProductCard.module.css";

// Star row driven by the product's average review rating. Filled solid
// gold up to the integer part, half gold at .5+, empty (outline gold)
// for the rest — so a 3.5-average product renders 3 full + 1 half + 1
// empty. Text-free by design; the numeric average lives on the product
// detail page.
function Stars({ rating, count = 0 }) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    if (value >= i) {
      stars.push(<FaStar key={i} aria-hidden="true" />);
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} aria-hidden="true" />);
    } else {
      stars.push(<FaRegStar key={i} aria-hidden="true" />);
    }
  }
  const label = count > 0
    ? `Rated ${value.toFixed(1)} out of 5 from ${count} review${count === 1 ? "" : "s"}`
    : "No reviews yet";
  return (
    <span
      className={styles.ratingRow}
      aria-label={label}
      role="img"
      suppressHydrationWarning
    >
      <span className={styles.stars}>{stars}</span>
      {count > 0 && (
        <span className={styles.ratingText}>
          ({value.toFixed(1)}) {count} review{count === 1 ? "" : "s"}
        </span>
      )}
    </span>
  );
}

export default function ProductCard({
  product,
  isWished = false,
  isAdded = false,
  onToggleWishlist,
  onAddToCart,
  sizes = "(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}) {
  const { id, slug, name, price, compareAt, occasion, image, rating, ratingCount } =
    product;
  const href = `/product/${slug || id}`;
  // Only rendered when the product has a second image — either sent by the
  // backend as `imageHover`, or the second entry of its `images[]` array.
  const hoverImage = resolveProductImageHover(product);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <a href={href} className={styles.imageLink} aria-label={name}>
          <Image
            src={image}
            alt={name}
            fill
            sizes={sizes}
            priority={priority}
            className={styles.primaryImg}
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt=""
              aria-hidden="true"
              fill
              sizes={sizes}
              className={styles.hoverImg}
            />
          )}
        </a>

      </div>

      <div className={styles.meta}>
        <div className={styles.metaText}>
          <h3 className={styles.name}>
            <a href={href}>{name}</a>
          </h3>
          {occasion ? <p className={styles.occasion}>{occasion}</p> : null}
        </div>
        {ratingCount > 0 ? <Stars rating={rating} count={ratingCount} /> : null}
        <div className={styles.priceRow}>
          <Price amount={price} compareAt={compareAt} size="md" />
        </div>
        <div className={styles.actionsRow}>
          {onToggleWishlist ? (
            <button
              type="button"
              onClick={() => onToggleWishlist(id)}
              aria-pressed={isWished}
              aria-label={
                isWished ? "Remove from wishlist" : "Add to wishlist"
              }
              className={`${styles.wishBtn} ${
                isWished ? styles.wishBtnOn : ""
              }`}
            >
              <FiHeart aria-hidden="true" />
            </button>
          ) : null}
          {onAddToCart ? (
            <button
              type="button"
              onClick={() => onAddToCart(id)}
              className={`${styles.cartBtn} ${isAdded ? styles.cartBtnDone : ""}`}
            >
              <FiShoppingCart aria-hidden="true" />
              <span className={styles.cartBtnLabel}>
                {isAdded ? "Added" : "Add to Cart"}
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
