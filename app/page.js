"use client";

import { ScrollTrigger } from "@/lib/gsap";
import Preloader from "@/components/Preloader/Preloader";
import Hero from "@/components/Hero/Hero";
import FeaturedCollections from "@/components/FeaturedCollections/FeaturedCollections";
import ShopByOccasion from "@/components/ShopByOccasion/ShopByOccasion";
import HandmadeBouquets from "@/components/HandmadeBouquets/HandmadeBouquets";
import Bestsellers from "@/components/Bestsellers/Bestsellers";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Testimonials from "@/components/Testimonials/Testimonials";

export default function Home() {
  // Pins/parallax are measured behind the locked loader — recompute once the
  // loader hands off and the page becomes scrollable. Also broadcast a window
  // event so sections (Hero in particular) can time their own reveal to the
  // panels parting.
  const handlePreloaderDone = () => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("preloader:done"));
    });
  };

  return (
    <>
      <Preloader onComplete={handlePreloaderDone} />
      <main>
        <Hero />
        <FeaturedCollections />
        <ShopByOccasion />
        {/* <HandmadeBouquets /> */}
        <Bestsellers />
        <WhyChooseUs />
        <Testimonials />
      </main>
    </>
  );
}
