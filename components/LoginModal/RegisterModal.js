"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import {
  FiX,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiShield,
  FiTruck,
  FiAward,
  FiCreditCard,
} from "react-icons/fi";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLoginModal } from "./LoginModalContext";
import authImg from "@/assets/login-image.jpeg";
import brandLogo from "@/assets/decor-logo-wbg.png";
import styles from "./LoginModal.module.css";

const TRUST_ITEMS = [
  { id: "secure", icon: <FiShield />, title: "Secure Login" },
  { id: "shipping", icon: <FiTruck />, title: "Pan India Shipping" },
  { id: "quality", icon: <FiAward />, title: "Premium Quality" },
  { id: "payments", icon: <FiCreditCard />, title: "Safe Payments" },
];

export default function RegisterModal() {
  const { isRegisterOpen, closeLogin, openLogin } = useLoginModal();
  const { register } = useAuth();
  const firstRef = useRef(null);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isRegisterOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeLogin();
    window.addEventListener("keydown", onKey);
    setTimeout(() => firstRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isRegisterOpen, closeLogin]);

  useEffect(() => {
    if (!isRegisterOpen) {
      setError("");
      setSubmitting(false);
      setShowPwd(false);
      setSubmitted(false);
    }
  }, [isRegisterOpen]);

  if (!isRegisterOpen) return null;

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
      setTimeout(() => openLogin(), 1500);
    } catch (err) {
      setError(err.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) closeLogin();
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
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
            sizes="(max-width: 720px) 100vw, 420px"
            className={styles.mediaImg}
          />
          <div className={styles.mediaScrim}>
            <span className={styles.mediaEyebrow}>Join the Atelier</span>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.bodyScroll}>
            <div className={styles.headStack}>
              <div className={styles.brand}>
                <Image
                  src={brandLogo}
                  alt=""
                  width={110}
                  height={110}
                  className={styles.brandMark}
                  priority
                />
                <span className={styles.brandTag}>Where Elegance Meets Emotion</span>
              </div>

              <span className={styles.eyebrow}>
                Join us{" "}
                <span aria-hidden="true" className={styles.eyebrowHeart}>
                  <FaHeart />
                </span>
              </span>
              <h2 id="register-title" className={styles.title}>
                Create Your DecorNArt Account
              </h2>
              <span className={styles.rule} aria-hidden="true" />
              <p className={styles.lead}>
                Save wishlists, track orders, and unlock
                <br />
                member-only offers.
              </p>
            </div>

            {submitted ? (
              <div className={styles.thankyou}>
                <span className={styles.thankyouMark} aria-hidden="true">
                  <FiCheck />
                </span>
                <strong>Account created successfully.</strong>
                <span>Taking you to sign in…</span>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldIcon}>
                    <span className={styles.fieldIconLeft} aria-hidden="true">
                      <FiUser />
                    </span>
                    <input
                      ref={firstRef}
                      type="text"
                      name="firstName"
                      required
                      autoComplete="given-name"
                      placeholder="First name"
                      className={styles.input}
                      aria-label="First name"
                    />
                  </div>
                  <div className={styles.fieldIcon}>
                    <span className={styles.fieldIconLeft} aria-hidden="true">
                      <FiUser />
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      required
                      autoComplete="family-name"
                      placeholder="Last name"
                      className={styles.input}
                      aria-label="Last name"
                    />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.fieldIcon}>
                    <span className={styles.fieldIconLeft} aria-hidden="true">
                      <FiMail />
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="Email address"
                      className={styles.input}
                      aria-label="Email address"
                    />
                  </div>
                  <div className={styles.fieldIcon}>
                    <span className={styles.fieldIconLeft} aria-hidden="true">
                      <FiPhone />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="Phone (optional)"
                      className={styles.input}
                      aria-label="Phone number"
                    />
                  </div>
                </div>

                <div className={styles.fieldIcon}>
                  <span className={styles.fieldIconLeft} aria-hidden="true">
                    <FiLock />
                  </span>
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Create a password (8+ characters)"
                    className={styles.input}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className={styles.pwdToggle}
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <label className={styles.terms}>
                  <input type="checkbox" name="terms" required />
                  <span>
                    I agree to Decornart&rsquo;s{" "}
                    <Link
                      href="/policies#policy-terms"
                      className={styles.termsLink}
                      onClick={closeLogin}
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/policies#policy-privacy"
                      className={styles.termsLink}
                      onClick={closeLogin}
                    >
                      Privacy
                    </Link>
                    .
                  </span>
                </label>

                {error && <p className={styles.error}>{error}</p>}

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={submitting}
                >
                  {submitting ? "Creating account…" : (
                    <>
                      Create Account <FiArrowRight />
                    </>
                  )}
                </button>

                <div className={styles.orDivider} aria-hidden="true">
                  <span>OR</span>
                </div>

                <p className={styles.foot}>
                  Already a member?{" "}
                  <button
                    type="button"
                    className={styles.footLink}
                    onClick={openLogin}
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>

          <ul className={styles.trust} aria-label="Why DecorNArt">
            {TRUST_ITEMS.map((t) => (
              <li key={t.id} className={styles.trustItem}>
                <span className={styles.trustIcon} aria-hidden="true">
                  {t.icon}
                </span>
                <span className={styles.trustBody}>
                  <strong>{t.title}</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}