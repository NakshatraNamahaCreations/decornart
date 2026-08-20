// Shared feature-badge icon library used by the product page. Each entry
// is a compact key → icon component map so an admin can pick from a preset
// list (see admin ProductForm's Feature badges section) and the storefront
// looks up the same key to render the glyph. Keep the two projects'
// icon sets in sync: decornart-admin/lib/featureIcons.js mirrors this.

import {
  FiFeather,
  FiRefreshCw,
  FiDroplet,
  FiShield,
  FiStar,
  FiHeart,
  FiTool,
  FiRotateCcw,
  FiUmbrella,
  FiWind,
  FiGift,
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

export const FEATURE_ICONS = {
  soft:        { label: "Soft / Fluffy",           svg: <FiFeather aria-hidden="true" /> },
  bend:        { label: "Flexible / Bendable",     svg: <FiRefreshCw aria-hidden="true" /> },
  colors:      { label: "Vibrant colours",         svg: <FiDroplet aria-hidden="true" /> },
  safe:        { label: "Kid safe / Non-toxic",    svg: <FiShield aria-hidden="true" /> },
  premium:     { label: "Premium quality",         svg: <FiStar aria-hidden="true" /> },
  eco:         { label: "Eco / Sustainable",       svg: <FaLeaf aria-hidden="true" /> },
  beautiful:    { label: "beautiful / Curated",      svg: <FiHeart aria-hidden="true" /> },
  durable:     { label: "Durable / Long-lasting",  svg: <FiTool aria-hidden="true" /> },
  reusable:    { label: "Reusable / Recyclable",   svg: <FiRotateCcw aria-hidden="true" /> },
  washable:    { label: "Washable / Waterproof",   svg: <FiUmbrella aria-hidden="true" /> },
  lightweight: { label: "Lightweight",             svg: <FiWind aria-hidden="true" /> },
  giftReady:   { label: "Gift-ready",              svg: <FiGift aria-hidden="true" /> },
};

export const FEATURE_ICON_KEYS = Object.keys(FEATURE_ICONS);

export function renderFeatureIcon(key) {
  const entry = FEATURE_ICONS[key];
  return entry ? entry.svg : null;
}
