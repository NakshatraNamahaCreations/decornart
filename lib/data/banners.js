// lib/data/banners.js
// Per-slide full-bleed hero backgrounds. Swap `bgImage` values for your own
// product shots when ready — keep the same shape.
import banner1 from "@/assets/banner.png";
import banner2 from "@/assets/banimg2.png";
import banner3 from "@/assets/bannerimg1.png";

// All slides share the same copy — only the background image changes.
const SHARED_COPY = {
  eyebrow: "Premium Craft Supplies",
  title: "Handcrafted for\nMoments You'll",
  // Heart glyph is baked into the string now so admin-added banners can
  // include (or omit) any accent character they like directly in the text.
  script: "Never Forget ♥",
  scriptStyle: "script",
  subtitle:
    "Premium quality craft materials for creators, artisans & beautiful businesses.",
  primaryCta: { label: "Shop now", href: "/shop" },
  secondaryCta: { label: "Explore collections", href: "/collections" },
  trustedBy: {
    count: "10,000+",
    label: "Creators",
    rating: 4.9,
    reviewCount: "2.5K+",
  },
  indexLabel: "Premium Craft",
  accentBg: "#f3e3e6",
  accent: "#dca0ac",
};

export const banners = [
  { ...SHARED_COPY, id: "slide-1", bgImage: banner1 },
  { ...SHARED_COPY, id: "slide-2", bgImage: banner2 },
  { ...SHARED_COPY, id: "slide-3", bgImage: banner3 },
];

export default banners;
