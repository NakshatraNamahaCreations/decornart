"use client";

import { useState } from "react";
import Image from "next/image";
import { FiTruck, FiShield, FiRotateCcw, FiAward } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaWhatsapp,
  FaTag,
  FaGift,
  FaLightbulb,
  FaStar,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo from "@/assets/new-logo-1.png";
import newsletterArt from "@/assets/vase.png";
import visaImg from "@/assets/payment/visa.jpg";
import mastercardImg from "@/assets/payment/mastercard.jpg";
import upiImg from "@/assets/payment/upi.jpg";
import paytmImg from "@/assets/payment/paytm.jpg";
import rupayImg from "@/assets/payment/rupay.jpg";
import styles from "./Footer.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─────────── Inline SVG icons (small, currentColor) ─────────── */
const MailIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 7l9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
const ArrowRight = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...p}>
    <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HeartIcon = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...p}>
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="currentColor" />
  </svg>
);

/* Trust strip icons */
const ShipIcon = () => (
  <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
    <path d="M3 22V8h15v14M18 14h6l4 4v4h-2M5 22h22M8 25a3 3 0 1 0 6 0 3 3 0 1 0-6 0M21 25a3 3 0 1 0 6 0 3 3 0 1 0-6 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
    <path d="M16 4l10 4v8c0 6-4.5 10-10 12C10.5 26 6 22 6 16V8l10-4z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M11 16l3.4 3.4L21 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ReturnIcon = () => (
  <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
    <path d="M7 16a9 9 0 0 1 15-6.5l3 3M25 6v6h-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 16a9 9 0 0 1-15 6.5l-3-3M7 26v-6h6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HandHeartIcon = () => (
  <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
    <path d="M16 13s-4-3-6-1-1 6 6 10c7-4 8-8 6-10s-6 1-6 1z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M3 24h7l4 3h8l5-4-3-2-3 2h-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
    <circle cx="12" cy="11" r="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M4 25c1.6-4 4.6-6 8-6s6.4 2 8 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="22" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M19 25c1-2.6 2.8-4 5-4s4 1.4 5 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Pipe Cleaners", href: "/shop?category=pipe-cleaners" },
      { label: "Ribbons", href: "/shop?category=ribbons" },
      { label: "Wrapping Sheets", href: "/shop?category=wrapping-papers" },
      { label: "Flower Boxes & Bags", href: "/shop?category=flower-boxes-bags" },
      { label: "Gift Boxes", href: "/shop?category=gift-box" },
      { label: "Craft Essentials", href: "/craft-essentials" },
      { label: "New Arrivals", href: "/collections" },
      { label: "Offers", href: "/offers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      // { label: "Brand Partners", href: "/brand-partners" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Help & Support",
    links: [
      { label: "FAQs", href: "/faq" },
      { label: "Track Your Order", href: "/order" },
      { label: "Returns & Refunds", href: "/policies" },
      { label: "Shipping Policy", href: "/policies" },
      { label: "Payment Policy", href: "/policies" },
      { label: "Privacy Policy", href: "/policies" },
      { label: "Terms & Conditions", href: "/policies" },
      { label: "Wholesale Enquiries", href: "/wholesale" },
      { label: "AI Search", href: "/search" }
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Order History", href: "/order" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Addresses", href: "/addresses" },
      { label: "Payment Methods", href: "/account" },
      { label: "Rewards & Credit", href: "/offers" },
      { label: "Logout", href: "/" },
    ],
  },
];

const TRUST = [
  { id: "ship", title: "Free Shipping", sub: "On orders above ₹2500", icon: <ShipIcon /> },
  { id: "secure", title: "Secure Payments", sub: "100% safe & secure", icon: <ShieldIcon /> },
  { id: "returns", title: "Damage Protection", sub: "Replacement for damaged items", icon: <ReturnIcon /> },
  { id: "beautiful", title: "Curated with Love", sub: "Crafted with passion", icon: <HandHeartIcon /> },
  { id: "happy", title: "10,000+ Happy Customers", sub: "Thank you for trusting us", icon: <UsersIcon /> },
];

const PAYMENTS = [
  { id: "visa", label: "Visa", image: visaImg },
  { id: "mastercard", label: "Mastercard", image: mastercardImg },
  { id: "upi", label: "UPI", image: upiImg },
  { id: "paytm", label: "Paytm", image: paytmImg },
  { id: "rupay", label: "RuPay", image: rupayImg },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  const handleSubmit = (e) => {
    e?.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus({ type: "error", msg: "Please enter a valid email address." });
      return;
    }
    setStatus({ type: "success", msg: "You're on the list — welcome." });
    setEmail("");
  };

  return (
    <footer className={styles.footer}>
      {/* ───── Newsletter card (sits on the page bg, above the dark footer) ───── */}
      <div className={styles.newsletterWrap}>
        <div className="container" style={{maxWidth: "1520px"}}>
          <div className={styles.newsCard}>
            <div className={styles.newsArt} aria-hidden="true">
              <Image src={newsletterArt} alt="" sizes="(max-width: 860px) 40vw, 220px" />
            </div>

            <div className={styles.newsCopy}>
              <h2 className={styles.newsTitle}>
                Unravel Something New
                <span className={styles.newsHeart} aria-hidden="true"><HeartIcon /></span>
              </h2>
              <p className={styles.newsLead}>
                First peeks at fresh yarn shades, exclusive drops &amp; DIY
                threads for your next make &mdash; straight to your inbox.
              </p>
            </div>

            <form className={styles.newsForm} onSubmit={handleSubmit} role="search">
              <span className={styles.newsField}>
                <MailIcon className={styles.newsFieldIcon} />
                <input
                  type="email"
                  inputMode="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  className={styles.newsInput}
                />
              </span>
              <button type="submit" className={styles.newsButton}>
                Subscribe <ArrowRight />
              </button>
              {status.msg && (
                <p
                  className={`${styles.newsStatus} ${
                    status.type === "error" ? styles.error : styles.success
                  }`}
                  role="status"
                >
                  {status.msg}
                </p>
              )}
            </form>

            <ul className={styles.newsPerks} aria-label="Subscriber perks">
              <li>
                <span className={styles.newsPerkDot} aria-hidden="true">
                  <FaTag />
                </span>
                Exclusive Offers
              </li>
              <li>
                <span className={styles.newsPerkDot} aria-hidden="true">
                  <FaGift />
                </span>
                New Arrivals
              </li>
              <li>
                <span className={styles.newsPerkDot} aria-hidden="true">
                  <FaLightbulb />
                </span>
                Product Showcase
              </li>
              <li>
                <span className={styles.newsPerkDot} aria-hidden="true">
                  <FaStar />
                </span>
                Early Access to Collections
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ───── Trust strip ───── */}
      <div className={styles.trust}>
        <div className="container">
          <ul className={styles.trustList}>
            {TRUST.map((t) => (
              <li key={t.id} className={styles.trustItem}>
                <span className={styles.trustIcon}>{t.icon}</span>
                <span className={styles.trustText}>
                  <span className={styles.trustTitle}>{t.title}</span>
                  <span className={styles.trustSub}>{t.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ───── Main footer ───── */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.mainGrid}>
            {/* Brand column */}
            <div className={styles.brandCol}>
              <a href="/" className={styles.brand} aria-label="Decor N Art — home">
                <Image
                  src={logo}
                  alt="Decor N Art"
                  sizes="(max-width: 600px) 160px, 200px"
                />
              </a>
              <p className={styles.tagline}>
                Curating beautiful moments and timeless memories with love.
              </p>
              <ul className={styles.social} aria-label="Follow Decor N Art">
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <FaFacebookF size={18} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                    <FaInstagram size={18} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                    <FaYoutube size={18} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
                    <FaPinterestP size={18} aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/919986988786" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                    <FaWhatsapp size={18} aria-hidden="true" />
                  </a>
                </li>
              </ul>

              {/* Feature badges — matches the design spec's 2x2 grid of
                  trust markers directly beneath the social icons. */}
              <ul className={styles.features} aria-label="Why shop with us">
                <li className={styles.featureItem}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <FiTruck />
                  </span>
                  <span className={styles.featureText}>
                    <strong>Pan India</strong>
                    <span>Shipping</span>
                  </span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <FiShield />
                  </span>
                  <span className={styles.featureText}>
                    <strong>Secure</strong>
                    <span>Payments</span>
                  </span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <FiRotateCcw />
                  </span>
                  <span className={styles.featureText}>
                    <strong>Easy</strong>
                    <span>Replacement</span>
                  </span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <FiAward />
                  </span>
                  <span className={styles.featureText}>
                    <strong>Premium</strong>
                    <span>Quality</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Link columns */}
            {COLUMNS.map((col) => (
              <div key={col.title} className={styles.col}>
                <p className={styles.colTitle}>{col.title}</p>
                <span className={styles.colRule} aria-hidden="true" />
                <ul className={styles.list}>
                  {col.links.map((l) => (
                    <li key={`${col.title}-${l.label}`}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact column */}
            <div className={styles.col}>
              <p className={styles.colTitle}>Get in Touch</p>
              <span className={styles.colRule} aria-hidden="true" />
              <ul className={styles.contactList}>
                <li>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <FaPhoneAlt size={14} />
                  </span>
                  <span className={styles.contactBody}>
                    <a href="tel:+917892545678" className={styles.contactLabel}>
                      +91 9986988786
                    </a>
                    <span className={styles.contactSub}>Mon – Sat | 9AM – 7PM</span>
                  </span>
                </li>
                <li>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <FaEnvelope size={14} />
                  </span>
                  <span className={styles.contactBody}>
                    <a href="mailto:official@decornart.in" className={styles.contactLabel}>
                      official@decornart.in
                    </a>
                    <a href="mailto:support@decornart.in" className={styles.contactLabel}>
                      support@decornart.in 
                    </a>
                    <span className={styles.contactSub}>We reply within 24 hours</span>
                  </span>
                </li>
                <li>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <FaMapMarkerAlt size={14} />
                  </span>
                  <span className={styles.contactBody}>
                    <span className={styles.contactLabel}>
                      #828, Sri Hanuma Dhaye,<br />
                      2nd Main 10th Cross,<br />
                      Sir M Visvesvaraya Layout Block 1,<br />
                      Bengaluru-560056
                    </span>
                  </span>
                </li>
              </ul>

              <a
                href="https://wa.me/919986988786"
                target="_blank"
                rel="noreferrer"
                className={styles.chatBox}
              >
                <span className={styles.chatIcon} aria-hidden="true"><FaWhatsapp size={18} color="#fff" /></span>
                <span className={styles.chatText}>
                  <strong>Need Help? Chat with us</strong>
                  <small>We're here for you!</small>
                </span>
                <ArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Bottom bar ───── */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomGrid}>
            <div className={styles.payments}>
              <span className={styles.paymentsLabel}>We Accept</span>
              <ul aria-label="Accepted payment methods">
                {PAYMENTS.map((p) => (
                  <li key={p.id} className={styles.paymentLogo}>
                    <Image
                      src={p.image}
                      alt={p.label}
                      width={44}
                      height={26}
                      sizes="44px"
                    />
                  </li>
                ))}
                <li className={styles.paymentsMore}>&amp; more</li>
              </ul>
            </div>

            <span className={styles.madeIn}>
              Proudly Made in India <HeartIcon className={styles.madeInHeart} />
            </span>

            <span className={styles.copyright}>
              © {new Date().getFullYear()} Decor N Art. All Rights Reserved.
            </span>
          </div>

          <div className={styles.credit}>
            Developed by{" "}
            <a
              href="https://www.nakshatranamahacreations.com/"
              target="_blank"
              rel="noreferrer"
              className={styles.creditLink}
            >
              Nakshatra Namaha Creations
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
