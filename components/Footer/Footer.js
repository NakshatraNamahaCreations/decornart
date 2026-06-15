"use client";

import { useState } from "react";
import styles from "./Footer.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All bouquets", href: "/shop" },
      { label: "Handmade", href: "/handmade" },
      
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track order", href: "/track-order" },
      { label: "FAQ", href: "/faq" },
      { label: "Return & refund", href: "/returns" },
      { label: "Wholesale enquiry", href: "/wholesale" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "About us", href: "/about" },
      { label: "Journal & DIY", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  const handleSubmit = () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus({ type: "error", msg: "Please enter a valid email address." });
      return;
    }
    // TODO: POST to your /api/subscribe service.
    setStatus({ type: "success", msg: "You're on the list — welcome." });
    setEmail("");
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <div className={styles.brand}>
              Decornart<span>.</span>
            </div>
            <p className={styles.tagline}>
              Hand-tied seasonal bouquets, composed like still life and
              delivered the same day.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className={styles.colTitle}>{col.title}</p>
              <ul className={styles.list}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.newsletter}>
            <p className={styles.colTitle}>Newsletter</p>
            <p className={styles.newsCopy}>
              Stay updated with seasonal drops, occasion guides and the
              occasional bouquet tutorial.
            </p>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="email"
                inputMode="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                aria-label="Email address"
              />
              <button
                className={styles.button}
                type="button"
                onClick={handleSubmit}
                aria-label="Subscribe"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M3 11l18-8-7 18-2-8z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p
              className={`${styles.note} ${
                status.type === "error"
                  ? styles.error
                  : status.type === "success"
                  ? styles.success
                  : ""
              }`}
              role="status"
            >
              {status.msg}
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Decornart. All rights reserved.</span>
          <span>Made in India · Same-day delivery</span>
        </div>
      </div>
    </footer>
  );
}
