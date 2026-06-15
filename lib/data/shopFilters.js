export const categoryOptions = [
  { id: "signature", label: "Signature" },
  { id: "handmade", label: "Handmade" },
  { id: "classic", label: "Classic" },
  { id: "seasonal", label: "Seasonal" },
];

export const occasionOptions = [
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "sympathy", label: "Sympathy" },
  { id: "congratulations", label: "Congratulations" },
  { id: "wedding", label: "Wedding" },
];

// `min` is inclusive, `max` is exclusive — keeps the buckets non-overlapping.
export const priceRanges = [
  { id: "under-1500", label: "Under ₹1,500", min: 0, max: 1500 },
  { id: "1500-2500", label: "₹1,500 — ₹2,500", min: 1500, max: 2500 },
  { id: "2500-4000", label: "₹2,500 — ₹4,000", min: 2500, max: 4000 },
  { id: "above-4000", label: "Above ₹4,000", min: 4000, max: Infinity },
];

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
];
