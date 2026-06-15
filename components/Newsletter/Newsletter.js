"use client";

import { useState } from "react";
import { subscribe } from "@/lib/api/newsletter";
import styles from "./Newsletter.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  const handleSubmit = async () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus({ type: "error", msg: "Please enter a valid email address." });
      return;
    }
    setStatus({ type: "idle", msg: "Subscribing…" });
    try {
      await subscribe(value, "footer");
      setStatus({ type: "success", msg: "You're on the list — welcome." });
      setEmail("");
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Could not subscribe." });
    }
  };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <h2 className={styles.heading}>Seasonal drops, in your inbox.</h2>
          <p className={styles.copy}>
            Weekly handmade bouquets and occasion guides. No noise.
          </p>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="email"
              inputMode="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              aria-label="Email address"
            />
            <button
              className={styles.button}
              type="button"
              onClick={handleSubmit}
            >
              Subscribe
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
    </section>
  );
}
