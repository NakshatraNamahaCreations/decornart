"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaWhatsapp, FaEnvelope, FaCommentDots } from "react-icons/fa";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { createOrder, verifyOrder } from "@/lib/api/orders";
import { getPublicSettings } from "@/lib/api/settings";
import * as authApi from "@/lib/api/auth";
import { openRazorpay, RazorpayError } from "@/lib/razorpay";
import { resolveProductImage } from "@/lib/productImages";
import { hexForColor } from "@/lib/colorSwatches";
import heroImg from "@/assets/checkoutbg.png";
import helpImg from "@/assets/promobg.png";
import visaImg from "@/assets/payment/visa.jpg";
import mastercardImg from "@/assets/payment/mastercard.jpg";
import upiImg from "@/assets/payment/upi.jpg";
import paytmImg from "@/assets/payment/paytm.jpg";
import rupayImg from "@/assets/payment/rupay.jpg";

// Payment method logos shown next to the "Card" radio option and in the
// "We Accept" strip below the Place Order button. Same set as the
// footer / cart page.
const PAYMENT_LOGOS = [
  { id: "visa", label: "Visa", image: visaImg },
  { id: "mastercard", label: "Mastercard", image: mastercardImg },
  { id: "upi", label: "UPI", image: upiImg },
  { id: "paytm", label: "Paytm", image: paytmImg },
  { id: "rupay", label: "RuPay", image: rupayImg },
];

const CARD_LOGOS = [visaImg, mastercardImg, rupayImg];
import { useBannerContent } from "@/hooks/useBannerContent";
import styles from "./CheckoutView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const DEFAULT_STANDARD_SHIPPING = 99;

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    title: "Standard Shipping",
    sub: "3 – 5 Business Days",
    priceLabel: "₹99.00",
    priceNote: "FREE on orders above ₹2500",
    price: DEFAULT_STANDARD_SHIPPING,
  },
  {
    id: "express",
    title: "Express Shipping",
    sub: "1 – 2 Business Days",
    priceLabel: "₹150.00",
    price: 150,
  },
  {
    id: "same-day",
    title: "Same Day Delivery",
    sub: "Available in select cities",
    priceLabel: "₹250.00",
    price: 250,
  },
];

const PAYMENT_OPTIONS = [
  {
    id: "upi",
    title: "UPI / QR",
    badges: ["G Pay", "PhonePe", "Paytm", "UPI"],
  },
  {
    id: "card",
    title: "Card",
    sub: "Visa, Mastercard, Rupay & more",
    badges: ["VISA", "MC", "RuPay"],
  },
  {
    id: "netbank",
    title: "Net Banking",
    sub: "All major banks supported",
    bankIcon: true,
  },
  {
    id: "cod",
    title: "Cash on Delivery (COD)",
    sub: "Pay when you receive",
    codIcon: true,
  },
];

const SUMMARY_TRUST = [
  {
    id: "shipping",
    title: "Free Shipping",
    copy: "On orders above ₹2500",
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
    id: "secure",
    title: "Secure Payment",
    copy: "100% safe & secure",
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
    id: "payments",
    title: "Secure Payments",
    copy: "100% protected",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="12" rx="1" />
        <path d="M3 11h18" />
      </svg>
    ),
  },
  {
    id: "delivery",
    title: "Pan India Delivery",
    copy: "Fast & reliable",
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
    id: "happy",
    title: "10,000+ Happy Customers",
    copy: "Trust our quality",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
      </svg>
    ),
  },
  {
    id: "india",
    title: "Made in India",
    copy: "Proudly presents",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" strokeLinecap="round" />
      </svg>
    ),
  },
];

const CRUMBS = ["Cart", "Information", "Shipping", "Payment"];

export default function CheckoutView() {
  const root = useRef(null);
  const heroBanner = useBannerContent("checkout-hero");
  const heroSrc = heroBanner.loaded ? heroBanner.image || heroImg : null;
  const router = useRouter();
  const { cart, refresh: refreshCart, applyPromo: applyCartPromo } = useCart();
  const { user, isAuthed, refresh: refreshUser } = useAuth();
  const items = cart?.items || [];
  const summary = cart?.summary || {};
  const subtotal =
    summary.subtotal ??
    items.reduce((sum, l) => sum + (l.price ?? 0) * (l.qty ?? 1), 0);
  const discount = summary.discount ?? 0;
  const baseShipping = summary.shipping ?? 0;

  // Live shipping / free-shipping settings from the backend, so the admin
  // can edit express + same-day prices without a redeploy. Falls back to
  // the hardcoded SHIPPING_OPTIONS prices while the fetch is in flight.
  const [siteSettings, setSiteSettings] = useState(null);
  useEffect(() => {
    let cancelled = false;
    getPublicSettings()
      .then((s) => {
        if (!cancelled) setSiteSettings(s);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const shippingOptions = useMemo(() => {
    const s = siteSettings?.checkout || {};
    const expressPrice =
      typeof s.expressShippingCharge === "number" ? s.expressShippingCharge : 150;
    const sameDayPrice =
      typeof s.sameDayShippingCharge === "number" ? s.sameDayShippingCharge : 250;
    const standardPrice =
      typeof s.defaultShippingCharge === "number"
        ? s.defaultShippingCharge
        : DEFAULT_STANDARD_SHIPPING;
    const freeOver =
      summary.freeShippingOver ??
      (typeof s.freeShippingThreshold === "number" ? s.freeShippingThreshold : 2500);
    const standardIsFree = subtotal >= freeOver;
    return SHIPPING_OPTIONS.map((opt) => {
      if (opt.id === "express") {
        return {
          ...opt,
          price: expressPrice,
          priceLabel: inr.format(expressPrice),
        };
      }
      if (opt.id === "same-day") {
        return {
          ...opt,
          price: sameDayPrice,
          priceLabel: inr.format(sameDayPrice),
        };
      }
      if (opt.id === "standard") {
        return {
          ...opt,
          price: standardIsFree ? 0 : standardPrice,
          priceLabel: standardIsFree ? "FREE" : inr.format(standardPrice),
          priceNote: standardIsFree
            ? "You qualified for free shipping"
            : `FREE on orders above ${inr.format(freeOver)}`,
        };
      }
      return opt;
    });
  }, [siteSettings, subtotal, summary.freeShippingOver]);

  const [email, setEmail] = useState("");
  const [newsOptIn, setNewsOptIn] = useState(true);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    landmark: "",
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  // Pre-select "standard" so the picker shows a default choice and the
  // summary reflects a valid shipping cost on first render. The shopper
  // can switch to "same-day" (or whatever else SHIPPING_OPTIONS exposes)
  // and the total updates below.
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const [coupon, setCoupon] = useState(cart?.promoCode || "");
  const [couponNote, setCouponNote] = useState("");
  const [discountOpen, setDiscountOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Hydrate the saved-address list from the authenticated user. `user.addresses`
  // is refreshed by AuthProvider after login/logout and after each address
  // mutation (see the save/edit/delete handlers below). Normalises Mongo `_id`
  // to plain `id` so the existing local render code doesn't have to care.
  useEffect(() => {
    const rows = Array.isArray(user?.addresses) ? user.addresses : [];
    const normalised = rows.map((a) => ({
      id: String(a._id || a.id),
      name: a.name || "",
      phone: a.phone || "",
      pincode: a.pincode || "",
      line1: a.line1 || "",
      line2: a.line2 || "",
      landmark: a.landmark || "",
      city: a.city || "",
      state: a.state || "",
      isDefault: !!a.isDefault,
    }));
    setSavedAddresses(normalised);
    // Auto-select the default (or first) address so a returning shopper
    // doesn't have to re-pick every visit.
    setSelectedAddressId((prev) => {
      if (prev && normalised.some((a) => a.id === prev)) return prev;
      const chosen =
        normalised.find((a) => a.isDefault) || normalised[0] || null;
      return chosen ? chosen.id : null;
    });
    // Collapse the "add" form once we have at least one saved address.
    if (normalised.length > 0) setShowAddressForm(false);
    else setShowAddressForm(true);
  }, [user?.addresses]);

  const shippingObj = shippingOptions.find((s) => s.id === shipping);
  const shippingSelected = !!shippingObj;
  // Standard: ₹99 flat, waived above the free-shipping threshold. Express and
  // Same Day always use their own price. The memo above resolves all three.
  const shippingCost = shippingSelected
    ? shippingObj?.price ?? 0
    : baseShipping;
  const total = Math.max(0, subtotal + shippingCost - discount);

  const applyCoupon = async () => {
    setCouponNote("");
    const code = coupon.trim();
    if (!code) {
      setCouponNote("Please enter a coupon code.");
      return;
    }
    try {
      await applyCartPromo(code.toUpperCase());
      setCouponNote(`"${code.toUpperCase()}" applied.`);
    } catch (err) {
      setCouponNote(err?.message || "Invalid coupon code.");
    }
  };

  const cartItems = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        image: it.image || resolveProductImage(it),
      })),
    [items]
  );

  const setAddr = (k, v) => setAddress((prev) => ({ ...prev, [k]: v }));

  const EMPTY_ADDRESS = {
    name: "",
    phone: "",
    pincode: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    landmark: "",
  };

  const isAddressFilled =
    address.name.trim() &&
    address.phone.trim() &&
    address.line1.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    address.pincode.trim();

  // Map the local address form (which uses `name`/`landmark`) onto the shape
  // the backend accepts. Field names line up 1-to-1 with the backend zod
  // schema — pincode is normalised to digits only so the 6-digit regex passes.
  const toBackendAddress = (a) => ({
    name: (a.name || "").trim(),
    line1: (a.line1 || "").trim(),
    line2: (a.line2 || "").trim() || undefined,
    landmark: (a.landmark || "").trim() || undefined,
    city: (a.city || "").trim(),
    state: (a.state || "").trim(),
    pincode: (a.pincode || "").trim(),
    phone: (a.phone || "").trim(),
  });

  const handleSaveAddress = async () => {
    if (!isAddressFilled) return;
    setAddressError("");

    // Guest shoppers get the old local-only behaviour so they can still
    // check out without an account. Once they log in, AuthProvider will
    // refetch and the saved list hydrates from the server.
    if (!isAuthed) {
      if (editingId) {
        setSavedAddresses((prev) =>
          prev.map((a) => (a.id === editingId ? { ...address, id: editingId } : a))
        );
        setEditingId(null);
      } else {
        const newId = Date.now().toString();
        setSavedAddresses((prev) => {
          const next = [...prev, { ...address, id: newId }];
          if (prev.length === 0) setSelectedAddressId(newId);
          return next;
        });
      }
      setAddress(EMPTY_ADDRESS);
      setShowAddressForm(false);
      return;
    }

    setSavingAddress(true);
    try {
      const payload = toBackendAddress(address);
      if (editingId) {
        await authApi.updateAddress(editingId, payload);
      } else {
        await authApi.addAddress(payload);
      }
      // Server is now the source of truth — pull the updated user so the
      // hydrate effect above re-fills savedAddresses with a stable _id.
      await refreshUser();
      setAddress(EMPTY_ADDRESS);
      setEditingId(null);
      setShowAddressForm(false);
    } catch (err) {
      const detail = err?.details
        ? ` — ${err.details.map((d) => d.message || d).join("; ")}`
        : "";
      setAddressError(`${err?.message || "Could not save address."}${detail}`);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (id) => {
    const found = savedAddresses.find((a) => a.id === id);
    if (!found) return;
    const { id: _drop, ...rest } = found;
    setAddress(rest);
    setEditingId(id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    // Guest deletion stays purely local.
    if (!isAuthed) {
      setSavedAddresses((prev) => {
        const next = prev.filter((a) => a.id !== id);
        if (next.length === 0) setShowAddressForm(true);
        if (selectedAddressId === id) {
          setSelectedAddressId(next[0]?.id ?? null);
        }
        return next;
      });
      if (editingId === id) {
        setEditingId(null);
        setAddress(EMPTY_ADDRESS);
      }
      return;
    }

    setAddressError("");
    try {
      await authApi.deleteAddress(id);
      await refreshUser();
      // The hydrate effect will drop the row from savedAddresses; only local
      // UI state (edit form / selected id) needs manual cleanup.
      if (editingId === id) {
        setEditingId(null);
        setAddress(EMPTY_ADDRESS);
      }
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      setAddressError(err?.message || "Could not delete address.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAddress(EMPTY_ADDRESS);
    if (savedAddresses.length > 0) setShowAddressForm(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setAddress(EMPTY_ADDRESS);
    setShowAddressForm(true);
  };

  // Resolve the shipping address that will be sent to the backend. Prefer the
  // saved address the shopper picked; otherwise fall back to whatever is
  // typed into the form. Backend validates shape (see order.validation.js).
  const resolveShippingAddress = () => {
    const src =
      savedAddresses.find((a) => a.id === selectedAddressId) || address;
    return {
      line1: src.line1?.trim() || "",
      line2: src.line2?.trim() || undefined,
      city: src.city?.trim() || "",
      state: src.state?.trim() || "",
      pincode: src.pincode?.trim() || "",
      phone: src.phone?.trim() || "",
    };
  };

  const handlePlaceOrder = async () => {
    setOrderError("");

    if (!isAuthed) {
      setOrderError("Please sign in to place your order.");
      router.push("/account");
      return;
    }
    if (!items.length) {
      setOrderError("Your cart is empty.");
      return;
    }

    const shippingAddress = resolveShippingAddress();
    // Mirror the backend's zod schema so we surface issues before a round-trip.
    if (
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !/^\d{6}$/.test(shippingAddress.pincode) ||
      !shippingAddress.phone
    ) {
      setOrderError("Please complete a shipping address with a 6-digit pincode.");
      return;
    }
    if (!shippingSelected) {
      window.alert("Please choose a shipping method.");
      return;
    }

    setProcessing(true);
    let orderId = null;
    try {
      // 1. Server creates the Order + Razorpay order in one atomic step.
      const { order, payment: pay } = await createOrder({
        shippingAddress,
        shippingMethod: shipping,
      });
      orderId = order.id;

      // 2. Open Razorpay checkout. In mock mode (no keys configured), the
      //    backend returns a fake orderId; the modal will fail to open, so we
      //    skip straight to verify — which the backend accepts in mock mode.
      let verifyPayload;
      if (pay.mock) {
        verifyPayload = {
          razorpayOrderId: pay.orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: "mock-signature",
        };
      } else {
        verifyPayload = await openRazorpay({
          orderId: pay.orderId,
          amount: pay.amount,
          currency: pay.currency,
          user: { name: user?.name, email: user?.email, phone: address.phone },
        });
      }

      // 3. Verify signature and finalise stock/status server-side.
      await verifyOrder(verifyPayload);

      // 4. Cart is cleared server-side; sync the client store before leaving.
      refreshCart().catch(() => {});

      router.push(`/thank-you?orderId=${encodeURIComponent(order.id)}`);
    } catch (err) {
      // Route to /payment-failed on any post-order-creation failure so the
      // shopper sees a proper page instead of a red toast on top of checkout.
      const isDismissed =
        err instanceof RazorpayError && err.code === "dismissed";
      const reason = isDismissed
        ? "Payment cancelled"
        : err?.message || "Payment failed";
      const params = new URLSearchParams({ reason });
      if (orderId) params.set("order", orderId);
      router.push(`/payment-failed?${params.toString()}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── Page banner — full-bleed, own container ─────────── */}
      <section className={styles.pageHead} aria-label="Checkout">
        <div className={styles.pageHeadDeco} aria-hidden="true">
          {heroSrc && (
            <Image
              src={heroSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.pageHeadDecoImg}
            />
          )}
        </div>
        <div className={`container ${styles.pageHeadInner}`}>
          <div className={styles.pageHeadCopy}>
            <h1 className={styles.pageTitle}>{heroBanner.text("title", "Checkout")}</h1>
            <nav className={styles.crumbs} aria-label="Checkout progress">
              {CRUMBS.map((c, i) => (
                <span key={c} className={styles.crumb}>
                  <span className={i === 1 ? styles.crumbActive : styles.crumbText}>
                    {c}
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
              <strong>100% Secure Checkout</strong>
              <span>Your information is safe with us</span>
            </span>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── Main layout ─────────── */}
        <div className={styles.layout}>
          {/* ═════ LEFT: numbered steps ═════ */}
          <div className={styles.stepsCol}>
            {/* 1. Contact Information */}
            <section className={styles.stepCard}>
              <header className={styles.stepHead}>
                <span className={styles.stepNum} aria-hidden="true">1</span>
                <h2 className={styles.stepTitle}>Contact Information</h2>
              </header>
              <input
                type="email"
                className={styles.input}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={newsOptIn}
                  onChange={(e) => setNewsOptIn(e.target.checked)}
                />
                <span>Keep me updated on news, offers &amp; exclusive deals</span>
              </label>
            </section>

            {/* 2. Shipping Address */}
            <section className={styles.stepCard}>
              <header className={styles.stepHead}>
                <span className={styles.stepNum} aria-hidden="true">2</span>
                <h2 className={styles.stepTitle}>Shipping Address</h2>
                {!showAddressForm && (
                  <button
                    type="button"
                    className={styles.addAddressBtn}
                    onClick={handleAddNew}
                  >
                    <span aria-hidden="true" className={styles.addAddressPlus}>
                      +
                    </span>
                    Add Address
                  </button>
                )}
              </header>

              {savedAddresses.length > 0 && (
                <ul className={styles.savedList} role="radiogroup" aria-label="Saved shipping addresses">
                  {savedAddresses.map((a) => {
                    const isSelected = selectedAddressId === a.id;
                    return (
                      <li
                        key={a.id}
                        className={`${styles.savedItem} ${
                          isSelected ? styles.savedSelected : ""
                        } ${editingId === a.id ? styles.savedEditing : ""}`}
                      >
                        <label className={styles.savedRadioLabel}>
                          <input
                            type="radio"
                            name="savedAddress"
                            className={styles.savedRadio}
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(a.id)}
                            aria-label={`Deliver to ${a.name}, ${a.line1}`}
                          />
                          <span
                            className={styles.savedRadioDot}
                            aria-hidden="true"
                          />
                          <div className={styles.savedBody}>
                            <strong>{a.name}</strong>
                            <span>
                              {a.line1}
                              {a.line2 ? `, ${a.line2}` : ""}
                              {a.landmark ? ` (${a.landmark})` : ""}
                            </span>
                            <span>
                              {a.city}, {a.state} &mdash; {a.pincode}
                            </span>
                            <span>Ph: {a.phone}</span>
                          </div>
                        </label>
                        <div className={styles.savedActions}>
                          <button
                            type="button"
                            className={styles.savedBtn}
                            onClick={() => handleEditAddress(a.id)}
                            aria-label={`Edit address for ${a.name}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={`${styles.savedBtn} ${styles.savedBtnDanger}`}
                            onClick={() => handleDeleteAddress(a.id)}
                            aria-label={`Delete address for ${a.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {showAddressForm && (
              <>
              <div className={styles.formGrid}>
                <input
                  type="text"
                  className={`${styles.input} ${styles.spanTwo}`}
                  placeholder="Full Name"
                  value={address.name}
                  onChange={(e) => setAddr("name", e.target.value)}
                />
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) => setAddr("phone", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddr("pincode", e.target.value)}
                />
                <input
                  type="text"
                  className={`${styles.input} ${styles.spanTwo}`}
                  placeholder="Address Line 1"
                  value={address.line1}
                  onChange={(e) => setAddr("line1", e.target.value)}
                />
                <input
                  type="text"
                  className={`${styles.input} ${styles.spanTwo}`}
                  placeholder="Address Line 2 (Optional)"
                  value={address.line2}
                  onChange={(e) => setAddr("line2", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddr("city", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddr("state", e.target.value)}
                />
                <input
                  type="text"
                  className={`${styles.input} ${styles.spanTwo}`}
                  placeholder="Landmark (Optional)"
                  value={address.landmark}
                  onChange={(e) => setAddr("landmark", e.target.value)}
                />
              </div>
              <div className={styles.saveAddressRow}>
                <button
                  type="button"
                  className={styles.saveAddressBtn}
                  onClick={handleSaveAddress}
                  disabled={!isAddressFilled || savingAddress}
                  aria-busy={savingAddress}
                >
                  {savingAddress
                    ? "Saving…"
                    : editingId
                      ? "Update Address"
                      : "Save Address"}{" "}
                  {!savingAddress && <span aria-hidden="true">&rarr;</span>}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className={styles.saveAddressCancel}
                    onClick={handleCancelEdit}
                    disabled={savingAddress}
                  >
                    Cancel
                  </button>
                )}
              </div>
              </>
              )}
              {addressError && (
                <p role="alert" className={styles.orderError}>
                  {addressError}
                </p>
              )}
            </section>

            {/* 3. Shipping Method */}
            <section className={styles.stepCard}>
              <header className={styles.stepHead}>
                <span className={styles.stepNum} aria-hidden="true">3</span>
                <h2 className={styles.stepTitle}>Shipping Method</h2>
              </header>
              <ul className={styles.optionList}>
                {shippingOptions.map((s) => (
                  <li key={s.id}>
                    <label
                      className={`${styles.optionRow} ${
                        shipping === s.id ? styles.optionActive : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={s.id}
                        checked={shipping === s.id}
                        onChange={() => setShipping(s.id)}
                        className={styles.radio}
                      />
                      <span className={styles.optionIcon} aria-hidden="true">
                        {s.id === "same-day" ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                            <path d="M4 8l4-4h8l4 4v12H4z" />
                            <path d="M4 12h16M12 4v16" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                            <path d="M3 7h11v9H3z" />
                            <path d="M14 10h4l3 3v3h-7" />
                            <circle cx="7" cy="18" r="1.6" />
                            <circle cx="17" cy="18" r="1.6" />
                          </svg>
                        )}
                      </span>
                      <span className={styles.optionCopy}>
                        <strong>{s.title}</strong>
                        <span>{s.sub}</span>
                      </span>
                      <span className={styles.optionPrice}>
                        <strong>{s.priceLabel}</strong>
                        {s.priceNote && <span>{s.priceNote}</span>}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Payment Method */}
            <section className={styles.stepCard}>
              <header className={styles.stepHead}>
                <span className={styles.stepNum} aria-hidden="true">4</span>
                <h2 className={styles.stepTitle}>Payment Method</h2>
              </header>
              <p className={styles.stepSub}>
                All transactions are secure and encrypted.
              </p>
              <ul className={styles.paymentList}>
                {PAYMENT_OPTIONS.map((p) => (
                  <li key={p.id}>
                    <label
                      className={`${styles.paymentRow} ${
                        payment === p.id ? styles.optionActive : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={p.id}
                        checked={payment === p.id}
                        onChange={() => setPayment(p.id)}
                        className={styles.radio}
                      />
                      <div className={styles.paymentCopy}>
                        <strong>{p.title}</strong>
                        {p.sub && <span>{p.sub}</span>}
                      </div>
                      {p.id === "card" && (
                        <div className={styles.paymentBadges}>
                          {CARD_LOGOS.map((img, i) => (
                            <span key={i} className={styles.payBadge}>
                              <Image
                                src={img}
                                alt=""
                                width={38}
                                height={22}
                                sizes="38px"
                              />
                            </span>
                          ))}
                        </div>
                      )}
                      {p.bankIcon && (
                        <span className={styles.paymentSideIcon} aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                            <path d="M3 10L12 4l9 6v2H3z" />
                            <path d="M5 12v7M9 12v7M15 12v7M19 12v7M3 21h18" strokeLinecap="round" />
                          </svg>
                        </span>
                      )}
                      {p.codIcon && (
                        <span className={styles.paymentSideIcon} aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                            <rect x="3" y="7" width="18" height="12" rx="1" />
                            <circle cx="12" cy="13" r="2.5" />
                          </svg>
                        </span>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. Review & Place Order */}
            <section className={styles.stepCard}>
              <header className={styles.stepHead}>
                <span className={styles.stepNum} aria-hidden="true">5</span>
                <h2 className={styles.stepTitle}>Review &amp; Place Order</h2>
              </header>
              <div className={styles.confidenceRow}>
                <span className={styles.confidenceIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" />
                  </svg>
                </span>
                <span className={styles.confidenceText}>
                  <strong>Shop with confidence</strong>
                  <span>
                    Your personal data is safe and your order is protected by our secure checkout.
                  </span>
                </span>
              </div>
              <button
                type="button"
                className={styles.placeBtn}
                onClick={handlePlaceOrder}
                disabled={processing}
                aria-busy={processing}
              >
                {processing ? "Processing…" : "Place Order"}{" "}
                {!processing && <span aria-hidden="true">&rarr;</span>}
              </button>
              <div className={styles.payAccept}>
                <span>We Accept</span>
                <ul
                  className={styles.payList}
                  aria-label="Accepted payment methods"
                >
                  {PAYMENT_LOGOS.map((p) => (
                    <li key={p.id} className={styles.payLogo}>
                      <Image
                        src={p.image}
                        alt={p.label}
                        width={44}
                        height={26}
                        sizes="44px"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              {orderError && (
                <p role="alert" className={styles.orderError}>
                  {orderError}
                </p>
              )}
              <p className={styles.termsLine}>
                By placing your order, you agree to our{" "}
                <a href="/terms">Terms &amp; Conditions</a>.
              </p>
            </section>
          </div>

          {/* ═════ RIGHT: order summary + help ═════ */}
          <aside className={styles.summaryCol}>
            {/* Order Summary */}
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
                            sizes="70px"
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
                  onClick={applyCoupon}
                >
                  Apply
                </button>
              </div>
              {couponNote && <p className={styles.taxLine}>{couponNote}</p>}

              <ul className={styles.totalsList}>
                <li>
                  <span>Subtotal</span>
                  <strong>{inr.format(subtotal)}</strong>
                </li>
                <li>
                  <span>Shipping</span>
                  <strong>
                    {shippingCost === 0 ? "FREE" : inr.format(shippingCost)}
                  </strong>
                </li>
                {discount > 0 && (
                  <li>
                    <button
                      type="button"
                      className={styles.discountToggle}
                      onClick={() => setDiscountOpen((v) => !v)}
                    >
                      Discount{" "}
                      <span aria-hidden="true">
                        {discountOpen ? "▴" : "▾"}
                      </span>
                    </button>
                    <strong className={styles.discountAmount}>
                      &minus; {inr.format(discount)}
                    </strong>
                  </li>
                )}
              </ul>

              <div className={styles.grandTotalRow}>
                <span className={styles.grandTotalLabel}>Total</span>
                <span className={styles.grandTotalValue}>
                  {inr.format(total)}
                </span>
              </div>
              <p className={styles.taxLine}>(Inclusive of all taxes)</p>
            </section>

            {/* Trust card */}
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

            {/* Need help */}
            <section className={styles.helpCard}>
              <div className={styles.helpCopy}>
                <strong className={styles.helpTitle}>Need Help?</strong>
                <span className={styles.helpSub}>We&rsquo;re here for you!</span>
                <ul className={styles.helpList}>
                  <li>
                    <span className={styles.helpIcon} aria-hidden="true">
                      <FaWhatsapp />
                    </span>
                    <span className={styles.helpText}>
                      <strong>WhatsApp Us</strong>
                      <span>+91 9986988786</span>
                    </span>
                  </li>
                  <li>
                    <span className={styles.helpIcon} aria-hidden="true">
                      <FaEnvelope />
                    </span>
                    <span className={styles.helpText}>
                      <strong>Email Us</strong>
                      <span>official@decornart.in</span>
                    </span>
                  </li>
                  <li>
                    <span className={styles.helpIcon} aria-hidden="true">
                      <FaCommentDots />
                    </span>
                    <span className={styles.helpText}>
                      <strong>Chat With Us</strong>
                      <span>24/7 Customer Support</span>
                    </span>
                  </li>
                </ul>
              </div>
              <div className={styles.helpMedia} aria-hidden="true">
                <Image
                  src={helpImg}
                  alt=""
                  fill
                  sizes="160px"
                  className={styles.helpImg}
                />
              </div>
            </section>
          </aside>
        </div>

        {/* ─────────── Bottom trust strip ─────────── */}
        <section className={styles.section}>
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
