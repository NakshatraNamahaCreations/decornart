"use client";

import { useRef } from "react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";
import insta1 from "@/assets/butterfly-gift-box/butterfly-3.jpeg";
import insta2 from "@/assets/butterfly-luxury/luxury2.jpeg";
import insta3 from "@/assets/butterfly-signature/signature1.jpeg";
import insta4 from "@/assets/cone-shape-gift/cone-shape4.jpeg";
import insta5 from "@/assets/for-mother-gift/for-mother5.jpeg";
import insta6 from "@/assets/luxe-dual/luxe-dual2.jpeg";
import insta7 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import styles from "./InstagramFeed.module.css";

const HANDLE = "decornart.in";
const PROFILE_URL = `https://www.instagram.com/${HANDLE}/`;

const POSTS = [
  { id: "ig1", image: insta1, alt: "Butterfly luxe gift box" },
  { id: "ig2", image: insta2, alt: "Luxury bouquet basket" },
  { id: "ig3", image: insta3, alt: "Signature butterfly edition" },
  { id: "ig4", image: insta4, alt: "Cone-shape gift detail" },
  { id: "ig5", image: insta5, alt: "For-mother gift styling" },
  { id: "ig6", image: insta6, alt: "Luxe dual basket finish" },
  { id: "ig7", image: insta7, alt: "Luxe heart bouquet detail" },
];

export default function InstagramFeed() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.tile}`, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <header className={styles.head}>
          <h2 className={styles.heading}>Follow us on Instagram</h2>
          <p className={styles.lead}>
            Get daily inspiration, new arrivals, DIY ideas and more!
          </p>
        </header>

        <div className={styles.grid}>
          {POSTS.map((p) => (
            <figure key={p.id} className={styles.tile}>
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(max-width: 560px) 45vw, (max-width: 1024px) 22vw, 14vw"
                className={styles.tileImg}
              />
            </figure>
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
          >
            <span className={styles.ctaIcon} aria-hidden="true">
              <FaInstagram />
            </span>
            @{HANDLE}
          </a>
        </div>
      </div>
    </section>
  );
}
