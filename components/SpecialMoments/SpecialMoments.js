"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import promoBg1 from "@/assets/promo-1.png";
import promoBg2 from "@/assets/ban2.png";
import promoBg3 from "@/assets/2-promo.png";
import styles from "./SpecialMoments.module.css";

const SPOTLIGHTS = [
  {
    id: "baskets",
    title: "Premium Collection",
    copy: "Baskets, foam, wraps and fillers — the base of every arrangement you make.",
    cta: { label: "Shop Now", href: "/category/flower-basket-materials" },
    image: promoBg1,
  },
  {
    id: "crochet",
    title: "Crochet & Yarn Supplies",
    copy: "Yarn, hooks and tools for the pieces you'll keep stitching.",
    cta: { label: "Browse crochet", href: "/category/crochet-materials" },
    image: promoBg2,
  },
  {
    id: "decor",
    title: "Baby Shower Collection",
    copy: "Lifelike greenery and statement planters — style a space with zero upkeep.",
    cta: { label: "Shop Colors", href: "/category/artificial-plants" },
    image: promoBg3,
  },
];

export default function SpecialMoments() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.card}`, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container" style={{maxWidth:"1480px"}}>
        <div className={styles.grid}>
          {SPOTLIGHTS.map((s) => (
            <a key={s.id} href={s.cta.href} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 860px) 100vw, 40vw"
                />
              </div>
              <div className={styles.overlay}>
                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.copy}>{s.copy}</p>
                <span className={styles.ctaBtn}>{s.cta.label}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
