"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { listReviews, createReview } from "@/lib/api/reviews";
import { useAuth } from "@/components/providers/AuthProvider";
import styles from "./ProductReviews.module.css";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function ProductReviews({ productId }) {
  const root = useRef(null);
  const { isAuthed } = useAuth();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", body: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await listReviews(productId, { limit: 20 });
        if (!cancelled) setReviews(data?.items || data || []);
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const list = reviews
    .filter((r) => (filter === "all" ? true : r.rating === Number(filter)))
    .sort((a, b) => {
      if (sort === "high") return b.rating - a.rating;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const submit = async (e) => {
    e.preventDefault();
    if (!productId || !isAuthed) return;
    setSubmitting(true);
    try {
      await createReview(productId, form);
      const data = await listReviews(productId, { limit: 20 });
      setReviews(data?.items || data || []);
      setForm({ rating: 5, title: "", body: "" });
      setShowForm(false);
    } catch {
      /* surface via toast */
    } finally {
      setSubmitting(false);
    }
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.review}`, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.list}`, start: "top 85%" },
      });
    },
    { scope: root, dependencies: [list.length] }
  );

  return (
    <section ref={root} id="reviews" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <span className={styles.eyebrow}>— What people are saying</span>
          <h2 className={styles.heading}>
            From those who've <em>sent it</em>.
          </h2>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {["all", "5", "4", "3"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`${styles.filter} ${
                  filter === f ? styles.filterActive : ""
                }`}
              >
                {f === "all" ? "All reviews" : `${f} stars`}
              </button>
            ))}
          </div>
          <div className={styles.sort}>
            <span className={styles.sortLabel}>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={styles.select}
              aria-label="Sort reviews"
            >
              <option value="recent">Most recent</option>
              <option value="high">Highest rated</option>
            </select>
          </div>
          {isAuthed && (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className={styles.filter}
            >
              {showForm ? "Cancel" : "Write a review"}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={submit} style={{ marginBottom: "2rem", display: "grid", gap: "0.75rem" }}>
            <label>
              Rating
              <select
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
            </label>
            <input
              type="text"
              placeholder="Title (optional)"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <textarea
              rows={4}
              placeholder="Tell us about it"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Post review"}
            </button>
          </form>
        )}

        <ul className={styles.list}>
          {loading ? (
            <li className={styles.empty}>Loading reviews…</li>
          ) : list.length === 0 ? (
            <li className={styles.empty}>
              No reviews yet — be the first to share your impression.
            </li>
          ) : (
            list.map((r) => (
              <li key={r.id || r._id} className={styles.review}>
                <div className={styles.reviewHead}>
                  <span className={styles.avatar} aria-hidden="true">
                    {(r.name || r.user?.name || "A").charAt(0)}
                  </span>
                  <div className={styles.reviewMeta}>
                    <span className={styles.reviewName}>
                      {r.name || r.user?.name || "Anonymous"}
                      {r.verified && (
                        <span className={styles.verified}>· Verified</span>
                      )}
                    </span>
                    <span className={styles.reviewSub}>
                      {r.location ? `${r.location} · ` : ""}
                      {formatDate(r.createdAt) || r.date}
                    </span>
                  </div>
                  <span
                    className={styles.reviewStars}
                    aria-label={`${r.rating} out of 5`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12 3.5l2.6 5.6 6 .6-4.5 4.2 1.3 6L12 17l-5.4 2.9 1.3-6L3.4 9.7l6-.6L12 3.5z"
                          fill={i < r.rating ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ))}
                  </span>
                </div>
                {r.title && <h3 className={styles.reviewTitle}>{r.title}</h3>}
                {r.body && <p className={styles.reviewBody}>{r.body}</p>}
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
