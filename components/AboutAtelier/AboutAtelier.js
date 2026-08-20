"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import a1 from "@/assets/butterfly-signature/signature1.jpeg";
import a2 from "@/assets/luxe-heart/luxe-heart1.jpeg";
import a3 from "@/assets/for-mother-gift/for-mother1.jpeg";
import styles from "./AboutAtelier.module.css";

export default function AboutAtelier() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.frame}`, {
        y: 70,
        opacity: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.gallery}`, start: "top 80%" },
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
    <section ref={root} id="atelier" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>— Inside the Atelier</span>
          <h2 className={styles.heading}>
            A morning, in <em>three frames</em>.
          </h2>
          <p className={styles.lead}>
            5:40 to 11:00. From the market bench to your door — one bouquet,
            one journey.
          </p>
        </div>

        <div className={styles.gallery}>
          <figure className={`${styles.frame} ${styles.frameOne}`}>
            <div className={styles.imgWrap}>
              <Image
                src={a1}
                alt="Stems on the work bench at dawn"
                fill
                sizes="(max-width: 860px) 90vw, 30vw"
              />
              <span className={styles.frameNum}>01</span>
            </div>
            <figcaption className={styles.cap}>
              <span className={styles.capTitle}>The bench at dawn</span>
            </figcaption>
          </figure>

          <figure className={`${styles.frame} ${styles.frameTwo}`}>
            <div className={styles.imgWrap}>
              <Image
                src={a2}
                alt="Hands tying a bouquet"
                fill
                sizes="(max-width: 860px) 90vw, 40vw"
              />
              <span className={styles.frameNum}>02</span>
            </div>
            <figcaption className={styles.cap}>
              <span className={styles.capTitle}>Hands at work</span>
            </figcaption>
          </figure>

          <figure className={`${styles.frame} ${styles.frameThree}`}>
            <div className={styles.imgWrap}>
              <Image
                src={a3}
                alt="Finished bouquet, ready to deliver"
                fill
                sizes="(max-width: 860px) 90vw, 30vw"
              />
              <span className={styles.frameNum}>03</span>
            </div>
            <figcaption className={styles.cap}>
              <span className={styles.capTitle}>Wrapped &amp; ready</span>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Dark editorial colophon — final word. */}
      <div className={styles.colophonWrap}>
        <div className={`container ${styles.colophon}`}>
          <span className={styles.colophonEyebrow}>Decornart</span>
          <h3 className={styles.colophonHeading}>
            One morning. One bouquet. <em>One door.</em>
          </h3>
          <span className={styles.colophonRule} aria-hidden="true" />
          <p className={styles.colophonCopy}>
            If that's the gesture you want to send — we'd be honoured to make
            it for you.
          </p>
          <div className={styles.actions}>
            <a href="/shop" className={styles.cta}>
              Shop the collection <span aria-hidden="true">→</span>
            </a>
            <a href="/beautiful" className={styles.ghost}>
              See this week's drop
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
