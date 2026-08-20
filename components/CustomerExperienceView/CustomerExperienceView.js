"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import {
  FiHeart,
  FiShoppingBag,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiArrowRight,
  FiShield,
  FiRotateCcw,
  FiAward,
} from "react-icons/fi";
import heroImg from "@/assets/orderbg.png";
import ctaImg from "@/assets/vase.png";
import {
  reviewStats,
  reviewFilters,
  sortOptions,
  reviews,
  customerPhotos,
  trustStrip,
  heroCopy,
} from "@/lib/data/reviews";
import styles from "./CustomerExperienceView.module.css";

const TRUST_ICONS = {
  beautiful: <FaHeart />,
  premium: <FiAward />,
  safe: <FiShield />,
  returns: <FiRotateCcw />,
  loved: <FiHeart />,
};

const TOTAL_PAGES = 42;

function Stars({ value = 5, size = 12 }) {
  return (
    <span
      className={styles.stars}
      style={{ fontSize: `${size}px` }}
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < value ? styles.starFull : styles.starEmpty}
        />
      ))}
    </span>
  );
}

export default function CustomerExperienceView() {
  const root = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState(sortOptions[0]);
  const [page, setPage] = useState(1);

  const visibleReviews = useMemo(() => {
    if (activeFilter === "all") return reviews;
    if (activeFilter === "photos") return reviews;
    const star = Number(activeFilter);
    return reviews.filter((r) => r.rating === star);
  }, [activeFilter]);

  const pages = useMemo(() => {
    // Simplified pagination display: 1, 2, 3, ..., 42
    if (page <= 2) return [1, 2, 3, "…", TOTAL_PAGES];
    if (page >= TOTAL_PAGES - 1)
      return [1, "…", TOTAL_PAGES - 2, TOTAL_PAGES - 1, TOTAL_PAGES];
    return [1, "…", page, "…", TOTAL_PAGES];
  }, [page]);

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Customer experience">
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
            <span className={styles.heroEyebrow}>{heroCopy.eyebrow}</span>
            <h1 className={styles.heroTitle}>
              {heroCopy.titleLine1}
              <br />
              <span className={styles.heroTitleAccent}>
                {heroCopy.titleLine2}{" "}
                <span aria-hidden="true" className={styles.heroHeart}>
                  <FaHeart />
                </span>
              </span>
            </h1>
            <p className={styles.heroLead}>{heroCopy.lead}</p>
          </div>
        </div>
        <button type="button" className={styles.reviewTab}>
          <FiEdit3 />
          <span>Write a Review</span>
        </button>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Ratings overview ─────────── */}
        <section className={styles.overview} aria-label="Ratings overview">
          <div className={styles.overallCol}>
            <span className={styles.overallLabel}>Overall Rating</span>
            <strong className={styles.overallScore}>
              {reviewStats.overall.toFixed(1)}
            </strong>
            <Stars value={5} size={14} />
            <span className={styles.overallMeta}>
              Based on {reviewStats.totalReviews.toLocaleString("en-IN")} reviews
            </span>
          </div>

          <div className={styles.breakdownCol}>
            {reviewStats.breakdown.map((row) => (
              <div key={row.stars} className={styles.breakdownRow}>
                <span className={styles.breakdownStar}>
                  {row.stars} <FaStar aria-hidden="true" />
                </span>
                <span
                  className={styles.breakdownBar}
                  aria-hidden="true"
                >
                  <span
                    className={styles.breakdownFill}
                    style={{ width: `${row.percent}%` }}
                  />
                </span>
                <span className={styles.breakdownPct}>{row.percent}%</span>
              </div>
            ))}
          </div>

          <div className={styles.statsCol}>
            <div className={styles.statCard}>
              <span className={styles.statIcon} aria-hidden="true">
                <FiHeart />
              </span>
              <strong className={styles.statValue}>
                {reviewStats.happyCustomers.toLocaleString("en-IN")}+
              </strong>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon} aria-hidden="true">
                <FiAward />
              </span>
              <strong className={styles.statValue}>
                {reviewStats.overall.toFixed(1)}/5
              </strong>
              <span className={styles.statLabel}>Average Rating</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon} aria-hidden="true">
                <FiShoppingBag />
              </span>
              <strong className={styles.statValue}>
                {reviewStats.ordersDelivered.toLocaleString("en-IN")}+
              </strong>
              <span className={styles.statLabel}>Orders Delivered</span>
            </div>
          </div>
        </section>

        {/* ─────────── 3. Filters + sort ─────────── */}
        <section className={styles.controls} aria-label="Filter reviews">
          <ul className={styles.filterList}>
            {reviewFilters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${
                      isActive ? styles.filterBtnActive : ""
                    }`}
                    onClick={() => {
                      setActiveFilter(f.id);
                      setPage(1);
                    }}
                    aria-pressed={isActive}
                  >
                    {f.label}
                    {f.star && (
                      <FaStar
                        aria-hidden="true"
                        className={styles.filterStar}
                      />
                    )}
                    <span className={styles.filterCount}>
                      ({f.count.toLocaleString("en-IN")})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={styles.sortWrap}>
            <button
              type="button"
              className={styles.sortBtn}
              onClick={() => setSortOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
            >
              {sort.label}
              <FiChevronDown
                className={`${styles.sortChev} ${
                  sortOpen ? styles.sortChevOpen : ""
                }`}
              />
            </button>
            {sortOpen && (
              <ul className={styles.sortMenu} role="listbox">
                {sortOptions.map((opt) => (
                  <li key={opt.id}>
                    <button
                      type="button"
                      className={`${styles.sortOption} ${
                        sort.id === opt.id ? styles.sortOptionActive : ""
                      }`}
                      onClick={() => {
                        setSort(opt);
                        setSortOpen(false);
                      }}
                      role="option"
                      aria-selected={sort.id === opt.id}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ─────────── 4. Reviews grid ─────────── */}
        <section className={styles.reviewGrid} aria-label="Customer reviews">
          {visibleReviews.map((r) => (
            <article key={r.id} className={styles.reviewCard}>
              <header className={styles.reviewHead}>
                <span
                  className={styles.avatar}
                  style={{ background: r.accent }}
                  aria-hidden="true"
                >
                  {r.initials}
                </span>
                <div className={styles.reviewIdentity}>
                  <span className={styles.reviewName}>
                    {r.name}
                    {r.verified && (
                      <span className={styles.verified} title="Verified buyer">
                        <FaCheckCircle aria-hidden="true" />
                        <span>Verified</span>
                      </span>
                    )}
                  </span>
                  <span className={styles.reviewDate}>{r.date}</span>
                </div>
              </header>

              <Stars value={r.rating} size={13} />

              <p className={styles.reviewText}>{r.text}</p>

              <div className={styles.reviewProduct}>
                <span className={styles.reviewMedia}>
                  <Image
                    src={r.productImage}
                    alt={r.productName}
                    fill
                    sizes="220px"
                    className={styles.reviewImg}
                  />
                </span>
                <span className={styles.reviewProductName}>
                  {r.productName}
                </span>
              </div>

              <span className={styles.reviewTag}>
                <FiHeart aria-hidden="true" /> {r.tag}
              </span>
            </article>
          ))}
        </section>

        {/* ─────────── 5. Pagination ─────────── */}
        <nav className={styles.pagination} aria-label="Reviews pagination">
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <FiChevronLeft />
          </button>
          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`e${i}`} className={styles.pageEllipsis}>
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`${styles.pageBtn} ${
                  page === p ? styles.pageBtnActive : ""
                }`}
                onClick={() => setPage(p)}
                aria-current={page === p ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={page === TOTAL_PAGES}
            aria-label="Next page"
          >
            <FiChevronRight />
          </button>
        </nav>

        {/* ─────────── 6. Customer photos ─────────── */}
        <section className={styles.gallery} aria-label="Customer photos">
          <header className={styles.galleryHead}>
            <div>
              <h2 className={styles.galleryTitle}>
                Real Love from Real Customers{" "}
                <span aria-hidden="true" className={styles.galleryHeart}>
                  <FaHeart />
                </span>
              </h2>
              <p className={styles.gallerySub}>
                Unfiltered moments captured by our amazing customers.
              </p>
            </div>
            <Link href="#gallery" className={styles.galleryLink}>
              View All Photos <FiArrowRight />
            </Link>
          </header>
          <ul className={styles.galleryGrid}>
            {customerPhotos.map((p) => (
              <li key={p.id} className={styles.galleryItem}>
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 720px) 45vw, 200px"
                  className={styles.galleryImg}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 7. Trust strip ─────────── */}
        <section className={styles.trustStrip} aria-label="Why customers trust us">
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

        {/* ─────────── 8. Share experience CTA ─────────── */}
        <section className={styles.ctaBanner} aria-label="Share your experience">
          <span className={styles.ctaIcon} aria-hidden="true">
            <FiEdit3 />
          </span>
          <div className={styles.ctaCopy}>
            <strong>Share Your Experience</strong>
            <span>
              We would love to hear from you! Your review helps us grow and
              helps other customers make the right choice.
            </span>
          </div>
          <Link href="#write" className={styles.ctaBtn}>
            <FiEdit3 /> Write a Review <FiArrowRight />
          </Link>
          <div className={styles.ctaMedia} aria-hidden="true">
            <Image
              src={ctaImg}
              alt=""
              fill
              sizes="220px"
              className={styles.ctaImg}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
