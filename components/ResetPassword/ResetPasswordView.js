"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHeart } from "react-icons/fa";
import { FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useLoginModal } from "@/components/LoginModal/LoginModalContext";
import { resetPassword } from "@/lib/api/auth";
import styles from "./ResetPasswordView.module.css";

// Landing page for the /reset-password?token=… link in the reset email.
// If the token is missing or expired the backend returns "Reset link is
// invalid or has expired" — we show that inline. Success bounces to
// /login (via the login modal) after a short pause.
export default function ResetPasswordView({ token }) {
  const router = useRouter();
  const { openLogin } = useLoginModal();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const tokenMissing = !token || token.length < 20;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword({ token, newPassword: password });
      setDone(true);
      // Give the user a moment to read the success message before the
      // login modal appears on the home page.
      setTimeout(() => {
        router.push("/");
        openLogin();
      }, 1800);
    } catch (err) {
      setError(err?.message || "Could not reset your password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="reset-title">
        <span className={styles.eyebrow}>
          Password reset{" "}
          <span aria-hidden="true" className={styles.eyebrowHeart}>
            <FaHeart />
          </span>
        </span>
        <h1 id="reset-title" className={styles.title}>
          {done ? (
            <>You&rsquo;re all <em>set</em>.</>
          ) : tokenMissing ? (
            <>This link is <em>invalid</em>.</>
          ) : (
            <>Set a <em>new password</em></>
          )}
        </h1>

        {done ? (
          <>
            <p className={styles.sub}>
              Your password has been updated. Sign in with your new password.
            </p>
            <div className={styles.successBox}>
              <span aria-hidden="true" className={styles.successIcon}>
                <FiCheckCircle />
              </span>
              <div>
                <strong>Password updated</strong>
                <span>Redirecting you to sign in…</span>
              </div>
            </div>
          </>
        ) : tokenMissing ? (
          <>
            <p className={styles.sub}>
              The reset link is missing or malformed. Request a fresh link
              from the sign-in screen.
            </p>
            <Link href="/" className={styles.submit}>
              Back to home <FiArrowRight />
            </Link>
          </>
        ) : (
          <>
            <p className={styles.sub}>
              Pick a strong password — at least 8 characters. You&rsquo;ll be
              signed out on every other device.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span className={styles.label}>New password</span>
                <div className={styles.pwdWrap}>
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={128}
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
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
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Confirm new password</span>
                <div className={styles.pwdWrap}>
                  <input
                    type={showPwd ? "text" : "password"}
                    name="confirm"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={128}
                    className={styles.input}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat the new password"
                  />
                  <span className={styles.pwdToggle} aria-hidden="true">
                    <FiLock />
                  </span>
                </div>
              </label>

              {error && (
                <p role="alert" className={styles.error}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={styles.submit}
                disabled={submitting}
              >
                {submitting ? "Updating…" : (
                  <>
                    Update password <FiArrowRight />
                  </>
                )}
              </button>

              <p className={styles.foot}>
                Remembered it?{" "}
                <Link href="/" className={styles.footLink}>
                  Back to sign in
                </Link>
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
