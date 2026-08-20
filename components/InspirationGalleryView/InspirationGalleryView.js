"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import {
  FiGrid,
  FiGift,
  FiHome,
  FiHeart,
  FiEye,
  FiSearch,
  FiSliders,
  FiChevronDown,
  FiArrowRight,
  FiPackage,
} from "react-icons/fi";
import { PiFlowerFill, PiSparkleFill, PiLightbulbFill } from "react-icons/pi";
import heroImg from "@/assets/orderbg.png";
import newsletterImg from "@/assets/vase.png";
import { useBannerImage } from "@/hooks/useBannerImage";
import { useBannerContent } from "@/hooks/useBannerContent";
import {
  galleryHero,
  categoryFilters,
  sortOptions,
  galleryItems,
  shareCard,
  newsletter,
} from "@/lib/data/inspiration";
import styles from "./InspirationGalleryView.module.css";

const CHIP_ICONS = {
  gift: <FiGift />,
  bouquet: <PiFlowerFill />,
  home: <FiHome />,
  heart: <FiHeart />,
  bulb: <PiLightbulbFill />,
  grid: <FiGrid />,
};

const VALUE_ICONS = {
  flower: <PiFlowerFill />,
  sparkle: <PiSparkleFill />,
  gift: <FiPackage />,
};

export default function InspirationGalleryView() {
  const root = useRef(null);
  // Prefer the new dedicated "gallery-hero" slot; if the admin hasn't
  // published one, fall back to the legacy "inspiration-gallery-hero"
  // slot before finally landing on the bundled asset. Text overrides only
  // read from the primary slot — the legacy slot was image-only anyway.
  // `useBannerImage` returns null while its fetch is in flight (so we
  // don't flash a bundled asset before knowing the real backend value)
  // and `heroBanner.loaded` gates the primary slot the same way. Only
  // when both hooks have settled do we compose the final src.
  const legacySrc = useBannerImage("inspiration-gallery-hero", heroImg);
  const heroBanner = useBannerContent("gallery-hero");
  const heroSrc = heroBanner.loaded
    ? heroBanner.image || legacySrc || heroImg
    : null;
  const [activeCat, setActiveCat] = useState("all");
  const [sort, setSort] = useState(sortOptions[0]);
  const [sortOpen, setSortOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [liked, setLiked] = useState(() => new Set());

  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = galleryItems;
    if (activeCat !== "all") {
      list = list.filter((g) => g.tagId === activeCat);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.tag.toLowerCase().includes(q) ||
          g.copy.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCat, query]);

  const row1 = filtered.filter((g) => g.size !== "row2").slice(0, 5);
  const row2 = filtered.filter((g) => g.size === "row2");

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Inspiration Gallery">
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
            <h1 className={styles.heroTitle}>
              {heroBanner.text("title", galleryHero.title)}{" "}
              {heroBanner.loaded && (
                <span aria-hidden="true" className={styles.heroHeart}>
                  <FaHeart />
                </span>
              )}
            </h1>
            <p className={styles.heroScript}>
              {heroBanner.text("script", galleryHero.script)}
            </p>
            <p className={styles.heroLead}>
              {heroBanner.text("subtitle", galleryHero.lead)}
            </p>

            <ul className={styles.heroChips}>
              {galleryHero.chips.map((c) => (
                <li key={c.id} className={styles.heroChip}>
                  <span className={styles.heroChipIcon} aria-hidden="true">
                    {CHIP_ICONS[c.icon]}
                  </span>
                  <span className={styles.heroChipLabel}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Filter toolbar ─────────── */}
        <section className={styles.toolbar} aria-label="Filter gallery">
          <ul className={styles.catList}>
            {categoryFilters.map((c) => {
              const isActive = activeCat === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`${styles.catBtn} ${
                      isActive ? styles.catBtnActive : ""
                    }`}
                    onClick={() => setActiveCat(c.id)}
                    aria-pressed={isActive}
                  >
                    <span className={styles.catIcon} aria-hidden="true">
                      {CHIP_ICONS[c.icon]}
                    </span>
                    {c.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={styles.controls}>
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
                  {sortOptions.map((o) => (
                    <li key={o.id}>
                      <button
                        type="button"
                        className={`${styles.sortOption} ${
                          sort.id === o.id ? styles.sortOptionActive : ""
                        }`}
                        onClick={() => {
                          setSort(o);
                          setSortOpen(false);
                        }}
                        role="option"
                        aria-selected={sort.id === o.id}
                      >
                        {o.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="button" className={styles.filterBtn}>
              <FiSliders /> Filters
            </button>

            <div className={styles.searchWrap}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search inspiration..."
                className={styles.searchInput}
                aria-label="Search inspiration"
              />
              <button
                type="button"
                className={styles.searchBtn}
                aria-label="Search"
              >
                <FiSearch />
              </button>
            </div>
          </div>
        </section>

        {/* ─────────── 3. Gallery grid — row 1 ─────────── */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              <FiSearch />
            </span>
            <strong>No inspiration matched that.</strong>
            <span>Try a different search or category.</span>
          </div>
        ) : (
          <>
            {row1.length > 0 && (
              <ul className={styles.galleryRow1} aria-label="Featured">
                {row1.map((g) => (
                  <GalleryCard
                    key={g.id}
                    item={g}
                    liked={liked.has(g.id)}
                    onLike={() => toggleLike(g.id)}
                  />
                ))}
              </ul>
            )}
            {row2.length > 0 && (
              <ul className={styles.galleryRow2} aria-label="More inspiration">
                {row2.map((g) => (
                  <GalleryCard
                    key={g.id}
                    item={g}
                    liked={liked.has(g.id)}
                    onLike={() => toggleLike(g.id)}
                  />
                ))}
              </ul>
            )}
          </>
        )}

        {/* ─────────── 4. Share/values strip ─────────── */}
        <section className={styles.shareStrip} aria-label="Share your inspiration">
          <div className={styles.shareCopy}>
            <span className={styles.shareIcon} aria-hidden="true">
              <PiLightbulbFill />
            </span>
            <div className={styles.shareText}>
              <strong>{shareCard.title}</strong>
              <span>
                {shareCard.copy}{" "}
                <span aria-hidden="true" className={styles.shareHeart}>
                  <FaHeart />
                </span>
              </span>
            </div>
          </div>

          <ul className={styles.shareValues}>
            {shareCard.values.map((v) => (
              <li key={v.id} className={styles.shareValue}>
                <span className={styles.shareValueIcon} aria-hidden="true">
                  {VALUE_ICONS[v.icon]}
                </span>
                <span className={styles.shareValueText}>
                  <strong>{v.label}</strong>
                  <span>{v.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

/* ─── Sub-components ────────────────────────────────────────────── */

function GalleryCard({ item, liked, onLike }) {
  return (
    <li className={`${styles.card} ${styles[`card_${item.size}`]}`}>
      <div className={styles.cardMedia} aria-hidden="true">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(max-width: 720px) 90vw, 30vw"
          className={styles.cardImg}
        />
      </div>
      <div className={styles.cardShade} aria-hidden="true" />

      {item.badge && (
        <span
          className={`${styles.cardBadge} ${
            item.badge === "New" ? styles.cardBadgeNew : ""
          }`}
        >
          {item.badge === "Most Loved" && (
            <FaHeart aria-hidden="true" className={styles.cardBadgeIcon} />
          )}
          {item.badge}
        </span>
      )}

      <div className={styles.cardBody}>
        <span className={styles.cardTag}>{item.tag}</span>
        <h3 className={styles.cardTitle}>
          {item.title}{" "}
          <button
            type="button"
            className={`${styles.cardLike} ${liked ? styles.cardLikeOn : ""}`}
            onClick={onLike}
            aria-label={`Like ${item.title}`}
          >
            <FaHeart aria-hidden="true" />
          </button>
        </h3>
        <p className={styles.cardCopy}>{item.copy}</p>
        <ul className={styles.cardStats}>
          <li>
            <FaHeart aria-hidden="true" /> {item.likesFmt}
          </li>
          <li>
            <FiEye aria-hidden="true" /> {item.viewsFmt}
          </li>
        </ul>
      </div>
    </li>
  );
}
