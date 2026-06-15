import styles from "./TrustStrip.module.css";

const STATS = [
  { id: "bouquets", figure: "10K+", label: "Bouquets Crafted" },
  { id: "delivery", figure: "24h", label: "Same-Day Delivery" },
  { id: "seasonal", figure: "100%", label: "Fresh From Market" },
  { id: "cities", figure: "4", label: "Cities Served" },
];

export default function TrustStrip() {
  return (
    <section className={styles.section} aria-label="By the numbers">
      <div className={`container ${styles.grid}`}>
        {STATS.map((s) => (
          <article key={s.id} className={styles.card}>
            <span className={styles.figure}>{s.figure}</span>
            <span className={styles.rule} aria-hidden="true" />
            <span className={styles.label}>{s.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
