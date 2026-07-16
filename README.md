# Kross One Gadget Shop

Production-ready static prototype based directly on the latest supplied Claude Design handoff (`Kross One Gadget Shop Redesign`). The handoff is treated as the visual and content source of truth. This revision syncs the storefront to the newest handoff source and adds the handoff's staff admin console as a second page.

Live site: [codingxperience.github.io/kross_one_gadget_shop](https://codingxperience.github.io/kross_one_gadget_shop/)
Admin console: [codingxperience.github.io/kross_one_gadget_shop/admin.html](https://codingxperience.github.io/kross_one_gadget_shop/admin.html)

## Local project

`C:\Users\send2\projects101\kross_one_gadget_shop`

## Setup

```bash
npm install
npm run dev
```

Production output and automated source checks:

```bash
npm run build
npm run qa
npm run preview
```

The build copies the authoritative storefront, the admin console, and the public assets to `dist/` without transforming the design-export HTML. This keeps the production output visually faithful and avoids altering the custom design runtime.

## GitHub Pages deployment

`.github/workflows/deploy-pages.yml` builds, validates, uploads, and deploys `dist/` whenever `main` is updated. The workflow follows GitHub's official Pages artifact deployment model and can also be started manually from the repository's Actions tab.

The storefront uses hash routes and relative asset URLs, so pages such as `#/shop` and `#/checkout` work beneath the project path `/kross_one_gadget_shop/` without a server-side route fallback. The admin console is served at `admin.html` beneath the same path.

## Authoritative handoff

- Primary storefront source inside the handoff: `project/Kross One Gadget Shop.dc.html`
- Admin console source inside the handoff: `project/Kross One Admin.dc.html`
- Shared catalog data inside the handoff: `project/admin-data.js`

Project mapping:

- `index.html` — authoritative storefront from the latest handoff. Sole adaptation: the document opens with `<html data-theme="dark">` so the dark-first default paints before the runtime mounts.
- `admin.html` — authoritative admin console from the handoff, unmodified.
- `public/support.js` — supplied design runtime, unchanged.
- `public/admin-data.js` — supplied shared catalog (85 products) used by the admin console, unchanged.
- `public/assets/` — all 50 curated handoff assets.
- `scripts/build.mjs` — lossless static production build for both pages.
- `scripts/qa.mjs` — syntax, asset, navigation, authentication-gate, dark-mode, promo-code, admin-gate, and output-integrity checks.

## Storefront behaviour carried by the handoff source

1. Dark mode is the default in the raw document, component state, and normal browser view. A visitor's explicit saved theme preference is still respected; embedded/iframe contexts render light.
2. Checkout and payment actions require an account. Direct signed-out access to `#/checkout` redirects to Create account, preserves checkout intent through Sign in/Create account, and returns the authenticated user to Checkout.
3. Input, textarea, and select text/carets inherit the active theme color, so fields stay legible on dark.
4. The Cart control inverts with the theme (light pill with dark label and badge in dark mode), on desktop and mobile.
5. Desktop right-side navigation is ordered Saved → Cart → Sign in/account.
6. Promo codes are accepted in both the cart and checkout summaries, validated against the admin console's promo list, and carried through the payment sheet, order, and tracking view.

## Route map

| Route | View |
| --- | --- |
| `#/` | Home |
| `#/shop` | All products |
| `#/c/mobiles` | Mobiles |
| `#/c/audio` | Audio |
| `#/c/laptops` | Laptops |
| `#/c/watches` | Smart Watches |
| `#/c/gaming` | Gaming |
| `#/c/accessories` | Accessories |
| `#/deals` | Deals |
| `#/p/:product-id` | Product detail |
| `#/about` | About |
| `#/contact` | Contact |
| `#/saved` | Saved items |
| `#/cart` | Cart |
| `#/checkout` | Account-gated checkout |
| `#/login` | Sign in |
| `#/register` | Create account |
| `#/account` | Account and order history |
| `#/track/:order-ref` | Order tracking |

## Admin console (`admin.html`)

Staff console from the handoff. Demo credentials are shown on the sign-in card (`admin@krossone.ug` / `admin2026`), followed by a two-factor code presented in an SMS preview. Sessions auto-lock after 30 minutes, five failed attempts trigger a lockout, and every action is written to an append-only audit log.

Sections: Overview (live KPIs, revenue-by-order bars, payment and channel mix, 7-day trend, sales by category, low-stock alerts), Orders (search/filter, detail drawer, status advance, refunds, rider assignment, internal notes, CSV export, receipts), In-store point-of-sale, Inventory (stock adjust, price overrides), Customers (WhatsApp messaging), Payments ledger, Discounts & promos, Delivery riders, Reviews moderation, Returns & repairs, Expense tracking, Supplier purchase orders, Staff roles & permissions, Security, and Audit log. A Daily summary email composer sits in the Overview header.

The console computes from the same browser-local storefront data as the shop — orders placed on the site appear in the console on the same device — and seeds realistic demo data on first load without overwriting real activity.

## Verification performed

- `npm run build` succeeds and creates byte-identical `dist/index.html` and `dist/admin.html` output.
- `npm run qa` parses both design components and the supplied runtime, verifies all 42 storefront and 38 admin local asset references, confirms all 50 packaged assets, and checks the dark-mode, checkout-gate, promo-code, cart-treatment, navigation-order, and admin-gate markers.
- Chromium rendered the storefront at 1440 × 960: dark default active, signed-out `#/checkout` redirected to Create account, promo entry present in cart and checkout markup.
- Chromium ran the admin console end to end: sign-in → two-factor code → console; all 15 sections rendered their labelled view (Overview, Orders, In-store sales, Inventory, Customers, Payments, Discounts & promos, Riders, Reviews, Returns, Expenses, Suppliers, Staff, Security, Audit log) with no page-level browser exceptions.

## Prototype boundaries

The supplied handoff uses browser-local storage for accounts, carts, saved items, orders, admin data, and theme preference. Its payment, order, delivery, stock, product, review, and tracking data are prototype presentation data, and the admin credentials are demo values shown on the sign-in card. Before production commerce launch, connect authentication, catalogue/inventory, pricing, payments, order management, delivery, and customer communications to verified backend services, and move the admin console behind real server-side authentication.

The supplied runtime also loads React, ReactDOM, Instrument Sans, some brand icons, and several catalogue images from external CDN URLs. A production hardening pass should self-host critical runtime dependencies and confirm licensing/availability for every remote asset without changing the approved design.
