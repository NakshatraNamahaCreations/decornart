"use client";

import dynamic from "next/dynamic";
import { ScrollTrigger } from "@/lib/gsap";
import Preloader from "@/components/Preloader/Preloader";
import TrustStrip from "@/components/TrustStrip/TrustStrip";

// Hero fetches admin-published banners from the client. SSRing it means the
// server always renders `staticBanners` in the initial HTML, which the
// client then swaps for the cached/API banners on hydration — that swap is
// the "flash of old images" glitch. Disabling SSR removes the swap: the
// hero renders from the client using its sessionStorage cache
// synchronously, so repeat visits show the correct banners on the very
// first frame.
const Hero = dynamic(() => import("@/components/Hero/Hero"), {
  ssr: false,
  loading: () => <section aria-hidden="true" style={{ minHeight: "88vh" }} />,
});
import FeaturedCollections from "@/components/FeaturedCollections/FeaturedCollections";
import PromoBanners from "@/components/PromoBanners/PromoBanners";
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
        <Bestsellers />
        <DIYInspiration />
        <WhyChooseUs />


        {/* <Testimonials /> */}
        <InstagramFeed />
      </main>
    </>
  );
}
