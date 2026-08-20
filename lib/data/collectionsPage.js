// Data for /collections page — kept separate from the homepage `categories`
// dataset so the curatorial copy here can evolve independently.

import pipeCleaners from "@/assets/pipe-cleaners.png";
import flowers from "@/assets/basket.png";
import ribbons from "@/assets/ribbons.png";
import wrapper from "@/assets/wrapper.png";
import giftBox from "@/assets/gift-box.jpeg";
import cone from "@/assets/cone-shape-gift/cone-shape4.jpeg";
import crochet from "@/assets/crochet.png";
import craft from "@/assets/craft.png";

import featured1 from "@/assets/butterfly-gift-box/butterfly-4.jpeg";
import featured2 from "@/assets/butterfly-luxury/luxury3.jpeg";
import featured3 from "@/assets/butterfly-signature/signature2.jpeg";
import featured4 from "@/assets/cone-shape-gift/cone-shape4.jpeg";
import featured5 from "@/assets/for-mother-gift/for-mother3.jpeg";
import featured6 from "@/assets/for-you-bouquet/for-you2.jpeg";
import featured7 from "@/assets/luxe-dual/luxe-dual3.jpeg";
import featured8 from "@/assets/luxe-heart/luxe-heart1.jpeg";

import bulkImg from "@/assets/for-mother-gift/for-mother3.jpeg";
import customImg from "@/assets/luxe-rose/luxe-rose1.jpeg";

export const shopByCollection = [
  {
    slug: "pipe-cleaners",
    name: "Pipe Cleaners Collection",
    note: "Premium chenille stems in 30+ vibrant colours.",
    count: 32,
    image: pipeCleaners,
  },
  {
    slug: "flower-gift",
    name: "Flower Gift Collection",
    note: "Beautiful flower boxes & bouquets for every occasion.",
    count: 28,
    image: flowers,
  },
  {
    slug: "ribbons",
    name: "Ribbons Collection",
    note: "Satin, organza, grosgrain & more for every finish.",
    count: 36,
    image: ribbons,
  },
  {
    slug: "wrapping-sheets",
    name: "Wrapping Sheets Collection",
    note: "Elegant wrapping sheets to make every gift special.",
    count: 40,
    image: wrapper,
  },
  {
    slug: "gift-boxes",
    name: "Gift Boxes Collection",
    note: "Luxury gift boxes, sleeves & coffee-cup boxes.",
    count: 27,
    image: giftBox,
  },
  {
    slug: "cone-holders",
    name: "Cone Holders Collection",
    note: "Stylish cone holders to present flowers beautifully.",
    count: 12,
    image: cone,
  },
  {
    slug: "crochet-materials",
    name: "Crochet Materials Collection",
    note: "Yarns, hooks & accessories for crochet lovers.",
    count: 23,
    image: crochet,
  },
  {
    slug: "craft-essentials",
    name: "Craft Essentials Collection",
    note: "All your must-have tools & essentials in one place.",
    count: 45,
    image: craft,
  },
];

export const featuredCollections = [
  { slug: "best-sellers",    name: "Best Sellers",       note: "Top picks loved by all",    count: 28, image: featured1 },
  { slug: "new-arrivals",    name: "New Arrivals",       note: "Freshly added",             count: 18, image: featured2 },
  { slug: "wedding-special", name: "Wedding Special",    note: "Made for big days",         count: 22, image: featured3 },
  { slug: "baby-shower",     name: "Baby Shower",        note: "Gifts full of love",        count: 16, image: featured4 },
  { slug: "festive",         name: "Festive Collection", note: "Celebrate in style",        count: 30, image: featured5 },
  { slug: "diy-kits",        name: "DIY Kits",           note: "Craft, create, cherish",    count: 30, image: featured6 },
  { slug: "teachers-day",    name: "Teacher's Day",      note: "A gift of gratitude",       count: 12, image: featured7 },
  { slug: "corporate",       name: "Corporate Gifting",  note: "Impress with elegance",     count: 15, image: featured8 },
];

export const supportCards = [
  {
    id: "bulk",
    eyebrow: "Bulk Orders",
    title: "Special pricing for bulk purchases & corporate gifting.",
    cta: { label: "Enquire now", href: "/wholesale" },
    image: bulkImg,
  },
  {
    id: "custom",
    eyebrow: "Custom Packaging",
    title: "Perfect for your brand, gifting and events.",
    cta: { label: "Learn more", href: "/contact" },
    image: customImg,
  },
  {
    id: "help",
    eyebrow: "Need Help?",
    title: "Chat with us on WhatsApp for quick assistance.",
    cta: { label: "Chat now", href: "https://wa.me/919999999999" },
    image: null,
  },
];
