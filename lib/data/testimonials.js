import bouquetHero from "@/assets/luxe-heart/luxe-heart2.jpeg";
import beautifulHero from "@/assets/gift-box.jpeg";

import butterfly1 from "@/assets/butterfly-gift-box/butterfly-1.jpeg";
import butterfly2 from "@/assets/butterfly-gift-box/butterfly-2.jpeg";
import butterfly3 from "@/assets/butterfly-gift-box/butterfly-3.jpeg";
import forYou1 from "@/assets/for-you-bouquet/for-you1.jpeg";
import forYou2 from "@/assets/for-you-bouquet/for-you2.jpeg";
import forYou3 from "@/assets/for-you-bouquet/for-you3.jpeg";
import heart1 from "@/assets/luxe-heart/luxe-heart1.jpeg";
import heart2 from "@/assets/luxe-heart/luxe-heart2.jpeg";
import heart3 from "@/assets/luxe-heart/luxe-heart3.jpeg";
import rose1 from "@/assets/luxe-rose/luxe-rose1.jpeg";
import rose2 from "@/assets/luxe-rose/luxe-rose2.jpeg";
import rose3 from "@/assets/luxe-rose/luxe-rose3.jpeg";

export const testimonials = [
  {
    id: "t1",
    rating: 5,
    quote:
      "The quality is amazing! My bouquets turned out so beautiful. Totally in love!",
    name: "Neha Verma",
    verified: true,
    thumbnails: [butterfly1, butterfly2, butterfly3],
  },
  {
    id: "t2",
    rating: 5,
    quote:
      "Super fast delivery and excellent customer support. Highly recommended!",
    name: "Aisha Khan",
    verified: true,
    thumbnails: [forYou1, forYou2, forYou3],
  },
  {
    id: "t3",
    rating: 5,
    quote:
      "DecorNArt has everything a crafter needs. My go-to store for all supplies!",
    name: "Sneha Iyer",
    verified: true,
    thumbnails: [heart1, heart2, heart3],
  },
  {
    id: "t4",
    rating: 5,
    quote:
      "Love the packaging and quality of every product. Will shop again for sure!",
    name: "Priya Sharma",
    verified: true,
    thumbnails: [rose1, rose2, rose3],
  },
];

export const testimonialsHero = {
  src: bouquetHero,
  alt: "A soft hand-tied bouquet of garden roses",
  quote: "Thank you for being a part of our beautiful journey",
};

export const beautiful = {
  image: beautifulHero,
  imageAlt: "Florist hand-tying a seasonal bouquet",
};
