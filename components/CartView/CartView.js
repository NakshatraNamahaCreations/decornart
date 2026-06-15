"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import { resolveProductImage } from "@/lib/productImages";
import styles from "./CartView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function CartView() {
  const root = useRef(null);
  const { cart, loading, updateItem, removeItem, applyPromo } = useCart();
  const [promo, setPromo] = useState("");
  const [promoError, setPromoError] = useState("");

  const items = cart.items || [];
  const summary = cart.summary || {};

  const subtotal = summary.subtotal ?? 0;
  const gst = summary.gst ?? 0;
  const shipping = summary.shipping ?? 0;
  const discount = summary.discount ?? 0;
  const total = summary.total ?? 0;
  const toFreeShipping = summary.toFreeShipping ?? 0;
  const freeShippingOver = summary.freeShippingOver || 2500;
  const freeShipPct = Math.min(100, (subtotal / freeShippingOver) * 100);

  const setQty = (productId, qty) => {
    updateItem(productId, Math.max(0, qty)).catch(() => {});
  };

  const remove = (productId) => {
    removeItem(productId).catch(() => {});
  };

  const handlePromo = async (e) => {
    e.preventDefault();
    setPromoError("");
    try {
      await applyPromo(promo.trim().toUpperCase());
    } catch (err) {
      setPromoError(err.message || "Invalid promo code");
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
      gsap.from(`.${styles.row}, .${styles.summary}`, {
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.4,
      });
    },
    { scope: root, dependencies: [items.length] }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <span className={styles.eyebrow}>— Your selection</span>
            <h1 className={styles.heading}>
              The <em>basket</em>.
            </h1>
            <p className={styles.lead}>
              Composed by hand and shipped the same morning across Mumbai,
              Bengaluru, Delhi and Pune.
            </p>
          </div>

          {items.length > 0 && (
            <div className={styles.headRight}>
              <div className={styles.count}>
                <span className={styles.countNum}>
                  {String(items.length).padStart(2, "0")}
                </span>
                <span className={styles.countLabel}>
                  {items.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              <div className={styles.count}>
                <span className={styles.countNum}>
                  {String(items.reduce((s, p) => s + p.qty, 0)).padStart(2, "0")}
                </span>
                <span className={styles.countLabel}>Stems in all</span>
              </div>
            </div>
          )}
        </div>

        {loading && items.length === 0 ? (
          <div style={{ padding: "3rem 0", opacity: 0.6 }}>Loading…</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyMark} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M5 7h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 7zM9 7V5a3 3 0 0 1 6 0v2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className={styles.emptyHeading}>
              Your basket is <em>still empty</em>.
            </h2>
            <p className={styles.emptyCopy}>
              When you find a bouquet you'd like delivered, add it here —
              we'll keep it tied and ready until checkout.
            </p>
            <div className={styles.emptyActions}>
              <a href="/shop" className={styles.cta}>
                Browse the shop <span aria-hidden="true">→</span>
              </a>
              <a href="/wishlist" className={styles.ghost}>
                See your wishlist
              </a>
            </div>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.itemsCol}>
              <div className={styles.shipMeter}>
                {toFreeShipping > 0 ? (
                  <span className={styles.shipText}>
                    Add <strong>{inr.format(toFreeShipping)}</strong> more for
                    complimentary delivery.
                  </span>
                ) : (
                  <span className={styles.shipText}>
                    <strong>Complimentary delivery</strong> applied to this
                    order.
                  </span>
                )}
                <span className={styles.shipBar} aria-hidden="true">
                  <span
                    className={styles.shipFill}
                    style={{ width: `${freeShipPct}%` }}
                  />
                </span>
              </div>

              <ul className={styles.items}>
                {items.map((p) => (
                  <li key={p.productId} className={styles.row}>
                    <a href={`/product/${p.slug}`} className={styles.thumb}>
                      <Image
                        src={resolveProductImage(p)}
                        alt={p.name}
                        fill
                        sizes="(max-width: 760px) 28vw, 140px"
                      />
                    </a>

                    <div className={styles.info}>
                      <h3 className={styles.name}>
                        <a href={`/product/${p.slug}`}>{p.name}</a>
                      </h3>
                      <span className={styles.occasion}>{p.category}</span>
                      <span className={styles.edition}>
                        Edition of one · Hand-tied
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(p.productId)}
                        className={styles.removeText}
                      >
                        Remove
                      </button>
                    </div>

                    <div className={styles.qtyWrap}>
                      <span className={styles.qtyLabel}>Qty</span>
                      <div className={styles.qty}>
                        <button
                          type="button"
                          onClick={() => setQty(p.productId, p.qty - 1)}
                          aria-label={`Decrease quantity of ${p.name}`}
                          className={styles.qtyBtn}
                        >
                          –
                        </button>
                        <span className={styles.qtyValue}>{p.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(p.productId, p.qty + 1)}
                          aria-label={`Increase quantity of ${p.name}`}
                          className={styles.qtyBtn}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className={styles.priceWrap}>
                      <span className={styles.priceLine}>
                        {inr.format(p.lineTotal ?? p.price * p.qty)}
                      </span>
                      {p.qty > 1 && (
                        <span className={styles.priceEach}>
                          {inr.format(p.price)} each
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <a href="/shop" className={styles.continue}>
                ← Continue shopping
              </a>
            </div>

            <aside className={styles.summaryCol}>
              <div className={styles.summary}>
                <span className={styles.summaryEyebrow}>— Order summary</span>
                <h2 className={styles.summaryHeading}>The total.</h2>
                <span className={styles.summaryRule} aria-hidden="true" />

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
                    <dt>Shipping</dt>
                    <dd>
                      {shipping === 0 ? (
                        <span className={styles.free}>Free</span>
                      ) : (
                        inr.format(shipping)
                      )}
                    </dd>
                  </div>
                  {discount > 0 && (
                    <div className={`${styles.line} ${styles.lineDiscount}`}>
                      <dt>Promo · {cart.promoCode}</dt>
                      <dd>− {inr.format(discount)}</dd>
                    </div>
                  )}
                </dl>

                <form className={styles.promo} onSubmit={handlePromo}>
                  <label className={styles.promoLabel} htmlFor="promo">
                    Promo code
                  </label>
                  <div className={styles.promoRow}>
                    <input
                      id="promo"
                      type="text"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Try ATELIER10"
                      className={styles.promoInput}
                    />
                    <button type="submit" className={styles.promoApply}>
                      Apply
                    </button>
                  </div>
                  {cart.promoCode && (
                    <span className={styles.promoNote}>
                      ✓ {cart.promoCode} applied.
                    </span>
                  )}
                  {promoError && (
                    <span className={styles.promoNote} style={{ color: "#b00" }}>
                      {promoError}
                    </span>
                  )}
                </form>

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalValue}>
                    {inr.format(total)}
                  </span>
                </div>

                <a href="/checkout" className={styles.checkout}>
                  Continue to checkout <span aria-hidden="true">→</span>
                </a>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
