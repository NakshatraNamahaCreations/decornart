"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import heroImg from "@/assets/luxe-rose/luxe-rose1.jpeg";
import { useBannerContent } from "@/hooks/useBannerContent";
import styles from "./AboutHero.module.css";

export default function AboutHero() {
  const root = useRef(null);
  const banner = useBannerContent("about-hero");
  const heroSrc = banner.loaded ? banner.image || heroImg : null;

  useGSAP(
    () => {
      gsap.from(`.${styles.lineWrap} > *`, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(
        [
          `.${styles.eyebrow}`,
          `.${styles.rule}`,
          `.${styles.lead}`,
          `.${styles.figures}`,
        ],
        {
          y: 24,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.5,
        }
      );
      gsap.from(`.${styles.media}`, {
        scale: 0.96,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      {/* corner marks — editorial registration crosses */}
      <span className={`${styles.mark} ${styles.markTL}`} aria-hidden="true">
        Decornart · Nº 06
      </span>
      <span className={`${styles.mark} ${styles.markTR}`} aria-hidden="true">
        Est. 2019 · Mumbai
      </span>

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>
            {banner.text("eyebrow", "The Atelier")}
          </span>

          <h1 className={styles.heading}>
            {banner.loaded && (
              banner.title ? (
                <span className={styles.lineWrap}>
                  <span className={styles.line}>{banner.title}</span>
                </span>
              ) : (
                <span className={styles.lineWrap}>
                  <span className={styles.line}>Flowers <em>worth</em></span>
                  <span className={styles.line}>waiting for.</span>
                </span>
              )
            )}
          </h1>

          <span className={styles.rule} aria-hidden="true" />

          <p className={styles.lead}>
            {banner.text(
              "subtitle",
              "A small atelier composing hand-tied bouquets each morning — for one door, on one day, by the people who chose the stems."
            )}
          </p>

          <div className={styles.figures}>
            <div>
              <span className={styles.figure}>06</span>
              <span className={styles.figureLabel}>Years in bloom</span>
            </div>
            <div>
              <span className={styles.figure}>04</span>
              <span className={styles.figureLabel}>Cities served</span>
            </div>
            <div>
              <span className={styles.figure}>1.2k</span>
              <span className={styles.figureLabel}>Editions delivered</span>
            </div>
          </div>
        </div>

        <div className={styles.media}>
          {heroSrc && (
            <Image
              src={heroSrc}
              alt="A hand-tied Decornart bouquet"
              fill
              sizes="(max-width: 860px) 90vw, 45vw"
              priority
            />
          )}
          
        </div>
      </div>

      <span className={styles.scrollCue} aria-hidden="true">
        Scroll
        <span className={styles.scrollLine} />
      </span>
    </section>
  );
}
