"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { sendContactMessage } from "@/lib/api/contact";
import styles from "./ContactForm.module.css";

// Business WhatsApp number (same one used in the footer chat CTA). Digits
// only, with country code — required by the wa.me deep-link format.
const WHATSAPP_NUMBER = "919986988786";

const REASONS = [
  {
    id: "bespoke",
    title: "Bespoke arrangements",
    copy: "Designed to your palette, occasion, and the season's freshest stems.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3c-1.5 3-1.5 6 0 9 1.5-3 1.5-6 0-9zM4 11c2.5 1.5 5 1.5 7.5 0-2.5-1.5-5-1.5-7.5 0zm15.5 0c-2.5 1.5-5 1.5-7.5 0 2.5-1.5 5-1.5 7.5 0zM12 12v9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "events",
    title: "Weddings & events",
    copy: "From a single bridal bouquet to a full installation — composed in-house.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="14"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M9 8l3-5 3 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "press",
    title: "Press & editorial",
    copy: "Stylists, magazines, and partners — we'd love to hear from you.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 7h12l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M7 4h7l2 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle
          cx="11"
          cy="14"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  {
    id: "visit",
    title: "Visit the atelier",
    copy: "By appointment in Khar West, Mumbai. Walk-ins welcome on Saturdays.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 21V9l8-5 8 5v12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M9 21v-7h6v7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ContactForm() {
  const root = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const data = new FormData(e.currentTarget);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    setSending(true);
    setError("");
    try {
      // Save the enquiry to the admin inbox first — the WhatsApp handoff
      // below is a secondary channel, not the source of record.
      await sendContactMessage({
        name,
        email,
        phone: phone || undefined,
        subject: "Contact form enquiry",
        message,
        type: "contact",
      });

      const lines = [
        `Hi Decor N Art, I'd like to get in touch.`,
        "",
        `Name: ${name}`,
        `Email: ${email}`,
      ];
      if (phone) lines.push(`Phone: ${phone}`);
      lines.push("", `Message:`, message);

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        lines.join("\n")
      )}`;
      window.open(url, "_blank", "noopener,noreferrer");
      setSubmitted(true);
    } catch (err) {
      setError(err?.message || "Could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.formCol} > *, .${styles.sideCol} > *`, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: `.${styles.grid}`, start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="write" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {/* ── Form (left) ───────────────────────────────── */}
          <div className={styles.formCol}>
            <span className={styles.eyebrow}>— Begin a letter</span>
            <h2 className={styles.heading}>Send us a message.</h2>
            <p className={styles.lead}>
              Fill in the form below and our atelier will respond within a day
              — usually the same morning.
            </p>

            {submitted ? (
              <div className={styles.thankyou}>
                <span className={styles.thankyouMark} aria-hidden="true">
                  ✓
                </span>
                <h3 className={styles.thankyouHeading}>
                  Continue on WhatsApp.
                </h3>
                <p className={styles.thankyouCopy}>
                  We've opened WhatsApp with your message ready to send — just
                  tap send there and we'll respond within a day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className={styles.thankyouReset}
                >
                  Write another →
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Your name</span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      required
                      className={styles.input}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91"
                      className={styles.input}
                    />
                  </label>
                </div>

                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.fieldLabel}>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    className={styles.input}
                  />
                </label>

                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.fieldLabel}>Tell us about it</span>
                  <textarea
                    name="message"
                    placeholder="The occasion, palette, where it's going, any stems you have in mind…"
                    rows={5}
                    required
                    className={`${styles.input} ${styles.textarea}`}
                  />
                </label>

                {error && (
                  <p className={styles.errorMsg} role="alert">
                    {error}
                  </p>
                )}

                <div className={styles.actions}>
                  <button
                    type="submit"
                    className={styles.submit}
                    disabled={sending}
                  >
                    {sending ? "Sending…" : "Send on WhatsApp"}{" "}
                    <span aria-hidden="true">→</span>
                  </button>
                  <span className={styles.actionsNote}>
                    Or write to{" "}
                    <a
                      href="mailto:official@decornart.in"
                      className={styles.actionsLink}
                    >
                      official@decornart.in
                    </a>
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* ── Why reach out (right) ────────────────────── */}
          <aside className={styles.sideCol}>
            <span className={styles.sideEyebrow}>— Why reach out to us?</span>
            <h3 className={styles.sideHeading}>
              We make for <em>one door at a time</em>.
            </h3>
            <span className={styles.sideRule} aria-hidden="true" />

            <ul className={styles.reasons}>
              {REASONS.map((r, i) => (
                <li key={r.id} className={styles.reason}>
                  <span className={styles.reasonIcon} aria-hidden="true">
                    {r.icon}
                  </span>
                  <div className={styles.reasonBody}>
                    <div className={styles.reasonHead}>
                      <h4 className={styles.reasonTitle}>{r.title}</h4>
                      <span className={styles.reasonOrd}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className={styles.reasonCopy}>{r.copy}</p>
                  </div>
                </li>
              ))}
            </ul>

          </aside>
        </div>
      </div>
    </section>
  );
}
