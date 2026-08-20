"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import atelierImg from "@/assets/butterfly-gift-box/butterfly-3.jpeg";
import styles from "./ContactAtelier.module.css";

const HOURS = [
  { day: "Monday — Friday", time: "10:00 — 19:00" },
  { day: "Saturday", time: "11:00 — 18:00" },
  { day: "Sunday", time: "By appointment" },
];

export default function ContactAtelier() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.media}`, {
        scale: 0.96,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.spread}`, start: "top 80%" },
      });
      gsap.from(`.${styles.body} > *`, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.body}`, start: "top 80%" },
      });
      gsap.from(`.${styles.colophon} > *`, {
        y: 30,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.colophon}`, start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="visit" className={styles.section}>
      <div className="container">
        <div className={styles.spread}>
          <div className={styles.mediaWrap}>
            <div className={styles.media}>
              <Image
                src={atelierImg}
                alt="Inside the Decornart atelier"
                fill
                sizes="(max-width: 860px) 90vw, 45vw"
              />
            </div>
            <span className={styles.mediaCaption}>
              <span className={styles.mediaCaptionTitle}>The Studio</span>
              <span className={styles.mediaCaptionSub}>By appointment</span>
            </span>
          </div>

          <div className={styles.body}>
            <span className={styles.eyebrow}>Nº 02 — Visit the Atelier</span>
            <h2 className={styles.heading}>
              Come <em>see the stems</em>.
            </h2>
            <p className={styles.copy}>
              For bespoke arrangements, weddings, or simply choosing in person —
              the atelier is open by appointment. Walk-ins are welcome on
              Saturdays.
            </p>

            <ul className={styles.hours}>
              {HOURS.map((h) => (
                <li key={h.day} className={styles.hour}>
                  <span className={styles.hourDay}>{h.day}</span>
                  <span className={styles.hourDots} aria-hidden="true" />
                  <span className={styles.hourTime}>{h.time}</span>
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <a href="#write" className={styles.cta}>
                Request a visit <span aria-hidden="true">→</span>
              </a>
              <a
                href="https://maps.google.com/?q=Linking+Road+Khar+West"
                target="_blank"
                rel="noreferrer"
                className={styles.ghost}
              >
                Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dark editorial colophon — final word. */}
      <div className={styles.colophonWrap}>
        <div className={`container ${styles.colophon}`}>
          <span className={styles.colophonEyebrow}>Decornart Atelier</span>
          <h3 className={styles.colophonHeading}>
            Until then — <em>thank you for writing in.</em>
          </h3>
          <span className={styles.colophonRule} aria-hidden="true" />
          <p className={styles.colophonCopy}>
            Every note that arrives finds a real florist. We read each one.
          </p>
        </div>
      </div>
    </section>
  );
}
