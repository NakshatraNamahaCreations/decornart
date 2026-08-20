import { Suspense } from "react";
import Shop from "@/components/Shop/Shop";

export const metadata = {
  title: "Shop bouquets — Decor N Art",
  description:
    "Hand-tied bouquets across every collection. Filter by occasion, style and price.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <Shop />
    </Suspense>
  );
}
