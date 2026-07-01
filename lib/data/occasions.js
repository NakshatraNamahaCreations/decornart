// Re-purposed from "occasions" to "use cases" — each entry now represents
// the kind of project our materials get used for. Shape (id/label/blurb/products[])
// is unchanged so the homepage section (ShopByOccasion) and the
// /occasion/[slug] dynamic route keep rendering without code changes.
import basket from "@/assets/basket.png";
import giftCards from "@/assets/collect-1.png";
import ribbons from "@/assets/collect-3.png";
import wrapping from "@/assets/collect-4.png";
import plants from "@/assets/homedecor.png";
import crochet from "@/assets/cat2.jpg";
import craft from "@/assets/cat3.jpg";
import raw from "@/assets/raw-materials.png";
import pipeCleaners from "@/assets/collect-2.png";

export const occasions = [
  {
    id: "floral-arrangements",
    label: "Floral Arrangements",
    blurb: "Baskets, foam, tape and stems for build-your-own bouquets.",
    products: [
      { id: "fa-1", title: "Wicker Basket — Medium", price: 549, image: basket },
      { id: "fa-2", title: "Florist Foam Brick", price: 149, image: raw },
      { id: "fa-3", title: "Satin Ribbon Spool", price: 199, image: ribbons },
      { id: "fa-4", title: "Faux Filler Greens", price: 299, image: plants },
    ],
  },
  {
    id: "gift-wrapping",
    label: "Gift Wrapping",
    blurb: "Sheets, cards, tags and ribbons for hand-finished presentation.",
    products: [
      { id: "gw-1", title: "Kraft Wrapping Roll", price: 249, image: wrapping },
      { id: "gw-2", title: "Folded Gift Cards (Set of 6)", price: 179, image: giftCards },
      { id: "gw-3", title: "Organza Ribbon — Blush", price: 169, image: ribbons },
      { id: "gw-4", title: "Tissue Paper — Pastel Mix", price: 129, image: wrapping },
    ],
  },
  {
    id: "home-office-decor",
    label: "Home & Office Decor",
    blurb: "Artificial plants and planters that style any room or desk.",
    products: [
      { id: "hd-1", title: "Faux Peony Stems", price: 449, image: plants },
      { id: "hd-2", title: "Ceramic Tabletop Planter", price: 699, image: plants },
      { id: "hd-3", title: "Trailing Pothos Spray", price: 379, image: plants },
      { id: "hd-4", title: "Stoneware Pot — Small", price: 549, image: basket },
    ],
  },
  {
    id: "crochet-projects",
    label: "Crochet Projects",
    blurb: "Yarn, hooks and craft essentials for the things you'll keep making.",
    products: [
      { id: "cp-1", title: "Cotton Yarn — Pastel Set", price: 599, image: crochet },
      { id: "cp-2", title: "Aluminium Hook Set (8pc)", price: 349, image: craft },
      { id: "cp-3", title: "Pipe Cleaners — 50pc", price: 149, image: pipeCleaners },
      { id: "cp-4", title: "Craft Glue & Tape Kit", price: 229, image: craft },
    ],
  },
];

export default occasions;
