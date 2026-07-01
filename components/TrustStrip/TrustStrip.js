import styles from "./TrustStrip.module.css";

const FEATURES = [
  {
    id: "quality",
    title: "Premium Quality",
    subtitle: "Carefully selected\nhigh quality materials",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="16" cy="14" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M11 20l-2 8 7-4 7 4-2-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M13 14l2 2 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "variety",
    title: "Wide Variety",
    subtitle: "Everything you need\nin one place",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M6 8h9a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H6V8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M26 8h-9a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h9V8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "shipping",
    title: "Fast Shipping",
    subtitle: "Pan India delivery\nat your doorstep",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M3 22V8h15v14M18 14h6l4 4v4h-2M5 22h22M8 25a3 3 0 1 0 6 0 3 3 0 1 0-6 0M21 25a3 3 0 1 0 6 0 3 3 0 1 0-6 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "secure",
    title: "Secure Payment",
    subtitle: "100% safe &\nsecure checkout",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect
          x="7"
          y="14"
          width="18"
          height="13"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M11 14v-3a5 5 0 0 1 10 0v3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="16" cy="20" r="1.2" fill="currentColor" />
        <path
          d="M16 21v2.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "love",
    title: "Made with Love",
    subtitle: "Designed for\ncreators like you",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M16 27s-9-6-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 13-9 13z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function TrustStrip() {
  return (
    <section className={styles.section} aria-label="Why shop with us">
      <div className={`container ${styles.grid}`}>
        {FEATURES.map((f) => (
          <div key={f.id} className={styles.item}>
            <span className={styles.icon} aria-hidden="true">
              {f.icon}
            </span>
            <span className={styles.text}>
              <span className={styles.title}>{f.title}</span>
              <span className={styles.subtitle}>{f.subtitle}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
