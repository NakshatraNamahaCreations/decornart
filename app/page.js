"use client";

import { ScrollTrigger } from "@/lib/gsap";
import Preloader from "@/components/Preloader/Preloader";
import Hero from "@/components/Hero/Hero";
import TrustStrip from "@/components/TrustStrip/TrustStrip";
import FeaturedCollections from "@/components/FeaturedCollections/FeaturedCollections";
import PromoBanners from "@/components/PromoBanners/PromoBanners";
// import ShopByOccasion from "@/components/ShopByOccasion/ShopByOccasion";
import HandmadeBouquets from "@/components/HandmadeBouquets/HandmadeBouquets";
import Bestsellers from "@/components/Bestsellers/Bestsellers";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import DIYInspiration from "@/components/DIYInspiration/DIYInspiration";
import SpecialMoments from "@/components/SpecialMoments/SpecialMoments";
import Testimonials from "@/components/Testimonials/Testimonials";
import InstagramFeed from "@/components/InstagramFeed/InstagramFeed";

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
        <TrustStrip />
        <FeaturedCollections />
        <SpecialMoments />
        <PromoBanners />
        {/* <ShopByOccasion /> */}
        {/* <HandmadeBouquets /> */}
        <Bestsellers />
        <WhyChooseUs />
        <DIYInspiration />
        
        <Testimonials />
        <InstagramFeed />
      </main>
    </>
  );
}
