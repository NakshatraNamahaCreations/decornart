"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { getProductImage } from "@/lib/productImages";
import styles from "./ProductView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function deriveDetails(product) {
  const occasion = (product.occasion || "everyday").toLowerCase();
  return {
    description:
      product.description ||
      `${product.name} is composed by hand each morning from stems that arrive freshest at the market. Soft ${occasion} palette, balanced volume, and a quiet ribbon of mulberry silk — a piece that reads as considered, not arranged.`,
    materials: [
      "Garden roses · 5 stems",
      "Ranunculus · 7 stems",
      "Lisianthus · 4 stems",
      "Italian ruscus · seasonal greenery",
      "Hand-dyed mulberry silk ribbon",
    ],
    care: [
      "Trim 2 cm at a 45° angle on arrival",
      "Change water every other day",
      "Keep away from direct sun and fruit bowls",
      "Lasts 5–7 days when conditioned",
    ],
    height: "Approx. 38 cm",
    width: "Approx. 26 cm",
  };
}

export default function ProductView({ product }) {
  const root = useRef(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [openSection, setOpenSection] = useState("delivery");

  const { addItem } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();
  const saved = isWished(product.id);

  // Use whatever images the backend has for this product. If none were
  // uploaded, fall back to the slug-keyed local asset so we still show *one*
  // image — never pad with unrelated fallback bouquets.
  const gallery = useMemo(() => {
    const remote = (product.images || []).filter(Boolean);
    return remote.length ? remote : [getProductImage(product.slug)];
  }, [product.slug, product.images]);
  const details = deriveDetails(product);

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addItem(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch {
      /* surface via toast later */
    } finally {
      setAdding(false);
    }
  };

  const handleSave = async () => {
    try {
      await toggleWish(product.id);
    } catch {
      /* not signed in — could route to login */
    }
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.galleryMain}`, {
        scale: 0.96,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
      });
      gsap.from(`.${styles.info} > *`, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      });
    },
    { scope: root }
  );

  const toggle = (id) => setOpenSection((cur) => (cur === id ? null : id));

  const nameParts = product.name.split(" ");
  const occasionTags = product.occasions || [];

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className={styles.crumbSep} aria-hidden="true">/</span>
          <a href="/shop">Shop</a>
          <span className={styles.crumbSep} aria-hidden="true">/</span>
          <span className={styles.crumbActive}>{product.name}</span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.galleryCol}>
            <div className={styles.gallery}>
              <div className={styles.galleryMain}>
                <Image
                  src={gallery[activeImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 860px) 90vw, 50vw"
                  priority
                />
                {product.isNew && (
                  <span className={styles.badge}>New · Atelier</span>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  className={`${styles.saveHeart} ${
                    saved ? styles.savedHeart : ""
                  }`}
                  aria-label={
                    saved ? "Remove from wishlist" : "Save to wishlist"
                  }
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
                      fill={saved ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className={styles.thumbs}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`${styles.thumb} ${
                      i === activeImage ? styles.thumbActive : ""
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt="" fill sizes="96px" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.info}>
            <span className={styles.eyebrow}>
              {product.category} · Hand-tied
            </span>
            <h1 className={styles.heading}>
              {nameParts.slice(0, -1).join(" ")}{" "}
              <em>{nameParts.slice(-1)[0]}</em>
            </h1>

            <div className={styles.rating}>
              <span className={styles.stars} aria-label={`${product.rating || 4.8} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 3.5l2.6 5.6 6 .6-4.5 4.2 1.3 6L12 17l-5.4 2.9 1.3-6L3.4 9.7l6-.6L12 3.5z"
                      fill={i < Math.round(product.rating || 4) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
              </span>
              <span className={styles.ratingText}>
                {(product.rating || 4.8).toFixed(1)} ·{" "}
                <a href="#reviews">{product.ratingCount || 128} reviews</a>
              </span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{inr.format(product.price)}</span>
              <span className={styles.priceNote}>Inclusive of all taxes</span>
            </div>

            <span className={styles.rule} aria-hidden="true" />

            <p className={styles.description}>{details.description}</p>

            <div className={styles.tagSection}>
              <span className={styles.tagLabel}>Occasions</span>
              <div className={styles.tags}>
                {occasionTags.map((o) => (
                  <a
                    key={o}
                    href={`/shop?occasion=${o}`}
                    className={styles.tag}
                  >
                    {o.replace("-", " ")}
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.buyRow}>
              <div className={styles.qtyWrap}>
                <span className={styles.qtyLabel}>Qty</span>
                <div className={styles.qty}>
                  <button
                    type="button"
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    aria-label="Decrease quantity"
                    className={styles.qtyBtn}
                  >
                    –
                  </button>
                  <span className={styles.qtyValue}>{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((v) => v + 1)}
                    aria-label="Increase quantity"
                    className={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={adding}
                className={`${styles.addCart} ${added ? styles.added : ""}`}
              >
                {added ? (
                  <>Added to cart ✓</>
                ) : adding ? (
                  <>Adding…</>
                ) : (
                  <>
                    Add to cart
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSave}
                className={`${styles.wishBtn} ${saved ? styles.wished : ""}`}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
                    fill={saved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <ul className={styles.accordion}>
              {[
                {
                  id: "delivery",
                  title: "Delivery & shipping",
                  body: (
                    <ul className={styles.accordionList}>
                      <li>Same-day delivery in Mumbai, Bengaluru, Delhi & Pune (order by 4 PM).</li>
                      <li>Pan-India shipping on orders above ₹2,500.</li>
                      <li>Climate-conditioned wrap; never outsourced last-mile.</li>
                      <li>Live tracking via SMS & WhatsApp.</li>
                    </ul>
                  ),
                },
                {
                  id: "materials",
                  title: "Stems & materials",
                  body: (
                    <ul className={styles.accordionList}>
                      {details.materials.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  id: "care",
                  title: "Care instructions",
                  body: (
                    <ul className={styles.accordionList}>
                      {details.care.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  id: "dimensions",
                  title: "Dimensions",
                  body: (
                    <div className={styles.dims}>
                      <div>
                        <span className={styles.dimLabel}>Height</span>
                        <span className={styles.dimValue}>{details.height}</span>
                      </div>
                      <div>
                        <span className={styles.dimLabel}>Width</span>
                        <span className={styles.dimValue}>{details.width}</span>
                      </div>
                    </div>
                  ),
                },
              ].map((row) => (
                <li key={row.id} className={styles.row}>
                  <button
                    type="button"
                    className={styles.rowHead}
                    onClick={() => toggle(row.id)}
                    aria-expanded={openSection === row.id}
                  >
                    <span className={styles.rowTitle}>{row.title}</span>
                    <span className={styles.rowToggle} aria-hidden="true">
                      {openSection === row.id ? "–" : "+"}
                    </span>
                  </button>
                  {openSection === row.id && (
                    <div className={styles.rowBody}>{row.body}</div>
                  )}
                </li>
              ))}
            </ul>

            <ul className={styles.trust}>
              <li>
                <span className={styles.trustIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 12l4 4 14-14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Tied this morning
              </li>
              <li>
                <span className={styles.trustIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 12l4 4 14-14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Free delivery over ₹2,500
              </li>
              <li>
                <span className={styles.trustIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 12l4 4 14-14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Razorpay · UPI · cards
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
