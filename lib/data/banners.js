// All imagery is sourced from Unsplash (free to use). These are placeholders
// for the design phase — swap the `image` URLs for your own licensed shots
// or your CDN before launch. Centralised here so changes are one-line edits.
import banner1 from "@/assets/banner-1.png"
import banner2 from "@/assets/banner-2.png"
import banner3 from "@/assets/banner-3.png"

export const banners = [
  {
    id: "signature",
    eyebrow: "The Decornart Atelier",
    title: "Bouquets, composed like still life.",
    subtitle:
      "Hand-tied seasonal stems, delivered across the city the same day.",
    cta: { label: "Shop the collection", href: "/shop" },
    align: "left",
    image: banner1,
    tint: "rgba(58, 18, 29, 0.12)",
    accentBg: "#f6e7df", // warm cream — flagship
  },
  {
    id: "occasions",
    eyebrow: "For every chapter",
    title: "Birthdays, vows, quiet condolences.",
    subtitle:
      "Curated arrangements for the moments that ask for flowers.",
    cta: { label: "Shop by occasion", href: "/shop?view=occasions" },
    align: "center",
    image: banner2,
    tint: "rgba(58, 18, 29, 0.12)",
    accentBg: "#f7e3d1", // soft peach — occasion-led
  },
  {
    id: "handmade",
    eyebrow: "Limited weekly drop",
    title: "Handmade bouquets, with love.",
    subtitle:
      "A small-batch line our florists assemble by hand each morning.",
    cta: { label: "See this week's drop", href: "/handmade" },
    align: "right",
    image: banner3,
    tint: "rgba(58, 18, 29, 0.12)",
    accentBg: "#fff4f5", // light pink — handmade craft
  },
];
