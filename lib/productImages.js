// Maps a product slug to a bundled asset. The backend only stores a
// placeholder path (`/assets/<slug>.png`) which doesn't actually exist on the
// server, so the frontend keeps the visuals locally and resolves them by slug.

import bouquet1 from "@/assets/bouquet-1.png";
import bouquet2 from "@/assets/bouquet-2.png";
import bouquet_2 from "@/assets/bouquet_2.png";
import collect1 from "@/assets/collect-1.png";
import collect2 from "@/assets/collect-2.png";
import collect3 from "@/assets/collect-3.png";
import collect4 from "@/assets/collect-4.png";
import collect5 from "@/assets/collect-5.png";
import aboutimg from "@/assets/about-img.png";

const FALLBACKS = [bouquet1, collect1, bouquet2, collect2, collect3, collect4, collect5, bouquet_2, aboutimg];

const BY_SLUG = {
  "rosewood-hand-tie": bouquet1,
  "sunlit-meadow": collect1,
  "ivory-whisper": bouquet2,
  "blush-editorial": collect2,
  "garden-romance": collect3,
  "wild-meadow": collect4,
  "blush-minimal": collect5,
  "deep-jewel": aboutimg,
  "white-ceremony": bouquet1,
  "morning-marigold": collect1,
  "birthday-bloom": collect2,
  "velvet-crimson": bouquet_2,
  "pale-sympathy": collect3,
  "saffron-and-sage": collect4,
  "citrus-garland": collect5,
  "snow-lily": bouquet2,
};

function deterministicFallback(slug = "") {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return FALLBACKS[hash % FALLBACKS.length];
}

export function getProductImage(slug) {
  return BY_SLUG[slug] || deterministicFallback(slug);
}

// Prefer whatever the backend has on the product; only reach for a local
// asset when the product was created without any uploaded images.
export function resolveProductImage(product) {
  if (!product) return null;
  if (product.image) return product.image;
  if (Array.isArray(product.images) && product.images[0]) return product.images[0];
  return getProductImage(product.slug);
}

export function getProductGallery(slug) {
  const main = getProductImage(slug);
  // Pad with a few visually-different fallbacks so the gallery isn't a single image.
  const extras = FALLBACKS.filter((img) => img !== main).slice(0, 3);
  return [main, ...extras];
}
