"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { banners } from "@/lib/data/banners";
import styles from "./Hero.module.css";

export default function Hero() {
  const root = useRef(null);
  const copyRef = useRef(null);

  // Single static banner — first entry in the data.
  const b = banners[0];
  const primaryCta = b.primaryCta ?? b.cta;
  const secondaryCta = b.secondaryCta;

  useGSAP(
    () => {
      // Hold the copy hidden until the preloader hands off. Background
      // stays visible so the hero never reads as an empty cream block.
      gsap.set(copyRef.current.children, { y: 32, opacity: 0 });
    },
    { scope: root }
  );

  // Reveal copy when the preloader opens (fallback timer included).
  useEffect(() => {
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(copyRef.current.children, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });
    };
    window.addEventListener("preloader:done", reveal);
    const fallback = setTimeout(reveal, 4000);
    return () => {
      window.removeEventListener("preloader:done", reveal);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={root}
      className={styles.hero}
      style={{ "--hero-bg": b.accentBg, "--accent": b.accent }}
    >
      {/* Single full-bleed background image. */}
      <span
        className={styles.bgStage}
        aria-hidden="true"
        style={{ backgroundImage: `url(${b.bgImage.src})` }}
      />

      <div className={styles.inner}>
        <span className={styles.mark}>Decor N Art — est. atelier</span>

        <div className={styles.main}>
          <div className={styles.copyCol}>
            <div ref={copyRef} className={styles.copy}>
              {b.eyebrow && (
                <span className={styles.eyebrow}>{b.eyebrow}</span>
              )}
              <h1 className={styles.title}>{b.title}</h1>
              {b.script && (
                <span className={styles.script}>
                  {b.script}
                  <span className={styles.scriptHeart} aria-hidden="true">
                    ♥
                  </span>
                </span>
              )}
              <p className={styles.subtitle}>{b.subtitle}</p>
              <div className={styles.ctaRow}>
                {primaryCta && (
                  <a href={primaryCta.href} className={styles.cta}>
                    <span>{primaryCta.label}</span>
                    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
                {secondaryCta && (
                  <a href={secondaryCta.href} className={styles.ctaGhost}>
                    {secondaryCta.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      <span className={styles.scrollCue}>Scroll</span>
    </section>
  );
}
