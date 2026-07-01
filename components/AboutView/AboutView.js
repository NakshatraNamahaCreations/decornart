"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  FaHeart,
  FaGem,
  FaBoxOpen,
  FaLeaf,
  FaStar,
  FaShieldAlt,
  FaTruck,
  FaArrowRight,
  FaSeedling,
  FaHome,
  FaRocket,
  FaTrophy,
  FaHandHoldingHeart,
  FaAward,
} from "react-icons/fa";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Breadcrumb from "@/components/ui/Breadcrumb/Breadcrumb";
import InstagramFeed from "@/components/InstagramFeed/InstagramFeed";
import heroImg from "@/assets/bannerimg1.png";
import storyImg from "@/assets/luxe-rose/luxe-rose4.jpeg";
import passionImg from "@/assets/handmade1.png";
import styles from "./AboutView.module.css";

const VISION_POINTS = [
  "Handmade is cherished, not commodified.",
  "Every detail is composed by a real person.",
  "Materials are sourced — never aggregated.",
];

const MANIFESTO = [
  { id: "handmade", icon: <FaHandHoldingHeart />, title: "100% Handmade", note: "Crafted by skilled hands — never automated, never rushed." },
  { id: "materials", icon: <FaGem />, title: "Premium materials", note: "From named suppliers we visit ourselves. Always traceable." },
  { id: "customer", icon: <FaHeart />, title: "Customer first", note: "From the first message to the final unboxing — we're with you." },
  { id: "occasion", icon: <FaStar />, title: "Every occasion", note: "Weddings, birthdays, corporate gifts, just-because moments." },
  { id: "sustain", icon: <FaLeaf />, title: "Sustainable choice", note: "Eco-friendly materials and responsible packaging." },
  { id: "small", icon: <FaAward />, title: "Small batch", note: "We won't scale past what our makers can compose by hand." },
];

const PASSION_FEATURES = [
  { id: "design", icon: <FaGem />, line1: "Thoughtful", line2: "Design" },
  { id: "detail", icon: <FaStar />, line1: "Attention to", line2: "Detail" },
  { id: "love", icon: <FaHeart />, line1: "Packed with", line2: "Love" },
];

const JOURNEY = [
  { id: "begin", year: "2019", icon: <FaHome />, title: "The beginning", note: "A small passion project — gifts for friends and family." },
  { id: "steps", year: "2020", icon: <FaSeedling />, title: "First steps", note: "Passion became a brand — DecorNArt was born." },
  { id: "grow", year: "2021–22", icon: <FaHeart />, title: "Growing together", note: "Collections expanded, a real maker community formed." },
  { id: "miles", year: "2023–24", icon: <FaTrophy />, title: "New milestones", note: "New product lines, deeper craft, broader reach." },
  { id: "future", year: "Beyond", icon: <FaRocket />, title: "The future", note: "We keep making, keep showing up for your moments." },
];

const SUPPORT = [
  { id: "bulk", icon: <FaBoxOpen />, label: "Bulk & wholesale", href: "/wholesale" },
  { id: "custom", icon: <FaGem />, label: "Custom packaging", href: "/contact" },
  { id: "secure", icon: <FaShieldAlt />, label: "Secure payment", href: "/shop" },
  { id: "fast", icon: <FaTruck />, label: "Fast delivery", href: "/faq" },
];

export default function AboutView() {
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
      gsap.from(`.${styles.bentoCell}`, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.bento}`, start: "top 82%" },
      });
      gsap.from(`.${styles.manifestoCard}`, {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.manifestoGrid}`, start: "top 85%" },
      });
      const mm = gsap.matchMedia();

      /* Desktop — pin the journey + scrub-reveal each card on scroll */
      mm.add("(min-width: 861px)", () => {
        const sectionEl = root.current?.querySelector(`.${styles.journey}`);
        if (!sectionEl) return;
        const cards = gsap.utils.toArray(
          sectionEl.querySelectorAll(`.${styles.jCard}`)
        );
        const railFill = sectionEl.querySelector(`.${styles.journeyRuleFill}`);
        if (!cards.length) return;

        gsap.set(cards, { opacity: 0, y: 30 });
        if (railFill) gsap.set(railFill, { scaleX: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top+=40",
            end: () => "+=" + window.innerHeight * 2.2,
            scrub: 0.8,
            pin: sectionEl,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, i) => {
          const fraction = (i + 1) / cards.length;
          if (railFill) {
            tl.to(railFill, { scaleX: fraction, ease: "none", duration: 0.18 }, i * 0.5);
          }
          tl.to(
            card,
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.22 },
            i * 0.5 + 0.06
          );
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      });

      /* Mobile — no pin, simple staggered reveal */
      mm.add("(max-width: 860px)", () => {
        gsap.from(`.${styles.jCard}`, {
          opacity: 0,
          y: 18,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: `.${styles.journeyStrip}`, start: "top 85%" },
        });
      });

      gsap.from(`.${styles.passionFeature}`, {
        opacity: 0,
        x: 16,
        duration: 0.55,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.passionGrid}`, start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className={styles.page}>
      {/* ───────────── Banner — Categories-style full-bleed ───────────── */}
      <section className={styles.banner} aria-label="About Decor N Art">
        <Image
          src={heroImg}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.bannerImg}
        />
        <div className={styles.bannerScrim} aria-hidden="true" />
        <div className={`container ${styles.bannerInner}`}>
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "About us" }]}
          />
          <span className={styles.bannerEyebrow}>About us</span>
          <h1 className={styles.bannerTitle}>
            The story behind <br />
            <em>DecorNArt</em>
          </h1>
          <p className={styles.bannerIntro}>
            We believe every gift tells a story, every detail carries love,
            and every handmade creation has the power to create beautiful
            memories.
          </p>
          <span className={styles.bannerMeta}>
            Handcrafted for moments that matter
          </span>
        </div>
      </section>

      {/* ───────────── BENTO — story + vision in one row ───────────── */}
      <section className={`${styles.section} ${styles.bento}`} id="our-story">
        <div className={`container ${styles.bentoGrid}`}>
          {/* Tall image */}
          <figure className={`${styles.bentoCell} ${styles.bentoImage}`}>
            <Image
              src={storyImg}
              alt="Inside the atelier"
              fill
              sizes="(max-width: 1024px) 90vw, 28vw"
            />
          </figure>

          {/* Story copy with drop-cap and pull-quote */}
          <article className={`${styles.bentoCell} ${styles.bentoStory}`}>
            <span className={styles.eyebrow}>— A founder's note</span>
            <h2 className={styles.bentoTitle}>
              It started with a dream <br />
              and a little <em>creativity</em>.
            </h2>
            <p className={styles.bentoCopy}>
              <span className={styles.dropCap}>D</span>
              ecorNArt was born from a simple love for handmade things — and
              the joy they bring. A passion project became a purpose: to
              design, create and deliver{" "}
              <strong>meaningful, premium-quality handmade products</strong>{" "}
              that make every occasion extra special.
            </p>
            <blockquote className={styles.pullQuote}>
              "What we make today is finite. Tomorrow it will be different.
              That is the nature of handmade."
            </blockquote>
            <div className={styles.signature}>
              <span className={styles.signatureName}>Decor N Art</span>
              <span className={styles.signatureRole}>Founder &amp; Atelier</span>
            </div>
          </article>

          {/* Vision dark card */}
          <aside className={`${styles.bentoCell} ${styles.bentoVision}`}>
            <span className={styles.visionEyebrow}>Our vision</span>
            <h3 className={styles.visionTitle}>
              India's most loved <em>handmade brand</em>.
            </h3>
            <ul className={styles.visionList}>
              {VISION_POINTS.map((p, i) => (
                <li key={i}>
                  <span className={styles.visionTick} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <span className={styles.visionMark} aria-hidden="true">
              <FaLeaf />
            </span>
          </aside>
        </div>
      </section>

      {/* ───────────── MANIFESTO — 3×2 dense grid ───────────── */}
      <section className={`${styles.section} ${styles.manifesto}`}>
        <div className={`container ${styles.manifestoLayout}`}>
          <header className={styles.manifestoHead}>
            <span className={styles.eyebrow}>— Why us</span>
            <h2 className={styles.sectionTitle}>
              Six rules. <em>No compromise.</em>
            </h2>
            <p className={styles.sectionLead}>
              Written down so we never forget them. Spelled out so you know
              what you're paying for.
            </p>
          </header>

          <ol className={styles.manifestoGrid}>
            {MANIFESTO.map((m, i) => (
              <li key={m.id} className={styles.manifestoCard}>
                <span className={styles.manifestoNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.manifestoIcon} aria-hidden="true">
                  {m.icon}
                </span>
                <h3 className={styles.manifestoCardTitle}>{m.title}</h3>
                <p className={styles.manifestoCardNote}>{m.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────── JOURNEY — compact horizontal strip ───────────── */}
      <section className={`${styles.section} ${styles.journey}`}>
        <div className={`container ${styles.journeyLayout}`}>
          <header className={styles.journeyHead}>
            <span className={styles.eyebrow}>— Our journey</span>
            <h2 className={styles.sectionTitle}>
              Six years of <em>making</em>.
            </h2>
          </header>

          <div className={styles.journeyStrip}>
            <span className={styles.journeyRule} aria-hidden="true" />
            <span className={styles.journeyRuleFill} aria-hidden="true" />
            {JOURNEY.map((j, i) => (
              <article
                key={j.id}
                className={`${styles.jCard} ${
                  i % 2 === 0 ? styles.jCardUp : styles.jCardDown
                }`}
              >
                <div className={styles.jPanel}>
                  <span className={styles.jIconCircle} aria-hidden="true">
                    {j.icon}
                  </span>
                  <span className={styles.jYear}>{j.year}</span>
                  <h3 className={styles.jTitle}>{j.title}</h3>
                  <p className={styles.jNote}>{j.note}</p>
                </div>
                <span className={styles.jAnchor} aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── PASSION — image · copy · 3-feature column ───────────── */}
      <section className={`${styles.section} ${styles.passion}`}>
        <div className={`container ${styles.passionGrid}`}>
          <div className={styles.passionImage}>
            <Image
              src={passionImg}
              alt="Hands shaping a handmade crochet flower"
              fill
              sizes="(max-width: 1024px) 90vw, 35vw"
            />
          </div>

          <div className={styles.passionCopy}>
            <span className={styles.passionEyebrow}>
              Handmade passion <FaHeart className={styles.passionHeart} />
            </span>
            <h2 className={styles.passionTitle}>
              Made by hands, <br />
              filled with <em>heart</em>.
            </h2>
            <p className={styles.passionBody}>
              Each creation goes through countless little steps — from
              choosing the right materials to the final finishing touches.
              It's not just a product, it's our love, time and creativity
              woven into something beautiful for you.
            </p>
          </div>

          <ul className={styles.passionFeatures}>
            {PASSION_FEATURES.map((f) => (
              <li key={f.id} className={styles.passionFeature}>
                <span className={styles.passionFeatureIcon} aria-hidden="true">
                  {f.icon}
                </span>
                <span className={styles.passionFeatureLabel}>
                  <strong>{f.line1}</strong>
                  <strong>{f.line2}</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Instagram strip ───────────── */}
      <InstagramFeed />

      
    </main>
  );
}
