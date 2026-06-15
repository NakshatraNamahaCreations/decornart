# CLAUDE.md — Decornart Bouquet E-commerce

Rules and context for working on this repo. Read before generating or editing code.

## Stack (do not deviate without being asked)

- **Frontend:** Next.js 14 App Router, **JavaScript (no TypeScript)**, **CSS Modules (no Tailwind, no CSS-in-JS)**.
- **Animation:** GSAP 3 + ScrollTrigger, `@gsap/react` `useGSAP`. Lenis for smooth scroll.
- **Backend (to build):** Node.js microservices, Express, async/await. **PostgreSQL** for transactional data, **MongoDB** for catalog/content. **Redis** for caching. Communication via REST + a message broker for async events.
- **Payments:** Razorpay. **Pricing in INR**, GST shown at cart.

## Project conventions

- **Modular tree, feature-based.** Every UI module is a self-contained folder: `ComponentName/ComponentName.js` + `ComponentName.module.css`. No flat dumps. No shared "styles" mega-file beyond `app/globals.css` (tokens only).
- Functional components with hooks only. No class components.
- Import GSAP from **`@/lib/gsap`** only — it registers `ScrollTrigger` once. Never call `gsap.registerPlugin` in a component.
- Data/content lives in `lib/data/*.js`. Components never hardcode copy or image URLs inline.
- Path alias `@/*` → repo root (see `jsconfig.json`).

## GSAP rules (enforced — these caused real bugs before)

1. Every animation lives inside `useGSAP(() => {...}, { scope: ref })`. The scope handles cleanup; never manually `kill()` what `useGSAP` owns.
2. **Animate `transform` and `opacity` only.** No animating `top/left/width/height/margin` (layout thrash).
3. **Pinning is desktop-only.** Always gate `pin: true` behind `gsap.matchMedia("(min-width: 861px)")`. Mobile gets a non-pinned fallback (reveal or native scroll-snap).
4. For pinned/scrub triggers that depend on element width, set `invalidateOnRefresh: true` and use a function-based `end` (e.g. `end: () => "+=" + distance`).
5. Call `ScrollTrigger.refresh()` after any event that changes layout post-mount (preloader finishing, fonts/images loading, route data swap). It's already wired after the preloader in `app/page.js`.
6. Respect `prefers-reduced-motion` — Lenis is skipped and CSS transitions are neutralised in `globals.css`. Don't add motion that ignores it.

## Performance rules (non-negotiable)

- Use **`next/image`** for every image. Set accurate `sizes`. Only above-the-fold hero gets `priority`.
- Backend: **index every column you filter/sort/join on**; **paginate every list endpoint**; **cache hot reads in Redis**; use **connection pooling** for Postgres and Mongo; **batch** to avoid N+1.
- Frontend data: use **React Query (TanStack Query)** for caching/dedupe/background refetch once APIs exist. **Lazy-load** routes/heavy components. **Debounce** search input.
- If you write something that can lag (blocking op, unindexed query, waterfall request, oversized payload), flag it and give the performant version.

## Commands

- Dev: `npm run dev` — **never `npx next`**.
- Build: `npm run build` then `npm run start`.

## Style of help

Working code first, short explanations after. When fixing a bug, fix the actual bug — don't rewrite the file unless the architecture is the problem; list other issues separately at the end.
