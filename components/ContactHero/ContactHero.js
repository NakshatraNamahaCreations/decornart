"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useBannerContent } from "@/hooks/useBannerContent";
import styles from "./ContactHero.module.css";

const CARDS = [
  {
    id: "phone",
    label: "Phone",
    value: "+91 98202 04060",
    href: "tel:+919820204060",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
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
    id: "email",
    label: "Email",
    value: "official@decornart.in",
    href: "mailto:official@decornart.in",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M3 7l9 6 9-6"
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
    id: "location",
    label: "Location",
    value: "Bangalore",
    href: "https://maps.google.com/?q=Bangalore",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="10"
          r="2.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
];

export default function ContactHero() {
  const root = useRef(null);
  // Optional admin-uploaded background AND text overrides — falls back to
  // the bundled copy below when the admin hasn't published this slot.
  const banner = useBannerContent("contact-hero");
  const heroSrc = banner.image || null;
  // Resolve every banner-driven field at once and gate on `loaded` so
  // shoppers never see the coded fallback flash to the admin's real
  // copy. Empty strings while loading keep the JSX shape intact.
  const eyebrow = banner.loaded ? banner.eyebrow || "— Get in touch" : "";
  const titleText = banner.loaded
    ? banner.title || "We're here to compose with you."
    : "";
  const subtitle = banner.loaded
    ? banner.subtitle ||
      "A bespoke piece, a wedding morning, a press request, or simply tying the right stems together for a quiet Tuesday — write to us and we'll reply, by hand, within a day."
    : "";

  useGSAP(
    () => {
      gsap.from(
        [
          `.${styles.eyebrow}`,
          `.${styles.heading}`,
          `.${styles.rule}`,
          `.${styles.lead}`,
        ],
        {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
        }
      );
      gsap.from(`.${styles.card}`, {
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: `.${styles.cards}`, start: "top 88%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section}>
      {heroSrc && (
        <>
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.bgImg}
            unoptimized={typeof heroSrc === "string"}
          />
          <span className={styles.bgScrim} aria-hidden="true" />
        </>
      )}
      <div className={`container ${styles.inner}`}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.heading}>{titleText}</h1>
        <span className={styles.rule} aria-hidden="true" />
        <p className={styles.lead}>{subtitle}</p>

        <div className={styles.cards}>
          {CARDS.map((c) => {
            const Tag = c.href ? "a" : "div";
            return (
              <Tag
                key={c.id}
                href={c.href}
                target={
                  c.href && c.href.startsWith("http") ? "_blank" : undefined
                }
                rel={
                  c.href && c.href.startsWith("http") ? "noreferrer" : undefined
                }
                className={styles.card}
              >
                <span className={styles.cardIcon}>{c.icon}</span>
                <span className={styles.cardBody}>
                  <span className={styles.cardLabel}>{c.label}</span>
                  <span className={styles.cardValue}>{c.value}</span>
                </span>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
