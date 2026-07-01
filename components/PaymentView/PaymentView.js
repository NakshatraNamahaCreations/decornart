"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaSmile,
  FaHeart,
  FaLock,
  FaCheckCircle,
  FaMobileAlt,
  FaCreditCard,
  FaUniversity,
  FaWallet,
  FaMoneyBillWave,
  FaRegClock,
  FaCopy,
  FaChevronDown,
  FaWhatsapp,
  FaEnvelope,
  FaCommentDots,
  FaArrowRight,
  FaQrcode,
  FaTag,
} from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { createOrder, verifyOrder } from "@/lib/api/orders";
import { openRazorpay } from "@/lib/razorpay";
import { resolveProductImage } from "@/lib/productImages";
import helpImg from "@/assets/bouquet-img.png";
import styles from "./PaymentView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const PAYMENT_METHODS = [
  {
    id: "upi",
    icon: <FaMobileAlt />,
    label: "UPI / QR payment",
    sub: "Pay instantly using any UPI app",
    brands: ["GPay", "PhonePe", "Paytm", "BHIM"],
  },
  {
    id: "card",
    icon: <FaCreditCard />,
    label: "Card payment",
    sub: "Pay securely using your debit / credit card",
    brands: ["Visa", "Mastercard", "RuPay", "Amex"],
  },
  {
    id: "netbanking",
    icon: <FaUniversity />,
    label: "Net banking",
    sub: "Pay directly from your bank account",
    brands: ["All major banks"],
  },
  {
    id: "wallet",
    icon: <FaWallet />,
    label: "Wallets",
    sub: "Pay using your preferred wallet",
    brands: ["Paytm", "PhonePe", "Amazon Pay"],
  },
  {
    id: "cod",
    icon: <FaMoneyBillWave />,
    label: "Cash on delivery (COD)",
    sub: "Pay when your order is delivered",
    brands: ["Available for eligible orders"],
  },
  {
    id: "bnpl",
    icon: <FaRegClock />,
    label: "Buy now, pay later",
    sub: "Pay in easy instalments",
    brands: ["Zest", "Simpl", "LazyPay"],
  },
];

const OFFERS = [
  { code: "SAVE100", desc: "Get ₹100 off on orders above ₹999" },
  { code: "FIRST15", desc: "Flat 15% off on your first order" },
  { code: "BUNDLE10", desc: "Buy 3+ bundles and save 10%" },
];

const SUMMARY_TRUST = [
  { id: "secure", icon: <FaLock />, title: "Secure payments", note: "100% protected payments" },
  { id: "ret", icon: <FaUndo />, title: "Easy returns", note: "7 days hassle-free returns" },
  { id: "ship", icon: <FaTruck />, title: "On-time delivery", note: "Fast & reliable shipping" },
  { id: "hand", icon: <FaHeart />, title: "Handmade with love", note: "Crafted with passion & care" },
];

const FOOTER_TRUST = [
  { id: "secure", icon: <FaLock />, title: "100% secure payments", note: "Your data is always protected" },
  { id: "delivery", icon: <FaTruck />, title: "Pan-India delivery", note: "Fast & reliable shipping" },
  { id: "returns", icon: <FaUndo />, title: "7-day easy returns", note: "Hassle-free returns" },
  { id: "premium", icon: <FaShieldAlt />, title: "Premium quality", note: "Handmade with love" },
  { id: "india", icon: <FaHeart />, title: "Proudly made in India", note: "Supporting local artisans" },
];

const AVATAR_TINTS = ["#f5c6c6", "#e0c5dc", "#cfd9c8", "#f0d8b8", "#c8d8e8"];

export default function PaymentView() {
  const root = useRef(null);
  const router = useRouter();
  const { user, isAuthed, isLoading: authLoading } = useAuth();
  const { cart, refresh: refreshCart, applyPromo } = useCart();

  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState({
    name: "",
    phone: "",
    email: "",
    gst: "",
  });

  const [coupon, setCoupon] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponMsg, setCouponMsg] = useState("");
  const [upiCopied, setUpiCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthed) {
      router.replace("/login?next=/payment");
    }
  }, [authLoading, isAuthed, router]);

  useEffect(() => {
    if (user?.email && !billing.email) {
      setBilling((b) => ({
        ...b,
        email: user.email || "",
        name: user.name || b.name,
      }));
    }
  }, [user, billing.email]);

  const items = cart.items || [];
  const summary = cart.summary || {};
  const subtotal = summary.subtotal ?? 0;
  const gst = summary.gst ?? 0;
  const shippingFee = summary.shipping ?? 0;
  const discount = summary.discount ?? 0;
  const total = subtotal + gst + shippingFee - discount;

  const shippingAddress = useMemo(() => {
    const def = (user?.addresses || []).find((a) => a.isDefault) ||
      (user?.addresses || [])[0];
    return def || null;
  }, [user]);

  const onApplyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponMsg("Enter a coupon code first.");
      return;
    }
    setCouponApplying(true);
    setCouponMsg("");
    try {
      await applyPromo(coupon.trim());
      setCouponMsg("Coupon applied successfully.");
    } catch (err) {
      setCouponMsg(err?.message || "We couldn't apply that code.");
    } finally {
      setCouponApplying(false);
    }
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText("decornart@upi");
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  const onBilling = (key) => (e) =>
    setBilling((b) => ({ ...b, [key]: e.target.value }));

  const onPay = async (e) => {
    e?.preventDefault?.();
    setError("");

    if (!shippingAddress) {
      router.push("/checkout");
      return;
    }

    setProcessing(true);
    let placedOrderNumber = null;
    try {
      const { order, payment: pay } = await createOrder({ shippingAddress });
      placedOrderNumber = order.orderNumber;

      let verifyPayload;
      if (method === "cod") {
        verifyPayload = {
          razorpayOrderId: pay.orderId,
          razorpayPaymentId: `pay_cod_${Date.now()}`,
          razorpaySignature: "cod_signature",
        };
      } else if (pay.mock) {
        verifyPayload = {
          razorpayOrderId: pay.orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: "mock_signature",
        };
      } else {
        verifyPayload = await openRazorpay({
          orderId: pay.orderId,
          amount: pay.amount,
          currency: pay.currency,
          user: { ...user, email: billing.email || user?.email },
        });
      }

      await verifyOrder(verifyPayload);

      refreshCart();
      const paidTotal = order.summary?.total || total;
      const qs = new URLSearchParams({
        order: order.orderNumber,
        total: String(paidTotal),
      });
      router.push(`/thank-you?${qs.toString()}`);
    } catch (err) {
      const reason = err.message || "Could not process your payment. Please try again.";
      const qs = new URLSearchParams({ reason });
      if (placedOrderNumber) qs.set("order", placedOrderNumber);
      router.push(`/payment-failed?${qs.toString()}`);
    } finally {
      setProcessing(false);
    }
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.head} > *`, {
        y: 18,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
      });
      gsap.from(`.${styles.block}, .${styles.summary}, .${styles.summaryCard}, .${styles.helpCard}, .${styles.avatarsCard}`, {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.06,
        ease: "power2.out",
        delay: 0.1,
      });
    },
    { scope: root }
  );

  if (authLoading || !isAuthed) {
    return (
      <section className={styles.page}>
        <div className="container" style={{ padding: "8rem 0", opacity: 0.7 }}>
          Checking your session…
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className={styles.page}>
        <div className="container" style={{ padding: "8rem 0", textAlign: "center" }}>
          <h1 className={styles.heading}>Nothing to pay for yet.</h1>
          <p className={styles.headSub} style={{ marginTop: "0.6rem" }}>
            Your cart is empty — add a product, then return to pay.
          </p>
          <a href="/shop" className={styles.primaryCta} style={{ marginTop: "1.2rem" }}>
            Browse the shop <FaArrowRight />
          </a>
        </div>
      </section>
    );
  }

  return (
    <main ref={root} className={styles.page}>
      <div className={`container ${styles.shell}`}>
        {/* ───────────── Head ───────────── */}
        <header className={styles.head}>
          <div className={styles.headRow}>
            <div>
              <h1 className={styles.heading}>Payment</h1>
              <nav className={styles.crumbs} aria-label="Checkout progress">
                <a href="/cart">Cart</a>
                <span className={styles.crumbSep} aria-hidden="true">›</span>
                <a href="/checkout">Information</a>
                <span className={styles.crumbSep} aria-hidden="true">›</span>
                <span>Shipping</span>
                <span className={styles.crumbSep} aria-hidden="true">›</span>
                <span className={styles.crumbActive}>Payment</span>
              </nav>
            </div>
            <span className={styles.secure}>
              <span className={styles.secureIcon} aria-hidden="true">
                <FaShieldAlt />
              </span>
              <span className={styles.secureCopy}>
                <strong>100% secure payment</strong>
                <small>Your payment information is safe with us</small>
              </span>
            </span>
          </div>
        </header>

        <form className={styles.layout} onSubmit={onPay}>
          <div className={styles.formCol}>
            {/* ─────── 01 Choose Payment Method ─────── */}
            <section className={styles.block}>
              <header className={styles.blockHead}>
                <span className={styles.blockNum}>1</span>
                <h2 className={styles.blockTitle}>Choose a payment method</h2>
              </header>

              <ul className={styles.methodList}>
                {PAYMENT_METHODS.map((m) => {
                  const active = method === m.id;
                  return (
                    <li
                      key={m.id}
                      className={`${styles.method} ${active ? styles.methodActive : ""}`}
                    >
                      <label className={styles.methodHead}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={m.id}
                          checked={active}
                          onChange={() => setMethod(m.id)}
                        />
                        <span className={styles.methodRadio} aria-hidden="true" />
                        <span className={styles.methodIcon} aria-hidden="true">
                          {m.icon}
                        </span>
                        <span className={styles.methodCopy}>
                          <strong>{m.label}</strong>
                          <small>{m.sub}</small>
                        </span>
                        <span className={styles.methodBrands}>
                          {m.brands.map((b) => (
                            <span key={b} className={styles.brandChip}>
                              {b}
                            </span>
                          ))}
                        </span>
                        <span className={styles.methodChevron} aria-hidden="true">
                          <FaChevronDown />
                        </span>
                      </label>

                      {active ? (
                        <div className={styles.methodPanel}>
                          {m.id === "upi" ? (
                            <div className={styles.upiPanel}>
                              <div className={styles.qrBox} aria-hidden="true">
                                <div className={styles.qrTile}>
                                  <FaQrcode />
                                </div>
                                <span className={styles.qrCaption}>
                                  Scan &amp; pay using any UPI app
                                </span>
                              </div>
                              <div className={styles.upiSide}>
                                <span className={styles.upiLabel}>
                                  Or pay using UPI ID
                                </span>
                                <div className={styles.upiInputRow}>
                                  <input
                                    type="text"
                                    value="decornart@upi"
                                    readOnly
                                    className={styles.upiInput}
                                  />
                                  <button
                                    type="button"
                                    onClick={copyUpi}
                                    className={styles.upiCopy}
                                    aria-label="Copy UPI ID"
                                  >
                                    {upiCopied ? <FaCheckCircle /> : <FaCopy />}
                                  </button>
                                </div>
                                <ol className={styles.upiSteps}>
                                  <li>Open any UPI app on your phone.</li>
                                  <li>Scan the QR code or enter the UPI ID.</li>
                                  <li>Verify the amount and pay.</li>
                                  <li>You'll be redirected after confirmation.</li>
                                </ol>
                                <p className={styles.upiWaiting}>
                                  <FaRegClock /> Waiting for payment — confirmation is
                                  automatic.
                                </p>
                              </div>
                            </div>
                          ) : null}

                          {m.id === "card" ? (
                            <p className={styles.methodNote}>
                              You'll be redirected to a secure Razorpay window
                              to enter your card details.
                            </p>
                          ) : null}

                          {m.id === "netbanking" ? (
                            <p className={styles.methodNote}>
                              You'll be redirected to a secure Razorpay window
                              to pick your bank and log in.
                            </p>
                          ) : null}

                          {m.id === "wallet" ? (
                            <p className={styles.methodNote}>
                              Choose your wallet provider in the Razorpay
                              window that opens next.
                            </p>
                          ) : null}

                          {m.id === "cod" ? (
                            <p className={styles.methodNote}>
                              Pay the full order amount in cash when our
                              courier hands over your parcel.
                            </p>
                          ) : null}

                          {m.id === "bnpl" ? (
                            <p className={styles.methodNote}>
                              Pick your BNPL provider in the next window —
                              eligibility is decided by the provider.
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* ─────── 02 Billing details ─────── */}
            <section className={styles.block}>
              <header className={styles.blockHead}>
                <span className={styles.blockNum}>2</span>
                <h2 className={styles.blockTitle}>Billing details</h2>
              </header>

              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={billingSame}
                  onChange={(e) => setBillingSame(e.target.checked)}
                />
                <span className={styles.checkBox} aria-hidden="true">
                  {billingSame ? <FaCheckCircle /> : null}
                </span>
                Same as shipping address
              </label>

              {!billingSame ? (
                <div className={styles.billingGrid}>
                  <label className={`${styles.field} ${styles.fieldFull}`}>
                    <input
                      type="text"
                      value={billing.name}
                      onChange={onBilling("name")}
                      placeholder="Full name"
                      className={styles.input}
                    />
                  </label>
                  <div className={styles.row2}>
                    <label className={styles.field}>
                      <input
                        type="tel"
                        value={billing.phone}
                        onChange={onBilling("phone")}
                        placeholder="Phone number"
                        className={styles.input}
                      />
                    </label>
                    <label className={styles.field}>
                      <input
                        type="email"
                        value={billing.email}
                        onChange={onBilling("email")}
                        placeholder="Email address"
                        className={styles.input}
                      />
                    </label>
                  </div>
                  <label className={`${styles.field} ${styles.fieldFull}`}>
                    <input
                      type="text"
                      value={billing.gst}
                      onChange={onBilling("gst")}
                      placeholder="GST number (optional)"
                      className={styles.input}
                    />
                  </label>
                </div>
              ) : null}

              <p className={styles.billingLock}>
                <FaLock /> Your information is safe and encrypted.
              </p>
            </section>

            {/* ─────── 03 Apply coupon ─────── */}
            <section className={styles.block}>
              <header className={styles.blockHead}>
                <span className={styles.blockNum}>3</span>
                <h2 className={styles.blockTitle}>Apply coupon</h2>
              </header>

              <div className={styles.couponLayout}>
                <div className={styles.couponInputBox}>
                  <div className={styles.couponRow}>
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter coupon code"
                      className={styles.couponInput}
                    />
                    <button
                      type="button"
                      onClick={onApplyCoupon}
                      disabled={couponApplying}
                      className={styles.couponBtn}
                    >
                      {couponApplying ? "…" : "Apply"}
                    </button>
                  </div>
                  {couponMsg ? (
                    <p className={styles.couponMsg}>{couponMsg}</p>
                  ) : null}
                </div>

                <div className={styles.offers}>
                  <span className={styles.offersHead}>Available offers</span>
                  <ul>
                    {OFFERS.map((o) => (
                      <li key={o.code}>
                        <span className={styles.offerCode}>
                          <FaTag /> {o.code}
                        </span>
                        — {o.desc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ─────── Almost there banner ─────── */}
            <div className={styles.almostBanner}>
              <span className={styles.almostIcon} aria-hidden="true">
                <FaShieldAlt />
              </span>
              <div className={styles.almostCopy}>
                <strong>Almost there! 🎉</strong>
                <small>
                  Complete your payment to confirm your order. You'll be
                  redirected after a successful payment.
                </small>
              </div>
              <button
                type="submit"
                className={styles.payBtn}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    Processing…
                  </>
                ) : (
                  <>
                    <FaLock /> Pay securely · {inr.format(total)}
                  </>
                )}
              </button>
            </div>
            {error ? (
              <p className={styles.errorLine} role="alert">{error}</p>
            ) : null}
          </div>

          {/* ─────────────────── Summary column ─────────────────── */}
          <aside className={styles.summaryCol}>
            <div className={styles.summary}>
              <header className={styles.summaryHead}>
                <h2 className={styles.summaryTitle}>
                  Order summary <span>({items.length} items)</span>
                </h2>
                <a href="/cart" className={styles.editCart}>
                  Edit cart
                </a>
              </header>

              <ul className={styles.itemsMini}>
                {items.map((p) => (
                  <li key={p.productId} className={styles.itemMini}>
                    <span className={styles.thumb}>
                      <Image
                        src={resolveProductImage(p)}
                        alt={p.name}
                        fill
                        sizes="64px"
                      />
                    </span>
                    <span className={styles.itemMeta}>
                      <span className={styles.itemName}>{p.name}</span>
                      <span className={styles.itemSub}>
                        {p.variantLabel || p.category}
                      </span>
                      <span className={styles.itemQty}>Qty: {p.qty}</span>
                    </span>
                    <span className={styles.itemPrice}>
                      {inr.format(p.lineTotal ?? p.price * p.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className={styles.lines}>
                <div className={styles.line}>
                  <dt>Subtotal</dt>
                  <dd>{inr.format(subtotal)}</dd>
                </div>
                <div className={styles.line}>
                  <dt>Shipping</dt>
                  <dd>
                    {shippingFee === 0 ? (
                      <span className={styles.free}>FREE</span>
                    ) : (
                      inr.format(shippingFee)
                    )}
                  </dd>
                </div>
                {gst > 0 ? (
                  <div className={styles.line}>
                    <dt>GST</dt>
                    <dd>{inr.format(gst)}</dd>
                  </div>
                ) : null}
                {discount > 0 ? (
                  <div className={styles.line}>
                    <dt>Discount{cart.promoCode ? ` (${cart.promoCode})` : ""}</dt>
                    <dd className={styles.discount}>− {inr.format(discount)}</dd>
                  </div>
                ) : null}
              </dl>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{inr.format(total)}</span>
              </div>
              <span className={styles.totalNote}>(Inclusive of all taxes)</span>
            </div>

            <ul className={styles.summaryCard} aria-label="Order guarantees">
              {SUMMARY_TRUST.map((t) => (
                <li key={t.id}>
                  <span className={styles.summaryCardIcon} aria-hidden="true">
                    {t.icon}
                  </span>
                  <span>
                    <strong>{t.title}</strong>
                    <small>{t.note}</small>
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.helpCard}>
              <div className={styles.helpCopy}>
                <h3 className={styles.helpTitle}>
                  Need help? <br />
                  <em>We're here for you!</em>
                </h3>
                <ul className={styles.helpList}>
                  <li>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className={styles.helpIcon} aria-hidden="true">
                        <FaWhatsapp />
                      </span>
                      <span>
                        <strong>WhatsApp us</strong>
                        <small>+91 98765 43210</small>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:support@decornart.in">
                      <span className={styles.helpIcon} aria-hidden="true">
                        <FaEnvelope />
                      </span>
                      <span>
                        <strong>Email us</strong>
                        <small>support@decornart.in</small>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="/contact">
                      <span className={styles.helpIcon} aria-hidden="true">
                        <FaCommentDots />
                      </span>
                      <span>
                        <strong>24/7 support</strong>
                        <small>We reply within minutes</small>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className={styles.helpImage}>
                <Image src={helpImg} alt="" fill sizes="180px" />
              </div>
            </div>

            <div className={styles.avatarsCard}>
              <ul className={styles.avatars} aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <li
                    key={i}
                    className={styles.avatar}
                    style={{ background: AVATAR_TINTS[i] }}
                  >
                    {String.fromCharCode(65 + i)}
                  </li>
                ))}
                <li className={`${styles.avatar} ${styles.avatarCount}`}>10K+</li>
              </ul>
              <span className={styles.avatarsCopy}>
                <strong>Trusted by 10,000+</strong>
                <small>Happy customers</small>
              </span>
            </div>
          </aside>
        </form>

        {/* ───────────── Footer trust strip ───────────── */}
        <ul className={styles.footerTrust}>
          {FOOTER_TRUST.map((f) => (
            <li key={f.id} className={styles.footerTrustItem}>
              <span className={styles.footerTrustIcon} aria-hidden="true">
                {f.icon}
              </span>
              <span>
                <strong>{f.title}</strong>
                <small>{f.note}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
