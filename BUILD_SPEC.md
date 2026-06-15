# BUILD_SPEC.md — Decornart Bouquet E-commerce

Technical specification for the full build. The home page front end in this repo is **complete**; everything else below is the target to build against.

---

## 1. Product summary

Premium, mobile-first bouquet delivery e-commerce for the Indian market. Same-day delivery, occasion-led merchandising, a distinct handmade small-batch line, Razorpay checkout, GST-compliant cart, and carrier-pulled order tracking. Editorial/luxury aesthetic with GSAP parallax and pinned sections.

**Aesthetic:** botanical luxury — ivory base, deep forest green, blush + champagne-gold accents; Fraunces (display) + Jost (body). Tokens in `app/globals.css`.

---

## 2. Architecture

### 2.1 Frontend (this repo)

Next.js 14 App Router, JS, CSS Modules. Feature-based modular tree (see `README.md`). State that is server data → React Query; ephemeral UI → local `useState`; cross-page (cart/auth) → a light store (Context or Zustand).

### 2.2 Backend (microservices, Node/Express)

Each domain is its own service with its own datastore and a well-defined API. Async cross-service events go through a broker (RabbitMQ or Redis Streams).

| Service | Responsibility | Primary store |
|---|---|---|
| **auth** | signup/login, JWT issue/refresh, sessions | PostgreSQL |
| **users** | profiles, addresses, loyalty points | PostgreSQL |
| **catalog** | products, collections, occasions, media, attributes | **MongoDB** (flexible product schema) |
| **cart** | cart state, coupon validation, GST + shipping estimate | Redis (hot) + PostgreSQL (persisted) |
| **orders** | order lifecycle, payment intent, history | PostgreSQL (transactional) |
| **payments** | Razorpay order create + webhook verification | PostgreSQL |
| **shipping** | carrier integration, tracking timeline | MongoDB (carrier payloads vary) |
| **notifications** | email/SMS/WhatsApp on order events | consumes broker events |
| **content** | blog/DIY posts, CMS, wholesale enquiries | MongoDB |

**DB choice rationale (one-liner each):** Orders/payments/users → Postgres for ACID transactions and relational integrity. Catalog/content/shipping → Mongo because product attributes, blog bodies, and carrier payloads are document-shaped and schema-flexible.

### 2.3 Caching strategy

- **Redis** for hot reads: product detail, collection listings, homepage merchandising blocks, cart. TTL + event-based invalidation (catalog publish → bust keys).
- **HTTP caching headers** on public catalog GETs (`Cache-Control`, `ETag`); `stale-while-revalidate` at the edge/CDN.
- **In-memory** memoization for per-request hot config (e.g. GST rates, shipping zones).
- Frontend: React Query cache with sensible `staleTime`; background refetch.

### 2.4 Indexing & query rules

- Index every filter/sort/join key: products(`occasion`, `collectionId`, `price`, `isActive`, text index on name/desc), orders(`userId`, `status`, `createdAt`), users(`email` unique).
- **Every list endpoint paginated** (cursor preferred over offset for large sets).
- Connection pooling on Postgres (pg-pool) and Mongo (driver pool). No per-request connections.
- No N+1 — batch/`$in`/joins; DataLoader pattern where a resolver fans out.

---

## 3. Pages / routes (from the proposal sitemap)

Mobile-first responsive across desktop/tablet/mobile.

| Route | Page | Key contents |
|---|---|---|
| `/` | **Home** | ✅ Built. 3-banner hero, featured collections (pinned horizontal), occasion blocks, handmade feature (pinned), bestsellers, testimonials, newsletter. |
| `/shop` | Shop/Catalog | Responsive grid; filters (category, occasion, price range), sort; each card has add-to-cart + wishlist. Server-side filtered + paginated. |
| `/handmade` | Handmade Bouquets | Dedicated landing for the curated small-batch line, distinct from main catalog. |
| `/product/[slug]` | Product Detail | Gallery, name, price, description, materials, occasion tags, delivery info, reviews/ratings, add-to-cart, wishlist, related products. |
| `/cart` | Cart | Qty adjust, coupon entry, subtotal, **GST display**, shipping estimate, checkout CTA. |
| `/checkout` | Checkout | Guest or logged-in; shipping address, contact, order summary, **Razorpay**, coupon. |
| `/order/[id]/confirmation` | Order Confirmation | Order number, summary, est. delivery, contact for queries. |
| `/track-order` | Track Order | Status timeline pulled from carrier APIs. |
| `/account` | My Account | Orders, addresses, wishlist, profile, loyalty points. |
| `/wishlist` | Wishlist | Saved products, one-click add-to-cart, shareable link. |
| `/blog`, `/blog/[slug]` | Blog & DIY | Listing with categories, admin-managed posts, DIY tutorials. |
| `/wholesale` | Wholesale Enquiry | B2B form: bulk, corporate gifting, event florists. |
| `/about` | About Us | Brand story, founder note, vision, aesthetic philosophy. |
| `/contact` | Contact | Details, business enquiry form, socials, location. |
| `/faq` | FAQ | Accordion. |
| `/returns` | Return & Refund | Policy. |
| `/privacy` | Privacy Policy | Standard. |
| `/terms` | Terms & Conditions | Standard. |

---

## 4. Frontend module pattern (replicate for new sections/pages)

```
ComponentName/
  ComponentName.js          // "use client" only if it needs hooks/interactivity
  ComponentName.module.css
```

- Server components by default; mark `"use client"` only for interactive/animated modules.
- Animations: `useGSAP({ scope: ref })`, transform/opacity, desktop-only pins via `matchMedia`.
- Lists: virtualize or paginate; never render an unbounded array.

---

## 5. Key flows

### Catalog browse
React Query → `GET /catalog/products?occasion=&collection=&minPrice=&maxPrice=&sort=&cursor=` → paginated, Redis-cached, indexed. Debounce search; lazy-load images via `next/image`.

### Cart & GST
Cart service computes subtotal, applies validated coupon, computes GST by HSN/rate config, returns shipping estimate by pincode zone. Optimistic UI on qty change; reconcile with server response.

### Checkout (Razorpay)
1. `POST /orders` creates a pending order + `POST /payments/razorpay/order` returns Razorpay `order_id`.
2. Client opens Razorpay checkout.
3. Razorpay **webhook** → payments service verifies signature → marks order paid → emits `order.paid` → notifications + shipping consume it.
4. Never trust client-side payment success; the webhook is source of truth.

### Order tracking
Shipping service polls/receives carrier webhooks; exposes a normalized status timeline to `/track-order`.

---

## 6. Performance budget

- LCP < 2.5s on 4G mobile; hero image `priority`, rest lazy.
- API p95 < 200ms for cached reads; < 500ms for uncached.
- No layout shift (CLS ~0): `next/font`, fixed media aspect-ratios.
- JS: route-level code splitting (App Router default) + dynamic import for heavy, below-fold widgets.

---

## 7. Security / production-mindedness

- Parameterized queries (Postgres) and sanitized inputs (Mongo) everywhere — no string-built queries.
- Input validation at the service boundary (zod/joi).
- JWT with short-lived access + refresh rotation; httpOnly cookies.
- Razorpay webhook signature verification; idempotent order handling.
- Rate limiting on auth and enquiry endpoints.
- HTTPS only; secrets in env, never committed.

---

## 8. Status

- **Done:** Home page (all sections), preloader, smooth scroll, GSAP parallax + 2 pinned sections, design system, mock data layer.
- **Not done:** all other routes, backend services, real data, payments, auth, search. Build per the plan in `PROJECT_PLAN.md`.
