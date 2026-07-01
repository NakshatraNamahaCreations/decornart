"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { promoBanners } from "@/lib/data/promoBanners";
import styles from "./PromoBanners.module.css";

export default function PromoBanners() {
  const root = useRef(null);

  useGSAP(
    () => {
      const cards = root.current.querySelectorAll("[data-reveal]");
      gsap.from(cards, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <div className={styles.grid}>
          {promoBanners.map((b) => (
            <article
              key={b.id}
              className={`${styles.card} ${
                b.variant === "wide" ? styles.wide : styles.narrow
              }`}
              data-reveal
            >
              <div className={styles.copy}>
                <span className={styles.eyebrow}>{b.eyebrow}</span>
                <h3 className={styles.title}>{b.title}</h3>
                {b.features?.length > 0 && (
                  <ul className={styles.features}>
                    {b.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
               
                <Link href={b.cta.href} className={styles.cta}>
                  {b.cta.label}
                  <span className={styles.arrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        d="M5 12h14m-6-6 6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
              <div className={styles.media}>
                <Image
                  src={b.image}
                  alt={b.imageAlt}
                  fill
                  sizes={
                    b.variant === "wide"
                      ? "(max-width: 900px) 90vw, 55vw"
                      : "(max-width: 900px) 90vw, 30vw"
                  }
                  className={styles.mediaImg}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
