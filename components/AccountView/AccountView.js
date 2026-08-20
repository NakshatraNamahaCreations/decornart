"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaCommentDots,
} from "react-icons/fa";
import {
  FiHome,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiUser,
  FiCreditCard,
  FiStar,
  FiZap,
  FiTag,
  FiBell,
  FiRotateCcw,
  FiTruck,
  FiShoppingBag,
  FiSettings,
  FiLogOut,
  FiCheck,
  FiGift,
  FiBriefcase,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiShoppingCart,
  FiArrowRight,
  FiAward,
  FiShield,
  FiUsers,
  FiLifeBuoy,
  FiMessageSquare,
  FiUpload,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { PiHandWavingFill } from "react-icons/pi";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import * as authApi from "@/lib/api/auth";
import { listOrders } from "@/lib/api/orders";
import { getWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { resolveProductImage } from "@/lib/productImages";
import heroImg from "@/assets/orderbg.png";
import product1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import product2 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import product3 from "@/assets/pipecleaners.png";
import wish1 from "@/assets/for-you-bouquet/for-you1.jpeg";
import wish2 from "@/assets/stem-rose/stem-rose6.png";
import wish3 from "@/assets/luxe-rose/luxe-rose1.jpeg";
import creation1 from "@/assets/butterfly-luxury/luxury1.jpeg";
import creation2 from "@/assets/butterfly-signature/signature1.jpeg";
import creation3 from "@/assets/for-mother-gift/for-mother1.jpeg";
import creation4 from "@/assets/luxe-dual/luxe-dual1.jpeg";
import creation5 from "@/assets/newborn-cradle/new-born1.jpeg";
import creation6 from "@/assets/cone-shape-gift/cone-shape1.jpeg";
import referImg from "@/assets/gift-box.jpeg";
import visaImg from "@/assets/payment/visa.jpg";
import mastercardImg from "@/assets/payment/mastercard.jpg";
import upiImg from "@/assets/payment/upi.jpg";
import rupayImg from "@/assets/payment/rupay.jpg";
import paytmImg from "@/assets/payment/paytm.jpg";
import styles from "./AccountView.module.css";

// Maps the value stored in each saved-payment record's `brand` field to
// the matching logo asset. Falls back to the text pill (via brandClass)
// when the brand isn't in this map — e.g. generic "CARD" for unknown BINs.
const PAYMENT_LOGOS = {
  UPI: { src: upiImg, alt: "UPI" },
  VISA: { src: visaImg, alt: "Visa" },
  MC: { src: mastercardImg, alt: "Mastercard" },
  RUPAY: { src: rupayImg, alt: "RuPay" },
  PAYTM: { src: paytmImg, alt: "Paytm" },
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "orders", label: "My Orders", icon: "orders", href: "/order" },
  { id: "wishlist", label: "My Wishlist", icon: "heart", href: "/wishlist" },
  { id: "addresses", label: "My Addresses", icon: "pin" },
  { id: "details", label: "Account Details", icon: "user" },
  { id: "payments", label: "Payment Methods", icon: "card" },
  { id: "reviews", label: "My Reviews", icon: "star", href: "/reviews" },
  { id: "creations", label: "My Creations", icon: "sparkle", badge: "NEW" },
  { id: "rewards", label: "Rewards & Coupons", icon: "tag", href: "/offers" },
  // { id: "notifications", label: "Notifications", icon: "bell", count: 2 },
  { id: "returns", label: "Returns & Refunds", icon: "return", href: "/policies" },
  { id: "track", label: "Track Your Order", icon: "truck", href: "/order" },
  { id: "wholesale", label: "Wholesale Dashboard", icon: "store", href: "/wholesale" },
  // { id: "settings", label: "Settings", icon: "gear" },
];

const STATS = [
  { id: "orders", value: 18, title: "Orders", sub: "Total Orders", icon: "box" },
  { id: "transit", value: 2, title: "In Transit", sub: "On the way", icon: "truck" },
  { id: "wishlist", value: 5, title: "Wishlist", sub: "Saved Items", icon: "heart" },
  { id: "coupons", value: 3, title: "Coupons", sub: "Available", icon: "tag" },
  { id: "reviews", value: 12, title: "Reviews", sub: "Your Reviews", icon: "star" },
];

const TRACK_STEPS = [
  { id: "placed", label: "Placed", date: "21 May", done: true, icon: "check" },
  { id: "confirmed", label: "Confirmed", date: "21 May", done: true, icon: "check" },
  { id: "packed", label: "Packed", date: "22 May", done: true, icon: "pack" },
  { id: "transit", label: "In Transit", date: "23 May", current: true, icon: "truck" },
  { id: "out", label: "Out for Delivery", date: "27 May", icon: "truck" },
  { id: "delivered", label: "Delivered", date: "-", icon: "gift" },
];

const RECENT_ORDERS = [
  {
    id: "DNAR202405210123",
    name: "Butterfly Flower Gift Bag",
    date: "21 May, 2024",
    items: 3,
    status: "Delivered",
    statusNote: "Delivered on 25 May, 2024",
    amount: 1196,
    image: product1,
    tone: "good",
  },
  {
    id: "DNAR202405150098",
    name: "Single Rose Cone Holder",
    date: "15 May, 2024",
    items: 2,
    status: "In Transit",
    statusNote: "Arriving by 27 May, 2024",
    amount: 798,
    image: product2,
    tone: "busy",
  },
  {
    id: "DNAR202405100076",
    name: "Pipe Cleaners – 8mm (100 Strands in Each Bundle)",
    date: "10 May, 2024",
    items: 4,
    status: "Confirmed",
    statusNote: "Your order is confirmed",
    amount: 1498,
    image: product3,
    tone: "warm",
  },
];

const SAVED_ADDRESSES = [
  {
    id: "home",
    label: "Home",
    isDefault: true,
    icon: "home",
    lines: [
      "12, 3rd Cross, 7th Main Layout",
      "Sector 2, Bengaluru, Karnataka – 560102",
      "+91 9986988786",
    ],
  },
  {
    id: "office",
    label: "Office",
    icon: "office",
    lines: [
      "DecorNArt Studio, 15th Main",
      "Koramangala, Bengaluru",
      "Karnataka – 560034",
      "+91 9986988786",
    ],
  },
];

const WISHLIST = [
  { id: "w1", name: "Rose Bear with LED Lights", price: 1299, image: wish1 },
  { id: "w2", name: "Dried Flower Bouquet", price: 899, image: wish2 },
  { id: "w3", name: "Scented Candle Gift Set", price: 649, image: wish3 },
];

const CREATIONS = [creation1, creation2, creation3, creation4, creation5, creation6];

// Placeholder "video" reels shown in the My Creations tab. Once the backend
// starts persisting user uploads, swap `poster` → CDN URL and `videoUrl` →
// the actual file. For now clicking a tile opens a lightbox that renders the
// poster with a play button — the reel plays only if `videoUrl` is present.
const CREATION_REELS = [
  {
    id: "reel-1",
    title: "Butterfly Luxury Unboxing",
    duration: "0:24",
    poster: creation1,
    videoUrl: "",
  },
  {
    id: "reel-2",
    title: "Signature Bouquet Reveal",
    duration: "0:18",
    poster: creation2,
    videoUrl: "",
  },
  {
    id: "reel-3",
    title: "Gift for Mom — DIY",
    duration: "0:31",
    poster: creation3,
    videoUrl: "",
  },
  {
    id: "reel-4",
    title: "Luxe Dual Bouquet Styling",
    duration: "0:22",
    poster: creation4,
    videoUrl: "",
  },
  {
    id: "reel-5",
    title: "Newborn Cradle Setup",
    duration: "0:29",
    poster: creation5,
    videoUrl: "",
  },
  {
    id: "reel-6",
    title: "Cone Shape Gift Wrap",
    duration: "0:17",
    poster: creation6,
    videoUrl: "",
  },
];

const PAYMENT_METHODS = [
  { id: "upi", type: "UPI", detail: "anusha@upi", primary: true, brand: "UPI" },
  { id: "visa", type: "Visa ending with 4567", detail: "Expires 12/26", brand: "VISA" },
  { id: "mc", type: "Mastercard ending with 7890", detail: "Expires 11/25", brand: "MC" },
];

const QUICK_LINKS = [
  { id: "orders", title: "Quick Links", sub: "Check your order status", icon: "orders", href: "/order" },
  { id: "returns", title: "Return & Replacement", sub: "Hassle-Free Replacement", icon: "return", href: "/account?tab=returns" },
  { id: "coupons", title: "My Coupons", sub: "View all offers", icon: "tag", href: "/account?tab=rewards" },
  { id: "help", title: "Help", sub: "Support", icon: "chat", href: "/help" },
  { id: "helpc", title: "Help Center", sub: "FAQs & Support", icon: "life", href: "/help" },
  { id: "wholesale", title: "Wholesale Dashboard", sub: "Manage partners", icon: "store", href: "/wholesale" },
];

const BOTTOM_TRUST = [
  { id: "secure", title: "Secure Payments", copy: "100% safe & secure", icon: "shield" },
  { id: "delivery", title: "Pan India Delivery", copy: "Fast & reliable shipping", icon: "truck" },
  { id: "returns", title: "Damage Protection", copy: "Replacement for transit-damaged items", icon: "return" },
  { id: "premium", title: "Premium Quality", copy: "Curated with Love", icon: "medal" },
  { id: "happy", title: "10,000+ Happy Customers", copy: "Trust & love us", icon: "users" },
];

/* ─────────── react-icons lookup ─────────── */
const ICON_MAP = {
  home: FiHome,
  orders: FiPackage,
  box: FiPackage,
  heart: FiHeart,
  pin: FiMapPin,
  user: FiUser,
  card: FiCreditCard,
  star: FiStar,
  sparkle: FiZap,
  tag: FiTag,
  bell: FiBell,
  return: FiRotateCcw,
  truck: FiTruck,
  store: FiShoppingBag,
  gear: FiSettings,
  logout: FiLogOut,
  check: FiCheck,
  pack: FiPackage,
  gift: FiGift,
  office: FiBriefcase,
  edit: FiEdit2,
  trash: FiTrash2,
  plus: FiPlus,
  cart: FiShoppingCart,
  arrow: FiArrowRight,
  medal: FiAward,
  shield: FiShield,
  users: FiUsers,
  life: FiLifeBuoy,
  chat: FiMessageSquare,
  upload: FiUpload,
  mail: FiMail,
  phone: FiPhone,
  lock: FiLock,
  eye: FiEye,
  eyeOff: FiEyeOff,
};

function Icon({ name, size = 18 }) {
  const Cmp = ICON_MAP[name];
  return Cmp ? <Cmp size={size} /> : null;
}

// Non-final order statuses that count as "on the way" for the transit stat
// and the header tracking card. Anything past this list is considered final.
const IN_TRANSIT_STATUSES = new Set(["pending", "confirmed", "processing", "shipped"]);

// Ordered pipeline used to render the status timeline on the tracking card
// from a real order's `status` field.
const TRACK_PIPELINE = [
  { key: "pending", label: "Placed", icon: "check" },
  { key: "confirmed", label: "Confirmed", icon: "check" },
  { key: "processing", label: "Packed", icon: "pack" },
  { key: "shipped", label: "In Transit", icon: "truck" },
  { key: "out-for-delivery", label: "Out for Delivery", icon: "truck" },
  { key: "delivered", label: "Delivered", icon: "gift" },
];

// Storefront status pill tone.
function statusTone(s) {
  if (s === "delivered") return "good";
  if (s === "cancelled") return "danger";
  if (s === "shipped" || s === "processing") return "busy";
  return "warm";
}

// "delivered" / "cancelled" / etc. → "Delivered", "Cancelled".
function titleCase(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// Fold API-shape addresses (Mongo _id + separate name/line1/city/… fields)
// into the {label, lines[], icon} shape this page's UI expects.
function apiAddressToDisplay(a) {
  const parts = [];
  const line1 = [a.name, a.line1].filter(Boolean).join(", ");
  if (line1) parts.push(line1);
  if (a.line2) parts.push(a.line2);
  const cityLine = [a.city, a.state, a.pincode ? `– ${a.pincode}` : ""]
    .filter(Boolean)
    .join(", ");
  if (cityLine) parts.push(cityLine);
  if (a.phone) parts.push(a.phone);
  return {
    id: String(a._id || a.id),
    label: a.label || (a.isDefault ? "Home" : "Address"),
    isDefault: !!a.isDefault,
    icon: (a.label || "").toLowerCase() === "office" ? "office" : "home",
    lines: parts,
  };
}

export default function AccountView() {
  const root = useRef(null);
  const router = useRouter();
  const auth = useAuth?.();
  const user = auth?.user;
  const isAuthed = auth?.isAuthed;
  const { addItem: addCartItem } = useCart();
  const [activeNav, setActiveNav] = useState("dashboard");

  // Track which wishlist items are being added / were just added, so the
  // "Add to Cart" button in the wishlist can show a lightweight feedback state.
  const [cartAdding, setCartAdding] = useState(() => new Set());
  const [cartAdded, setCartAdded] = useState(() => new Set());

  // Backend-fetched modules. Each falls back to demo data below when the
  // shopper is a guest, or when the fetch hasn't completed / failed.
  const [apiOrders, setApiOrders] = useState(null);
  const [apiWishlist, setApiWishlist] = useState(null);

  useEffect(() => {
    if (!isAuthed) {
      setApiOrders(null);
      setApiWishlist(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const [ordersRes, wishRes] = await Promise.all([
        listOrders({ limit: 20 }).catch(() => []),
        getWishlist().catch(() => ({ items: [] })),
      ]);
      if (cancelled) return;
      setApiOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setApiWishlist(Array.isArray(wishRes?.items) ? wishRes.items : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthed]);

  // ── Addresses come from user.addresses (kept fresh by AuthProvider).
  const backendAddresses = useMemo(() => {
    if (!isAuthed) return null;
    const raw = Array.isArray(user?.addresses) ? user.addresses : [];
    return raw.map(apiAddressToDisplay);
  }, [isAuthed, user?.addresses]);

  // Fall back to demo data for guests + while fetching.
  const [localAddresses, setLocalAddresses] = useState(SAVED_ADDRESSES);
  const addresses = backendAddresses ?? localAddresses;
  const setAddresses = backendAddresses ? () => {} : setLocalAddresses;
  const [addrEditingId, setAddrEditingId] = useState(null);
  const [addrFormOpen, setAddrFormOpen] = useState(false);
  const [addrError, setAddrError] = useState("");
  const [addrSaving, setAddrSaving] = useState(false);
  const emptyAddress = { label: "", line1: "", line2: "", phone: "" };
  const [addrDraft, setAddrDraft] = useState(emptyAddress);

  // ── Derived: real orders → display shape, in-transit list, stats.
  const recentOrders = useMemo(() => {
    if (!Array.isArray(apiOrders) || apiOrders.length === 0) return null;
    return apiOrders.slice(0, 3).map((o) => {
      const firstItem = o.items?.[0];
      return {
        id: o.orderNumber || o.id,
        name: firstItem?.name || `${o.items?.length || 0} items`,
        date: formatDate(o.createdAt),
        items: (o.items || []).reduce((s, i) => s + (i.qty || 0), 0),
        status: titleCase(o.status),
        statusNote:
          o.status === "delivered"
            ? `Delivered on ${formatDate(o.updatedAt || o.createdAt)}`
            : o.status === "cancelled"
              ? "Order cancelled"
              : `Placed on ${formatDate(o.createdAt)}`,
        amount: o.summary?.total || 0,
        image: firstItem ? resolveProductImage({ slug: firstItem.slug, image: firstItem.image }) : null,
        tone: statusTone(o.status),
      };
    });
  }, [apiOrders]);

  const inTransitOrder = useMemo(() => {
    if (!Array.isArray(apiOrders)) return null;
    return (
      apiOrders.find((o) => o.status === "shipped") ||
      apiOrders.find((o) => IN_TRANSIT_STATUSES.has(o.status)) ||
      null
    );
  }, [apiOrders]);

  const stats = useMemo(() => {
    if (!Array.isArray(apiOrders)) return STATS;
    const transit = apiOrders.filter((o) => IN_TRANSIT_STATUSES.has(o.status)).length;
    return [
      { id: "orders", value: apiOrders.length, title: "Orders", sub: "Total Orders", icon: "box" },
      { id: "transit", value: transit, title: "In Transit", sub: "On the way", icon: "truck" },
      { id: "wishlist", value: apiWishlist?.length ?? 0, title: "Wishlist", sub: "Saved Items", icon: "heart" },
      { id: "coupons", value: 0, title: "Coupons", sub: "Available", icon: "tag" },
      { id: "reviews", value: 0, title: "Reviews", sub: "Your Reviews", icon: "star" },
    ];
  }, [apiOrders, apiWishlist]);

  const wishlistItems = useMemo(() => {
    if (!Array.isArray(apiWishlist)) return null;
    return apiWishlist.slice(0, 3).map((w) => ({
      id: w.id,
      slug: w.slug,
      name: w.name,
      price: w.price,
      image: resolveProductImage({ slug: w.slug, image: w.image }),
    }));
  }, [apiWishlist]);

  const handleRemoveWishlist = async (productId) => {
    if (!isAuthed) return;
    try {
      const res = await removeFromWishlist(productId);
      setApiWishlist(Array.isArray(res?.items) ? res.items : []);
    } catch {
      /* silent */
    }
  };

  const handleAddWishlistToCart = async (productId) => {
    if (!isAuthed || !productId) return;
    setCartAdding((prev) => new Set(prev).add(productId));
    try {
      await addCartItem(productId, 1);
      // Fire the same event the Shop page uses so the Navbar toast pops up
      // ("Added to cart"). The listener lives in the Navbar.
      const p = (wishlistItems || []).find((x) => x.id === productId);
      if (p && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cart:item-added", {
            detail: {
              id: p.id,
              name: p.name,
              price: p.price,
              image: p.image,
              qty: 1,
            },
          })
        );
      }
      setCartAdded((prev) => new Set(prev).add(productId));
      setTimeout(() => {
        setCartAdded((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }, 1800);
    } catch {
      /* silent — cart provider surfaces errors elsewhere */
    } finally {
      setCartAdding((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const openAddAddress = () => {
    setAddrEditingId(null);
    setAddrDraft(emptyAddress);
    setAddrFormOpen(true);
  };

  const openEditAddress = (a) => {
    const [line1 = "", line2 = "", phone = ""] = a.lines || [];
    setAddrEditingId(a.id);
    setAddrDraft({ label: a.label, line1, line2, phone });
    setAddrFormOpen(true);
  };

  const cancelAddressForm = () => {
    setAddrFormOpen(false);
    setAddrEditingId(null);
    setAddrDraft(emptyAddress);
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    const { label, line1, line2, phone } = addrDraft;
    if (!label.trim() || !line1.trim()) return;

    // Backend path — for authed shoppers we persist to /auth/addresses so the
    // list survives reloads. Edit sends a partial PATCH (label/phone/line1/2);
    // create is only allowed via checkout because the backend requires
    // city/state/pincode which this compact form doesn't collect.
    if (isAuthed) {
      setAddrError("");
      if (!addrEditingId) {
        setAddrError(
          "Please add a full address from checkout — city, state and pincode are required."
        );
        return;
      }
      setAddrSaving(true);
      try {
        await authApi.updateAddress(addrEditingId, {
          label: label.trim(),
          phone: phone.trim() || undefined,
          line1: line1.trim(),
          line2: line2.trim() || undefined,
        });
        await auth?.refresh?.();
        cancelAddressForm();
      } catch (err) {
        setAddrError(err?.message || "Could not save the address.");
      } finally {
        setAddrSaving(false);
      }
      return;
    }

    // Guest fallback — local only.
    const lines = [line1, line2, phone].filter((l) => l && l.trim().length);
    if (addrEditingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === addrEditingId ? { ...a, label: label.trim(), lines } : a
        )
      );
    } else {
      const id = `addr-${Date.now()}`;
      setAddresses((prev) => [
        ...prev,
        { id, label: label.trim(), icon: "pin", lines },
      ]);
    }
    cancelAddressForm();
  };

  const deleteAddress = async (id) => {
    if (isAuthed) {
      setAddrError("");
      try {
        await authApi.deleteAddress(id);
        await auth?.refresh?.();
        if (addrEditingId === id) cancelAddressForm();
      } catch (err) {
        setAddrError(err?.message || "Could not delete the address.");
      }
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (addrEditingId === id) cancelAddressForm();
  };

  const displayName = user?.name || "Anusha";
  const displayEmail = user?.email || "anusha@example.com";
  const initials =
    displayName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AV";

  // ── Account details (name / email / phone) — hydrated from the auth user
  // and persisted via PATCH /auth/me. `editingProfile` gates whether the
  // inputs are shown or a read-only summary.
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ name: "", email: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    setProfileDraft({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user?.name, user?.email, user?.phone]);

  const beginEditProfile = () => {
    setProfileDraft({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setProfileError("");
    setProfileSaved(false);
    setEditingProfile(true);
  };

  const cancelEditProfile = () => {
    setEditingProfile(false);
    setProfileError("");
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!isAuthed) return;
    setProfileError("");
    setProfileSaving(true);
    try {
      // Only send fields that actually changed. Empty phone stays empty.
      const payload = {};
      if ((profileDraft.name || "").trim() && profileDraft.name !== user?.name) {
        payload.name = profileDraft.name.trim();
      }
      if ((profileDraft.email || "").trim() && profileDraft.email !== user?.email) {
        payload.email = profileDraft.email.trim();
      }
      if ((profileDraft.phone || "") !== (user?.phone || "")) {
        payload.phone = (profileDraft.phone || "").trim();
      }
      if (Object.keys(payload).length === 0) {
        setEditingProfile(false);
        return;
      }
      await authApi.updateProfile(payload);
      await auth?.refresh?.();
      setEditingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2400);
    } catch (err) {
      const detail = err?.details
        ? ` — ${err.details.map((d) => d.message || d).join("; ")}`
        : "";
      setProfileError(`${err?.message || "Could not save profile."}${detail}`);
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Password change form
  const [pwdDraft, setPwdDraft] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSaved, setPwdSaved] = useState(false);
  // Per-field show/hide toggle for the three password inputs.
  const [pwdShow, setPwdShow] = useState({ current: false, next: false, confirm: false });
  const togglePwdShow = (key) =>
    setPwdShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const savePassword = async (e) => {
    e.preventDefault();
    if (!isAuthed) return;
    setPwdError("");
    if (pwdDraft.newPassword.length < 8) {
      setPwdError("New password must be at least 8 characters.");
      return;
    }
    if (pwdDraft.newPassword !== pwdDraft.confirmPassword) {
      setPwdError("New password and confirmation don't match.");
      return;
    }
    setPwdSaving(true);
    try {
      await authApi.changePassword({
        currentPassword: pwdDraft.currentPassword,
        newPassword: pwdDraft.newPassword,
      });
      setPwdDraft({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwdSaved(true);
      setTimeout(() => setPwdSaved(false), 2800);
    } catch (err) {
      setPwdError(err?.message || "Could not change password.");
    } finally {
      setPwdSaving(false);
    }
  };

  // ── Payment methods (client-only for now — the backend doesn't persist
  // stored payment instruments; real charges are still initiated at checkout).
  const [payments, setPayments] = useState(PAYMENT_METHODS);
  const [payFormOpen, setPayFormOpen] = useState(false);
  const [payKind, setPayKind] = useState("upi"); // "upi" | "card"
  const emptyPayDraft = {
    upiId: "",
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    primary: false,
  };
  const [payDraft, setPayDraft] = useState(emptyPayDraft);
  const [payError, setPayError] = useState("");

  const openAddPayment = () => {
    setPayKind("upi");
    setPayDraft(emptyPayDraft);
    setPayError("");
    setPayFormOpen(true);
  };
  const cancelPaymentForm = () => {
    setPayFormOpen(false);
    setPayError("");
    setPayDraft(emptyPayDraft);
  };
  const brandClass = (p) => {
    const b = (p.brand || "").toLowerCase();
    if (b === "upi") return styles.brand_upi;
    if (b === "visa") return styles.brand_visa;
    if (b === "mc") return styles.brand_mc;
    return "";
  };
  const savePayment = (e) => {
    e.preventDefault();
    setPayError("");
    if (payKind === "upi") {
      const upi = payDraft.upiId.trim();
      if (!/^[\w.\-]{2,}@[\w.\-]{2,}$/.test(upi)) {
        setPayError("Enter a valid UPI ID (e.g. yourname@bank).");
        return;
      }
      const id = `upi-${Date.now()}`;
      setPayments((prev) => {
        const cleared = payDraft.primary
          ? prev.map((p) => ({ ...p, primary: false }))
          : prev;
        return [
          ...cleared,
          { id, type: "UPI", detail: upi, primary: !!payDraft.primary, brand: "UPI" },
        ];
      });
      cancelPaymentForm();
      return;
    }
    const digits = (payDraft.cardNumber || "").replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) {
      setPayError("Enter a valid card number.");
      return;
    }
    if (!payDraft.cardHolder.trim()) {
      setPayError("Add the cardholder name.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payDraft.cardExpiry)) {
      setPayError("Expiry must be MM/YY.");
      return;
    }
    const last4 = digits.slice(-4);
    const brand = /^4/.test(digits) ? "VISA" : /^5[1-5]/.test(digits) ? "MC" : "CARD";
    const typeLabel =
      brand === "MC"
        ? `Mastercard ending with ${last4}`
        : brand === "VISA"
          ? `Visa ending with ${last4}`
          : `Card ending with ${last4}`;
    const id = `${brand.toLowerCase()}-${Date.now()}`;
    setPayments((prev) => {
      const cleared = payDraft.primary
        ? prev.map((p) => ({ ...p, primary: false }))
        : prev;
      return [
        ...cleared,
        {
          id,
          type: typeLabel,
          detail: `Expires ${payDraft.cardExpiry}`,
          primary: !!payDraft.primary,
          brand,
        },
      ];
    });
    cancelPaymentForm();
  };
  const deletePayment = (id) =>
    setPayments((prev) => prev.filter((p) => p.id !== id));
  const makePrimaryPayment = (id) =>
    setPayments((prev) => prev.map((p) => ({ ...p, primary: p.id === id })));

  // ── My Creations lightbox — holds the reel currently being previewed.
  const [openReel, setOpenReel] = useState(null);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const requestLogout = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);
  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await auth?.logout?.();
    } catch {}
    setLoggingOut(false);
    setShowLogoutConfirm(false);
    router.push("/");
  };

  return (
    <main ref={root} className={styles.page}>
      {/* ─────────── 1. Hero ─────────── */}
      <section className={styles.hero} aria-label="My account">
        <div className={styles.heroDeco} aria-hidden="true">
          <Image
            src={heroImg}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>My Account</h1>
            <p className={styles.heroLead}>
              Manage your orders, profile, and preferences all in one place.{" "}
              <span aria-hidden="true" className={styles.heroHeart}>&hearts;</span>
            </p>
          </div>
        </div>
      </section>

      <div className={`container ${styles.container}`}>
        <div className={styles.layout}>
          {/* ─────────── LEFT: sidebar ─────────── */}
          <aside className={styles.sidebar}>
            {/* Profile card */}
            <section className={styles.profileCard}>
              <span className={styles.avatar} aria-hidden="true">
                {initials}
              </span>
              <div className={styles.profileBody}>
                <strong className={styles.profileName}>{displayName}</strong>
                <span className={styles.profileEmail}>{displayEmail}</span>
                <span className={styles.verifiedBadge}>
                  <span className={styles.verifiedDot} aria-hidden="true">
                    <FiCheck size={10} strokeWidth={3} />
                  </span>
                  Verified
                </span>
              </div>
            </section>

            {/* Nav */}
            <nav className={styles.nav} aria-label="Account navigation">
              <ul className={styles.navList}>
                {NAV_ITEMS.map((item) => {
                  const isActive = activeNav === item.id;
                  const className = `${styles.navBtn} ${
                    isActive ? styles.navBtnActive : ""
                  }`;
                  const inner = (
                    <>
                      <span className={styles.navIcon} aria-hidden="true">
                        <Icon name={item.icon} size={17} />
                      </span>
                      <span className={styles.navLabel}>{item.label}</span>
                      {item.badge && (
                        <span className={styles.navPillNew}>{item.badge}</span>
                      )}
                      {item.count && (
                        <span className={styles.navPillCount}>{item.count}</span>
                      )}
                    </>
                  );
                  return (
                    <li key={item.id}>
                      {item.href ? (
                        <Link href={item.href} className={className}>
                          {inner}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className={className}
                          onClick={() => setActiveNav(item.id)}
                        >
                          {inner}
                        </button>
                      )}
                    </li>
                  );
                })}
                <li>
                  <button
                    type="button"
                    className={styles.navBtn}
                    onClick={requestLogout}
                  >
                    <span className={styles.navIcon} aria-hidden="true">
                      <Icon name="logout" size={17} />
                    </span>
                    <span className={styles.navLabel}>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Need Help */}
            <section className={styles.helpCard}>
              <strong className={styles.helpTitle}>Need Help?</strong>
              <span className={styles.helpSub}>We&rsquo;re here for you!</span>
              <ul className={styles.helpList}>
                <li>
                  <a href="https://wa.me/919876543210" className={styles.helpItem}>
                    <span className={`${styles.helpIcon} ${styles.helpIconWa}`} aria-hidden="true">
                      <FaWhatsapp />
                    </span>
                    <span className={styles.helpText}>
                      <strong>WhatsApp Us</strong>
                      <span>+91 9986988786</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="mailto:official@decornart.in" className={styles.helpItem}>
                    <span className={styles.helpIcon} aria-hidden="true">
                      <FaEnvelope />
                    </span>
                    <span className={styles.helpText}>
                      <strong>Email Us</strong>
                      <span>official@decornart.in</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="tel:+919876543210" className={styles.helpItem}>
                    <span className={styles.helpIcon} aria-hidden="true">
                      <FaPhone />
                    </span>
                    <span className={styles.helpText}>
                      <strong>Call Us</strong>
                      <span>+91 9986988786 (10 AM – 7 PM)</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#chat" className={styles.helpItem}>
                    <span className={styles.helpIcon} aria-hidden="true">
                      <FaCommentDots />
                    </span>
                    <span className={styles.helpText}>
                      <strong>Chat With Us</strong>
                      <span>24/7 Customer Support</span>
                    </span>
                  </a>
                </li>
              </ul>
            </section>

            {/* Payment Methods */}
            <section className={styles.payCard}>
              <header className={styles.blockHead}>
                <h3 className={styles.blockTitle}>Payment Methods</h3>
                {/* <Link href="/account?tab=payments" className={styles.linkArrow}>
                  Manage <Icon name="arrow" size={14} />
                </Link> */}
              </header>
              <ul className={styles.payList}>
                {payments.slice(0, 3).map((p) => {
                  const logo = PAYMENT_LOGOS[(p.brand || "").toUpperCase()];
                  return (
                  <li key={p.id} className={styles.payRow}>
                    {logo ? (
                      <span className={styles.payBrandLogo} aria-label={logo.alt}>
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          height={22}
                          className={styles.payBrandLogoImg}
                        />
                      </span>
                    ) : (
                      <span className={`${styles.payBrand} ${brandClass(p)}`}>
                        {p.brand}
                      </span>
                    )}
                    <div className={styles.payBody}>
                      <strong>{p.type}</strong>
                      <span>{p.detail}</span>
                    </div>
                    {p.primary && (
                      <span className={styles.primaryChip}>Primary</span>
                    )}
                  </li>
                  );
                })}
              </ul>
              {/* <button type="button" className={styles.addPayBtn}>
                <Icon name="plus" size={14} /> Add New Payment Method
              </button> */}
            </section>
          </aside>

          {/* ─────────── RIGHT: main content ─────────── */}
          <div className={styles.main}>
            {/* Welcome + Rewards */}
            <section className={styles.welcomeRow}>
              <div className={styles.welcomeBox}>
                <h2 className={styles.welcomeTitle}>
                  Welcome back, {displayName}!{" "}
                  <span aria-hidden="true" className={styles.wave}>
                    <PiHandWavingFill />
                  </span>
                </h2>
                <p className={styles.welcomeSub}>
                  Here&rsquo;s what&rsquo;s happening with your account today.
                </p>
              </div>
              <div className={styles.rewardCard}>
                <span className={styles.rewardIcon} aria-hidden="true">
                  <FiAward size={30} />
                </span>
                <div className={styles.rewardBody}>
                  <span className={styles.rewardEyebrow}>DecorNArt Rewards</span>
                  <strong className={styles.rewardTier}>Gold Member</strong>
                  <span className={styles.rewardPoints}>1200 Points</span>
                </div>
                <span className={styles.rewardArrow} aria-hidden="true">
                  <Icon name="arrow" size={16} />
                </span>
              </div>
            </section>

            {activeNav === "dashboard" && (
            <>
            {/* Stats */}
            <section className={styles.statsGrid}>
              {stats.map((s) => (
                <div key={s.id} className={styles.statCard}>
                  <span className={styles.statIcon} aria-hidden="true">
                    <Icon name={s.icon} size={20} />
                  </span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statTitle}>{s.title}</span>
                  <span className={styles.statSub}>{s.sub}</span>
                </div>
              ))}
            </section>

            {/* Order-on-the-way + Refer */}
            <section className={styles.duoRow}>
              <div className={styles.trackCard}>
                <header className={styles.trackHead}>
                  <h3 className={styles.trackTitle}>
                    Your Order is on the way!{" "}
                    <span aria-hidden="true" className={styles.wave}>
                      <FiTruck />
                    </span>
                  </h3>
                  <Link href="/order" className={styles.linkArrow}>
                    View All Orders <Icon name="arrow" size={14} />
                  </Link>
                </header>
                <div className={styles.trackOrderRow}>
                  <div className={styles.trackMedia}>
                    <Image
                      src={
                        inTransitOrder?.items?.[0]
                          ? resolveProductImage({
                              slug: inTransitOrder.items[0].slug,
                              image: inTransitOrder.items[0].image,
                            })
                          : product1
                      }
                      alt={inTransitOrder?.items?.[0]?.name || "Order preview"}
                      fill
                      sizes="80px"
                      className={styles.trackImg}
                    />
                  </div>
                  <div className={styles.trackInfo}>
                    <strong>
                      {inTransitOrder?.items?.[0]?.name || "No active shipment"}
                    </strong>
                    <span>
                      Order ID:{" "}
                      {inTransitOrder?.orderNumber || "—"}
                    </span>
                    <span>
                      {inTransitOrder
                        ? `Placed on ${formatDate(inTransitOrder.createdAt)}`
                        : "You don't have any orders on the way."}
                    </span>
                  </div>
                  <div className={styles.trackStatus}>
                    <span className={styles.trackChip}>
                      {inTransitOrder ? titleCase(inTransitOrder.status) : "—"}
                    </span>
                    <span className={styles.trackEta}>
                      {inTransitOrder ? "Trackable soon" : ""}
                    </span>
                  </div>
                </div>
                <ol className={styles.trackSteps}>
                  {(() => {
                    // If we have a real in-transit order, mark all steps up to
                    // and including the current status as done, and highlight
                    // the current step.
                    const currentIdx = inTransitOrder
                      ? TRACK_PIPELINE.findIndex((p) => p.key === inTransitOrder.status)
                      : -1;
                    // When there's no in-transit order, render the pipeline
                    // with no dates and every step pending — never the
                    // hard-coded demo TRACK_STEPS (which shows fake 2024 dates).
                    const steps = inTransitOrder
                      ? TRACK_PIPELINE.map((p, idx) => ({
                          id: p.key,
                          label: p.label,
                          icon: p.icon,
                          date: idx === 0 ? formatDate(inTransitOrder.createdAt) : "—",
                          done: currentIdx > -1 && idx < currentIdx,
                          current: idx === currentIdx,
                        }))
                      : TRACK_PIPELINE.map((p) => ({
                          id: p.key,
                          label: p.label,
                          icon: p.icon,
                          date: "",
                          done: false,
                          current: false,
                        }));
                    return steps.map((step, i) => {
                      const state = step.current
                        ? styles.stepCurrent
                        : step.done
                          ? styles.stepDone
                          : styles.stepPending;
                      return (
                        <li key={step.id} className={`${styles.trackStep} ${state}`}>
                          {i < steps.length - 1 && (
                            <span
                              className={`${styles.stepConnector} ${
                                step.done ? styles.stepConnectorDone : ""
                              }`}
                              aria-hidden="true"
                            />
                          )}
                          <span className={styles.stepDot} aria-hidden="true">
                            <Icon name={step.icon} size={14} />
                          </span>
                          <span className={styles.stepLabel}>{step.label}</span>
                          <span className={styles.stepDate}>{step.date}</span>
                        </li>
                      );
                    });
                  })()}
                </ol>
                <Link href="/order" className={styles.trackBtn}>
                  Track Your Order
                </Link>
              </div>

              <div className={styles.referCard}>
                <div className={styles.referMedia} aria-hidden="true">
                  <Image
                    src={referImg}
                    alt=""
                    fill
                    sizes="240px"
                    className={styles.referImg}
                  />
                </div>
                <div className={styles.referBody}>
                  <strong className={styles.referTitle}>Refer &amp; Earn</strong>
                  <p className={styles.referCopy}>
                    Invite your friends and earn <strong>₹150 in DecorNArt Points</strong> when they place their first order!
                  </p>
                  <button type="button" className={styles.referBtn}>
                    Invite Now <Icon name="arrow" size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* Recent Orders + Saved Addresses */}
            <section className={styles.duoRow}>
              <div className={styles.ordersCard}>
                <header className={styles.blockHead}>
                  <h3 className={styles.blockTitle}>Recent Orders</h3>
                  <Link href="/order" className={styles.linkArrow}>
                    View All Orders <Icon name="arrow" size={14} />
                  </Link>
                </header>
                <ul className={styles.ordersList}>
                  {/* Show real orders when present. If the user is authed and
                      apiOrders came back empty, show a clean empty state
                      instead of the RECENT_ORDERS demo array so the dashboard
                      doesn't lie about non-existent orders. */}
                  {Array.isArray(apiOrders) && apiOrders.length === 0 ? (
                    <li className={styles.orderRow}>
                      <div className={styles.orderInfo}>
                        <strong>No orders yet</strong>
                        <span>Your orders will appear here once you place one.</span>
                        <Link href="/shop" className={styles.linkArrow}>
                          Start shopping <Icon name="arrow" size={14} />
                        </Link>
                      </div>
                    </li>
                  ) : (
                  (recentOrders || RECENT_ORDERS).map((o) => (
                    <li key={o.id} className={styles.orderRow}>
                      <div className={styles.orderMedia}>
                        {o.image && (
                          <Image
                            src={o.image}
                            alt={o.name}
                            fill
                            sizes="72px"
                            className={styles.orderImg}
                          />
                        )}
                      </div>
                      <div className={styles.orderInfo}>
                        <strong>{o.name}</strong>
                        <span>Order ID: {o.id}</span>
                        <span>
                          {o.date} <span aria-hidden="true">|</span> {o.items} Items
                        </span>
                      </div>
                      <div className={styles.orderRight}>
                        <div className={styles.orderTop}>
                          <span className={`${styles.orderStatus} ${styles[`tone_${o.tone}`]}`}>
                            {o.status}
                          </span>
                          <strong className={styles.orderAmount}>
                            {inr.format(o.amount)}
                          </strong>
                        </div>
                        <span className={styles.orderNote}>{o.statusNote}</span>
                      </div>
                    </li>
                  ))
                  )}
                </ul>
              </div>

              <div className={styles.addressCard}>
                <header className={styles.blockHead}>
                  <h3 className={styles.blockTitle}>Saved Addresses</h3>
                  <Link href="/account?tab=addresses" className={styles.linkArrow}>
                    View All Addresses <Icon name="arrow" size={14} />
                  </Link>
                </header>
                <ul className={styles.addressList}>
                  {addresses.map((a) => (
                    <li key={a.id} className={styles.addressRow}>
                      <span className={styles.addressIcon} aria-hidden="true">
                        <Icon name={a.icon || "pin"} size={18} />
                      </span>
                      <div className={styles.addressBody}>
                        <div className={styles.addressHead}>
                          <strong>{a.label}</strong>
                          {a.isDefault && (
                            <span className={styles.defaultChip}>Default</span>
                          )}
                        </div>
                        {a.lines.map((l, idx) => (
                          <span key={idx}>{l}</span>
                        ))}
                      </div>
                      <div className={styles.addressActions}>
                        <button
                          type="button"
                          aria-label={`Edit ${a.label}`}
                          onClick={() => openEditAddress(a)}
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${a.label}`}
                          onClick={() => deleteAddress(a.id)}
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {addrFormOpen && (
                  <form
                    className={styles.addrForm}
                    onSubmit={saveAddress}
                    aria-label={addrEditingId ? "Edit address" : "Add address"}
                  >
                    <h4 className={styles.addrFormTitle}>
                      {addrEditingId ? "Edit address" : "Add a new address"}
                    </h4>
                    <div className={styles.addrFieldRow}>
                      <label className={styles.addrField}>
                        <span>Label</span>
                        <input
                          type="text"
                          placeholder="Home, Office…"
                          value={addrDraft.label}
                          onChange={(e) =>
                            setAddrDraft((d) => ({ ...d, label: e.target.value }))
                          }
                          required
                        />
                      </label>
                      <label className={styles.addrField}>
                        <span>Phone</span>
                        <input
                          type="tel"
                          placeholder="+91 9986988786"
                          value={addrDraft.phone}
                          onChange={(e) =>
                            setAddrDraft((d) => ({ ...d, phone: e.target.value }))
                          }
                        />
                      </label>
                    </div>
                    <label className={styles.addrField}>
                      <span>Address line 1</span>
                      <input
                        type="text"
                        placeholder="Flat / House no, Street"
                        value={addrDraft.line1}
                        onChange={(e) =>
                          setAddrDraft((d) => ({ ...d, line1: e.target.value }))
                        }
                        required
                      />
                    </label>
                    <label className={styles.addrField}>
                      <span>Address line 2</span>
                      <input
                        type="text"
                        placeholder="Area, City, State – PIN"
                        value={addrDraft.line2}
                        onChange={(e) =>
                          setAddrDraft((d) => ({ ...d, line2: e.target.value }))
                        }
                      />
                    </label>
                    {addrError && (
                      <p role="alert" className={styles.addrFormError}>
                        {addrError}
                      </p>
                    )}
                    <div className={styles.addrFormActions}>
                      <button
                        type="button"
                        className={styles.addrCancelBtn}
                        onClick={cancelAddressForm}
                        disabled={addrSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={styles.addrSaveBtn}
                        disabled={addrSaving}
                      >
                        <Icon name="check" size={14} />{" "}
                        {addrSaving
                          ? "Saving…"
                          : addrEditingId
                            ? "Update Address"
                            : "Save Address"}
                      </button>
                    </div>
                  </form>
                )}

                {!addrFormOpen && (
                  <button
                    type="button"
                    className={styles.addAddrBtn}
                    onClick={openAddAddress}
                  >
                    <Icon name="plus" size={14} /> Add New Address
                  </button>
                )}
              </div>
            </section>

            {/* Wishlist + Creations */}
            <section className={styles.duoRow}>
              <div className={styles.wishCard}>
                <header className={styles.blockHead}>
                  <h3 className={styles.blockTitle}>My Wishlist</h3>
                  <Link href="/account?tab=wishlist" className={styles.linkArrow}>
                    View Wishlist <Icon name="arrow" size={14} />
                  </Link>
                </header>
                <ul className={styles.wishGrid}>
                  {(wishlistItems || WISHLIST).map((w) => (
                    <li key={w.id} className={styles.wishItem}>
                      <div className={styles.wishMedia}>
                        <Image
                          src={w.image}
                          alt={w.name}
                          fill
                          sizes="140px"
                          className={styles.wishImg}
                        />
                        <button
                          type="button"
                          className={styles.wishHeart}
                          aria-label={`Remove ${w.name} from wishlist`}
                          onClick={() => handleRemoveWishlist(w.id)}
                        >
                          <Icon name="heart" size={14} />
                        </button>
                      </div>
                      <strong className={styles.wishName}>{w.name}</strong>
                      <span className={styles.wishPrice}>{inr.format(w.price)}</span>
                      <button
                        type="button"
                        className={styles.wishBtn}
                        onClick={() => handleAddWishlistToCart(w.id)}
                        disabled={
                          !isAuthed ||
                          !wishlistItems ||
                          cartAdding.has(w.id) ||
                          cartAdded.has(w.id)
                        }
                      >
                        <Icon name="cart" size={13} />{" "}
                        {cartAdded.has(w.id)
                          ? "Added ✓"
                          : cartAdding.has(w.id)
                            ? "Adding…"
                            : "Add to Cart"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.creationsCard}>
                <header className={styles.blockHead}>
                  <h3 className={styles.blockTitle}>My Creations</h3>
                  <Link href="/account?tab=creations" className={styles.linkArrow}>
                    View All <Icon name="arrow" size={14} />
                  </Link>
                </header>
                <ul className={styles.creationsGrid}>
                  {CREATIONS.map((img, i) => (
                    <li key={i} className={styles.creationItem}>
                      <Image
                        src={img}
                        alt={`Creation ${i + 1}`}
                        fill
                        sizes="120px"
                        className={styles.creationImg}
                      />
                    </li>
                  ))}
                </ul>
                <button type="button" className={styles.uploadBtn}>
                  <FiUpload size={16} aria-hidden="true" />
                  Upload Your Creation
                </button>
              </div>
            </section>
            </>
            )}

            {activeNav === "addresses" && (
              <section className={styles.addrPanel} aria-label="Manage addresses">
                <header className={styles.addrPanelHead}>
                  <div>
                    <h3 className={styles.blockTitle}>My Addresses</h3>
                    <p className={styles.addrPanelSub}>
                      Manage where your orders are delivered.
                    </p>
                  </div>
                  {!addrFormOpen && (
                    <button
                      type="button"
                      className={styles.addrPanelBtn}
                      onClick={openAddAddress}
                    >
                      <Icon name="plus" size={14} /> Add New Address
                    </button>
                  )}
                </header>

                <ul className={styles.addrPanelGrid}>
                  {addresses.map((a) => (
                    <li key={a.id} className={styles.addrPanelCard}>
                      <div className={styles.addrPanelCardHead}>
                        <span
                          className={styles.addressIcon}
                          aria-hidden="true"
                        >
                          <Icon name={a.icon || "pin"} size={18} />
                        </span>
                        <div className={styles.addressHead}>
                          <strong>{a.label}</strong>
                          {a.isDefault && (
                            <span className={styles.defaultChip}>Default</span>
                          )}
                        </div>
                      </div>
                      <div className={styles.addrPanelBody}>
                        {a.lines.map((l, idx) => (
                          <span key={idx}>{l}</span>
                        ))}
                      </div>
                      <div className={styles.addrPanelActions}>
                        <button
                          type="button"
                          className={styles.addrEditBtn}
                          onClick={() => openEditAddress(a)}
                        >
                          <Icon name="edit" size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          className={styles.addrDeleteBtn}
                          onClick={() => deleteAddress(a.id)}
                        >
                          <Icon name="trash" size={14} /> Delete
                        </button>
                      </div>
                    </li>
                  ))}
                  {addresses.length === 0 && !addrFormOpen && (
                    <li className={styles.addrPanelEmpty}>
                      <Icon name="pin" size={22} />
                      <strong>No addresses saved yet</strong>
                      <span>
                        Add your first address to speed up checkout.
                      </span>
                      <button
                        type="button"
                        className={styles.addrPanelBtn}
                        onClick={openAddAddress}
                      >
                        <Icon name="plus" size={14} /> Add New Address
                      </button>
                    </li>
                  )}
                </ul>

                {addrFormOpen && (
                  <form
                    className={styles.addrForm}
                    onSubmit={saveAddress}
                    aria-label={addrEditingId ? "Edit address" : "Add address"}
                  >
                    <h4 className={styles.addrFormTitle}>
                      {addrEditingId ? "Edit address" : "Add a new address"}
                    </h4>
                    <div className={styles.addrFieldRow}>
                      <label className={styles.addrField}>
                        <span>Label</span>
                        <input
                          type="text"
                          placeholder="Home, Office…"
                          value={addrDraft.label}
                          onChange={(e) =>
                            setAddrDraft((d) => ({
                              ...d,
                              label: e.target.value,
                            }))
                          }
                          required
                        />
                      </label>
                      <label className={styles.addrField}>
                        <span>Phone</span>
                        <input
                          type="tel"
                          placeholder="+91 9986988786"
                          value={addrDraft.phone}
                          onChange={(e) =>
                            setAddrDraft((d) => ({
                              ...d,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </label>
                    </div>
                    <label className={styles.addrField}>
                      <span>Address line 1</span>
                      <input
                        type="text"
                        placeholder="Flat / House no, Street"
                        value={addrDraft.line1}
                        onChange={(e) =>
                          setAddrDraft((d) => ({
                            ...d,
                            line1: e.target.value,
                          }))
                        }
                        required
                      />
                    </label>
                    <label className={styles.addrField}>
                      <span>Address line 2</span>
                      <input
                        type="text"
                        placeholder="Area, City, State – PIN"
                        value={addrDraft.line2}
                        onChange={(e) =>
                          setAddrDraft((d) => ({
                            ...d,
                            line2: e.target.value,
                          }))
                        }
                      />
                    </label>
                    {addrError && (
                      <p role="alert" className={styles.addrFormError}>
                        {addrError}
                      </p>
                    )}
                    <div className={styles.addrFormActions}>
                      <button
                        type="button"
                        className={styles.addrCancelBtn}
                        onClick={cancelAddressForm}
                        disabled={addrSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={styles.addrSaveBtn}
                        disabled={addrSaving}
                      >
                        <Icon name="check" size={14} />{" "}
                        {addrSaving
                          ? "Saving…"
                          : addrEditingId
                            ? "Update Address"
                            : "Save Address"}
                      </button>
                    </div>
                  </form>
                )}
              </section>
            )}

            {activeNav === "details" && (
              <section className={styles.detailsPanel} aria-label="Account details">
                {/* ─── Profile card ─── */}
                <div className={styles.detailsCard}>
                  {/* Identity strip: big avatar + name/email */}
                  <div className={styles.detailsIdentity}>
                    <span className={styles.detailsAvatar} aria-hidden="true">
                      {initials}
                    </span>
                    <div className={styles.detailsIdentityCopy}>
                      <strong className={styles.detailsIdentityName}>
                        {user?.name || "Your account"}
                      </strong>
                      <span className={styles.detailsIdentityEmail}>
                        <Icon name="mail" size={13} /> {user?.email || "—"}
                      </span>
                    </div>
                    {!editingProfile && (
                      <button
                        type="button"
                        className={styles.detailsEditBtn}
                        onClick={beginEditProfile}
                        disabled={!isAuthed}
                      >
                        <Icon name="edit" size={14} /> Edit
                      </button>
                    )}
                  </div>

                  <div className={styles.detailsDivider} aria-hidden="true" />

                  <header className={styles.detailsSectionHead}>
                    <h3 className={styles.blockTitle}>Personal information</h3>
                    <p className={styles.detailsSub}>
                      Keep your contact details up to date for smoother orders.
                    </p>
                  </header>

                  {profileSaved && (
                    <p className={styles.detailsSuccess}>
                      <Icon name="check" size={13} /> Details saved
                    </p>
                  )}

                  {!editingProfile ? (
                    <ul className={styles.detailsRowList}>
                      <li className={styles.detailsRow}>
                        <span className={styles.detailsRowIcon} aria-hidden="true">
                          <Icon name="user" size={16} />
                        </span>
                        <div className={styles.detailsRowBody}>
                          <span className={styles.detailsRowLabel}>Full name</span>
                          <span className={styles.detailsRowValue}>
                            {user?.name || "—"}
                          </span>
                        </div>
                      </li>
                      <li className={styles.detailsRow}>
                        <span className={styles.detailsRowIcon} aria-hidden="true">
                          <Icon name="mail" size={16} />
                        </span>
                        <div className={styles.detailsRowBody}>
                          <span className={styles.detailsRowLabel}>Email address</span>
                          <span className={styles.detailsRowValue}>
                            {user?.email || "—"}
                          </span>
                        </div>
                      </li>
                      <li className={styles.detailsRow}>
                        <span className={styles.detailsRowIcon} aria-hidden="true">
                          <Icon name="phone" size={16} />
                        </span>
                        <div className={styles.detailsRowBody}>
                          <span className={styles.detailsRowLabel}>Phone</span>
                          <span className={styles.detailsRowValue}>
                            {user?.phone || <em className={styles.detailsMuted}>Not added yet</em>}
                          </span>
                        </div>
                      </li>
                      <li className={styles.detailsRow}>
                        <span className={styles.detailsRowIcon} aria-hidden="true">
                          <Icon name="lock" size={16} />
                        </span>
                        <div className={styles.detailsRowBody}>
                          <span className={styles.detailsRowLabel}>Password</span>
                          <span className={`${styles.detailsRowValue} ${styles.detailsMono}`}>
                            ••••••••••
                          </span>
                        </div>
                      </li>
                    </ul>
                  ) : (
                    <form className={styles.detailsForm} onSubmit={saveProfile}>
                      <label className={styles.detailsField}>
                        <span>
                          <Icon name="user" size={13} /> Full name
                        </span>
                        <input
                          type="text"
                          value={profileDraft.name}
                          onChange={(e) =>
                            setProfileDraft((d) => ({ ...d, name: e.target.value }))
                          }
                          required
                          maxLength={120}
                          placeholder="Your full name"
                        />
                      </label>
                      <label className={styles.detailsField}>
                        <span>
                          <Icon name="mail" size={13} /> Email address
                        </span>
                        <input
                          type="email"
                          value={profileDraft.email}
                          onChange={(e) =>
                            setProfileDraft((d) => ({ ...d, email: e.target.value }))
                          }
                          required
                          placeholder="you@example.com"
                        />
                      </label>
                      <label className={styles.detailsField}>
                        <span>
                          <Icon name="phone" size={13} /> Phone
                          <em className={styles.detailsOptional}> · optional</em>
                        </span>
                        <input
                          type="tel"
                          value={profileDraft.phone}
                          onChange={(e) =>
                            setProfileDraft((d) => ({ ...d, phone: e.target.value }))
                          }
                          maxLength={20}
                          placeholder="+91 9986988786"
                        />
                      </label>

                      {profileError && (
                        <p role="alert" className={styles.detailsError}>
                          {profileError}
                        </p>
                      )}

                      <div className={styles.detailsActions}>
                        <button
                          type="button"
                          className={styles.addrCancelBtn}
                          onClick={cancelEditProfile}
                          disabled={profileSaving}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={styles.addrSaveBtn}
                          disabled={profileSaving}
                        >
                          <Icon name="check" size={14} />{" "}
                          {profileSaving ? "Saving…" : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* ─── Password card ─── */}
                <div className={styles.detailsCard}>
                  <header className={styles.detailsSectionHead}>
                    <div className={styles.detailsSectionHeadRow}>
                      <span className={styles.detailsSectionIcon} aria-hidden="true">
                        <Icon name="lock" size={16} />
                      </span>
                      <h3 className={styles.blockTitle}>Change Password</h3>
                    </div>
                    <p className={styles.detailsSub}>
                      Set a new password. All other sessions will be signed
                      out automatically.
                    </p>
                  </header>

                  {pwdSaved && (
                    <p className={styles.detailsSuccess}>
                      <Icon name="check" size={13} /> Password updated
                    </p>
                  )}

                  <form className={styles.detailsForm} onSubmit={savePassword}>
                    {[
                      {
                        key: "current",
                        stateKey: "currentPassword",
                        label: "Current password",
                        autoComplete: "current-password",
                        minLength: 1,
                      },
                      {
                        key: "next",
                        stateKey: "newPassword",
                        label: "New password",
                        autoComplete: "new-password",
                        minLength: 8,
                        hint: "At least 8 characters",
                      },
                      {
                        key: "confirm",
                        stateKey: "confirmPassword",
                        label: "Confirm new password",
                        autoComplete: "new-password",
                        minLength: 8,
                      },
                    ].map((f) => (
                      <label
                        key={f.key}
                        className={`${styles.detailsField} ${styles.detailsPwdField}`}
                      >
                        <span>
                          <Icon name="lock" size={13} /> {f.label}
                          {f.hint && (
                            <em className={styles.detailsOptional}> · {f.hint}</em>
                          )}
                        </span>
                        <div className={styles.detailsPwdInputWrap}>
                          <input
                            type={pwdShow[f.key] ? "text" : "password"}
                            value={pwdDraft[f.stateKey]}
                            onChange={(e) =>
                              setPwdDraft((d) => ({
                                ...d,
                                [f.stateKey]: e.target.value,
                              }))
                            }
                            required
                            minLength={f.minLength}
                            autoComplete={f.autoComplete}
                          />
                          <button
                            type="button"
                            className={styles.detailsPwdToggle}
                            onClick={() => togglePwdShow(f.key)}
                            aria-label={
                              pwdShow[f.key] ? "Hide password" : "Show password"
                            }
                          >
                            <Icon name={pwdShow[f.key] ? "eyeOff" : "eye"} size={16} />
                          </button>
                        </div>
                      </label>
                    ))}

                    {pwdError && (
                      <p role="alert" className={styles.detailsError}>
                        {pwdError}
                      </p>
                    )}

                    <div className={styles.detailsActions}>
                      <button
                        type="submit"
                        className={styles.addrSaveBtn}
                        disabled={pwdSaving || !isAuthed}
                      >
                        <Icon name="check" size={14} />{" "}
                        {pwdSaving ? "Updating…" : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )}

            {activeNav === "payments" && (
              <section className={styles.addrPanel} aria-label="Payment methods">
                <header className={styles.addrPanelHead}>
                  <div>
                    <h3 className={styles.blockTitle}>Payment Methods</h3>
                    <p className={styles.addrPanelSub}>
                      Save a UPI ID or card so checkout takes a single tap.
                    </p>
                  </div>
                  {!payFormOpen && (
                    <button
                      type="button"
                      className={styles.addrPanelBtn}
                      onClick={openAddPayment}
                    >
                      <Icon name="plus" size={14} /> Add New Method
                    </button>
                  )}
                </header>

                <ul className={styles.addrPanelGrid}>
                  {payments.map((p) => {
                    const logo = PAYMENT_LOGOS[(p.brand || "").toUpperCase()];
                    return (
                    <li key={p.id} className={styles.addrPanelCard}>
                      <div className={styles.addrPanelCardHead}>
                        {logo ? (
                          <span className={styles.payBrandLogo} aria-label={logo.alt}>
                            <Image
                              src={logo.src}
                              alt={logo.alt}
                              height={26}
                              className={styles.payBrandLogoImg}
                            />
                          </span>
                        ) : (
                          <span
                            className={`${styles.payBrand} ${brandClass(p)}`}
                            aria-hidden="true"
                          >
                            {p.brand}
                          </span>
                        )}
                        <div className={styles.addressHead}>
                          <strong>{p.type}</strong>
                          {p.primary && (
                            <span className={styles.primaryChip}>Primary</span>
                          )}
                        </div>
                      </div>
                      <div className={styles.addrPanelBody}>
                        <span>{p.detail}</span>
                      </div>
                      <div className={styles.addrPanelActions}>
                        {!p.primary && (
                          <button
                            type="button"
                            className={styles.addrEditBtn}
                            onClick={() => makePrimaryPayment(p.id)}
                          >
                            <Icon name="check" size={14} /> Make Primary
                          </button>
                        )}
                        <button
                          type="button"
                          className={styles.addrDeleteBtn}
                          onClick={() => deletePayment(p.id)}
                        >
                          <Icon name="trash" size={14} /> Delete
                        </button>
                      </div>
                    </li>
                    );
                  })}
                  {payments.length === 0 && !payFormOpen && (
                    <li className={styles.addrPanelEmpty}>
                      <Icon name="card" size={22} />
                      <strong>No payment methods saved</strong>
                      <span>
                        Add a UPI or card to skip typing details at checkout.
                      </span>
                      <button
                        type="button"
                        className={styles.addrPanelBtn}
                        onClick={openAddPayment}
                      >
                        <Icon name="plus" size={14} /> Add New Method
                      </button>
                    </li>
                  )}
                </ul>

                {payFormOpen && (
                  <form
                    className={styles.addrForm}
                    onSubmit={savePayment}
                    aria-label="Add payment method"
                  >
                    <h4 className={styles.addrFormTitle}>
                      Add a new payment method
                    </h4>

                    <div
                      className={styles.payKindToggle}
                      role="radiogroup"
                      aria-label="Method type"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={payKind === "upi"}
                        className={`${styles.payKindBtn} ${
                          payKind === "upi" ? styles.payKindBtnActive : ""
                        }`}
                        onClick={() => setPayKind("upi")}
                      >
                        UPI
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={payKind === "card"}
                        className={`${styles.payKindBtn} ${
                          payKind === "card" ? styles.payKindBtnActive : ""
                        }`}
                        onClick={() => setPayKind("card")}
                      >
                        Debit / Credit card
                      </button>
                    </div>

                    {payKind === "upi" ? (
                      <label className={styles.addrField}>
                        <span>UPI ID</span>
                        <input
                          type="text"
                          placeholder="yourname@bank"
                          value={payDraft.upiId}
                          onChange={(e) =>
                            setPayDraft((d) => ({ ...d, upiId: e.target.value }))
                          }
                          required
                        />
                      </label>
                    ) : (
                      <>
                        <label className={styles.addrField}>
                          <span>Card number</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="1234 5678 9012 3456"
                            value={payDraft.cardNumber}
                            onChange={(e) =>
                              setPayDraft((d) => ({
                                ...d,
                                cardNumber: e.target.value,
                              }))
                            }
                            maxLength={19}
                            required
                          />
                        </label>
                        <div className={styles.addrFieldRow}>
                          <label className={styles.addrField}>
                            <span>Cardholder name</span>
                            <input
                              type="text"
                              placeholder="Full name on card"
                              value={payDraft.cardHolder}
                              onChange={(e) =>
                                setPayDraft((d) => ({
                                  ...d,
                                  cardHolder: e.target.value,
                                }))
                              }
                              required
                            />
                          </label>
                          <label className={styles.addrField}>
                            <span>Expiry (MM/YY)</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="MM/YY"
                              value={payDraft.cardExpiry}
                              onChange={(e) =>
                                setPayDraft((d) => ({
                                  ...d,
                                  cardExpiry: e.target.value,
                                }))
                              }
                              maxLength={5}
                              required
                            />
                          </label>
                        </div>
                      </>
                    )}

                    <label className={styles.payPrimaryToggle}>
                      <input
                        type="checkbox"
                        checked={payDraft.primary}
                        onChange={(e) =>
                          setPayDraft((d) => ({
                            ...d,
                            primary: e.target.checked,
                          }))
                        }
                      />
                      <span>Mark as primary payment method</span>
                    </label>

                    {payError && (
                      <p role="alert" className={styles.addrFormError}>
                        {payError}
                      </p>
                    )}

                    <p className={styles.payNote}>
                      Card details are stored on this device only for a
                      quicker checkout — DecorNArt never sees your CVV.
                    </p>

                    <div className={styles.addrFormActions}>
                      <button
                        type="button"
                        className={styles.addrCancelBtn}
                        onClick={cancelPaymentForm}
                      >
                        Cancel
                      </button>
                      <button type="submit" className={styles.addrSaveBtn}>
                        <Icon name="check" size={14} /> Save Method
                      </button>
                    </div>
                  </form>
                )}
              </section>
            )}

            {activeNav === "creations" && (
              <section className={styles.addrPanel} aria-label="My creations">
                <header className={styles.addrPanelHead}>
                  <div>
                    <h3 className={styles.blockTitle}>My Creations</h3>
                    <p className={styles.addrPanelSub}>
                      Reels and unboxing clips you&rsquo;ve shared with the DecorNArt community.
                    </p>
                  </div>
                  <button type="button" className={styles.addrPanelBtn}>
                    <FiUpload size={14} /> Upload Reel
                  </button>
                </header>

                <ul className={styles.reelsGrid}>
                  {CREATION_REELS.map((r) => (
                    <li key={r.id} className={styles.reelCard}>
                      <button
                        type="button"
                        className={styles.reelBtn}
                        onClick={() => setOpenReel(r)}
                        aria-label={`Play ${r.title}`}
                      >
                        <Image
                          src={r.poster}
                          alt={r.title}
                          fill
                          sizes="(max-width: 720px) 45vw, 22vw"
                          className={styles.reelImg}
                        />
                        <span className={styles.reelShade} aria-hidden="true" />
                        <span className={styles.reelPlay} aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M8 5v14l11-7z" fill="currentColor" />
                          </svg>
                        </span>
                        <span className={styles.reelDuration} aria-hidden="true">
                          {r.duration}
                        </span>
                        <span className={styles.reelTitle}>{r.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* ─────────── Quick Links strip ─────────── */}
        <section className={styles.quickLinks}>
          <ul className={styles.quickList}>
            {QUICK_LINKS.map((q) => (
              <li key={q.id} className={styles.quickItem}>
                <Link href={q.href} className={styles.quickLink}>
                  <span className={styles.quickIcon} aria-hidden="true">
                    <Icon name={q.icon} size={18} />
                  </span>
                  <span className={styles.quickText}>
                    <strong>{q.title}</strong>
                    <span>{q.sub}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ─────────── Bottom trust strip ─────────── */}
        <section className={styles.bottomTrust}>
          <ul className={styles.bottomTrustList}>
            {BOTTOM_TRUST.map((t) => (
              <li key={t.id} className={styles.trustRow}>
                <span className={styles.trustIcon} aria-hidden="true">
                  <Icon name={t.icon} size={22} />
                </span>
                <span className={styles.trustText}>
                  <strong>{t.title}</strong>
                  <span>{t.copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {openReel && (
        <div
          className={styles.reelModalBackdrop}
          role="presentation"
          onClick={() => setOpenReel(null)}
        >
          <div
            className={styles.reelModal}
            role="dialog"
            aria-modal="true"
            aria-label={openReel.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.reelModalClose}
              onClick={() => setOpenReel(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className={styles.reelModalMedia}>
              {openReel.videoUrl ? (
                <video
                  src={openReel.videoUrl}
                  poster={
                    typeof openReel.poster === "string"
                      ? openReel.poster
                      : openReel.poster?.src
                  }
                  controls
                  autoPlay
                  playsInline
                  className={styles.reelModalVideo}
                />
              ) : (
                <>
                  <Image
                    src={openReel.poster}
                    alt={openReel.title}
                    fill
                    sizes="(max-width: 720px) 90vw, 480px"
                    className={styles.reelModalPoster}
                  />
                  <span className={styles.reelModalHint}>
                    Video coming soon
                  </span>
                </>
              )}
            </div>
            <div className={styles.reelModalMeta}>
              <strong>{openReel.title}</strong>
              <span>{openReel.duration}</span>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div
          className={styles.logoutModalBackdrop}
          role="presentation"
          onClick={loggingOut ? undefined : cancelLogout}
        >
          <div
            className={styles.logoutModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.logoutModalIcon} aria-hidden="true">
              <Icon name="logout" size={22} />
            </span>
            <h3 id="logout-modal-title" className={styles.logoutModalTitle}>
              Do you really want to logout?
            </h3>
            <p id="logout-modal-desc" className={styles.logoutModalCopy}>
              You&rsquo;ll need to sign in again to access your orders,
              wishlist and saved addresses.
            </p>
            <div className={styles.logoutModalActions}>
              <button
                type="button"
                className={styles.logoutModalCancel}
                onClick={cancelLogout}
                disabled={loggingOut}
              >
                Stay signed in
              </button>
              <button
                type="button"
                className={styles.logoutModalConfirm}
                onClick={confirmLogout}
                disabled={loggingOut}
                autoFocus
              >
                {loggingOut ? "Signing out…" : "Yes, logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
