import HandmadeHero from "@/components/HandmadeHero/HandmadeHero";
// import HandmadePhilosophy from "@/components/HandmadePhilosophy/HandmadePhilosophy";
import HandmadeProcess from "@/components/HandmadeProcess/HandmadeProcess";
import HandmadeDrop from "@/components/HandmadeDrop/HandmadeDrop";

export const metadata = {
  title: "Handmade Bouquets — Decornart Atelier",
  description:
    "Small-batch hand-tied bouquets, composed each morning from seasonal stems. A limited weekly drop from the Decornart atelier.",
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
