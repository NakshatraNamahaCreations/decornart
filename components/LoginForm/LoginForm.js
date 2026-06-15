"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAuth } from "@/components/providers/AuthProvider";
import authImg from "@/assets/collect-2.png";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const root = useRef(null);
  const router = useRouter();
  const { login } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    try {
      await login({
        email: data.get("email"),
        password: data.get("password"),
      });
      router.push("/account");
    } catch (err) {
      setError(err.message || "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <span className={styles.frameTag}>The Atelier</span>
            <div className={styles.media}>
              <Image
                src={authImg}
                alt="A hand-tied bouquet from the Decornart atelier"
                fill
                sizes="(max-width: 860px) 90vw, 45vw"
                priority
              />
            </div>
            <span className={styles.mediaCaption}>
              <span className={styles.mediaCaptionTitle}>
                "Welcome back to the atelier."
              </span>
              <span className={styles.mediaCaptionSub}>— Decornart</span>
            </span>
          </div>

          {/* ── Form (right) ──────────────────────────────── */}
          <div className={styles.formCol}>
            <span className={styles.eyebrow}>— Welcome back</span>
            <h1 className={styles.heading}>
              Sign in to your <em>atelier</em>.
            </h1>
            <p className={styles.lead}>
              Continue your order, revisit a saved bouquet, or check on a
              delivery — your space, the way you left it.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
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
                  <span className={styles.fieldLabel}>Password</span>
                  <div className={styles.pwdWrap}>
                    <input
                      type={showPwd ? "text" : "password"}
                      name="password"
                      placeholder=""
                      required
                      autoComplete="current-password"
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

                <div className={styles.optionsRow}>
                  <label className={styles.remember}>
                    <input type="checkbox" name="remember" />
                    <span>Keep me signed in</span>
                  </label>
                  <a href="/forgot-password" className={styles.forgot}>
                    Forgot password?
                  </a>
                </div>

                {error && (
                  <span className={styles.actionsNote} style={{ color: "#b00" }}>
                    {error}
                  </span>
                )}

                <div className={styles.actions}>
                  <button type="submit" className={styles.submit} disabled={submitting}>
                    {submitting ? "Signing in…" : <>Sign in <span aria-hidden="true">→</span></>}
                  </button>
                  <span className={styles.actionsNote}>
                    New to the atelier?{" "}
                    <a href="/register" className={styles.actionsLink}>
                      Create an account
                    </a>
                  </span>
                </div>
              </form>
          </div>
        </div>
      </div>
    </section>
  );
}
