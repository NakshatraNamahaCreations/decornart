"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./WhyChooseUs.module.css";

const FEATURES = [
  {
    id: "handmade",
    title: "Handmade with Love",
    copy: "Every product is crafted with passion and care.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path
          d="M15 22c-2 0-4 1.6-4 4 0 3 3 6 7 8l6 3 6-3c4-2 7-5 7-8 0-2.4-2-4-4-4-2 0-3 1-4 2.4-1-1.4-2-2.4-4-2.4-2 0-3 1-4 2.4-1-1.4-2-2.4-4-2.4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 30c3-1 5-1 8 0M32 30c3-1 5-1 8 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "quality",
    title: "Premium Quality",
    copy: "We use the best materials for the best results.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="24" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M24 25l2.6 3.4 3.9 1.1-1.1 3.9L27 37l-3-1.2L21 37l-2.4-3.6-1.1-3.9 3.9-1.1L24 25z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M20 16l3 3 5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "trusted",
    title: "Trusted by Creators",
    copy: "Loved by 10,000+ creators across India.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="24" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 38c1.5-6 6-10 12-10s10.5 4 12 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="11" cy="22" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="37" cy="22" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: "returns",
    title: "Easy Returns",
    copy: "Hassle-free returns and customer satisfaction.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path
          d="M11 24a13 13 0 0 1 22-9.2L37 19M37 12v7h-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M37 24a13 13 0 0 1-22 9.2L11 29M11 36v-7h7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "small-business",
    title: "Support Small Business",
    copy: "Your purchase supports a small business dream.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path
          d="M9 22 24 10l15 12v16a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V22z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M20 40V28h8v12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.item}`, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <h2 className={styles.heading}>Why Choose DecorNart?</h2>

        <ul className={styles.grid}>
          {FEATURES.map((f) => (
            <li key={f.id} className={styles.item}>
              <span className={styles.icon} aria-hidden="true">
                {f.icon}
              </span>
              <span className={styles.text}>
                <span className={styles.title}>{f.title}</span>
                <span className={styles.copy}>{f.copy}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
