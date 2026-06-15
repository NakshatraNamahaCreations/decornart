# PROJECT_PLAN.md — Decornart Build Roadmap

Phased plan. Each phase ships something usable. The home front end (Phase 0) is already in this repo.

---

## Phase 0 — Home front end ✅ (in this repo)

Design system, preloader, smooth scroll, 3-banner hero with parallax, pinned horizontal collections, occasion grid, pinned handmade feature, bestsellers, testimonials, newsletter, footer. Mock data in `lib/data/`.

**Exit:** `npm run dev` renders the full premium home page on desktop + mobile.

---

## Phase 1 — Frontend shell for all routes (static/mock)

Build every route from the sitemap with mock data and the same module pattern, no backend yet.

1. Shared UI: `Button`, `ProductCard`, `Price`, `Accordion`, `FormField`, `Breadcrumb` in `components/ui/`.
2. `/shop` — filter sidebar + responsive grid + sort (filter client-side over mock for now).
3. `/product/[slug]` — gallery, details, reviews block, related.
4. `/handmade`, `/about`, `/contact`, `/faq`, `/returns`, `/privacy`, `/terms`, `/wholesale`.
5. `/cart`, `/checkout`, `/account`, `/wishlist`, `/track-order`, `/order/[id]/confirmation` — UI + mock state.
6. `/blog` + `/blog/[slug]`.

**Exit:** clickable site, every nav/footer link resolves, mobile-first verified.

---

## Phase 2 — Backend foundation

1. Monorepo or services folder: scaffold `auth`, `users`, `catalog`, `cart`, `orders`, `payments`, `shipping`, `notifications`, `content`.
2. Provision PostgreSQL + MongoDB + Redis (Docker compose for local).
3. **auth** + **users** first: JWT, refresh rotation, profile/addresses. Connection pooling + indexes from day one.
4. API gateway / BFF layer the Next app talks to.

**Exit:** signup/login working end-to-end; protected routes.

---

## Phase 3 — Catalog + cart + wishlist

1. **catalog** service (Mongo): products, collections, occasions; text + attribute indexes; paginated, Redis-cached list endpoints with HTTP cache headers.
2. Wire `/shop`, `/product/[slug]`, home merchandising to live data via **React Query**.
3. **cart** service: Redis-backed cart, coupon validation, GST + shipping estimate.
4. Wishlist persistence; replace the local `useState` in `Bestsellers.js`.

**Exit:** browse → filter → product → add to cart/wishlist on real data, all reads cached/paginated.

---

## Phase 4 — Checkout, payments, orders

1. **orders** service (Postgres, transactional).
2. **payments** service: Razorpay order create + **webhook signature verification**; idempotent `order.paid`.
3. `/checkout` (guest + logged-in), `/order/[id]/confirmation`.
4. **notifications** consumes `order.paid` → email/SMS/WhatsApp.

**Exit:** a real test order can be placed and paid via Razorpay; confirmation + notification fire.

---

## Phase 5 — Tracking, account, content

1. **shipping** service + carrier integration → `/track-order` timeline.
2. `/account`: orders, addresses, profile, loyalty points.
3. **content** service: blog/DIY CMS, `/wholesale` enquiry intake.

**Exit:** post-purchase + content surfaces live.

---

## Phase 6 — Hardening & launch

- Performance pass: verify LCP/CLS budgets, Redis hit rates, query plans (no seq scans on hot paths), payload sizes.
- Security pass: rate limits, input validation, parameterized/sanitized queries audit, secret hygiene.
- Replace all **Unsplash placeholders** in `lib/data/*` with licensed assets on a CDN.
- SEO: metadata per route, JSON-LD (Product, BreadcrumbList, FAQPage), sitemap, robots.
- Analytics + error monitoring.

**Exit:** production launch.

---

## Suggested order if solo / time-boxed

Phase 0 (done) → 1 → 2 (auth+catalog only) → 3 → 4 → then 5/6. Ship the storefront browsable on real data (through Phase 3) before checkout, since that's the highest-traffic surface.
