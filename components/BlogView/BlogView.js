"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import bouquet1 from "@/assets/blog1.png";
import bouquet2 from "@/assets/blog5.png";
import bouquet_2 from "@/assets/blog7.png";
import collect1 from "@/assets/blog4.png";
import collect2 from "@/assets/blog3.png";
import collect3 from "@/assets/blog2.png";
import collect4 from "@/assets/blog8.png";
import collect5 from "@/assets/blog6.png";
import styles from "./BlogView.module.css";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "stories", label: "Stories" },
  { id: "guides", label: "Guides" },
  { id: "atelier", label: "Behind the atelier" },
  { id: "seasonal", label: "Seasonal" },
];

const POSTS = [
  {
    id: "p1",
    category: "stories",
    title: "What a hand-tied bouquet says when words won't.",
    excerpt:
      "On the quiet language of a single stem placed deliberately — and why our atelier prefers it to grand arrangements.",
    author: "Aanya R., Editor",
    date: "12 May 2026",
    readMin: 4,
    image: bouquet1,
    featured: true,
  },
  {
    id: "p2",
    category: "guides",
    title: "Choosing a bouquet for an anniversary, by year.",
    excerpt:
      "Roses for the first, peonies for the fifth, lilies for the tenth — a short, opinionated guide.",
    author: "Atelier desk",
    date: "06 May 2026",
    readMin: 6,
    image: collect3,
  },
  {
    id: "p3",
    category: "atelier",
    title: "A morning at our Bandra studio.",
    excerpt:
      "From 6 AM stem deliveries to the last bouquet tied at noon — what a typical Saturday looks like.",
    author: "Atelier desk",
    date: "29 Apr 2026",
    readMin: 5,
    image: collect2,
  },
  {
    id: "p4",
    category: "seasonal",
    title: "The five flowers that define an Indian summer.",
    excerpt:
      "Marigold, jasmine, lotus, frangipani, mogra — our florist's notes on form, scent and the heat.",
    author: "Riya S., Florist",
    date: "22 Apr 2026",
    readMin: 7,
    image: collect1,
  },
  {
    id: "p5",
    category: "guides",
    title: "Sympathy flowers — what to send, and when.",
    excerpt:
      "A gentle handbook for one of the more difficult gestures. On colour, timing and the message card.",
    author: "Atelier desk",
    date: "14 Apr 2026",
    readMin: 5,
    image: bouquet2,
  },
  {
    id: "p6",
    category: "stories",
    title: "A bouquet for the Monday morning desk.",
    excerpt:
      "We sent the same arrangement to twelve workplaces — and asked what changed.",
    author: "Aanya R., Editor",
    date: "07 Apr 2026",
    readMin: 4,
    image: collect5,
  },
  {
    id: "p7",
    category: "atelier",
    title: "How we source our flowers — and why it matters.",
    excerpt:
      "Three farms, two cooperatives and a slow promise we made ourselves. Notes on provenance.",
    author: "Atelier desk",
    date: "01 Apr 2026",
    readMin: 8,
    image: bouquet_2,
  },
  {
    id: "p8",
    category: "seasonal",
    title: "Monsoon florals — wilder, looser, alive.",
    excerpt:
      "Why we shift the studio palette in July, and the three arrangements we return to every year.",
    author: "Riya S., Florist",
    date: "24 Mar 2026",
    readMin: 5,
    image: collect4,
  },
];

const TUTORIALS = [
  {
    id: "t1",
    title: "Your first hand-tied bouquet, in fifteen minutes.",
    summary:
      "Five stems, a spiral grip and a length of silk ribbon — a beginner's first arrangement.",
    duration: "15 min",
    difficulty: "Beginner",
    steps: 6,
    image: collect2,
  },
  {
    id: "t2",
    title: "Build a low table arrangement for a dinner.",
    summary:
      "A loose, asymmetrical bowl with seasonal stems — perfect for a long table.",
    duration: "30 min",
    difficulty: "Intermediate",
    steps: 8,
    image: collect3,
  },
  {
    id: "t3",
    title: "Dry your bouquet beautifully — a complete guide.",
    summary:
      "Three methods, the right hooks and the room you should choose. From wedding flowers to keepsakes.",
    duration: "10 days",
    difficulty: "Beginner",
    steps: 4,
    image: collect1,
  },
  {
    id: "t4",
    title: "A small Diwali centerpiece with marigold and rose.",
    summary:
      "Festive, fragrant and finished in twenty minutes. Includes a candle pairing chart.",
    duration: "20 min",
    difficulty: "Intermediate",
    steps: 7,
    image: collect4,
  },
];

export default function BlogView() {
  const root = useRef(null);
  const feedRef = useRef(null);
  const [category, setCategory] = useState("all");
  const [activeId, setActiveId] = useState(null);
  const visible = useMemo(
    () =>
      category === "all"
        ? POSTS
        : POSTS.filter((p) => p.category === category),
    [category]
  );

  const labelFor = (id) =>
    CATEGORIES.find((c) => c.id === id)?.label ?? id;

  /* Highlight the article currently in view in the sticky TOC. */
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return undefined;
    const items = feed.querySelectorAll(`[data-article]`);
    if (!items.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (inView) setActiveId(inView.target.dataset.article);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.5, 1] }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [visible.length]);

  const scrollTo = (id) => {
    const el = document.querySelector(`[data-article="${id}"]`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

useGSAP(
    () => {
      gsap.from(
        `.${styles.maskhead} > *, .${styles.crumbs}`,
        { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }
      );
      gsap.from(`.${styles.toc}`, {
        opacity: 0,
        x: -20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });
      gsap.from(`[data-article]`, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.feed}`, start: "top 85%" },
      });
gsap.from(`.${styles.tutCard}`, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.tutGrid}`, start: "top 85%" },
      });
    },
    { scope: root, dependencies: [category] }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className={styles.crumbSep}>·</span>
          <span className={styles.crumbActive}>Journal & DIY</span>
        </nav>

        {/* Masthead */}
        <header className={styles.maskhead}>
          <div className={styles.maskMeta}>
            <span className={styles.editionTag}>N° 04 · May 2026</span>
            <span className={styles.maskRuleH} aria-hidden="true" />
            <span className={styles.maskLabel}>The Decornart Journal</span>
          </div>
          <h1 className={styles.maskheading}>
            Notes from the <em>atelier</em>.
          </h1>
          <p className={styles.maskLead}>
            Pieces from our florists, occasion guides and step-by-step
            flower arrangement tutorials — written and curated by Decornart.
          </p>
        </header>

        {/* Split layout */}
        <div className={styles.layout}>
          {/* ───────── Sticky TOC rail ───────── */}
          <aside className={styles.toc} aria-label="In this issue">
            <div className={styles.tocInner}>
              <div className={styles.tocHead}>
                <span className={styles.tocOrd}>04</span>
                <div>
                  <span className={styles.tocEyebrow}>In this issue</span>
                  <h2 className={styles.tocHeading}>Contents</h2>
                </div>
              </div>

              <div className={styles.tocChips} role="tablist">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={category === c.id}
                    onClick={() => setCategory(c.id)}
                    className={`${styles.tocChip} ${
                      category === c.id ? styles.tocChipActive : ""
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <ol className={styles.tocList}>
                {visible.map((p, i) => (
                  <li
                    key={p.id}
                    className={`${styles.tocItem} ${
                      activeId === p.id ? styles.tocItemActive : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => scrollTo(p.id)}
                      className={styles.tocLink}
                    >
                      <span className={styles.tocItemOrd}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.tocItemBody}>
                        <span className={styles.tocItemTitle}>{p.title}</span>
                        <span className={styles.tocItemMeta}>
                          {labelFor(p.category)} · {p.readMin} min
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              <a href="#tutorials" className={styles.tocFoot}>
                ↓ Jump to DIY tutorials
              </a>
            </div>
          </aside>

          {/* ───────── Article feed ───────── */}
          <div className={styles.feed} ref={feedRef}>
            {visible.length === 0 ? (
              <p className={styles.empty}>
                No pieces in this category yet — try another.
              </p>
            ) : (
              visible.map((p, i) => (
                <article
                  key={p.id}
                  data-article={p.id}
                  className={`${styles.article} ${
                    p.featured ? styles.articleFeatured : ""
                  }`}
                >
                  <a href={`/blog/${p.id}`} className={styles.articleLink}>
                    <div className={styles.articleImage}>
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        priority={i === 0}
                      />
                      {p.featured && (
                        <span className={styles.articleBadge}>
                          The cover piece
                        </span>
                      )}
                      
                    </div>
                    <div className={styles.articleBody}>
                      <span className={styles.articleCat}>
                        {labelFor(p.category)}
                      </span>
                      <h2 className={styles.articleTitle}>{p.title}</h2>
                      <p className={styles.articleExcerpt}>{p.excerpt}</p>
                      <div className={styles.articleMeta}>
                        <span>{p.author}</span>
                        <span className={styles.metaDot}>·</span>
                        <span>{p.date}</span>
                        <span className={styles.metaDot}>·</span>
                        <span>{p.readMin} min read</span>
                      </div>
                      <span className={styles.readMore}>
                        Read the piece <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </a>

                </article>
              ))
            )}

            {/* ───────── DIY tutorials ───────── */}
            <section
              id="tutorials"
              className={styles.tutorials}
              aria-labelledby="tut-head"
            >
              <div className={styles.sectionLabel}>
                <span className={styles.sectionLabelOrd}>— DIY at home</span>
                <h2 id="tut-head" className={styles.sectionLabelHeading}>
                  Flower arrangement <em>tutorials</em>.
                </h2>
                <span className={styles.maskRuleH} aria-hidden="true" />
                <p className={styles.maskLead}>
                  Step-by-step guides written and tested by our florists.
                </p>
              </div>

              <div className={styles.tutGrid}>
                {TUTORIALS.map((t, i) => (
                  <a
                    key={t.id}
                    href={`/blog/tutorial/${t.id}`}
                    className={styles.tutCard}
                  >
                    <div className={styles.tutImage}>
                      <Image
                        src={t.image}
                        alt={t.title}
                        fill
                        sizes="(max-width: 540px) 90vw, (max-width: 1024px) 45vw, 24vw"
                      />
                    </div>
                    <div className={styles.tutMeta}>
                      <span className={styles.tutPill}>{t.difficulty}</span>
                      <span className={styles.tutDot}>·</span>
                      <span>{t.duration}</span>
                      <span className={styles.tutDot}>·</span>
                      <span>{t.steps} steps</span>
                    </div>
                    <h3 className={styles.tutTitle}>{t.title}</h3>
                    <p className={styles.tutSummary}>{t.summary}</p>
                    <span className={styles.readMore}>
                      Open the tutorial <span aria-hidden="true">→</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </section>
  );
}
