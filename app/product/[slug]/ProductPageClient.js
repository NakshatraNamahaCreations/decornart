"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts } from "@/lib/api/products";
import ProductView from "@/components/ProductView/ProductView";
import ProductReviews from "@/components/ProductReviews/ProductReviews";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";

export default function ProductPageClient({ slug }) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      try {
        const [p, r] = await Promise.all([
          getProduct(slug),
          getRelatedProducts(slug).catch(() => []),
        ]);
        if (cancelled) return;
        setProduct(p);
        setRelated(r || []);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        if (e.status === 404) setStatus("not-found");
        else setStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "loading") {
    return (
      <main>
        <div className="container" style={{ padding: "6rem 0", opacity: 0.6 }}>
          Loading…
        </div>
      </main>
    );
  }

  if (status === "not-found") notFound();

  if (status === "error" || !product) {
    return (
      <main>
        <div className="container" style={{ padding: "6rem 0" }}>
          Could not load this product. Please try again.
        </div>
      </main>
    );
  }

  return (
    <main>
      <ProductView product={product} related={related} />
      <ProductReviews productId={product.id} />
      <RelatedProducts product={product} related={related} />
    </main>
  );
}
