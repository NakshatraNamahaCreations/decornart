"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAuth } from "@/components/providers/AuthProvider";
import authImg from "@/assets/collect-4.png";
import styles from "./RegisterForm.module.css";

const BENEFITS = [
  "Same-day, in-house delivery across Mumbai, Bengaluru, Delhi & Pune",
  "Early access to the weekly handmade drop",
  "Save addresses, order history, and re-order in one tap",
  "A 10% credit on your first bespoke arrangement",
];

export default function RegisterForm() {
  const root = useRef(null);
  const router = useRouter();
  const { register } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const firstName = (data.get("firstName") || "").toString().trim();
    const lastName = (data.get("lastName") || "").toString().trim();
    const payload = {
      name: `${firstName} ${lastName}`.trim(),
      email: data.get("email"),
      password: data.get("password"),
      phone: data.get("phone") || undefined,
    };
    try {
      await register(payload);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  // Already signed in after register — bounce them to the account view.
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => router.push("/account"), 1600);
    return () => clearTimeout(t);
  }, [submitted, router]);

  useGSAP(
    () => {
      gsap.from(`.${styles.media}`, {
        scale: 0.96,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
      });
      gsap.from(`.${styles.formCol} > *`, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container">
        <div className={styles.spread}>
          {/* ── Media (left) ──────────────────────────────── */}
          <div className={styles.mediaWrap}>
            <span className={styles.frameTag}> Join the Atelier</span>
            <div className={styles.media}>
              <Image
                src={authImg}
                alt="A hand-tied bouquet from the Decornart atelier"
                fill
                sizes="(max-width: 860px) 90vw, 45vw"
                priority
              />
            </div>

            <div className={styles.benefits}>
              <span className={styles.benefitsTitle}>Members receive</span>
              <ul className={styles.benefitsList}>
                {BENEFITS.map((b, i) => (
                  <li key={i} className={styles.benefit}>
                    <span className={styles.benefitDot} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Form (right) ──────────────────────────────── */}
          <div className={styles.formCol}>
            <span className={styles.eyebrow}>— Create an account</span>
            <h1 className={styles.heading}>
              Begin with the <em>atelier</em>.
            </h1>
            <p className={styles.lead}>
              A few details, and you're in — same-day delivery, the weekly
              drop, and a quiet place to keep the bouquets you love.
            </p>

            {submitted ? (
              <div className={styles.thankyou} role="status" aria-live="polite">
                <span className={styles.thankyouMark} aria-hidden="true">
                  ✓
                </span>
                <h3 className={styles.thankyouHeading}>
                  Account created successfully.
                </h3>
                <p className={styles.thankyouCopy}>
                  Redirecting you to{" "}
                  <a href="/login" className={styles.thankyouLink}>
                    sign in
                  </a>
                  …
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>First name</span>
                    <input
                      type="text"
                      name="firstName"
                      placeholder=""
                      required
                      autoComplete="given-name"
                      className={styles.input}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Last name</span>
                    <input
                      type="text"
                      name="lastName"
                      placeholder=""
                      required
                      autoComplete="family-name"
                      className={styles.input}
                    />
                  </label>
                </div>

                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.fieldLabel}>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder=""
                    required
                    autoComplete="email"
                    className={styles.input}
                  />
                </label>

                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.fieldLabel}>Phone (optional)</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91"
                    autoComplete="tel"
                    className={styles.input}
                  />
                </label>

                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.fieldLabel}>
                    Password
                    <span className={styles.fieldHint}>
                      8+ characters
                    </span>
                  </span>
                  <div className={styles.pwdWrap}>
                    <input
                      type={showPwd ? "text" : "password"}
                      name="password"
                      placeholder=""
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className={styles.input}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className={styles.pwdToggle}
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <label className={styles.terms}>
                  <input type="checkbox" name="terms" required />
                  <span>
                    I agree to Decornart's{" "}
                    <a href="/terms" className={styles.termsLink}>
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className={styles.termsLink}>
                      Privacy
                    </a>
                    . We only write when it matters.
                  </span>
                </label>

                {error && (
                  <span className={styles.actionsNote} style={{ color: "#b00" }}>
                    {error}
                  </span>
                )}

                <div className={styles.actions}>
                  <button type="submit" className={styles.submit} disabled={submitting}>
                    {submitting ? "Creating account…" : <>Create account <span aria-hidden="true">→</span></>}
                  </button>
                  <span className={styles.actionsNote}>
                    Already a member?{" "}
                    <a href="/login" className={styles.actionsLink}>
                      Sign in
                    </a>
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
