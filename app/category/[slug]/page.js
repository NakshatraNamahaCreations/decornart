import { notFound } from "next/navigation";
import { categories as localCategories } from "@/lib/data/categories";
import { getCategoryBanner } from "@/lib/data/categoryBanners";
import CategoryView from "@/components/CategoryView/CategoryView";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

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
    const [catRes, prodRes, bannerRes] = await Promise.all([
      fetch(`${API_BASE}/categories`, { cache: "no-store" }),
      fetch(
        `${API_BASE}/products?category=${encodeURIComponent(slug)}&limit=60`,
        { cache: "no-store" }
      ),
      // Admin-published banner for this category slot. Best-effort — a
      // failure here should still let the page render.
      fetch(
        `${API_BASE}/banners?slot=category-banner&categorySlug=${encodeURIComponent(slug)}`,
        { cache: "no-store" }
      ).catch(() => null),
    ]);
    const catJson = catRes.ok ? await catRes.json() : null;
    const prodJson = prodRes.ok ? await prodRes.json() : null;
    const bannerJson = bannerRes && bannerRes.ok ? await bannerRes.json() : null;
    const all = Array.isArray(catJson?.data) ? catJson.data : [];
    const category = all.find((c) => c.slug === slug) || null;
    const products = Array.isArray(prodJson?.data) ? prodJson.data : [];
    const banners = Array.isArray(bannerJson?.data) ? bannerJson.data : [];
    // Position-sorted server-side; take the highest priority live banner.
    const activeBanner = banners[0] || null;
    return { category, products, allCategories: all, activeBanner };
  } catch {
    return { category: null, products: [], allCategories: [], activeBanner: null };
  }
}

export default async function CategoryPage({ params }) {
  const local = localCategories.find((c) => c.id === params.slug);
  const { category, products, allCategories, activeBanner } = await fetchCategoryDetail(params.slug);

  // 404 only if the backend has no such slug AND there's no local fallback —
  // otherwise the backend is the source of truth for name/description/count.
  if (!category && !local) notFound();

  const merged = {
    slug: params.slug,
    name: category?.name || local?.name || params.slug,
    description: category?.description || local?.note || "",
    count: category?.count ?? products.length,
    image: local?.image,
    // Priority: admin-published banner → category record's own banner →
    // legacy static local map. First non-empty wins.
    banner:
      activeBanner?.image ||
      category?.banner ||
      getCategoryBanner(params.slug),
    // Editorial copy from the admin-published banner. Each field is optional;
    // CategoryView falls back to category name/description when a field is
    // blank, so partial banners (e.g. only a new title) work.
    bannerContent: activeBanner
      ? {
          eyebrow: activeBanner.eyebrow || "",
          title: activeBanner.title || "",
          script: activeBanner.script || "",
          scriptStyle: activeBanner.scriptStyle || "script",
          subtitle: activeBanner.subtitle || "",
          ctaLabel: activeBanner.ctaLabel || "",
          href: activeBanner.href || "",
        }
      : null,
  };

  return (
    <CategoryView
      category={merged}
      products={products}
      categories={allCategories}
    />
  );
}
