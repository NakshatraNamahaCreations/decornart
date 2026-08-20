"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiUser, FiMail, FiPhone, FiBriefcase, FiPackage, FiMessageSquare, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/gsap";
import { sendContactMessage } from "@/lib/api/contact";
import { listCategories } from "@/lib/api/categories";
import { listProducts } from "@/lib/api/products";
import { useBannerContent } from "@/hooks/useBannerContent";
import heroImg from "@/assets/banner-collection.png";
import whyImg from "@/assets/for-you-bouquet/for-you3.jpeg";
import readyImg from "@/assets/luxe-rose/luxe-rose4.jpeg";
import styles from "./WholesaleView.module.css";

const TRUST_TOP = [
  {
    id: "premium",
    title: "Premium Quality",
    copy: "Finest materials & flawless finishes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" />
      </svg>
    ),
  },
  {
    id: "prices",
    title: "Competitive Prices",
    copy: "Best wholesale pricing guaranteed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M20 12L12 20 4 12 12 4z" />
        <circle cx="9.5" cy="9.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "supply",
    title: "Reliable Supply",
    copy: "On-time delivery always",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    id: "care",
    title: "Curated with Care",
    copy: "Premium craft supplies and ready-made products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
  {
    id: "grow",
    title: "Grow Together",
    copy: "We support your business growth",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20l6-6 4 4 6-8" />
        <path d="M14 6h6v6" />
      </svg>
    ),
  },
  {
    id: "benefits",
    title: "Exclusive Benefits",
    copy: "Special offers for our partners",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l3 6 6 .5-4.5 4 1.5 6L12 16l-6 3.5 1.5-6L3 9.5l6-.5L12 3z" />
      </svg>
    ),
  },
];

const PERFECT_FOR = [
  {
    id: "schools",
    title: "Schools",
    copy: "Craft activities, events & gifts",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M2 9l10-5 10 5-10 5L2 9z" />
        <path d="M6 11v4c0 2 3 3 6 3s6-1 6-3v-4" />
      </svg>
    ),
  },
  {
    id: "classes",
    title: "Craft Classes",
    copy: "Best for workshops & training",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 5l5 14M15 5L10 19" />
        <path d="M14 3l2 3-4 2z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "resellers",
    title: "Resellers",
    copy: "High quality products for your store",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7c0-2 1-4 3-4s3 2 3 4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "gift",
    title: "Gift Shops",
    copy: "Unique gifts your customers love",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="12" rx="1" />
        <path d="M3 12h18M12 8v12" strokeLinecap="round" />
        <path d="M8 8c-1-2 0-4 2-4s3 2 2 4M16 8c1-2 0-4-2-4s-3 2-2 4" />
      </svg>
    ),
  },
  {
    id: "corporate",
    title: "Corporate",
    copy: "Employee gifting & events",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M4 21V7h16v14M9 21V13h6v8" />
        <path d="M7 10h.01M11 10h.01M15 10h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "events",
    title: "Event Planners",
    copy: "Weddings, birthdays & celebrations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l16 8L4 20z" fill="none" />
        <path d="M4 12h16" />
      </svg>
    ),
  },
  {
    id: "moq",
    title: "MOQ",
    copy: "Low minimum order quantity",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="1" />
        <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "discounts",
    title: "Discounts",
    copy: "Better discounts on bulk orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9l-6 6M9 9h.01M15 15h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "form",
    title: "Bulk Enquiry Form",
    copy: "Easy & quick enquiry process",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
        <path d="M14 3v5h5M9 13h6M9 17h6M9 9h1" />
      </svg>
    ),
  },
];

const WHY = [
  "100% Curated with Love",
  "Wide range of unique products",
  "Consistent quality you can trust",
  "Custom packaging available",
  "Prompt customer support",
  "Flexible order options",
];

const STEPS = [
  {
    id: "enquire",
    n: 1,
    title: "Enquire",
    copy: "Fill the enquiry form or contact us",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16v10H8l-4 4V6z" />
        <path d="M8 10h8M8 13h5" />
      </svg>
    ),
  },
  {
    id: "quote",
    n: 2,
    title: "Get Quote",
    copy: "We will share the best pricing & details",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="1" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </svg>
    ),
  },
  {
    id: "confirm",
    n: 3,
    title: "Confirm Order",
    copy: "Confirm your order and make payment",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M4 8l8-4 8 4-8 4-8-4z" />
        <path d="M4 12l8 4 8-4M4 16l8 4 8-4" />
      </svg>
    ),
  },
  {
    id: "processing",
    n: 4,
    title: "Processing",
    copy: "We carefully prepare your order",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2" />
      </svg>
    ),
  },
  {
    id: "delivery",
    n: 5,
    title: "Delivery",
    copy: "On-time delivery to your doorstep",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
];

const BENEFITS = [
  {
    id: "pricing",
    title: "Wholesale Pricing",
    copy: "Get the best prices on bulk orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 3l9 4v6c0 5-4 8-9 9-5-1-9-4-9-9V7l9-4z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "moq",
    title: "Low MOQ",
    copy: "Start small, grow big",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="4" y="8" width="16" height="12" rx="1" />
        <path d="M4 8l3-4h10l3 4" />
      </svg>
    ),
  },
  {
    id: "offers",
    title: "Exclusive Offers",
    copy: "Special discounts for partners",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9l-6 6M9 9h.01M15 15h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "packaging",
    title: "Custom Packaging",
    copy: "Brand your gifts with us",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M3 8h18v12H3z" />
        <path d="M3 8l3-4h12l3 4M12 4v16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "support",
    title: "Dedicated Support",
    copy: "We are here to help you always",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 16 0v5a3 3 0 0 1-3 3h-2v-6h3" />
        <path d="M20 17a3 3 0 0 1-3 3M4 17V12M4 17a3 3 0 0 0 3 3h2v-6H4" />
      </svg>
    ),
  },
];

const TRUST_BOTTOM = [
  {
    id: "secure",
    title: "Secure Payments",
    copy: "100% safe & secure",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="12" rx="1" />
        <path d="M3 11h18" />
      </svg>
    ),
  },
  {
    id: "delivery",
    title: "Pan India Delivery",
    copy: "Fast & reliable shipping",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    id: "quality",
    title: "Quality Assured",
    copy: "Premium products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "partners",
    title: "Happy Partner",
    copy: "10,000+ businesses trust us",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
      </svg>
    ),
  },
];

export default function WholesaleView() {
  const root = useRef(null);
  // Admin-published hero content. Falls back to hardcoded copy/image if the
  // slot is empty on the backend, so the page never renders blank.
  const heroBanner = useBannerContent("wholesale-hero");
  const heroSrc = heroBanner.loaded && heroBanner.image ? heroBanner.image : heroImg;
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");
  const enquiryFirstFieldRef = useRef(null);

  // Category / product pickers inside the enquiry form.
  // `enquiryCategories` is loaded once when the modal first opens.
  // `enquiryProducts` refreshes when the shopper changes the category.
  const [enquiryCategories, setEnquiryCategories] = useState([]);
  const [enquiryCategorySlug, setEnquiryCategorySlug] = useState("");
  const [enquiryProducts, setEnquiryProducts] = useState([]);
  const [enquiryProductIds, setEnquiryProductIds] = useState([]);
  const [enquiryProductsLoading, setEnquiryProductsLoading] = useState(false);
  const [enquiryProductDropdownOpen, setEnquiryProductDropdownOpen] =
    useState(false);
  const enquiryProductDropdownRef = useRef(null);

  // Focus the first input when opening + lock body scroll while the
  // modal is up. Esc closes.
  useEffect(() => {
    if (!enquiryOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setEnquiryOpen(false);
    window.addEventListener("keydown", onKey);
    setTimeout(() => enquiryFirstFieldRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [enquiryOpen]);

  // Reset the form state whenever the modal closes so a re-open starts
  // fresh (either after a successful submit or a cancel).
  useEffect(() => {
    if (!enquiryOpen) {
      setEnquirySending(false);
      setEnquirySent(false);
      setEnquiryError("");
      setEnquiryCategorySlug("");
      setEnquiryProducts([]);
      setEnquiryProductIds([]);
      setEnquiryProductDropdownOpen(false);
    }
  }, [enquiryOpen]);

  // Close the products dropdown when clicking outside its wrapper.
  useEffect(() => {
    if (!enquiryProductDropdownOpen) return undefined;
    const onDown = (e) => {
      if (
        enquiryProductDropdownRef.current &&
        !enquiryProductDropdownRef.current.contains(e.target)
      ) {
        setEnquiryProductDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [enquiryProductDropdownOpen]);

  // Lazy-load categories the first time the modal is opened.
  useEffect(() => {
    if (!enquiryOpen || enquiryCategories.length > 0) return undefined;
    let cancelled = false;
    listCategories()
      .then((rows) => {
        if (cancelled) return;
        setEnquiryCategories(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (!cancelled) setEnquiryCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, [enquiryOpen, enquiryCategories.length]);

  // Refresh the product list whenever the selected category changes.
  // Empty slug clears the list — no category picked means no products
  // to choose from yet.
  useEffect(() => {
    if (!enquiryCategorySlug) {
      setEnquiryProducts([]);
      setEnquiryProductIds([]);
      return undefined;
    }
    let cancelled = false;
    setEnquiryProductsLoading(true);
    listProducts({ category: enquiryCategorySlug, limit: 100, status: "active" })
      .then((res) => {
        if (cancelled) return;
        const rows = Array.isArray(res) ? res : res?.items || [];
        setEnquiryProducts(rows);
        setEnquiryProductIds([]); // reset selection on category change
      })
      .catch(() => {
        if (!cancelled) setEnquiryProducts([]);
      })
      .finally(() => {
        if (!cancelled) setEnquiryProductsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enquiryCategorySlug]);

  const toggleEnquiryProduct = (id) => {
    setEnquiryProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setEnquiryError("");
    setEnquirySending(true);
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const company = String(data.get("company") || "").trim();
    const quantity = String(data.get("quantity") || "").trim();
    const message = String(data.get("message") || "").trim();
    const categoryName =
      enquiryCategories.find((c) => c.slug === enquiryCategorySlug)?.name ||
      enquiryCategorySlug;
    const pickedProducts = enquiryProducts
      .filter((p) => enquiryProductIds.includes(p.id))
      .map((p) => `- ${p.name}`)
      .join("\n");
    const composed = [
      company && `Company: ${company}`,
      quantity && `Expected quantity: ${quantity}`,
      enquiryCategorySlug && `Category: ${categoryName}`,
      pickedProducts && `Products of interest:\n${pickedProducts}`,
      message,
    ]
      .filter(Boolean)
      .join("\n\n");
    try {
      await sendContactMessage({
        name,
        email,
        phone: phone || undefined,
        subject: "Bulk / Wholesale enquiry",
        message: composed || "Bulk / wholesale enquiry from the website.",
        type: "wholesale",
      });
      setEnquirySent(true);
    } catch (err) {
      setEnquiryError(err?.message || "Could not send your enquiry.");
    } finally {
      setEnquirySending(false);
    }
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.heroInner} > *`, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    { scope: root }
  );

  return (
    <main ref={root} className={styles.page}>
      {/* ────────────── 1. Hero ────────────── */}
      <section className={styles.hero} aria-label="Wholesale">
        <Image
          src={heroSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImg}
        />
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.heroEyebrow}>
            {heroBanner.text("eyebrow", "Wholesale Program")}{" "}
            <span aria-hidden="true">&hearts;</span>
          </span>
          <h1 className={styles.heroTitle}>
            {heroBanner.loaded && heroBanner.title
              ? heroBanner.title
              : (
                <>
                  Partner with
                  <br />
                  DecorNArt
                </>
              )}
          </h1>
          <p className={styles.heroScript}>
            {heroBanner.text("script", "Let’s grow together")}{" "}
            <span aria-hidden="true">&hearts;</span>
          </p>
          <p className={styles.heroLead}>
            {heroBanner.loaded && heroBanner.subtitle
              ? heroBanner.subtitle
              : (
                <>
                  Premium gifts, craft essentials
                  <br />
                  &amp; packaging solutions for your business.
                </>
              )}
          </p>
          <div className={styles.heroCtas}>
            <a href="#enquiry" className={styles.ctaPrimary}>
              Become a Wholesale Partner <span aria-hidden="true">&rarr;</span>
            </a>
            
          </div>
        </div>
      </section>

      {/* ────────────── 2. Top trust strip (6 items) ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <ul className={styles.trustList}>
            {TRUST_TOP.map((t) => (
              <li key={t.id} className={styles.trustItem}>
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
        </div>
      </section>

      {/* ────────────── 3. Perfect For ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.headRule} aria-hidden="true" />
            <h2 className={styles.sectionTitle}>Perfect For</h2>
            <span className={styles.headRule} aria-hidden="true" />
          </div>
          <ul className={styles.perfectGrid}>
            {PERFECT_FOR.map((p) => (
              <li key={p.id} className={styles.perfectCard}>
                <span className={styles.perfectIcon} aria-hidden="true">
                  {p.icon}
                </span>
                <strong>{p.title}</strong>
                <span>{p.copy}</span>
              </li>
            ))}
            {/* 10th tile is the CTA highlight card */}
            <li className={styles.perfectHighlight}>
              <span className={styles.hlOrn} aria-hidden="true">&hearts;</span>
              <strong>Let&rsquo;s Build Something Beautiful Together!</strong>
              <span className={styles.hlOrn} aria-hidden="true">&hearts;</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ────────────── 4. Why Choose DecorNArt ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <h2 className={styles.whyTitle}>
                Why Choose DecorNArt? <span aria-hidden="true">&hearts;</span>
              </h2>
              <ul className={styles.whyList}>
                {WHY.map((w) => (
                  <li key={w} className={styles.whyItem}>
                    <span className={styles.whyCheck} aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12l5 5L20 6" />
                      </svg>
                    </span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.whyImage}>
              <Image
                src={whyImg}
                alt="Beautiful bouquet in a cream pot"
                fill
                sizes="(max-width: 900px) 90vw, 45vw"
                className={styles.whyImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── 5. How Wholesale Works ────────────── */}
      <section className={styles.section} style={{ backgroundColor: "#fff", maxWidth: "1420px", margin: "auto", borderRadius: "12px"}}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.headRule} aria-hidden="true" />
            <h2 className={styles.sectionTitle}>How Wholesale Works</h2>
            <span className={styles.headRule} aria-hidden="true" />
          </div>
          <ol className={styles.stepsRow}>
            {STEPS.map((s, i) => (
              <li key={s.id} className={styles.stepItem}>
                <span className={styles.stepIcon} aria-hidden="true">
                  {s.icon}
                </span>
                <strong>
                  {s.n}. {s.title}
                </strong>
                <span>{s.copy}</span>
                {i < STEPS.length - 1 && (
                  <span className={styles.stepArrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ────────────── 6. Wholesale Benefits ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.headRule} aria-hidden="true" />
            <h2 className={styles.sectionTitle}>Wholesale Benefits</h2>
            <span className={styles.headRule} aria-hidden="true" />
          </div>
          <ul className={styles.benefitsGrid}>
            {BENEFITS.map((b) => (
              <li key={b.id} className={styles.benefitCard}>
                <span className={styles.benefitIcon} aria-hidden="true">
                  {b.icon}
                </span>
                <div className={styles.benefitBody}>
                  <strong>{b.title}</strong>
                  <span>{b.copy}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ────────────── 7. Ready-to-grow CTA banner ────────────── */}
      <section id="enquiry" className={styles.section}>
        <div className="container">
          <div className={styles.readyCard}>
            <div className={styles.readyMedia}>
              <Image
                src={readyImg}
                alt=""
                fill
                sizes="(max-width: 900px) 90vw, 20vw"
                className={styles.readyImg}
              />
            </div>
            <div className={styles.readyCopy}>
              <h2 className={styles.readyTitle}>
                Ready to grow your business with DecorNArt?
              </h2>
              <p className={styles.readySub}>
                Fill out the enquiry form and our team will get back to you shortly.
              </p>
              <div className={styles.readyActions}>
                <button
                  type="button"
                  className={styles.readyCta}
                  onClick={() => setEnquiryOpen(true)}
                >
                  Enquire Now <span aria-hidden="true">&rarr;</span>
                </button>
                <div className={styles.contactRow}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16v10H8l-4 4V6z" />
                      <path d="M8 10h8M8 13h5" />
                    </svg>
                  </span>
                  <span className={styles.contactText}>
                    <strong>Quick Response</strong>
                    <span>Within 24 Hours</span>
                  </span>
                </div>
                <div className={styles.contactRow}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    <FaWhatsapp />
                  </span>
                  <span className={styles.contactText}>
                    <strong>Connect on WhatsApp</strong>
                    <span>+91 9986988786</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── 8. Bottom trust strip (4 items) ────────────── */}
      <section className={styles.section}>
        <div className="container">
          <ul className={styles.trustBottomList}>
            {TRUST_BOTTOM.map((t) => (
              <li key={t.id} className={styles.trustItem}>
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
        </div>
      </section>

      {/* ─────────── Enquiry modal ─────────── */}
      {enquiryOpen && (
        <div
          className={styles.enquiryOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wholesale-enquiry-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEnquiryOpen(false);
          }}
        >
          <div className={styles.enquiryModal}>
            <button
              type="button"
              className={styles.enquiryClose}
              onClick={() => setEnquiryOpen(false)}
              aria-label="Close enquiry form"
            >
              <FiX aria-hidden="true" />
            </button>

            {enquirySent ? (
              <div className={styles.enquiryDone}>
                <span className={styles.enquiryDoneIcon} aria-hidden="true">
                  <FiCheckCircle />
                </span>
                <h3 id="wholesale-enquiry-title" className={styles.enquiryTitle}>
                  Enquiry received
                </h3>
                <p className={styles.enquirySub}>
                  Thank you! Our wholesale team will get back to you within
                  1&ndash;2 business days.
                </p>
                <button
                  type="button"
                  className={styles.enquirySubmit}
                  onClick={() => setEnquiryOpen(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <header className={styles.enquiryHead}>
                  <h3 id="wholesale-enquiry-title" className={styles.enquiryTitle}>
                    Bulk / Wholesale Enquiry
                  </h3>
                  <p className={styles.enquirySub}>
                    Tell us a bit about your requirement and our team will
                    reach out with the best pricing.
                  </p>
                </header>

                <form className={styles.enquiryForm} onSubmit={submitEnquiry}>
                  <div className={styles.enquiryRow}>
                    <label className={styles.enquiryField}>
                      <span className={styles.enquiryLabel}>Full name</span>
                      <span className={styles.enquiryInputWrap}>
                        <FiUser aria-hidden="true" />
                        <input
                          ref={enquiryFirstFieldRef}
                          type="text"
                          name="name"
                          required
                          maxLength={80}
                          autoComplete="name"
                          placeholder="Your name"
                          className={styles.enquiryInput}
                        />
                      </span>
                    </label>
                    <label className={styles.enquiryField}>
                      <span className={styles.enquiryLabel}>Company (optional)</span>
                      <span className={styles.enquiryInputWrap}>
                        <FiBriefcase aria-hidden="true" />
                        <input
                          type="text"
                          name="company"
                          maxLength={120}
                          autoComplete="organization"
                          placeholder="Business / organisation"
                          className={styles.enquiryInput}
                        />
                      </span>
                    </label>
                  </div>

                  <div className={styles.enquiryRow}>
                    <label className={styles.enquiryField}>
                      <span className={styles.enquiryLabel}>Email</span>
                      <span className={styles.enquiryInputWrap}>
                        <FiMail aria-hidden="true" />
                        <input
                          type="email"
                          name="email"
                          required
                          autoComplete="email"
                          placeholder="you@example.com"
                          className={styles.enquiryInput}
                        />
                      </span>
                    </label>
                    <label className={styles.enquiryField}>
                      <span className={styles.enquiryLabel}>Phone (optional)</span>
                      <span className={styles.enquiryInputWrap}>
                        <FiPhone aria-hidden="true" />
                        <input
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          placeholder="+91…"
                          className={styles.enquiryInput}
                        />
                      </span>
                    </label>
                  </div>

                  <label className={styles.enquiryField}>
                    <span className={styles.enquiryLabel}>Category</span>
                    <span className={styles.enquiryInputWrap}>
                      <FiPackage aria-hidden="true" />
                      <select
                        value={enquiryCategorySlug}
                        onChange={(e) =>
                          setEnquiryCategorySlug(e.target.value)
                        }
                        className={`${styles.enquiryInput} ${styles.enquirySelect}`}
                      >
                        <option value="">All / not sure yet</option>
                        {enquiryCategories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>

                  {enquiryCategorySlug && (
                    <div className={styles.enquiryField}>
                      <span className={styles.enquiryLabel}>
                        Products of interest
                        {enquiryProductIds.length > 0 && (
                          <span className={styles.enquiryChip}>
                            {enquiryProductIds.length} selected
                          </span>
                        )}
                      </span>
                      {enquiryProductsLoading ? (
                        <p className={styles.enquiryHint}>Loading products…</p>
                      ) : enquiryProducts.length === 0 ? (
                        <p className={styles.enquiryHint}>
                          No products in this category yet.
                        </p>
                      ) : (
                        <div
                          className={styles.enquiryProductDropdown}
                          ref={enquiryProductDropdownRef}
                        >
                          <button
                            type="button"
                            className={styles.enquiryProductTrigger}
                            onClick={() =>
                              setEnquiryProductDropdownOpen((v) => !v)
                            }
                            aria-haspopup="listbox"
                            aria-expanded={enquiryProductDropdownOpen}
                          >
                            <FiPackage aria-hidden="true" />
                            <span className={styles.enquiryProductTriggerLabel}>
                              {enquiryProductIds.length === 0
                                ? "Select products…"
                                : `${enquiryProductIds.length} product${
                                    enquiryProductIds.length === 1 ? "" : "s"
                                  } selected`}
                            </span>
                            <FiChevronDown
                              className={`${styles.enquiryProductChevron} ${
                                enquiryProductDropdownOpen
                                  ? styles.enquiryProductChevronOpen
                                  : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>

                          {enquiryProductDropdownOpen && (
                            <div
                              className={styles.enquiryProductMenu}
                              role="listbox"
                              aria-multiselectable="true"
                            >
                              {enquiryProducts.map((p) => {
                                const on = enquiryProductIds.includes(p.id);
                                return (
                                  <label
                                    key={p.id}
                                    className={`${styles.enquiryProductOption} ${
                                      on ? styles.enquiryProductOptionOn : ""
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={on}
                                      onChange={() => toggleEnquiryProduct(p.id)}
                                      className={styles.enquiryProductCheckbox}
                                    />
                                    <span className={styles.enquiryProductName}>
                                      {p.name}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {enquiryProductIds.length > 0 && (
                            <ul className={styles.enquiryProductChips}>
                              {enquiryProducts
                                .filter((p) =>
                                  enquiryProductIds.includes(p.id)
                                )
                                .map((p) => (
                                  <li
                                    key={p.id}
                                    className={styles.enquiryProductPill}
                                  >
                                    <span
                                      className={styles.enquiryProductPillName}
                                    >
                                      {p.name}
                                    </span>
                                    <button
                                      type="button"
                                      className={styles.enquiryProductPillRemove}
                                      onClick={() => toggleEnquiryProduct(p.id)}
                                      aria-label={`Remove ${p.name}`}
                                    >
                                      <FiX aria-hidden="true" />
                                    </button>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <label className={styles.enquiryField}>
                    <span className={styles.enquiryLabel}>Expected quantity</span>
                    <span className={styles.enquiryInputWrap}>
                      <FiPackage aria-hidden="true" />
                      <input
                        type="text"
                        name="quantity"
                        placeholder="e.g. 100 gift boxes, 50 kg ribbon…"
                        className={styles.enquiryInput}
                      />
                    </span>
                  </label>

                  <label className={styles.enquiryField}>
                    <span className={styles.enquiryLabel}>Tell us more</span>
                    <span className={`${styles.enquiryInputWrap} ${styles.enquiryTextareaWrap}`}>
                      <FiMessageSquare aria-hidden="true" />
                      <textarea
                        name="message"
                        rows={4}
                        maxLength={2000}
                        placeholder="Product categories, timeline, delivery city, any other details…"
                        className={`${styles.enquiryInput} ${styles.enquiryTextarea}`}
                      />
                    </span>
                  </label>

                  {enquiryError && (
                    <p className={styles.enquiryError}>{enquiryError}</p>
                  )}

                  <div className={styles.enquiryActions}>
                    <button
                      type="button"
                      className={styles.enquiryCancel}
                      onClick={() => setEnquiryOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.enquirySubmit}
                      disabled={enquirySending}
                    >
                      {enquirySending ? "Sending…" : "Send enquiry"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
