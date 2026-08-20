"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaWhatsapp, FaHeart } from "react-icons/fa";
import {
  FiShield,
  FiRotateCcw,
  FiGift,
  FiArrowRight,
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiAward,
  FiTruck,
  FiUsers,
  FiTag,
  FiShoppingCart,
} from "react-icons/fi";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLoginModal } from "@/components/LoginModal/LoginModalContext";
import { listPublicCoupons } from "@/lib/api/coupons";
import { listProducts } from "@/lib/api/products";
import { resolveProductImage } from "@/lib/productImages";
import { hexForColor } from "@/lib/colorSwatches";
import heroImg from "@/assets/orderbg.png";
import testiImg from "@/assets/vase.png";
import visaImg from "@/assets/payment/visa.jpg";
import mastercardImg from "@/assets/payment/mastercard.jpg";
import upiImg from "@/assets/payment/upi.jpg";
import paytmImg from "@/assets/payment/paytm.jpg";
import rupayImg from "@/assets/payment/rupay.jpg";
import rec1 from "@/assets/butterfly-luxury/luxury1.jpeg";
import rec2 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import rec3 from "@/assets/luxe-rose/luxe-rose1.jpeg";
import rec4 from "@/assets/butterfly-signature/signature1.jpeg";
import rec5 from "@/assets/for-mother-gift/for-mother1.jpeg";
import rec6 from "@/assets/luxe-dual/luxe-dual1.jpeg";
import styles from "./CartView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const HERO_TRUST = [
  { id: "secure", title: "Secure Checkout", copy: "100% safe & secure", icon: <FiShield /> },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: <FiRotateCcw /> },
  { id: "beautiful", title: "Curated with Love", copy: "Crafted with passion", icon: <FaHeart /> },
  { id: "quality", title: "Premium Quality", copy: "Handpicked materials", icon: <FiAward /> },
];

const CART_TRUST = [
  { id: "safe", title: "Safe & Secure", copy: "Trusted payments", icon: <FiShield /> },
  { id: "hand", title: "Easy Replacement", copy: "For transit-damaged items", icon: <FiRotateCcw /> },
  { id: "quality", title: "Premium Quality", copy: "You'll love it", icon: <FiAward /> },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: <FiRotateCcw /> },
];

const RECOMMENDED = [
  { id: "r1", name: "Bouquet Basket", price: 1299, image: rec1 },
  { id: "r2", name: "Satin Ribbon Roll", price: 149, image: rec2 },
  { id: "r3", name: "LED Flower Gift Box", price: 899, image: rec3 },
  { id: "r4", name: "Crochet Starter Kit", price: 599, image: rec4 },
  { id: "r5", name: "Gift Card", price: 129, image: rec5 },
  { id: "r6", name: "Daisy Keychain", price: 199, image: rec6 },
];

const BOTTOM_TRUST = [
  { id: "free", title: "Free Shipping", copy: "On orders above ₹2500", icon: <FiTruck /> },
  { id: "secure", title: "Secure Payments", copy: "100% safe & secure", icon: <FiShield /> },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: <FiRotateCcw /> },
  { id: "happy", title: "10,000+ Happy Customers", copy: "Thank you for trusting us", icon: <FiUsers /> },
];

const SHIPPING_STRIP = [
  { id: "std", title: "Standard Shipping", copy: "₹99 flat · 3–5 business days", icon: <FiTruck /> },
  { id: "free", title: "Free Shipping", copy: "On orders above ₹2500", icon: <FiGift /> },
  { id: "express", title: "Express Delivery", copy: "1–2 business days", icon: <FiArrowRight /> },
  { id: "sameday", title: "Same Day Delivery", copy: "Available in select cities", icon: <FiCheckCircle /> },
];

const RECOMMENDED_VISIBLE = 5;

// Payment method logos rendered under the "We Accept" strip on the
// cart + checkout pages. Kept in sync with the footer's PAYMENTS array.
const PAYMENT_LOGOS = [
  { id: "visa", label: "Visa", image: visaImg },
  { id: "mastercard", label: "Mastercard", image: mastercardImg },
  { id: "upi", label: "UPI", image: upiImg },
  { id: "paytm", label: "Paytm", image: paytmImg },
  { id: "rupay", label: "RuPay", image: rupayImg },
];

export default function CartView() {
  const root = useRef(null);
  const router = useRouter();
  const {
    cart,
    loading,
    updateItem,
    removeItem: removeCartItem,
    addItem: addCartItem,
  } = useCart();
  const { isAuthed } = useAuth();
  const { openLogin } = useLoginModal();
  const [promoNote, setPromoNote] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState("");
  const [recStart, setRecStart] = useState(0);
  // Real products for "You may also love" — fetched from the backend so the
  // add-to-cart button below has a real productId to send. Falls back to
  // the hardcoded RECOMMENDED array if the fetch fails.
  const [recProducts, setRecProducts] = useState([]);
  const [addingId, setAddingId] = useState("");

  useEffect(() => {
    let cancelled = false;
    listPublicCoupons()
      .then((rows) => {
        if (!cancelled) setAvailableCoupons(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (!cancelled) setAvailableCoupons([]);
      });
    // Fetch bestsellers for the "You may also love" strip. Backend filter
    // `bestseller=true` narrows to Product.isBestseller. Envelope response
    // shape is { items, meta }; guard for both shapes.
    listProducts({ limit: 8, status: "active", bestseller: true })
      .then((res) => {
        const rows = Array.isArray(res) ? res : res?.items || [];
        if (!cancelled) setRecProducts(rows);
      })
      .catch(() => {
        if (!cancelled) setRecProducts([]);
      });
    return () => {
      cancelled = true;
    };
    // Re-run when auth flips so a shopper who signs in from the cart page sees
    // the coupon list refreshed without a full page reload.
  }, [isAuthed]);

  const items = cart?.items || [];
  const summary = cart?.summary || {};
  const subtotal = summary.subtotal ?? 0;
  // Cart never applies a coupon — that happens at checkout. Ignore any
  // persisted server-side discount so the cart total stays pre-discount.
  const discount = 0;
  // Shipping hidden on the cart for now — recomputed & shown at checkout.
  // const shipping = summary.shipping ?? 0;
  const total = Math.max(0, subtotal);
  const freeShippingOver = summary.freeShippingOver || 2500;
  const toGift = summary.toFreeShipping ?? Math.max(0, freeShippingOver - subtotal);
  const giftPct = Math.min(100, (subtotal / freeShippingOver) * 100);
  const itemQty = items.reduce((s, i) => s + (i.qty || 0), 0);

  const setQty = (productId, next, variantId = null, color = null) => {
    if (next <= 0) {
      return removeCartItem(productId, variantId, color).catch((err) => {
        setPromoNote(err?.message || "Could not update your cart.");
      });
    }
    updateItem(productId, Math.max(1, next), variantId, color).catch((err) => {
      setPromoNote(err?.message || "Could not update your cart.");
    });
  };

  const handleRemove = (productId, variantId = null, color = null) => {
    removeCartItem(productId, variantId, color).catch((err) => {
      setPromoNote(err?.message || "Could not remove that item.");
    });
  };

  const handleCheckout = (e) => {
    if (!isAuthed) {
      e.preventDefault();
      window.alert("Not logged in — please log in to continue.");
      openLogin();
      return;
    }
    // Router push instead of relying on the anchor so behaviour is uniform
    // whether the guard fires or not.
    e.preventDefault();
    router.push("/checkout");
  };

  const handleAddRecommended = async (product) => {
    if (!product?.id || !product.real) return;
    setAddingId(product.id);
    try {
      await addCartItem(product.id, 1);
      // Use the same event the Shop page dispatches so the Navbar's cart
      // toast (with thumbnail + name + price) fires — keeps every "added
      // to cart" affordance consistent across the site.
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cart:item-added", {
            detail: {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              qty: 1,
            },
          })
        );
      }
    } catch {
      /* silently ignore — Navbar toast only fires on success */
    } finally {
      setAddingId("");
    }
  };

  const copyCoupon = async (code) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode((c) => (c === code ? "" : c));
      }, 2000);
    } catch {
      /* clipboard blocked — still flash "Copied" so user has feedback */
      setCopiedCode(code);
    }
  };

  const describeCoupon = (c) => {
    const off =
      c.discountType === "percentage"
        ? `${c.discountValue}% OFF${c.maxDiscount ? ` up to ${inr.format(c.maxDiscount)}` : ""}`
        : `${inr.format(c.discountValue)} OFF`;
    const min = c.minOrderValue
      ? ` on orders above ${inr.format(c.minOrderValue)}`
      : "";
    return `${off}${min}`;
  };

  // Use real products when we have them; keep the hardcoded RECOMMENDED as
  // a visual fallback so the strip never renders empty on API failure.
  const recSource = recProducts.length
    ? recProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: resolveProductImage(p),
        real: true,
      }))
    : RECOMMENDED.map((r) => ({ ...r, real: false }));

  const recRotate = (dir) => {
    const max = recSource.length - RECOMMENDED_VISIBLE;
    setRecStart((s) => Math.max(0, Math.min(max, s + dir)));
  };
  const recSlice = recSource.slice(recStart, recStart + RECOMMENDED_VISIBLE);
  const canPrev = recStart > 0;
  const canNext = recStart + RECOMMENDED_VISIBLE < recSource.length;

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Your cart">
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
            <h1 className={styles.heroTitle}>
              Your Cart{" "}
              <span aria-hidden="true" className={styles.heroHeart}>
                <FaHeart />
              </span>
            </h1>
            <p className={styles.heroLead}>
              Beautiful things crafted with love,
              <br />
              chosen just for you.
            </p>
            <ul className={styles.heroTrust}>
              {HERO_TRUST.map((t) => (
                <li key={t.id} className={styles.heroTrustItem}>
                  <span className={styles.heroTrustIcon} aria-hidden="true">
                    {t.icon}
                  </span>
                  <span className={styles.heroTrustText}>
                    <strong>{t.title}</strong>
                    <span>{t.copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 3. Cart + Summary ─────────── */}
        <section className={styles.mainRow}>
          {/* LEFT: cart table */}
          <div className={styles.cartCol}>
            <div className={styles.cartCard}>
              <div className={styles.cartHead}>
                <span>PRODUCT</span>
                <span>PRICE</span>
                <span>QUANTITY</span>
                <span>TOTAL</span>
                <span />
              </div>

              {loading && items.length === 0 && (
                <div className={styles.empty}>
                  <FiShoppingCart size={28} />
                  <strong>Loading your cart…</strong>
                </div>
              )}

              {!loading && items.length === 0 && (
                <div className={styles.empty}>
                  <FiShoppingCart size={28} />
                  <strong>Your cart is empty</strong>
                  <span>Add a few of our favourites to get started.</span>
                  <Link href="/shop" className={styles.emptyBtn}>
                    Continue shopping <FiArrowRight />
                  </Link>
                </div>
              )}

              {items.map((it) => {
                const productId = it.productId ?? it.id;
                const variantId = it.variantId ?? null;
                const color = it.color ?? null;
                const unitPrice = it.price ?? 0;
                const qty = it.qty ?? 1;
                const href = it.slug ? `/product/${it.slug}` : "/shop";
                const detail =
                  it.variantName || it.variant || it.size || it.pack || null;
                const tag = it.category || it.tag || it.badge || null;
                return (
                  <article
                    key={`${productId}:${variantId ?? "base"}:${color ?? "nocolor"}`}
                    className={styles.item}
                  >
                    <div className={styles.itemProduct}>
                      <Link href={href} className={styles.itemMedia}>
                        <Image
                          src={resolveProductImage(it)}
                          alt={it.name || "Product"}
                          fill
                          sizes="90px"
                          className={styles.itemImg}
                        />
                      </Link>
                      <div className={styles.itemInfo}>
                        <strong className={styles.itemName}>
                          <Link href={href}>{it.name}</Link>
                        </strong>
                        {detail && (
                          <span className={styles.itemDetail}>{detail}</span>
                        )}
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
                        {tag && <span className={styles.itemTag}>{tag}</span>}
                      </div>
                    </div>
                    <span className={styles.itemPrice}>
                      {inr.format(unitPrice)}
                    </span>
                    <div className={styles.qtyBox}>
                      <button
                        type="button"
                        onClick={() => setQty(productId, qty - 1, variantId, color)}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>
                      <span>{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(productId, qty + 1, variantId, color)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <strong className={styles.itemTotal}>
                      {inr.format(unitPrice * qty)}
                    </strong>
                    <button
                      type="button"
                      className={styles.itemRemove}
                      onClick={() => handleRemove(productId, variantId, color)}
                      aria-label={`Remove ${it.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </article>
                );
              })}

              {/* Available coupons */}
              {availableCoupons.length > 0 && (
                <div className={styles.couponsBlock}>
                  <div className={styles.couponsHead}>
                    <span className={styles.promoIcon} aria-hidden="true">
                      <FiTag />
                    </span>
                    <div className={styles.promoCopy}>
                      <strong>Available coupons</strong>
                      <span>Use these codes at checkout for extra savings</span>
                    </div>
                  </div>
                  <ul className={styles.couponsList}>
                    {availableCoupons.map((c) => (
                      <li key={c.code} className={styles.couponCard}>
                        <div className={styles.couponInfo}>
                          <strong className={styles.couponCode}>{c.code}</strong>
                          <span className={styles.couponOffer}>{describeCoupon(c)}</span>
                          {c.description && (
                            <span className={styles.couponDesc}>{c.description}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className={styles.couponBtn}
                          onClick={() => copyCoupon(c.code)}
                        >
                          {copiedCode === c.code ? "Copied" : "Copy code"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {promoNote && <p className={styles.promoNote}>{promoNote}</p>}
            </div>

            {/* Cart trust strip */}
            <ul className={styles.cartTrust}>
              {CART_TRUST.map((t) => (
                <li key={t.id} className={styles.cartTrustItem}>
                  <span className={styles.cartTrustIcon} aria-hidden="true">
                    {t.icon}
                  </span>
                  <span className={styles.cartTrustText}>
                    <strong>{t.title}</strong>
                    <span>{t.copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: order summary */}
          <aside className={styles.summaryCol}>
            <section className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryRow}>
                <span>Subtotal ({itemQty} {itemQty === 1 ? "item" : "items"})</span>
                <span>{inr.format(subtotal)}</span>
              </div>
              {/* Shipping row hidden for now — charge is computed at checkout.
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className={styles.freeShip}>
                    <em>FREE</em>
                  </span>
                ) : (
                  <span>{inr.format(shipping)}</span>
                )}
              </div>
              */}
              {discount > 0 && (
                <>
                  <div className={styles.summaryRow}>
                    <span>Discount</span>
                    <span className={styles.discount}>
                      &minus; {inr.format(discount)}
                    </span>
                  </div>
                  <div className={styles.savedRow}>
                    <span>You Saved</span>
                    <strong>{inr.format(discount)}</strong>
                  </div>
                </>
              )}

              <hr className={styles.summaryRule} />

              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>{inr.format(total)}</strong>
              </div>
              <span className={styles.taxNote}>(Inclusive of all taxes)</span>

              <Link
                href="/checkout"
                className={styles.checkoutBtn}
                onClick={handleCheckout}
              >
                Proceed to Checkout <FiArrowRight />
              </Link>
              <a
                href="https://wa.me/919876543210"
                className={styles.waBtn}
              >
                <FaWhatsapp /> Buy with WhatsApp
              </a>

              {/* Free-shipping progress — compact version of the giftBar
                  at the top, kept in sight beside the checkout CTA so
                  shoppers can top up without scrolling back. */}
              <div
                className={styles.summaryGift}
                aria-label="Free shipping progress"
              >
                <span className={styles.summaryGiftIcon} aria-hidden="true">
                  <FiGift />
                </span>
                <div className={styles.summaryGiftBody}>
                  <strong>
                    {toGift > 0
                      ? `${inr.format(toGift)} away from FREE SHIPPING`
                      : "You've unlocked FREE SHIPPING!"}
                  </strong>
                  <span className={styles.summaryGiftTrack}>
                    <span
                      className={styles.summaryGiftFill}
                      style={{ width: `${giftPct}%` }}
                      aria-hidden="true"
                    />
                  </span>
                  <span className={styles.summaryGiftMeta}>
                    {inr.format(subtotal)} / {inr.format(freeShippingOver)}
                  </span>
                </div>
              </div>

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
                  <li className={`${styles.payChip} ${styles.payMore}`}>
                    &amp; more
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.testiCard}>
              <span className={styles.testiIcon} aria-hidden="true">
                <FaHeart />
              </span>
              <div className={styles.testiBody}>
                <strong>Every order makes a difference</strong>
                <span>
                  Thank you for supporting our &amp; small business.
                </span>
              </div>
              <div className={styles.testiMedia} aria-hidden="true">
                <Image
                  src={testiImg}
                  alt=""
                  fill
                  sizes="90px"
                  className={styles.testiImg}
                />
              </div>
            </section>
          </aside>
        </section>

        {/* ─────────── 3b. Shipping strip ─────────── */}
        <section className={styles.shippingStrip} aria-label="Shipping options">
          <ul className={styles.shippingStripList}>
            {SHIPPING_STRIP.map((s) => (
              <li key={s.id} className={styles.shippingStripItem}>
                <span className={styles.shippingStripIcon} aria-hidden="true">
                  {s.icon}
                </span>
                <span className={styles.shippingStripText}>
                  <strong>{s.title}</strong>
                  <span>{s.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 4. You may also love ─────────── */}
        <section className={styles.recSection}>
          <header className={styles.recHead}>
            <h2 className={styles.recTitle}>
              You May Also Love{" "}
              <span aria-hidden="true" className={styles.recHeart}>
                <FaHeart />
              </span>
            </h2>
            <div className={styles.recNav}>
              <button
                type="button"
                onClick={() => recRotate(-1)}
                disabled={!canPrev}
                aria-label="Previous"
              >
                <FiArrowLeft />
              </button>
              <button
                type="button"
                onClick={() => recRotate(1)}
                disabled={!canNext}
                aria-label="Next"
              >
                <FiArrowRight />
              </button>
            </div>
          </header>
          <ul className={styles.recGrid}>
            {recSlice.map((r) => (
              <li key={r.id} className={styles.recItem}>
                <div className={styles.recMedia}>
                  <Image
                    src={r.image}
                    alt={r.name}
                    fill
                    sizes="180px"
                    className={styles.recImg}
                  />
                </div>
                <strong className={styles.recName}>{r.name}</strong>
                <div className={styles.recFoot}>
                  <span className={styles.recPrice}>{inr.format(r.price)}</span>
                  <button
                    type="button"
                    className={styles.recCart}
                    aria-label={`Add ${r.name} to cart`}
                    onClick={() => handleAddRecommended(r)}
                    disabled={!r.real || addingId === r.id}
                    title={r.real ? "Add to cart" : "Sample item — not available"}
                  >
                    <FiShoppingCart />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 5. Bottom trust strip ─────────── */}
        <section className={styles.trustStrip}>
          <ul className={styles.trustList}>
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
