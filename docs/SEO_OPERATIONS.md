# Search and AI discovery operations

This project treats search visibility as an engineering and publishing system, not a keyword switch. The production build creates stable HTML URLs, machine-readable entity data, a complete sitemap, factual store answers and consistent brand metadata. Search engines still decide ranking, site links, favicons and rich-result presentation.

## What the build publishes

- One canonical home page with `ElectronicsStore`, `WebSite` and navigation structured data.
- Ten crawlable collection pages under `/collections/` with visible catalogue content, internal links, factual customer questions and matching `FAQPage` data.
- One crawlable page for every catalogue item under `/products/`, with `Product` and `BreadcrumbList` data.
- A generated `sitemap.xml` containing the home page, every collection and every product.
- A generated `robots.txt` pointing to the canonical sitemap.
- A stable 512 × 512 brand icon and versioned 1200 × 630 social preview.
- `llms.txt` as a supplementary factual index for agents that choose to read it. It is not treated as a ranking control.
- A `noindex` response header and metadata for the browser-local admin prototype.

No offer, review, rating, availability or warranty value is added unless it is supported by real store data. This protects customers and avoids misleading structured data.

## Canonical domain control

The build uses `PUBLIC_SITE_URL` as its single canonical origin. The default is the live custom domain:

```text
https://www.kross-one-gadgets.co.ug
```

To migrate to the requested singular hostname, first make sure the domain is registered, added to the same Vercel project, issued a valid certificate and resolving in public DNS. Then set this Vercel production environment variable and redeploy:

```text
PUBLIC_SITE_URL=https://www.kross-one-gadget.co.ug
```

Do not switch canonical URLs before the new hostname resolves. After it is live, configure permanent redirects from all old hosts—`www` and apex—to the one canonical singular host. Keep the old domain connected for at least twelve months so existing links and Google signals can move through the redirects.

As checked on 2026-08-09, `kross-one-gadget.co.ug` and `www.kross-one-gadget.co.ug` did not resolve in public DNS. That external prerequisite must be completed before the code setting is changed.

## Deployment verification

Run these commands before every production release:

```bash
npm run build
npm run qa
```

Then verify the deployed responses:

1. The home page renders without a red design-runtime error.
2. `/googlee264a0cdaaba06d8.html` returns the original verification token.
3. `/robots.txt` points to the chosen canonical domain.
4. `/sitemap.xml` returns every collection and product URL on that domain.
5. `/collections/mobiles/` and one `/products/…/` URL return meaningful HTML without requiring JavaScript.
6. `/admin.html` returns `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`.
7. The home response includes the Content Security Policy and does not require `unsafe-eval`.

## Google Search Console release routine

1. Submit the canonical `/sitemap.xml` once the deployment is live.
2. Inspect the home page, the mobiles collection, the laptops collection, the visit page and two representative product pages.
3. Request indexing only after the live inspection shows the correct canonical URL and rendered content.
4. Monitor Page indexing, HTTPS, Core Web Vitals, rich-result reports and search queries. Fix causes instead of repeatedly requesting indexing.
5. When changing domains, add and verify the new Search Console property, submit its sitemap and use the Change of Address workflow if it is available for the property type.

## Authority and local discovery

Technical SEO creates eligibility; competitive ranking also depends on reputation and useful first-party information.

- Maintain a complete Google Business Profile with the exact business name, Shop #18A address, phones, hours, website and current storefront photos.
- Keep name, address and phone details consistent across the website, Maps, mall directory, social profiles and legitimate Uganda business directories.
- Ask real customers for honest Google reviews after completed purchases. Never generate or buy reviews.
- Earn relevant citations from the mall, suppliers, local technology publications, events and community organisations. Never buy bulk backlinks.
- Publish only inventory and guidance the store can verify. Add real price and availability feeds later when a production catalogue backend exists.
- Review Search Console queries monthly and improve pages that already receive relevant impressions before creating more pages.

## AI discovery principles

AI systems benefit from the same clear evidence as search engines: stable URLs, visible factual content, structured entities, explicit provenance and consistent business identity. The collection questions are visible to people and repeated in structured form; they are not hidden prompt text. The site does not make invented “best”, “authorized”, price, stock or warranty claims.

`llms.txt` is intentionally conservative. It identifies the business, primary collections and the rule that the store must confirm current commercial facts. It complements the crawlable HTML and structured data; it does not replace them.

## Backend boundary

The public storefront is static and sends enquiries to WhatsApp. It has no first-party API endpoint to rate-limit. The current admin page is explicitly a browser-local prototype, so its demo login must not be presented as production authentication.

A production commerce backend requires an approved data store, staff identity provider, server-side authorization model, durable audit log, encrypted secrets, inventory source, media storage and a distributed rate limiter. Those services must be selected and provisioned before credentials or real customer data are introduced. Security headers harden this static deployment but do not turn the prototype admin page into a secure backend.
