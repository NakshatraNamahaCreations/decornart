import WishlistView from "@/components/WishlistView/WishlistView";

export const metadata = {
  title: "Wishlist — Decornart Atelier",
  description:
    "The bouquets you've saved at Decornart — kept here until you're ready.",
};

export default function WishlistPage() {
  return (
    <main>
      <WishlistView />
    </main>
  );
}
