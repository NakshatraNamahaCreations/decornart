// lib/data/banners.js
// Per-slide full-bleed hero backgrounds. Swap `bgImage` values for your own
// product shots when ready — keep the same shape.
import banner1 from "@/assets/decorban.png";
import banner2 from "@/assets/bannerimg1.png";
import banner3 from "@/assets/bannerimg3.png";

export const banners = [
  {
    id: "premium-craft-supplies",
    eyebrow: "Premium Craft Supplies for Creators",
    title: "Handcrafted for\nMoments You'll",
    script: "Never Forget",
    subtitle:
      "Premium quality craft materials for creators, artisans & handmade businesses.",
    primaryCta: { label: "Shop now", href: "/shop" },
    secondaryCta: { label: "Explore collections", href: "/collections" },
    trustedBy: {
      count: "10,000+",
      label: "Creators",
      rating: 4.9,
      reviewCount: "2.5K+",
    },
    indexLabel: "Premium Craft",
    bgImage: banner1,
    accentBg: "#f3e3e6",
    accent: "#dca0ac",
  },
  {
    id: "just-for-you",
    eyebrow: "Sent with Love",
    title: "Just For You\nBouquet Basket",
    subtitle:
      "Hand-finished for the small, unspoken occasions — a thinking-of-you basket in soft, painterly tones.",
    cta: { label: "Send a basket", href: "/shop?category=just-for-you" },
    indexLabel: "Just For You",
    bgImage: banner2,
    accentBg: "#f6e7df",
    accent: "#d99fa0",
  },
  {
    id: "butterfly-luxe",
    eyebrow: "Best Wishes",
    title: "Butterfly Luxe\nBouquet Basket",
    subtitle:
      "Sculpted blooms set with delicate butterfly accents — a celebratory basket for the milestone moments.",
    cta: { label: "Shop the edit", href: "/shop?category=butterfly-luxe" },
    indexLabel: "Butterfly Luxe",
    bgImage: banner3,
    accentBg: "#f0e6e0",
    accent: "#c98a82",
  },
];

export default banners;
