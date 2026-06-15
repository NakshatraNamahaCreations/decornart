"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./WholesaleView.module.css";

const SERVICES = [
  {
    id: "bulk",
    title: "Bulk orders",
    copy: "Ten bouquets and up — hand-tied to a single brief, dispatched in synchronised windows across our delivery cities.",
  },
  {
    id: "corporate",
    title: "Corporate gifting",
    copy: "Festive sends, client thank-yous and onboarding gifts — branded notecards, consolidated invoicing, recurring schedules.",
  },
  {
    id: "events",
    title: "Event florals",
    copy: "Weddings, brand activations, hotel lobbies, dinner parties. Site visits in Mumbai, Bengaluru, Delhi and Pune.",
  },
];

const INITIAL_FORM = {
  type: "bulk",
  company: "",
  name: "",
  email: "",
  phone: "",
  date: "",
  quantity: "",
  budget: "",
  brief: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WholesaleView() {
  const root = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.company.trim() || !form.name.trim()) {
      setStatus({
        type: "error",
        msg: "Please share your company and contact name so we know who's writing.",
      });
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setStatus({
        type: "error",
        msg: "That email doesn't look quite right — could you check it?",
      });
      return;
    }
    if (!form.brief.trim()) {
      setStatus({
        type: "error",
        msg: "A short brief helps us respond meaningfully — even a sentence is plenty.",
      });
      return;
    }

    // TODO: POST to /api/wholesale once the service exists.
    setStatus({
      type: "success",
      msg: "Thank you — your enquiry is with the atelier. We'll write back within a working day.",
    });
    setForm(INITIAL_FORM);
  };

  useGSAP(
    () => {
      gsap.from(
        `.${styles.crumbs}, .${styles.eyebrow}, .${styles.heading}, .${styles.rule}, .${styles.lead}`,
        { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }
      );
      gsap.from(`.${styles.svc}`, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.services}`, start: "top 85%" },
      });
gsap.from(`.${styles.form} > *`, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.form}`, start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbActive}>Wholesale</span>
        </nav>

        {/* Head */}
        <header className={styles.head}>
          <span className={styles.eyebrow}>— For brands & florists</span>
          <h1 className={styles.heading}>
            Wholesale, gifting <em>& events</em>.
          </h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>
            B2B enquiry form for bulk orders, corporate gifting and event
            florists. Tell us the brief — the date, scale and references —
            and our atelier responds within a working day.
          </p>
        </header>

        {/* Services */}
        <div className={styles.services}>
          {SERVICES.map((s) => (
            <article key={s.id} className={styles.svc}>
              <span className={styles.svcOrd}>0{SERVICES.indexOf(s) + 1}</span>
              <h2 className={styles.svcTitle}>{s.title}</h2>
              <p className={styles.svcCopy}>{s.copy}</p>
            </article>
          ))}
        </div>

{/* Enquiry form */}
        <div className={styles.layout}>
          <aside className={styles.aside}>
            <span className={styles.asideEyebrow}>— Tell us the brief</span>
            <h2 className={styles.asideHeading}>
              Send us a <em>note</em>.
            </h2>
            <p className={styles.asideCopy}>
              The more you share, the more useful our reply. References,
              dates, recipient counts, budget brackets — none of it is
              required, all of it is welcome.
            </p>
            <ul className={styles.asideList}>
              <li>wholesale@decornart.in</li>
              <li>+91 98765 43210 · Mon–Sat · 10 AM–7 PM</li>
              <li>Site visits across Mumbai, Bengaluru, Delhi & Pune</li>
            </ul>
          </aside>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.fieldFull}>
              <span className={styles.fieldLabel}>Enquiry type</span>
              <div className={styles.segmented} role="radiogroup">
                {SERVICES.map((s) => (
                  <label
                    key={s.id}
                    className={`${styles.segment} ${
                      form.type === s.id ? styles.segmentActive : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={s.id}
                      checked={form.type === s.id}
                      onChange={onChange("type")}
                    />
                    {s.title}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.row2}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Company / Brand</span>
                <input
                  type="text"
                  value={form.company}
                  onChange={onChange("company")}
                  className={styles.input}
                  placeholder=""
                  required
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Contact name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={onChange("name")}
                  className={styles.input}
                  placeholder=""
                  required
                />
              </label>
            </div>

            <div className={styles.row2}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  className={styles.input}
                  placeholder=""
                  required
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Phone</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={onChange("phone")}
                  className={styles.input}
                  placeholder="+91"
                />
              </label>
            </div>

            <div className={styles.row3}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Event / delivery date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={onChange("date")}
                  className={styles.input}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Estimated quantity</span>
                <input
                  type="text"
                  value={form.quantity}
                  onChange={onChange("quantity")}
                  className={styles.input}
                  placeholder=""
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Budget range</span>
                <select
                  value={form.budget}
                  onChange={onChange("budget")}
                  className={styles.input}
                >
                  <option value="">Select a range</option>
                  <option value="under-50k">Under ₹50,000</option>
                  <option value="50k-2l">₹50,000 – ₹2,00,000</option>
                  <option value="2l-5l">₹2,00,000 – ₹5,00,000</option>
                  <option value="above-5l">Above ₹5,00,000</option>
                  <option value="open">Open / advise me</option>
                </select>
              </label>
            </div>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span className={styles.fieldLabel}>The brief</span>
              <textarea
                rows={5}
                value={form.brief}
                onChange={onChange("brief")}
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Write a short description"
                required
              />
            </label>

            <div className={styles.submitRow}>
              <button type="submit" className={styles.submit}>
                Send enquiry <span aria-hidden="true">→</span>
              </button>
              <p
                className={`${styles.status} ${
                  status.type === "error"
                    ? styles.statusError
                    : status.type === "success"
                    ? styles.statusSuccess
                    : ""
                }`}
                role="status"
              >
                {status.msg}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
