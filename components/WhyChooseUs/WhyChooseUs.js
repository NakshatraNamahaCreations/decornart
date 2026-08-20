"use client";

import { useRef } from "react";
import {
  FiHeart,
  FiAward,
  FiUsers,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./WhyChooseUs.module.css";

const FEATURES = [
  {
    id: "beautiful",
    title: "Curated with Love",
    copy: "Every product is crafted with passion and care.",
    icon: <FiHeart aria-hidden="true" focusable="false" />,
  },
  {
    id: "quality",
    title: "Premium Quality",
    copy: "We use the best materials for the best results.",
    icon: <FiAward aria-hidden="true" focusable="false" />,
  },
  {
    id: "trusted",
    title: "Trusted by Creators",
    copy: "Loved by 10,000+ creators across India.",
    icon: <FiUsers aria-hidden="true" focusable="false" />,
  },
  {
    id: "returns",
    title: "Damage Protection",
    copy: "Replacement is available only for products damaged during delivery.",
    icon: <FiShield aria-hidden="true" focusable="false" />,
  },
  {
    id: "small-business",
    title: "Support Small Business",
    copy: "Your purchase supports a small business dream.",
    icon: <FiShoppingBag aria-hidden="true" focusable="false" />,
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
        <header className={styles.head}>
          <h2 className={styles.heading}>
            Why Choose <em className={styles.headingAccent}>Decor N Art?</em>
          </h2>
          <span className={styles.rule} aria-hidden="true" />
         
        </header>

        <ul className={styles.grid}>
          {FEATURES.map((f, i) => (
            <li key={f.id} className={styles.item}>
              <span className={styles.itemBar} aria-hidden="true" />
              <span className={styles.iconBadge} aria-hidden="true">
                <span className={styles.iconRing} />
                <span className={styles.icon}>{f.icon}</span>
              </span>
              <span className={styles.title}>{f.title}</span>
              <span className={styles.copy}>{f.copy}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
