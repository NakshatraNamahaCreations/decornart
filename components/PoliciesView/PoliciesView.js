"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import {
  FiTruck,
  FiLock,
  FiClock,
  FiUsers,
  FiPackage,
  FiXCircle,
  FiCreditCard,
  FiShield,
  FiFileText,
  FiRotateCcw,
  FiArrowRight,
  FiAward,
  FiChevronRight,
} from "react-icons/fi";
import { PiCrownFill, PiCopyrightFill } from "react-icons/pi";
import heroImg from "@/assets/orderbg.png";
import vaseImg from "@/assets/basket.png";
import styles from "./PoliciesView.module.css";

const VALUE_STRIP = [
  {
    id: "customer",
    title: "Customer First",
    copy: "Your happiness is our priority",
    icon: <FiTruck />,
  },
  {
    id: "secure",
    title: "Secure Shopping",
    copy: "Safe payments & data protection",
    icon: <FiLock />,
  },
  {
    id: "beautiful",
    title: "Curated with Love",
    copy: "Carefully crafted just for you",
    icon: <PiCrownFill />,
  },
  {
    id: "easy",
    title: "Easy & Hassle-Free",
    copy: "Simple policies for a smooth experience",
    icon: <FiClock />,
  },
  {
    id: "trusted",
    title: "Trusted by Thousands",
    copy: "10,000+ happy customers",
    icon: <FiUsers />,
  },
];

const POLICIES = [
  {
    id: "shipping",
    title: "Shipping Policy",
    copy: "We process and ship orders quickly and safely. Enjoy free shipping on all orders above ₹2,500 across India.",
    bullets: [
      "Order Processing: 1–2 business days",
      "Delivery Time: 2–7 business days",
      "Tracking: Sent via SMS & Email",
    ],
    href: "#policy-shipping",
    icon: <FiTruck />,
  },
  {
    id: "return",
    title: "Returns, Refunds & Replacement",
    copy: "Every order is inspected and securely packed. All purchases are final — replacements are provided only for products seriously damaged in transit.",
    bullets: [
      "No returns or refunds on delivered orders",
      "Replacement only for transit-damaged items",
      "Full unboxing video required within 24 hours",
    ],
    href: "#policy-returns",
    icon: <FiPackage />,
  },
  {
    id: "cancel",
    title: "Cancellation Policy",
    copy: "You may cancel your order before it is packed or shipped.",
    bullets: [
      "Cancel within 24 hours for full refund",
      "Once shipped, cancellation not possible",
      "Contact us via WhatsApp or Email",
    ],
    href: "#policy-cancellation",
    icon: <FiXCircle />,
  },
  {
    id: "payment",
    title: "Payment Policy",
    copy: "We offer secure and trusted payment options for your convenience.",
    bullets: [
      "UPI, Cards, Net Banking, Wallets",
      "Cash on Delivery available",
      "100% secure payments",
    ],
    href: "#policy-payment",
    icon: <FiCreditCard />,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    copy: "Your privacy is important to us. We never share your personal information with anyone.",
    bullets: [
      "Secure data handling",
      "No spam or unsolicited emails",
      "Data used only to fulfil orders",
    ],
    href: "#policy-privacy",
    icon: <FiShield />,
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    copy: "By placing an order with DecorNArt, you agree to our terms and conditions.",
    bullets: [
      "Product & pricing information",
      "Order acceptance & limitations",
      "Intellectual property rights",
    ],
    href: "#policy-terms",
    icon: <FiFileText />,
  },
  {
    id: "wholesale",
    title: "Wholesale Policy",
    copy: "Special pricing and benefits for resellers, bulk buyers and business partners.",
    bullets: [
      "Minimum order quantity applies",
      "Exclusive wholesale discounts",
      "Priority support for partners",
    ],
    href: "#policy-wholesale",
    icon: <FiUsers />,
  },
  {
    id: "ip",
    title: "Intellectual Property",
    copy: "All content, designs, photos and brand elements on our website are owned by DecorNArt.",
    bullets: [
      "Not to be copied or reused",
      "Strict action will be taken",
      "All rights reserved",
    ],
    href: "#policy-ip",
    icon: <PiCopyrightFill />,
  },
];

// Full policy text — rendered as anchored sections on the page. Kept in one
// data table so edits are a single line change (no JSX hunting). Each block
// can carry a paragraph, an optional bullet list, or both.
const POLICY_DETAILS = [
  {
    id: "policy-shipping",
    icon: <FiTruck />,
    title: "Shipping Policy",
    intro:
      "We ship pan-India with reliable courier partners and dispatch every order within 1–2 business days of confirmation.",
    blocks: [
      {
        subtitle: "Processing & Dispatch",
        text: "Orders placed before 2 PM (weekdays) are dispatched the same day for Mumbai, Bengaluru, and Delhi. All other orders ship within 1–2 business days.",
      },
      {
        subtitle: "Delivery Timelines",
        list: [
          "Metro cities: 2–4 business days",
          "Rest of India: 4–7 business days",
          "Remote pincodes may take slightly longer",
        ],
      },
      {
        subtitle: "Shipping Charges",
        text: "Enjoy free shipping on orders above ₹2,500. Standard shipping charges are calculated at checkout for orders below that threshold, based on your pincode.",
      },
      {
        subtitle: "Tracking",
        text: "An AWB (tracking) number and courier link are shared via SMS and email as soon as your order is dispatched. You can also track from the My Orders section of your account.",
      },
    ],
    note: "Delivery timelines may be affected by public holidays, weather, and courier network delays. Rest assured, we monitor every shipment until it reaches you.",
  },
  {
    id: "policy-returns",
    icon: <FiPackage />,
    title: "Returns, Refunds & Replacement Policy",
    intro:
      "At DecorNArt, every product is carefully inspected and securely packed before dispatch to ensure it reaches you in excellent condition.",
    blocks: [
      {
        subtitle: "No Returns",
        text: "We do not accept returns on any products once an order has been delivered.",
      },
      {
        subtitle: "No Refunds",
        text: "All purchases are final. We do not offer refunds for any reason, including:",
        list: ["Change of mind", "Incorrect product selection", "Personal preference"],
      },
      {
        subtitle: "Replacement for Damaged Items Only",
        text: "A replacement will be provided only if the product is seriously damaged during transit.",
      },
      {
        subtitle: "Conditions for Replacement",
        list: [
          "A complete unboxing video must be recorded from the moment the sealed package is opened.",
          "The video must clearly show the sealed package, the entire unboxing process, and the damaged product without any cuts or edits.",
          "Claims submitted without a valid unboxing video will not be accepted.",
          "Damage must be reported within 24 hours of delivery along with the unboxing video and clear photographs of the damaged product.",
          "After verification, if the claim is approved, a replacement product will be sent.",
        ],
      },
    ],
    note: "Refunds will not be issued under any circumstances.",
    footer:
      "By placing an order with DecorNArt, you acknowledge and agree to this Returns, Refunds & Replacement Policy.",
  },
  {
    id: "policy-cancellation",
    icon: <FiXCircle />,
    title: "Cancellation Policy",
    intro:
      "You may cancel your order any time before it is packed and dispatched from our warehouse.",
    blocks: [
      {
        subtitle: "When You Can Cancel",
        text: "Cancellations are allowed only before dispatch. Once the order status changes to 'Shipped', cancellation is no longer possible.",
      },
      {
        subtitle: "How to Cancel",
        list: [
          "WhatsApp: +91 98765 43210",
          "Email: support@decornart.in",
          "Use the 'Cancel Order' option in the My Orders section of your account",
        ],
      },
      {
        subtitle: "Refund Timeline",
        text: "If a cancellation is approved before dispatch, the prepaid amount is refunded to the original payment method within 5–7 business days.",
      },
    ],
    note: "Custom or personalised orders cannot be cancelled once production has started.",
  },
  {
    id: "policy-payment",
    icon: <FiCreditCard />,
    title: "Payment Policy",
    intro:
      "All payments are processed securely through PCI-DSS compliant payment gateways.",
    blocks: [
      {
        subtitle: "Accepted Methods",
        list: [
          "UPI (Google Pay, PhonePe, Paytm, BHIM, and more)",
          "Credit & Debit Cards — Visa, MasterCard, RuPay, Amex",
          "Net Banking (all major banks)",
          "Popular wallets — Paytm, PhonePe, Mobikwik",
        ],
      },
      {
        subtitle: "Prices",
        text: "All prices are in Indian Rupees (INR). A tax invoice is issued for every order.",
      },
      {
        subtitle: "Cash on Delivery",
        text: "COD may be available for select pincodes at checkout. A nominal COD handling fee may apply and will be shown before you place the order.",
      },
      {
        subtitle: "Payment Failures",
        text: "If a payment is deducted but the order is not placed, the amount is automatically refunded by your bank within 5–7 business days. Contact us if you need help tracing a transaction.",
      },
    ],
    note: "We never store your full card details or CVV on our servers. Payments are handled entirely by our payment gateway.",
  },
  {
    id: "policy-privacy",
    icon: <FiShield />,
    title: "Privacy Policy",
    intro:
      "Your privacy matters to us. This policy explains what information we collect, why we collect it, and how we protect it.",
    blocks: [
      {
        subtitle: "Information We Collect",
        text: "Name, email, phone number, shipping address, and payment method — collected only when you register an account or place an order.",
      },
      {
        subtitle: "How We Use Your Data",
        list: [
          "To process and fulfil your orders",
          "To send order confirmations and shipment updates",
          "To personalise your shopping experience",
          "To share promotional offers, with your explicit consent",
        ],
      },
      {
        subtitle: "Sharing With Third Parties",
        text: "We share the minimum required information with our shipping partners (courier services) and payment gateway (Razorpay) purely to fulfil your order. We do not sell or rent your data to advertisers.",
      },
      {
        subtitle: "Your Rights",
        text: "You may request access to, correction of, or deletion of your personal data at any time by emailing support@decornart.in. We will respond within 30 days.",
      },
    ],
    note: "Cookies are used for cart persistence and analytics. You can disable them in your browser settings — some features may stop working if you do.",
  },
  {
    id: "policy-terms",
    icon: <FiFileText />,
    title: "Terms & Conditions",
    intro:
      "By accessing our website or placing an order, you agree to the following terms.",
    blocks: [
      {
        subtitle: "Order Acceptance",
        text: "All orders are subject to acceptance and product availability. We reserve the right to cancel orders in the event of stock issues, pricing errors, or suspected fraudulent activity.",
      },
      {
        subtitle: "Product Descriptions",
        text: "We strive for accuracy in colours and dimensions. Screen colours may not exactly match the physical product.",
      },
      {
        subtitle: "Pricing Errors",
        text: "If a product is listed with an incorrect price, we will contact you before dispatch with the corrected price and give you the option to confirm or cancel the order.",
      },
      {
        subtitle: "Account Security",
        text: "You are responsible for keeping your account credentials confidential. Any activity performed under your account is your responsibility.",
      },
      {
        subtitle: "Governing Law",
        text: "These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts of Mumbai.",
      },
    ],
  },
  {
    id: "policy-wholesale",
    icon: <FiUsers />,
    title: "Wholesale Policy",
    intro:
      "We work with retailers, event planners, and bulk buyers with special pricing and priority support.",
    blocks: [
      {
        subtitle: "Minimum Order Value",
        text: "Wholesale pricing kicks in above ₹15,000 per order. Volume-tiered discounts apply on larger orders — get in touch for a detailed quote.",
      },
      {
        subtitle: "Lead Times",
        text: "Wholesale orders typically ship within 3–7 business days depending on quantity and any custom requirements. We'll confirm the exact timeline at order confirmation.",
      },
      {
        subtitle: "Custom Packaging",
        text: "Branded packaging, gift notes, and bundled kits are available on request for wholesale orders. Ask us for samples before finalising.",
      },
      {
        subtitle: "How to Enquire",
        list: [
          "WhatsApp: +91 98765 43210",
          "Email: wholesale@decornart.in",
          "Fill the enquiry form on our Wholesale page",
        ],
      },
    ],
    note: "Tax invoices are issued for all wholesale orders.",
  },
  {
    id: "policy-ip",
    icon: <PiCopyrightFill />,
    title: "Intellectual Property",
    intro:
      "All content on decornart.in is the intellectual property of DecorNArt and its licensors.",
    blocks: [
      {
        subtitle: "Ownership",
        text: "Photographs, videos, illustrations, product designs, brand marks, and site copy are protected by copyright and trademark law.",
      },
      {
        subtitle: "Permitted Use",
        text: "You are welcome to browse and share links to our pages. Downloading, reproducing, or reposting our images and copy without written permission is not allowed.",
      },
      {
        subtitle: "Reporting Infringement",
        text: "If you believe your work has been used on our site without permission, email support@decornart.in with details and evidence. We will investigate and act promptly.",
      },
    ],
    note: "All rights reserved. Unauthorised commercial use will result in legal action.",
  },
];

const QUICK_LINKS = [
  { id: "track", label: "Track Your Order", href: "/order" },
  { id: "shipping", label: "Shipping Information", href: "/policies/shipping" },
  { id: "faq", label: "FAQ", href: "/faq" },
  { id: "returns", label: "Returns Portal", href: "/policies/return" },
  { id: "contact", label: "Contact Us", href: "/contact" },
  { id: "wholesale", label: "Wholesale Enquiries", href: "/wholesale" },
];

const BOTTOM_TRUST = [
  { id: "secure", title: "Secure Payments", copy: "100% safe & secure", icon: <FiShield /> },
  { id: "delivery", title: "Pan India Delivery", copy: "Fast & reliable shipping", icon: <FiTruck /> },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: <FiRotateCcw /> },
  { id: "premium", title: "Curated with Love", copy: "Crafted with passion", icon: <FaHeart /> },
  { id: "happy", title: "10,000+ Happy Customers", copy: "Trust & love us", icon: <FiAward /> },
];

export default function PoliciesView() {
  const root = useRef(null);
  const detailRef = useRef(null);
  // Only one detail section is shown at a time — selected by clicking a
  // "Learn More" button on the summary grid.
  const [activePolicyId, setActivePolicyId] = useState(null);
  const activeDetail = POLICY_DETAILS.find((d) => d.id === activePolicyId);

  const openPolicy = (detailId) => setActivePolicyId(detailId);
  const closePolicy = () => setActivePolicyId(null);

  // Smooth-scroll the freshly opened section into view.
  useEffect(() => {
    if (!activePolicyId || !detailRef.current) return;
    detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activePolicyId]);

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="Our policies">
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
            <h1 className={styles.heroTitle}>
              Our Policies{" "}
              <span aria-hidden="true" className={styles.heroHeart}>
                <FaHeart />
              </span>
            </h1>
            <p className={styles.heroLead}>Transparency you can trust.</p>
            <p className={styles.heroSub}>
              Everything you need to know about shopping with{" "}
              <span className={styles.brand}>DecorNArt</span>.
            </p>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        {/* ─────────── 2. Value strip ─────────── */}
        <section className={styles.valueStrip} aria-label="What we stand for">
          <ul className={styles.valueList}>
            {VALUE_STRIP.map((v) => (
              <li key={v.id} className={styles.valueItem}>
                <span className={styles.valueIcon} aria-hidden="true">
                  {v.icon}
                </span>
                <strong className={styles.valueTitle}>{v.title}</strong>
                <span className={styles.valueCopy}>{v.copy}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── 3. Policy grid ─────────── */}
        <section className={styles.policyGrid} aria-label="Policies">
          {POLICIES.map((p) => (
            <article key={p.id} className={styles.policyCard}>
              <span className={styles.policyIcon} aria-hidden="true">
                {p.icon}
              </span>
              <h2 className={styles.policyTitle}>{p.title}</h2>
              <p className={styles.policyCopy}>{p.copy}</p>
              <ul className={styles.policyBullets}>
                {p.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <button
                type="button"
                className={styles.policyLink}
                onClick={() => openPolicy(p.href.replace(/^#/, ""))}
                aria-expanded={activePolicyId === p.href.replace(/^#/, "")}
              >
                Learn More <FiArrowRight />
              </button>
            </article>
          ))}
        </section>

        {/* ─── Active policy detail (only the one the shopper clicked) ─── */}
        {activeDetail && (
          <section
            ref={detailRef}
            id={activeDetail.id}
            className={styles.detailSection}
            aria-label={activeDetail.title}
          >
            <header className={styles.detailHead}>
              <span className={styles.detailIcon} aria-hidden="true">
                {activeDetail.icon}
              </span>
              <h2 className={styles.detailTitle}>{activeDetail.title}</h2>
              <button
                type="button"
                className={styles.detailClose}
                onClick={closePolicy}
                aria-label="Close policy"
              >
                ×
              </button>
            </header>

            {activeDetail.intro && (
              <p className={styles.detailIntro}>{activeDetail.intro}</p>
            )}

            {activeDetail.blocks?.map((b, i) => (
              <div key={i} className={styles.detailBlock}>
                <h3 className={styles.detailSubtitle}>{b.subtitle}</h3>
                {b.text && <p>{b.text}</p>}
                {b.list && (
                  <ul className={styles.detailList}>
                    {b.list.map((li, j) => (
                      <li key={j}>{li}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {activeDetail.note && (
              <p className={styles.detailNote}>{activeDetail.note}</p>
            )}

            {activeDetail.footer && (
              <p className={styles.detailFooter}>
                By placing an order with{" "}
                <span className={styles.brand}>DecorNArt</span>, you acknowledge
                and agree to this policy.
              </p>
            )}
          </section>
        )}

        {/* ─────────── 4. Belief + Quick links ─────────── */}
        <section className={styles.beliefRow}>
          <div className={styles.beliefCard}>
            <div className={styles.beliefMedia} aria-hidden="true">
              <Image
                src={vaseImg}
                alt=""
                fill
                sizes="220px"
                className={styles.beliefImg}
              />
            </div>
            <div className={styles.beliefBody}>
              <h3 className={styles.beliefTitle}>
                We believe in
                <br />
                honest policies &amp; happy customers{" "}
                <span aria-hidden="true" className={styles.beliefHeart}>
                  &hearts;
                </span>
              </h3>
              <p className={styles.beliefSub}>
                If you have any questions about our policies,
                <br />
                please feel free to reach out to us.
              </p>
              <Link href="/contact" className={styles.beliefBtn}>
                Contact Us <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className={styles.quickCard}>
            <h3 className={styles.quickTitle}>Quick Links</h3>
            <ul className={styles.quickList}>
              {QUICK_LINKS.map((q) => (
                <li key={q.id}>
                  <Link href={q.href} className={styles.quickLink}>
                    <span>{q.label}</span>
                    <span aria-hidden="true" className={styles.quickArrow}>
                      <FiChevronRight />
                    </span>
                  </Link>
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
