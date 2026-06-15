"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./HandmadePhilosophy.module.css";

const PRINCIPLES = [
  {
    id: "single-origin",
    title: "Single-origin",
    copy: "One florist, one basket, one morning. No two florists share a day's batch — the hand that ties it is the hand that chose it.",
  },
  {
    id: "single-morning",
    title: "Single morning",
    copy: "Composed in the quiet hours before the studio opens. When today's run is gone, it's gone — which is rather the point.",
  },
  {
    id: "editions-of-one",
    title: "Editions of one",
    copy: "No template. No SKU to reorder next week. The bouquet you ordered is the bouquet that arrives — not its cousin, not its understudy.",
  },
];

export default function HandmadePhilosophy() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.card}`, {
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>Our Philosophy</span>
          <h2 className={styles.heading}>
            Composed with intent, <em>never repeated.</em>
          </h2>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>
            Three rules the atelier holds to — for every handmade bouquet
            that leaves the studio.
          </p>
        </div>

        <div className={styles.grid}>
          {PRINCIPLES.map((p, i) => (
            <article key={p.id} className={styles.card}>
              <span className={styles.ord}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.copy}>{p.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
