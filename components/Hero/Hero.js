"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { banners } from "@/lib/data/banners";
import styles from "./Hero.module.css";

// Auto-advance cadence used on mobile (no scroll-pin there).
const SLIDE_MS = 5800;

const TRUST = [
  {
    id: "handmade",
    title: "Handmade with Love",
    subtitle: "100% Original Creations",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M16 27s-9-6-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 13-9 13z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "quality",
    title: "Premium Quality",
    subtitle: "Carefully Sourced Materials",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle
          cx="16"
          cy="13"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M11 19l-2 9 7-4 7 4-2-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M13 13l2 2 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "secure",
    title: "Secure Payments",
    subtitle: "100% Safe & Secure",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect
          x="4"
          y="8"
          width="24"
          height="17"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M4 13h24M9 19h4M9 21h7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: "delivery",
    title: "Fast Delivery",
    subtitle: "Pan India Shipping",
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          d="M3 22V8h15v14M18 14h6l4 4v4h-2M5 22h22M8 25a3 3 0 1 0 6 0 3 3 0 1 0-6 0M21 25a3 3 0 1 0 6 0 3 3 0 1 0-6 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Hero() {
  const root = useRef(null);
  const mediaRef = useRef(null);
  const copyRef = useRef(null);
  const [active, setActive] = useState(0);
  // Read the latest active index inside the scroll callback without
  // re-creating the ScrollTrigger on every render.
  const activeRef = useRef(0);
  activeRef.current = active;

  useGSAP(
    () => {
      const slides = banners.length;
      const snapPoints = banners.map((_, i) => i / (slides - 1));
      const mm = gsap.matchMedia();

      // Desktop: pin the section and drive slides off scroll progress.
      mm.add("(min-width: 861px)", () => {
        const st = ScrollTrigger.create({
          id: "hero-pin",
          trigger: root.current,
          start: "top top",
          end: () => `+=${(slides - 1) * window.innerHeight}`,
          pin: true,
          scrub: 0.6,
          snap: {
            snapTo: snapPoints,
            duration: { min: 0.25, max: 0.6 },
            ease: "power2.inOut",
            delay: 0.05,
          },
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (slides - 1));
            if (idx !== activeRef.current) setActive(idx);
          },
        });
        return () => st.kill();
      });

      // Mobile: keep the auto-advance carousel + a light scroll parallax.
      mm.add("(max-width: 860px)", () => {
        const intervalId = setInterval(
          () => setActive((i) => (i + 1) % slides),
          SLIDE_MS
        );
        const parallax = gsap.to(mediaRef.current, {
          yPercent: 12,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        return () => {
          clearInterval(intervalId);
          parallax.scrollTrigger?.kill();
          parallax.kill();
        };
      });

      // Hold both the media and the copy hidden until the preloader hands
      // off — they reveal together as the panels split (see the useEffect
      // below listening for "preloader:done").
      gsap.set(mediaRef.current, { opacity: 0 });
      gsap.set(copyRef.current.children, { y: 32, opacity: 0 });
    },
    { scope: root }
  );

  // Reveal slide image + copy when the preloader opens. Fallback timer
  // covers the case where the event never arrives (preloader skipped).
  useEffect(() => {
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(mediaRef.current, {
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
      });
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

  // Re-reveal copy on each slide change. Skip the initial mount run —
  // the preloader-done listener handles the first reveal.
  const skipFirstActiveRef = useRef(true);
  useGSAP(
    () => {
      if (skipFirstActiveRef.current) {
        skipFirstActiveRef.current = false;
        return;
      }
      gsap.fromTo(
        copyRef.current.children,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08 }
      );
    },
    { dependencies: [active], scope: root }
  );

  const handleDotClick = (i) => {
    if (typeof window === "undefined") return;
    const isDesktop = window.matchMedia("(min-width: 861px)").matches;
    if (!isDesktop) {
      setActive(i);
      return;
    }
    const st = ScrollTrigger.getById("hero-pin");
    if (!st) return;
    const target =
      st.start + (i / (banners.length - 1)) * (st.end - st.start);
    window.scrollTo(0, target);
  };

  const b = banners[active];

  return (
    <section
      ref={root}
      className={styles.hero}
      style={{ "--hero-bg": b.accentBg }}
    >
      <div className={styles.leftPanel}>
        <div className={styles.leftInner}>
          <div ref={copyRef} className={styles.copy} key={b.id}>
            <span className={styles.eyebrow}>{b.eyebrow}</span>
            <h1 className={styles.title}>{b.title}</h1>
            <p className={styles.subtitle}>{b.subtitle}</p>
            <a href={b.cta.href} className={styles.cta}>
              {b.cta.label}
            </a>
          </div>

          <div className={styles.dots}>
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                onClick={() => handleDotClick(i)}
                aria-label={`Show banner ${i + 1}`}
                type="button"
              >
                <span className={styles.dotFill} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div ref={mediaRef} className={styles.mediaWrap}>
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className={`${styles.slide} ${i === active ? styles.slideActive : ""}`}
            >
              <Image
                src={banner.image}
                alt={banner.title.replace(/\n/g, " ")}
                fill
                priority={i === 0}
                sizes="(max-width: 860px) 100vw, 55vw"
              />
            </div>
          ))}
        </div>
        {/* Forest gradient bleeds into the image so the seam disappears. */}
        <div className={styles.blend} aria-hidden="true" />
        <div className={styles.vignette} aria-hidden="true" />

        <div className={styles.trust} aria-label="By the numbers">
          {TRUST.map((t) => (
            <div key={t.id} className={styles.trustItem}>
              <span className={styles.trustIcon} aria-hidden="true">
                {t.icon}
              </span>
              <span className={styles.trustText}>
                <span className={styles.trustTitle}>{t.title}</span>
                <span className={styles.trustSub}>{t.subtitle}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <span className={styles.scrollCue}>Scroll</span>
    </section>
  );
}
