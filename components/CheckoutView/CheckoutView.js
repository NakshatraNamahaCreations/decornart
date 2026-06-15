"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { createOrder, verifyOrder } from "@/lib/api/orders";
import { openRazorpay } from "@/lib/razorpay";
import { resolveProductImage } from "@/lib/productImages";
import styles from "./CheckoutView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const DELIVERY_OPTIONS = [
  {
    id: "same-day",
    label: "Same-day · Atelier courier",
    sub: "Delivered before 7 PM today in Mumbai, Bengaluru, Delhi & Pune",
    price: 0,
    eta: "Today",
  },
  {
    id: "next-day",
    label: "Next morning",
    sub: "By 10 AM tomorrow, with a chilled wrap",
    price: 199,
    eta: "Tomorrow",
  },
];

const EMPTY_ADDRESS = {
  recipient: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

export default function CheckoutView() {
  const root = useRef(null);
  const router = useRouter();
  const { user, isAuthed, isLoading: authLoading, addAddress } = useAuth();
  const { cart, refresh: refreshCart } = useCart();
  const [delivery, setDelivery] = useState("same-day");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const didAutoSelectAddress = useRef(false);

  useEffect(() => {
    if (!authLoading && !isAuthed) {
      router.replace("/login?next=/checkout");
    }
  }, [authLoading, isAuthed, router]);

  useEffect(() => {
    if (didAutoSelectAddress.current) return;
    if (!user?.addresses?.length) return;
    const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
    setSelectedAddressId(def._id || def.id);
    setShowAddressForm(false);
    didAutoSelectAddress.current = true;
  }, [user]);

  const onAddressFieldChange = (key) => (e) => {
    setAddressForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (addressSaved) setAddressSaved(false);
  };

  const saveDraftAddress = async () => {
    setError("");
    const draft = addressForm;
    const required = ["line1", "city", "state", "pincode", "phone"];
    if (required.some((k) => !String(draft[k] || "").trim())) {
      setError("Please fill in every required field of the delivery address.");
      return;
    }
    setSavingAddress(true);
    try {
      const addresses = await addAddress({
        label: draft.recipient || "",
        line1: draft.line1,
        line2: draft.line2 || undefined,
        city: draft.city,
        state: draft.state,
        pincode: draft.pincode,
        phone: draft.phone,
      });
      const justAdded = addresses[addresses.length - 1];
      setSelectedAddressId(justAdded?._id || justAdded?.id || null);
      setShowAddressForm(false);
      setAddressForm(EMPTY_ADDRESS);
      setAddressSaved(true);
    } catch (err) {
      setError(err.message || "Could not save the address. Please try again.");
    } finally {
      setSavingAddress(false);
    }
  };

  const items = cart.items || [];
  const summary = cart.summary || {};
  const subtotal = summary.subtotal ?? 0;
  const gst = summary.gst ?? 0;
  const baseShipping = summary.shipping ?? 0;
  const deliveryFee =
    delivery === "same-day"
      ? baseShipping
      : baseShipping + (DELIVERY_OPTIONS.find((d) => d.id === delivery)?.price ?? 0);
  const total = subtotal + gst + deliveryFee - (summary.discount ?? 0);

  const selectedAddress = useMemo(() => {
    if (!selectedAddressId) return null;
    return (user?.addresses || []).find(
      (a) => (a._id || a.id) === selectedAddressId
    );
  }, [user, selectedAddressId]);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");

    let shippingAddress = selectedAddress;
    if (!shippingAddress) {
      const draft = addressForm;
      const required = ["line1", "city", "state", "pincode", "phone"];
      if (required.some((k) => !String(draft[k] || "").trim())) {
        setError("Please fill in every required field of the delivery address.");
        return;
      }
      shippingAddress = {
        line1: draft.line1,
        line2: draft.line2 || undefined,
        city: draft.city,
        state: draft.state,
        pincode: draft.pincode,
        phone: draft.phone,
      };
    }

    setProcessing(true);
    let placedOrderNumber = null;
    try {
      const { order, payment } = await createOrder({ shippingAddress });
      placedOrderNumber = order.orderNumber;

      let verifyPayload;
      if (payment.mock) {
        verifyPayload = {
          razorpayOrderId: payment.orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: "mock_signature",
        };
      } else {
        verifyPayload = await openRazorpay({
          orderId: payment.orderId,
          amount: payment.amount,
          currency: payment.currency,
          user,
        });
      }

      await verifyOrder(verifyPayload);

      refreshCart();
      const eta = DELIVERY_OPTIONS.find((d) => d.id === delivery)?.eta || "";
      const paidTotal = order.summary?.total || total;
      const qs = new URLSearchParams({
        order: order.orderNumber,
        total: String(paidTotal),
        eta,
      });
      router.push(`/thank-you?${qs.toString()}`);
    } catch (err) {
      const reason = err.message || "Could not place your order. Please try again.";
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
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(`.${styles.block}, .${styles.summary}`, {
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
      });
    },
    { scope: root }
  );

  if (authLoading || !isAuthed) {
    return (
      <section className={styles.section}>
        <div className="container" style={{ padding: "6rem 0", opacity: 0.6 }}>
          Checking your session…
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className={styles.section}>
        <div className="container" style={{ padding: "6rem 0" }}>
          <h1 className={styles.heading}>Your basket is empty.</h1>
          <p className={styles.blockSub} style={{ marginTop: "0.75rem" }}>
            Add a bouquet to your basket before continuing to checkout.
          </p>
          <a href="/shop" className={styles.cta} style={{ marginTop: "1.5rem", display: "inline-block" }}>
            Browse the shop →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <nav className={styles.crumbs} aria-label="Checkout progress">
            <a href="/cart">Basket</a>
            <span className={styles.crumbSep} aria-hidden="true">→</span>
            <span className={styles.crumbActive}>Checkout</span>
            <span className={styles.crumbSep} aria-hidden="true">→</span>
            <span>Confirmation</span>
          </nav>

          <div className={styles.headRow}>
            <div>
              <span className={styles.eyebrow}>— Final details</span>
              <h1 className={styles.heading}>
                Just <em>one note</em> before we tie it.
              </h1>
            </div>
            <span className={styles.secure} aria-label="Secure checkout">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Secure · Razorpay · SSL
            </span>
          </div>
        </div>

        <form className={styles.layout} onSubmit={placeOrder}>
          <div className={styles.formCol}>
            <section className={styles.block}>
              <header className={styles.blockHead}>
                <span className={styles.blockNum}>01</span>
                <div>
                  <h2 className={styles.blockTitle}>Delivery address</h2>
                  <p className={styles.blockSub}>
                    Where the bouquet should arrive — and to whom.
                  </p>
                </div>
              </header>

              {(user?.addresses || []).length > 0 && (
                <div className={styles.addressList}>
                  {user.addresses.map((a, i) => {
                    const id = a._id || a.id;
                    return (
                      <label
                        key={id}
                        className={`${styles.addressCard} ${
                          selectedAddressId === id ? styles.addressCardActive : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryAddress"
                          value={id}
                          checked={selectedAddressId === id}
                          onChange={() => {
                            setSelectedAddressId(id);
                            setShowAddressForm(false);
                          }}
                        />
                        <span className={styles.addressRadio} aria-hidden="true" />
                        <span className={styles.addressBody}>
                          <span className={styles.addressTop}>
                            <span className={styles.addressName}>
                              {a.label || `Address ${i + 1}`}
                            </span>
                          </span>
                          <span className={styles.addressLine}>{a.line1}</span>
                          {a.line2 && <span className={styles.addressLine}>{a.line2}</span>}
                          <span className={styles.addressLine}>
                            {a.city}, {a.state} {a.pincode}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {showAddressForm ? (
                <div className={styles.addressForm}>
                  <div className={styles.row}>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Recipient name</span>
                      <input
                        type="text"
                        value={addressForm.recipient}
                        onChange={onAddressFieldChange("recipient")}
                        autoComplete="name"
                        className={styles.input}
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>Phone</span>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={onAddressFieldChange("phone")}
                        className={styles.input}
                      />
                    </label>
                  </div>
                  <label className={`${styles.field} ${styles.fieldFull}`}>
                    <span className={styles.fieldLabel}>Address line 1</span>
                    <input
                      type="text"
                      value={addressForm.line1}
                      onChange={onAddressFieldChange("line1")}
                      className={styles.input}
                    />
                  </label>
                  <label className={`${styles.field} ${styles.fieldFull}`}>
                    <span className={styles.fieldLabel}>Address line 2 (optional)</span>
                    <input
                      type="text"
                      value={addressForm.line2}
                      onChange={onAddressFieldChange("line2")}
                      className={styles.input}
                    />
                  </label>
                  <div className={styles.row3}>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>City</span>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={onAddressFieldChange("city")}
                        className={styles.input}
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>State</span>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={onAddressFieldChange("state")}
                        className={styles.input}
                      />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.fieldLabel}>PIN</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d{6}"
                        value={addressForm.pincode}
                        onChange={onAddressFieldChange("pincode")}
                        className={styles.input}
                      />
                    </label>
                  </div>

                  <div className={styles.blockActions}>
                    {(user?.addresses || []).length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className={styles.cancelAddress}
                      >
                        Use a saved address
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={saveDraftAddress}
                      disabled={savingAddress || addressSaved}
                      className={`${styles.saveAddress} ${
                        addressSaved ? styles.saveAddressDone : ""
                      }`}
                    >
                      {savingAddress
                        ? "Saving…"
                        : addressSaved
                        ? "Saved ✓"
                        : "Save address"}
                      {!savingAddress && !addressSaved && (
                        <span aria-hidden="true">→</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.blockActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(true);
                      setSelectedAddressId(null);
                    }}
                    className={styles.addAddress}
                  >
                    <span aria-hidden="true">+</span> Use a different address
                  </button>
                </div>
              )}
            </section>

            <section className={styles.block}>
              <header className={styles.blockHead}>
                <span className={styles.blockNum}>02</span>
                <div>
                  <h2 className={styles.blockTitle}>Delivery</h2>
                  <p className={styles.blockSub}>
                    Atelier-tied, climate-conditioned, never outsourced.
                  </p>
                </div>
              </header>
              <div className={styles.options}>
                {DELIVERY_OPTIONS.map((d) => (
                  <label
                    key={d.id}
                    className={`${styles.option} ${
                      delivery === d.id ? styles.optionActive : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={d.id}
                      checked={delivery === d.id}
                      onChange={() => setDelivery(d.id)}
                    />
                    <span className={styles.optionRadio} aria-hidden="true" />
                    <span className={styles.optionBody}>
                      <span className={styles.optionTop}>
                        <span className={styles.optionLabel}>{d.label}</span>
                        <span className={styles.optionPrice}>
                          {d.price === 0 ? "Free" : inr.format(d.price)}
                        </span>
                      </span>
                      <span className={styles.optionSub}>{d.sub}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.summaryCol}>
            <div className={styles.summary}>
              <span className={styles.summaryEyebrow}>— Order summary</span>
              <h2 className={styles.summaryHeading}>The total.</h2>
              <span className={styles.summaryRule} aria-hidden="true" />

              <ul className={styles.itemsMini}>
                {items.map((p) => (
                  <li key={p.productId} className={styles.itemMini}>
                    <span className={styles.thumb}>
                      <Image
                        src={resolveProductImage(p)}
                        alt={p.name}
                        fill
                        sizes="68px"
                      />
                      <span className={styles.thumbBadge}>{p.qty}</span>
                    </span>
                    <span className={styles.itemMeta}>
                      <span className={styles.itemName}>{p.name}</span>
                      <span className={styles.itemSub}>{p.category}</span>
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
                  <dt>GST (5%)</dt>
                  <dd>{inr.format(gst)}</dd>
                </div>
                <div className={styles.line}>
                  <dt>Delivery</dt>
                  <dd>
                    {deliveryFee === 0 ? (
                      <span className={styles.free}>Free</span>
                    ) : (
                      inr.format(deliveryFee)
                    )}
                  </dd>
                </div>
                {(summary.discount ?? 0) > 0 && (
                  <div className={styles.line}>
                    <dt>Promo · {cart.promoCode}</dt>
                    <dd>− {inr.format(summary.discount)}</dd>
                  </div>
                )}
              </dl>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{inr.format(total)}</span>
              </div>

              {error && (
                <p className={styles.tos} style={{ color: "#b00" }}>{error}</p>
              )}

              <button
                type="submit"
                className={styles.placeOrder}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    Processing…
                  </>
                ) : (
                  <>
                    Place order · {inr.format(total)}
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
              <p className={styles.tos}>
                By placing this order you agree to our{" "}
                <a href="/terms" className={styles.tosLink}>Terms</a> and{" "}
                <a href="/privacy" className={styles.tosLink}>Privacy</a>.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}
