"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import {
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiUsers,
  FiArrowRight,
  FiClock,
  FiGift,
  FiZap,
  FiMail,
  FiTag,
} from "react-icons/fi";
import heroImg from "@/assets/offerbg.png";
import {
  heroOffer,
  trustStrip,
  topOffers,
  seasonalSale,
  comboDeals,
  newsletter,
} from "@/lib/data/offers";
import { useBannerContent } from "@/hooks/useBannerContent";
import styles from "./OffersView.module.css";

const TRUST_ICONS = {
  shipping: <FiTruck />,
  secure: <FiShield />,
  returns: <FiRotateCcw />,
  beautiful: <FaHeart />,
  trusted: <FiUsers />,
};

const PERK_ICONS = {
  limited: <FiClock />,
  best: <FiGift />,
  miss: <FaHeart />,
};

export default function OffersView() {
  const root = useRef(null);
  const heroBanner = useBannerContent("offers-hero");
  const heroSrc = heroBanner.loaded ? heroBanner.image || heroImg : null;

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Special offers">
        <div className={styles.heroDeco} aria-hidden="true">
          {heroSrc && (
            <Image
              src={heroSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.heroImg}
            />
          )}
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}>
              {heroBanner.text("eyebrow", heroOffer.eyebrow)}
            </span>
            <h1 className={styles.heroTitle}>
              {heroBanner.loaded && (
                heroBanner.title ? (
                  <>
                    {heroBanner.title}
                    {heroBanner.script && (
                      <>
                        <br />
                        <span className={styles.heroTitleAccent}>
                          {heroBanner.script}
                          <span aria-hidden="true" className={styles.heroHeart}>
                            <FaHeart />
                          </span>
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {heroOffer.titleLine1}
                    <br />
                    <span className={styles.heroTitleAccent}>
                      {heroOffer.titleLine2}
                      <span aria-hidden="true" className={styles.heroHeart}>
                        <FaHeart />
                      </span>
                    </span>
                  </>
                )
              )}
            </h1>
            <p className={styles.heroLead}>
              {heroBanner.text("subtitle", heroOffer.lead)}
            </p>
            {heroBanner.loaded && (
              <Link
                href={heroBanner.href || heroOffer.cta.href}
                className={styles.heroCta}
              >
                {heroBanner.ctaLabel || heroOffer.cta.label} <FiArrowRight />
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Trust strip ─────────── */}
        <section className={styles.trustStrip} aria-label="Why shop with us">
          <ul className={styles.trustList}>
            {trustStrip.map((t) => (
              <li key={t.id} className={styles.trustRow}>
                <span className={styles.trustIcon} aria-hidden="true">
                  {TRUST_ICONS[t.id]}
                </span>
                <span className={styles.trustText}>
                  <strong>{t.title}</strong>
                  <span>{t.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 3. Top Offers ─────────── */}
        <section className={styles.topSection} aria-label="Top offers">
          <header className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              Top Offers For You{" "}
              <span aria-hidden="true" className={styles.sectionHeart}>
                <FaHeart />
              </span>
            </h2>
            <Link href="/shop" className={styles.viewAll}>
              View All Offers <FiArrowRight />
            </Link>
          </header>

          <ul className={styles.offerGrid}>
            {topOffers.map((o) => (
              <li key={o.id} className={styles.offerItem}>
                <div
                  className={`${styles.offerCard} ${styles[`tone_${o.tone}`]}`}
                >
                  <div className={styles.offerBg} aria-hidden="true">
                    <Image
                      src={o.image}
                      alt=""
                      fill
                      sizes="(max-width: 720px) 90vw, 25vw"
                      className={styles.offerBgImg}
                    />
                  </div>

                  <div className={styles.offerBody}>
                    <span className={styles.offerEyebrow}>{o.eyebrow}</span>
                    <strong className={styles.offerHeadline}>
                      {o.headline}
                    </strong>
                    <strong className={styles.offerDiscount}>
                      {o.discount}
                    </strong>
                    <p className={styles.offerCopy}>{o.copy}</p>

                    {o.code ? (
                      <Link href={o.href} className={styles.offerCode}>
                        Use Code: <em>{o.code}</em>
                      </Link>
                    ) : (
                      <Link href={o.cta.href} className={styles.offerCta}>
                        {o.cta.label} <FiArrowRight />
                      </Link>
                    )}
                  </div>
                </div>

                <span className={styles.offerFoot}>
                  <FiZap aria-hidden="true" /> Limited Time Offer
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 4. Seasonal Sale ─────────── */}
        <section
          className={styles.seasonal}
          aria-label="Seasonal sale"
        >
          <div className={styles.seasonalCopy}>
            <h2 className={styles.seasonalTitle}>
              {seasonalSale.title.split(" ")[0]}{" "}
              <span className={styles.seasonalScript}>
                {seasonalSale.title.split(" ").slice(1).join(" ")}
              </span>{" "}
              <span aria-hidden="true" className={styles.seasonalHeart}>
                <FaHeart />
              </span>
            </h2>
            <p className={styles.seasonalLead}>{seasonalSale.lead}</p>
            <Link
              href={seasonalSale.cta.href}
              className={styles.seasonalCta}
            >
              {seasonalSale.cta.label} <FiArrowRight />
            </Link>
          </div>

          <div className={styles.seasonalDiscount}>
            <span className={styles.seasonalPre}>
              {seasonalSale.discount.pre}
            </span>
            <span className={styles.seasonalBigWrap}>
              <strong className={styles.seasonalBig}>
                {seasonalSale.discount.value}
              </strong>
              <span className={styles.seasonalUnit}>
                {seasonalSale.discount.unit}
              </span>
            </span>
            <span className={styles.seasonalOn}>
              {seasonalSale.discount.on}
            </span>
          </div>

          <ul className={styles.seasonalPerks}>
            {seasonalSale.perks.map((p) => (
              <li key={p.id} className={styles.seasonalPerk}>
                <span className={styles.seasonalPerkIcon} aria-hidden="true">
                  {PERK_ICONS[p.id]}
                </span>
                <span className={styles.seasonalPerkText}>
                  <strong>{p.title}</strong>
                  <span>{p.copy}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.seasonalMedia} aria-hidden="true">
            <Image
              src={seasonalSale.image}
              alt=""
              fill
              sizes="260px"
              className={styles.seasonalImg}
            />
          </div>
        </section>

        {/* ─────────── 5. Combo Deals ─────────── */}
        <section className={styles.comboSection} aria-label="Combo deals">
          <header className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              Combo Deals{" "}
              <span aria-hidden="true" className={styles.sectionHeart}>
                <FaHeart />
              </span>
            </h2>
            <Link href="/shop" className={styles.viewAll}>
              View All Combos <FiArrowRight />
            </Link>
          </header>

          <ul className={styles.comboGrid}>
            {comboDeals.map((c) => (
              <li key={c.id} className={styles.comboCard}>
                <Link href={c.href} className={styles.comboMedia}>
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 720px) 90vw, 22vw"
                    className={styles.comboImg}
                  />
                  <span className={styles.comboBadge}>{c.discount}% OFF</span>
                </Link>
                <div className={styles.comboBody}>
                  <h3 className={styles.comboTitle}>
                    <Link href={c.href}>{c.title}</Link>
                  </h3>
                  <p className={styles.comboCopy}>{c.copy}</p>
                  <div className={styles.comboPrice}>
                    <strong>{c.priceFmt}</strong>
                    <span>{c.strikeFmt}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
