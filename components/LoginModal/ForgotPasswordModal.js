"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { FiX, FiArrowRight, FiCheckCircle, FiMail } from "react-icons/fi";
import { useLoginModal } from "./LoginModalContext";
import { forgotPassword } from "@/lib/api/auth";
import authImg from "@/assets/basket.png";
import styles from "./LoginModal.module.css";

// Password reset popup. Wired to the login modal via LoginModalContext —
// clicking "Forgot password?" in the login modal opens this. Currently client-
// only: shows a generic confirmation after submit so a user can't tell whether
// the email exists (also stops leaking valid accounts). When the backend adds
// POST /auth/forgot, plug it into onSubmit and keep the same confirmation UI.

export default function ForgotPasswordModal() {
  const { isForgotOpen, closeLogin, openLogin } = useLoginModal();
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isForgotOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeLogin();
    window.addEventListener("keydown", onKey);
    setTimeout(() => emailRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isForgotOpen, closeLogin]);

  useEffect(() => {
    if (!isForgotOpen) {
      setEmail("");
      setSubmitting(false);
      setSent(false);
    }
  }, [isForgotOpen]);

  if (!isForgotOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // The backend always responds 200 whether or not the email matches an
    // account (prevents enumeration). Any thrown error here is a real
    // problem — network, validation, or rate-limit — but we still swap to
    // the "sent" screen so we never leak which case it was.
    try {
      await forgotPassword(email.trim().toLowerCase());
    } catch {
      /* swallow — show the same generic confirmation */
    }
    setSubmitting(false);
    setSent(true);
  };

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) closeLogin();
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-title"
      onMouseDown={onBackdrop}
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.close}
          onClick={closeLogin}
          aria-label="Close"
        >
          <FiX />
        </button>

        <div className={styles.media} aria-hidden="true">
          <Image
            src={authImg}
            alt=""
            fill
            sizes="(max-width: 720px) 100vw, 320px"
            className={styles.mediaImg}
          />
          <div className={styles.mediaScrim}>
            <span className={styles.mediaEyebrow}>Account recovery</span>
          </div>
        </div>

        <div className={styles.body}>
          <span className={styles.eyebrow}>
            Reset link{" "}
            <span aria-hidden="true" className={styles.eyebrowHeart}>
              <FaHeart />
            </span>
          </span>
          <h2 id="forgot-title" className={styles.title}>
            {sent ? (
              <>Check your <em>inbox</em>.</>
            ) : (
              <>Forgot your <em>password</em>?</>
            )}
          </h2>

          {sent ? (
            <>
              <p className={styles.sub}>
                If an account exists for <strong>{email}</strong>, a reset link
                has been sent. It expires in 30 minutes.
              </p>
              <div className={styles.sentBox}>
                <span aria-hidden="true" className={styles.sentIcon}>
                  <FiCheckCircle />
                </span>
                <div>
                  <strong>Email on its way</strong>
                  <span>Don&rsquo;t see it? Check spam or promotions.</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.submit}
                onClick={openLogin}
              >
                Back to sign in <FiArrowRight />
              </button>
            </>
          ) : (
            <>
              <p className={styles.sub}>
                Enter the email you use to sign in. We&rsquo;ll send you a link
                to set a new password.
              </p>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  <span className={styles.label}>Email</span>
                  <div className={styles.pwdWrap}>
                    <input
                      ref={emailRef}
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                    <span className={styles.pwdToggle} aria-hidden="true">
                      <FiMail />
                    </span>
                  </div>
                </label>

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={submitting}
                >
                  {submitting ? (
                    "Sending link…"
                  ) : (
                    <>
                      Send reset link <FiArrowRight />
                    </>
                  )}
                </button>

                <p className={styles.foot}>
                  Remembered it?{" "}
                  <button
                    type="button"
                    className={styles.footLink}
                    onClick={openLogin}
                  >
                    Back to sign in
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
