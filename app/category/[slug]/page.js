import { notFound } from "next/navigation";
import { categories as localCategories } from "@/lib/data/categories";
import { getCategoryBanner } from "@/lib/data/categoryBanners";
import CategoryView from "@/components/CategoryView/CategoryView";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export function generateStaticParams() {
  return localCategories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }) {
  const local = localCategories.find((c) => c.id === params.slug);
  const name = local?.name || params.slug;
  return {
    title: `${name} — Decor N Art`,
    description:
      local?.note ||
      `Shop ${name.toLowerCase()} — craft materials and supplies from Decor N Art.`,
  };
}

async function fetchCategoryDetail(slug) {
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${API_BASE}/categories`, { cache: "no-store" }),
      fetch(
        `${API_BASE}/products?category=${encodeURIComponent(slug)}&limit=60`,
        { cache: "no-store" }
      ),
    ]);
    const catJson = catRes.ok ? await catRes.json() : null;
    const prodJson = prodRes.ok ? await prodRes.json() : null;
    const all = Array.isArray(catJson?.data) ? catJson.data : [];
    const category = all.find((c) => c.slug === slug) || null;
    const products = Array.isArray(prodJson?.data) ? prodJson.data : [];
    return { category, products };
  } catch {
    return { category: null, products: [] };
  }
}

export default async function CategoryPage({ params }) {
  const local = localCategories.find((c) => c.id === params.slug);
  if (!local) notFound();

  const { category, products } = await fetchCategoryDetail(params.slug);

  // Merge: backend is the source of truth for name/description/count. The
  // tile image and wide banner image both live in the storefront's local
  // assets — the banner is hero-specific, image is the tile fallback.
  const merged = {
    slug: params.slug,
    name: category?.name || local.name,
    description: category?.description || local.note || "",
    count: category?.count ?? products.length,
    image: local.image,
    banner: getCategoryBanner(params.slug),
  };

  return <CategoryView category={merged} products={products} />;
}
