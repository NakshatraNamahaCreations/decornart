import styles from "./Button.module.css";

export default function Button({
  as,
  variant = "primary",
  size = "md",
  href,
  fullWidth = false,
  className = "",
  type,
  children,
  ...rest
}) {
  const Tag = as || (href ? "a" : "button");
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const tagProps =
    Tag === "button" ? { type: type || "button" } : { href };

  return (
    <Tag className={classes} {...tagProps} {...rest}>
      <span className={styles.label}>{children}</span>
    </Tag>
  );
}
