"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./OccasionView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function OccasionView({ occasion, products }) {
  const root = useRef(null);
  const [added, setAdded] = useState(() => new Set());

  const addToCart = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded((prev) => new Set(prev).add(id));
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.crumbs}, .${styles.eyebrow}, .${styles.heading}, .${styles.rule}, .${styles.lead}`, {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from(`.${styles.card}`, {
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 85%" },
      });
    },
    { scope: root, dependencies: [occasion.id] }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <a href="/">Home</a>
        
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbActive}>{occasion.label}</span>
        </nav>

        {/* Head */}
        <header className={styles.head}>
          <span className={styles.eyebrow}>— Curated for the occasion</span>
          <h1 className={styles.heading}>
            Bouquets for <em>{(occasion.label || "").toLowerCase()}</em>.
          </h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>{occasion.blurb}</p>
          <span className={styles.count}>
            {String(products.length).padStart(2, "0")} pieces in this edit
          </span>
        </header>

        {/* Grid */}
        {products.length === 0 ? (
          <div className={styles.empty}>
            <h2 className={styles.emptyHeading}>
              Nothing here <em>yet</em>.
            </h2>
            <p className={styles.emptyCopy}>
              We're composing new arrangements for this chapter. In the
              meantime, browse the rest of the atelier.
            </p>
            <a href="/shop" className={styles.cta}>
              Browse the shop <span aria-hidden="true">→</span>
            </a>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((p) => (
              <a
                key={p.id}
                href={`/product/${p.slug}`}
                className={styles.card}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 480px) 90vw, (max-width: 760px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  />
                  {p.isBestseller ? (
                    <span className={`${styles.badge} ${styles.badgeBest}`}>
                      Bestseller
                    </span>
                  ) : (
                    p.isNew && <span className={styles.badge}>New</span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => addToCart(e, p.id)}
                    className={`${styles.addToCart} ${
                      added.has(p.id) ? styles.added : ""
                    }`}
                  >
                    {added.has(p.id) ? "Added ✓" : "Add to cart"}
                  </button>
                </div>
                <div className={styles.meta}>
                  <div>
                    <h3 className={styles.name}>{p.name}</h3>
                    <span className={styles.occasion}>{p.occasion}</span>
                  </div>
                  <span className={styles.price}>{inr.format(p.price)}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Foot */}
        <div className={styles.foot}>
          <a href="/shop" className={styles.viewAll}>
            View the full shop <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
