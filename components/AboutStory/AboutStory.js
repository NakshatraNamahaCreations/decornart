"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import storyImg from "@/assets/for-mother-gift/for-mother2.jpeg";
import styles from "./AboutStory.module.css";

export default function AboutStory() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.quote}`, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.quote}`, start: "top 82%" },
      });
      gsap.from(`.${styles.body} > *`, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.body}`, start: "top 80%" },
      });
      gsap.from(`.${styles.mediaWrap}`, {
        scale: 0.96,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.mediaWrap}`, start: "top 82%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="story" className={styles.section}>
      <div className="container">
        
        {/* Magazine spread: tall image + founder's note. */}
        <div className={styles.spread}>
          <div className={styles.mediaWrap}>
            <div className={styles.media}>
              <Image
                src={storyImg}
                alt="Inside the Decornart atelier — stems on the work bench"
                fill
                sizes="(max-width: 860px) 90vw, 38vw"
              />
            </div>
          </div>

          <div className={styles.body}>
            <span className={styles.label}>
              — A Founder's Note
            </span>
            <h2 className={styles.heading}>
              How we <em>began</em>.
            </h2>
            <p className={styles.copy}>
              <span className={styles.dropCap}>D</span>ecornart began in 2019
              above a market in Mumbai. Two florists. A pair of shears. And an
              unreasonable obsession with stems chosen at dawn. We shipped our
              first bouquet to a neighbour. By the end of the year, we were
              quietly delivering across the city.
            </p>
            <p className={styles.copy}>
              We've grown — to Bengaluru, Delhi, and Pune — but the rule
              hasn't. Every bouquet is composed by hand, the morning it's
              sent, by someone who can name every stem in it. No factories. No
              batched decoration. No two ever quite alike.
            </p>
            <p className={styles.copyItalic}>
              We are, still, a small atelier. We rather like it that way.
            </p>

            {/* <div className={styles.signature}>
              <span className={styles.signatureName}>Anaya &amp; Rohan</span>
              <span className={styles.signatureRole}>
                Founders · Decornart Atelier
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
