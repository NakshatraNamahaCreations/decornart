"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaHeart,
} from "react-icons/fa";
import {
  FiMapPin,
  FiShoppingBag,
  FiSend,
  FiShield,
  FiPackage,
  FiHelpCircle,
  FiGift,
  FiUsers,
  FiHome,
  FiPlus,
  FiMinus,
  FiTruck,
  FiRotateCcw,
  FiAward,
  FiArrowRight,
} from "react-icons/fi";
import { PiFlowerFill } from "react-icons/pi";
import { sendContactMessage } from "@/lib/api/contact";
import heroImg from "@/assets/orderbg.png";
import vaseImg from "@/assets/vase.png";
import ig1 from "@/assets/for-you-bouquet/for-you1.jpeg";
import ig2 from "@/assets/stem-rose/stem-rose6.png";
import ig3 from "@/assets/luxe-rose/luxe-rose1.jpeg";
import ig4 from "@/assets/butterfly-luxury/luxury1.jpeg";
import ig5 from "@/assets/butterfly-signature/signature1.jpeg";
import ig6 from "@/assets/for-mother-gift/for-mother1.jpeg";
import styles from "./ContactView.module.css";

const CONTACT_CARDS = [
  {
    id: "whatsapp",
    title: "WhatsApp Us",
    copy: "Chat with us instantly for quick support",
    action: "+91 9986988786",
    href: "https://wa.me/919876543210",
    icon: <FaWhatsapp />,
    tone: "wa",
  },
  {
    id: "call",
    title: "Call Us",
    copy: "Speak to our team (10 AM – 7 PM)",
    action: "+91 9986988786",
    href: "tel:+919876543210",
    icon: <FaPhone />,
    tone: "blush",
  },
  {
    id: "email",
    title: "Email Us",
    copy: "Drop us an email, we'll get back soon",
    action: "official@decornart.in",
    href: "mailto:official@decornart.in",
    icon: <FaEnvelope />,
    tone: "blush",
  },
  {
    id: "visit",
    title: "Visit Us",
    copy: "Come say hello! We love meeting you",
    action: "Get Directions",
    href: "https://maps.app.goo.gl/7bniyexPqZ8bkCk48?g_st=ic",
    icon: <FiMapPin />,
    tone: "blush",
  },
  {
    id: "wholesale",
    title: "Wholesale Enquiries",
    copy: "For bulk orders & business partnerships",
    action: "Connect With Us",
    href: "/wholesale",
    icon: <FiShoppingBag />,
    tone: "blush",
  },
];

const SUPPORT_ITEMS = [
  {
    id: "order",
    title: "Order Support",
    copy: "Help with orders, tracking & returns",
    icon: <FiPackage />,
  },
  {
    id: "product",
    title: "Product Help",
    copy: "Questions about our products & materials",
    icon: <FiHelpCircle />,
  },
  {
    id: "custom",
    title: "Custom Orders",
    copy: "Looking for something customized?",
    icon: <FiGift />,
  },
  {
    id: "collab",
    title: "Collaborations",
    copy: "Partnerships, events & influencer collabs",
    icon: <FiUsers />,
  },
  {
    id: "wholesale",
    title: "Wholesale",
    copy: "Bulk orders & reseller enquiries",
    icon: <FiHome />,
  },
];

const FAQS = [
  {
    id: "delivery",
    q: "How long does delivery take?",
    a: "Most orders reach you in 4–7 business days across India. Metro cities usually get their orders in 3–5 days. Expedited shipping is available at checkout for select pincodes.",
  },
  {
    id: "returns",
    q: "What is your return & refund policy?",
    a: "You have 7 days from delivery to request a return for any unused item in its original packaging. Once received, refunds are processed within 5 business days to your original payment method.",
  },
  {
    id: "wholesale",
    q: "Do you offer wholesale prices?",
    a: "Yes — we offer tiered pricing for bulk orders and reseller partnerships. Reach out on the Wholesale Enquiries card above or email wholesale@decornart.in with your requirement.",
  },
  {
    id: "track",
    q: "How can I track my order?",
    a: "Use the Track Your Order page with your Order ID or Tracking ID. We also email every status change so you know exactly where your happiness is at every step.",
  },
  {
    id: "gift",
    q: "Do you offer gift wrapping?",
    a: "Absolutely — we offer complimentary DecorNArt gift wrapping on all orders. Add a personalized note at checkout and we'll include it with your parcel.",
  },
];

const INSTAGRAM = [ig1, ig2, ig3, ig4, ig5, ig6];

const BOTTOM_TRUST = [
  { id: "secure", title: "Secure Payments", copy: "100% safe & secure", icon: <FiShield /> },
  { id: "delivery", title: "Pan India Delivery", copy: "Fast & reliable shipping", icon: <FiTruck /> },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: <FiRotateCcw /> },
  { id: "premium", title: "Curated with Love", copy: "Crafted with passion", icon: <FaHeart /> },
  { id: "happy", title: "10,000+ Happy Customers", copy: "Trust & love us", icon: <FiAward /> },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactView() {
  const root = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState("delivery");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const onChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!form.name.trim() || !form.subject.trim() || !form.message.trim()) {
      setError("Please fill in name, subject and message.");
      return;
    }
    if (!EMAIL_RE.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
        type: "contact",
      });
      setSent(true);
      setTimeout(() => setSent(false), 3500);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError(err?.message || "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const toggleFaq = (id) => setOpenFaq((prev) => (prev === id ? null : id));

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Contact us">
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
            <span className={styles.heroEyebrow}>We&rsquo;d Love to</span>
            <h1 className={styles.heroTitle}>
              Hear From You{" "}
              <span aria-hidden="true" className={styles.heroHeart}>
                <FaHeart />
              </span>
            </h1>
            <p className={styles.heroLead}>
              Have a question, need help, or want to collaborate?
              <br />
              Our team is here for you with love and care.{" "}
              <span aria-hidden="true" className={styles.heroSpark}>
                &hearts;
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Quick contact cards ─────────── */}
        <section className={styles.cardsRow} aria-label="Ways to reach us">
          {CONTACT_CARDS.map((c) => {
            const isExternal = /^https?:\/\//i.test(c.href);
            return (
              <article key={c.id} className={styles.card}>
                <span
                  className={`${styles.cardIcon} ${
                    c.tone === "wa" ? styles.cardIconWa : ""
                  }`}
                  aria-hidden="true"
                >
                  {c.icon}
                </span>
                <strong className={styles.cardTitle}>{c.title}</strong>
                <p className={styles.cardCopy}>{c.copy}</p>
                <a
                  href={c.href}
                  className={styles.cardAction}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {c.action}
                </a>
              </article>
            );
          })}
        </section>

        {/* ─────────── 3. Form + support ─────────── */}
        <section className={styles.formGrid}>
          {/* Message form */}
          <form className={styles.formCard} onSubmit={submit} noValidate>
            <header className={styles.formHead}>
              <h2 className={styles.formTitle}>
                Send Us a Message{" "}
                <span aria-hidden="true" className={styles.formTitleIcon}>
                  <FiSend />
                </span>
              </h2>
              <p className={styles.formSub}>We usually reply within a few hours.</p>
            </header>

            <div className={styles.formRow2}>
              <label className={styles.formField}>
                <span>
                  Your Name <em>*</em>
                </span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={onChange("name")}
                  required
                />
              </label>
              <label className={styles.formField}>
                <span>
                  Email Address <em>*</em>
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={onChange("email")}
                  required
                />
              </label>
            </div>

            <label className={styles.formField}>
              <span>Phone Number</span>
              <div className={styles.phoneWrap}>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={onChange("phone")}
                />
                <span className={styles.phoneCode} aria-hidden="true">
                  🇮🇳 +91
                </span>
              </div>
            </label>

            <label className={styles.formField}>
              <span>
                Subject <em>*</em>
              </span>
              <input
                type="text"
                placeholder="How can we help you?"
                value={form.subject}
                onChange={onChange("subject")}
                required
              />
            </label>

            <label className={styles.formField}>
              <span>
                Message <em>*</em>
              </span>
              <textarea
                rows={5}
                placeholder="Type your message here…"
                value={form.message}
                onChange={onChange("message")}
                required
              />
            </label>

            {error && <p className={styles.formError}>{error}</p>}
            {sent && (
              <p className={styles.formSuccess}>
                Thanks — your message is on its way. We&rsquo;ll be in touch soon.
              </p>
            )}

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={sending}
              >
                {sending ? "Sending…" : "Send Message"} <FiSend />
              </button>
              <span className={styles.privacyNote}>
                <span className={styles.privacyIcon} aria-hidden="true">
                  <FiShield />
                </span>
                <span>
                  <strong>Your information is safe with us.</strong>
                  <em>We respect your privacy.</em>
                </span>
              </span>
            </div>
          </form>

          {/* Support panel */}
          <aside className={styles.supportCol}>
            <section className={styles.supportCard}>
              <h2 className={styles.supportTitle}>
                We&rsquo;re Here for You{" "}
                <span aria-hidden="true" className={styles.supportHeart}>
                  <FaHeart />
                </span>
              </h2>
              <ul className={styles.supportList}>
                {SUPPORT_ITEMS.map((s) => (
                  <li key={s.id} className={styles.supportRow}>
                    <span className={styles.supportIcon} aria-hidden="true">
                      {s.icon}
                    </span>
                    <div className={styles.supportText}>
                      <strong>{s.title}</strong>
                      <span>{s.copy}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.thanksCard}>
              <div className={styles.thanksBody}>
                <span className={styles.thanksQuote} aria-hidden="true">
                  &ldquo;
                </span>
                <p>
                  Every message means the world to us. Thank you for choosing
                  DecorNArt.{" "}
                  <span aria-hidden="true" className={styles.thanksHeart}>
                    &hearts;
                  </span>
                </p>
              </div>
              <div className={styles.thanksMedia} aria-hidden="true">
                <Image
                  src={vaseImg}
                  alt=""
                  fill
                  sizes="180px"
                  className={styles.thanksImg}
                />
              </div>
            </section>
          </aside>
        </section>

        {/* ─────────── 4. FAQ + Instagram ─────────── */}
        <section className={styles.duoRow}>
          <section className={styles.faqCard}>
            <header className={styles.faqHead}>
              <h2 className={styles.faqTitle}>
                Frequently Asked Questions{" "}
                <span aria-hidden="true" className={styles.faqOrn}>
                  <PiFlowerFill />
                </span>
              </h2>
            </header>
            <ul className={styles.faqList}>
              {FAQS.map((f) => {
                const isOpen = openFaq === f.id;
                return (
                  <li
                    key={f.id}
                    className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                  >
                    <button
                      type="button"
                      className={styles.faqBtn}
                      onClick={() => toggleFaq(f.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${f.id}`}
                    >
                      <span className={styles.faqQ}>{f.q}</span>
                      <span className={styles.faqIcon} aria-hidden="true">
                        {isOpen ? <FiMinus /> : <FiPlus />}
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-panel-${f.id}`}
                        className={styles.faqA}
                        role="region"
                      >
                        {f.a}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link href="/faq" className={styles.faqLink}>
              View All FAQs <FiArrowRight />
            </Link>
          </section>

          <section className={styles.igCard}>
            <div className={styles.igCopy}>
              <h2 className={styles.igTitle}>
                We&rsquo;d Love to See{" "}
                <br />
                Your Creations!{" "}
                <span aria-hidden="true" className={styles.igHeart}>
                  <FaHeart />
                </span>
              </h2>
              <p className={styles.igLead}>
                Tag us <strong>@decornart.in</strong> on Instagram and get
                featured on our page.
              </p>
              <a
                href="https://instagram.com/decornart.in"
                className={styles.igBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram /> Follow Us on Instagram
              </a>
            </div>
            <ul className={styles.igGrid}>
              {INSTAGRAM.map((img, i) => (
                <li key={i} className={styles.igItem}>
                  <Image
                    src={img}
                    alt={`DecorNArt creation ${i + 1}`}
                    fill
                    sizes="140px"
                    className={styles.igImg}
                  />
                  <span className={styles.igLike} aria-hidden="true">
                    <FaHeart />
                  </span>
                </li>
              ))}
            </ul>
          </section>
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
