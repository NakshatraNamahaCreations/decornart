"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { resolveProductImage } from "@/lib/productImages";
import demo1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import demo2 from "@/assets/butterfly-luxury/luxury1.jpeg";
import demo3 from "@/assets/for-you-bouquet/for-you4.jpeg";
import demo4 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import demo5 from "@/assets/luxe-rose/luxe-rose4.jpeg";
import styles from "./RelatedProducts.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// Fallback related items — used when the API returns nothing so the section
// always renders 5 tiles instead of collapsing.
const DEMO_RELATED = [
  {
    id: "demo1",
    slug: "butterfly-gift-box",
    name: "Butterfly Gift Box",
    occasion: "Signature Edit",
    price: 650,
    isNew: true,
    image: demo1,
  },
  {
    id: "demo2",
    slug: "butterlfy-luxe-bouquet-basket",
    name: "Butterfly Luxury Basket",
    occasion: "Bestseller",
    price: 850,
    isNew: false,
    image: demo2,
  },
  {
    id: "demo3",
    slug: "just-for-you-bouquet-basket",
    name: "Just For You Basket",
    occasion: "Thinking of You",
    price: 900,
    isNew: false,
    image: demo3,
  },
  {
    id: "demo4",
    slug: "heart-bouquet-basket",
    name: "Heart Bouquet Basket",
    occasion: "Best Wishes",
    price: 279,
    isNew: true,
    image: demo4,
  },
  {
    id: "demo5",
    slug: "rose-gift-box-with-led",
    name: "Rose Gift Box with LED",
    occasion: "Anniversary",
    price: 459,
    isNew: false,
    image: demo5,
  },
];

export default function RelatedProducts({ related = [] }) {
  const root = useRef(null);
  // Fall back to the demo set when no API data is available so 5 tiles
  // still render on the product page.
  const items = related && related.length > 0 ? related.slice(0, 5) : DEMO_RELATED;

  useGSAP(
    () => {
      gsap.from(`.${styles.card}`, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div className={styles.headText}>
            <span className={styles.eyebrow}>— You may also like</span>
            <h2 className={styles.heading}>
              Composed in <em>a similar register</em>.
            </h2>
          </div>
          <a href="/shop" className={styles.viewAll}>
            View the full shop <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className={styles.grid}>
          {items.map((p) => (
            <a key={p.id} href={`/product/${p.slug}`} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={p.image || resolveProductImage(p)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 760px) 90vw, 24vw"
                />
                {p.isNew && <span className={styles.badge}>New</span>}
              </div>
              <div className={styles.meta}>
                <div>
                  <h3 className={styles.name}>{p.name}</h3>
                  <span className={styles.occasion}>
                    {p.occasion || p.category}
                  </span>
                </div>
                <span className={styles.price}>{inr.format(p.price)}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
