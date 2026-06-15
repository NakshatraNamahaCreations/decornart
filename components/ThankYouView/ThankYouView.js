"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import styles from "./ThankYouView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ThankYouView() {
  const root = useRef(null);
  const params = useSearchParams();
  const { refresh: refreshCart } = useCart();

  const orderNumber = params.get("order") || "";
  const totalParam = Number(params.get("total"));
  const total = Number.isFinite(totalParam) && totalParam > 0 ? totalParam : null;
  const eta = params.get("eta") || "Today";

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useGSAP(
    () => {
      gsap.from(
        `.${styles.successMark}, .${styles.successEyebrow}, .${styles.successHeading}, .${styles.successRule}, .${styles.successCopy}, .${styles.successDetails}, .${styles.successActions}`,
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
        <div className={styles.success}>
          <span className={styles.successMark} aria-hidden="true">✓</span>
          {orderNumber && (
            <span className={styles.successEyebrow}>Order Nº {orderNumber}</span>
          )}
          <h1 className={styles.successHeading}>
            Thank you — your order is <em>tied and on its way</em>.
          </h1>
          <span className={styles.successRule} aria-hidden="true" />
          <p className={styles.successCopy}>
            A confirmation has been sent to your inbox. We'll write again the
            moment the florist begins composing.
          </p>

          {(total !== null || eta) && (
            <div className={styles.successDetails}>
              {total !== null && (
                <div>
                  <span className={styles.successLabel}>Total paid</span>
                  <span className={styles.successValue}>{inr.format(total)}</span>
                </div>
              )}
              <div>
                <span className={styles.successLabel}>Delivery</span>
                <span className={styles.successValue}>{eta}</span>
              </div>
            </div>
          )}

          <div className={styles.successActions}>
            <a href="/shop" className={styles.cta}>
              Continue shopping <span aria-hidden="true">→</span>
            </a>
            <a href="/account" className={styles.ghost}>
              View your orders
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
