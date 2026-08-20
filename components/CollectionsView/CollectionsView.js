"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";
import { listProducts } from "@/lib/api/products";
import { listInstagramPosts } from "@/lib/api/instagramPosts";
import { resolveProductImage } from "@/lib/productImages";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import ProductCard from "@/components/ui/ProductCard/ProductCard";
import bannerImg from "@/assets/bannerimg1.png";
import { useBannerContent } from "@/hooks/useBannerContent";
import insta1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import insta2 from "@/assets/butterfly-luxury/luxury2.jpeg";
import insta3 from "@/assets/for-you-bouquet/for-you3.jpeg";
import insta4 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import insta5 from "@/assets/for-mother-gift/for-mother4.jpeg";
import insta6 from "@/assets/butterfly-signature/signature1.jpeg";
import {
  featuredCollections,
  supportCards,
} from "@/lib/data/collectionsPage";
import styles from "./CollectionsView.module.css";

const TRUST = [
  {
    id: "beautiful",
    title: "Curated with Love",
    copy: "Every piece is crafted with passion & care",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "quality",
    title: "Premium Quality",
    copy: "We use the best materials always",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" />
      </svg>
    ),
  },
  {
    id: "trusted",
    title: "Trusted by 10,000+",
    copy: "Loved by crafters across India",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
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
    id: "secure",
    title: "Secure Payment",
    copy: "100% safe & secure checkout",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "bulk",
    title: "Bulk & Wholesale",
    copy: "Special pricing for bulk orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M4 8l8-4 8 4-8 4-8-4z" />
        <path d="M4 12l8 4 8-4" />
        <path d="M4 16l8 4 8-4" />
      </svg>
    ),
  },
];

const WHY = [
  {
    id: "beautiful",
    title: "Curated with Love",
    copy: "Crafted with care in every detail.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "premium",
    title: "Premium Quality",
    copy: "Finest materials for lasting beauty.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" />
      </svg>
    ),
  },
  {
    id: "unique",
    title: "Unique Designs",
    copy: "Original creations made just for you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l2.5 6 6 .5-4.5 4 1.5 6L12 16l-5.5 3.5 1.5-6L3 9.5l6-.5L12 3z" />
      </svg>
    ),
  },
  {
    id: "india",
    title: "Made in India",
    copy: "Proudly supporting local craftsmanship.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "eco",
    title: "Eco Friendly",
    copy: "Sustainable packaging & responsible sourcing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M4 20c8-2 12-6 14-14-6 0-10 2-12 6a8 8 0 0 0-2 8z" />
        <path d="M4 20c2-4 6-8 12-10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "happy",
    title: "Happy Customer",
    copy: "10,000+ smiles and counting!",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14c1 1.5 2.5 2.5 4 2.5s3-1 4-2.5" />
        <circle cx="9" cy="10" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const INSTA_POSTS = [
  { id: "p1", image: insta1, alt: "Butterfly gift box detail" },
  { id: "p2", image: insta2, alt: "Butterfly luxury bouquet" },
  { id: "p3", image: insta3, alt: "Just for you bouquet basket" },
  { id: "p4", image: insta4, alt: "Luxe heart bouquet" },
  { id: "p5", image: insta5, alt: "For mother gift box" },
  { id: "p6", image: insta6, alt: "Butterfly signature edition" },
];

// Which react-icon (if any) goes on the support-card image slot.
const supportIcon = (id) => {
  if (id === "help") return <FaWhatsapp />;
  return null;
};

export default function CollectionsView() {
  const root = useRef(null);
  // Horizontal carousel ref for "Shop by Collection". Prev/next arrows
  // scroll one page-worth of cards using the same --visible math as the
  // beautifulDrop carousel.
  const collectionCarouselRef = useRef(null);
  const heroBanner = useBannerContent("collections-hero");
  // Wait until the fetch resolves before deciding — avoids a flash of
  // the bundled fallback that swaps to the admin image milliseconds
  // later. `null` while loading keeps the <Image> from rendering; the
  // section still occupies its space via CSS.
  const heroSrc = heroBanner.loaded ? heroBanner.image || bannerImg : null;
  const { addItem } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();
  const [newProducts, setNewProducts] = useState([]);
  const [adding, setAdding] = useState(() => new Set());
  const [remoteInsta, setRemoteInsta] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await listProducts({ isNew: true, limit: 8 });
        // Endpoint returns { items, meta } — the client unwraps `.data`.
        const items = Array.isArray(data) ? data : data?.items || [];
        if (!cancelled) setNewProducts(items);
      } catch {
        if (!cancelled) setNewProducts([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    listInstagramPosts()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) setRemoteInsta(data);
      })
      .catch(() => {
        /* keep the static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const instaPosts = useMemo(() => {
    if (remoteInsta && remoteInsta.length > 0) {
      return remoteInsta.map((p) => ({
        id: p.id,
        image: p.image,
        alt: p.alt || "Instagram post",
        link: p.link || "",
      }));
    }
    return INSTA_POSTS.map((p) => ({ ...p, link: "" }));
  }, [remoteInsta]);

  const newCards = useMemo(
    () => newProducts.map((p) => ({ ...p, image: resolveProductImage(p) })),
    [newProducts]
  );

  // Scroll the "Shop by Collection" carousel by exactly one card at a
  // time. Reads --card-gap off the .track so the step matches the
  // responsive breakpoints without duplication.
  const scrollCollections = (dir) => {
    const carousel = collectionCarouselRef.current;
    if (!carousel) return;
    const track = carousel.querySelector(`.${styles.collectionTrack}`);
    const card = carousel.querySelector(`.${styles.collectionSlide}`);
    if (!track || !card) return;
    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || "16");
    carousel.scrollBy({
      left: dir * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  const handleAddToCart = async (productId) => {
    setAdding((prev) => new Set(prev).add(productId));
    try {
      await addItem(productId, 1);
    } catch {
      /* silent */
    }
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.heroInner} > *`, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from(`.${styles.collectionSlide}`, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.collectionGrid}`, start: "top 85%" },
      });
      gsap.from(`.${styles.featuredItem}`, {
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.featuredGrid}`, start: "top 90%" },
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className={styles.page}>
      {/* ────────────── 1. Hero banner ────────────── */}
      <section className={styles.hero} aria-label="Collections">
        {heroSrc && (
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
            unoptimized={typeof heroSrc === "string"}
          />
        )}
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.heroEyebrow}>
            {heroBanner.text(
              "eyebrow",
              <>
                Curated with love <span aria-hidden="true">&hearts;</span>
              </>
            )}
          </span>
          <h1 className={styles.heroTitle}>
            {heroBanner.text("title", "Collections")}
          </h1>
          <p className={styles.heroScript}>
            {heroBanner.text(
              "script",
              <>
                made to inspire <span aria-hidden="true">&hearts;</span>
              </>
            )}
          </p>
          <p className={styles.heroLead}>
            {heroBanner.text(
              "subtitle",
              <>
                Thoughtfully handcrafted collections for every
                <br />
                occasion, creative idea &amp; heartfelt gift.
              </>
            )}
          </p>
          {heroBanner.loaded && (
            <a
              href={heroBanner.href || "#shop-by-collection"}
              className={styles.heroCta}
            >
              {heroBanner.ctaLabel || "Explore All Collections"}{" "}
              <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </section>

      {/* ────────────── 2. Trust strip (6 items) ────────────── */}
      <section className={styles.trustWrap}>
        <div className="container">
          <ul className={styles.trustList}>
            {TRUST.map((t) => (
              <li key={t.id} className={styles.trustItem}>
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
        </div>
      </section>

      {/* ────────────── 3. Shop by Collection — new arrivals from backend ────────────── */}
      <section
        id="shop-by-collection"
        className={styles.section}
        aria-labelledby="shop-by-collection-h"
      >
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.headRule} aria-hidden="true" />
            <h2 id="shop-by-collection-h" className={styles.sectionTitle}>
              Shop by Collection
            </h2>
            <span className={styles.headRule} aria-hidden="true" />
          </div>

          {newCards.length === 0 ? (
            <p className={styles.emptyNote}>No new arrivals just yet — check back soon.</p>
          ) : (
            <div className={styles.collectionCarouselWrap}>
              <button
                type="button"
                className={`${styles.carouselArrow} ${styles.carouselArrowPrev}`}
                onClick={() => scrollCollections(-1)}
                aria-label="Previous collections"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M15 6l-6 6 6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
                onClick={() => scrollCollections(1)}
                aria-label="Next collections"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M9 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div
                ref={collectionCarouselRef}
                className={styles.collectionCarousel}
              >
                <div className={styles.collectionTrack}>
                  {newCards.map((p) => (
                    <div
                      key={p.id || p.slug}
                      className={styles.collectionSlide}
                    >
                      <ProductCard
                        product={p}
                        isWished={isWished(p.id)}
                        isAdded={adding.has(p.id)}
                        onToggleWishlist={toggleWish}
                        onAddToCart={handleAddToCart}
                        sizes="(max-width: 520px) 60vw, (max-width: 860px) 40vw, (max-width: 1200px) 28vw, 22vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ────────────── 4. Featured Collections (circular badges) ────────────── */}
      <section className={styles.section} aria-labelledby="featured-h">
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.headRule} aria-hidden="true" />
            <h2 id="featured-h" className={styles.sectionTitle}>
              Featured Collections
            </h2>
            <span className={styles.headRule} aria-hidden="true" />
          </div>

          <ul className={styles.featuredGrid}>
            {featuredCollections.map((f) => (
              <li key={f.slug} className={styles.featuredItem}>
                <div className={styles.featuredLink}>
                  <span className={styles.featuredMedia} aria-hidden="true">
                    <Image
                      src={f.image}
                      alt={f.name}
                      fill
                      sizes="(max-width: 760px) 33vw, 12vw"
                      className={styles.featuredImg}
                    />
                  </span>
                  <span className={styles.featuredName}>{f.name}</span>
                  <span className={styles.featuredNote}>{f.note}</span>
                
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ────────────── 5. Get Inspired Everyday (Instagram) ────────────── */}
      <section className={styles.section} aria-labelledby="inspired-h">
        <div className="container">
          <div className={styles.inspiredCard}>
            <aside className={styles.inspiredCopy}>
              <h3 id="inspired-h" className={styles.inspiredTitle}>
                Get Inspired
                <br />
                Everyday
              </h3>
              <p className={styles.inspiredLead}>
                Follow us for new launches, DIY ideas, behind the scenes &amp;
                beautiful creations.
              </p>
              <a
                href="https://www.instagram.com/decornart.in/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inspiredCta}
              >
                <FaInstagram />
                Follow us @decornart.in
              </a>
            </aside>
            <ul className={styles.instaGrid}>
              {instaPosts.map((p) => {
                const Media = (
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 900px) 30vw, 12vw"
                    className={styles.instaImg}
                    unoptimized={typeof p.image === "string"}
                  />
                );
                return (
                  <li key={p.id} className={styles.instaTile}>
                    {p.link ? (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={p.alt}
                      >
                        {Media}
                      </a>
                    ) : (
                      Media
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ────────────── 6. Why DecorNArt? ────────────── */}
      <section className={styles.section} aria-labelledby="why-h">
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.headRule} aria-hidden="true" />
            <h2 id="why-h" className={styles.sectionTitle}>
              Why DecorNArt?
            </h2>
            <span className={styles.headRule} aria-hidden="true" />
          </div>
          <ul className={styles.whyList}>
            {WHY.map((w) => (
              <li key={w.id} className={styles.whyItem}>
                <span className={styles.whyIcon} aria-hidden="true">
                  {w.icon}
                </span>
                <span className={styles.whyText}>
                  <strong>{w.title}</strong>
                  <span>{w.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ────────────── 7. Bulk / Custom / Help support row ────────────── */}
      <section className={styles.section} aria-labelledby="support-h">
        <div className="container">
          <h2 id="support-h" className={styles.srOnly}>
            Ways we can help
          </h2>
          <div className={styles.supportGrid}>
            {supportCards.map((s) => (
              <div key={s.id} className={styles.supportCard}>
                <div className={styles.supportCopy}>
                  <span className={styles.supportEyebrow}>{s.eyebrow}</span>
                  <p className={styles.supportTitle}>{s.title}</p>
                  <a href={s.cta.href} className={styles.supportCta}>
                    {s.cta.label} <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
                {s.image ? (
                  <div className={styles.supportMedia}>
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="(max-width: 720px) 40vw, 15vw"
                      className={styles.supportImg}
                    />
                  </div>
                ) : (
                  <div
                    className={`${styles.supportMedia} ${styles.supportIconBg}`}
                    aria-hidden="true"
                  >
                    <span className={styles.supportBigIcon}>
                      {supportIcon(s.id)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
