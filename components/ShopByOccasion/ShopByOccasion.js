"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { occasions } from "@/lib/data/occasions";
import styles from "./ShopByOccasion.module.css";

export default function ShopByOccasion() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.card}`, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: `.${styles.grid}`,
          start: "top 82%",
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>For every chapter</span>
          <h2 className={styles.heading}>Shop by occasion</h2>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>
            Curated arrangements for the moments that ask for flowers — from
            quiet condolences to the loudest of celebrations.
          </p>
        </div>

        <div className={styles.grid}>
          {occasions.map((o, i) => (
            <a
              key={o.id}
              href={`/occasion/${o.id}`}
              className={styles.card}
            >
              <div className={styles.frame}>
                <Image
                  src={o.image}
                  alt={o.title}
                  fill
                  sizes="(max-width: 540px) 90vw, (max-width: 1100px) 45vw, 22vw"
                />
                <span className={styles.hairline} aria-hidden="true" />
              </div>
              <div className={styles.meta}>
                <span className={styles.ord}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.title}>{o.title}</h3>
                <p className={styles.copy}>{o.copy}</p>
                <span className={styles.cta}>
                  Discover
                  <span className={styles.ctaLine} aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
