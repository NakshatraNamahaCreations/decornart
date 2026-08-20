"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import bouquet from "@/assets/luxe-rose/luxe-rose2.jpeg";
import { useBannerContent } from "@/hooks/useBannerContent";
import styles from "./beautifulHero.module.css";

export default function beautifulHero() {
  const root = useRef(null);
  const banner = useBannerContent("beautiful-hero");
  const bouquetSrc = banner.loaded ? banner.image || bouquet : null;

  useGSAP(
    () => {
      gsap.from(`.${styles.copy} > *`, {
        y: 36,
        opacity: 0,
        duration: 0.95,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(`.${styles.media}`, {
        scale: 0.96,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.issue}>
            {banner.text("eyebrow", "Issue Nº 24 · This Week's Drop")}
          </span>
          <h1 className={styles.heading}>
            {banner.text(
              "title",
              <>
                beautiful <em>Bouquets</em>.
              </>
            )}
          </h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>
            {banner.text(
              "subtitle",
              "A small-batch line our florists hand-tie each morning from whatever arrives freshest at the market. When today's run is done — it's done. Which is rather the point."
            )}
          </p>
          <div className={styles.actions}>
            {banner.loaded && (
              <a href={banner.href || "#drop"} className={styles.cta}>
                {banner.ctaLabel || "Shop the drop"}
                <span aria-hidden="true">→</span>
              </a>
            )}
            <a href="#process" className={styles.ghost}>
              How it's made
            </a>
          </div>
        </div>

        <div className={styles.media}>
          {bouquetSrc && (
            <Image
              src={bouquetSrc}
              alt="A hand-tied bouquet from this week's drop"
              fill
              sizes="(max-width: 860px) 90vw, 45vw"
              priority
            />
          )}
          <div className={styles.caption}>
            <span className={styles.captionTitle}>Wild Meadow</span>
            <span className={styles.captionSub}>Seasonal, hand-tied</span>
          </div>
        </div>
      </div>
    </section>
  );
}
