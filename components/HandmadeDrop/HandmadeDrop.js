"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { listProducts } from "@/lib/api/products";
import { resolveProductImage } from "@/lib/productImages";
import styles from "./beautifulDrop.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function beautifulDrop() {
  const root = useRef(null);
  const carouselRef = useRef(null);
  const [items, setItems] = useState([]);
  const [added, setAdded] = useState(() => new Set());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await listProducts({ category: "beautiful", limit: 12 });
        // Defensive client-side filter in case the backend ever returns a
        // mixed payload — the carousel must only ever show beautiful pieces.
        const beautifulOnly = (data || []).filter((p) => p.category === "beautiful");
        if (!cancelled) setItems(beautifulOnly);
      } catch {
        if (!cancelled) setItems([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addToCart = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded((prev) => new Set(prev).add(id));
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.carousel}`, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.carousel}`, start: "top 88%" },
      });
    },
    { scope: root }
  );

  const scrollByDir = (dir) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector(`.${styles.card}`);
    const track = carousel.querySelector(`.${styles.track}`);
    if (!card || !track) return;
    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || "16");
    const visible =
      parseFloat(getComputedStyle(track).getPropertyValue("--visible")) || 3;
    carousel.scrollBy({
      left: dir * visible * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <section ref={root} id="drop" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div className={styles.headText}>
            <span className={styles.eyebrow}>This Week's Drop</span>
            <h2 className={styles.heading}>
              Bouquets, in <em>editions of one</em>.
            </h2>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.lead}>
              A limited batch from the atelier — each composed once, then gone.
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
                    sizes="(max-width: 860px) 90vw, 32vw"
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
                <div className={styles.meta}>
                  <div>
                    <h3 className={styles.name}>{p.name}</h3>
                    <p className={styles.occasion}>{p.occasion || p.primaryOccasion || ""}</p>
                  </div>
                  <span className={styles.price}>{inr.format(p.price)}</span>
                </div>
              </a>
              );
            })}
          </div>
        </div>

        <div className={styles.foot}>
          <a href="/shop?category=beautiful" className={styles.viewAll}>
            View all editions <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
