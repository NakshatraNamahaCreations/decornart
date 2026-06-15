import Image from "next/image";
import Price from "@/components/ui/Price/Price";
import styles from "./ProductCard.module.css";

export default function ProductCard({
  product,
  isWished = false,
  isAdded = false,
  onToggleWishlist,
  onAddToCart,
  sizes = "(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}) {
  const { id, slug, name, price, compareAt, occasion, image } = product;
  const href = `/product/${slug || id}`;

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
          />
        </a>

        {onToggleWishlist ? (
          <button
            type="button"
            onClick={() => onToggleWishlist(id)}
            aria-pressed={isWished}
            aria-label={
              isWished ? "Remove from wishlist" : "Add to wishlist"
            }
            className={`${styles.wishlist} ${
              isWished ? styles.wishlistOn : ""
            }`}
          >
            {isWished ? "♥" : "♡"}
          </button>
        ) : null}

        {onAddToCart ? (
          <button
            type="button"
            onClick={() => onAddToCart(id)}
            className={`${styles.addToCart} ${isAdded ? styles.added : ""}`}
          >
            {isAdded ? "Added ✓" : "Add to cart"}
          </button>
        ) : null}
      </div>

      <div className={styles.meta}>
        <div className={styles.metaText}>
          <h3 className={styles.name}>
            <a href={href}>{name}</a>
          </h3>
          {occasion ? <p className={styles.occasion}>{occasion}</p> : null}
        </div>
        <Price amount={price} compareAt={compareAt} size="md" />
      </div>
    </article>
  );
}
