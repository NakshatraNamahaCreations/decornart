import butterfly1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import butterfly2 from "@/assets/butterfly-gift-box/butterfly-2.jpeg";
import butterfly3 from "@/assets/butterfly-gift-box/butterfly-3.jpeg";
import butterfly4 from "@/assets/butterfly-gift-box/butterfly-4.jpeg";
import butterfly5 from "@/assets/butterfly-gift-box/butterfly-5.jpeg";
import butterfly6 from "@/assets/butterfly-gift-box/butterfly-6.jpeg";
import forYou1 from "@/assets/for-you-bouquet/for-you1.jpeg";
import forYou2 from "@/assets/for-you-bouquet/for-you2.jpeg";
import forYou3 from "@/assets/for-you-bouquet/for-you3.jpeg";
import forYou4 from "@/assets/for-you-bouquet/for-you4.jpeg";
import heart1 from "@/assets/luxe-heart/luxe-heart1.jpeg";
import heart2 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import mother1 from "@/assets/for-mother-gift/for-mother1.jpeg";
import cone1 from "@/assets/cone-shape-gift/cone-shape1.jpeg";
import cone2 from "@/assets/cone-shape-gift/cone-shape2.jpeg";
import pipeImg from "@/assets/pipe-cleaners.png";
import basketImg from "@/assets/basket.png";
import giftCardImg from "@/assets/gift-card.jpeg";

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const searchHero = {
  eyebrow: "AI-Powered Search",
  title: "Search",
  lead: "Find exactly what you love.",
  placeholder: "Search for products, collections, ideas...",
  tryChips: [
    "lavender gift box",
    "flower gift box",
    "pipe cleaners",
    "daisy keychain",
    "thank you cone",
  ],
};

export const searchModes = [
  {
    id: "ai",
    title: "AI Smart Search",
    copy: "Get better results with natural language",
  },
  {
    id: "image",
    title: "Search by Image",
    copy: "Upload a photo and find similar products",
  },
  {
    id: "voice",
    title: "Voice Search",
    copy: "Search hands-free using your voice",
  },
  {
    id: "category",
    title: "Shop by Category",
    copy: "Explore all our product categories",
  },
];

export const trendingSearches = [
  "Mother's Day",
  "Birthday Gifts",
  "Anniversary",
  "Wedding",
  "Baby Shower",
  "Return Gifts",
];

export const recentlyViewed = [
  { id: "rv1", src: butterfly1, alt: "Butterfly gift box" },
  { id: "rv2", src: heart1, alt: "Heart bouquet" },
  { id: "rv3", src: cone1, alt: "Cone-shape gift" },
  { id: "rv4", src: mother1, alt: "Mother gift box" },
];

export const recentSearches = [
  "flower gift box",
  "lavender cone",
  "pipe cleaners",
  "thank you cone",
];

export const collectionsToExplore = [
  { id: "gift-boxes", label: "Gift Boxes", src: butterfly2 },
  { id: "flower-cones", label: "Flower Cones", src: cone2 },
  { id: "pipe-cleaners", label: "Pipe Cleaners", src: pipeImg },
  { id: "gift-cards", label: "Gift Cards", src: giftCardImg },
  { id: "keychains", label: "Keychains", src: basketImg },
];

export const filterGroups = {
  category: [
    { id: "gift-boxes", label: "Gift Boxes", count: 25, checked: true },
    { id: "flower-cones", label: "Flower Cones", count: 18 },
    { id: "pipe-cleaners", label: "Pipe Cleaners", count: 32 },
    { id: "gift-cards", label: "Gift Cards", count: 12 },
    { id: "keychains", label: "Keychains", count: 15 },
    { id: "diy-kits", label: "DIY Kits", count: 21 },
    { id: "flower-holders", label: "Flower Holders", count: 9 },
  ],
  price: [
    { id: "u500", label: "Under ₹500" },
    { id: "500-1000", label: "₹500 - ₹1,000" },
    { id: "1000-1500", label: "₹1,000 - ₹1,500" },
    { id: "above-1500", label: "Above ₹1,500" },
  ],
  colors: [
    { id: "blush", value: "#F4A29B" },
    { id: "pink", value: "#E5B0BE" },
    { id: "lilac", value: "#C1A9DA" },
    { id: "sage", value: "#B7C8AE" },
    { id: "green", value: "#8FA98A" },
    { id: "black", value: "#2A0F2B" },
  ],
  occasion: [
    { id: "birthday", label: "Birthday" },
    { id: "anniversary", label: "Anniversary" },
    { id: "wedding", label: "Wedding" },
    { id: "baby-shower", label: "Baby Shower" },
    { id: "thank-you", label: "Thank You" },
    { id: "get-well-soon", label: "Get Well Soon" },
    { id: "festive", label: "Festive" },
  ],
  productType: [
    { id: "with-flowers", label: "With Flowers" },
    { id: "with-led", label: "With LED Light" },
    { id: "with-mug", label: "With Mug / Chocolate" },
    { id: "gift-hamper", label: "Gift Hamper" },
    { id: "empty-box", label: "Empty Box Only" },
  ],
  availability: [
    { id: "in-stock", label: "In Stock", count: 40, checked: true },
    { id: "out-of-stock", label: "Out of Stock", count: 2 },
  ],
};

const rawProducts = [
  {
    id: "p1",
    name: "Flower & Coffee Gift Box",
    variant: "Maroon",
    price: 1499,
    rating: 4.9,
    reviews: 128,
    image: butterfly1,
    badge: "Best Seller",
    tone: "sand",
  },
  {
    id: "p2",
    name: "Flower & Coffee Gift Box",
    variant: "Lavender",
    price: 1499,
    rating: 4.9,
    reviews: 96,
    image: butterfly2,
    badge: "New",
    tone: "lavender",
  },
  {
    id: "p3",
    name: "Flower & Coffee Gift Box",
    variant: "Pink",
    price: 1349,
    strike: 1499,
    rating: 4.8,
    reviews: 74,
    image: butterfly3,
    badge: "10% OFF",
    tone: "pink",
  },
  {
    id: "p4",
    name: "Premium Flower Gift Box",
    variant: "Pink",
    price: 1299,
    rating: 4.9,
    reviews: 112,
    image: butterfly4,
    badge: "Best Seller",
    tone: "blush",
  },
  {
    id: "p5",
    name: "Thank You Flower Gift Box",
    variant: "White",
    price: 1199,
    rating: 4.8,
    reviews: 58,
    image: forYou1,
    badge: "New",
    tone: "sand",
  },
  {
    id: "p6",
    name: "Luxury Flower Gift Box",
    variant: "Pastel Green",
    price: 1349,
    strike: 1499,
    rating: 4.9,
    reviews: 83,
    image: forYou2,
    badge: "10% OFF",
    tone: "sage",
  },
  {
    id: "p7",
    name: "Elegant Flower Gift Box",
    variant: "Purple",
    price: 1299,
    rating: 4.9,
    reviews: 67,
    image: heart1,
    tone: "lilac",
  },
  {
    id: "p8",
    name: "Flower Gift Box with LED Light",
    variant: "",
    price: 1699,
    rating: 4.9,
    reviews: 51,
    image: forYou3,
    badge: "New",
    tone: "blush",
  },
  {
    id: "p9",
    name: "Round Flower Gift Box",
    variant: "Maroon",
    price: 1199,
    rating: 4.8,
    reviews: 43,
    image: heart2,
    tone: "pink",
  },
  {
    id: "p10",
    name: "Square Flower Gift Box",
    variant: "Beige",
    price: 999,
    rating: 4.7,
    reviews: 39,
    image: mother1,
    tone: "sand",
  },
  {
    id: "p11",
    name: "Heart Shape Flower Gift Box",
    variant: "Pink",
    price: 1499,
    rating: 4.9,
    reviews: 98,
    image: butterfly5,
    tone: "blush",
  },
  {
    id: "p12",
    name: "Premium Flower Gift Box",
    variant: "White",
    price: 1299,
    rating: 4.9,
    reviews: 79,
    image: butterfly6,
    tone: "sand",
  },
];

export const products = rawProducts.map((p) => ({
  ...p,
  priceFmt: inr(p.price),
  strikeFmt: p.strike ? inr(p.strike) : null,
}));

export const sortOptions = [
  { id: "relevant", label: "Most Relevant" },
  { id: "new", label: "Newest First" },
  { id: "low", label: "Price · Low to High" },
  { id: "high", label: "Price · High to Low" },
  { id: "rating", label: "Highest Rated" },
];

export const searchMeta = {
  query: "flower gift box",
  total: 42,
};

export const pagination = {
  current: 1,
  total: 8,
  visible: [1, 2, 3, "…", 8],
};

export const trustStrip = [
  { id: "checkout", title: "Secure Checkout", copy: "100% safe & secure" },
  { id: "beautiful", title: "Curated with Love", copy: "Crafted with passion" },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items" },
  {
    id: "happy",
    title: "10,000+ Happy Customers",
    copy: "Thank you for trusting us",
  },
];

export const customOrder = {
  title: "Didn't find what you're looking for?",
  lead: "Request a custom beautiful gift crafted especially for you.",
  cta: { label: "Request a Custom Order", href: "/contact" },
};
