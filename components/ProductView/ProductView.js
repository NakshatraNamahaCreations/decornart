"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLoginModal } from "@/components/LoginModal/LoginModalContext";
import { listProducts, getRelatedProducts } from "@/lib/api/products";
import { getProductImage, resolveProductImage } from "@/lib/productImages";
import { hexForColor, hexForColorWithOverrides } from "@/lib/colorSwatches";
import { renderFeatureIcon } from "@/lib/featureIcons";
import creation1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import creation2 from "@/assets/butterfly-luxury/luxury2.jpeg";
import creation3 from "@/assets/for-you-bouquet/for-you3.jpeg";
import creation4 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import creation5 from "@/assets/for-mother-gift/for-mother4.jpeg";
import creation6 from "@/assets/butterfly-signature/signature1.jpeg";
import bulkImg from "@/assets/basket.png";
import styles from "./ProductView.module.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// Fallback badges used when the product doesn't carry its own
// `featureBadges` array. Each `icon` is a key into the shared icon
// library (@/lib/featureIcons) so admins pick from the same set.
const DEFAULT_FEATURE_BADGES = [
  { icon: "soft", title: "Soft & Fluffy", copy: "Premium Quality" },
  { icon: "bend", title: "Easy to Bend", copy: "Strong & Flexible" },
  { icon: "colors", title: "Vibrant Colors", copy: "Long Lasting" },
  { icon: "safe", title: "Kid Safe", copy: "Non Toxic" },
];

const DELIVERY_ITEMS = [
  {
    id: "delivery",
    title: "Pan India Delivery",
    copy: "3-7 Business Days",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 7h11v9H3z" strokeLinejoin="round" />
        <path d="M14 10h4l3 3v3h-7" strokeLinejoin="round" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    id: "shipping",
    title: "Free Shipping",
    copy: "On orders above ₹2500",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="12" rx="1" />
        <path d="M4 11h16M9 4h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "returns",
    title: "Damage Protection",
    copy: "Replacement for transit-damaged items",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 14-5" />
        <path d="M18 3v4h-4" />
        <path d="M20 12a8 8 0 0 1-14 5" />
        <path d="M6 21v-4h4" />
      </svg>
    ),
  },
  {
    id: "secure",
    title: "Secure Payment",
    copy: "100% Protected",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" />
      </svg>
    ),
  },
];

const PERFECT_FOR = [
  { id: "flowers", label: "Flowers & Bouquets" },
  { id: "keychains", label: "Keychains & Charms" },
  { id: "home", label: "Home Decor" },
  { id: "school", label: "School Projects" },
  { id: "party", label: "Party Decor" },
  { id: "gift", label: "Gift Wrapping" },
];

const COMPLETE_CRAFT = [
  { id: "cc1", name: "Satin Ribbons — 25 Yards", meta: "(25mm)", price: 139 },
  { id: "cc2", name: "Floral Wrapping Sheets", meta: "(Pack of 10)", price: 149 },
  { id: "cc3", name: "Hot Glue Gun", meta: "(20W)", price: 199 },
  { id: "cc4", name: "Artificial Flower Stems", meta: "(Pack of 12)", price: 129 },
  { id: "cc5", name: "Craft Scissors", meta: "(Premium Quality)", price: 249 },
];

const BOTTOM_TRUST = [
  {
    id: "beautiful",
    title: "Curated with Love",
    copy: "Every piece is crafted with passion",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "premium",
    title: "Premium Quality",
    copy: "We use the best materials always",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5" />
      </svg>
    ),
  },
  {
    id: "trusted",
    title: "Trusted by 10,000+ Creators",
    copy: "Loved by crafters across India",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="3.5" />
        <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
      </svg>
    ),
  },
  {
    id: "packaging",
    title: "Sustainable Packaging",
    copy: "Earth-friendly & recyclable",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M3 8h18v12H3z" />
        <path d="M3 8l3-4h12l3 4M12 4v16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "safe",
    title: "Safe & Secure Payments",
    copy: "Your payments are always protected",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      </svg>
    ),
  },
];

const REAL_CREATIONS = [
  creation1,
  creation2,
  creation3,
  creation4,
  creation5,
  creation6,
];

const DEMO_FAQS = [
  {
    id: "safe",
    q: "Are the pipe cleaners safe for kids?",
    a: "Yes — they're 100% non-toxic and skin-safe. Each stem is premium polyester fibre wrapped around a soft steel core, perfect for classroom and home use.",
  },
  {
    id: "custom",
    q: "Can I get custom colors in bulk?",
    a: "Absolutely. For orders of 50+ bundles we can match specific shade requests. Use the 'Enquire Now' button in the bulk banner above and our team will reach out within a day.",
  },
  {
    id: "fade",
    q: "Do the colors fade over time?",
    a: "No — our pigments are UV-stable and will not fade in normal indoor light. Prolonged direct-sun exposure over months may cause slight softening on the pastels only.",
  },
  {
    id: "size",
    q: "What's the difference between 6mm and 8mm?",
    a: "6mm is thinner and best for delicate flowers, keychains, and smaller crafts. 8mm has more body — ideal for bouquets, decor pieces, and larger sculptures.",
  },
  {
    id: "shipping",
    q: "How long does shipping take?",
    a: "Orders ship within 24 hours. Metro cities receive in 3–5 business days, rest of India in 5–7 days. Every order is trackable via SMS and WhatsApp.",
  },
  {
    id: "return",
    q: "What is your damage protection policy?",
    a: "We offer damage protection: if items arrive damaged in transit, we'll send a replacement. Share a photo/video of the damaged item within 48 hours of delivery and our team will arrange the replacement.",
  },
];

const DEMO_REVIEWS = [
  {
    id: "r1",
    name: "Priya Sharma",
    initial: "P",
    rating: 5,
    date: "12 Mar 2025",
    title: "Absolutely perfect quality!",
    body: "The colors are so vibrant and the wire inside is strong. Used them for my bouquet workshop and everyone loved the results. Highly recommend for any craft project!",
    verified: true,
    helpful: 24,
  },
  {
    id: "r2",
    name: "Neha Verma",
    initial: "N",
    rating: 5,
    date: "8 Mar 2025",
    title: "Best pipe cleaners I've bought",
    body: "The fluffiness is unmatched. My kids and I used these for a weekend school project and they were super easy to bend without breaking. Colors haven't faded at all after a month.",
    verified: true,
    helpful: 18,
  },
  {
    id: "r3",
    name: "Aisha Khan",
    initial: "A",
    rating: 4,
    date: "2 Mar 2025",
    title: "Great value in bulk",
    body: "Ordered 3 bundles for my small business. Really good quality and the 10% off on 3+ bundles helped. Shipping was quick too — arrived in 4 days.",
    verified: true,
    helpful: 11,
  },
  {
    id: "r4",
    name: "Sneha Iyer",
    initial: "S",
    rating: 5,
    date: "24 Feb 2025",
    title: "Perfect for florist work",
    body: "I run a small bouquet studio and these are now my go-to for accent stems. The 8mm thickness holds shape beautifully. Packaging was also very neat.",
    verified: true,
    helpful: 9,
  },
];

// Turn any supported video URL into a { kind, src } pair the modal can
// render. YouTube / Vimeo get iframe embeds; direct file URLs (Cloudinary
// MP4s, .mov, .webm, …) render with the native <video> element.
function parseVideoUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // YouTube — long, short, and embed forms.
  const yt =
    trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i) ||
    trimmed.match(/youtu\.be\/([\w-]{6,})/i);
  if (yt) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo — public video ids.
  const vm = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) {
    return {
      kind: "iframe",
      src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1`,
    };
  }

  // Anything else: treat as a direct video file URL.
  return { kind: "file", src: trimmed };
}

const TABS = [
  { id: "description", label: "Description" },
  { id: "pack", label: "Pack Details" },
  { id: "specs", label: "Specifications" },
  { id: "shipping", label: "Shipping & Returns" },
  { id: "reviews", label: "Reviews" },
  { id: "faqs", label: "FAQs" },
];

export default function ProductView({ product }) {
  const router = useRouter();
  const root = useRef(null);
  // `userPickedImage` is the URL the shopper clicked in the thumbnail
  // strip (null = follow variant/colour selection instead). Storing the
  // URL — not an index — keeps the pick stable across re-renders that
  // might reorder the gallery.
  const [userPickedImage, setUserPickedImage] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [videoOpen, setVideoOpen] = useState(false);

  // Optional product video. The admin form stores { url, title } on the
  // product; empty url means "no video" and the button + tutorial card
  // are hidden. Falls back to a friendly default title for the card.
  const videoUrl = product.video?.url || "";
  const videoTitle = product.video?.title || "DIY Flower Tutorial";
  const parsedVideo = useMemo(() => parseVideoUrl(videoUrl), [videoUrl]);
  const hasVideo = !!parsedVideo;

  // Pipe cleaners and crochet materials are modelled as one product per
  // colour (orange-pipe-cleaners, champagne-gold-lace-yarn, …). The colour
  // palette on any of these pages acts as a product switcher: picking a
  // colour navigates to the sibling product that carries that colour so
  // Add-to-Cart adds that colour's actual SKU rather than tagging this one.
  const SIBLING_COLOR_CATEGORIES = new Set([
    "pipe-cleaners",
    "crochet-materials",
  ]);
  const hasSiblingColors = SIBLING_COLOR_CATEGORIES.has(product.category);
  // Palette entries as [{ name, hex?, product }] so the picker can render
  // swatches AND we can look up the target product on Add-to-Cart. For
  // other categories this stays empty (the picker uses `product.colors`).
  const [colorSiblings, setColorSiblings] = useState([]);

  useEffect(() => {
    if (!hasSiblingColors) {
      setColorSiblings([]);
      return undefined;
    }
    let cancelled = false;
    listProducts({ category: product.category, limit: 60 })
      .then((res) => {
        if (cancelled) return;
        const items = Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res)
            ? res
            : [];
        setColorSiblings(items);
      })
      .catch(() => {
        if (!cancelled) setColorSiblings([]);
      });
    return () => {
      cancelled = true;
    };
  }, [hasSiblingColors, product.category, product.id]);

  // Build a color → product map from the sibling list. The current
  // product wins for any colour it already carries, so refreshing on
  // /product/orange-pipe-cleaners keeps "Orange" pointing at itself.
  const colorToProduct = useMemo(() => {
    const map = new Map();
    if (!hasSiblingColors) return map;
    (product.colors || []).forEach((c) => {
      if (c && !map.has(c)) map.set(c, product);
    });
    for (const sib of colorSiblings) {
      for (const c of sib.colors || []) {
        if (c && !map.has(c)) map.set(c, sib);
      }
    }
    return map;
  }, [hasSiblingColors, colorSiblings, product]);

  // Merge per-product `colorSwatches` from every sibling so the swatch
  // dot renders the admin-picked hex for shades that live on other
  // products (the current product's own `colorSwatches` only covers its
  // own colours).
  const siblingSwatchOverrides = useMemo(() => {
    const overrides = Array.isArray(product.colorSwatches)
      ? [...product.colorSwatches]
      : [];
    if (!hasSiblingColors) return overrides;
    for (const sib of colorSiblings) {
      const rows = Array.isArray(sib.colorSwatches) ? sib.colorSwatches : [];
      for (const row of rows) {
        if (row?.color && !overrides.some((o) => o?.color === row.color)) {
          overrides.push(row);
        }
      }
    }
    return overrides;
  }, [hasSiblingColors, colorSiblings, product.colorSwatches]);

  // Color options rendered under the quantity block. For sibling-color
  // categories we surface every colour we could route to; for every
  // other product we just use its own admin-set list.
  const colors = useMemo(() => {
    if (hasSiblingColors) return [...colorToProduct.keys()];
    return Array.isArray(product.colors)
      ? product.colors.filter(Boolean)
      : [];
  }, [hasSiblingColors, colorToProduct, product.colors]);
  const [selectedColor, setSelectedColor] = useState(null);
  // Collapse the palette to the first N swatches by default; a "+X more"
  // pill expands it. Reset the toggle whenever the visible palette
  // changes so switching products doesn't leave it stuck open.
  const COLOR_PREVIEW_COUNT = 5;
  const [colorsExpanded, setColorsExpanded] = useState(false);
  useEffect(() => {
    setColorsExpanded(false);
  }, [colors]);

  // The product Add-to-Cart will actually target. For non-pipe-cleaner
  // products this is always the current product. For pipe cleaners it's
  // the sibling product that owns the picked colour (falls back to the
  // current product until the sibling list finishes loading).
  const targetProduct = useMemo(() => {
    if (!hasSiblingColors || !selectedColor) return product;
    return colorToProduct.get(selectedColor) || product;
  }, [hasSiblingColors, selectedColor, colorToProduct, product]);

  // Product variants (e.g. 6mm / 8mm). Default-select the first when the
  // product has any; keep null for single-price products.
  const variants = useMemo(
    () => (Array.isArray(product.variants) ? product.variants : []),
    [product.variants]
  );
  const [variantId, setVariantId] = useState(() =>
    variants[0]?.id || variants[0]?._id || null
  );
  const selectedVariant = useMemo(
    () =>
      variantId
        ? variants.find((v) => (v.id || v._id) === variantId) || null
        : null,
    [variants, variantId]
  );
  // Variant overrides for price and image when one is picked. On pipe
  // cleaners the target-product's own price also flows through, so
  // switching colour reflects the sibling SKU's price if it differs.
  const displayPrice = selectedVariant
    ? selectedVariant.price
    : targetProduct.price ?? product.price;
  // Original / MRP — variants don't carry their own compareAt, so we
  // fall back to the target product's compareAt (used by the color-swap
  // flow on pipe cleaners) and then the base product's compareAt.
  const displayCompareAt =
    targetProduct.compareAt ?? product.compareAt ?? null;
  const hasCompare =
    typeof displayCompareAt === "number" &&
    displayCompareAt > displayPrice &&
    displayPrice > 0;
  const discountPct = hasCompare
    ? Math.round(((displayCompareAt - displayPrice) / displayCompareAt) * 100)
    : 0;
  // Image to show for the current selection. The spec-value chip (e.g.
  // an "8mm" from product.specs.thickness) sets variantId=null — that's
  // "use the product default", so we return the main product image.
  // A real variant with its own uploaded image (e.g. 6mm) returns that
  // image. A real variant without its own image also falls back to the
  // main product image.
  const variantImage = useMemo(() => {
    const productImages = Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];
    const mainImage = productImages[0] || null;
    if (!selectedVariant) return mainImage;
    if (selectedVariant.image) return selectedVariant.image;
    return mainImage;
  }, [selectedVariant, product.images]);

  // Backend FAQs come in as [{ q, a }] without ids — attach an index-based key
  // so the accordion state can toggle a single entry deterministically.
  const faqs = useMemo(
    () =>
      Array.isArray(product.faqs)
        ? product.faqs
            .filter((f) => f?.q && f?.a)
            .map((f, i) => ({ id: `faq-${i}`, q: f.q, a: f.a }))
        : [],
    [product.faqs]
  );
  const [openFaq, setOpenFaq] = useState(faqs[0]?.id ?? null);

  // Reviews rendered in the "Reviews" tab. Only admin-authored rows —
  // an empty list renders the empty state below. Backend rows arrive
  // without `id` / `initial`, so derive them here.
  const reviews = useMemo(() => {
    const src = Array.isArray(product.reviews)
      ? product.reviews.filter((r) => r?.name && r?.body)
      : [];
    return src.map((r, i) => ({
      id: `rv-${i}`,
      name: r.name,
      initial: (r.name || "?").charAt(0).toUpperCase(),
      rating: r.rating ?? 5,
      date: r.date || "",
      title: r.title || "",
      body: r.body,
      verified: !!r.verified,
      helpful: r.helpful ?? 0,
    }));
  }, [product.reviews]);

  const { addItem } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();
  const { isAuthed } = useAuth();
  const { openLogin } = useLoginModal();
  const saved = isWished(product.id);

  // Per-colour image resolution. For sibling-colour categories (pipe
  // cleaners, crochet materials), prefer:
  //   1. an explicit colorImages entry on the target sibling product for
  //      the picked colour
  //   2. the target sibling product's own primary gallery image
  //   3. an entry on THIS product's colorImages (rare — same product
  //      might have its own upload)
  // For every other category, only #3 applies.
  const colorImage = useMemo(() => {
    if (!selectedColor) return null;
    const fromTarget = Array.isArray(targetProduct.colorImages)
      ? targetProduct.colorImages.find(
          (c) => c && c.color === selectedColor
        )?.image
      : null;
    if (fromTarget) return fromTarget;
    if (hasSiblingColors && targetProduct !== product) {
      const targetImages = Array.isArray(targetProduct.images)
        ? targetProduct.images.filter(Boolean)
        : [];
      if (targetImages.length) return targetImages[0];
    }
    const fromLocal = Array.isArray(product.colorImages)
      ? product.colorImages.find((c) => c && c.color === selectedColor)?.image
      : null;
    return fromLocal || null;
  }, [selectedColor, targetProduct, product, hasSiblingColors]);

  const gallery = useMemo(() => {
    const remote = (product.images || []).filter(Boolean);
    const base = remote.length ? remote : [getProductImage(product.slug)];
    // Stable thumbnail order: every variant image (in variant order),
    // then the product's base gallery. The list does NOT reorder when
    // the shopper switches variants — we only move the active index.
    const variantImages = variants
      .map((v) => v.image)
      .filter(Boolean);
    const seen = new Set();
    const combined = [];
    const push = (u) => {
      if (u && !seen.has(u)) {
        seen.add(u);
        combined.push(u);
      }
    };
    variantImages.forEach(push);
    base.forEach(push);
    // Colour override still wins the lead slot so a shopper who picks a
    // colour sees their choice reflected first.
    return colorImage
      ? [colorImage, ...combined.filter((u) => u !== colorImage)]
      : combined;
  }, [product.slug, product.images, variants, colorImage]);

  // Drop any manual thumbnail pick when the shopper switches variant or
  // colour so the main image jumps to the newly-selected one.
  useEffect(() => {
    setUserPickedImage(null);
  }, [variantImage, colorImage]);

  // The main image is derived every render — either the URL the user
  // clicked, or the URL implied by the current variant/colour choice.
  const activeImage = useMemo(() => {
    if (userPickedImage && gallery.includes(userPickedImage)) {
      return gallery.indexOf(userPickedImage);
    }
    if (colorImage) return 0;
    if (variantImage) {
      const idx = gallery.indexOf(variantImage);
      if (idx >= 0) return idx;
    }
    return 0;
  }, [userPickedImage, colorImage, variantImage, gallery]);

  // Actual URL shown in the big <Image>. When a variant/colour has an
  // image, prefer it directly — the gallery.indexOf lookup above can
  // miss because Cloudinary URLs for the same asset sometimes have a
  // `/v{timestamp}/` version segment and sometimes don't, so string
  // equality fails and activeImage stays at 0.
  const displayedImage =
    userPickedImage ||
    colorImage ||
    variantImage ||
    gallery[activeImage] ||
    gallery[0];


  // Prev / next helpers for the gallery carousel. Wraps around the
  // gallery in both directions and no-ops on single-image products.
  const goPrevImage = () => {
    if (gallery.length < 2) return;
    const next = (activeImage - 1 + gallery.length) % gallery.length;
    setUserPickedImage(gallery[next]);
  };
  const goNextImage = () => {
    if (gallery.length < 2) return;
    const next = (activeImage + 1) % gallery.length;
    setUserPickedImage(gallery[next]);
  };

  // ── Complete Your Craft: fetch a few complementary products so the "Add"
  // buttons work against real backend product IDs. Falls back to the static
  // COMPLETE_CRAFT list when the API returns nothing (fresh install, no
  // craft-essentials seeded, etc.).
  const [craftProducts, setCraftProducts] = useState([]);
  const [craftAdding, setCraftAdding] = useState(() => new Set());
  const [craftAdded, setCraftAdded] = useState(() => new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Best-effort fallback chain — try each source until we have items.
      // 1) craft-essentials category (ideal complementary items)
      // 2) related products (same category / occasion)
      // 3) any 5 active products (last-resort so the section is never empty)
      const sources = [
        () => listProducts({ category: "craft-essentials", limit: 6 }),
        () => getRelatedProducts(product.slug),
        () => listProducts({ limit: 6 }),
      ];
      const pickItems = (res) =>
        Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
      try {
        let picked = [];
        for (const load of sources) {
          const items = pickItems(await load().catch(() => null));
          const filtered = items.filter((p) => p.id !== product.id);
          if (filtered.length > 0) {
            picked = filtered.slice(0, 5);
            break;
          }
        }
        if (!cancelled) setCraftProducts(picked);
      } catch {
        if (!cancelled) setCraftProducts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product.id, product.slug]);

  const addCraftItem = async (craftProduct) => {
    if (!craftProduct?.id) return;
    setCraftAdding((prev) => new Set(prev).add(craftProduct.id));
    try {
      await addItem(craftProduct.id, 1);
      // Same event the Navbar toast listens for on the Shop page.
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cart:item-added", {
            detail: {
              id: craftProduct.id,
              name: craftProduct.name,
              price: craftProduct.price,
              image: resolveProductImage(craftProduct),
              qty: 1,
            },
          })
        );
      }
      setCraftAdded((prev) => new Set(prev).add(craftProduct.id));
      setTimeout(() => {
        setCraftAdded((prev) => {
          const next = new Set(prev);
          next.delete(craftProduct.id);
          return next;
        });
      }, 1800);
    } catch {
      /* silent — Navbar toast only fires on success */
    } finally {
      setCraftAdding((prev) => {
        const next = new Set(prev);
        next.delete(craftProduct.id);
        return next;
      });
    }
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      // For pipe cleaners, target the sibling product that owns the
      // picked colour so the cart shows that colour's actual SKU
      // (e.g. picking "Blood Red" on /orange-pipe-cleaners adds
      // blood-red-pipe-cleaners to the cart). Variant selection lives on
      // the current product's schema and isn't guaranteed to exist on
      // the target — pass it only when we're staying on this product.
      const isSwitchingProduct = targetProduct.id !== product.id;
      const cartProductId = targetProduct.id;
      const cartVariantId = isSwitchingProduct ? null : variantId;
      // Pipe cleaners already encode the colour via the product itself
      // (blood-red-pipe-cleaners, orange-pipe-cleaners, …), so tagging
      // the cart line with `color` would just render a redundant "Color:
      // X" pill next to the product name. Skip the tag for pipe
      // cleaners; keep it for every other category where the same
      // product legitimately carries multiple colour choices.
      const cartColor = hasSiblingColors ? null : selectedColor;
      await addItem(cartProductId, qty, cartVariantId, cartColor);
      setAdded(true);
      if (typeof window !== "undefined") {
        const displayName = isSwitchingProduct
          ? targetProduct.name
          : selectedVariant
            ? `${product.name} — ${selectedVariant.name}`
            : product.name;
        window.dispatchEvent(
          new CustomEvent("cart:item-added", {
            detail: {
              id: cartProductId,
              variantId: cartVariantId,
              color: cartColor,
              name: cartColor
                ? `${displayName} (${cartColor})`
                : displayName,
              price: displayPrice,
              image: gallery[0],
              qty,
            },
          })
        );
      }
      setTimeout(() => setAdded(false), 1800);
    } catch {
      /* silently ignore — Navbar toast only fires on success */
    } finally {
      setAdding(false);
    }
  };

  // Buy It Now — gated on auth. Unauthed shoppers get the shared login
  // modal (same pattern as CartView's checkout button); once signed in
  // they can re-click. Authed shoppers get the standard add-to-cart +
  // /checkout redirect, skipping the toast/added flash since they're
  // leaving the page anyway.
  const handleBuyNow = async () => {
    if (!isAuthed) {
      openLogin();
      return;
    }
    setBuying(true);
    try {
      const isSwitchingProduct = targetProduct.id !== product.id;
      const cartProductId = targetProduct.id;
      const cartVariantId = isSwitchingProduct ? null : variantId;
      const cartColor = hasSiblingColors ? null : selectedColor;
      await addItem(cartProductId, qty, cartVariantId, cartColor);
      router.push("/checkout");
    } catch {
      setBuying(false);
    }
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.galleryMain}`, {
        scale: 0.96,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
      });
      gsap.from(`.${styles.info} > *`, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.1,
      });
    },
    { scope: root }
  );

  // Rating + count derive from admin-authored reviews when present.
  // Fall back to whatever the backend stored on the product doc
  // (product.rating / product.ratingCount), then to 0 — no more
  // hardcoded 4.9 / 356 placeholder numbers.
  const reviewCount = reviews.length || product.ratingCount || 0;
  const rating = reviews.length
    ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
      reviews.length
    : product.rating || 0;
  const bundleCount = product.bundleCount || 100;
  const isPipeCleaner = product.category === "pipe-cleaners";

  // Build [{ key, value }] pairs from whichever spec fields the backend sent.
  // Missing keys are skipped so the panel doesn't render blank rows.
  const SPEC_KEYS = [
    ["thickness", "Thickness"],
    ["length", "Length"],
    ["material", "Material"],
    ["pack", "Pack"],
    ["origin", "Origin"],
    ["finish", "Finish"],
  ];
  const specRows = SPEC_KEYS
    .map(([k, label]) => ({ key: k, label, value: product.specs?.[k] }))
    .filter((r) => r.value);
  const categoryLabel = (product.category || "Products")
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <section ref={root} className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">&gt;</span>
          <a href={`/category/${product.category || ""}`}>{categoryLabel}</a>
          <span aria-hidden="true">&gt;</span>
          <span className={styles.crumbActive}>{product.name}</span>
        </nav>

        {/* ─────────── Main product layout ─────────── */}
        <div className={styles.mainGrid}>
          {/* Gallery column */}
          <div className={styles.galleryCol}>
            <div className={styles.galleryLayout}>
              <div className={styles.thumbs}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setUserPickedImage(img)}
                    className={`${styles.thumb} ${
                      i === activeImage ? styles.thumbActive : ""
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt="" fill sizes="80px" />
                  </button>
                ))}
              </div>

              <div className={styles.galleryMain}>
                <Image
                  src={displayedImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 860px) 90vw, 45vw"
                  priority
                  className={styles.mainImg}
                />
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`${styles.galleryArrow} ${styles.galleryArrowPrev}`}
                      onClick={goPrevImage}
                      aria-label="Previous image"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M15 6l-6 6 6 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={`${styles.galleryArrow} ${styles.galleryArrowNext}`}
                      onClick={goNextImage}
                      aria-label="Next image"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M9 6l6 6-6 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <span
                      className={styles.galleryDots}
                      role="tablist"
                      aria-label="Gallery pagination"
                    >
                      {gallery.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          role="tab"
                          aria-selected={i === activeImage}
                          aria-label={`Go to image ${i + 1}`}
                          onClick={() => setUserPickedImage(img)}
                          className={`${styles.galleryDot} ${
                            i === activeImage ? styles.galleryDotActive : ""
                          }`}
                        />
                      ))}
                    </span>
                  </>
                )}
                {isPipeCleaner ? (
                  <span className={styles.bundleBadge} aria-hidden="true">
                    <strong>{bundleCount} STRANDS</strong>
                    <span>IN EACH BUNDLE</span>
                  </span>
                ) : null}
              </div>
            </div>

            {/* Video thumb + Feature badges — share one horizontal line */}
            <div
              className={styles.trustRow}
              style={hasVideo ? undefined : { gridTemplateColumns: "minmax(0, 1fr)" }}
            >
              {hasVideo && (
                <button
                  type="button"
                  className={styles.videoThumb}
                  aria-label="View product video"
                  onClick={() => setVideoOpen(true)}
                >
                  <span className={styles.playIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span>View Video</span>
                </button>
              )}
              {(() => {
                const badges =
                  Array.isArray(product.featureBadges) &&
                  product.featureBadges.length > 0
                    ? product.featureBadges
                    : DEFAULT_FEATURE_BADGES;
                return (
                  <ul
                    className={styles.featureRow}
                    style={{ "--feature-cols": badges.length }}
                  >
                    {badges.map((f, i) => (
                      <li
                        key={`${f.icon || "none"}-${i}`}
                        className={styles.featureBadge}
                      >
                        <span className={styles.featureIcon} aria-hidden="true">
                          {renderFeatureIcon(f.icon)}
                        </span>
                        <span className={styles.featureText}>
                          <strong>{f.title}</strong>
                          {f.copy && <span>{f.copy}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          </div>

          {/* Info column */}
          <div className={styles.info}>
            {(product.isNew || product.isBestseller) && (
              <div className={styles.badgeRow}>
                {product.isNew && (
                  <span className={styles.bestSeller}>New</span>
                )}
                {product.isBestseller && (
                  <span className={styles.bestSeller}>Best Seller</span>
                )}
              </div>
            )}
            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.rating}>
              <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" width="16" height="16">
                    <path
                      d="M12 3.5l2.6 5.6 6 .6-4.5 4.2 1.3 6L12 17l-5.4 2.9 1.3-6L3.4 9.7l6-.6L12 3.5z"
                      fill="currentColor"
                    />
                  </svg>
                ))}
              </span>
              <span className={styles.ratingText}>
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>

            <div className={styles.priceBlock}>
              <div className={styles.priceRow}>
                <span className={styles.price}>{inr.format(displayPrice)}</span>
                {hasCompare && (
                  <>
                    <span
                      className={styles.priceCompare}
                      aria-label="Original price"
                    >
                      {inr.format(displayCompareAt)}
                    </span>
                    <span
                      className={styles.priceDiscount}
                      aria-label={`${discountPct}% off`}
                    >
                      ({discountPct}% OFF)
                    </span>
                  </>
                )}
              </div>
              <span className={styles.priceIncl}>Incl. of all taxes</span>
            </div>

            <div className={styles.discountBanner}>
              <span className={styles.discountIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20 12l-8 8-8-8 8-8 8 8z" strokeLinejoin="round" />
                  <circle cx="9.5" cy="9.5" r="1.2" fill="currentColor" />
                </svg>
              </span>
              <span>
                <strong>Buy more, save more!</strong>
                <span>Buy 3 or more bundles and get 10% OFF</span>
              </span>
            </div>

            {(() => {
              // Merge specs.thickness with variants when the variant label
              // is "thickness" so shoppers see both the fixed spec value and
              // any additional variant thicknesses as selectable chips.
              const variantLabelLc = (product.variantLabel || "").toLowerCase();
              const specValue = product.specs?.thickness;
              const variantsAreThickness =
                variants.length > 0 && variantLabelLc === "thickness";
              if (!specValue && !variantsAreThickness) return null;
              const variantChips = variantsAreThickness ? variants : [];
              const specAlreadyInVariants = variantChips.some(
                (v) => v.name === specValue
              );
              return (
                <div className={styles.selector}>
                  <span className={styles.selectorLabel}>Thickness</span>
                  <div className={styles.chips}>
                    {specValue && !specAlreadyInVariants && (
                      <button
                        type="button"
                        onClick={() => setVariantId(null)}
                        className={`${styles.chip} ${
                          variantId === null ? styles.chipActive : ""
                        }`}
                        aria-pressed={variantId === null}
                      >
                        {specValue}
                      </button>
                    )}
                    {variantChips.map((v) => {
                      const id = v.id || v._id;
                      const active = id === variantId;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setVariantId(id)}
                          className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                          aria-pressed={active}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {(() => {
              const variantLabelLc = (product.variantLabel || "").toLowerCase();
              const specValue = product.specs?.length;
              const variantsAreLength =
                variants.length > 0 && variantLabelLc === "length";
              if (!specValue && !variantsAreLength) return null;
              const variantChips = variantsAreLength ? variants : [];
              const specAlreadyInVariants = variantChips.some(
                (v) => v.name === specValue
              );
              return (
                <div className={styles.selector}>
                  <span className={styles.selectorLabel}>Length</span>
                  <div className={styles.chips}>
                    {specValue && !specAlreadyInVariants && (
                      <button
                        type="button"
                        onClick={() => setVariantId(null)}
                        className={`${styles.chip} ${
                          variantId === null ? styles.chipActive : ""
                        }`}
                        aria-pressed={variantId === null}
                      >
                        {specValue}
                      </button>
                    )}
                    {variantChips.map((v) => {
                      const id = v.id || v._id;
                      const active = id === variantId;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setVariantId(id)}
                          className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                          aria-pressed={active}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {variants.length > 0 &&
              !["thickness", "length"].includes(
                (product.variantLabel || "").toLowerCase()
              ) && (
              <div className={styles.selector}>
                <span className={styles.selectorLabel}>
                  {product.variantLabel || "Variant"}
                </span>
                <div className={styles.chips}>
                  {variants.map((v) => {
                    const id = v.id || v._id;
                    const active = id === variantId;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setVariantId(id)}
                        className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                        aria-pressed={active}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.selector}>
              <span className={styles.selectorLabel}>Quantity</span>
              <div className={styles.qtyRow}>
                <div className={styles.qty}>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <span className={styles.qtyValue}>{qty}</span>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => setQty((v) => v + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className={styles.stockInfo}>
                  <span className={styles.inStock}>
                    <span className={styles.stockDot} aria-hidden="true" />
                    In Stock
                  </span>
                  <span className={styles.shipsIn}>Ships within 24 hours</span>
                </div>
              </div>
            </div>

            {colors.length > 0 && (() => {
              // Show only the first N colours; the "+X more" pill reveals
              // the rest. If the current selection is past that window,
              // keep it visible by appending it to the preview so the
              // shopper never sees the picker with the active swatch
              // hidden behind the toggle.
              const visibleColors = colorsExpanded
                ? colors
                : (() => {
                    const preview = colors.slice(0, COLOR_PREVIEW_COUNT);
                    if (
                      selectedColor &&
                      !preview.includes(selectedColor) &&
                      colors.includes(selectedColor)
                    ) {
                      preview.push(selectedColor);
                    }
                    return preview;
                  })();
              const hiddenCount = colors.length - visibleColors.length;
              return (
                <div className={styles.selector}>
                  <span className={styles.selectorLabel}>
                    Color
                    {selectedColor ? (
                      <span className={styles.selectorValue}>
                        {" "}
                        : {selectedColor}
                      </span>
                    ) : null}
                  </span>
                  <div className={styles.colorSwatches}>
                    {visibleColors.map((color) => {
                      const active = color === selectedColor;
                      const hex = hexForColorWithOverrides(
                        color,
                        siblingSwatchOverrides
                      );
                      const sibling = hasSiblingColors
                        ? colorToProduct.get(color)
                        : null;
                      const navigatesAway =
                        sibling && sibling.slug && sibling.slug !== product.slug;
                      return (
                        <span
                          key={color}
                          className={styles.colorSwatchItem}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (navigatesAway) {
                                router.push(`/product/${sibling.slug}`);
                                return;
                              }
                              setSelectedColor((cur) =>
                                cur === color ? null : color
                              );
                            }}
                            className={`${styles.colorSwatch} ${
                              active ? styles.colorSwatchActive : ""
                            }`}
                            style={{ background: hex }}
                            aria-pressed={active}
                            aria-label={color}
                            title={color}
                          />
                          <span className={styles.colorSwatchName}>
                            {color}
                          </span>
                        </span>
                      );
                    })}
                    {colors.length > COLOR_PREVIEW_COUNT && (
                      <button
                        type="button"
                        onClick={() => setColorsExpanded((v) => !v)}
                        className={styles.colorMoreBtn}
                        aria-expanded={colorsExpanded}
                        aria-label={
                          colorsExpanded
                            ? "Show fewer colors"
                            : `Show ${hiddenCount} more colors`
                        }
                      >
                        {colorsExpanded ? "−" : `+${hiddenCount}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            <button
              type="button"
              onClick={handleAdd}
              disabled={adding}
              className={`${styles.addBtn} ${added ? styles.addedState : ""}`}
            >
              {added ? "Added to cart ✓" : adding ? "Adding…" : "Add to Cart"}
              <span aria-hidden="true" className={styles.addIcon}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M6 6h15l-2 10H8L6 6z" strokeLinejoin="round" />
                  <path d="M6 6L4 3H2" strokeLinecap="round" />
                  <circle cx="10" cy="20" r="1.3" fill="currentColor" />
                  <circle cx="17" cy="20" r="1.3" fill="currentColor" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className={styles.buyNowBtn}
              onClick={handleBuyNow}
              disabled={buying || adding}
            >
              {buying ? "Redirecting…" : "Buy It Now"}
            </button>

            <p className={styles.checkoutLabel}>Secure &amp; trusted checkout</p>

            <ul className={styles.payments}>
              <li>
                <span className={styles.payIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
                  </svg>
                </span>
                <span>
                  <strong>SSL</strong>
                  <span>Encrypted</span>
                </span>
              </li>
              <li>
                <span className={styles.payIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                </span>
                <span>
                  <strong>Razorpay</strong>
                  <span>Secure Payments</span>
                </span>
              </li>
              <li>
                <span className={styles.payIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12a8 8 0 0 1 14-5" />
                    <path d="M18 3v4h-4" />
                    <path d="M20 12a8 8 0 0 1-14 5" />
                    <path d="M6 21v-4h4" />
                  </svg>
                </span>
                <span>
                  <strong>Damage Protection</strong>
                  <span>Replacement for transit-damaged items</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ─────────── Delivery strip + Bulk banner ─────────── */}
        <div className={styles.belowMain}>
          <ul className={styles.deliveryStrip}>
            {DELIVERY_ITEMS.map((d) => (
              <li key={d.id} className={styles.deliveryItem}>
                <span className={styles.deliveryIcon} aria-hidden="true">
                  {d.icon}
                </span>
                <span className={styles.deliveryText}>
                  <strong>{d.title}</strong>
                  <span>{d.copy}</span>
                </span>
              </li>
            ))}
          </ul>
          <aside className={styles.bulkBanner}>
            <div className={styles.bulkCopy}>
              <strong>Buying in bulk?</strong>
              <span>Special pricing for wholesalers</span>
              <a href="/wholesale" className={styles.bulkCta}>
                Enquire Now
              </a>
            </div>
            <div className={styles.bulkIcon} aria-hidden="true">
              <Image
                src={bulkImg}
                alt=""
                fill
                sizes="80px"
                className={styles.bulkImg}
              />
            </div>
          </aside>
        </div>

        {/* ─────────── Tabs + Perfect For sidebar ─────────── */}
        <div className={styles.tabsSection}>
          <div className={styles.tabsMain}>
            <nav className={styles.tabsNav} role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.id}
                  className={`${styles.tabBtn} ${
                    activeTab === t.id ? styles.tabBtnActive : ""
                  }`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                  {t.id === "reviews" ? ` (${reviewCount})` : ""}
                </button>
              ))}
            </nav>

            <div className={styles.tabPanel}>
              {activeTab === "description" && (
                <div
                  className={styles.descLayout}
                  style={hasVideo ? undefined : { gridTemplateColumns: "minmax(0, 1fr)" }}
                >
                  <div className={styles.descText}>
                    {product.description ? (
                      <p>{product.description}</p>
                    ) : null}
                  </div>

                  {hasVideo && (
                    <div className={styles.videoCard} aria-label="Product video preview">
                      <div className={styles.videoMedia}>
                        <Image
                          src={gallery[0]}
                          alt=""
                          fill
                          sizes="(max-width: 860px) 90vw, 30vw"
                          className={styles.videoImg}
                        />
                        <button
                          type="button"
                          className={styles.videoPlay}
                          aria-label="Play video"
                          onClick={() => setVideoOpen(true)}
                        >
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                      <div className={styles.videoMeta}>
                        <strong>{videoTitle}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "pack" && (
                (Array.isArray(product.packContents) &&
                  product.packContents.length > 0) ||
                (Array.isArray(product.usage) && product.usage.length > 0) ? (
                  <div className={styles.packLayout}>
                    {Array.isArray(product.packContents) &&
                      product.packContents.length > 0 && (
                        <div>
                          <h4 className={styles.descHeading}>
                            What&apos;s in the pack
                          </h4>
                          <ul className={styles.descList}>
                            {product.packContents.map((line, i) => (
                              <li key={`pc-${i}`}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {Array.isArray(product.usage) &&
                      product.usage.length > 0 && (
                        <div>
                          <h4 className={styles.descHeading}>
                            Usage &amp; project ideas
                          </h4>
                          <ul className={styles.descList}>
                            {product.usage.map((line, i) => (
                              <li key={`u-${i}`}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <p>No pack details listed for this product.</p>
                )
              )}

              {activeTab === "specs" && (
                specRows.length > 0 ? (
                  <ul className={styles.specSummary}>
                    {specRows.map((r) => (
                      <li key={r.key}>
                        <span className={styles.specKey}>{r.label}</span>
                        <span className={styles.specVal}>{r.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No specifications listed for this product.</p>
                )
              )}

              {activeTab === "shipping" && (
                <ul className={styles.descList}>
                  <li>Pan India delivery in 3–7 business days</li>
                  <li>Free shipping on orders above ₹2500</li>
                  <li>Damage protection: replacement for transit-damaged items</li>
                  <li>Live tracking via SMS &amp; WhatsApp</li>
                </ul>
              )}

              {activeTab === "reviews" && (
                reviews.length === 0 ? (
                  <p>No reviews yet for this product.</p>
                ) : (
                <div className={styles.reviewsPanel}>
                  <div className={styles.reviewsSummary}>
                    <div className={styles.reviewsAvg}>
                      <span className={styles.reviewsScore}>
                        {rating.toFixed(1)}
                      </span>
                      <span
                        className={styles.reviewsStars}
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} viewBox="0 0 24 24" width="16" height="16">
                            <path
                              d="M12 3.5l2.6 5.6 6 .6-4.5 4.2 1.3 6L12 17l-5.4 2.9 1.3-6L3.4 9.7l6-.6L12 3.5z"
                              fill="currentColor"
                            />
                          </svg>
                        ))}
                      </span>
                      <span className={styles.reviewsCount}>
                        Based on {reviewCount} reviews
                      </span>
                    </div>
                    
                  </div>

                  <ul className={styles.reviewsList}>
                    {reviews.map((r) => (
                      <li key={r.id} className={styles.reviewCard}>
                        <header className={styles.reviewHead}>
                          <span
                            className={styles.reviewAvatar}
                            aria-hidden="true"
                          >
                            {r.initial}
                          </span>
                          <div className={styles.reviewMeta}>
                            <span className={styles.reviewName}>{r.name}</span>
                            <span className={styles.reviewSub}>
                              {r.verified && (
                                <span className={styles.verifiedBadge}>
                                  ✓ Verified Buyer
                                </span>
                              )}
                              <span className={styles.reviewDate}>{r.date}</span>
                            </span>
                          </div>
                          <span
                            className={styles.reviewStars}
                            aria-label={`${r.rating} out of 5 stars`}
                          >
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} viewBox="0 0 24 24" width="13" height="13">
                                <path
                                  d="M12 3.5l2.6 5.6 6 .6-4.5 4.2 1.3 6L12 17l-5.4 2.9 1.3-6L3.4 9.7l6-.6L12 3.5z"
                                  fill={i < r.rating ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  strokeWidth="1"
                                />
                              </svg>
                            ))}
                          </span>
                        </header>
                        <h4 className={styles.reviewTitle}>{r.title}</h4>
                        <p className={styles.reviewBody}>{r.body}</p>
                      </li>
                    ))}
                  </ul>

                  <button type="button" className={styles.loadMoreBtn}>
                    Load More Reviews
                  </button>
                </div>
                )
              )}

              {activeTab === "faqs" && (
                <div className={styles.faqPanel}>
                  <div className={styles.faqHead}>
                  </div>
                  {faqs.length === 0 ? (
                    <p>No FAQs yet for this product.</p>
                  ) : (
                  <ul className={styles.faqList}>
                    {faqs.map((f) => {
                      const isOpen = openFaq === f.id;
                      return (
                        <li
                          key={f.id}
                          className={`${styles.faqItem} ${
                            isOpen ? styles.faqItemOpen : ""
                          }`}
                        >
                          <button
                            type="button"
                            className={styles.faqQ}
                            onClick={() =>
                              setOpenFaq((cur) => (cur === f.id ? null : f.id))
                            }
                            aria-expanded={isOpen}
                            aria-controls={`faq-${f.id}`}
                          >
                            <span className={styles.faqQText}>{f.q}</span>
                            <span
                              className={styles.faqToggle}
                              aria-hidden="true"
                            >
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </span>
                          </button>
                          {isOpen && (
                            <div id={`faq-${f.id}`} className={styles.faqA}>
                              {f.a}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  )}
                  <div className={styles.faqFoot}>
                    <span>Still have questions?</span>
                    <a href="/contact" className={styles.faqContactCta}>
                      Contact Support <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className={styles.perfectFor}>
            <h3 className={styles.perfectForTitle}>Perfect For</h3>
            <ul className={styles.perfectForGrid}>
              {PERFECT_FOR.map((p) => (
                <li key={p.id} className={styles.perfectForItem}>
                  <span className={styles.perfectForIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 3l3 6 6 .5-4.5 4 1.5 6L12 16l-6 3.5 1.5-6L3 9.5l6-.5L12 3z" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className={styles.perfectForLabel}>{p.label}</span>
                </li>
              ))}
            </ul>
            <div className={styles.ideasCard}>
              <div className={styles.ideasCopy}>
                <strong>Need ideas?</strong>
                <span>Explore our DIY tutorials and craft inspirations</span>
                <a href="/blog" className={styles.ideasCta}>
                  Explore Ideas <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
              <span className={styles.ideasBulb} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                  <path d="M9 18h6M10 21h4" strokeLinecap="round" />
                  <path d="M12 3a6 6 0 0 1 4 10.5c-.7.7-1 1.5-1 2.5v1h-6v-1c0-1-.3-1.8-1-2.5A6 6 0 0 1 12 3z" />
                </svg>
              </span>
            </div>
          </aside>
        </div>

        {/* ─────────── Complete Your Craft ─────────── */}
        <section className={styles.completeCraft}>
          <div className={styles.sectionHead}>
            <span className={styles.headOrn} aria-hidden="true">&hearts;</span>
            <h2 className={styles.sectionTitle}>Complete Your Craft</h2>
            <span className={styles.headOrn} aria-hidden="true">&hearts;</span>
          </div>
          <ul className={styles.craftGrid}>
            {(craftProducts.length > 0
              ? craftProducts.map((p) => ({
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  meta: p.occasion || p.category || "",
                  price: p.price,
                  image: resolveProductImage(p),
                  real: true,
                }))
              : COMPLETE_CRAFT.map((c, i) => ({
                  ...c,
                  image: gallery[i % gallery.length],
                  real: false,
                }))
            ).map((c) => {
              const isAdding = c.real && craftAdding.has(c.id);
              const isAdded = c.real && craftAdded.has(c.id);
              return (
                <li key={c.id} className={styles.craftItem}>
                  <div className={styles.craftMedia}>
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(max-width: 860px) 45vw, 18vw"
                      className={styles.craftImg}
                    />
                  </div>
                  <div className={styles.craftBody}>
                    <strong>{c.name}</strong>
                    {c.meta && <span>{c.meta}</span>}
                    <div className={styles.craftRow}>
                      <span className={styles.craftPrice}>{inr.format(c.price)}</span>
                      <button
                        type="button"
                        className={styles.craftAdd}
                        onClick={() => c.real && addCraftItem(c)}
                        disabled={!c.real || isAdding || isAdded}
                        aria-label={`Add ${c.name} to cart`}
                      >
                        {isAdded ? "Added ✓" : isAdding ? "Adding…" : "Add"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ─────────── Real Creations ─────────── */}
        <section className={styles.creations}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Real Creations by Our Lovely Customers</h2>
          </div>
          <ul className={styles.creationsGrid}>
            {REAL_CREATIONS.map((src, i) => (
              <li key={i} className={styles.creationTile}>
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 860px) 30vw, 15vw"
                  className={styles.creationImg}
                />
              </li>
            ))}
          </ul>
          <div className={styles.creationsCta}>
            <a
              href="https://www.instagram.com/decornart.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewMore}
              aria-label="View more customer creations on our Instagram @decornart.in"
            >
              <span className={styles.viewMoreIcon} aria-hidden="true">
                <FaInstagram />
              </span>
              View more customer creations on Instagram
            </a>
          </div>
        </section>
      </div>

      {hasVideo && videoOpen && (
        <div
          className={styles.videoModal}
          role="dialog"
          aria-modal="true"
          aria-label={videoTitle}
          onClick={() => setVideoOpen(false)}
        >
          <div
            className={styles.videoModalInner}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.videoModalClose}
              aria-label="Close video"
              onClick={() => setVideoOpen(false)}
            >
              ✕
            </button>
            {parsedVideo.kind === "iframe" ? (
              <iframe
                src={parsedVideo.src}
                title={videoTitle}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            ) : (
              <video src={parsedVideo.src} controls autoPlay playsInline>
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}

      {/* ─────────── Bottom trust strip (full-bleed dark plum) ─────────── */}
      <section className={styles.bottomTrust}>
        <div className="container">
          <ul className={styles.bottomTrustList}>
            {BOTTOM_TRUST.map((t) => (
              <li key={t.id} className={styles.bottomTrustItem}>
                <span className={styles.bottomTrustIcon} aria-hidden="true">
                  {t.icon}
                </span>
                <span className={styles.bottomTrustText}>
                  <strong>{t.title}</strong>
                  <span>{t.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </section>
  );
}
