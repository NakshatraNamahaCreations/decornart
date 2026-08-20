"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import promoBg1 from "@/assets/promoimg1.png";
import promoBg2 from "@/assets/promoimg2.png";
import promoBg3 from "@/assets/promoimg3.png";
import { useBannerList } from "@/hooks/useBannerList";
import styles from "./SpecialMoments.module.css";

const SPOTLIGHTS = [
  {
    id: "baskets",
    title: "Premium Collection",
    copy: "Baskets, foam, wraps and fillers — the base of every arrangement you make.",
    cta: { label: "Shop Now", href: "/category/flower-basket" },
    image: promoBg1,
    textColor: "#FFFFFF",
  },
  {
    id: "crochet",
    title: "Crochet Supplies",
    copy: "Yarn, hooks and tools for the pieces you'll keep stitching.",
    cta: { label: "Browse crochet", href: "/category/crochet-materials" },
    image: promoBg2,
    textColor: "#2A0F2B",
  },
  {
    id: "decor",
    title: "Baby Shower Collection",
    copy: "Lifelike greenery and statement planters — style a space with zero upkeep.",
    cta: { label: "Shop Colors", href: "/category/artificial-plants" },
    image: promoBg3,
    textColor: "#6F2A5E",
  },
];

// Adapt an admin banner row into the shape SPOTLIGHTS uses. Overlay text
// stays white by default — admins can't yet pick a per-card colour from the
// banner form (would need a new field), so we keep the safe default.
function fromApiRow(row) {
  return {
    id: `api-${row.id}`,
    title: row.title || "",
    copy: row.subtitle || "",
    cta: {
      label: row.ctaLabel || "Shop now",
      href: row.href || "/shop",
    },
    image: row.image || "",
    textColor: "#FFFFFF",
  };
}

export default function SpecialMoments() {
  const root = useRef(null);
  const { rows: cards } = useBannerList("special-moments", SPOTLIGHTS, fromApiRow);

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
          {cards.map((s) => (
            <a
              key={s.id}
              href={s.cta.href}
              className={styles.card}
              style={{ "--card-text": s.textColor }}
            >
              <div className={styles.imageWrap}>
                {s.image && (
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 860px) 100vw, 40vw"
                  />
                )}
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
