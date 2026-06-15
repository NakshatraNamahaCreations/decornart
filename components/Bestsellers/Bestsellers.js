"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { listProducts } from "@/lib/api/products";
import { useCart } from "@/components/providers/CartProvider";
import { resolveProductImage } from "@/lib/productImages";
import styles from "./Bestsellers.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function Stars({ rating }) {
  const pct = (rating / 5) * 100;
  return (
    <span className={styles.stars} aria-label={`Rated ${rating} out of 5`}>
      <span className={styles.starsEmpty} aria-hidden="true">★★★★★</span>
      <span
        className={styles.starsFill}
        aria-hidden="true"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}

export default function Bestsellers() {
  const root = useRef(null);
  const carouselRef = useRef(null);
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [added, setAdded] = useState(() => new Set());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await listProducts({ bestseller: true, limit: 10, sort: "featured" });
        if (cancelled) return;
        setItems(data || []);
      } catch {
        if (!cancelled) setItems([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded((prev) => new Set(prev).add(productId));
    try {
      await addItem(productId, 1);
    } catch {
      setAdded((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const scrollByDir = (dir) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector(`.${styles.card}`);
    const track = carousel.querySelector(`.${styles.track}`);
    if (!card || !track) return;
    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || "16");
    const visible =
      parseFloat(getComputedStyle(track).getPropertyValue("--visible")) || 4;
    carousel.scrollBy({
      left: dir * visible * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.card}`, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: `.${styles.carousel}`,
          start: "top 82%",
        },
      });
    },
    { scope: root, dependencies: [items.length] }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div className={styles.headText}>
            <span className={styles.eyebrow}>Loved this week</span>
            <h2 className={styles.heading}>
              Bestsellers
              <svg
                className={styles.heart}
                viewBox="0 0 24 24"
                width="22"
                height="22"
                aria-hidden="true"
              >
                <path
                  d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
                  fill="currentColor"
                />
              </svg>
            </h2>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.lead}>
              The bouquets our customers return to — hand-tied each
              morning, never the same twice.
            </p>
          </div>

          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByDir(-1)}
              aria-label="Previous"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByDir(1)}
              aria-label="Next"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div ref={carouselRef} className={styles.carousel}>
          <div className={styles.track}>
            {items.map((p) => {
              const isAdded = added.has(p.id);
              const rating = p.rating || 4.8;
              const ratingCount = p.ratingCount || 96;
              return (
                <a
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className={styles.card}
                >
                  <div className={styles.imageWrap}>
                    <Image
                      src={resolveProductImage(p)}
                      alt={p.name}
                      fill
                      sizes="(max-width: 860px) 75vw, 300px"
                    />
                    <button
                      type="button"
                      onClick={(e) => addToCart(e, p.id)}
                      className={`${styles.addToCart} ${
                        isAdded ? styles.added : ""
                      }`}
                    >
                      {isAdded ? "Added ✓" : "Add to cart"}
                    </button>
                  </div>
                  <h3 className={styles.name}>{p.name}</h3>
                  <span className={styles.price}>{inr.format(p.price)}</span>
                  <div className={styles.ratingRow}>
                    <Stars rating={rating} />
                    <span className={styles.count}>({ratingCount})</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className={styles.foot}>
          <a href="/shop" className={styles.viewAll}>
            View all products <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
