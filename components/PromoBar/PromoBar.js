"use client";

import { useEffect, useState } from "react";
import styles from "./PromoBar.module.css";

const MESSAGES = [
  "Complimentary same-day delivery in Mumbai, Bengaluru & Delhi",
  "Pan-India shipping on orders above ₹2,500",
  "Atelier-tied · arranged by hand each morning",
];

export default function PromoBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`${styles.bar} ${hidden ? styles.hidden : ""}`}
      role="region"
      aria-label="Announcements"
    >
      <div className={`container ${styles.row}`}>
        <ul className={styles.list} aria-hidden="true">
          {MESSAGES.map((m, i) => (
            <li key={i} className={styles.item}>
              <span className={styles.dot} />
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
