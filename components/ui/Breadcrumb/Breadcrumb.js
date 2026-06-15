import styles from "./Breadcrumb.module.css";

export default function Breadcrumb({ items = [], className = "" }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={`${styles.nav} ${className}`}>
      <ol className={styles.list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const key = `${item.href || item.label}-${idx}`;
          return (
            <li key={key} className={styles.item}>
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={styles.current}
                >
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              )}
              {!isLast ? (
                <span aria-hidden="true" className={styles.sep}>
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
