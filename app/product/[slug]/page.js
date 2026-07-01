import { products } from "@/lib/data/products";
import ProductPageClient from "./ProductPageClient";

export const metadata = {
  title: "Product — Decor N Art Atelier",
  description:
    "Hand-tied bouquets composed by the Decor N Art atelier — same-day delivery in Mumbai, Bengaluru, Delhi & Pune.",
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }) {
  return <ProductPageClient slug={params.slug} />;
}
