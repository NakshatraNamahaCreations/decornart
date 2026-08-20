"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./beautifulProcess.module.css";

const STEPS = [
  {
    id: "source",
    title: "Source",
    copy: "Stems chosen at dawn from local growers — only what's freshest that morning makes the cut.",
  },
  {
    id: "conceive",
    title: "Conceive",
    copy: "Each bouquet sketched by hand. The day's palette decides the composition, not the other way around.",
  },
  {
    id: "compose",
    title: "Compose",
    copy: "Stems trimmed, conditioned, and tied — adjusted by eye until it sits exactly the way it should.",
  },
  {
    id: "deliver",
    title: "Deliver",
    copy: "Wrapped, watered, and hand-delivered the same day across Mumbai, Bengaluru, Delhi and Pune.",
  },
];

export default function beautifulProcess() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.step}`, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 78%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="process" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>The Process</span>
          <h2 className={styles.heading}>From market to door, by hand.</h2>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>
            Four steps. One morning. No mass-production short-cuts between
            them.
          </p>
        </div>

        <div className={styles.grid}>
          {STEPS.map((s, i) => (
            <article key={s.id} className={styles.step}>
              <span className={styles.ord}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepCopy}>{s.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
