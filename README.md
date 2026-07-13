# Kross One Gadget Shop

Production-ready static prototype based directly on the latest supplied Claude Design handoff. The handoff is treated as the visual and content source of truth; this revision adds only the five client-requested refinements documented below.

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

The build copies the authoritative storefront and its public assets to `dist/` without transforming the design-export HTML. This keeps the production output visually faithful and avoids altering the custom design runtime.

## Authoritative handoff

The primary storefront in both supplied archives is identical:

- `Kross One Gadget Shop Redesign.zip`
- `Kross One Gadget Shop Redesign-handoff (1).zip`
- Primary source inside the handoff: `project/Kross One Gadget Shop.dc.html`
- Primary source SHA-256 before the requested refinements: `71B52C18D57485517B35279D3ED287A5B434A57D28DBE049EEED6C023EA3A99B`

Project mapping:

- `index.html` — authoritative storefront plus the five requested refinements.
- `public/support.js` — supplied design runtime, unchanged.
- `public/assets/` — all 50 curated handoff assets, including `iphone17-navy-back.jpeg` from the latest update.
- `scripts/build.mjs` — lossless static production build.
- `scripts/qa.mjs` — syntax, asset, navigation, authentication-gate, dark-mode, and output-integrity checks.

## Requested refinements implemented

1. Dark mode is the default in the raw document, component state, normal browser view, and embedded/iframe view. A visitor's explicit saved theme preference is still respected.
2. Checkout and payment actions require an account. Direct signed-out access to `#/checkout` renders Sign in, preserves checkout intent through Sign in/Create account, and returns the authenticated user to Checkout.
3. Input and textarea text/carets inherit the active theme color, fixing black text on dark fields.
4. In dark mode, Cart is white with black label/icon and a black count badge with a white number, on desktop and mobile.
5. Desktop right-side navigation is ordered Saved → Cart → Sign in/account.

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

## Verification performed

- `npm run build` succeeds and creates byte-identical `dist/index.html` output.
- `npm run qa` parses the component and supplied runtime, verifies all 42 local asset references, confirms all 50 packaged assets, and checks the five refinements.
- Microsoft Edge rendered desktop at 1440 × 1000 and mobile at 390 × 844.
- Dark mode was verified in standalone and embedded contexts.
- Computed dark input text matched the page foreground color.
- Computed Cart colors and desktop navigation positions matched the requested treatment/order.
- Signed-out direct checkout was blocked; checkout intent survived account creation and opened Checkout after registration.
- Nineteen routes rendered their expected labelled view with no page-level browser exceptions.

## Prototype boundaries

The supplied handoff uses browser-local storage for accounts, carts, saved items, orders, and theme preference. Its payment, order, delivery, stock, product, review, and tracking data are prototype presentation data. Before production commerce launch, connect authentication, catalogue/inventory, pricing, payments, order management, delivery, and customer communications to verified backend services.

The supplied runtime also loads React, ReactDOM, Babel, Instrument Sans, some brand icons, and several catalogue images from external CDN URLs. A production hardening pass should self-host critical runtime dependencies and confirm licensing/availability for every remote asset without changing the approved design.
