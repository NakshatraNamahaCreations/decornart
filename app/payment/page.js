import PaymentView from "@/components/PaymentView/PaymentView";

export const metadata = {
  title: "Payment — Decor N Art Atelier",
  description:
    "Pick a payment method and pay securely with UPI, card, net banking, wallets, COD or BNPL. 100% protected by Razorpay & SSL.",
};

export default function PaymentPage() {
  return <PaymentView />;
}
