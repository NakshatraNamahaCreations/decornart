import pipeImg from "@/assets/offer1.png";
import boxImg from "@/assets/offer2.png";
import craftImg from "@/assets/offer3.png";
import ribbonImg from "@/assets/offer4.png";
import seasonalImg from "@/assets/vase.png";
import comboCraft from "@/assets/gift-box.jpeg";
import comboBouquet from "@/assets/luxe-heart/luxe-heart2.jpeg";
import comboWrap from "@/assets/wrapper.png";
import comboAllInOne from "@/assets/basket.png";

export const heroOffer = {
  eyebrow: "Special Deals · Just Dropped",
  titleLine1: "Special Offers,",
  titleLine2: "Just for You",
  lead:
    "Beautiful deals on beautiful gifts, craft essentials and everything you love.",
  cta: { label: "Shop All Offers", href: "/shop" },
  coupon: {
    tag: "Extra",
    value: "10% OFF",
    condition: "On your first order",
    code: "WELCOME10",
  },
};

export const trustStrip = [
  { id: "shipping", title: "Free Shipping", copy: "On orders above ₹2500" },
  { id: "secure", title: "Secure Payments", copy: "100% safe & secure" },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items" },
  { id: "beautiful", title: "Curated with Love", copy: "Crafted with passion" },
  { id: "trusted", title: "Trusted by 10,000+", copy: "Happy customers" },
];

export const topOffers = [
  {
    id: "pipe",
    eyebrow: "Pipe Cleaners",
    headline: "Flat",
    discount: "15% OFF",
    copy: "On all pipe cleaner bundles (6mm & 8mm)",
    code: "PIPE15",
    href: "/category/pipe-cleaners",
    image: pipeImg,
    tone: "lavender",
  },
  {
    id: "bouquet",
    eyebrow: "Bouquet & Gift Boxes",
    headline: "Up to",
    discount: "20% OFF",
    copy: "On all floral gift boxes & bouquet holders",
    cta: { label: "Shop Now", href: "/category/gift-boxes" },
    image: boxImg,
    tone: "blush",
  },
  {
    id: "craft",
    eyebrow: "Craft Essentials",
    headline: "Buy 2",
    discount: "Get 1 Free",
    copy: "On selected craft essentials",
    cta: { label: "Shop Now", href: "/category/craft-essentials" },
    image: craftImg,
    tone: "sand",
  },
  {
    id: "ribbon",
    eyebrow: "Ribbons & Wraps",
    headline: "Flat",
    discount: "10% OFF",
    copy: "On all ribbons, wraps & papers",
    code: "WRAP10",
    href: "/category/ribbons",
    image: ribbonImg,
    tone: "blush",
  },
];

export const seasonalSale = {
  title: "Seasonal Sale",
  lead:
    "Celebrate the season with handcrafted goodness at special prices.",
  cta: { label: "Shop Seasonal Sale", href: "/shop" },
  discount: { pre: "Up to", value: "30", unit: "% OFF", on: "On selected items" },
  perks: [
    { id: "limited", title: "Limited Period", copy: "Offer" },
    { id: "best", title: "Best Deals", copy: "of the Season" },
    { id: "miss", title: "Don't Miss", copy: "Out!" },
  ],
  image: seasonalImg,
};

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const comboDeals = [
  {
    id: "crafting-kit",
    title: "Crafting Starter Kit",
    copy: "Everything you need to begin your creativity!",
    price: 599,
    strike: 799,
    discount: 25,
    image: comboCraft,
    href: "/product/crafting-starter-kit",
  },
  {
    id: "bouquet-kit",
    title: "Bouquet Making Kit",
    copy: "Create stunning bouquets at home.",
    price: 899,
    strike: 1249,
    discount: 28,
    image: comboBouquet,
    href: "/product/bouquet-making-kit",
  },
  {
    id: "gift-wrap-combo",
    title: "Gift Wrapping Combo",
    copy: "Ribbons, wraps, tags & more!",
    price: 499,
    strike: 699,
    discount: 28,
    image: comboWrap,
    href: "/product/gift-wrapping-combo",
  },
  {
    id: "all-in-one",
    title: "All in One Craft Box",
    copy: "The perfect box for all craft lovers.",
    price: 1299,
    strike: 1799,
    discount: 28,
    image: comboAllInOne,
    href: "/product/all-in-one-craft-box",
  },
].map((c) => ({ ...c, priceFmt: inr(c.price), strikeFmt: inr(c.strike) }));

export const newsletter = {
  title: "Exclusive Offers Straight to Your Inbox!",
  lead:
    "Be the first to know about new launches, special offers and members-only deals.",
};
