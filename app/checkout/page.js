import CheckoutView from "@/components/CheckoutView/CheckoutView";

export const metadata = {
  title: "Checkout — Decornart Atelier",
  description:
    "Final details for your order — composed by hand and shipped the same morning. Secured by Razorpay.",
};

export default function CheckoutPage() {
  return (
    <main>
      <CheckoutView />
    </main>
  );
}
