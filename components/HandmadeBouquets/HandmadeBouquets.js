"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { handmade } from "@/lib/data/testimonials";
import styles from "./HandmadeBouquets.module.css";

export default function HandmadeBouquets() {
  const root = useRef(null);
  const copyRef = useRef(null);
  const imgRef = useRef(null);
  const ringLgRef = useRef(null);
  const ringMdRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section. As the user scrolls, the image tilts 45°
      // clockwise (scaled up to keep the frame filled) and the copy fades in.
      mm.add("(min-width: 861px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=200%",
            scrub: 2,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          imgRef.current,
          { rotate: 0 },
          { rotate: 45, ease: "none" },
          0
        )
          .fromTo(
            [ringLgRef.current, ringMdRef.current],
            { scale: 0.35 },
            { scale: 0.6, ease: "none" },
            0
          )
          .from(
            copyRef.current.children,
            {
              y: 50,
              opacity: 0,
              stagger: 0.15,
              ease: "power2.out",
            },
            0.1
          );
      });

      // Mobile: a simple on-enter reveal, no pin.
      mm.add("(max-width: 860px)", () => {
        gsap.from(copyRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.mediaCol}>
            <div className={styles.rings} aria-hidden="true">
              <div className={`${styles.ringSlot} ${styles.ringLg}`}>
                <div ref={ringLgRef} className={styles.ringScale}>
                  <svg className={styles.ring} viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="49.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.4"
                      pathLength="100"
                      strokeDasharray="85 15"
                    />
                  </svg>
                </div>
              </div>
              <div className={`${styles.ringSlot} ${styles.ringMd}`}>
                <div ref={ringMdRef} className={styles.ringScale}>
                  <svg className={styles.ring} viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="49.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      pathLength="100"
                      strokeDasharray="70 30"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.media}>
              <span className={styles.badge}>This week's drop</span>
              <Image
                ref={imgRef}
                src={handmade.image}
                alt={handmade.imageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 52vw"
              />
            </div>
          </div>

          <div ref={copyRef} className={styles.copy}>
            <span className="eyebrow">Handmade, small batch</span>
            <h2 className={styles.heading}>
              No two are ever quite the same.
            </h2>
            <p className={styles.body}>
              Every morning our florists hand-tie a limited run from whatever
              arrived freshest at the market. When the day's batch is gone, it's
              gone — which is rather the point.
            </p>
            <p className={styles.body}>
              Each bouquet is wrapped, conditioned, and photographed before it
              leaves the studio, so the one you order is the one that arrives.
            </p>
            <a href="/handmade" className={styles.cta}>
              See this week's drop
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
