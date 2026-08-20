"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaWhatsapp, FaEnvelope, FaCommentDots } from "react-icons/fa";
import { useCart } from "@/components/providers/CartProvider";
import { resolveProductImage } from "@/lib/productImages";
import { hexForColor } from "@/lib/colorSwatches";
import heroImg from "@/assets/checkoutbg.png";
import helpImg from "@/assets/promobg.png";
import avatar1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import avatar2 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import avatar3 from "@/assets/for-mother-gift/for-mother4.jpeg";
import avatar4 from "@/assets/butterfly-luxury/luxury2.jpeg";
import styles from "./PaymentView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const CRUMBS = [
  { label: "Cart", active: false },
  { label: "Information", active: false },
  { label: "Shipping", active: false },
  { label: "Payment", active: true },
];

const PAYMENT_METHODS = [
  {
    id: "upi",
    title: "UPI / QR Payment",
    sub: "Pay instantly using any UPI app",
    badges: ["G Pay", "PhonePe", "Paytm", "BHIM"],
  },
  {
    id: "card",
    title: "Card Payment",
    sub: "Pay securely using your debit/credit card",
    badges: ["VISA", "MC", "RuPay", "Amex"],
  },
  {
    id: "netbank",
    title: "Net Banking",
    sub: "Pay directly from your bank account",
    right: "All major banks supported",
  },
  {
    id: "wallets",
    title: "Wallets",
    sub: "Pay using your preferred wallet",
    badges: ["Paytm", "PhonePe", "Amazon Pay"],
  },
  {
    id: "cod",
    title: "Cash on Delivery (COD)",
    sub: "Pay when your order is delivered",
    right: "Available for all eligible orders",
  },
  {
    id: "bnpl",
    title: "Buy Now, Pay Later",
    sub: "Pay in easy installments",
    badges: ["Zest", "Simpl", "LazyPay"],
  },
];

const METHOD_ICON = {
  upi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M17 20l3-3" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M3 10h18" />
    </svg>
  ),
  netbank: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M3 10L12 4l9 6v2H3z" />
      <path d="M5 12v7M9 12v7M15 12v7M19 12v7M3 21h18" strokeLinecap="round" />
    </svg>
  ),
  wallets: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <circle cx="17" cy="14" r="1.4" fill="currentColor" />
    </svg>
  ),
  cod: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="12" rx="1" />
      <circle cx="12" cy="13" r="2.5" />
    </svg>
  ),
  bnpl: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
};

const SUMMARY_TRUST = [
  {
    id: "secure",
    title: "Secure Payments",
    copy: "100% protected payments",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "returns",
    title: "Damage Protection",
    copy: "Replacement for transit-damaged items",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 14-5" />
        <path d="M18 3v4h-4" />
        <path d="M20 12a8 8 0 0 1-14 5" />
        <path d="M6 21v-4h4" />
      </svg>
    ),
  },
  {
    id: "delivery",
    title: "On-time Delivery",
    copy: "Fast & reliable shipping",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    id: "beautiful",
    title: "Curated with Love",
    copy: "Crafted with passion & care",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
];

const BOTTOM_TRUST = [
  {
    id: "secure",
    title: "100% Secure Payments",
    copy: "Your data is always protected",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "delivery",
    title: "PAN India Delivery",
    copy: "Fast & reliable shipping",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    id: "returns",
    title: "Damage Protection",
    copy: "Replacement for transit-damaged items",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 14-5" />
        <path d="M18 3v4h-4" />
        <path d="M20 12a8 8 0 0 1-14 5" />
        <path d="M6 21v-4h4" />
      </svg>
    ),
  },
  {
    id: "premium",
    title: "Premium Quality",
    copy: "Curated with Love",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" />
      </svg>
    ),
  },
  {
    id: "india",
    title: "Proudly Made in India",
    copy: "Supporting local artisans",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" strokeLinecap="round" />
      </svg>
    ),
  },
];

const AVATARS = [avatar1, avatar2, avatar3, avatar4];

export default function PaymentView() {
  const root = useRef(null);
  const router = useRouter();
  const { cart } = useCart();
  const items = cart?.items || [];
  const subtotal =
    cart?.subtotal ??
    items.reduce((sum, l) => sum + (l.price ?? 0) * (l.qty ?? 1), 0);

  const [method, setMethod] = useState("upi");
  const [openMethod, setOpenMethod] = useState("upi");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billing, setBilling] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("SAVE100");
  const [upiCopied, setUpiCopied] = useState(false);

  const discount = appliedCoupon === "SAVE100" && subtotal >= 999 ? 100 : 0;
  const shippingCost = 0;
  const total = Math.max(0, subtotal + shippingCost - discount);

  const setBill = (k, v) => setBilling((prev) => ({ ...prev, [k]: v }));

  const cartItems = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        image: it.image || resolveProductImage(it),
      })),
    [items]
  );

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText("decornart@upi");
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 1500);
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code) setAppliedCoupon(code);
  };

  const handlePaySecurely = () => {
    router.push("/thank-you");
  };

  const toggleMethod = (id) => {
    setMethod(id);
    setOpenMethod((cur) => (cur === id ? null : id));
  };

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── Page banner ─────────── */}
      <section className={styles.pageHead} aria-label="Payment">
        <div className={styles.pageHeadDeco} aria-hidden="true">
          <Image
            src={heroImg}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.pageHeadDecoImg}
          />
        </div>
        <div className={`container ${styles.pageHeadInner}`}>
          <div className={styles.pageHeadCopy}>
            <h1 className={styles.pageTitle}>Payment</h1>
            <nav className={styles.crumbs} aria-label="Checkout progress">
              {CRUMBS.map((c, i) => (
                <span key={c.label} className={styles.crumb}>
                  <span className={c.active ? styles.crumbActive : styles.crumbText}>
                    {c.label}
                  </span>
                  {i < CRUMBS.length - 1 && (
                    <span aria-hidden="true" className={styles.crumbSep}>
                      &rsaquo;
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </div>
          <div className={styles.pageSecure}>
            <span className={styles.secureIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" />
              </svg>
            </span>
            <span className={styles.secureText}>
              <strong>100% Secure Payment</strong>
              <span>Your payment information is safe with us</span>
            </span>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        <div className={styles.layout}>
          {/* ═════ LEFT ═════ */}
          <div className={styles.leftCol}>
            {/* 1. Choose a Payment Method */}
            <section className={styles.stepCard}>
              <header className={styles.stepHead}>
                <span className={styles.stepNum} aria-hidden="true">1</span>
                <h2 className={styles.stepTitle}>Choose a Payment Method</h2>
              </header>

              <ul className={styles.methodList}>
                {PAYMENT_METHODS.map((m) => {
                  const isOpen = openMethod === m.id;
                  const isSelected = method === m.id;
                  return (
                    <li
                      key={m.id}
                      className={`${styles.methodItem} ${
                        isSelected ? styles.methodSelected : ""
                      }`}
                    >
                      <button
                        type="button"
                        className={styles.methodHead}
                        onClick={() => toggleMethod(m.id)}
                        aria-expanded={isOpen}
                      >
                        <span
                          className={`${styles.methodRadio} ${
                            isSelected ? styles.methodRadioOn : ""
                          }`}
                          aria-hidden="true"
                        />
                        <span className={styles.methodIcon} aria-hidden="true">
                          {METHOD_ICON[m.id]}
                        </span>
                        <span className={styles.methodBody}>
                          <strong>{m.title}</strong>
                          <span>{m.sub}</span>
                        </span>
                        {m.badges && (
                          <span className={styles.methodBadges}>
                            {m.badges.map((b) => (
                              <span key={b} className={styles.payBadge}>
                                {b}
                              </span>
                            ))}
                          </span>
                        )}
                        {m.right && (
                          <span className={styles.methodRight}>{m.right}</span>
                        )}
                        <span
                          className={`${styles.methodChev} ${
                            isOpen ? styles.methodChevOpen : ""
                          }`}
                          aria-hidden="true"
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                      </button>

                      {isOpen && m.id === "upi" && (
                        <div className={styles.methodContent}>
                          <div className={styles.upiGrid}>
                            <div className={styles.qrPanel}>
                              <div className={styles.qrBox} aria-hidden="true">
                                <div className={styles.qrPattern}>
                                  {Array.from({ length: 121 }).map((_, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        opacity:
                                          [0, 1, 4, 6, 9, 10, 12, 14, 17, 20, 21, 24, 27, 28, 32, 35, 37, 41, 44, 47, 50, 53, 55, 58, 60, 62, 64, 66, 70, 71, 73, 76, 79, 82, 85, 88, 91, 93, 95, 98, 101, 105, 109, 113, 117].includes(
                                            i
                                          )
                                            ? 1
                                            : 0.15,
                                      }}
                                    />
                                  ))}
                                </div>
                                <span className={styles.qrCentre}>&#8377;</span>
                              </div>
                              <span className={styles.qrCaption}>
                                Scan &amp; pay using any UPI app
                              </span>
                            </div>
                            <div className={styles.upiSide}>
                              <span className={styles.upiSideLabel}>
                                Or pay using UPI ID
                              </span>
                              <div className={styles.upiIdRow}>
                                <input
                                  type="text"
                                  className={styles.upiIdInput}
                                  value="decornart@upi"
                                  readOnly
                                />
                                <button
                                  type="button"
                                  onClick={handleCopyUpi}
                                  className={styles.upiCopyBtn}
                                  aria-label="Copy UPI ID"
                                >
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                                    <rect x="7" y="7" width="12" height="12" rx="1" />
                                    <path d="M5 15V5h10" />
                                  </svg>
                                  {upiCopied && <span className={styles.upiCopiedFlash}>Copied</span>}
                                </button>
                              </div>
                              <div className={styles.upiHelp}>
                                <span className={styles.upiHelpTitle}>
                                  How to pay?
                                </span>
                                <ol>
                                  <li>Open any UPI app</li>
                                  <li>Scan the QR code or enter UPI ID</li>
                                  <li>Verify the amount &amp; pay</li>
                                  <li>You&rsquo;ll be redirected after successful payment</li>
                                </ol>
                              </div>
                              <div className={styles.upiWaiting}>
                                <span className={styles.upiWaitingIcon} aria-hidden="true">
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 7v5l3 2" />
                                  </svg>
                                </span>
                                <span className={styles.upiWaitingText}>
                                  <strong>Waiting for payment&hellip;</strong>
                                  <span>Payment will be confirmed automatically</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {isOpen && m.id !== "upi" && (
                        <div className={styles.methodContent}>
                          <p className={styles.methodPlaceholder}>
                            You&rsquo;ll be redirected to the secure {m.title.toLowerCase()} portal
                            after clicking <strong>Pay Securely</strong>.
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* 2. Billing Details */}
            <section className={styles.stepCard}>
              <header className={styles.stepHead}>
                <span className={styles.stepNum} aria-hidden="true">2</span>
                <h2 className={styles.stepTitle}>Billing Details</h2>
              </header>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                />
                <span>Same as shipping address</span>
              </label>
              <div className={styles.formGrid}>
                <input
                  type="text"
                  className={`${styles.input} ${styles.spanTwo}`}
                  placeholder="Full Name"
                  value={billing.name}
                  onChange={(e) => setBill("name", e.target.value)}
                  disabled={sameAsShipping}
                />
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="Phone Number"
                  value={billing.phone}
                  onChange={(e) => setBill("phone", e.target.value)}
                  disabled={sameAsShipping}
                />
                <input
                  type="email"
                  className={styles.input}
                  placeholder="Email Address"
                  value={billing.email}
                  onChange={(e) => setBill("email", e.target.value)}
                  disabled={sameAsShipping}
                />
              </div>
              <p className={styles.securedNote}>
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <rect x="4" y="10" width="16" height="10" rx="1.5" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>
                Your information is safe and encrypted
              </p>
            </section>

            {/* 3. Apply Coupon */}
            <section className={styles.stepCard}>
              <header className={styles.stepHead}>
                <span className={styles.stepNum} aria-hidden="true">3</span>
                <h2 className={styles.stepTitle}>Apply Coupon</h2>
              </header>
              <div className={styles.couponRow}>
                <input
                  type="text"
                  className={styles.couponInput}
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.couponApply}
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
                <div className={styles.offerCard}>
                  <strong>Available Offers</strong>
                  <span>
                    <span className={styles.offerBadge}>SAVE100</span>{" "}
                    &ndash; Get ₹100 off on orders above ₹2500
                  </span>
                </div>
              </div>
            </section>

            {/* Almost there */}
            <section className={styles.almostCard}>
              <span className={styles.almostIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                  <rect x="4" y="10" width="16" height="10" rx="1" />
                  <path d="M2 6h20v4H2z" />
                  <path d="M12 6v14" strokeLinecap="round" />
                  <path d="M8 6c-1-2 0-4 2-4s3 2 2 4M16 6c1-2 0-4-2-4s-3 2-2 4" />
                </svg>
              </span>
              <div className={styles.almostCopy}>
                <strong>
                  Almost there! <span aria-hidden="true">&#127881;</span>
                </strong>
                <span>Complete your payment to confirm your order.</span>
              </div>
              <button
                type="button"
                className={styles.payBtn}
                onClick={handlePaySecurely}
              >
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                    <rect x="5" y="10" width="14" height="10" rx="1" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>
                Pay Securely
              </button>
              <span className={styles.payFoot}>
                You will be redirected after successful payment
              </span>
            </section>
          </div>

          {/* ═════ RIGHT ═════ */}
          <aside className={styles.rightCol}>
            <section className={styles.summaryCard}>
              <header className={styles.summaryHead}>
                <h2 className={styles.summaryTitle}>
                  Order Summary{" "}
                  <span className={styles.summaryCount}>
                    ({cartItems.length} Items)
                  </span>
                </h2>
                <a href="/cart" className={styles.editCart}>
                  Edit Cart
                </a>
              </header>

              <ul className={styles.itemsList}>
                {cartItems.map((it) => {
                  const color = it.color || null;
                  const key = `${it.productId ?? it.id}:${
                    it.variantId ?? "base"
                  }:${color ?? "nocolor"}`;
                  return (
                    <li key={key} className={styles.item}>
                      <div className={styles.itemMedia}>
                        {it.image && (
                          <Image
                            src={it.image}
                            alt={it.name || ""}
                            fill
                            sizes="72px"
                            className={styles.itemImg}
                          />
                        )}
                      </div>
                      <div className={styles.itemBody}>
                        <strong>{it.name}</strong>
                        {it.variant && <span>{it.variant}</span>}
                        {color && (
                          <span className={styles.itemColor}>
                            <span
                              className={styles.itemColorDot}
                              style={{ background: hexForColor(color) }}
                              aria-hidden="true"
                            />
                            Color: {color}
                          </span>
                        )}
                        <span>Qty: {it.qty ?? 1}</span>
                      </div>
                      <span className={styles.itemPrice}>
                        {inr.format((it.price ?? 0) * (it.qty ?? 1))}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <ul className={styles.totalsList}>
                <li>
                  <span>Subtotal</span>
                  <strong>{inr.format(subtotal)}</strong>
                </li>
                <li>
                  <span>Shipping</span>
                  <strong>{shippingCost === 0 ? "FREE" : inr.format(shippingCost)}</strong>
                </li>
                {discount > 0 && (
                  <li>
                    <span>Discount ({appliedCoupon})</span>
                    <strong className={styles.discountAmount}>
                      &minus; {inr.format(discount)}
                    </strong>
                  </li>
                )}
              </ul>

              <div className={styles.grandTotalRow}>
                <span className={styles.grandTotalLabel}>Total</span>
                <span className={styles.grandTotalValue}>{inr.format(total)}</span>
              </div>
              <p className={styles.taxLine}>(Inclusive of all taxes)</p>
            </section>

            <section className={styles.summaryTrust}>
              <ul>
                {SUMMARY_TRUST.map((t) => (
                  <li key={t.id} className={styles.trustRow}>
                    <span className={styles.trustIcon} aria-hidden="true">
                      {t.icon}
                    </span>
                    <span className={styles.trustText}>
                      <strong>{t.title}</strong>
                      <span>{t.copy}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.helpCard}>
              <div className={styles.helpMedia} aria-hidden="true">
                <Image
                  src={helpImg}
                  alt=""
                  fill
                  sizes="240px"
                  className={styles.helpImg}
                />
              </div>
              <div className={styles.helpCopy}>
                <strong className={styles.helpTitle}>Need Help?</strong>
                <span className={styles.helpSub}>We&rsquo;re here for you!</span>
                <ul className={styles.helpList}>
                  <li>
                    <a href="https://wa.me/919876543210" className={styles.helpItemLink}>
                      <span className={styles.helpIcon} aria-hidden="true">
                        <FaWhatsapp />
                      </span>
                      <span className={styles.helpText}>
                        <strong>WhatsApp Us</strong>
                        <span>+91 9986988786</span>
                      </span>
                      <span aria-hidden="true" className={styles.helpArrow}>
                        &rsaquo;
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:official@decornart.in" className={styles.helpItemLink}>
                      <span className={styles.helpIcon} aria-hidden="true">
                        <FaEnvelope />
                      </span>
                      <span className={styles.helpText}>
                        <strong>Email Us</strong>
                        <span>official@decornart.in</span>
                      </span>
                      <span aria-hidden="true" className={styles.helpArrow}>
                        &rsaquo;
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="#chat" className={styles.helpItemLink}>
                      <span className={styles.helpIcon} aria-hidden="true">
                        <FaCommentDots />
                      </span>
                      <span className={styles.helpText}>
                        <strong>24/7 Customer Support</strong>
                        <span>We reply within minutes</span>
                      </span>
                      <span aria-hidden="true" className={styles.helpArrow}>
                        &rsaquo;
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.trustedCard}>
              <div className={styles.trustedCopy}>
                <strong>Trusted by 10,000+</strong>
                <span>Happy Customers</span>
              </div>
              <div className={styles.trustedAvatars} aria-hidden="true">
                {AVATARS.map((src, i) => (
                  <span key={i} className={styles.trustedAvatar}>
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="32px"
                      className={styles.trustedAvatarImg}
                    />
                  </span>
                ))}
                <span className={styles.trustedMore}>10K+</span>
              </div>
            </section>
          </aside>
        </div>

        <section className={styles.bottomSection}>
          <ul className={styles.bottomTrustList}>
            {BOTTOM_TRUST.map((t) => (
              <li key={t.id} className={styles.trustRow}>
                <span className={styles.trustIcon} aria-hidden="true">
                  {t.icon}
                </span>
                <span className={styles.trustText}>
                  <strong>{t.title}</strong>
                  <span>{t.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
