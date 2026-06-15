"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import promoBg1 from "@/assets/promo-bg1.png";
import promoBg2 from "@/assets/promo-bg2.png";
import styles from "./WhyChooseUs.module.css";

const SPOTLIGHTS = [
  {
    id: "birthday",
    title: "Birthday Flowers",
    copy: "Brighten their special day with hand-picked fresh blooms.",
    cta: { label: "Shop Now", href: "/occasion/birthday" },
    image: promoBg1,
  },
  {
    id: "anniversary",
    title: "Anniversary Flowers",
    copy: "Celebrate timeless love with elegant arrangements.",
    cta: { label: "Order Now", href: "/occasion/anniversary" },
    image: promoBg2,
  },
];

export default function WhyChooseUs() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.card}`, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <h2 className={styles.heading}>Flowers for Special Moments</h2>
        </div>

        <div className={styles.grid}>
          {SPOTLIGHTS.map((s) => (
            <a key={s.id} href={s.cta.href} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 860px) 100vw, 50vw"
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
