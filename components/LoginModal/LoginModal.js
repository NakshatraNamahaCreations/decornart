"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  FiX,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiMail,
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
  {
    id: "secure",
    icon: <FiShield />,
    title: "Secure Login",
   
  },
  {
    id: "shipping",
    icon: <FiTruck />,
    title: "Pan India Shipping",
    
  },
  {
    id: "quality",
    icon: <FiAward />,
    title: "Premium Quality",
    
  },
  {
    id: "payments",
    icon: <FiCreditCard />,
    title: "Safe Payments",

  },
];

export default function LoginModal() {
  const { isOpen, closeLogin, openRegister, openForgot } = useLoginModal();
  const { login } = useAuth();
  const dialogRef = useRef(null);
  const emailRef = useRef(null);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [googleNote, setGoogleNote] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeLogin();
    window.addEventListener("keydown", onKey);
    setTimeout(() => emailRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeLogin]);

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setSubmitting(false);
      setShowPwd(false);
      setGoogleNote("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      closeLogin();
    } catch (err) {
      setError(err.message || "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) closeLogin();
  };

  // Google sign-in placeholder. The backend OAuth flow isn't wired up
  // yet — swap this for a redirect to `${API_BASE}/auth/google` once the
  // Passport strategy + callback route are in place.
  const handleGoogle = () => {
    setError("");
    setGoogleNote("Google sign-in coming soon — please use email for now.");
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      onMouseDown={onBackdrop}
    >
      <div className={styles.modal} ref={dialogRef}>
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
            <span className={styles.mediaEyebrow}>The Atelier</span>
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
              Welcome back{" "}
              <span aria-hidden="true" className={styles.eyebrowHeart}>
                <FaHeart />
              </span>
            </span>
            <h2 id="login-title" className={styles.title}>
              Continue Your DecorNArt Journey
            </h2>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.lead}>
              Access your orders, wishlist, rewards
              <br />
              and exclusive collections.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldIcon}>
              <span className={styles.fieldIconLeft} aria-hidden="true">
                <FiMail />
              </span>
              <input
                ref={emailRef}
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                className={styles.input}
                aria-label="Email address"
              />
            </div>

            <div className={styles.fieldIcon}>
              <span className={styles.fieldIconLeft} aria-hidden="true">
                <FiLock />
              </span>
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
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

            <div className={styles.optionsRow}>
              <label className={styles.remember}>
                <input type="checkbox" name="remember" />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                className={styles.forgot}
                onClick={openForgot}
              >
                Forgot Password?
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={styles.submit}
              disabled={submitting}
            >
              {submitting ? "Signing in…" : (
                <>
                  Sign in <FiArrowRight />
                </>
              )}
            </button>

            <div className={styles.orDivider} aria-hidden="true">
              <span>OR</span>
            </div>

            <button
              type="button"
              className={styles.googleBtn}
              onClick={handleGoogle}
              disabled={submitting}
            >
              <FcGoogle aria-hidden="true" />
              <span>Continue with Google</span>
            </button>
            {googleNote && (
              <p className={styles.googleNote} role="status">
                {googleNote}
              </p>
            )}

            <p className={styles.foot}>
              New to DecorNArt?{" "}
              <button
                type="button"
                className={styles.footLink}
                onClick={openRegister}
              >
                Create an Account
              </button>
            </p>
          </form>
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
