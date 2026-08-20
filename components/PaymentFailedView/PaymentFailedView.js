"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiRefreshCw, FiArrowLeft, FiXCircle } from "react-icons/fi";
import styles from "./PaymentFailedView.module.css";

export default function PaymentFailedView() {
  const params = useSearchParams();
  const reason = params.get("reason") || "";
  const orderNumber = params.get("order") || "";

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          <FiXCircle />
        </span>

        <h1 className={styles.heading}>Payment Failed</h1>
        <p className={styles.copy}>
          Your payment couldn&rsquo;t be completed. No amount has been charged
          and your cart is still saved.
        </p>

        {reason && (
          <div className={styles.reason}>
            <span className={styles.reasonLabel}>Reason</span>
            <span className={styles.reasonText}>{reason}</span>
          </div>
        )}

        {orderNumber && (
          <p className={styles.reference}>
            Reference: <span>#{orderNumber}</span>
          </p>
        )}

        <div className={styles.actions}>
          <Link href="/checkout" className={styles.primaryBtn}>
            <FiRefreshCw aria-hidden="true" /> Retry payment
          </Link>
          <Link href="/cart" className={styles.ghostBtn}>
            <FiArrowLeft aria-hidden="true" /> Back to cart
          </Link>
        </div>

        <p className={styles.support}>
          Need help?{" "}
          <Link href="/contact" className={styles.supportLink}>
            Contact support
          </Link>
        </p>
      </div>
    </section>
  );
}
