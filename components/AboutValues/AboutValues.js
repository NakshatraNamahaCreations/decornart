"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./AboutValues.module.css";

const VALUES = [
  {
    id: "sourced",
    title: "Single-origin stems",
    copy: "We buy from named local growers — never aggregators. If we can't trace it back to the farm, it doesn't enter the atelier.",
    side: "Sourcing",
  },
  {
    id: "hand",
    title: "Composed by hand",
    copy: "Every bouquet is built by a florist, not a fixture. Tied, trimmed, adjusted by eye — until it sits exactly the way it should.",
    side: "Craft",
  },
  {
    id: "editions",
    title: "Editions of one",
    copy: "What we make today is finite. When the morning's stems are gone, the edition closes. No restocks, no reprints.",
    side: "Scarcity",
  },
  {
    id: "delivery",
    title: "Same-day, in-house",
    copy: "Our own couriers carry every order, climate-conditioned, across Mumbai, Bengaluru, Delhi and Pune. No outsourced last mile.",
    side: "Delivery",
  },
];

export default function AboutValues() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* ── Desktop: pin the section + scrub timeline ─────────────── */
      mm.add("(min-width: 861px)", () => {
        const sectionEl = root.current;
        if (!sectionEl) return;

        const steps = gsap.utils.toArray(
          sectionEl.querySelectorAll(`.${styles.step}`)
        );
        const railFill = sectionEl.querySelector(`.${styles.railFill}`);

        /* Initial states — rail empty, steps 2–4 hidden. */
        gsap.set(railFill, { scaleX: 0 });
        gsap.set(steps.slice(1), { opacity: 0, y: 40 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: () => "+=" + window.innerHeight * 2.4,
            scrub: 0.8,
            pin: sectionEl,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* Rail draws in segments — it reaches each step, pauses while
           the step fades in, then continues to the next. */
        tl.to(railFill, { scaleX: 0.25, ease: "none", duration: 0.18 }, 0)
          .to(
            steps[1],
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
            0.2
          )
          .to(
            railFill,
            { scaleX: 0.5, ease: "none", duration: 0.18 },
            0.32
          )
          .to(
            steps[2],
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
            0.52
          )
          .to(
            railFill,
            { scaleX: 0.75, ease: "none", duration: 0.18 },
            0.64
          )
          .to(
            steps[3],
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
            0.84
          )
          .to(
            railFill,
            { scaleX: 1, ease: "none", duration: 0.12 },
            0.94
          );

        /* Recompute after layout settles. */
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });

      /* ── Mobile: no pin, simple reveal ─────────────────────────── */
      mm.add("(max-width: 860px)", () => {
        gsap.from(`.${styles.step}`, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.timeline}`, start: "top 80%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="values" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <h2 className={styles.heading}>
            Four rules we <em>won't compromise on</em>.
          </h2>
        </div>

        <div className={styles.timeline}>
          {/* Base hairline rail */}
          <span className={styles.railBase} aria-hidden="true" />
          {/* Progress fill — animates with scroll */}
          <span className={styles.railFill} aria-hidden="true" />

          <ol className={styles.list}>
            {VALUES.map((v, i) => (
              <li key={v.id} className={styles.step}>
                <div className={styles.markerCol}>
                  <span className={styles.circle}>
                    <span className={styles.circleInner} aria-hidden="true" />
                    <span className={styles.circleNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.circlePulse} aria-hidden="true" />
                  </span>
                  <span className={styles.stepSide}>{v.side}</span>
                </div>

                <span className={styles.connector} aria-hidden="true" />

                <div className={styles.body}>
                  <h3 className={styles.stepTitle}>{v.title}</h3>
                  <p className={styles.stepCopy}>{v.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
