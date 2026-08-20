"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";
import { listInstagramPosts } from "@/lib/api/instagramPosts";
import insta1 from "@/assets/butterfly-gift-box/butterfly-3.jpeg";
import insta2 from "@/assets/butterfly-luxury/luxury2.jpeg";
import insta3 from "@/assets/butterfly-signature/signature1.jpeg";
import insta4 from "@/assets/cone-shape-gift/cone-shape4.jpeg";
import insta5 from "@/assets/for-mother-gift/for-mother5.jpeg";
import insta6 from "@/assets/luxe-dual/luxe-dual2.jpeg";
import styles from "./InstagramFeed.module.css";

const HANDLE = "decornart.in";
const PROFILE_URL = `https://www.instagram.com/${HANDLE}/`;

const FALLBACK_POSTS = [
  { id: "ig1", image: insta1, alt: "Butterfly luxe gift box" },
  { id: "ig2", image: insta2, alt: "Luxury bouquet basket" },
  { id: "ig3", image: insta3, alt: "Signature butterfly edition" },
  { id: "ig4", image: insta4, alt: "Cone-shape gift detail" },
  { id: "ig5", image: insta5, alt: "For-mother gift styling" },
  { id: "ig6", image: insta6, alt: "Luxe dual basket finish" },
];

export default function InstagramFeed() {
  const root = useRef(null);
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listInstagramPosts()
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

  // Prefer admin-authored rows when the API returned any, otherwise fall
  // back to the bundled static images so the section is never blank.
  const posts = useMemo(() => {
    if (remote && remote.length > 0) {
      return remote.map((p) => ({
        id: p.id,
        image: p.image,
        alt: p.alt || "Instagram post",
        link: p.link || "",
      }));
    }
    return FALLBACK_POSTS.map((p) => ({ ...p, link: "" }));
  }, [remote]);

  useGSAP(
    () => {
      gsap.from(`.${styles.tile}`, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      });
    },
    { scope: root, dependencies: [posts] }
  );

  return (
    <section ref={root} className={styles.section}>
      <div className="container" style={{ maxWidth: "1480px" }}>
        <div className={styles.layout}>
          <aside className={styles.copy}>
            <span className={styles.eyebrow}>Follow us on Instagram</span>
            <p className={styles.lead}>
              Discover premium gifting, elegant décor, and our latest collections 
            </p>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              <span className={styles.ctaIcon} aria-hidden="true">
                <FaInstagram />
              </span>
              @{HANDLE}
            </a>
          </aside>

          <div className={styles.grid}>
            {posts.map((p) => {
              const TileMedia = (
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 560px) 45vw, (max-width: 1024px) 22vw, 14vw"
                  className={styles.tileImg}
                  unoptimized={typeof p.image === "string"}
                />
              );
              return (
                <figure key={p.id} className={styles.tile}>
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.alt}
                    >
                      {TileMedia}
                    </a>
                  ) : (
                    TileMedia
                  )}
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
