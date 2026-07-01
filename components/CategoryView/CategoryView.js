"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { categories as localCategories } from "@/lib/data/categories";
import { resolveProductImage } from "@/lib/productImages";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import ProductCard from "@/components/ui/ProductCard/ProductCard";
import styles from "./CategoryView.module.css";

export default function CategoryView({ category, products }) {
  const root = useRef(null);
  const stripRef = useRef(null);
  const { addItem } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();
  const [adding, setAdding] = useState(() => new Set());

  const cards = useMemo(
    () => products.map((p) => ({ ...p, image: resolveProductImage(p) })),
    [products]
  );

  // Bring the active chip into view so users land with their category centred.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector(`[data-active="true"]`);
    if (active && typeof active.scrollIntoView === "function") {
      active.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    }
  }, [category.slug]);

  const handleAddToCart = async (productId) => {
    setAdding((prev) => new Set(prev).add(productId));
    try {
      await addItem(productId, 1);
    } catch {
      /* silent */
    }
  };

  const wishlistSet = useMemo(
    () => ({ has: (productId) => isWished(productId) }),
    [isWished]
  );
  const addedSet = useMemo(() => ({ has: (id) => adding.has(id) }), [adding]);

  useGSAP(
    () => {
      gsap.from(`.${styles.heroEyebrow}, .${styles.heroTitle}, .${styles.heroLead}, .${styles.heroMeta}`, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(`.${styles.heroImage}`, {
        scale: 1.08,
        duration: 1.6,
        ease: "power3.out",
      });
      gsap.from(`.${styles.cell}`, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 88%" },
      });
    },
    { scope: root, dependencies: [category.slug] }
  );

  return (
    <main ref={root} className={styles.page}>
      {/* ── Editorial banner ── */}
      <section className={styles.hero}>
        {category.banner || category.image ? (
          <div className={styles.heroImage}>
            <Image
              src={category.banner || category.image}
              alt={category.name}
              fill
              priority
              sizes="100vw"
              className={styles.heroImg}
            />
          </div>
        ) : null}
        <span className={styles.heroScrim} aria-hidden="true" />

        <div className={`container ${styles.heroInner}`}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <a href="/categories">Categories</a>
            <span aria-hidden="true">/</span>
            <span className={styles.crumbsActive}>{category.name}</span>
          </nav>

          <span className={styles.heroEyebrow}>The collection</span>
          <h1 className={styles.heroTitle}>{category.name}</h1>
          <p className={styles.heroLead}>{category.description}</p>
          <span className={styles.heroMeta}>
            {String(category.count).padStart(2, "0")} {category.count === 1 ? "piece" : "pieces"} in this edit
          </span>
        </div>
      </section>

      {/* ── Sticky category switcher ── */}
      <div className={styles.switcherWrap}>
        <div className="container">
          <div ref={stripRef} className={styles.switcher} role="tablist" aria-label="Switch category">
            {localCategories.map((c) => {
              const active = c.id === category.slug;
              return (
                <a
                  key={c.id}
                  href={`/category/${c.id}`}
                  role="tab"
                  aria-selected={active}
                  data-active={active}
                  className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                >
                  {c.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <section className={styles.results}>
        <div className="container" style={{ maxWidth: "1480px" }}>
          <div className={styles.resultsHead}>
            <h2 className={styles.resultsTitle}>
              Shop <em>{category.name.toLowerCase()}</em>
            </h2>
            <span className={styles.resultsCount}>
              {category.count} {category.count === 1 ? "product" : "products"}
            </span>
          </div>

          {cards.length === 0 ? (
            <div className={styles.empty}>
              <h3 className={styles.emptyTitle}>Restocking soon.</h3>
              <p className={styles.emptyCopy}>
                We're refreshing this category. Browse our other supplies in
                the meantime.
              </p>
              <a href="/categories" className={styles.emptyAction}>
                See all categories <span aria-hidden="true">→</span>
              </a>
            </div>
          ) : (
            <div className={styles.grid}>
              {cards.map((p, i) => (
                <div key={p.id} className={styles.cell}>
                  <ProductCard
                    product={p}
                    isWished={wishlistSet.has(p.id)}
                    isAdded={addedSet.has(p.id)}
                    onToggleWishlist={toggleWish}
                    onAddToCart={handleAddToCart}
                    sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={i < 4}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
