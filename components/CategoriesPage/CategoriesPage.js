"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { categories as localCategories } from "@/lib/data/categories";
import { listCategories } from "@/lib/api/categories";
import Breadcrumb from "@/components/ui/Breadcrumb/Breadcrumb";
import bannerImg from "@/assets/bannerimg2.png";
import styles from "./CategoriesPage.module.css";

// Backend owns slug/name/description/count; storefront owns the imagery.
// Merge by slug so we render rich cards with live counts.
function mergeWithImages(apiCategories) {
  const imageBySlug = new Map(localCategories.map((c) => [c.id, c.image]));
  return apiCategories.map((c) => ({
    ...c,
    image: imageBySlug.get(c.slug) || null,
  }));
}

export default function CategoriesPage() {
  const root = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listCategories()
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : Array.isArray(res?.items) ? res.items : [];
        setItems(mergeWithImages(list));
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || "Couldn't load categories.");
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalProducts = useMemo(
    () => items.reduce((sum, c) => sum + (c.count || 0), 0),
    [items]
  );

  useGSAP(
    () => {
      if (!items.length) return;
      gsap.from(`.${styles.card}`, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 85%" },
      });
    },
    { scope: root, dependencies: [items.length] }
  );

  return (
    <main ref={root} className={styles.page}>
      <section className={styles.banner} aria-label="Categories">
        <Image
          src={bannerImg}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.bannerImg}
        />
        <div className={styles.bannerScrim} aria-hidden="true" />
        <div className={`container ${styles.bannerInner}`}>
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Categories" }]}
          />
          <span className={styles.bannerEyebrow}>Browse by category</span>
          <h1 className={styles.bannerTitle}>
            Craft materials, <br />organised
          </h1>
          <p className={styles.bannerIntro}>
            Nine focused collections covering every step of a project — baskets
            and foam to start, ribbons and wraps to finish.
          </p>
          {totalProducts > 0 ? (
            <span className={styles.bannerMeta}>
              {totalProducts} products across {items.length} categories
            </span>
          ) : null}
        </div>
      </section>

      <div className="container" style={{ maxWidth: "1480px" }}>

        {error ? (
          <p className={styles.notice}>{error}</p>
        ) : loading ? (
          <p className={styles.notice}>Loading categories…</p>
        ) : items.length === 0 ? (
          <p className={styles.notice}>No categories yet.</p>
        ) : (
          <div className={styles.grid}>
            {items.map((c, i) => (
              <a
                key={c.slug}
                href={`/category/${c.slug}`}
                className={styles.card}
                aria-label={`Browse ${c.name}`}
              >
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 560px) 90vw, (max-width: 1024px) 45vw, 32vw"
                    className={styles.cardImg}
                  />
                ) : (
                  <span aria-hidden="true" className={styles.cardFallback} />
                )}

                <span className={styles.cardScrim} aria-hidden="true" />

                <span className={styles.cardTop}>
                  <span className={styles.indexBadge} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.count ? (
                    <span className={styles.countChip}>
                      {c.count} {c.count === 1 ? "item" : "items"}
                    </span>
                  ) : null}
                </span>

                <span className={styles.cardBody}>
                  <span className={styles.cardEyebrow}>Collection</span>
                  <span className={styles.cardName}>{c.name}</span>
                  <span className={styles.cardNote}>{c.description}</span>
                  <span className={styles.cardCta}>
                    <span>Explore</span>
                    <span className={styles.cardCtaArrow} aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="14" height="14">
                        <path
                          d="M5 12h14m-6-6 6 6-6 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
