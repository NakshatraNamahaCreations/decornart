import pipecleaners from "@/assets/pipecleaners.png";
import basket from "@/assets/promobg1.png";

export const promoBanners = [
  {
    id: "pipe-cleaners-collection",
    variant: "wide",
    eyebrow: "50+ Colors Available",
    title: "Pipe Cleaners Collection",
    features: [
      "6MM & 8MM available | 30 cm length each",
      "Soft & fluffy texture",
    ],
    cta: { label: "Shop all colors", href: "/category/pipe-cleaners" },
    image: pipecleaners,
    imageAlt: "Fanned bundles of coloured pipe cleaners",
  },
  {
    id: "bulk-wholesale",
    variant: "narrow",
    eyebrow: "Bulk Orders & Wholesale",
    title: "Special Prices for Bulk Buyers",
    description: "Best quality materials at best possible prices.",
    cta: { label: "Enquire now", href: "/wholesale" },
    image: basket,
    imageAlt: "Basket of assorted flowers for wholesale enquiries",
  },
];

export default promoBanners;
