"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp, FaEnvelope, FaPhone, FaCommentDots } from "react-icons/fa";
import { useAuth } from "@/components/providers/AuthProvider";
import { listOrders } from "@/lib/api/orders";
import { resolveProductImage } from "@/lib/productImages";
import { hexForColor } from "@/lib/colorSwatches";
import heroImg from "@/assets/orderbg.png";
import helpImg from "@/assets/promobg.png";
import product1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import product2 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import product3 from "@/assets/pipecleaners.png";
import styles from "./TrackOrderView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const DEMO_ORDER = {
  id: "DNAR202405210123",
  placedOn: "21 May, 2024 · 11:35 AM",
  status: "In Transit",
  arriving: "Arriving by 27 May, 2024",
  currentStep: 3, // 0-indexed — 3 means "In Transit"
  courier: "Delivery",
  trackingId: "1498765326001",
  eta: "27 May, 2024",
  etaTime: "By 8:00 PM",
  address: {
    name: "Deepali V",
    line1: "12, 3rd Cross, 7th Main",
    line2: "HSR Layout, Sector 2",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560102",
  },
};

const STEPS = [
  {
    id: "placed",
    title: "Order Placed",
    date: "21 May, 2024",
    time: "11:35 AM",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7c0-2 1-4 3-4s3 2 3 4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "confirmed",
    title: "Confirmed",
    date: "21 May, 2024",
    time: "12:05 PM",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l3 3 5-6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "packed",
    title: "Packed",
    date: "22 May, 2024",
    time: "09:20 AM",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M4 8l8-4 8 4-8 4-8-4z" />
        <path d="M4 12l8 4 8-4M4 16l8 4 8-4" />
      </svg>
    ),
  },
  {
    id: "transit",
    title: "In Transit",
    date: "23 May, 2024",
    time: "08:15 AM",
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
    id: "out",
    title: "Out for Delivery",
    date: "-",
    time: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M3 6h13v10H3z" />
        <path d="M16 10h3l2 3v3h-5" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    id: "delivered",
    title: "Delivered",
    date: "-",
    time: "",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="4" y="8" width="16" height="12" rx="1" />
        <path d="M4 12h16M12 8V4M8 4h8" strokeLinecap="round" />
      </svg>
    ),
  },
];

const ORDER_ITEMS = [
  {
    id: "i1",
    name: "Butterfly Flower Gift Bag",
    variant: "Lavender",
    qty: 1,
    price: 499,
    image: product1,
  },
  {
    id: "i2",
    name: "Single Rose Cone Holder",
    variant: "Maroon",
    qty: 2,
    price: 199,
    image: product2,
  },
  {
    id: "i3",
    name: "Pipe Cleaners – 8mm (100 Strands in Each Bundle)",
    variant: "Rainbow",
    qty: 1,
    price: 299,
    image: product3,
  },
];

const FAQS = [
  {
    id: "how",
    q: "How can I track my order?",
    a: "Enter your Order ID or Tracking ID in the search bar above and hit Track Order. You'll see live status, courier details, and expected delivery — all on one page. We also email you every time the status changes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 22s-8-6-8-13a8 8 0 1 1 16 0c0 7-8 13-8 13z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    id: "long",
    q: "How long does delivery take?",
    a: "Most orders reach you within 4–7 business days across India. Metro cities usually deliver in 3–5 days. You'll see the exact estimated delivery date on your order status card once your order is packed.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    id: "avail",
    q: "What if I'm not available at the time of delivery?",
    a: "No worries — the courier will attempt delivery up to 3 times. You can also reschedule directly from the tracking page, or leave a safe-drop note. If we can't reach you, the parcel comes back to us and we'll get in touch.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
      </svg>
    ),
  },
  {
    id: "addr",
    q: "Can I change my address after placing the order?",
    a: "Yes — as long as your order hasn't been packed yet. Reach out to us on WhatsApp or email official@decornart.in with your Order ID and the new address, and we'll update it before dispatch.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M4 21V9l8-6 8 6v12" />
        <path d="M9 21v-7h6v7" strokeLinecap="round" />
      </svg>
    ),
  },
];

const BOTTOM_TRUST = [
  {
    id: "secure",
    title: "Secure Payments",
    copy: "100% safe & secure",
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
    id: "happy",
    title: "10,000+ Happy Customers",
    copy: "Trust and love us",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
      </svg>
    ),
  },
];

// Map backend order.status → index in STEPS. A cancelled order is a special
// state — we show it as "Cancelled" without progressing through the timeline.
const STATUS_TO_STEP = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  "out-for-delivery": 4,
  delivered: 5,
};

// Human-friendly status label for the chip. Falls back to Title Case.
function statusLabel(s) {
  if (!s) return "";
  if (s === "shipped") return "In Transit";
  if (s === "processing") return "Packed";
  if (s === "pending") return "Order Placed";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// "21 May, 2024 · 11:35 AM"
function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} · ${time}`;
}

function formatDateOnly(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimeOnly(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Rough ETA: placed date + 7 business-ish days. Falls back to placed + 7d
// when the admin hasn't provided courier ETA metadata yet.
function estimateEta(placedIso) {
  if (!placedIso) return null;
  const d = new Date(placedIso);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + 7);
  return d.toISOString();
}

export default function TrackOrderView() {
  const root = useRef(null);
  const { isAuthed, status: authStatus } = useAuth();
  const [query, setQuery] = useState("");
  const [copiedField, setCopiedField] = useState("");
  const [openFaq, setOpenFaq] = useState("how");

  const [orders, setOrders] = useState(null); // null while loading, [] once loaded
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");

  // Fetch the shopper's orders on mount / whenever auth resolves. Guests skip
  // the fetch entirely — the empty-state below will prompt them to sign in.
  useEffect(() => {
    if (authStatus === "loading") return;
    if (!isAuthed) {
      setOrders([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const rows = await listOrders({ limit: 50 });
        if (cancelled) return;
        const list = Array.isArray(rows) ? rows : rows?.items || [];
        setOrders(list);
        // Auto-select the most recent non-final order (in-transit takes
        // priority) so returning shoppers see live tracking on the first
        // page load without hunting for their most recent purchase.
        const pick =
          list.find((o) =>
            ["pending", "confirmed", "processing", "shipped"].includes(o.status)
          ) || list[0];
        setSelectedId(pick ? pick.id : null);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Could not load orders.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authStatus, isAuthed]);

  const selectedOrder = useMemo(() => {
    if (!Array.isArray(orders) || !selectedId) return null;
    return orders.find((o) => o.id === selectedId) || null;
  }, [orders, selectedId]);

  const currentStep = selectedOrder
    ? STATUS_TO_STEP[selectedOrder.status] ?? 0
    : -1;

  const totalAmount = selectedOrder
    ? selectedOrder.summary?.total || 0
    : ORDER_ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0);

  const toggleFaq = (id) => setOpenFaq((prev) => (prev === id ? null : id));

  const copyToClipboard = (value, field) => {
    if (!value) return;
    navigator.clipboard?.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 1500);
  };

  const handleTrack = () => {
    setError("");
    const q = query.trim();
    if (!q) return;
    if (!Array.isArray(orders) || orders.length === 0) {
      setError("Sign in to look up your orders.");
      return;
    }
    // Match by orderNumber (e.g. DN-20260101-ABC123) OR by tracking AWB —
    // whichever the shopper pasted from their confirmation email / SMS.
    const needle = q.toLowerCase();
    const hit = orders.find((o) => {
      const num = (o.orderNumber || "").toLowerCase();
      const awb = (o.tracking?.awb || "").toLowerCase();
      return num === needle || num.includes(needle) || (awb && awb === needle);
    });
    if (hit) {
      setSelectedId(hit.id);
    } else {
      setError("No order found for that ID.");
    }
  };

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero banner ─────────── */}
      <section className={styles.hero} aria-label="Track your order">
        <div className={styles.heroDeco} aria-hidden="true">
          <Image
            src={heroImg}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>Track Your Order</h1>
            <p className={styles.heroLead}>
              We&rsquo;re here to keep you updated every step of the way.
              <br />
              Track your order in real time and know exactly where
              <br />
              your happiness is. <span aria-hidden="true">&hearts;</span>
            </p>
          </div>

          {/* ─────────── Search card (inside hero) ─────────── */}
          <section className={styles.searchCard}>
            <h2 className={styles.searchTitle}>
              Enter your Order ID / Tracking ID
            </h2>
            <div className={styles.searchRow}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Enter your order ID or tracking number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="button"
                className={styles.searchBtn}
                onClick={handleTrack}
              >
                Track Order <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
            <p className={styles.searchHint}>
              You can find your Order ID in your order confirmation email.
            </p>
            {error && (
              <p role="alert" className={styles.searchError}>
                {error}
              </p>
            )}
          </section>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* Signed-in shoppers with more than one order can jump between them
            via a compact selector chip strip. Guests / single-order shoppers
            skip this row entirely so the page stays uncluttered. */}
        {isAuthed && Array.isArray(orders) && orders.length > 1 && (
          <section className={styles.orderSwitcher} aria-label="Your orders">
            <span className={styles.orderSwitcherLabel}>Recent orders</span>
            <div className={styles.orderSwitcherChips}>
              {orders.slice(0, 6).map((o) => {
                const active = o.id === selectedId;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(o.id);
                      setError("");
                    }}
                    className={`${styles.orderSwitcherChip} ${
                      active ? styles.orderSwitcherChipActive : ""
                    }`}
                    aria-pressed={active}
                  >
                    <span>{o.orderNumber}</span>
                    <span className={styles.orderSwitcherChipStatus}>
                      {statusLabel(o.status)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Unauthed shoppers: soft nudge instead of a broken layout. */}
        {authStatus !== "loading" && !isAuthed && (
          <section className={styles.emptyPanel} aria-label="Sign-in required">
            <h2>Sign in to see your orders</h2>
            <p>
              Track live status, courier updates and estimated delivery for every
              order you&rsquo;ve placed with Decor N Art.
            </p>
            <Link href="/account" className={styles.emptyCta}>
              Sign in
            </Link>
          </section>
        )}

        {/* Authed but the fetch hasn't returned yet. */}
        {isAuthed && orders === null && (
          <section className={styles.emptyPanel} aria-label="Loading">
            <h2>Loading your orders…</h2>
            <p>Just a moment while we pull the latest status.</p>
          </section>
        )}

        {/* Authed but no orders yet. */}
        {isAuthed && Array.isArray(orders) && orders.length === 0 && (
          <section className={styles.emptyPanel} aria-label="No orders">
            <h2>No orders yet</h2>
            <p>
              Once you place your first order, you&rsquo;ll be able to track it
              here in real time.
            </p>
            <Link href="/shop" className={styles.emptyCta}>
              Start shopping
            </Link>
          </section>
        )}

        {/* ─────────── Tracking layout ─────────── */}
        <div
          className={styles.layout}
          style={
            authStatus !== "loading" &&
            (!isAuthed ||
              (Array.isArray(orders) && orders.length === 0))
              ? { display: "none" }
              : undefined
          }
        >
          {/* LEFT: Order tracking + items */}
          <div className={styles.leftCol}>
            {/* Order tracking card */}
            <section className={styles.trackCard}>
              <header className={styles.trackHead}>
                <div>
                  <h2 className={styles.orderIdLine}>
                    Order ID:{" "}
                    <span className={styles.orderIdValue}>
                      {selectedOrder?.orderNumber || DEMO_ORDER.id}
                    </span>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() =>
                        copyToClipboard(
                          selectedOrder?.orderNumber || DEMO_ORDER.id,
                          "orderId"
                        )
                      }
                      aria-label="Copy order ID"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                        <rect x="7" y="7" width="12" height="12" rx="1" />
                        <path d="M5 15V5h10" />
                      </svg>
                      {copiedField === "orderId" && (
                        <span className={styles.copyFlash}>Copied</span>
                      )}
                    </button>
                  </h2>
                  <p className={styles.placedOn}>
                    Placed on:{" "}
                    {selectedOrder
                      ? formatDateTime(selectedOrder.createdAt)
                      : DEMO_ORDER.placedOn}
                  </p>
                </div>
                <div className={styles.statusChip}>
                  <span className={styles.statusIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                      <path d="M3 7h11v9H3z" />
                      <path d="M14 10h4l3 3v3h-7" />
                      <circle cx="7" cy="18" r="1.6" />
                      <circle cx="17" cy="18" r="1.6" />
                    </svg>
                  </span>
                  <span className={styles.statusText}>
                    <strong>
                      {selectedOrder
                        ? statusLabel(selectedOrder.status)
                        : DEMO_ORDER.status}
                    </strong>
                    <span>
                      {selectedOrder
                        ? selectedOrder.status === "delivered"
                          ? `Delivered on ${formatDateOnly(
                              selectedOrder.updatedAt || selectedOrder.createdAt
                            )}`
                          : selectedOrder.status === "cancelled"
                            ? "Order cancelled"
                            : `Arriving by ${formatDateOnly(
                                estimateEta(selectedOrder.createdAt)
                              )}`
                        : DEMO_ORDER.arriving}
                    </span>
                  </span>
                </div>
              </header>

              {/* Progress timeline */}
              <ol className={styles.timeline}>
                {STEPS.map((step, i) => {
                  // When we have a real selected order use its status; otherwise
                  // fall back to the demo default step so the layout stays alive.
                  const step0 = selectedOrder
                    ? currentStep
                    : DEMO_ORDER.currentStep;
                  const isCancelled = selectedOrder?.status === "cancelled";
                  const isDone = !isCancelled && i < step0;
                  const isCurrent = !isCancelled && i === step0;
                  const state = isDone
                    ? styles.stepDone
                    : isCurrent
                      ? styles.stepCurrent
                      : styles.stepPending;
                  // Show the placed timestamp on step 0 for real orders;
                  // otherwise keep the demo copy so unauthed shoppers still
                  // see a populated card.
                  const stampIso =
                    selectedOrder && i === 0
                      ? selectedOrder.createdAt
                      : selectedOrder && i === step0
                        ? selectedOrder.updatedAt
                        : null;
                  return (
                    <li key={step.id} className={`${styles.step} ${state}`}>
                      {i < STEPS.length - 1 && (
                        <span
                          className={`${styles.stepConnector} ${
                            isDone ? styles.stepConnectorDone : ""
                          }`}
                          aria-hidden="true"
                        />
                      )}
                      <span className={styles.stepIcon} aria-hidden="true">
                        {step.icon}
                      </span>
                      <span className={styles.stepTitle}>{step.title}</span>
                      <span className={styles.stepDate}>
                        {stampIso ? formatDateOnly(stampIso) : selectedOrder ? "—" : step.date}
                      </span>
                      {(stampIso || (!selectedOrder && step.time)) && (
                        <span className={styles.stepTime}>
                          {stampIso ? formatTimeOnly(stampIso) : step.time}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>

              {/* Cheerful note */}
              <div className={styles.noteCard}>
                <span className={styles.noteIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M4 8l8-4 8 4-8 4-8-4z" />
                    <path d="M4 12l8 4 8-4" />
                  </svg>
                </span>
                <span className={styles.noteText}>
                  <strong>Good things take time!</strong>
                  <span>
                    We&rsquo;ve shipped your order and it&rsquo;s on the way to you.
                  </span>
                </span>
                <span className={styles.noteIllus} aria-hidden="true">
                  <svg viewBox="0 0 60 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                    <rect x="4" y="8" width="24" height="14" rx="1" />
                    <path d="M28 12h6l4 4v6h-10" />
                    <circle cx="11" cy="24" r="2.4" />
                    <circle cx="35" cy="24" r="2.4" />
                    <path d="M42 14l4-2M46 18l4-1M42 22l4 1" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </section>

            {/* Order items */}
            <section className={styles.itemsCard}>
              {(() => {
                const items = selectedOrder ? selectedOrder.items || [] : ORDER_ITEMS;
                return (
                  <>
                    <header className={styles.itemsHead}>
                      <h2 className={styles.itemsTitle}>
                        Order Items ({items.length})
                      </h2>
                      <Link href="/account" className={styles.itemsLink}>
                        View Order Details
                      </Link>
                    </header>
                    <ul className={styles.itemsList}>
                      {items.map((it, i) => {
                        // Real order items don't have a bundled Next static
                        // image — resolveProductImage falls back to a slug-
                        // hashed asset so we always render something.
                        const src = selectedOrder
                          ? resolveProductImage({ slug: it.slug, image: it.image })
                          : it.image;
                        const qty = it.qty ?? 1;
                        const lineTotal = selectedOrder
                          ? it.lineTotal ?? (it.price ?? 0) * qty
                          : (it.price ?? 0) * qty;
                        return (
                          <li key={it.id || it.product || i} className={styles.item}>
                            <div className={styles.itemMedia}>
                              {src && (
                                <Image
                                  src={src}
                                  alt={it.name || ""}
                                  fill
                                  sizes="72px"
                                  className={styles.itemImg}
                                />
                              )}
                            </div>
                            <div className={styles.itemBody}>
                              <strong>{it.name}</strong>
                              {it.variant && !selectedOrder && <span>{it.variant}</span>}
                              {it.color && (
                                <span className={styles.itemColor}>
                                  <span
                                    className={styles.itemColorDot}
                                    style={{ background: hexForColor(it.color) }}
                                    aria-hidden="true"
                                  />
                                  Color: {it.color}
                                </span>
                              )}
                              <span>Qty: {qty}</span>
                            </div>
                            <span className={styles.itemPrice}>
                              {inr.format(lineTotal)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className={styles.itemsTotal}>
                      <span>Total</span>
                      <strong>{inr.format(totalAmount)}</strong>
                    </div>
                  </>
                );
              })()}
            </section>
          </div>

          {/* RIGHT: Delivery + Need Help */}
          <aside className={styles.rightCol}>
            {/* Delivery Details */}
            <section className={styles.deliveryCard}>
              {(() => {
                const addr = selectedOrder
                  ? selectedOrder.shippingAddress || {}
                  : DEMO_ORDER.address;
                const tracking = selectedOrder?.tracking || {};
                const courier = tracking.courier || (selectedOrder ? "Awaiting dispatch" : DEMO_ORDER.courier);
                const trackingId = tracking.awb || (selectedOrder ? "" : DEMO_ORDER.trackingId);
                const etaIso = selectedOrder
                  ? estimateEta(selectedOrder.createdAt)
                  : null;
                return (
                  <>
                    <header className={styles.deliveryHead}>
                      <h2 className={styles.deliveryTitle}>Delivery Details</h2>
                      <span className={styles.courierBadge}>
                        {selectedOrder
                          ? statusLabel(selectedOrder.status)
                          : "Delivery"}
                      </span>
                    </header>

                    <div className={styles.deliveryRow}>
                      <span className={styles.deliveryLabel}>Courier Partner</span>
                      <span className={styles.deliveryValue}>{courier}</span>
                    </div>

                    <div className={styles.deliveryRow}>
                      <span className={styles.deliveryLabel}>Tracking ID</span>
                      <span className={styles.deliveryValueWithCopy}>
                        {trackingId || (
                          <em className={styles.deliveryMuted}>
                            Available after dispatch
                          </em>
                        )}
                        {trackingId && (
                          <button
                            type="button"
                            className={styles.copyBtnSm}
                            onClick={() =>
                              copyToClipboard(trackingId, "trackingId")
                            }
                            aria-label="Copy tracking ID"
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                              <rect x="7" y="7" width="12" height="12" rx="1" />
                              <path d="M5 15V5h10" />
                            </svg>
                            {copiedField === "trackingId" && (
                              <span className={styles.copyFlash}>Copied</span>
                            )}
                          </button>
                        )}
                      </span>
                    </div>

                    <div className={styles.deliveryRow}>
                      <span className={styles.deliveryLabel}>Estimated Delivery</span>
                      <span className={styles.deliveryValueStack}>
                        <strong>
                          {selectedOrder
                            ? etaIso
                              ? formatDateOnly(etaIso)
                              : "—"
                            : DEMO_ORDER.eta}
                        </strong>
                        <span>{selectedOrder ? "By 8:00 PM" : DEMO_ORDER.etaTime}</span>
                      </span>
                    </div>

                    <div className={styles.deliveryRow}>
                      <span className={styles.deliveryLabel}>Delivery Address</span>
                      <span className={styles.deliveryAddress}>
                        {addr.name && <strong>{addr.name}</strong>}
                        {addr.line1 && <span>{addr.line1}</span>}
                        {addr.line2 && <span>{addr.line2}</span>}
                        <span>
                          {[addr.city, addr.state].filter(Boolean).join(", ")}
                          {addr.pincode ? ` – ${addr.pincode}` : ""}
                        </span>
                        {addr.phone && <span>📞 {addr.phone}</span>}
                      </span>
                    </div>

                    {tracking.url ? (
                      <a
                        href={tracking.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mapLink}
                      >
                        Open courier tracking{" "}
                        <span aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                            <path d="M14 4h6v6M20 4l-8 8M8 6H5v13h13v-3" />
                          </svg>
                        </span>
                      </a>
                    ) : (
                      <a href="#map" className={styles.mapLink}>
                        View on Map{" "}
                        <span aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                            <path d="M12 22s-8-6-8-13a8 8 0 1 1 16 0c0 7-8 13-8 13z" />
                            <circle cx="12" cy="9" r="2.5" />
                          </svg>
                        </span>
                      </a>
                    )}
                  </>
                );
              })()}
            </section>

            {/* Need Help */}
            <section className={styles.helpCard}>
              <div className={styles.helpMedia} aria-hidden="true">
                <Image
                  src={helpImg}
                  alt=""
                  fill
                  sizes="260px"
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
                      <span aria-hidden="true" className={styles.helpArrow}>&rsaquo;</span>
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
                      <span aria-hidden="true" className={styles.helpArrow}>&rsaquo;</span>
                    </a>
                  </li>
                  <li>
                    <a href="tel:+919876543210" className={styles.helpItemLink}>
                      <span className={styles.helpIcon} aria-hidden="true">
                        <FaPhone />
                      </span>
                      <span className={styles.helpText}>
                        <strong>Call Us</strong>
                        <span>+91 9986988786 (10 AM – 7 PM)</span>
                      </span>
                      <span aria-hidden="true" className={styles.helpArrow}>&rsaquo;</span>
                    </a>
                  </li>
                  <li>
                    <a href="#chat" className={styles.helpItemLink}>
                      <span className={styles.helpIcon} aria-hidden="true">
                        <FaCommentDots />
                      </span>
                      <span className={styles.helpText}>
                        <strong>Chat With Us</strong>
                        <span>24/7 Customer Support</span>
                      </span>
                      <span aria-hidden="true" className={styles.helpArrow}>&rsaquo;</span>
                    </a>
                  </li>
                </ul>
              </div>
            </section>
          </aside>
        </div>

        {/* ─────────── 4. FAQs ─────────── */}
        <section className={styles.faqSection}>
          <div className={styles.faqHead}>
            <span className={styles.faqOrn} aria-hidden="true">&#10087;</span>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            <span className={styles.faqOrn} aria-hidden="true">&#10087;</span>
          </div>
          <ul className={styles.faqGrid}>
            {FAQS.map((f) => {
              const isOpen = openFaq === f.id;
              return (
                <li
                  key={f.id}
                  className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.faqBtn}
                    onClick={() => toggleFaq(f.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${f.id}`}
                  >
                    <span className={styles.faqIcon} aria-hidden="true">
                      {f.icon}
                    </span>
                    <span className={styles.faqQ}>{f.q}</span>
                    <span
                      className={`${styles.faqChev} ${isOpen ? styles.faqChevOpen : ""}`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-panel-${f.id}`}
                      className={styles.faqA}
                      role="region"
                    >
                      {f.a}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ─────────── 5. Continue shopping CTA ─────────── */}
        <section className={styles.ctaBanner}>
          <span className={styles.ctaIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
              <rect x="4" y="10" width="16" height="10" rx="1" />
              <path d="M2 6h20v4H2z" />
              <path d="M12 6v14" strokeLinecap="round" />
              <path d="M8 6c-1-2 0-4 2-4s3 2 2 4M16 6c1-2 0-4-2-4s-3 2-2 4" />
            </svg>
          </span>
          <div className={styles.ctaCopy}>
            <strong>
              Handcrafted with love, packed with care{" "}
              <span aria-hidden="true" className={styles.ctaHeart}>
                &hearts;
              </span>
            </strong>
            <span>Thank you for supporting.</span>
          </div>
          <a href="/shop" className={styles.ctaBtn}>
            Continue Shopping <span aria-hidden="true">&rarr;</span>
          </a>
        </section>

        {/* ─────────── 6. Bottom trust strip ─────────── */}
        <section className={styles.bottomTrust}>
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
