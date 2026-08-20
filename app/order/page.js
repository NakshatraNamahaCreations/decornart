import TrackOrderView from "@/components/TrackOrderView/TrackOrderView";

export const metadata = {
  title: "Track Your Order — Decor N Art Atelier",
  description:
    "Track your DecorNArt order in real time. Enter your order or tracking ID to see current status, expected delivery, and courier details.",
};

export default function OrderPage() {
  return <TrackOrderView />;
}
