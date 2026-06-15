"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { resolveProductImage } from "@/lib/productImages";
import styles from "./RelatedProducts.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function RelatedProducts({ related = [] }) {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.card}`, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 85%" },
      });
    },
    { scope: root }
  );

  if (!related || related.length === 0) return null;

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div className={styles.headText}>
            <span className={styles.eyebrow}>— You may also like</span>
            <h2 className={styles.heading}>
              Composed in <em>a similar register</em>.
            </h2>
          </div>
          <a href="/shop" className={styles.viewAll}>
            View the full shop <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className={styles.grid}>
          {related.slice(0, 4).map((p) => (
            <a key={p.id} href={`/product/${p.slug}`} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={resolveProductImage(p)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 760px) 90vw, 24vw"
                />
                {p.isNew && <span className={styles.badge}>New</span>}
              </div>
              <div className={styles.meta}>
                <div>
                  <h3 className={styles.name}>{p.name}</h3>
                  <span className={styles.occasion}>
                    {p.occasion || p.category}
                  </span>
                </div>
                <span className={styles.price}>{inr.format(p.price)}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
