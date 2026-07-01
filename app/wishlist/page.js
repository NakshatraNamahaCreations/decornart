import WishlistView from "@/components/WishlistView/WishlistView";

export const metadata = {
  title: "Wishlist — Decor N Art Atelier",
  description:
    "The bouquets you've saved at Decor N Art — kept here until you're ready.",
};

export default function WishlistPage() {
  return (
    <main>
      <WishlistView />
    </main>
  );
}
