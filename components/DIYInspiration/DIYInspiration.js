"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { diyTutorials } from "@/lib/data/diyTutorials";
import styles from "./DIYInspiration.module.css";

export default function DIYInspiration() {
  const root = useRef(null);

  useGSAP(
    () => {
      const cards = root.current.querySelectorAll("[data-reveal]");
      gsap.from(cards, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <div className={styles.layout}>
          <aside className={styles.copy}>
            <span className={styles.eyebrow}>DIY Inspiration</span>
            <h2 className={styles.heading}>
              Create.
              <br />
              <span className={styles.script}>Inspire.</span>
              <br />
              Repeat.
            </h2>
            <Link href="/blog" className={styles.cta}>
              View all tutorials
              <span className={styles.ctaArrow} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </aside>

          <ul className={styles.grid}>
            {diyTutorials.map((t) => (
              <li key={t.id} className={styles.card} data-reveal>
                <Link href={t.href} className={styles.cardLink}>
                  <span className={styles.media}>
                    <Image
                      src={t.image}
                      alt={t.title}
                      fill
                      sizes="(max-width: 900px) 40vw, 14vw"
                      className={styles.mediaImg}
                    />
                    <span className={styles.play} aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M8 5v14l11-7z" fill="currentColor" />
                      </svg>
                    </span>
                  </span>
                  <span className={styles.info}>
                    <span className={styles.title}>{t.title}</span>
                    <span className={styles.subtitle}>{t.subtitle}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
