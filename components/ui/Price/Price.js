import styles from "./Price.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Price({
  amount,
  compareAt,
  size = "md",
  className = "",
}) {
  const hasCompare =
    typeof compareAt === "number" && compareAt > amount && amount > 0;

  return (
    <span className={`${styles.price} ${styles[size]} ${className}`}>
      <span className={styles.current}>{inr.format(amount)}</span>
      {hasCompare ? (
        <span className={styles.compare} aria-label="Original price">
          {inr.format(compareAt)}
        </span>
      ) : null}
    </span>
  );
}
