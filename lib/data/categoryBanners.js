// Hero banner image per category. Kept separate from the tile image used on
// the /categories index (which is square-ish) — banner shots are wide and
// editorial. Swap any entry below to swap the hero on /category/<slug>.

import basketBan from "@/assets/category1bg.png";
import giftCardBan from "@/assets/category2bg.png";
import pipeBan from "@/assets/category3bg.png";
import giftBoxBan from "@/assets/category4bg.png";
import craftBan from "@/assets/category5bg.png";
import crochetBan from "@/assets/ban2.png";
import ribbonsBan from "@/assets/category7bg.png";
import wrappingBan from "@/assets/category8bg.png";
import plantsBan from "@/assets/decor-ban_1.png";

export const categoryBanners = {
  "flower-basket-materials": basketBan,
  "gift-cards": giftCardBan,
  "pipe-cleaners": pipeBan,
  "gift-box": giftBoxBan,
  "craft-essentials": craftBan,
  "crochet-materials": crochetBan,
  "ribbons": ribbonsBan,
  "wrapping-papers": wrappingBan,
  "artificial-plants": plantsBan,
};

export function getCategoryBanner(slug) {
  return categoryBanners[slug] || null;
}
