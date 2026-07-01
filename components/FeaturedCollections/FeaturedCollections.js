"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { categories } from "@/lib/data/categories";
import styles from "./FeaturedCollections.module.css";

export default function FeaturedCollections() {
  const root = useRef(null);
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const cards = gridRef.current.querySelectorAll("[data-reveal]");
      gsap.from(cards, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="categories" className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <header className={styles.head}>
          <span className={styles.eyebrow}>Our Categories</span>
          <h2 className={styles.heading}>Shop by Category</h2>
          <p className={styles.lead}>
            Raw materials and supplies for floral design, crafting, gifting and
            decor — sourced in small lots and stocked for the makers.
          </p>
        </header>

        <div ref={gridRef} className={styles.grid}>
          {categories.map((c) => (
            <a
              key={c.id}
              href={`/category/${c.id}`}
              className={styles.card}
              aria-label={`Browse ${c.name}`}
              data-reveal
            >
              <span className={styles.arch}>
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 560px) 45vw, (max-width: 900px) 30vw, 14vw"
                  className={styles.archImg}
                />
              </span>
              <span className={styles.foot}>
                <span className={styles.name}>{c.name}</span>
                <span className={styles.shopNow}>
                  Shop now
                  <span className={styles.arrowSvg} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14">
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
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
