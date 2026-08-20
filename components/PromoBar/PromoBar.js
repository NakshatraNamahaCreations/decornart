"use client";

import { useEffect, useState } from "react";
import {
  FaShippingFast,
  FaTruck,
  FaMoneyBillAlt,
  FaGift,
} from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import styles from "./PromoBar.module.css";

// Editable strip of announcements. Each item can render an icon (or a small
// image) and a piece of copy. The strip pauses on hover and auto-scrolls on
// mobile widths where all items would otherwise overflow.
const MESSAGES = [
  {
    id: "shipping-thresh",
    icon: <FaShippingFast aria-hidden="true" />,
    text: (
      <>
        Free shipping <span className={styles.muted}>on orders above</span>{" "}
        <strong>&#8377;2500</strong>
      </>
    ),
  },
  {
    id: "new-launch",
    icon: <FaGift aria-hidden="true" />,
    text: (
      <>
        <strong>New Launch</strong> &ndash; Floral Gift Boxes
      </>
    ),
  },
  {
    id: "free-shipping",
    icon: <FaTruck aria-hidden="true" />,
    text: <strong>FREE SHIPPING</strong>,
  },
  {
    id: "cod",
    icon: <FaMoneyBillAlt aria-hidden="true" />,
    text: <strong>COD Available</strong>,
  },
  {
    id: "first-order",
    icon: <MdLocalOffer aria-hidden="true" />,
    text: (
      <>
        Flat <strong>10% OFF</strong> on First Order
      </>
    ),
  },
];

export default function PromoBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`${styles.bar} ${hidden ? styles.hidden : ""}`}
      role="region"
      aria-label="Announcements"
    >
      <div className={`container ${styles.row}`}>
        <ul className={styles.list}>
          {MESSAGES.map((m) => (
            <li key={m.id} className={styles.item}>
              <span className={styles.icon} aria-hidden="true">
                {m.icon}
              </span>
              <span className={styles.text}>{m.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
