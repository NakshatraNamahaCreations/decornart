import HandmadeHero from "@/components/HandmadeHero/HandmadeHero";
// import HandmadePhilosophy from "@/components/HandmadePhilosophy/HandmadePhilosophy";
import HandmadeProcess from "@/components/HandmadeProcess/HandmadeProcess";
import HandmadeDrop from "@/components/HandmadeDrop/HandmadeDrop";

export const metadata = {
  title: "Handmade Supplies — Decor N Art Atelier",
  description:
    "Small-batch craft materials and supplies — ribbons, wrapping sheets, pipe cleaners, crochet yarns and more, hand-picked for bouquet makers and crafters.",
};

export default function HandmadePage() {
  return (
    <main>
      <HandmadeHero />
      {/* <HandmadePhilosophy /> */}
      <HandmadeProcess />
      <HandmadeDrop />
    </main>
  );
}
