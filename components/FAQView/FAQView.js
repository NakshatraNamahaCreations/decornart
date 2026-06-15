"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./FAQView.module.css";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "delivery", label: "Delivery" },
  { id: "orders", label: "Orders & payment" },
  { id: "care", label: "Flower care" },
  { id: "returns", label: "Returns" },
  { id: "wholesale", label: "Wholesale" },
];

const FAQS = [
  {
    id: "q1",
    category: "delivery",
    q: "Where do you deliver?",
    a: "We currently deliver same-day across Mumbai, Bengaluru, Delhi and Pune. For other cities, next-day couriered delivery is available — choose your city at checkout and you'll see the available windows.",
  },
  {
    id: "q2",
    category: "delivery",
    q: "What are your delivery windows?",
    a: "Same-day orders placed before 1:00 PM IST go out in the 4:00–7:00 PM window. Orders placed before 9:00 AM can request a morning slot (9:30 AM–noon). Choose a window at checkout.",
  },
  {
    id: "q3",
    category: "delivery",
    q: "Can I send a bouquet as a surprise?",
    a: "Yes — gift orders ship without invoice, with a hand-written card you can compose at checkout. Our atelier calls the recipient discreetly once they're at the door rather than ringing in advance.",
  },
  {
    id: "q4",
    category: "orders",
    q: "Which payment methods do you accept?",
    a: "We accept all major Indian credit and debit cards, UPI, net-banking and the leading wallets through Razorpay. GST at 5% is shown clearly at cart.",
  },
  {
    id: "q5",
    category: "orders",
    q: "Can I edit my order after placing it?",
    a: "Up to two hours after placing your order — write to us at hello@decornart.in and our atelier will adjust the bouquet, the message card or the delivery window where the schedule allows.",
  },
  {
    id: "q6",
    category: "orders",
    q: "Do you offer subscriptions?",
    a: "We run a small weekly and fortnightly programme for homes and studios. Email atelier@decornart.in with your preferred cadence and city — we'll respond within a working day.",
  },
  {
    id: "q7",
    category: "care",
    q: "How do I make the bouquet last longer?",
    a: "Trim the stems at a 45° angle every two days, change the water daily and keep the vase out of direct sun and away from ripening fruit. The sachet of feed in your card pocket is enough for the first three days.",
  },
  {
    id: "q8",
    category: "care",
    q: "The bouquet arrived wilted — what should I do?",
    a: "Re-cut the stems under running water and let the bouquet rest in cool, fresh water in a quiet room for two to four hours. If the stems don't recover, send a photograph within twenty-four hours and we'll replace the bouquet at no charge.",
  },
  {
    id: "q9",
    category: "returns",
    q: "What is your return policy?",
    a: "Because each bouquet is composed by hand and perishable, we don't accept returns — but we replace any bouquet that arrives damaged, late or off-brief, no questions asked. Reach out within twenty-four hours of delivery.",
  },
  {
    id: "q10",
    category: "returns",
    q: "How are refunds processed?",
    a: "Approved refunds are returned to the original payment method within five to seven working days. Replacement bouquets are typically dispatched the same evening or the next morning.",
  },
  {
    id: "q11",
    category: "wholesale",
    q: "Do you take corporate and event orders?",
    a: "Yes — weddings, brand activations, hotel lobbies and recurring office orders are a meaningful part of what the atelier does. Write to wholesale@decornart.in with the date, scale and any references and we'll respond within a working day.",
  },
  {
    id: "q12",
    category: "wholesale",
    q: "Is there a minimum order for wholesale?",
    a: "Our wholesale programme begins at ten bouquets per delivery or a single arrangement above ₹15,000. Below that, our retail bouquets are usually the better fit.",
  },
];

export default function FAQView() {
  const root = useRef(null);
  const [category, setCategory] = useState("all");
  const [openId, setOpenId] = useState("q1");

  const list = useMemo(
    () =>
      category === "all"
        ? FAQS
        : FAQS.filter((f) => f.category === category),
    [category]
  );

  useGSAP(
    () => {
      gsap.from(
        `.${styles.crumbs}, .${styles.eyebrow}, .${styles.heading}, .${styles.rule}, .${styles.lead}`,
        { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }
      );
      gsap.from(`.${styles.chip}`, {
        opacity: 0,
        y: 12,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.4,
      });
      gsap.from(`.${styles.row}`, {
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.list}`, start: "top 85%" },
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
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbActive}>Frequently asked</span>
        </nav>

        {/* Head */}
        <header className={styles.head}>
          <span className={styles.eyebrow}>— Help & answers</span>
          <h1 className={styles.heading}>
            Quietly answered, <em>often asked</em>.
          </h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>
            The questions our atelier receives most often — on delivery,
            payment, flower care and beyond. If yours isn't here, we're a
            short note away.
          </p>
        </header>

        {/* Category chips */}
        <div className={styles.chips} role="tablist" aria-label="FAQ categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={category === c.id}
              onClick={() => setCategory(c.id)}
              className={`${styles.chip} ${
                category === c.id ? styles.chipActive : ""
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <ul className={styles.list}>
          {list.length === 0 ? (
            <li className={styles.empty}>
              No questions in this category yet — try another.
            </li>
          ) : (
            list.map((f, i) => {
              const isOpen = openId === f.id;
              return (
                <li key={f.id} className={styles.row}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : f.id)}
                    className={styles.rowHead}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.rowOrd}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.rowQ}>{f.q}</span>
                    <span
                      className={`${styles.rowToggle} ${
                        isOpen ? styles.rowToggleOpen : ""
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className={styles.rowBody}>
                      <p>{f.a}</p>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>

        {/* Footer CTA */}
        <aside className={styles.aside}>
          <div>
            <span className={styles.asideEyebrow}>— Still curious</span>
            <h2 className={styles.asideHeading}>
              Didn't find your <em>answer</em>?
            </h2>
            <p className={styles.asideCopy}>
              Write to our atelier — we reply within a working day, often
              before the bouquets go out.
            </p>
          </div>
          <div className={styles.asideActions}>
            <a href="/contact" className={styles.cta}>
              Write to the atelier <span aria-hidden="true">→</span>
            </a>
            <a href="mailto:hello@decornart.in" className={styles.ghost}>
              hello@decornart.in
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
