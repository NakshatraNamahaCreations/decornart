"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";
import { useBannerContent } from "@/hooks/useBannerContent";
import { listInstagramPosts } from "@/lib/api/instagramPosts";
import heroImg from "@/assets/banner-collection.png";
import storyImg from "@/assets/luxe-rose/luxe-rose4.jpeg";
import whyImg from "@/assets/for-mother-gift/for-mother3.jpeg";
import passionImg from "@/assets/butterfly-luxury/luxury2.jpeg";
import peek1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import peek2 from "@/assets/butterfly-luxury/luxury2.jpeg";
import peek3 from "@/assets/for-you-bouquet/for-you3.jpeg";
import peek4 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import peek5 from "@/assets/for-mother-gift/for-mother4.jpeg";
import peek6 from "@/assets/butterfly-signature/signature1.jpeg";
import styles from "./AboutView.module.css";

const STATS = [
  {
    id: "products",
    top: "1000+",
    bottom: "Unique Artisan Products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M4 8l8-4 8 4-8 4-8-4z" />
        <path d="M4 12l8 4 8-4M4 16l8 4 8-4" />
      </svg>
    ),
  },
  {
    id: "customers",
    top: "10K+",
    bottom: "Happy Customers",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
      </svg>
    ),
  },
  {
    id: "love",
    top: "Made with",
    bottom: "Love & Care",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
];

const VISION_CARDS = [
  {
    id: "premium",
    title: "Premium Quality",
    copy: "We never compromise on the quality of our materials and finishes.",
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
    copy: "Thoughtfully designed creations that stand out and stay in your heart.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M4 12l4 4L20 6" strokeLinecap="round" />
        <path d="M12 3l3 6 6 .5-4.5 4 1.5 6L12 16" />
      </svg>
    ),
  },
  {
    id: "sustainable",
    title: "Sustainable Choice",
    copy: "Eco-friendly materials and responsible packaging.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20c8-2 12-6 14-14-6 0-10 2-12 6a8 8 0 0 0-2 8z" />
        <path d="M4 20c2-4 6-8 12-10" />
      </svg>
    ),
  },
];

const WHY_ITEMS = [
  {
    id: "beautiful",
    title: "100% Artisanal",
    copy: "Every piece is carefully crafted by skilled hands.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 14V6.5a1.5 1.5 0 0 1 3 0V12" />
        <path d="M13 12V5.5a1.5 1.5 0 0 1 3 0V13" />
        <path d="M16 13V7.5a1.5 1.5 0 0 1 3 0V15c0 4-3 6-6 6H9c-2 0-3.5-1-4-3l-2-6a1.5 1.5 0 0 1 3-1l1.5 4.5" />
      </svg>
    ),
  },
  {
    id: "premium",
    title: "Premium Materials",
    copy: "We use only the best quality materials.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 2l3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5l7-.5L12 2z" />
      </svg>
    ),
  },
  {
    id: "customer",
    title: "Customer First",
    copy: "Our customers are at the heart of everything we do.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
  {
    id: "occasion",
    title: "Perfect for Every Occasion",
    copy: "From birthdays to weddings, corporate gifts to just-because moments.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="1" />
        <path d="M3 12h18M12 8v12M8 8c-1-2 0-4 2-4s3 2 2 4M16 8c1-2 0-4-2-4s-3 2-2 4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "small",
    title: "Support Small Business",
    copy: "When you shop with us, you support real people, real dreams and real passion.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9l1.5-4h13L20 9" />
        <path d="M4 9v10h16V9" />
        <path d="M9 19v-5h6v5" />
      </svg>
    ),
  },
];

const PASSION_FEATURES = [
  {
    id: "design",
    title: "Thoughtful Design",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" />
      </svg>
    ),
  },
  {
    id: "detail",
    title: "Attention to Detail",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "love",
    title: "Packed with Love",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
];

const JOURNEY = [
  {
    id: "begin",
    year: "2019",
    title: "The Beginning",
    copy: "Started as a small passion project creating artisan gifts for loved ones.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M4 12l8-8 8 8v8h-5v-6H9v6H4v-8z" />
      </svg>
    ),
  },
  {
    id: "steps",
    year: "2020",
    title: "First Steps",
    copy: "Turned our passion into a brand — DecorNArt was born.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M12 8c-3 0-5-2-6-3 1-1 3 1 6 3z" fill="currentColor" />
        <path d="M12 8c3 0 5-2 6-3-1-1-3 1-6 3z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "grow",
    year: "2021-2022",
    title: "Growing Together",
    copy: "Expanded our collections and reached thousands of happy customers.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
  {
    id: "miles",
    year: "2023-2024",
    title: "New Milestones",
    copy: "Launched new product lines and strengthened our commitment to quality.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 3l3 6 6 .5-4.5 4 1.5 6L12 16l-6 3.5 1.5-6L3 9.5l6-.5L12 3z" />
      </svg>
    ),
  },
  {
    id: "future",
    year: "Beyond",
    title: "The Future",
    copy: "Continuing to create, inspire and be a part of your special moments.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="4" y="8" width="16" height="12" rx="1" />
        <path d="M4 12h16M12 8V4M8 4h8" strokeLinecap="round" />
      </svg>
    ),
  },
];

const PEEK_IMAGES = [
  { id: "p1", src: peek1, alt: "Artisan bouquet cone" },
  { id: "p2", src: peek2, alt: "Bouquet with cup" },
  { id: "p3", src: peek3, alt: "Thank you card composition" },
  { id: "p4", src: peek4, alt: "Hand-tied bouquet" },
  { id: "p5", src: peek5, alt: "Rose gift box" },
  { id: "p6", src: peek6, alt: "Welcome wreath" },
];

const SUPPORT = [
  {
    id: "bulk",
    title: "Bulk & Wholesale",
    copy: "Special pricing for bulk orders.",
    cta: { label: "Enquire Now", href: "/wholesale" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M4 8l8-4 8 4-8 4-8-4z" />
        <path d="M4 12l8 4 8-4M4 16l8 4 8-4" />
      </svg>
    ),
  },
  {
    id: "custom",
    title: "Custom Packaging",
    copy: "Perfect for branding & special occasions.",
    cta: { label: "Learn More", href: "/contact" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M3 8h18v12H3z" />
        <path d="M3 8l3-4h12l3 4M12 4v16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "safe",
    title: "Safe & Secure Payment",
    copy: "100% safe & secure checkout.",
    cta: { label: "Shop Now", href: "/shop" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "fast",
    title: "Fast Delivery",
    copy: "Pan India delivery in 3-7 business days.",
    cta: { label: "Know More", href: "/faq" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
];

export default function AboutView() {
  const root = useRef(null);
  const banner = useBannerContent("about-hero");
  const heroSrc = banner.loaded ? banner.image || heroImg : heroImg;

  // "Peek Into Our World" reuses the admin's Instagram posts — same source
  // as the homepage feed. Falls back to bundled PEEK_IMAGES when the API
  // has nothing (or is unreachable) so the section is never blank.
  const [remotePosts, setRemotePosts] = useState(null);
  useEffect(() => {
    let cancelled = false;
    listInstagramPosts()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) setRemotePosts(data);
      })
      .catch(() => {
        /* keep the static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const peekPosts = useMemo(() => {
    if (remotePosts && remotePosts.length > 0) {
      return remotePosts.slice(0, 6).map((p) => ({
        id: p.id,
        src: p.image,
        alt: p.alt || "Instagram post",
        link: p.link || "",
      }));
    }
    return PEEK_IMAGES.map((p) => ({ ...p, link: "" }));
  }, [remotePosts]);

  useGSAP(
    () => {
      gsap.from(`.${styles.heroInner} > *`, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from(`.${styles.visionCard}, .${styles.whyItem}, .${styles.journeyItem}, .${styles.peekTile}`, {
        opacity: 0,
        y: 20,
        duration: 0.55,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.section}`, start: "top 90%" },
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className={styles.page}>
      {/* ────────────── 1. Hero banner ────────────── */}
      <section className={styles.hero} aria-label="About us">
        <Image
          src={heroSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImg}
          unoptimized={typeof heroSrc === "string"}
        />
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.heroEyebrow}>
            {banner.text("eyebrow", "About Us")}
          </span>
          <h1 className={styles.heroTitle}>
            {banner.loaded && banner.title ? (
              banner.title
            ) : (
              <>
                The story behind
                <br />
                DecorNArt
              </>
            )}
          </h1>
          <p className={styles.heroScript}>
            {banner.loaded && banner.script ? (
              <>
                {banner.script} <span aria-hidden="true">&hearts;</span>
              </>
            ) : (
              <>
                Handcrafted for moments
                <br />
                that matter <span aria-hidden="true">&hearts;</span>
              </>
            )}
          </p>
          <p className={styles.heroLead}>
            {banner.loaded && banner.subtitle ? (
              banner.subtitle
            ) : (
              <>
                We believe every gift tells a story, every detail
                <br />
                carries love, and every artisan creation
                <br />
                has the power to create beautiful memories.
              </>
            )}
          </p>
        </div>
      </section>

      {/* ────────────── 2. Our Story ────────────── */}
      <section className={`${styles.section} ${styles.storySection}`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyCopy}>
              <span className={styles.eyebrow}>
                Our Story <span aria-hidden="true">&hearts;</span>
              </span>
              <h2 className={styles.storyTitle}>
                It started with a dream
                <br />
                and a little <em>creativity.</em>
              </h2>
              <span className={styles.storyRule} aria-hidden="true" />
              <p>
                DecorNArt was born out of a simple love for artisan creations
                and the joy they bring to people&rsquo;s lives.
              </p>
              <p>
                What began as a small passion project soon turned into
                a purpose &mdash; to design, create and deliver unique,{" "}
                <strong>meaningful and premium quality artisan products</strong>{" "}
                that make every occasion extra special.
              </p>
              <p>
                From a tiny workspace to a growing brand, our journey
                has been filled with learning, love and the constant
                support of our amazing customers.
              </p>
            </div>

            <div className={styles.storyCard}>
              <div className={styles.storyImage}>
                <Image
                  src={storyImg}
                  alt="Artisan bouquet"
                  fill
                  sizes="(max-width: 900px) 90vw, 30vw"
                  className={styles.storyImg}
                />
              </div>
              <ul className={styles.statsCol}>
                {STATS.map((s) => (
                  <li key={s.id} className={styles.statItem}>
                    <span className={styles.statIcon} aria-hidden="true">
                      {s.icon}
                    </span>
                    <span className={styles.statText}>
                      <strong>{s.top}</strong>
                      <span>{s.bottom}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── 3. Our Vision ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.visionGrid}>
            <div className={styles.visionCard}>
              <span className={styles.visionEyebrow}>
                Our Vision <span aria-hidden="true">&hearts;</span>
              </span>
              <h2 className={styles.visionTitle}>
                To be India&rsquo;s most loved artisan brand.
              </h2>
              <p className={styles.visionCopy}>
                We envision a world where artistry is cherished, creativity is
                celebrated and every gift becomes a beautiful memory that lasts
                forever.
              </p>
            </div>
            <ul className={styles.visionCards}>
              {VISION_CARDS.map((v) => (
                <li key={v.id} className={styles.visionItem}>
                  <span className={styles.visionItemIcon} aria-hidden="true">
                    {v.icon}
                  </span>
                  <strong>{v.title}</strong>
                  <span>{v.copy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ────────────── 4. Why DecorNArt? ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.whyGrid}>
            <div className={styles.whyCopy}>
              <span className={styles.eyebrow}>
                Why DecorNArt? <span aria-hidden="true">&hearts;</span>
              </span>
              <ul className={styles.whyList}>
                {WHY_ITEMS.map((w) => (
                  <li key={w.id} className={styles.whyItem}>
                    <span className={styles.whyIcon} aria-hidden="true">
                      {w.icon}
                    </span>
                    <div className={styles.whyText}>
                      <strong>{w.title}</strong>
                      <span>{w.copy}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.whyImage}>
              <Image
                src={whyImg}
                alt="Handcrafted bouquet composition"
                fill
                sizes="(max-width: 900px) 90vw, 45vw"
                className={styles.whyImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── 5. Artisan Passion ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.passionGrid}>
            <div className={styles.passionImage}>
              <Image
                src={passionImg}
                alt="Hands crafting a flower"
                fill
                sizes="(max-width: 900px) 90vw, 30vw"
                className={styles.passionImg}
              />
            </div>
            <div className={styles.passionCopy}>
              <span className={styles.eyebrow}>
                Artisan Passion <span aria-hidden="true">&hearts;</span>
              </span>
              <h2 className={styles.passionTitle}>
                Made by hands,
                <br />
                filled with <em>heart.</em>
                <span aria-hidden="true"> &hearts;</span>
              </h2>
              <p>
                Each creation goes through countless little steps — from
                choosing the right materials to the final finishing touches.
                It&rsquo;s not just a product, it&rsquo;s our love, time and
                creativity woven into something beautiful for you.
              </p>
            </div>
            <ul className={styles.passionFeatures}>
              {PASSION_FEATURES.map((p) => (
                <li key={p.id} className={styles.passionFeature}>
                  <span className={styles.passionIcon} aria-hidden="true">
                    {p.icon}
                  </span>
                  <span>{p.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ────────────── 6. Our Journey timeline ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <span className={styles.eyebrow}>
            Our Journey <span aria-hidden="true">&hearts;</span>
          </span>
          <div className={styles.journeyWrap}>
            <div className={styles.journeyLine} aria-hidden="true" />
            <ol className={styles.journeyGrid}>
              {JOURNEY.map((j) => (
                <li key={j.id} className={styles.journeyItem}>
                  <span className={styles.journeyIcon} aria-hidden="true">
                    {j.icon}
                  </span>
                  <strong className={styles.journeyTitle}>{j.title}</strong>
                  <span className={styles.journeyYear}>{j.year}</span>
                  <span className={styles.journeyCopy}>{j.copy}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ────────────── 7. A Peek Into Our World ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.peekHead}>
            <h2 className={styles.peekTitle}>
              A Peek Into Our World <span aria-hidden="true">&hearts;</span>
            </h2>
            <p className={styles.peekSub}>
              Follow our journey, behind the scenes &amp; happy moments.
            </p>
          </div>
          <ul className={styles.peekGrid}>
            {peekPosts.map((p) => {
              const media = (
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 900px) 30vw, 14vw"
                  className={styles.peekImg}
                  unoptimized={typeof p.src === "string"}
                />
              );
              return (
                <li key={p.id} className={styles.peekTile}>
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.alt}
                    >
                      {media}
                    </a>
                  ) : (
                    media
                  )}
                </li>
              );
            })}
          </ul>
          <div className={styles.peekCta}>
            <a
              href="https://www.instagram.com/decornart.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.peekBtn}
            >
              <FaInstagram /> Follow us @decornart.in
            </a>
          </div>
        </div>
      </section>

      {/* ────────────── 8. Bottom support strip ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <ul className={styles.supportGrid}>
            {SUPPORT.map((s) => (
              <li key={s.id} className={styles.supportItem}>
                <span className={styles.supportIcon} aria-hidden="true">
                  {s.icon}
                </span>
                <div className={styles.supportBody}>
                  <strong>{s.title}</strong>
                  <span>{s.copy}</span>
                  <a href={s.cta.href} className={styles.supportCta}>
                    {s.cta.label} <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
