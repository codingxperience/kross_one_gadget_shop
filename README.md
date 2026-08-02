# Kross One Gadgets

Production-ready static prototype based directly on the supplied Claude Design v2 handoff (`Kross One Gadget Shop v2`). The storefront brand is now Kross One Gadgets, with the handoff remaining the visual and interaction source of truth. This revision applies the client-approved responsive motion, premium collection controls, broader inventory search, and authenticated catalog imagery while preserving the staff admin console as a second page.

Live site: [codingxperience.github.io/kross_one_gadget_shop](https://codingxperience.github.io/kross_one_gadget_shop/)
Admin console: [codingxperience.github.io/kross_one_gadget_shop/admin.html](https://codingxperience.github.io/kross_one_gadget_shop/admin.html)

## Local project

`E:\project101\kross_one_gadget_shop`

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

The build copies the approved storefront revision, the admin console, and the public assets to `dist/` without transforming the design-export HTML. This keeps the production output visually faithful and avoids altering the custom design runtime.

## GitHub Pages deployment

`.github/workflows/deploy-pages.yml` builds, validates, uploads, and deploys `dist/` whenever `main` is updated. The workflow follows GitHub's official Pages artifact deployment model and can also be started manually from the repository's Actions tab.

The storefront uses hash routes and relative asset URLs, so pages such as `#/shop`, `#/technology`, and `#/visit` work beneath the project path `/kross_one_gadget_shop/` without a server-side route fallback. The admin console is served at `admin.html` beneath the same path.

## Authoritative handoff

- Primary storefront source inside the handoff: `Kross One Gadget Shop v2.dc.html`
- Admin console source inside the handoff: `Kross One Admin.dc.html`
- Shared catalog data inside the handoff: `admin-data.js`

Project mapping:

- `index.html` — v2 storefront with the approved client catalog, phone/tablet orbit, premium filter/view panels, expanded search prompts, and responsive navigation revisions.
- `admin.html` — authoritative admin console from the handoff, unmodified.
- `public/support.js` — v2 design runtime, unchanged.
- `public/admin-data.js` — supplied shared catalog (85 products) used by the admin console, unchanged.
- `public/assets/` — curated original handoff artwork plus sourced product imagery for laptops, watches, audio, grooming, fragrances, game discs, laptop bags, and travel cases. Owner-supplied media is not packaged or displayed.
- `ASSET_SOURCES.md` — traceable manufacturer product pages and direct image origins for every newly added official product asset.
- `scripts/build.mjs` — lossless static production build for both pages.
- `scripts/qa.mjs` — approved v2 revision fingerprint, responsive-orbit, expanded prompt, official-media, runtime, asset, route, enquiry-flow, admin-gate, and output-integrity checks.

## Storefront behaviour carried by the handoff source

1. Dark editorial storefront with the v2 typography, hero, product staging, brand wall, shop story, and responsive navigation supplied by the handoff. Large desktop screens retain the vertical product lanes; phone and tablet screens use the client-requested circular product orbit around the aligned hero content.
2. The animated search examples cover specific Apple and Samsung configurations plus confirmed gaming, laptop bag, travel case, HP, Braun, Philips, JBL, Bose, and fragrance inventory. Search, premium category and condition filters, grid/list views, product galleries, related-product cards, and individual product routes are driven by the expanded catalog.
3. Visitors build an enquiry list and send the complete selection to Kross One in one pre-filled WhatsApp message.
4. The Galaxy Z Flip 8 and Z Fold 8 launch stage uses the two new handoff PNG assets and a dedicated pre-booking WhatsApp action.
5. The Inside section and Visit page include the handoff's animated product presentation, shop details, opening hours, and Leaflet map.
6. The expanded catalog includes the exact HP OmniBook X Flip 14-fm0013dx, Apple Watch Ultra 2, Samsung Galaxy Watch8 44mm, Braun Series 5 51-B1000s, Philips MG5921/15, JBL Tune 770NC, Bose audio, identified fragrances, current game discs, Lenovo laptop bags, and Pierre Cardin travel cases. New imagery is source-documented in `ASSET_SOURCES.md`; private owner reference media is never shipped.

## Route map

| Route | View |
| --- | --- |
| `#/` | Home |
| `#/shop` | All products |
| `#/shop/:category` | Filtered product collection |
| `#/p/:product-id` | Product detail |
| `#/technology` | Inside the technology section |
| `#/visit` | Shop location and contact details |

## Admin console (`admin.html`)

Staff console from the handoff. Demo credentials are shown on the sign-in card (`admin@krossone.ug` / `admin2026`), followed by a two-factor code presented in an SMS preview. Sessions auto-lock after 30 minutes, five failed attempts trigger a lockout, and every action is written to an append-only audit log.

Sections: Overview (live KPIs, revenue-by-order bars, payment and channel mix, 7-day trend, sales by category, low-stock alerts), Orders (search/filter, detail drawer, status advance, refunds, rider assignment, internal notes, CSV export, receipts), In-store point-of-sale, Inventory (stock adjust, price overrides), Customers (WhatsApp messaging), Payments ledger, Discounts & promos, Delivery riders, Reviews moderation, Returns & repairs, Expense tracking, Supplier purchase orders, Staff roles & permissions, Security, and Audit log. A Daily summary email composer sits in the Overview header.

The console remains a separate browser-local prototype and seeds realistic demo data on first load. The v2 storefront's enquiry list is sent directly through WhatsApp and is not written into the admin console.

## Verification performed

- `npm run build` succeeds and creates byte-identical `dist/index.html` and `dist/admin.html` output.
- `npm run qa` verifies the approved v2 client revision, expanded search prompts, phone/tablet orbit, official catalog media, owner-media exclusion, runtime/foldable artwork, both design components, local references, routes, enquiry flow, and byte-identical production output.

## Prototype boundaries

The v2 storefront is an enquiry-led static prototype: catalog content is embedded in the handoff, prices and availability are requested through WhatsApp, and the enquiry list is browser-session state. The separate admin console still uses browser-local prototype data, and its credentials are demo values shown on the sign-in card. Before production launch, connect the catalogue, inventory, pricing, enquiries, customer communications, and admin access to verified backend services.

The supplied runtime loads React, ReactDOM, Babel, typography, and Leaflet resources from external CDNs. A production hardening pass should self-host critical runtime dependencies and confirm licensing/availability without changing the approved design.
