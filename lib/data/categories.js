// Homepage Featured Collections tiles — our main craft material categories.
// Re-using existing /assets for now; swap in dedicated category shots when the
// photography is ready (keep the same shape).
import basket from "@/assets/for-you-bouquet/for-you4.jpeg";
import giftCards from "@/assets/gift-card.jpeg";
import giftbox from "@/assets/gift-box.jpeg";
import craftEssentials from "@/assets/craft.png";
import crochet from "@/assets/crochet.png";
import pipecleaners from "@/assets/pipe-cleaners.png";
import ribbons from "@/assets/ribbons.png";
import wrapping from "@/assets/wrapper.png";
import plants from "@/assets/homedecor.png";

export const categories = [
  {
    id: "flower-boxes-bags",
    name: "Flower Boxes & Bags",
    note: "Baskets, boxes & florist foam",
    image: basket,
  },
  {
    id: "gift-cards",
    name: "Gift Cards",
    note: "Folded cards & tag essentials",
    image: giftCards,
  },
  {
    id: "pipe-cleaners",
    name: "Pipe Cleaners",
    note: "Chenille stems — every colour",
    image: pipecleaners
  },
  {
    id: "craft-essentials",
    name: "Craft Essentials",
    note: "Glue, scissors, tape & tools",
    image: craftEssentials,
  },
  {
    id: "crochet-materials",
    name: "Crochet Materials",
    note: "Yarn, cotton, hooks & notions",
    image: crochet,
  },
  {
    id: "ribbons",
    name: "Ribbons",
    note: "Satin, organza & jute spools",
    image: ribbons,
  },
  {
    id: "wrapping-papers",
    name: "Wrapping Sheets & Papers",
    note: "Kraft, tissue & printed sheets",
    image: wrapping,
  },
];
