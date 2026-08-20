import morning from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import lavender from "@/assets/stem-rose/stem-rose1.png";
import anniversary from "@/assets/luxe-heart/luxe-heart2.jpeg";
import pretty from "@/assets/for-mother-gift/for-mother2.jpeg";
import lightup from "@/assets/luxe-dual/luxe-dual1.jpeg";
import birthday from "@/assets/for-you-bouquet/for-you2.jpeg";
import bloom from "@/assets/vase.png";
import babyshower from "@/assets/newborn-cradle/new-born1.jpeg";

export const galleryHero = {
  title: "Inspiration Gallery",
  script: "Ideas that spark creativity",
  lead:
    "Discover beautiful ways to style, gift and decorate with our handcrafted creations.",
  chips: [
    { id: "gift", label: "Gift Ideas", icon: "gift" },
    { id: "occasions", label: "Occasions", icon: "bouquet" },
    { id: "home", label: "Home Decor", icon: "home" },
  ],
};

export const categoryFilters = [
  { id: "all", label: "All Inspiration", icon: "grid" },
  { id: "gift", label: "Gift Ideas", icon: "gift" },
  { id: "home", label: "Home Decor", icon: "home" },
  { id: "occasions", label: "Occasions", icon: "heart" },
  { id: "diy", label: "DIY Creations", icon: "bulb" },
];

export const sortOptions = [
  { id: "popular", label: "Popular" },
  { id: "recent", label: "Most Recent" },
  { id: "loved", label: "Most Loved" },
  { id: "views", label: "Most Viewed" },
];

const _stat = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export const galleryItems = [
  {
    id: "morning",
    tag: "Gift Ideas",
    tagId: "gift",
    title: "Morning Surprises",
    copy: "Start the day with flowers, coffee and a thoughtful note.",
    likes: 2400,
    views: 18600,
    badge: "Most Loved",
    image: morning,
    size: "wide",
  },
  {
    id: "lavender",
    tag: "Occasions",
    tagId: "occasions",
    title: "Lavender Dreams",
    copy: "Simple. Elegant. Forever fragrant.",
    likes: 1800,
    views: 12300,
    badge: "New",
    image: lavender,
    size: "wide",
  },
  {
    id: "anniversary",
    tag: "Occasions",
    tagId: "occasions",
    title: "Anniversary Goals",
    copy: "Celebrate love with blooms that last.",
    likes: 3100,
    views: 22400,
    image: anniversary,
    size: "wide",
  },
  {
    id: "pretty",
    tag: "Home Decor",
    tagId: "home",
    title: "Pretty Corners",
    copy: "Little details that make your space smile.",
    likes: 1200,
    views: 9800,
    image: pretty,
    size: "compact",
  },
  {
    id: "lightup",
    tag: "DIY Creations",
    tagId: "diy",
    title: "Light Up Your Love",
    copy: "beautiful with heart, decorated with lights.",
    likes: 1600,
    views: 11200,
    image: lightup,
    size: "compact",
  },
  {
    id: "birthday",
    tag: "Gift Ideas",
    tagId: "gift",
    title: "Birthday Bliss",
    copy: "Make birthdays extra special.",
    likes: 2700,
    views: 13100,
    image: birthday,
    size: "row2",
  },
  {
    id: "bloom",
    tag: "DIY Creations",
    tagId: "diy",
    title: "Bloom & Create",
    copy: "Craft your own everlasting flowers.",
    likes: 2200,
    views: 16700,
    image: bloom,
    size: "row2",
  },
  {
    id: "babyshower",
    tag: "Occasions",
    tagId: "occasions",
    title: "Baby Shower Love",
    copy: "Adorable gifts for decorated with lights.",
    likes: 1400,
    views: 10900,
    image: babyshower,
    size: "row2",
  },
].map((g) => ({
  ...g,
  likesFmt: _stat(g.likes),
  viewsFmt: _stat(g.views),
}));

export const shareCard = {
  title: "Have an idea to share?",
  copy: "Tag us @decornart.in to get featured",
  values: [
    { id: "handcrafted", label: "Curated", copy: "with love", icon: "flower" },
    { id: "unique", label: "Unique &", copy: "Personal", icon: "sparkle" },
    { id: "thoughtful", label: "Thoughtful", copy: "Gifting", icon: "gift" },
    { id: "moment", label: "Made for", copy: "Every Moment", icon: "sparkle" },
  ],
};

export const newsletter = {
  title: "Stay inspired, always",
  copy: "Subscribe to get DIY ideas, styling tips, new arrivals & exclusive offers.",
};
