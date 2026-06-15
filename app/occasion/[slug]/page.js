import { notFound } from "next/navigation";
import { occasions } from "@/lib/data/occasions";
import OccasionView from "@/components/OccasionView/OccasionView";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.id }));
}

export function generateMetadata({ params }) {
  const occasion = occasions.find((o) => o.id === params.slug);
  if (!occasion) return { title: "Not found — Decornart" };
  return {
    title: `${occasion.title} bouquets — Decornart Atelier`,
    description: `Hand-tied bouquets for ${occasion.title.toLowerCase()} — ${occasion.copy}`,
  };
}

async function fetchOccasionProducts(occasionId) {
  try {
    const url = `${API_BASE}/products?occasion=${encodeURIComponent(occasionId)}&limit=60`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function OccasionPage({ params }) {
  const occasion = occasions.find((o) => o.id === params.slug);
  if (!occasion) notFound();

  const matches = await fetchOccasionProducts(occasion.id);

  return <OccasionView occasion={occasion} products={matches} />;
}
