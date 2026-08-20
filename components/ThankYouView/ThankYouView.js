"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import {
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiHome,
  FiArrowRight,
  FiShield,
  FiRotateCcw,
} from "react-icons/fi";
import { useCart } from "@/components/providers/CartProvider";
import { resolveProductImage } from "@/lib/productImages";
import { hexForColor } from "@/lib/colorSwatches";
import heroImg from "@/assets/congratulations.png";
import { useBannerContent } from "@/hooks/useBannerContent";
import styles from "./ThankYouView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const STAGES = [
  { id: "confirmed", label: "Order confirmed", copy: "We've received your order.", icon: <FiCheckCircle /> },
  { id: "packing", label: "Preparing your box", copy: "The atelier is composing it.", icon: <FiClock /> },
  { id: "dispatched", label: "Dispatched", copy: "Handed to the courier.", icon: <FiPackage /> },
  { id: "delivering", label: "Out for delivery", copy: "Almost at your door.", icon: <FiTruck /> },
  { id: "delivered", label: "Delivered", copy: "Enjoy your beautiful piece.", icon: <FiHome /> },
];

const TRUST = [
  { id: "secure", label: "Secure Payments", icon: <FiShield /> },
  { id: "returns", label: "Damage Protection", icon: <FiRotateCcw /> },
  { id: "beautiful", label: "Curated with Love", icon: <FaHeart /> },
];

function makeOrderNumber() {
  const now = new Date();
  const stamp =
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `A${stamp}-${rand}`;
}

export default function ThankYouView() {
  const root = useRef(null);
  const heroBanner = useBannerContent("thank-you-hero");
  const heroSrc = heroBanner.loaded ? heroBanner.image || heroImg : null;
  const params = useSearchParams();
  const { cart, refresh: refreshCart } = useCart();

  const paramOrder = params.get("order");
  const orderNumber = useMemo(
    () => paramOrder || makeOrderNumber(),
    [paramOrder]
  );

  const totalParam = Number(params.get("total"));
  const method = params.get("method") || "";
  const eta = params.get("eta") || "Tomorrow";

  const items = cart?.items || [];
  const summary = cart?.summary || {};
  const cartSubtotal = summary.subtotal ?? 0;
  const total =
    Number.isFinite(totalParam) && totalParam > 0
      ? totalParam
      : summary.total ?? cartSubtotal;

  const activeStage = 0;

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const displayItems = items.length ? items : [];

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Order confirmed">
        <div className={styles.heroDeco} aria-hidden="true">
          {heroSrc && (
            <Image
              src={heroSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.heroImg}
            />
          )}
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.heroBadge}>
              <FiCheckCircle aria-hidden="true" />
              Order {orderNumber}
            </span>
            <h1 className={styles.heroTitle}>
              {heroBanner.text(
                "title",
                <>
                  Thank <em>you</em>{" "}
                  <span aria-hidden="true" className={styles.heroHeart}>
                    <FaHeart />
                  </span>
                </>
              )}
            </h1>
            <p className={styles.heroLead}>
              {heroBanner.text(
                "subtitle",
                "Your order is confirmed. We'll email you tracking details as soon as it ships."
              )}
            </p>
            <div className={styles.heroActions}>
              {heroBanner.loaded && (
                <Link
                  href={heroBanner.href || "/shop"}
                  className={styles.primaryBtn}
                >
                  {heroBanner.ctaLabel || "Continue shopping"} <FiArrowRight />
                </Link>
              )}
              <Link href="/account" className={styles.ghostBtn}>
                View your orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Summary + Tracker ─────────── */}
        <section className={styles.mainRow}>
          {/* LEFT — Order summary */}
          <article className={styles.summaryCard}>
            <header className={styles.cardHead}>
              <h2 className={styles.cardTitle}>
                Order Summary{" "}
                <span aria-hidden="true" className={styles.titleHeart}>
                  <FaHeart />
                </span>
              </h2>
              <span className={styles.cardCount}>
                {displayItems.length}{" "}
                {displayItems.length === 1 ? "item" : "items"}
              </span>
            </header>

            {displayItems.length > 0 ? (
              <ul className={styles.itemsList}>
                {displayItems.map((it) => {
                  const productId = it.productId ?? it.id;
                  const qty = it.qty ?? 1;
                  const price = it.price ?? 0;
                  const color = it.color || null;
                  const key = `${productId}:${it.variantId ?? "base"}:${
                    color ?? "nocolor"
                  }`;
                  return (
                    <li key={key} className={styles.itemRow}>
                      <div className={styles.itemMedia}>
                        <Image
                          src={resolveProductImage(it)}
                          alt={it.name || "Product"}
                          fill
                          sizes="64px"
                          className={styles.itemImg}
                        />
                      </div>
                      <div className={styles.itemBody}>
                        <strong className={styles.itemName}>{it.name}</strong>
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
                        <span className={styles.itemQty}>
                          Qty {qty} · {inr.format(price)} each
                        </span>
                      </div>
                      <strong className={styles.itemTotal}>
                        {inr.format(price * qty)}
                      </strong>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className={styles.itemsEmpty}>
                Your cart is being cleared — your order is safe with us.
              </p>
            )}

            <hr className={styles.cardRule} />

            <dl className={styles.details}>
              <div className={styles.detailRow}>
                <dt>Total paid</dt>
                <dd className={styles.totalValue}>{inr.format(total || 0)}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Delivery ETA</dt>
                <dd>{eta}</dd>
              </div>
              {method && (
                <div className={styles.detailRow}>
                  <dt>Payment</dt>
                  <dd className={styles.methodPill}>{method.toUpperCase()}</dd>
                </div>
              )}
            </dl>

            <ul className={styles.trustRow} aria-label="Trust">
              {TRUST.map((t) => (
                <li key={t.id}>
                  <span aria-hidden="true">{t.icon}</span> {t.label}
                </li>
              ))}
            </ul>
          </article>

          {/* RIGHT — What's next */}
          <aside className={styles.trackerCard}>
            <header className={styles.trackerHead}>
              <h2 className={styles.trackerTitle}>What&rsquo;s Next</h2>
              <p className={styles.trackerLead}>
                We&rsquo;ll ping you on WhatsApp at every step.
              </p>
            </header>
            <ol className={styles.tracker}>
              {STAGES.map((stage, i) => {
                const state =
                  i < activeStage
                    ? "done"
                    : i === activeStage
                    ? "current"
                    : "pending";
                return (
                  <li
                    key={stage.id}
                    className={`${styles.stage} ${styles[`stage-${state}`]}`}
                  >
                    <span className={styles.stageDot} aria-hidden="true">
                      {stage.icon}
                    </span>
                    <div className={styles.stageBody}>
                      <strong>{stage.label}</strong>
                      <span>{stage.copy}</span>
                    </div>
                    {i < STAGES.length - 1 && (
                      <span className={styles.stageLine} aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ol>
            <Link href="/order" className={styles.trackBtn}>
              Track this order <FiArrowRight />
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}
