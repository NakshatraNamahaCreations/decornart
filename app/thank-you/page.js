import { Suspense } from "react";
import ThankYouView from "@/components/ThankYouView/ThankYouView";

export const metadata = {
  title: "Thank you — Decor N Art Atelier",
  description:
    "Your bouquet is being composed by hand. We'll write again the moment it leaves the atelier.",
};

export default function ThankYouPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <ThankYouView />
      </Suspense>
    </main>
  );
}
