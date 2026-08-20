// Hero banner image per category. Kept separate from the tile image used on
// the /categories index (which is square-ish) — banner shots are wide and
// editorial. Swap any entry below to swap the hero on /category/<slug>.

import basketBan from "@/assets/category1bg.png";
import giftCardBan from "@/assets/category2bg.png";
import pipeBan from "@/assets/category3bg.png";
import craftBan from "@/assets/category5bg.png";
import crochetBan from "@/assets/ban2.png";
import ribbonsBan from "@/assets/category7bg.png";
import wrappingBan from "@/assets/category8bg.png";
import giftBox from "@/assets/for-mother-gift/for-mother4.jpeg"

export const categoryBanners = {
  "flower-basket": basketBan,
  "gift-cards": giftCardBan,
  "gift-box": giftBox,
  "pipe-cleaners": pipeBan,
  "craft-essentials": craftBan,
  "crochet-materials": crochetBan,
  "ribbons": ribbonsBan,
  "wrapping-papers": wrappingBan,
};

export function getCategoryBanner(slug) {
  return categoryBanners[slug] || null;
}
