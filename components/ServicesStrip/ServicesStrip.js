import styles from "./ServicesStrip.module.css";

const SERVICES = [
  {
    id: "shipping",
    title: "Pan India",
    subtitle: "Shipping",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M3 22V8h15v14M18 14h6l4 4v4h-2M5 22h22M8 25a3 3 0 1 0 6 0 3 3 0 1 0-6 0M21 25a3 3 0 1 0 6 0 3 3 0 1 0-6 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "payments",
    title: "Secure",
    subtitle: "Payments",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect
          x="4"
          y="8"
          width="24"
          height="17"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M4 13h24M9 19h4M9 21h7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: "returns",
    title: "7 Days",
    subtitle: "Easy Returns",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M27 16a11 11 0 1 1-4-8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M27 4v6h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 10v7l4 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "handmade",
    title: "Handmade",
    subtitle: "Products",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M16 27s-9-6-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 13-9 13z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "eco",
    title: "Eco Friendly",
    subtitle: "Packaging",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M5 11l11-6 11 6v10l-11 6-11-6V11z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M5 11l11 6 11-6M16 17v10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ServicesStrip() {
  return (
    <section className={styles.section} aria-label="Service guarantees">
      <div className={`container ${styles.grid}`}>
        {SERVICES.map((s) => (
          <article key={s.id} className={styles.item}>
            <span className={styles.icon}>{s.icon}</span>
            <div className={styles.text}>
              <p className={styles.title}>{s.title}</p>
              <p className={styles.subtitle}>{s.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
