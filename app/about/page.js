import AboutHero from "@/components/AboutHero/AboutHero";
import AboutStory from "@/components/AboutStory/AboutStory";
import AboutValues from "@/components/AboutValues/AboutValues";
import AboutAtelier from "@/components/AboutAtelier/AboutAtelier";
import HandmadeBouquets from "@/components/HandmadeBouquets/HandmadeBouquets";

export const metadata = {
  title: "About — Decornart Atelier",
  description:
    "Decornart is a small atelier of florists, sourcers, and couriers composing hand-tied bouquets each morning across Mumbai, Bengaluru, Delhi and Pune.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <HandmadeBouquets/>
      <AboutValues />
      <AboutAtelier />
    </main>
  );
}
