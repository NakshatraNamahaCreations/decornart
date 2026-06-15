import CartView from "@/components/CartView/CartView";

export const metadata = {
  title: "Basket — Decornart Atelier",
  description:
    "Your basket at Decornart — composed by hand and shipped the same morning across Mumbai, Bengaluru, Delhi and Pune.",
};

export default function CartPage() {
  return (
    <main>
      <CartView />
    </main>
  );
}
