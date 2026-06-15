"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { collections } from "@/lib/data/collections";
import styles from "./FeaturedCollections.module.css";

const TINTS = {
  "sunlit-meadow": "#fde2e4", // pastel pink
  "blush-editorial": "#e2f0d9",    // pastel mint
  "garden-romance": "#fdecd2",  // pastel peach
  "wild-meadow": "#ffd0bf",     // pastel coral
  "snow-lily": "#dfe9f3", // pastel blue
};

export default function FeaturedCollections() {
  const root = useRef(null);
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const cards = root.current.querySelectorAll(`.${styles.card}`);
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 82%",
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>The Decornart Edits</span>
          <h2 className={styles.heading}>Explore Our Collections</h2>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>Hand-tied edits for every kind of moment</p>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {collections.map((c) => (
            <a
              key={c.id}
              href={`/product/${c.id}`}
              className={styles.card}
              style={{ "--mat": TINTS[c.id] }}
              aria-label={`Open ${c.name} collection`}
            >
              <div className={styles.arch}>
                <div className={styles.imgWrap}>
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 420px) 80vw, (max-width: 680px) 42vw, (max-width: 1100px) 28vw, 18vw"
                  />
                </div>
              </div>
              <h3 className={styles.name}>{c.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
