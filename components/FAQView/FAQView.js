"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaPinterest,
  FaYoutube,
  FaHeart,
} from "react-icons/fa";
import {
  FiGrid,
  FiTruck,
  FiPackage,
  FiCreditCard,
  FiRotateCcw,
  FiShoppingBag,
  FiUser,
  FiPlus,
  FiMinus,
  FiSearch,
  FiHelpCircle,
  FiGift,
  FiMessageSquare,
  FiArrowRight,
  FiShield,
  FiAward,
} from "react-icons/fi";
import heroImg from "@/assets/orderbg.png";
import vaseImg from "@/assets/vase.png";
import styles from "./FAQView.module.css";

const CATEGORIES = [
  { id: "all", label: "All Questions", sub: "View all", icon: <FiGrid /> },
  { id: "orders", label: "Orders & Shipping", sub: "17 Questions", icon: <FiTruck /> },
  { id: "products", label: "Products", sub: "15 Questions", icon: <FiPackage /> },
  { id: "payments", label: "Payments", sub: "10 Questions", icon: <FiCreditCard /> },
  { id: "returns", label: "Returns & Refunds", sub: "12 Questions", icon: <FiRotateCcw /> },
  { id: "wholesale", label: "Wholesale", sub: "8 Questions", icon: <FiShoppingBag /> },
  { id: "account", label: "Account", sub: "9 Questions", icon: <FiUser /> },
];

const FAQS = [
  {
    id: "shipping",
    cat: "orders",
    q: "What are your shipping charges and delivery time?",
    a: {
      lead: "We offer free shipping on all orders above ₹2500 across India. For orders below ₹2500, a flat shipping fee of ₹90 will be applied.",
      subHead: "Delivery time varies by location:",
      bullets: [
        "Metro cities: 2 – 4 business days",
        "Other cities: 4 – 7 business days",
        "Remote areas: 7 – 10 business days",
      ],
      trail: "Once your order is shipped, you will receive a tracking link via SMS and email.",
    },
  },
  {
    id: "track",
    cat: "orders",
    q: "How can I track my order?",
    a: "Use the Track Your Order page with your Order ID or Tracking ID. We also email every status change so you know exactly where your parcel is at every step.",
  },
  {
    id: "cod",
    cat: "payments",
    q: "Do you offer cash on delivery (COD)?",
    a: "Yes, COD is available on eligible pincodes for orders up to ₹5,000. A small COD handling fee of ₹40 will be applied at checkout.",
  },
  {
    id: "methods",
    cat: "payments",
    q: "What payment methods do you accept?",
    a: "We accept UPI (Google Pay, PhonePe, Paytm), all major debit/credit cards (Visa, Mastercard, RuPay), Net Banking, popular wallets, EMI, and Cash on Delivery.",
  },
  {
    id: "modify",
    cat: "orders",
    q: "Can I modify or cancel my order after placing it?",
    a: "You can modify or cancel your order within 2 hours of placing it — reach us on WhatsApp or email with your Order ID and we'll take care of the rest.",
  },
  {
    id: "wholesale",
    cat: "wholesale",
    q: "Do you offer wholesale or bulk discounts?",
    a: "Yes — we offer tiered pricing for bulk orders and reseller partnerships. Head to our Wholesale page or email wholesale@decornart.in with your requirement.",
  },
  {
    id: "support",
    cat: "account",
    q: "How can I contact customer support?",
    a: "You can reach us on WhatsApp, phone (10 AM – 7 PM), email official@decornart.in, or via live chat on this website. We aim to reply within a few hours.",
  },
  {
    id: "intl",
    cat: "orders",
    q: "Do you ship internationally?",
    a: "We currently ship across India. International shipping is available on request for select countries — please contact our support team for a custom quote.",
  },
 
  {
    id: "returns",
    cat: "returns",
    q: "Can I return or exchange my order?",
    a: "You have 7 days from delivery to request a return or exchange for any unused item in its original packaging. Refunds are processed within 5 business days.",
  },
];

const POPULAR_TOPICS = [
  { id: "orders", title: "Orders & Shipping", copy: "Everything about placing and tracking orders", icon: <FiTruck /> },
  { id: "products", title: "Products & Materials", copy: "Information about our products", icon: <FiShoppingBag /> },
  { id: "payments", title: "Payments & Pricing", copy: "Payment methods, pricing & offers", icon: <FiCreditCard /> },
  { id: "returns", title: "Returns & Refunds", copy: "Return policy & refund process", icon: <FiRotateCcw /> },
  { id: "wholesale", title: "Wholesale & Bulk Orders", copy: "Bulk pricing and reseller program", icon: <FiPackage /> },
  { id: "account", title: "Account & Profile", copy: "Login, account, and profile related", icon: <FiUser /> },
  { id: "custom", title: "Custom Orders", copy: "Customizations and special requests", icon: <FiGift /> },
];

const CONTACT_METHODS = [
  { id: "wa", title: "WhatsApp Us", copy: "Chat with us instantly", sub: "+91 9986988786", href: "https://wa.me/919876543210", icon: <FaWhatsapp />, tone: "wa" },
  { id: "call", title: "Call Us", copy: "(10 AM – 7 PM)", sub: "+91 9986988786", href: "tel:+919876543210", icon: <FaPhone />, tone: "blush" },
  { id: "email", title: "Email Us", copy: "Drop us an email", sub: "official@decornart.in", href: "mailto:official@decornart.in", icon: <FaEnvelope />, tone: "blush" },
  { id: "chat", title: "Live Chat", copy: "Chat with our team", sub: "Available on website", href: "#chat", icon: <FiMessageSquare />, tone: "blush" },
];

const SOCIALS = [
  { id: "ig", href: "https://instagram.com/decornart.in", icon: <FaInstagram />, label: "Instagram" },
  { id: "pin", href: "https://pinterest.com/decornart", icon: <FaPinterest />, label: "Pinterest" },
  { id: "yt", href: "https://youtube.com/@decornart", icon: <FaYoutube />, label: "YouTube" },
  { id: "wa", href: "https://wa.me/919876543210", icon: <FaWhatsapp />, label: "WhatsApp" },
];

const BOTTOM_TRUST = [
  { id: "secure", title: "Secure Payments", copy: "100% safe & secure", icon: <FiShield /> },
  { id: "delivery", title: "Pan India Delivery", copy: "Fast & reliable shipping", icon: <FiTruck /> },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: <FiRotateCcw /> },
  { id: "premium", title: "Curated with Love", copy: "Crafted with passion", icon: <FaHeart /> },
  { id: "happy", title: "10,000+ Happy Customers", copy: "Trust & love us", icon: <FiAward /> },
];

export default function FAQView() {
  const root = useRef(null);
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const filtered = useMemo(() => {
    return FAQS.filter((f) => {
      if (activeCat !== "all" && f.cat !== activeCat) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      const answerText =
        typeof f.a === "string"
          ? f.a
          : `${f.a.lead || ""} ${f.a.subHead || ""} ${(f.a.bullets || []).join(" ")} ${f.a.trail || ""}`;
      return f.q.toLowerCase().includes(q) || answerText.toLowerCase().includes(q);
    });
  }, [activeCat, query]);

  const totalForCategory =
    activeCat === "all" ? FAQS.length : FAQS.filter((f) => f.cat === activeCat).length;

  const toggle = (id) => setOpenFaq((prev) => (prev === id ? null : id));

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Frequently asked questions">
        <div className={styles.heroDeco} aria-hidden="true">
          <Image src={heroImg} alt="" fill priority sizes="100vw" className={styles.heroImg} />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              Frequently Asked
              <br />
              Questions{" "}
              <span aria-hidden="true" className={styles.heroHeart}>
                <FaHeart />
              </span>
            </h1>
            <p className={styles.heroLead}>
              Find answers to common questions about our products,
              <br />
              orders, shipping, and more.
            </p>
            <form
              className={styles.searchForm}
              onSubmit={(e) => e.preventDefault()}
              role="search"
            >
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search for answers…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search FAQs"
              />
              <button type="submit" className={styles.searchBtn} aria-label="Search">
                <FiSearch />
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Category tabs ─────────── */}
        <section className={styles.catRow} aria-label="Categories">
          {CATEGORIES.map((c) => {
            const isActive = activeCat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                className={`${styles.catCard} ${isActive ? styles.catCardActive : ""}`}
                onClick={() => setActiveCat(c.id)}
              >
                <span className={styles.catIcon} aria-hidden="true">
                  {c.icon}
                </span>
                <strong className={styles.catLabel}>{c.label}</strong>
                <span className={styles.catSub}>{c.sub}</span>
              </button>
            );
          })}
        </section>

        {/* ─────────── 3. Main content ─────────── */}
        <section className={styles.mainRow}>
          {/* LEFT: FAQ list */}
          <div className={styles.faqCol}>
            <header className={styles.faqHead}>
              <h2 className={styles.faqHeadTitle}>All Frequently Asked Questions</h2>
              <span className={styles.faqHeadCount}>
                Showing {filtered.length} of {totalForCategory} results
              </span>
            </header>

            <ul className={styles.faqList}>
              {filtered.map((f) => {
                const isOpen = openFaq === f.id;
                return (
                  <li
                    key={f.id}
                    className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                  >
                    <button
                      type="button"
                      className={styles.faqBtn}
                      onClick={() => toggle(f.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${f.id}`}
                    >
                      <span className={styles.faqQ}>{f.q}</span>
                      <span className={styles.faqIcon} aria-hidden="true">
                        {isOpen ? <FiMinus /> : <FiPlus />}
                      </span>
                    </button>
                    {isOpen && (
                      <div id={`faq-panel-${f.id}`} className={styles.faqA} role="region">
                        {typeof f.a === "string" ? (
                          <p>{f.a}</p>
                        ) : (
                          <>
                            {f.a.lead && <p>{f.a.lead}</p>}
                            {f.a.subHead && <p className={styles.faqSubHead}>{f.a.subHead}</p>}
                            {f.a.bullets && (
                              <ul className={styles.faqBullets}>
                                {f.a.bullets.map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            )}
                            {f.a.trail && <p>{f.a.trail}</p>}
                          </>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className={styles.faqEmpty}>
                  No results — try a different keyword or category.
                </li>
              )}
            </ul>

            <Link href="/contact" className={styles.stillLink}>
              <span className={styles.stillIcon} aria-hidden="true">
                <FiHelpCircle />
              </span>
              <span>Still have questions? Contact our support team</span>
              <span className={styles.stillArrow} aria-hidden="true">
                <FiArrowRight />
              </span>
            </Link>
          </div>

          {/* RIGHT: sidebar */}
          <aside className={styles.sideCol}>
            <section className={styles.popularCard}>
              <h3 className={styles.popularTitle}>Popular Topics</h3>
              <ul className={styles.popularList}>
                {POPULAR_TOPICS.map((t) => (
                  <li key={t.id} className={styles.popularRow}>
                    <span className={styles.popularIcon} aria-hidden="true">
                      {t.icon}
                    </span>
                    <div className={styles.popularText}>
                      <strong>{t.title}</strong>
                      <span>{t.copy}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.cantFindCard}>
              <div className={styles.cantFindBody}>
                <h3 className={styles.cantFindTitle}>
                  Can&rsquo;t find what you&rsquo;re{" "}
                  <span className={styles.cantFindTitleNowrap}>
                    looking&nbsp;for?&nbsp;
                    <span aria-hidden="true" className={styles.cantFindHeart}>
                      &hearts;
                    </span>
                  </span>
                </h3>
                <p className={styles.cantFindCopy}>
                  Our support team is here to help you 24/7.
                </p>
                <Link href="/contact" className={styles.cantFindBtn}>
                  Contact Us <FiArrowRight />
                </Link>
              </div>
              <div className={styles.cantFindMedia} aria-hidden="true">
                <Image
                  src={vaseImg}
                  alt=""
                  fill
                  sizes="220px"
                  className={styles.cantFindImg}
                />
              </div>
            </section>
          </aside>
        </section>

        {/* ─────────── 4. Help + Follow ─────────── */}
        <section className={styles.helpRow}>
          <div className={styles.helpCard}>
            <header className={styles.helpHead}>
              <h3 className={styles.helpTitle}>
                We&rsquo;re Here to Help{" "}
                <span aria-hidden="true" className={styles.helpHeart}>
                  &hearts;
                </span>
              </h3>
              <p className={styles.helpSub}>
                Choose the best way to reach us. We usually reply within a few hours.
              </p>
            </header>
            <ul className={styles.contactGrid}>
              {CONTACT_METHODS.map((m) => (
                <li key={m.id} className={styles.contactItem}>
                  <a href={m.href} className={styles.contactLink}>
                    <span
                      className={`${styles.contactIcon} ${
                        m.tone === "wa" ? styles.contactIconWa : ""
                      }`}
                      aria-hidden="true"
                    >
                      {m.icon}
                    </span>
                    <div className={styles.contactText}>
                      <strong>{m.title}</strong>
                      <span>{m.copy}</span>
                      <span className={styles.contactSub}>{m.sub}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.followCard}>
            <header className={styles.helpHead}>
              <h3 className={styles.helpTitle}>
                Follow Us for Updates{" "}
                <span aria-hidden="true" className={styles.helpHeart}>
                  &hearts;
                </span>
              </h3>
              <p className={styles.helpSub}>
                Get new product alerts, offers
                <br />
                and creative ideas.
              </p>
            </header>
            <ul className={styles.socialRow}>
              {SOCIALS.map((s) => (
                <li key={s.id}>
                  <a href={s.href} className={styles.socialBtn} aria-label={s.label}>
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─────────── 5. Trust strip ─────────── */}
        <section className={styles.trustStrip}>
          <ul className={styles.trustList}>
            {BOTTOM_TRUST.map((t) => (
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
