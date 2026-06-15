"use client";

import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./PaymentFailedView.module.css";

export default function PaymentFailedView() {
  const root = useRef(null);
  const params = useSearchParams();
  const reason = params.get("reason") || "";
  const orderNumber = params.get("order") || "";

  useGSAP(
    () => {
      gsap.from(
        `.${styles.mark}, .${styles.eyebrow}, .${styles.heading}, .${styles.rule}, .${styles.copy}, .${styles.reasonBox}, .${styles.actions}`,
        {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <span className={styles.mark} aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 7v6M12 17h.01M4.93 19.07a10 10 0 1 1 14.14 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {orderNumber ? (
            <span className={styles.eyebrow}>Order Nº {orderNumber}</span>
          ) : (
            <span className={styles.eyebrow}>— Payment unsuccessful</span>
          )}

          <h1 className={styles.heading}>
            Your payment <em>didn't go through</em>.
          </h1>
          <span className={styles.rule} aria-hidden="true" />

          <p className={styles.copy}>
            Don't worry — no amount has been charged and your basket is still
            intact. Try again, or pick a different payment method at checkout.
          </p>

          {reason && (
            <p className={styles.reasonBox}>
              <span className={styles.reasonLabel}>Reason</span>
              <span className={styles.reasonText}>{reason}</span>
            </p>
          )}

          <div className={styles.actions}>
            <a href="/checkout" className={styles.cta}>
              Try again <span aria-hidden="true">→</span>
            </a>
            <a href="/cart" className={styles.ghost}>
              Back to basket
            </a>
            <a href="/contact" className={styles.ghost}>
              Contact the atelier
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
