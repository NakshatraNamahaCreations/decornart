"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeart,
  FaSmile,
  FaBoxOpen,
  FaGem,
  FaPalette,
  FaHandshake,
  FaBuilding,
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaInstagram,
  FaPaperPlane,
  FaLock,
} from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";
import Breadcrumb from "@/components/ui/Breadcrumb/Breadcrumb";
import bannerImg from "@/assets/banimg2.png";
import quoteImg from "@/assets/stem-rose/stem-rose6.png";
import ig1 from "@/assets/butterfly-gift-box/butterfly-3.jpeg";
import ig2 from "@/assets/butterfly-luxury/luxury2.jpeg";
import ig3 from "@/assets/butterfly-signature/signature1.jpeg";
import ig4 from "@/assets/cone-shape-gift/cone-shape4.jpeg";
import ig5 from "@/assets/for-mother-gift/for-mother5.jpeg";
import ig6 from "@/assets/luxe-dual/luxe-dual2.jpeg";
import styles from "./ContactView.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const METHODS = [
  {
    id: "whatsapp",
    icon: <FaWhatsapp />,
    title: "WhatsApp us",
    note: "Chat with us instantly for quick support",
    cta: "+91 98765 43210",
    href: "https://wa.me/919876543210",
  },
  {
    id: "call",
    icon: <FaPhone />,
    title: "Call us",
    note: "Speak to our team (10 AM – 7 PM)",
    cta: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    id: "email",
    icon: <FaEnvelope />,
    title: "Email us",
    note: "Drop us an email — we'll get back soon",
    cta: "support@decornart.in",
    href: "mailto:support@decornart.in",
  },
  {
    id: "visit",
    icon: <FaMapMarkerAlt />,
    title: "Visit us",
    note: "Come say hello! We love meeting you",
    cta: "Get directions",
    href: "https://maps.google.com/?q=Bengaluru",
  },
  {
    id: "wholesale",
    icon: <FaShoppingBag />,
    title: "Wholesale enquiries",
    note: "For bulk orders & business partnerships",
    cta: "Connect with us",
    href: "/wholesale",
  },
];

const SUPPORT_CATEGORIES = [
  { id: "order", icon: <FaBoxOpen />, title: "Order support", note: "Help with orders, tracking & returns" },
  { id: "product", icon: <FaGem />, title: "Product help", note: "Questions about our products & materials" },
  { id: "custom", icon: <FaPalette />, title: "Custom orders", note: "Looking for something customised?" },
  { id: "collab", icon: <FaHandshake />, title: "Collaborations", note: "Partnerships, events & influencer collabs" },
  { id: "biz", icon: <FaBuilding />, title: "Wholesale", note: "Bulk orders & reseller enquiries" },
];

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Standard orders ship in 3–5 business days across India. Express and same-day options are available at checkout for eligible pin codes.",
  },
  {
    q: "What is your return & refund policy?",
    a: "We accept returns within 7 days of delivery on unopened, unused items. Refunds are issued to your original payment method within 5–7 business days after inspection.",
  },
  {
    q: "Do you offer wholesale prices?",
    a: "Yes — we work with schools, resellers, gift shops, event planners and corporate teams. Head to our Wholesale page or email us and we'll share the deck.",
  },
  {
    q: "How can I track my order?",
    a: "You'll receive a tracking link on SMS and WhatsApp the moment your order ships. You can also check status under My Account → Order History.",
  },
  {
    q: "Do you offer gift wrapping?",
    a: "Every order is gift-wrapped by default in signature Decor N Art packaging. Add a handwritten note during checkout — no extra charge.",
  },
];

const INSTAGRAM = [ig1, ig2, ig3, ig4, ig5, ig6];

const FOOTER_TRUST = [
  { id: "secure", icon: <FaShieldAlt />, title: "Secure payments", note: "100% safe & secure" },
  { id: "delivery", icon: <FaTruck />, title: "Pan-India delivery", note: "Fast & reliable shipping" },
  { id: "returns", icon: <FaUndo />, title: "Easy returns", note: "7-day hassle-free returns" },
  { id: "hand", icon: <FaHeart />, title: "Handmade with love", note: "Crafted with passion" },
  { id: "happy", icon: <FaSmile />, title: "10,000+ happy customers", note: "Trust & love us" },
];

const INITIAL_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactView() {
  const root = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: "idle", msg: "" });
  const [openFaq, setOpenFaq] = useState(0);

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatus({ type: "error", msg: "Please share your name so we know who's writing." });
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setStatus({ type: "error", msg: "That email doesn't look quite right — could you check it?" });
      return;
    }
    if (!form.message.trim()) {
      setStatus({ type: "error", msg: "A short message helps us reply meaningfully." });
      return;
    }
    setStatus({
      type: "success",
      msg: "Thank you — your message is on its way. We usually reply within a few hours.",
    });
    setForm(INITIAL_FORM);
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.bannerInner} > *`, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
      });
      gsap.from(`.${styles.methodCard}`, {
        opacity: 0,
        y: 22,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.methodsRow}`, start: "top 88%" },
      });
      gsap.from(`.${styles.formCard}, .${styles.hereForYou}`, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.messageSection}`, start: "top 85%" },
      });
      gsap.from(`.${styles.faqCard}, .${styles.instaCard}`, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.faqSection}`, start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className={styles.page}>
      {/* ───────────── Banner — Collections/Categories pattern ───────────── */}
      <section className={styles.banner} aria-label="Contact Decor N Art">
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
            items={[{ label: "Home", href: "/" }, { label: "Contact us" }]}
          />
          <span className={styles.bannerEyebrow}>Contact us</span>
          <h1 className={styles.bannerTitle}>
            We'd love to <br />
            <em>hear from you</em>
          </h1>
          <p className={styles.bannerIntro}>
            Have a question, need help, or want to collaborate? Our team is
            here for you with love and care.
          </p>
          <span className={styles.bannerMeta}>
            Here for you with love and care
          </span>
        </div>
      </section>

      {/* ───────────── 5-method cards ───────────── */}
      <section className={styles.methods} aria-label="Ways to reach us">
        <ul className={`container ${styles.methodsRow}`}>
          {METHODS.map((m) => (
            <li key={m.id} className={styles.methodCard}>
              <span className={styles.methodIcon} aria-hidden="true">
                {m.icon}
              </span>
              <h3 className={styles.methodTitle}>{m.title}</h3>
              <p className={styles.methodNote}>{m.note}</p>
              <a
                href={m.href}
                target={
                  m.href.startsWith("http") ? "_blank" : undefined
                }
                rel={m.href.startsWith("http") ? "noreferrer" : undefined}
                className={styles.methodCta}
              >
                {m.cta}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── Message form + We're Here For You ───────────── */}
      <section className={`${styles.section} ${styles.messageSection}`}>
        <div className={`container ${styles.messageGrid}`}>
          {/* Form */}
          <div className={styles.formCard}>
            <header className={styles.formHead}>
              <h2 className={styles.formTitle}>
                Send us a message{" "}
                <FaEnvelope className={styles.formTitleIcon} aria-hidden="true" />
              </h2>
              <p className={styles.formLead}>
                We usually reply within a few hours.
              </p>
            </header>

            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <div className={styles.row2}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>
                    Your name <em>*</em>
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={onChange("name")}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className={styles.input}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>
                    Email address <em>*</em>
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={styles.input}
                    required
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Phone number</span>
                <div className={styles.phoneWrap}>
                  <span className={styles.phonePrefix}>🇮🇳 +91</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    className={`${styles.input} ${styles.phoneInput}`}
                  />
                </div>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  Subject <em>*</em>
                </span>
                <input
                  type="text"
                  value={form.subject}
                  onChange={onChange("subject")}
                  placeholder="How can we help you?"
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  Message <em>*</em>
                </span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder="Type your message here…"
                  className={`${styles.input} ${styles.textarea}`}
                  required
                />
              </label>

              <div className={styles.submitRow}>
                <button type="submit" className={styles.sendBtn}>
                  Send message
                  <FaPaperPlane />
                </button>
                <p className={styles.privacyNote}>
                  <FaLock />
                  <span>
                    <strong>Your information is safe with us.</strong>
                    <small>We respect your privacy.</small>
                  </span>
                </p>
              </div>

              {status.type !== "idle" ? (
                <p
                  className={`${styles.status} ${
                    status.type === "error"
                      ? styles.statusError
                      : styles.statusSuccess
                  }`}
                  role="status"
                >
                  {status.msg}
                </p>
              ) : null}
            </form>
          </div>

          {/* We're Here For You */}
          <div className={styles.hereForYou}>
            <header className={styles.hereHead}>
              <h2 className={styles.hereTitle}>
                We're here for you <span aria-hidden="true">♡</span>
              </h2>
            </header>
            <ul className={styles.categories}>
              {SUPPORT_CATEGORIES.map((c) => (
                <li key={c.id} className={styles.category}>
                  <span className={styles.categoryIcon} aria-hidden="true">
                    {c.icon}
                  </span>
                  <span className={styles.categoryCopy}>
                    <strong>{c.title}</strong>
                    <small>{c.note}</small>
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.quoteCard}>
              <blockquote className={styles.quoteCopy}>
                <span className={styles.quoteMark} aria-hidden="true">
                  &ldquo;
                </span>
                Every message means the world to us. Thank you for choosing{" "}
                <em>DecorNArt.</em>
                <span aria-hidden="true"> ♡</span>
              </blockquote>
              <div className={styles.quoteImage}>
                <Image
                  src={quoteImg}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 40vw, 220px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── FAQ + Instagram ───────────── */}
      <section className={`${styles.section} ${styles.faqSection}`}>
        <div className={`container ${styles.faqGrid}`}>
          {/* FAQ */}
          <div className={styles.faqCard}>
            <header className={styles.faqHeader}>
              <h2 className={styles.faqTitle}>
                Frequently asked <em>questions</em>
              </h2>
            </header>
            <ul className={styles.faqList}>
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <li key={i} className={`${styles.faqItem} ${open ? styles.faqOpen : ""}`}>
                    <button
                      type="button"
                      className={styles.faqHead}
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-body-${i}`}
                    >
                      <span className={styles.faqQ}>{f.q}</span>
                      <span className={styles.faqToggle} aria-hidden="true">
                        {open ? <FaMinus /> : <FaPlus />}
                      </span>
                    </button>
                    {open ? (
                      <div id={`faq-body-${i}`} className={styles.faqBody}>
                        {f.a}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <a href="/faq" className={styles.faqAll}>
              View all FAQs <FaArrowRight />
            </a>
          </div>

          {/* Instagram */}
          <div className={styles.instaCard}>
            <header className={styles.instaHead}>
              <h2 className={styles.instaTitle}>
                We'd love to see <br />
                your <em>creations!</em>
              </h2>
              <p className={styles.instaLead}>
                Tag us <strong>@decornart.in</strong> on Instagram and get
                featured on our page.
              </p>
              <a
                href="https://www.instagram.com/decornart.in/"
                target="_blank"
                rel="noreferrer"
                className={styles.instaCta}
              >
                <FaInstagram /> Follow us on Instagram
              </a>
            </header>
            <ul className={styles.instaGrid}>
              {INSTAGRAM.map((src, i) => (
                <li key={i} className={styles.instaTile}>
                  <a
                    href="https://www.instagram.com/decornart.in/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 45vw, 20vw"
                    />
                    <span className={styles.instaHover} aria-hidden="true">
                      <FaInstagram />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
