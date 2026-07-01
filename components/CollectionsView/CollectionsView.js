"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  FaHeart,
  FaGem,
  FaUsers,
  FaUndo,
  FaShieldAlt,
  FaBoxes,
  FaArrowRight,
  FaWhatsapp,
} from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";
import Breadcrumb from "@/components/ui/Breadcrumb/Breadcrumb";
import bannerImg from "@/assets/banner-collection.png";
import {
  shopByCollection,
  featuredCollections,
  supportCards,
} from "@/lib/data/collectionsPage";
import styles from "./CollectionsView.module.css";

const TRUST = [
  { id: "handmade", icon: <FaHeart />, label: "Handmade with love", note: "Every piece is crafted with passion & care" },
  { id: "quality", icon: <FaGem />, label: "Premium quality", note: "We use the best materials always" },
  { id: "trust", icon: <FaUsers />, label: "Trusted by 10,000+", note: "Backed by 5-star reviews & repeat orders" },
  { id: "returns", icon: <FaUndo />, label: "Easy returns", note: "7 days hassle-free return policy" },
  { id: "secure", icon: <FaShieldAlt />, label: "Secure payment", note: "Razorpay-secured & SSL-encrypted checkout" },
];

const supportIcon = (id) => {
  if (id === "help") return <FaWhatsapp />;
  if (id === "bulk") return <FaBoxes />;
  return <FaGem />;
};

export default function CollectionsView() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(`.${styles.bannerInner} > *`, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
      });
      gsap.from(`.${styles.collectionCard}`, {
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.collectionGrid}`, start: "top 85%" },
      });
      gsap.from(`.${styles.pill}`, {
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.pillsTrack}`, start: "top 90%" },
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className={styles.page}>
      {/* ───────────── Hero banner ───────────── */}
      <section className={styles.banner} aria-label="Collections">
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
            items={[{ label: "Home", href: "/" }, { label: "Collections" }]}
          />
          <span className={styles.bannerEyebrow}>Curated with love</span>
          <h1 className={styles.bannerTitle}>
            Collections <br />
            <em>made to inspire</em>
          </h1>
          <p className={styles.bannerIntro}>
            Thoughtfully handcrafted collections for every occasion, creative
            idea and heartfelt gift.
          </p>
          <a href="#shop-by-collection" className={styles.bannerCta}>
            Explore all collections
            <span className={styles.bannerCtaArrow} aria-hidden="true">
              <FaArrowRight />
            </span>
          </a>
        </div>
      </section>

      {/* ───────────── Trust strip ───────────── */}
      <section className={styles.trustWrap}>
        <div className="container">
          <ul className={styles.trustStrip} aria-label="Why shop with us">
            {TRUST.map((t) => (
              <li key={t.id} className={styles.trustItem}>
                <span className={styles.trustIcon} aria-hidden="true">
                  {t.icon}
                </span>
                <span className={styles.trustCopy}>
                  <strong>{t.label}</strong>
                  <small>{t.note}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Shop by Collection ───────────── */}
      <section
        id="shop-by-collection"
        className={styles.section}
        aria-labelledby="shop-by-collection-h"
      >
        <div className="container">
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>— Browse our shelves</span>
            <h2 id="shop-by-collection-h" className={styles.sectionTitle}>
              Shop by <em>collection</em>
            </h2>
          </header>

          <div className={styles.collectionGrid}>
            {shopByCollection.map((c, i) => (
              <a
                key={c.slug}
                href={`/category/${c.slug}`}
                className={styles.collectionCard}
                aria-label={`Browse ${c.name}`}
              >
                <span className={styles.cardImage}>
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 560px) 90vw, (max-width: 1024px) 45vw, 24vw"
                  />
                  <span className={styles.cardIndex}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className={styles.cardCopy}>
                  <span className={styles.cardName}>{c.name}</span>
                  <span className={styles.cardNote}>{c.note}</span>
                  <span className={styles.cardMeta}>
                    <span className={styles.cardCount}>{c.count}+ products</span>
                    <span className={styles.cardArrow} aria-hidden="true">
                      <FaArrowRight />
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Featured Collections — circular pills ───────────── */}
      <section
        className={`${styles.section} ${styles.pillsSection}`}
        aria-labelledby="featured-collections-h"
      >
        <div className="container" style={{maxWidth: "1480px"}}>
          <header className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
            
            <span className={styles.eyebrow}>Featured collections</span>
            <h2 id="featured-collections-h" className={styles.sectionTitle}>
              Loved by <em>thousands</em>
            </h2>
            <p className={styles.sectionLead}>
              Signature ranges that keep our makers, gifters and brides coming
              back season after season.
            </p>
          </header>

          <ul className={styles.pillsTrack}>
            {featuredCollections.map((f, i) => (
              <li key={f.slug} className={styles.pill}>
                <a href={`/collection/${f.slug}`} className={styles.pillLink}>
                  <span className={styles.pillFrame} aria-hidden="true" />
                  <span className={styles.pillImage}>
                    <Image
                      src={f.image}
                      alt={f.name}
                      fill
                      sizes="(max-width: 760px) 33vw, 12vw"
                    />
                  </span>
                  <span className={styles.pillOrdinal} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.pillName}>{f.name}</span>
                  <span className={styles.pillShop}>Shop the line →</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Bulk / Custom / Help cards ───────────── */}
      <section className={styles.section} aria-labelledby="support-h">
        <div className="container">
          <header className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
            <span className={styles.eyebrow}>— Ways we can help</span>
            <h2 id="support-h" className={styles.sectionTitle}>
              For brands, gifts &amp; <em>everyday makers</em>
            </h2>
          </header>

          <div className={styles.supportGrid}>
            {supportCards.map((s) => (
              <a key={s.id} href={s.cta.href} className={styles.supportCard}>
                <span className={styles.supportCopy}>
                  <span className={styles.supportEyebrow}>{s.eyebrow}</span>
                  <span className={styles.supportTitle}>{s.title}</span>
                  <span className={styles.supportCta}>
                    {s.cta.label}
                    <FaArrowRight />
                  </span>
                </span>
                {s.image ? (
                  <span className={styles.supportImage}>
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="(max-width: 720px) 90vw, 30vw"
                    />
                  </span>
                ) : (
                  <span className={`${styles.supportImage} ${styles.supportIconBg}`}>
                    <span className={styles.supportBigIcon} aria-hidden="true">
                      {supportIcon(s.id)}
                    </span>
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
