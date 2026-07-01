import { Suspense } from "react";
import PaymentFailedView from "@/components/PaymentFailedView/PaymentFailedView";

export const metadata = {
  title: "Payment couldn't be completed — Decor N Art Atelier",
  description:
    "Your payment didn't go through. Your basket is intact — try again, or write to us.",
};

export default function PaymentFailedPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <PaymentFailedView />
      </Suspense>
    </main>
  );
}
