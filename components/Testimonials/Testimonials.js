"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { testimonials } from "@/lib/data/testimonials";
import styles from "./Testimonials.module.css";

const PER_PAGE = 3;

function Stars({ count = 5 }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i < count ? styles.starOn : styles.starOff}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const root = useRef(null);
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(testimonials.length / PER_PAGE);
  const visible = testimonials.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  useGSAP(
    () => {
      gsap.fromTo(
        `.${styles.card}`,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
        }
      );
    },
    { dependencies: [page], scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <h2 className={styles.heading}>What Our Customers Say</h2>
        </div>

        <div className={styles.grid} aria-live="polite">
          {visible.map((t) => (
            <article key={t.id} className={styles.card}>
              <Stars count={t.rating} />
              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
              <div className={styles.author}>
                <span className={styles.avatar} aria-hidden="true">
                  {t.name.charAt(0)}
                </span>
                <span className={styles.authorName}>{t.name}</span>
              </div>
            </article>
          ))}
        </div>

        {pageCount > 1 && (
          <div className={styles.dots}>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Show page ${i + 1}`}
                className={`${styles.dot} ${
                  i === page ? styles.dotActive : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
