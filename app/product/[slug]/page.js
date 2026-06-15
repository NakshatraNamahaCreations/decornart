import ProductPageClient from "./ProductPageClient";

export const metadata = {
  title: "Product — Decornart Atelier",
  description:
    "Hand-tied bouquets composed by the Decornart atelier — same-day delivery in Mumbai, Bengaluru, Delhi & Pune.",
};

export default function ProductPage({ params }) {
  return <ProductPageClient slug={params.slug} />;
}
