// Shared color-name → hex map used by the storefront wherever a color
// picked in the admin panel needs to render as a visible swatch (product
// page selector, cart line, order summary, etc.). Keep in sync with the
// admin's PRESET_COLOR_SWATCHES list. Custom colors not in this map fall
// back to `FALLBACK_HEX` so the UI never crashes on a missing key.
export const COLOR_HEX = {
  // Reds
  "Rose Red": "#c93848",
  "Blood Red": "#7a0d0d",
  "Wine Red": "#5c1a2b",
  "Cherry Red": "#e63946",
  "Coral Red": "#ff6b6b",
  Maroon: "#800000",
  Crimson: "#dc143c",

  // Purples
  Purple: "#7a3fbf",
  "Dark Purple": "#3f1d5c",
  Violet: "#8f00ff",
  Magenta: "#ff00ff",
  Plum: "#8e4585",
  Mauve: "#b784a7",
  Orchid: "#da70d6",

  // Pinks
  Pink: "#ff8fb4",
  "Dark Pink": "#d94f8a",
  "Hot Pink": "#ff69b4",
  Fuchsia: "#ff1493",
  "Salmon Pink": "#ff91a4",
  "Rose Pink": "#ffb6c1",
  "Blush Pink": "#f4c2c2",

  // Peach / Coral
  Peach: "#ffbfa0",
  "Peach Pink": "#ffb0b0",
  Coral: "#ff7f50",
  Apricot: "#fbceb1",
  Salmon: "#fa8072",

  // Yellows / Golds
  "Lemon Yellow": "#fff275",
  "Pumpkin Yellow": "#f5b800",
  "Mustard Yellow": "#e1ad01",
  "Golden Yellow": "#ffd700",
  Gold: "#d4af37",
  Cream: "#fffdd0",
  Ivory: "#fffff0",
  Champagne: "#f7e7ce",

  // Oranges
  Orange: "#ff8324",
  "Dark Orange": "#cc5500",
  "Burnt Orange": "#cc5500",
  Tangerine: "#f28500",
  Rust: "#b7410e",
  Terracotta: "#e2725b",

  // Greens
  "Olive Green": "#7d8a2e",
  "Dark Green": "#1f5c2b",
  "Army Green": "#4b5320",
  "Fluorescent Green": "#39ff14",
  "Emerald Green": "#50c878",
  "Forest Green": "#228b22",
  "Sage Green": "#9caf88",
  "Mint Green": "#98ff98",
  "Lime Green": "#bfff00",
  Teal: "#008080",

  // Blues
  "Royal Blue": "#1d3fc0",
  "Ice Blue": "#bfe4ee",
  "Lake Blue": "#2a7d9b",
  "Navy Blue": "#000080",
  "Sky Blue": "#87ceeb",
  Turquoise: "#40e0d0",
  Cyan: "#00ffff",
  Aqua: "#7fdbda",
  "Cobalt Blue": "#0047ab",
  "Denim Blue": "#1560bd",

  // Purples / Lavenders
  Lavender: "#c8a2d8",
  Indigo: "#4b0082",
  Periwinkle: "#ccccff",

  // Browns / Neutrals
  "Light Brown": "#b98c5b",
  "Dark Brown": "#4a2b1c",
  "Chocolate Brown": "#7b3f00",
  Tan: "#d2b48c",
  Camel: "#c19a6b",
  Beige: "#e6d3b3",
  Nude: "#e3bc9a",
  Khaki: "#c3b091",

  // Greys / Blacks / Whites
  "Light Grey": "#c9c9c9",
  "Dark Grey": "#5a5a5a",
  Charcoal: "#36454f",
  Silver: "#c0c0c0",
  Black: "#111111",
  White: "#ffffff",
  "Off White": "#faf9f6",

  // Crochet cotton yarn shade card (supplier-named).
  "Pure white": "#ffffff",
  "Milky white": "#f5f1e7",
  "Rice noodles": "#eee6ce",
  "Apricot color": "#f1be8b",
  "Chestnut brown": "#a94a15",
  "Dark Khaki": "#9c8968",
  "Champagne color": "#ead9bc",
  Turmeric: "#e5af16",
  "Turmeric Yellow": "#e5af16",
  "Champagne gold": "#e8d3b3",
  Gray: "#bfbfbf",
  "Dark gray": "#6a6a6a",
  "Light blue": "#b7d3e5",
  "Mist Blue": "#9dbfdd",
  "Sapphire blue": "#113f92",
  "Light purple": "#cfb5e4",
  "Skin powder": "#f0c9be",
  "Deep Purple": "#661793",
  "Bright Purple": "#b92cba",
  "Rich Purple": "#722798",
  Red: "#c11313",
  "Bright Red": "#d2101f",
  "Wine red": "#5a1b1e",
  "Coral Pink": "#e97781",
  "Rouge Powder": "#e7a8bb",
  Powder: "#f5c0ce",
  "Powder Pink": "#f5c0ce",
  "Rubber Red": "#b92224",
  "Peach powder": "#f2c1af",
  "Emerald green": "#167b3b",
  "Kong Green": "#4a6221",
  "Matcha green": "#a6c088",
  "Bean Green": "#93af66",
  "Grass Green": "#7ab829",
  "Dark green": "#0e4a26",
  Green: "#1e8a3b",
  "Kong Lan": "#7da69c",
  "Bright Blue": "#1961af",
  "Dark Coffee": "#3a2418",
  "Dark Coffee Brown": "#3a2418",
  "Forest Green": "#228b22",

  // Pastels
  "Pastel Pink": "#ffd1dc",
  "Pastel Rose": "#ffc0cb",
  "Pastel Peach": "#ffdab9",
  "Pastel Coral": "#ffb6a3",
  "Pastel Yellow": "#fdfd96",
  "Pastel Cream": "#fff5cd",
  "Pastel Orange": "#ffcc99",
  "Pastel Green": "#c1e1c1",
  "Pastel Mint": "#aaf0d1",
  "Pastel Sage": "#cddabf",
  "Pastel Blue": "#aec6cf",
  "Pastel Sky": "#bde0fe",
  "Pastel Aqua": "#b2f7ef",
  "Pastel Turquoise": "#afeeee",
  "Pastel Purple": "#b39eb5",
  "Pastel Lavender": "#dcd0ff",
  "Pastel Lilac": "#c8a2c8",
  "Pastel Violet": "#cfbfe6",
  "Pastel Mauve": "#e0b0c0",
  "Pastel Brown": "#d6b8a1",
  "Pastel Beige": "#f5e6d3",
  "Pastel Grey": "#d3d3d3",
};

export const FALLBACK_HEX = "#c9c9c9";

// Case-insensitive mirror of COLOR_HEX so admin-typed names like
// "Chestnut Brown" still resolve when the map has "Chestnut brown".
// Built once at module load — the map itself is static.
const COLOR_HEX_CI = Object.fromEntries(
  Object.entries(COLOR_HEX).map(([k, v]) => [k.toLowerCase(), v])
);

function lookupInMap(name) {
  if (!name) return null;
  if (COLOR_HEX[name]) return COLOR_HEX[name];
  return COLOR_HEX_CI[name.toLowerCase()] || null;
}

export function hexForColor(name) {
  return lookupInMap(name) || FALLBACK_HEX;
}

/**
 * Same as hexForColor but consults the product's per-color overrides
 * (product.colorSwatches) before falling back to the static COLOR_HEX
 * map. Both the overrides and the static map are matched case-
 * insensitively so admins don't have to worry about capitalisation.
 */
export function hexForColorWithOverrides(name, overrides) {
  if (!name) return FALLBACK_HEX;
  const key = name.toLowerCase();
  if (Array.isArray(overrides)) {
    const hit = overrides.find(
      (o) => o && o.color && o.color.toLowerCase() === key && o.hex
    );
    if (hit) return hit.hex;
  } else if (overrides && typeof overrides === "object") {
    // Direct hit first, then a case-insensitive scan of the object.
    if (overrides[name]) return overrides[name];
    for (const k of Object.keys(overrides)) {
      if (k.toLowerCase() === key && overrides[k]) return overrides[k];
    }
  }
  return lookupInMap(name) || FALLBACK_HEX;
}
