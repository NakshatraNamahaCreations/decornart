"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import {
  FiArrowRight,
  FiUsers,
  FiStar,
  FiGift,
  FiGlobe,
  FiCheck,
  FiPackage,
  FiTrendingUp,
  FiTag,
  FiShoppingBag,
  FiAward,
  FiShield,
  FiTruck,
  FiRotateCcw,
} from "react-icons/fi";
import { PiHandshakeFill, PiLightbulbFill, PiPaletteFill, PiMegaphoneFill, PiConfettiFill } from "react-icons/pi";
import heroImg from "@/assets/orderbg.png";
import vaseImg from "@/assets/vase.png";
import featuredImg from "@/assets/diyimg.png";
import partnerLogo from "@/assets/imgdiy.png";
import styles from "./BrandPartnersView.module.css";

const HERO_PILLS = [
  {
    id: "meaningful",
    title: "Meaningful Collaborations",
    copy: "Built on trust and shared values",
    icon: <PiHandshakeFill />,
  },
  {
    id: "quality",
    title: "Premium Quality",
    copy: "Only the best for our customers",
    icon: <FiAward />,
  },
  {
    id: "creative",
    title: "Creative Excellence",
    copy: "Innovative ideas, beautiful results",
    icon: <PiLightbulbFill />,
  },
  {
    id: "growing",
    title: "Growing Together",
    copy: "Long term relationships that inspire",
    icon: <FaHeart />,
  },
];

const STATS = [
  { id: "partners", value: "50+", label: "Trusted Partners", icon: <FiUsers /> },
  { id: "collab", value: "100+", label: "Successful Collaborations", icon: <FiStar /> },
  { id: "customers", value: "10,000+", label: "Happy Customers Together", icon: <FiGift /> },
  { id: "cities", value: "5+", label: "Cities & Regions", icon: <FiGlobe /> },
];

const FEATURED_PARTNER = {
  brand: "MR.D.I.Y.",
  tagline: "Always Low Prices",
  role: "Retail Partner",
  blurb:
    "Building creative experiences together for thousands of happy customers.",
};

const BRAND_LOGOS = [
  { id: "prism", name: "PRISM", sub: "RIBBONS" },
  { id: "royaloak", name: "ROYALOAK", sub: "International" },
  { id: "events", name: "events", sub: "FACTORY" },
  { id: "blinkit", name: "blinkit", sub: "India's Last Minute App" },
  { id: "amazon", name: "amazon", sub: "" },
  { id: "flipkart", name: "Flipkart", sub: "" },
  { id: "meesho", name: "meesho", sub: "" },
  { id: "asianet", name: "ASIANET", sub: "SUVARNA" },
  { id: "more", name: "& Many More", sub: "Partners…", more: true },
];

const WHY_PARTNER = [
  {
    id: "premium",
    title: "Premium Products",
    copy: "High quality products loved by thousands.",
    icon: <FiPackage />,
  },
  {
    id: "creative",
    title: "Creative Innovation",
    copy: "Unique designs and custom solutions for every brand.",
    icon: <PiPaletteFill />,
  },
  {
    id: "reach",
    title: "Wide Reach",
    copy: "Strong online presence across multiple platforms.",
    icon: <PiMegaphoneFill />,
  },
  {
    id: "trusted",
    title: "Trusted Brand",
    copy: "A brand customers trust for quality, service and creativity.",
    icon: <FiTrendingUp />,
  },
  {
    id: "marketing",
    title: "Marketing Support",
    copy: "We support our partners with promotions and engagement.",
    icon: <FiTag />,
  },
  {
    id: "growth",
    title: "Long Term Growth",
    copy: "We believe in building relationships that grow together.",
    icon: <FiUsers />,
  },
];

const PARTNERSHIP_BULLETS = [
  "Wholesale & Bulk Collaborations",
  "Co-branding Opportunities",
  "Custom Packaging Solutions",
  "Events & Gifting Partnerships",
  "Affiliate & Influencer Partnerships",
];

const TESTIMONIALS = [
  {
    id: "mrdiy",
    quote:
      "Working with DecorNArt has been a wonderful experience. Their products are top-notch, beautifully crafted and our customers love them! The team is supportive, reliable and truly passionate about what they do.",
    brand: "MR.D.I.Y.",
    tagline: "Always Low Prices",
    name: "MR DIY India",
    role: "Retail Partner",
  },
  {
    id: "prism",
    quote:
      "The DecorNArt team consistently delivers beyond expectations. Every drop feels considered, brand-right with genuine care — our customers keep coming back for more.",
    brand: "PRISM",
    tagline: "RIBBONS",
    name: "Prism Ribbons",
    role: "Retail Partner",
  },
  {
    id: "events",
    quote:
      "From ideation to delivery, DecorNArt has been a joy to collaborate with. Their attention to detail elevates every event we produce together.",
    brand: "events",
    tagline: "FACTORY",
    name: "Events Factory",
    role: "Events Partner",
  },
];

const COLLAB_AREAS = [
  { id: "retail", title: "Retail Partnerships", icon: <FiShoppingBag /> },
  { id: "corporate", title: "Corporate Gifting", icon: <FiGift /> },
  { id: "events", title: "Event Collaborations", icon: <PiConfettiFill /> },
  { id: "branding", title: "Custom Branding", icon: <FiAward /> },
  { id: "bulk", title: "Bulk & Wholesale", icon: <FiPackage /> },
  { id: "influencer", title: "Influencer Partnerships", icon: <FiUsers /> },
];

const TRUST_STRIP = [
  { id: "secure", title: "Secure Payments", copy: "100% safe & secure", icon: <FiShield /> },
  { id: "delivery", title: "Pan India Delivery", copy: "Fast & reliable shipping", icon: <FiTruck /> },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: <FiRotateCcw /> },
  { id: "beautiful", title: "Curated with Love", copy: "Crafted with passion", icon: <FaHeart /> },
  { id: "happy", title: "10,000+ Happy Customers", copy: "Trust & love us", icon: <FiUsers /> },
];

export default function BrandPartnersView() {
  const root = useRef(null);
  const [logoPage, setLogoPage] = useState(0);
  const [testiIdx, setTestiIdx] = useState(0);

  const logoPagesCount = 3;
  const testi = TESTIMONIALS[testiIdx];

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Our brand partners">
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
            <span className={styles.heroEyebrow}>
              Stronger Together{" "}
              <span aria-hidden="true" className={styles.eyebrowHeart}>
                <FaHeart />
              </span>
            </span>
            <h1 className={styles.heroTitle}>
              Our Brand Partners,
              <br />
              Our Journey{" "}
              <span aria-hidden="true" className={styles.heroHeart}>
                <FaHeart />
              </span>
            </h1>
            <p className={styles.heroLead}>
              We collaborate with amazing brands who share our passion for
              creativity, quality and crafting beautiful experiences that
              inspire.
            </p>
            <Link href="#partner" className={styles.heroBtn}>
              Partner With Us <FiArrowRight />
            </Link>

            <ul className={styles.heroPills}>
              {HERO_PILLS.map((p) => (
                <li key={p.id} className={styles.heroPill}>
                  <span className={styles.heroPillIcon} aria-hidden="true">
                    {p.icon}
                  </span>
                  <span className={styles.heroPillText}>
                    <strong>{p.title}</strong>
                    <span>{p.copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Stats strip ─────────── */}
        <section className={styles.statsStrip} aria-label="Partnership numbers">
          <ul className={styles.statsList}>
            {STATS.map((s) => (
              <li key={s.id} className={styles.statItem}>
                <span className={styles.statIcon} aria-hidden="true">
                  {s.icon}
                </span>
                <span className={styles.statBody}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 3. Trusted by leading brands ─────────── */}
        <section className={styles.brandsSection} aria-label="Trusted brands">
          <header className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              Trusted by Leading Brands{" "}
              <span aria-hidden="true" className={styles.sectionHeart}>
                <FaHeart />
              </span>
            </h2>
            <p className={styles.sectionSub}>
              Proud to be chosen by brands that believe in craftsmanship and
              creativity.
            </p>
          </header>

          <div className={styles.brandsRow}>
            {/* Featured card */}
            <article className={styles.featuredCard}>
              <div className={styles.featuredMedia}>
                <Image
                  src={featuredImg}
                  alt={`${FEATURED_PARTNER.brand} — Featured Partner`}
                  fill
                  sizes="(max-width: 960px) 100vw, 440px"
                  className={styles.featuredImg}
                />
              </div>
              <button
                type="button"
                className={styles.featuredArrow}
                aria-label="View partner"
              >
                <FiArrowRight />
              </button>
            </article>

            {/* Logo grid */}
            <ul className={styles.logoGrid}>
              {BRAND_LOGOS.map((b) => (
                <li
                  key={b.id}
                  className={`${styles.logoCard} ${
                    b.more ? styles.logoCardMore : ""
                  }`}
                >
                  <strong className={styles.logoName}>{b.name}</strong>
                  {b.sub && <span className={styles.logoSub}>{b.sub}</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination dots */}
          <div className={styles.brandDots} role="tablist" aria-label="Logo pages">
            {Array.from({ length: logoPagesCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={logoPage === i}
                aria-label={`Page ${i + 1}`}
                onClick={() => setLogoPage(i)}
                className={`${styles.dot} ${
                  logoPage === i ? styles.dotActive : ""
                }`}
              />
            ))}
          </div>
        </section>

        {/* ─────────── 4. Why brands partner ─────────── */}
        <section className={styles.whySection} aria-label="Why partner with us">
          <header className={styles.whyHead}>
            <h2 className={styles.whyTitle}>
              Why Brands Partner With DecorNArt?{" "}
              <span aria-hidden="true" className={styles.whyHeart}>
                <FaHeart />
              </span>
            </h2>
          </header>
          <ul className={styles.whyGrid}>
            {WHY_PARTNER.map((w) => (
              <li key={w.id} className={styles.whyItem}>
                <span className={styles.whyIcon} aria-hidden="true">
                  {w.icon}
                </span>
                <strong className={styles.whyName}>{w.title}</strong>
                <span className={styles.whyCopy}>{w.copy}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 5. Partner + Testimonial ─────────── */}
        <section id="partner" className={styles.partnerRow}>
          {/* Left — Partner With Us */}
          <article className={styles.partnerCard}>
            <div className={styles.partnerCopy}>
              <h2 className={styles.partnerTitle}>
                Partner With Us{" "}
                <span aria-hidden="true" className={styles.partnerHeart}>
                  <FaHeart />
                </span>
              </h2>
              <p className={styles.partnerLead}>
                Join hands with DecorNArt and let&rsquo;s create something
                extraordinary together.
              </p>
              <ul className={styles.partnerBullets}>
                {PARTNERSHIP_BULLETS.map((b, i) => (
                  <li key={i}>
                    <FiCheck aria-hidden="true" /> {b}
                  </li>
                ))}
              </ul>
              <Link href="/wholesale" className={styles.partnerBtn}>
                Join Our Partner Network <FiArrowRight />
              </Link>
            </div>
            <div className={styles.partnerMedia} aria-hidden="true">
              <Image
                src={vaseImg}
                alt=""
                fill
                sizes="300px"
                className={styles.partnerImg}
              />
            </div>
          </article>

          {/* Right — Testimonial */}
          <article className={styles.testiCard}>
            <span className={styles.testiQuote} aria-hidden="true">
              &ldquo;
            </span>
            <p className={styles.testiText}>{testi.quote}</p>
            <div className={styles.testiFoot}>
              <span
                className={styles.testiBrandLogo}
                aria-label={testi.brand}
              >
                <Image
                  src={partnerLogo}
                  alt={testi.brand}
                  fill
                  sizes="120px"
                  className={styles.testiBrandImg}
                />
              </span>
              <span className={styles.testiPerson}>
                <strong>{testi.name}</strong>
                <span>{testi.role}</span>
              </span>
            </div>
            <div className={styles.testiDots} role="tablist" aria-label="Testimonials">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={testiIdx === i}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setTestiIdx(i)}
                  className={`${styles.dot} ${
                    testiIdx === i ? styles.dotActive : ""
                  }`}
                />
              ))}
            </div>
          </article>
        </section>

        {/* ─────────── 6. We collaborate in ─────────── */}
        <section className={styles.collabSection}>
          <header className={styles.collabHead}>
            <h2 className={styles.collabTitle}>
              We Collaborate In{" "}
              <span aria-hidden="true" className={styles.collabHeart}>
                <FaHeart />
              </span>
            </h2>
          </header>
          <ul className={styles.collabList}>
            {COLLAB_AREAS.map((c) => (
              <li key={c.id} className={styles.collabItem}>
                <span className={styles.collabIcon} aria-hidden="true">
                  {c.icon}
                </span>
                <span className={styles.collabLabel}>{c.title}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 7. Trust strip ─────────── */}
        <section className={styles.trustStrip}>
          <ul className={styles.trustList}>
            {TRUST_STRIP.map((t) => (
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
