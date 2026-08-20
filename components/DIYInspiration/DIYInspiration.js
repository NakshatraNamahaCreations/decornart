"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { diyTutorials } from "@/lib/data/diyTutorials";
import { listDiyVideos } from "@/lib/api/diyVideos";
import styles from "./DIYInspiration.module.css";

// Turn any supported video URL into a { kind, src } pair the modal can
// render. Mirrors the helper in ProductView so YouTube / Vimeo get
// iframes and direct file URLs render via <video>.
function parseVideoUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const yt =
    trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i) ||
    trimmed.match(/youtu\.be\/([\w-]{6,})/i);
  if (yt) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`,
    };
  }

  const vm = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) {
    return {
      kind: "iframe",
      src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1`,
    };
  }

  return { kind: "file", src: trimmed };
}

export default function DIYInspiration() {
  const root = useRef(null);
  const [remote, setRemote] = useState(null);
  const [openVideo, setOpenVideo] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listDiyVideos()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) setRemote(data);
      })
      .catch(() => {
        /* keep the static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Prefer admin-authored rows when the API returned any, otherwise
  // fall back to the bundled static tutorials so the section is never
  // blank on a fresh install.
  const items = useMemo(() => {
    if (remote && remote.length > 0) {
      return remote.map((v) => ({
        id: v.id,
        title: v.title,
        subtitle: v.subtitle,
        image: v.thumbnail,
        videoUrl: v.videoUrl,
      }));
    }
    return diyTutorials.map((t) => ({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      image: t.image,
      videoUrl: null,
      href: t.href,
    }));
  }, [remote]);

  useGSAP(
    () => {
      const cards = root.current.querySelectorAll("[data-reveal]");
      gsap.from(cards, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });
    },
    { scope: root, dependencies: [items] }
  );

  const parsed = openVideo ? parseVideoUrl(openVideo.videoUrl) : null;

  return (
    <section ref={root} className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <div className={styles.layout}>
          <aside className={styles.copy}>
            <span className={styles.eyebrow}>Product Showcase</span>
            <h2 className={styles.heading}>Discover Our Collections</h2>
            <p className={styles.lead}>
             Explore our premium products beautifully presented for every occasion.
            </p>
            {/* <Link href="/blog" className={styles.cta}>
              Watch Tutorials
              <span className={styles.ctaArrow} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link> */}
          </aside>

          <ul className={styles.grid}>
            {items.map((t) => {
              const CardInner = (
                <span className={styles.media}>
                  <Image
                    src={t.image}
                    alt={t.title || "DIY inspiration"}
                    fill
                    sizes="(max-width: 900px) 40vw, 14vw"
                    className={styles.mediaImg}
                  />
                  <span className={styles.play} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </span>
                </span>
              );

              return (
                <li key={t.id} className={styles.card} data-reveal>
                  {t.videoUrl ? (
                    <button
                      type="button"
                      onClick={() => setOpenVideo(t)}
                      className={styles.cardLink}
                      aria-label={t.title ? `Play ${t.title}` : "Play DIY video"}
                    >
                      {CardInner}
                    </button>
                  ) : (
                    <Link href={t.href || "/blog"} className={styles.cardLink}>
                      {CardInner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {openVideo && parsed && (
        <div
          className={styles.videoModal}
          role="dialog"
          aria-modal="true"
          aria-label={openVideo.title}
          onClick={() => setOpenVideo(null)}
        >
          <div
            className={styles.videoModalInner}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.videoModalClose}
              aria-label="Close video"
              onClick={() => setOpenVideo(null)}
            >
              ✕
            </button>
            {parsed.kind === "iframe" ? (
              <iframe
                src={parsed.src}
                title={openVideo.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            ) : (
              <video src={parsed.src} controls autoPlay playsInline>
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
