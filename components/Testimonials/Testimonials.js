"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { testimonials, testimonialsHero } from "@/lib/data/testimonials";
import styles from "./Testimonials.module.css";

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

  useGSAP(
    () => {
      const cards = root.current.querySelectorAll("[data-reveal]");
      gsap.from(cards, {
        opacity: 0,
        y: 22,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <div className={styles.head}>
          <span className={styles.viewAllSpacer} aria-hidden="true">
            View all reviews <span>→</span>
          </span>
          <span className={styles.headRule} aria-hidden="true" />
          <h2 className={styles.heading}>What Our Creators Say</h2>
          <span className={styles.headRule} aria-hidden="true" />
          <Link href="/reviews" className={styles.viewAll}>
            View all reviews <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {testimonials.slice(0, 4).map((t) => (
            <article key={t.id} className={styles.card} data-reveal>
              <header className={styles.author}>
                <span className={styles.monogram} aria-hidden="true">
                  {t.name.charAt(0)}
                </span>
                <span className={styles.meta}>
                  <span className={styles.authorName}>{t.name}</span>
                  {t.verified && (
                    <span className={styles.verified}>Verified Buyer</span>
                  )}
                  <Stars count={t.rating} />
                </span>
              </header>

              <p className={styles.quote}>{t.quote}</p>

              <ul className={styles.thumbs}>
                {t.thumbnails.map((thumb, i) => (
                  <li key={i} className={styles.thumb}>
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      sizes="60px"
                      className={styles.thumbImg}
                    />
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className={styles.heroCard} data-reveal>
            <Image
              src={testimonialsHero.src}
              alt={testimonialsHero.alt}
              fill
              sizes="(max-width: 900px) 90vw, 22vw"
              className={styles.heroImg}
            />
            <p className={styles.heroQuote}>{testimonialsHero.quote}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
