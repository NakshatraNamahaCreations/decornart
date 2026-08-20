import butterfly1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import butterfly2 from "@/assets/butterfly-gift-box/butterfly-2.jpeg";
import butterfly3 from "@/assets/butterfly-gift-box/butterfly-3.jpeg";
import butterfly4 from "@/assets/butterfly-gift-box/butterfly-4.jpeg";
import cone1 from "@/assets/cone-shape-gift/cone-shape1.jpeg";
import cone2 from "@/assets/cone-shape-gift/cone-shape2.jpeg";
import forYou1 from "@/assets/for-you-bouquet/for-you1.jpeg";
import forYou2 from "@/assets/for-you-bouquet/for-you2.jpeg";
import forYou3 from "@/assets/for-you-bouquet/for-you3.jpeg";
import heart1 from "@/assets/luxe-heart/luxe-heart1.jpeg";
import heart2 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import heart3 from "@/assets/luxe-heart/luxe-heart3.jpeg";
import rose1 from "@/assets/luxe-rose/luxe-rose1.jpeg";
import rose2 from "@/assets/luxe-rose/luxe-rose2.jpeg";
import mother1 from "@/assets/for-mother-gift/for-mother1.jpeg";
import mother2 from "@/assets/for-mother-gift/for-mother2.jpeg";
import signature1 from "@/assets/butterfly-signature/signature1.jpeg";
import dual1 from "@/assets/luxe-dual/luxe-dual1.jpeg";
import dual2 from "@/assets/luxe-dual/luxe-dual2.jpeg";
import newborn1 from "@/assets/newborn-cradle/new-born1.jpeg";

export const reviewStats = {
  overall: 4.9,
  totalReviews: 2538,
  happyCustomers: 2538,
  ordersDelivered: 10000,
  breakdown: [
    { stars: 5, count: 2310, percent: 91 },
    { stars: 4, count: 158, percent: 6 },
    { stars: 3, count: 50, percent: 2 },
    { stars: 2, count: 15, percent: 0.6 },
    { stars: 1, count: 5, percent: 0.4 },
  ],
};

export const reviewFilters = [
  { id: "all", label: "All Reviews", count: 2538 },
  { id: "photos", label: "With Photos", count: 896 },
  { id: "5", label: "5", count: 2310, star: true },
  { id: "4", label: "4", count: 158, star: true },
  { id: "3", label: "3", count: 50, star: true },
  { id: "2", label: "2", count: 15, star: true },
  { id: "1", label: "1", count: 5, star: true },
];

export const sortOptions = [
  { id: "recent", label: "Most Recent" },
  { id: "helpful", label: "Most Helpful" },
  { id: "high", label: "Highest Rated" },
  { id: "low", label: "Lowest Rated" },
];

export const reviews = [
  {
    id: "r1",
    name: "Anusha M.",
    initials: "AM",
    accent: "#f4c9b8",
    verified: true,
    date: "20 May, 2024",
    rating: 5,
    text: "Absolutely in love with the quality! The flowers look so elegant and the packaging is just perfect. It made my sister's birthday extra special!",
    productImage: butterfly1,
    productName: "Butterfly Flower Gift Box",
    tag: "Loved the quality",
  },
  {
    id: "r2",
    name: "Priya S.",
    initials: "PS",
    accent: "#e6c7dc",
    verified: true,
    date: "18 May, 2024",
    rating: 5,
    text: "The pipe cleaners are super soft and vibrant. Perfect for all my DIY projects. Fast delivery and amazing customer service. Highly recommended!",
    productImage: cone1,
    productName: "Premium Pipe Cleaners (100 Strands in Each Bundle)",
    tag: "Great product",
  },
  {
    id: "r3",
    name: "Neha R.",
    initials: "NR",
    accent: "#d4c1e9",
    verified: true,
    date: "17 May, 2024",
    rating: 5,
    text: "Ordered the single rose holders for my event and they were a huge hit! Beautiful design, sturdy and exactly as shown in the pictures.",
    productImage: cone2,
    productName: "Single Rose Cone Holder",
    tag: "Perfect for events",
  },
  {
    id: "r4",
    name: "Kavya L.",
    initials: "KL",
    accent: "#f3d3b8",
    verified: true,
    date: "16 May, 2024",
    rating: 5,
    text: "The gift box with coffee cup is just adorable! The entire presentation is so premium. Will definitely shop again from DecorNArt!",
    productImage: butterfly2,
    productName: "Flower & Coffee Gift Box",
    tag: "Super cute",
  },
  {
    id: "r5",
    name: "Riya K.",
    initials: "RK",
    accent: "#e3c8b1",
    verified: true,
    date: "14 May, 2024",
    rating: 5,
    text: "The bouquet looks even better in person. Beautifully packed, my mom loved it! Will order again for her anniversary.",
    productImage: forYou1,
    productName: "For You Bouquet",
    tag: "Loved by mom",
  },
  {
    id: "r6",
    name: "Sneha V.",
    initials: "SV",
    accent: "#d9c6e0",
    verified: true,
    date: "12 May, 2024",
    rating: 5,
    text: "The heart-shaped arrangement is stunning. Perfect gift for our anniversary. Thank you DecorNArt for making our day so memorable.",
    productImage: heart1,
    productName: "Luxe Heart Bouquet",
    tag: "Anniversary gift",
  },
  {
    id: "r7",
    name: "Meera J.",
    initials: "MJ",
    accent: "#f5cbc0",
    verified: true,
    date: "10 May, 2024",
    rating: 4,
    text: "Loved the roses! Slight delay in delivery but the support team was very responsive. The final product made up for it — truly gorgeous.",
    productImage: rose1,
    productName: "Luxe Rose Bouquet",
    tag: "Beautiful roses",
  },
  {
    id: "r8",
    name: "Divya T.",
    initials: "DT",
    accent: "#e5d1b8",
    verified: true,
    date: "8 May, 2024",
    rating: 5,
    text: "The Mother's Day gift box was so thoughtfully arranged. Every element was picture-perfect. My mother was in tears of joy!",
    productImage: mother1,
    productName: "For Mother Gift Box",
    tag: "Emotional gift",
  },
  {
    id: "r9",
    name: "Ananya B.",
    initials: "AB",
    accent: "#dcc1e6",
    verified: true,
    date: "6 May, 2024",
    rating: 5,
    text: "The signature bouquet is stunning — colours, textures, everything. Great quality and easily worth the price. Shipping was quick too!",
    productImage: signature1,
    productName: "Butterfly Signature Bouquet",
    tag: "Premium quality",
  },
  {
    id: "r10",
    name: "Tanvi P.",
    initials: "TP",
    accent: "#f4c9b8",
    verified: true,
    date: "4 May, 2024",
    rating: 5,
    text: "Ordered the dual bouquet for a couple's anniversary. Both loved it! Delicate, elegant, and lasted beautifully. Highly recommend.",
    productImage: dual1,
    productName: "Luxe Dual Bouquet",
    tag: "Great gift",
  },
  {
    id: "r11",
    name: "Ishita R.",
    initials: "IR",
    accent: "#e6c7dc",
    verified: true,
    date: "2 May, 2024",
    rating: 5,
    text: "Every product from DecorNArt feels Curated with Love. Truly a delight to shop from them. My third order and always satisfied!",
    productImage: newborn1,
    productName: "Newborn Cradle Basket",
    tag: "Repeat buyer",
  },
  {
    id: "r12",
    name: "Aarushi S.",
    initials: "AS",
    accent: "#d4c1e9",
    verified: true,
    date: "1 May, 2024",
    rating: 5,
    text: "Everything about this order was perfect — from packaging to product. The heart bouquet is my new favourite thing at home.",
    productImage: heart2,
    productName: "Luxe Heart Bouquet",
    tag: "Home favourite",
  },
];

export const customerPhotos = [
  { id: "p1", src: butterfly3, alt: "Customer's butterfly bouquet" },
  { id: "p2", src: forYou2, alt: "Customer's for-you bouquet" },
  { id: "p3", src: heart3, alt: "Customer's heart bouquet" },
  { id: "p4", src: rose2, alt: "Customer's rose bouquet" },
  { id: "p5", src: dual2, alt: "Customer's dual bouquet" },
  { id: "p6", src: butterfly4, alt: "Customer's butterfly bouquet" },
  { id: "p7", src: mother2, alt: "Customer's mother gift" },
];

export const trustStrip = [
  {
    id: "beautiful",
    title: "Handcrafted with Love",
    copy: "Each product is made with care & passion",
  },
  {
    id: "premium",
    title: "Premium Quality",
    copy: "We use the best materials for you",
  },
  {
    id: "safe",
    title: "Safe & Secure Shopping",
    copy: "100% secure payments and data protection",
  },
  {
    id: "returns",
    title: "Damage Protection",
    copy: "Replacement for transit-damaged items",
  },
  {
    id: "loved",
    title: "Loved by 10,000+ Customers",
    copy: "Thank you for trusting DecorNArt",
  },
];

export const heroCopy = {
  eyebrow: "Real Reviews. Real Love.",
  titleLine1: "Loved by Thousands,",
  titleLine2: "Made with Love",
  lead: "We are grateful for the love and trust you have shown in DecorNArt. Here's what our happy customers have to say about their experience.",
};
