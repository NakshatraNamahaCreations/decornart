"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaInstagram, FaYoutube, FaPinterest, FaWhatsapp } from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";
import { listCategories } from "@/lib/api/categories";
import { listProducts } from "@/lib/api/products";
import { hexForColorWithOverrides } from "@/lib/colorSwatches";
import Breadcrumb from "@/components/ui/Breadcrumb/Breadcrumb";
import { useBannerContent } from "@/hooks/useBannerContent";
import heroImg from "@/assets/banimg3.png";
import pipecleanersImg from "@/assets/pipe-cleaner-ban.png";
import cantFindImg from "@/assets/categorybanner.png";
import basketImg from "@/assets/Bow Gifting Box/1.PNG";
import giftCardsImg from "@/assets/gift-card.jpeg";
import craftEssentialsImg from "@/assets/craft.png";
import crochetImg from "@/assets/crochet.png";
import pipeCleanersTileImg from "@/assets/pipe-cleaners.png";
import ribbonsImg from "@/assets/ribbons.png";
import wrappingImg from "@/assets/wrapper.png";
import giftImg from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import plantImg from "@/assets/plant.png";
import insta1 from "@/assets/butterfly-gift-box/butterfly-3.jpeg";
import insta2 from "@/assets/butterfly-luxury/luxury2.jpeg";
import insta3 from "@/assets/butterfly-signature/signature1.jpeg";
import insta4 from "@/assets/cone-shape-gift/cone-shape4.jpeg";
import insta5 from "@/assets/for-mother-gift/for-mother5.jpeg";
import insta6 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import styles from "./CategoriesPage.module.css";

// Backend supplies slug/name/description/count. Images are wired here by slug
// so tiles stay visual while the catalogue itself lives in the API.
const CATEGORY_IMAGES = {
  "flower-basket": basketImg,
  "flower-basket-materials": basketImg,
  "flower-boxes-bags": basketImg,
  "gift-cards": giftCardsImg,
  "pipe-cleaners": pipeCleanersTileImg,
  // The category's slug depends on how the admin created it — the static
  // demo data uses "plant-planters" but the shop filter / SpecialMoments
  // link and some seeds use "artificial-plants". Wire both to the same
  // image so the tile shows regardless.
  // "plant-planters": plantImg,
  // "artificial-plants": plantImg,
  "artificial-plant-planters": plantImg,
  "craft-essentials": craftEssentialsImg,
  "crochet-materials": crochetImg,
  ribbons: ribbonsImg,
  "wrapping-papers": wrappingImg,
};

const TRUST_TOP = [
  {
    id: "secure",
    title: "100% Secure Payment",
    copy: "SSL Encrypted",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "ships",
    title: "Ships in 24 Hours",
    copy: "Pan India Delivery",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    id: "returns",
    title: "Damage Protection",
    copy: "Replacement for transit-damaged items",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 14-5" />
        <path d="M18 3v4h-4" />
        <path d="M20 12a8 8 0 0 1-14 5" />
        <path d="M6 21v-4h4" />
      </svg>
    ),
  },
  {
    id: "quality",
    title: "Trusted by 10,000+ customers",
    copy: "Social proof converts better",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" />
      </svg>
    ),
  },
  {
    id: "bulk",
    title: "Bulk Orders & Wholesale",
    copy: "Special Prices",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M4 8l8-4 8 4-8 4-8-4z" />
        <path d="M4 12l8 4 8-4" />
        <path d="M4 16l8 4 8-4" />
      </svg>
    ),
  },
];

const TRUST_BOTTOM = [
  {
    id: "beautiful",
    title: "Curated with Love",
    copy: "Every piece is crafted with passion & care",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
  {
    id: "trusted",
    title: "Trusted by Creators",
    copy: "Loved by 10,000+ creators across India",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
      </svg>
    ),
  },
  {
    id: "premium",
    title: "Premium Quality",
    copy: "We use the best materials always",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "packaging",
    title: "Custom Packaging",
    copy: "Perfect for your brand, gifting & events",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M3 8h18v12H3z" />
        <path d="M3 8l3-4h12l3 4" />
        <path d="M12 4v16" />
      </svg>
    ),
  },
  {
    id: "safe",
    title: "Safe & Secure",
    copy: "Your payments are always protected",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      </svg>
    ),
  },
];

const INSTA_POSTS = [
  { id: "ig1", image: insta1, alt: "Butterfly luxe gift box" },
  { id: "ig2", image: insta2, alt: "Luxury bouquet basket" },
  { id: "ig3", image: insta3, alt: "Signature butterfly edition" },
  { id: "ig4", image: insta4, alt: "Cone-shape gift detail" },
  { id: "ig5", image: insta5, alt: "For-mother gift styling" },
  { id: "ig6", image: insta6, alt: "Luxe heart bouquet" },
];

const SWATCH_VISIBLE = 17;

export default function CategoriesPage() {
  const root = useRef(null);
  const heroBanner = useBannerContent("categories-hero");
  const heroSrc = heroBanner.loaded ? heroBanner.image || heroImg : null;
  const [categories, setCategories] = useState([]);
  const [studioColors, setStudioColors] = useState([]);
  // Tracks the very first fetch so the grid can render skeleton tiles until
  // the API responds. Without this the grid stays empty during load, the
  // Color Studio section shifts up, then everything jumps back once the data
  // arrives — a visible flash on refresh.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await listCategories();
        if (!cancelled) setCategories(data || []);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Aggregate every unique colour offered by pipe-cleaner products for
  // the "DecorNArt Color Studio" swatch row. Hex resolves from the
  // per-product colorSwatches overrides first, then falls back to the
  // static COLOR_HEX map on the storefront.
  useEffect(() => {
    let cancelled = false;
    async function loadColors() {
      try {
        const data = await listProducts({
          category: "pipe-cleaners",
          limit: 1000,
        });
        if (cancelled) return;
        const items = Array.isArray(data) ? data : data?.items || [];
        const seen = new Map();
        for (const p of items) {
          const names = Array.isArray(p.colors) ? p.colors : [];
          for (const name of names) {
            if (!name || seen.has(name)) continue;
            seen.set(name, hexForColorWithOverrides(name, p.colorSwatches));
          }
        }
        setStudioColors(
          Array.from(seen.entries()).map(([name, hex]) => ({ name, hex }))
        );
      } catch {
        if (!cancelled) setStudioColors([]);
      }
    }
    loadColors();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleSwatches = studioColors.slice(0, SWATCH_VISIBLE);
  const remainingSwatchCount = Math.max(0, studioColors.length - SWATCH_VISIBLE);

  // Show every category from the backend in the main grid. The Craft
  // Essentials mini-card in the Color Studio section is still supported —
  // it's an editorial highlight, not a way to hide the tile from the grid.
  const craftEssentials = categories.find((c) => c.slug === "craft-essentials");
  const items = categories;

  useGSAP(
    () => {
      gsap.from(`.${styles.card}`, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero banner — full-bleed image with cream scrim (matches Shop). ─────────── */}
      <section className={styles.hero} aria-label="Categories">
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
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Categories" },
            ]}
          />
          <h1 className={styles.heroTitle}>
            {heroBanner.text("title", "Categories")}
          </h1>
          <p className={styles.heroScript}>
            {heroBanner.text(
              "script",
              <>
                Find everything you need
                <br />
                to create magic <span aria-hidden="true">&hearts;</span>
              </>
            )}
          </p>
          <p className={styles.heroLead}>
            {heroBanner.text(
              "subtitle",
              <>
                Handpicked craft supplies for every creator,
                <br />
                every idea, every moment.
              </>
            )}
          </p>
          {heroBanner.loaded && (
            <a
              href={heroBanner.href || "#collections"}
              className={styles.heroCta}
            >
              {heroBanner.ctaLabel || "Shop All Categories"}
              <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </section>

      {/* ─────────── 2. Trust strip (top) ─────────── */}
      <section className={styles.trustTop}>
        <div className="container">
          <ul className={styles.trustList}>
            {TRUST_TOP.map((t) => (
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

      {/* ─────────── 3. Category cards grid ─────────── */}
      <section id="collections" className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.grid}>
            {loading
              ? // Skeleton tiles reserve the vertical space so the sections
                // below don't shift when the real categories arrive.
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`sk-${i}`}
                    className={`${styles.card} ${styles.cardSkeleton}`}
                    aria-hidden="true"
                  >
                    <span
                      className={`${styles.cardMedia} ${styles.skeletonBlock}`}
                    />
                    <span className={styles.cardBody}>
                      <span
                        className={`${styles.skeletonLine} ${styles.skeletonLineTitle}`}
                      />
                      <span className={styles.skeletonLine} />
                      <span
                        className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}
                      />
                    </span>
                  </div>
                ))
              : items.map((c) => {
                  // Prefer the admin-uploaded image from the backend; fall
                  // back to the bundled per-slug asset so tiles never
                  // render blank when a category is missing its upload.
                  const image = c.image || CATEGORY_IMAGES[c.slug];
                  const isRemote = typeof image === "string";
                  return (
                    <a
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      className={styles.card}
                      aria-label={`Browse ${c.name}`}
                    >
                      <span className={styles.cardMedia}>
                        {image && (
                          <Image
                            src={image}
                            alt={c.name}
                            fill
                            sizes="(max-width: 560px) 90vw, (max-width: 1024px) 45vw, 24vw"
                            className={styles.cardImg}
                            unoptimized={isRemote}
                          />
                        )}
                      </span>
                      <span className={styles.cardBody}>
                        <span className={styles.cardName}>{c.name}</span>
                        <span className={styles.cardNote}>{c.description}</span>
                        <span className={styles.cardCta}>
                          Explore Collection <span aria-hidden="true">&rarr;</span>
                        </span>
                      </span>
                      <span className={styles.cardCount}>
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          {/* Small package/box icon — matches the
                              mockup's product tag glyph. */}
                          <path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" />
                          <path d="M4 8l8 4 8-4" />
                          <path d="M12 12v8" />
                        </svg>
                        {c.count ?? 0} {(c.count ?? 0) === 1 ? "Product" : "Products"}
                      </span>
                    </a>
                  );
                })}
          </div>
        </div>
      </section>

      {/* ─────────── 4. Craft Essentials + DecorNArt Color Studio (2-column) ─────────── */}
      <section className={styles.colorStudio}>
        <div className="container">
          <div className={styles.studioLayout}>
            {/* Left: small Craft Essentials image-only card */}
            {craftEssentials && (
              <a
                href={`/category/${craftEssentials.slug}`}
                className={styles.craftCard}
                aria-label={`Browse ${craftEssentials.name}`}
              >
                <span className={styles.craftMedia}>
                  {CATEGORY_IMAGES[craftEssentials.slug] && (
                    <Image
                      src={CATEGORY_IMAGES[craftEssentials.slug]}
                      alt={craftEssentials.name}
                      fill
                      sizes="(max-width: 900px) 100vw, 32vw"
                      className={styles.craftImg}
                    />
                  )}
                </span>
              </a>
            )}

            {/* Right: wide DecorNArt Color Studio card */}
            <div className={styles.studioCard}>
              <Image
                src={pipecleanersImg}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 70vw"
                className={styles.studioBg}
              />
              <div className={styles.studioScrim} aria-hidden="true" />
              <div className={styles.studioCopy}>
                <h2 className={styles.studioTitle}>
                  DecorNArt
                  <br />
                  Color Studio
                </h2>
                <p className={styles.studioLead}>30+ Colors Available</p>
                <p className={styles.studioMeta}>
                  6mm &amp; 8mm &middot; 30cm &middot; 100 strands / bundle
                </p>
                <a href="/category/pipe-cleaners" className={styles.studioCta}>
                  View All Colors <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>

          {/* Full-width swatch row spanning under both cards. */}
          <ul className={styles.studioSwatches}>
            {visibleSwatches.map((sw) => (
              <li key={sw.name} className={styles.studioSwatchItem}>
                <span
                  className={styles.studioSwatch}
                  style={{ background: sw.hex }}
                  aria-hidden="true"
                />
                <span className={styles.studioSwatchName}>{sw.name}</span>
              </li>
            ))}
            {remainingSwatchCount > 0 && (
              <li className={styles.studioSwatchItem}>
                <a
                  href="/category/pipe-cleaners"
                  className={styles.studioSwatchMore}
                  aria-label={`View ${remainingSwatchCount} more colors`}
                >
                  +{remainingSwatchCount}
                </a>
                <span className={styles.studioSwatchName}>more</span>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* ─────────── 5. "Can't find" CTA banner ─────────── */}
      <section className={styles.cantFind}>
        <div className="container">
          <div className={styles.cantFindInner}>
            <div className={styles.cantFindCopy}>
              <h2 className={styles.cantFindTitle}>
                Still Exploring?
              </h2>
              <p className={styles.cantFindScript}>
                We have even more amazing
                <br />
                collections for you!
              </p>
              <a href="/shop" className={styles.cantFindCta}>
                View All Products <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
            <div className={styles.cantFindMedia}>
              <Image
                src={cantFindImg}
                alt="Bouquets and craft supplies"
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                className={styles.cantFindImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── 6. Bottom trust strip ─────────── */}
      <section className={styles.trustBottom}>
        <div className="container">
          <ul className={styles.trustList}>
            {TRUST_BOTTOM.map((t) => (
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

      {/* ─────────── 7. Instagram feed ─────────── */}
      <section className={styles.instagram}>
        <div className="container">
          <div className={styles.instaLayout}>
            <aside className={styles.instaCopy}>
              <span className={styles.instaEyebrow}>Follow our journey</span>
              <p className={styles.instaHandle}>@decornart.in</p>
              <ul className={styles.instaSocials}>
                <li>
                  <a href="https://instagram.com/decornart.in" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="YouTube"><FaYoutube /></a>
                </li>
                <li>
                  <a href="#" aria-label="Pinterest"><FaPinterest /></a>
                </li>
                <li>
                  <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
                </li>
              </ul>
            </aside>
            <ul className={styles.instaGrid}>
              {INSTA_POSTS.map((p) => (
                <li key={p.id} className={styles.instaTile}>
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 900px) 30vw, 14vw"
                    className={styles.instaImg}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
