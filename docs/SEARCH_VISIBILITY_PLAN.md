# Why the site is invisible for "apple shop kampala" and "iphones in kampala", and what actually fixes it

This document is the diagnosis and the action plan. It is deliberately blunt, because the
work so far has been aimed at the wrong target and that is worth saying plainly.

## The single most important finding

**Both target queries are answered by the Google local pack, not by organic web results.**

Search "apple shop kampala" or "iphones in kampala" from Uganda and the top of the page is
a Places block: three businesses, a map, star ratings, review counts. The first ordinary
website link sits underneath it — below the fold on a phone.

That block is not a website ranking. It is a ranking of **Google Business Profiles**. No
change to this repository, or to any website, can place a site above it. A site can rank
first in the organic results and still appear to be "not at the top" because the local
pack occupies the top.

What is actually winning those positions today:

| Business in the pack | Rating | Reviews |
| --- | --- | --- |
| APPLE SHOP UGANDA IPHONES SERVICES | 4.3 | 272 |
| Apple Store & Repairs / Apple Center Kampala | 4.6 | 160 |
| Apple Store Kampala iPhone Gadget Center | 4.4 | 25 |
| iPhones in Kampala | 4.5 | 2 |

Two things to read from that table:

1. **Review count is the visible differentiator.** The leaders have 160–272 reviews.
2. **The fourth entry ranks on 2 reviews because its business name is literally the search
   query.** "APPLE SHOP UGANDA IPHONES SERVICES" is the same tactic. Google's guidelines
   prohibit keyword-stuffed business names, and profiles get suspended for it. Do not copy
   it. It is noted here only so nobody concludes these competitors have some technique the
   site is missing — their advantage is a name and a review pile, not better HTML.

There is a second effect worth knowing. The screenshots were taken from **Kyengera**,
roughly 13–15 km from Lugogo Mall. Local pack results are strongly weighted by the
searcher's distance from the business. Testing from Kyengera is close to a worst case for a
Lugogo shop; the same search from Lugogo, Nakawa or Kololo will look different. Before
concluding "we rank nowhere", test from a few locations.

## Priority order

Ranked by actual effect on the two target queries. Note that item 1 is not a code task.

### 1. Google Business Profile — the highest-leverage action by a wide margin

Nothing in this repository competes with this. Required:

- **Claim and verify** the profile for Kross One Gadgets at Shop #18A, Lugogo Mall. If no
  profile exists, the shop cannot appear in the local pack at all, which would fully
  explain its absence.
- **Primary category: `Electronics store`.** Add secondary categories that match reality
  (`Cell phone store`, `Mobile phone repair shop` only if repairs are genuinely offered).
  Category is one of the strongest local ranking inputs and is frequently set wrong.
- **Use the real business name.** "Kross One Gadgets" — not "Kross One Gadgets Apple Shop
  Kampala iPhones". The short-term gain is not worth a suspension.
- **Complete every field**: address, service area, hours (including holiday hours), phone,
  the website URL, opening date, and the products/services lists.
- **Photos**: exterior with signage, interior, staff, products. Add new ones regularly.
- **Reviews**: ask every satisfied customer, in person, at the moment of sale. A QR code on
  the counter linking to the review form works. Reply to every review. Never buy reviews —
  Google detects purchased review velocity and the penalty is severe and hard to reverse.
- **Keep NAP identical** (name, address, phone) across the website, the profile, the mall
  directory, Facebook, Instagram and any Uganda business directory. Inconsistency here
  quietly suppresses local ranking.

#### Open item: the Lugogo Mall directory lists a different business name

A web search for the shop surfaces a Lugogo Mall store-directory page at
`lugogomall.com/store/kings-gadgets/` titled **"Kross Tech"**. That listing carries the
phone number **+256 750 000 981**, which is this shop's own secondary number — it appears
twelve times across this site, in the header call button, the footer, the contact panel
and `llms-full.txt`. It describes the same trade: original phones of all brands, Apple Mac
products, laptops, games, tablets, cameras and accessories.

The listed hours also differ from the site's:

| | Mall directory | This site |
| --- | --- | --- |
| Mon–Sat | 8:00 – 19:30 | 9:00 – 20:00 |
| Sunday | 10:00 – 17:00 | 10:00 – 18:00 |

It carries a third phone number too (`+256 77798000`) that appears nowhere on this site.

This has not been verified directly — it comes from a search result, and the page itself
could not be opened from the build environment. **Check `lugogomall.com/store/kings-gadgets/`
and confirm what it says.** Three possibilities, each needing a different fix:

1. It is this business under a former or alternate trading name. Ask the mall to correct
   the name, hours and phone numbers to match the Google Business Profile exactly.
2. It is a related or sister business. Decide which name is the one being promoted, and
   make sure the two do not share a phone number — a shared number merges the entities in
   Google's eyes and splits the local signal between them.
3. It is a stale or erroneous mall listing. Ask for it to be corrected or removed.

Why this matters more than it looks: a shopping mall's own directory is one of the
strongest and most trusted local citations a shop inside it can have. When the most
authoritative nearby source states a different business name, different hours and an extra
phone number, it actively undermines the consistency Google looks for when deciding which
local entity to trust and rank. This is plausibly a live contributor to the local-pack
absence, and it costs nothing but an email to fix.

Search the business name as a customer would and audit everything that comes back —
directories, social profiles, aggregator sites — for the same three fields.

Realistically this is where months of the ranking gap lives. Reviews accumulate slowly;
starting now matters more than starting perfectly.

#### Ten-minute profile audit

Open the profile and record these. Each one is a known local ranking input, and each is
commonly wrong on a profile that was set up quickly.

| # | Check | Why it matters | Pass condition |
| --- | --- | --- | --- |
| 1 | Is it **verified**? | An unverified profile is not eligible for the local pack at all. | Badge shows verified, no "Claim this business" prompt |
| 2 | **Primary category** | One of the strongest ranking inputs; the wrong one caps the shop out of the query entirely. | `Electronics store`, or `Cell phone store` if phones dominate sales |
| 3 | **Business name** | Must be the real-world name. | "Kross One Gadgets" — no appended keywords |
| 4 | **Review count and rating** | The visible gap against the leaders (160–272 reviews). | Record the number; this is the metric to grow |
| 5 | **Address and pin** | The map pin is often dropped in the wrong part of a mall. | Shop #18A, pin on the correct building |
| 6 | **Phone** | Must match the site and every citation. | `0752 117 111` primary, consistently |
| 7 | **Website field** | Sends authority to the site and drives discovery clicks. | `https://www.kross-one-gadgets.co.ug/` |
| 8 | **Hours** | Mismatched hours split trust across citations. | Mon–Sat 9:00–20:00, Sun 10:00–18:00 |
| 9 | **Photos** | Profiles with current photos convert and rank better. | Exterior with signage, interior, products, staff |
| 10 | **Products / Services** | Lets the profile match model-level queries. | Top models listed with prices |
| 11 | **Duplicate profiles** | Two profiles for one shop split all signals. | Search the name and the phone; merge any duplicate |

Item 11 connects to the open item below — check specifically whether a second profile
exists under a different name at the same address.

### 2. Publish prices

Every "People also ask" box on both target SERPs is a price question:

- "How much is an iPhone 13 in UGX?"
- "What is the cheapest iPhone in Uganda?"
- "How much does an iPhone 17 cost in Uganda?"
- "Where is the iPhone cheapest now?"

The competitors who rank organically show prices directly in their snippets — GadgetCraze
shows "iPhone 15 256GB. 2,450,000 UGX", kniezOn shows "Ush 650,000 UGX". This site
published no prices at all, which is the largest single content gap against the demand.

The build now supports prices. Edit **`data/pricing.json`**:

```json
"products": {
  "iphone-17-pro-max": { "price": 6200000, "priceHigh": 8900000, "condition": "new", "availability": "InStock", "note": "256GB–2TB, sealed" },
  "galaxy-s26-ultra":  { "price": 5400000, "condition": "new", "availability": "LimitedAvailability" }
}
```

Then `npm run build`. Each priced product automatically gains:

- a visible price on its product page, its collection cards and the price list;
- `Offer` or `AggregateOffer` structured data with currency, condition and availability;
- a rewritten title and meta description built around the price.

A product left out of the file still builds — it shows "ask today's price" and carries no
Offer markup. **This is intentional: no price is published unless the shop supplies it.**
Publishing a price the shop will not honour is worse than publishing none, both for
customers and because Google penalises structured-data prices that mismatch the page.

This is the single highest-return content action available, and it is data entry the shop
must do. Start with the twenty models most often asked for.

### 3. Indexing

Search Console reported **9 indexed pages against 78 not indexed**. That is the mechanical
reason the site cannot rank: 78 pages were not competing at all.

The cause was thin, near-duplicate product pages — roughly 250–550 characters of unique
text each, wrapped in about 500 characters of boilerplate identical across all 71. Google
classifies that pattern as "Crawled — currently not indexed".

Fixed in this change (see the section below). After deploying, in Search Console:

1. Submit `https://www.kross-one-gadgets.co.ug/sitemap.xml` again.
2. Use **URL Inspection → Request indexing** on the home page, `/prices/`,
   `/collections/apple-products-kampala/`, `/collections/iphones-kampala/` and two or
   three product pages. Do not request indexing for all 86 — it does not help and the
   quota is small.
3. Watch the **Page indexing** report weekly. The number to move is "Crawled — currently
   not indexed" falling and "Indexed" rising. Expect movement over two to six weeks, not
   days.
4. Do not repeatedly re-request indexing for the same URL. It changes nothing.

### 4. Authority

The site is roughly a month old with very little inbound linking. New domains rank slowly
regardless of technical quality, and the organic competitors here (jiji.ug, badili.ug) are
established marketplaces with years of accumulated authority.

Legitimate ways to build it, in rough order of value for a Kampala retailer:

- A listing and link from the **Lugogo Mall** website and directory.
- Supplier and distributor pages that list authorised stockists.
- Local technology and business press — a genuine story, a new-stock announcement, a
  sponsorship.
- Uganda business directories that real people use.
- Active Instagram, TikTok and Facebook profiles linking to the site, kept consistent with
  the Business Profile.

Do not buy bulk backlinks. They are detectable, they are the most common cause of manual
actions, and recovery costs more than the links ever earned.

### 5. AI search

The site already publishes `llms.txt` and `llms-full.txt`, and `robots.txt` now explicitly
welcomes the answer-engine crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot,
Google-Extended, Applebot and others).

Worth being straight about how this works: AI answer engines mostly retrieve from the
normal search index and from pages they can crawl. They do not read a special file and rank
a business higher because of it. `llms.txt` helps an assistant that has already found the
site state its facts correctly; it does not create discovery on its own. The things that
make a site citable by an AI system are the same things that make it indexable by Google —
crawlable HTML, specific factual content, clear entity data, consistent identity — plus,
for a local business, a well-maintained Business Profile, because that is what most
assistants resolve local queries against.

So AI visibility follows from items 1 to 4 rather than substituting for them.

## What changed in the code

| Change | Why |
| --- | --- |
| `data/pricing.json` + `scripts/pricing.mjs` | Price book. Emits `Offer`/`AggregateOffer` only where a real price exists. Fixes "Product snippets: 0 valid". |
| `scripts/product-content.mjs` | Per-product editorial, spec narrative, comparison and FAQs. Product pages went from ~1,050 to ~5,270 characters, with unique content up roughly 4x. |
| `/prices/` page | New page targeting UGX price queries, grouped by category, with FAQ structured data. |
| Home page directory | A visible link/content block appended to the home page. The home page is rendered client-side and its static HTML is a template of `{{ }}` bindings, so crawlers previously saw few real links. Unique internal links on the home page went from 4 to 25. |
| Header and footer links | `/collections/iphones-kampala/` was not linked from the home page at all, despite targeting a primary keyword. Added, along with `/prices/`. |
| `robots.txt` | Explicit allow for AI answer-engine crawlers. |
| `scripts/qa.mjs` | New guards: product pages must exceed 2,500 characters, Offer markup must match the price book exactly, the home directory must stay visible and carry the retailer disclosure. |
| `scripts/build.mjs` | `llms-full.txt` was never origin-rewritten; it is now. Build reports price coverage. |

The home page directory is fenced by HTML markers and QA asserts that the rest of
`dist/index.html` is still byte-identical to the approved storefront, so the design
runtime's markup remains under its existing integrity check.

## An honest statement about outcomes

No one can guarantee a number-one Google ranking, and any agency or tool that offers one is
selling something. Google's results are not a system anybody outside Google controls.

What can be stated accurately:

- The site had a mechanical indexing failure. That is now addressed, and it was a genuine
  blocker — unindexed pages cannot rank at any price.
- The largest remaining content gap is prices, and it is closeable this week by the shop.
- For the two specific queries requested, the local pack is the battleground, and that is
  won through the Google Business Profile and real customer reviews over months.
- Organic position against established marketplaces on a one-month-old domain takes
  quarters, not weeks.

The realistic near-term win is not "#1 for iphones in kampala". It is ranking for the long
tail the shop can actually take — "iphone 17 pro max price in uganda", "galaxy z fold 8
kampala", "where to buy macbook in lugogo" — while the Business Profile and review base
grow toward competing for the head terms. That long tail converts better anyway: someone
searching an exact model with "price" is closer to buying than someone searching "apple
shop kampala".

## Verification after deploying

```bash
npm run build && npm run qa
```

Then check the live responses:

```bash
curl -s https://www.kross-one-gadgets.co.ug/robots.txt
curl -s https://www.kross-one-gadgets.co.ug/sitemap.xml | grep -c '<loc>'   # expect 86
curl -sI https://www.kross-one-gadgets.co.ug/prices/ | head -1              # expect 200
curl -s https://www.kross-one-gadgets.co.ug/products/iphone-17-pro-max/ | grep -c 'FAQPage'
```

Validate structured data at <https://search.google.com/test/rich-results> for one product
page and the price list.

## One deployment question to settle

`.github/workflows/deploy-pages.yml` builds and deploys to GitHub Pages on every push to
`main`, while DNS for `kross-one-gadgets.co.ug` currently resolves to Vercel. There is no
`CNAME` file in `public/`, so if GitHub Pages is enabled on this repository it is serving a
second public copy of the whole site at `codingxperience.github.io/kross_one_gadget_shop/`.

Every page carries an absolute canonical URL pointing at the custom domain, which is what
should make Google consolidate the two — so this is a risk to close, not an emergency.
Check whether Pages is enabled (repository → Settings → Pages). If the site is served by
Vercel, disable the Pages workflow. If it is served by Pages, the Vercel configuration is
the redundant one. Running both indefinitely is worth avoiding either way.
