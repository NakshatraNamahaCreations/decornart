// Filters used by /shop. Categories mirror lib/data/categories.js so the
// homepage tiles and the shop side-rail stay in sync. "Use cases" replaces
// the old occasion list since we sell raw craft materials, not gifts.

export const categoryOptions = [
  { id: "flower-basket-materials", label: "Flower Basket Materials" },
  { id: "gift-cards", label: "Gift Cards" },
  { id: "pipe-cleaners", label: "Pipe Cleaners" },
  { id: "gift-box", label: "Gift Box" },
  { id: "craft-essentials", label: "Craft Essentials" },
  { id: "crochet-materials", label: "Crochet Materials" },
  { id: "ribbons", label: "Ribbons" },
  { id: "wrapping-papers", label: "Wrapping Sheets & Papers" },
  { id: "artificial-plants", label: "Artificial Plants & Planters" },
];

// Gifting occasions — mirrored on the admin ProductForm's OCCASION_OPTIONS.
// Rendered as a multi-select checkbox facet on the shop sidebar and
// serialised back to `?occasion=birthday,anniversary` on the backend.
export const occasionOptions = [
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "wedding", label: "Wedding" },
  { id: "baby-shower", label: "Baby Shower" },
  { id: "house-warming", label: "House Warming" },
  { id: "festivals", label: "Festivals" },
];

// `min` is inclusive, `max` is exclusive — keeps the buckets non-overlapping.
// Adjusted to craft-supply price points (lower than finished bouquets).
export const priceRanges = [
  { id: "under-299", label: "Under ₹299", min: 0, max: 299 },
  { id: "299-599", label: "₹299 — ₹599", min: 299, max: 599 },
  { id: "599-999", label: "₹599 — ₹999", min: 599, max: 999 },
  { id: "above-999", label: "Above ₹999", min: 999, max: Infinity },
];

// Color swatches shown in the filter sidebar. `swatch` drives the round
// chip's background; `id` is matched against the product `color`/`colors`
// field on the API side (and client-side as a fallback).
export const colorOptions = [
  { id: "pink",   label: "Pink",   swatch: "#E8B4C8" },
  { id: "red",    label: "Red",    swatch: "#C53030" },
  { id: "orange", label: "Orange", swatch: "#E89A4C" },
  { id: "yellow", label: "Yellow", swatch: "#F4D24A" },
  { id: "green",  label: "Green",  swatch: "#7BA88C" },
  { id: "blue",   label: "Blue",   swatch: "#6B8FAB" },
  { id: "purple", label: "Purple", swatch: "#6F2A5E" },
  { id: "beige",  label: "Beige",  swatch: "#D8C2A8" },
  { id: "white",  label: "White",  swatch: "#FFFFFF" },
  { id: "black",  label: "Black",  swatch: "#2A0F2B" },
];

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
];
