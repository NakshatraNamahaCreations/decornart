# Decor N Art — Premium Bouquet Delivery (Next.js)

A premium, mobile-first bouquet e-commerce front end built with the **Next.js App Router** (JavaScript, **CSS Modules — no Tailwind**), **GSAP + ScrollTrigger** for parallax and pinned sections, and **Lenis** for smooth scroll.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
# never use `npx next` — use the package scripts above
npm run build && npm run start
```

> The dev/build step downloads the **Fraunces** + **Jost** fonts via `next/font/google`, so the machine you build on needs network access to Google Fonts (standard for Next).

## What's built

The home page composes these sections (top → bottom):

| Section | Behaviour |
|---|---|
| **Preloader** | Blooming SVG flower + counter, then two panels part to reveal the page. Locks scroll until done. |
| **Navbar** | Fixed; transparent over the hero, switches to a solid blurred treatment after 80px (ScrollTrigger). |
| **Hero** | **3 auto-advancing banners** with crossfade, clickable progress bars, and **scroll parallax** on the media. |
| **Featured Collections** | **Pinned horizontal scroll** on desktop (`gsap.matchMedia`); native scroll-snap on mobile. |
| **Shop by Occasion** | Staggered scroll-reveal grid (birthdays, anniversaries, sympathy, congratulations). |
| **beautiful Bouquets** | **Pinned** feature with scrubbed image parallax + sequenced copy reveal (desktop); simple reveal on mobile. |
| **Bestsellers** | Product cards with working wishlist toggle + add-to-cart UI state, INR pricing. |
| **Testimonials** | Auto-rotating quote with crossfade. |
| **Newsletter** | Email signup with client-side validation (no `<form>` reload). |
| **Footer** | Full sitemap from the proposal. |

## Structure

```
Decor N Art-bouquets/
├── app/
│   ├── layout.js            # fonts (next/font) + SmoothScrollProvider
│   ├── page.js              # composes sections, refreshes ScrollTrigger after preloader
│   └── globals.css          # design tokens + base styles
├── components/
│   ├── providers/SmoothScrollProvider.js   # Lenis ↔ ScrollTrigger sync
│   ├── Preloader/  Navbar/  Hero/
│   ├── FeaturedCollections/  ShopByOccasion/  beautifulBouquets/
│   ├── Bestsellers/  Testimonials/  Newsletter/  Footer/
│   └── (each module = Component.js + Component.module.css, self-contained)
├── lib/
│   ├── gsap.js              # registers ScrollTrigger once; single import source
│   └── data/                # banners, collections, occasions, products, testimonials
└── hooks/useIsomorphicLayoutEffect.js
```

## GSAP conventions used (matches your house style)

- Every animation runs inside `useGSAP({ scope: ref })` for automatic cleanup.
- Animations use **transform/opacity only** (no layout thrash).
- **Pinning is desktop-only**, gated behind `gsap.matchMedia("(min-width: 861px)")`.
- `ScrollTrigger.refresh()` is called after the preloader hands off (pins were measured behind a locked page).
- `invalidateOnRefresh` + dynamic `end` so the horizontal pin recalculates on resize.
- `prefers-reduced-motion` disables Lenis smoothing and CSS transitions.

## Performance notes

- **`next/image`** everywhere → automatic lazy-loading, responsive `sizes`, and AVIF/WebP. Only the first hero banner is `priority`.
- Fonts via `next/font` (self-hosted, no layout shift, no render-blocking request).
- Lenis is driven off GSAP's single ticker — one rAF loop, not two.

## ⚠️ Images are Unsplash placeholders

All image URLs live in `lib/data/*.js`. They point at Unsplash for the design phase. **Verify each one loads and swap them** for your own licensed photography / CDN before launch — it's a one-line edit per image since they're centralised.

## Next steps to wire up

- Cart/wishlist: replace the local `useState` in `Bestsellers.js` with your cart service (context/Zustand + Node API).
- Newsletter: POST from `Newsletter.js` to your `/api/subscribe` route.
- Build out the routes already linked in the nav/footer (`/shop`, `/beautiful`, `/product/[slug]`, `/cart`, `/checkout`, etc.) following the same module pattern.
