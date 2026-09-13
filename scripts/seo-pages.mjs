import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { siteUrl } from './site-config.mjs';
import { loadPricing, offerSchema, priceRangeLabel, conditionText, availabilityText } from './pricing.mjs';
import { buildProductContent, relatedProducts } from './product-content.mjs';

export { siteUrl };

const categoryLabels = {
  'game-discs': 'Game Discs',
  bags: 'Laptop Bags',
  travel: 'Travel & Trolley Bags',
  mobiles: 'Mobiles',
  laptops: 'Laptops',
  tablets: 'iPads & Tablets',
  audio: 'Audio',
  watches: 'Smart Watches',
  gaming: 'Gaming',
  cameras: 'Cameras',
  accessories: 'Accessories',
  lifestyle: 'Fragrance & Grooming'
};

export const collectionPages = [
  { slug: 'shop', title: 'Shop Premium Gadgets in Kampala', description: 'Browse Apple, Samsung, laptops, iPads, audio, watches, gaming, bags and lifestyle essentials at Kross One Gadgets, Lugogo Mall.', categories: null },
  { slug: 'mobiles', title: 'Apple & Samsung Phones', description: 'Explore current Apple iPhone, Samsung Galaxy Ultra and Galaxy Fold-series devices at Kross One Gadgets in Lugogo Mall.', categories: ['mobiles'] },
  {
    slug: 'apple-products-kampala',
    title: 'Apple Products & iPhones in Kampala, Uganda',
    seoTitle: 'Apple Shop Kampala & Uganda',
    description: 'Compare iPhone, iPad, MacBook, Apple Watch and AirPods at Kross One Gadgets, Lugogo Mall. Confirm today’s stock, price, condition and warranty.',
    productFilter: 'apple',
    liveRoute: '/#/shop',
    localIntent: true,
    inventoryTitle: 'Apple devices in the Kross One catalogue',
    about: ['Apple products', 'iPhones', 'MacBook', 'iPad', 'Apple Watch', 'AirPods', 'Kampala', 'Uganda'],
    content: [
      {
        heading: 'Looking for an Apple shop in Kampala?',
        paragraphs: [
          'Kross One Gadgets is an independent electronics retailer at Shop #18A, Lugogo Mall. Customers looking for Apple products in Kampala can compare current iPhone, iPad, MacBook, Apple Watch and AirPods models here before contacting the shop.',
          'The catalogue is a model guide, not a promise that every colour or storage option is on the shelf. The team confirms the exact device, condition, price and applicable warranty for the item available that day.'
        ]
      },
      {
        heading: 'Apple products for Kampala and Uganda customers',
        paragraphs: [
          'The range covers current iPhones, MacBook Air and MacBook Pro, iPad Pro and iPad Air, Apple Watch and AirPods. Customers outside Kampala can ask whether delivery is available to their location in Uganda after the exact item has been confirmed.'
        ],
        points: ['Confirm the exact model and generation', 'Check storage, colour and device condition', 'Ask for the warranty terms on that item', 'Arrange Lugogo Mall collection or ask about delivery']
      },
      {
        heading: 'An independent Apple-products retailer',
        paragraphs: [
          'Kross One Gadgets does not present itself as an Apple-owned store or Apple Authorised Reseller. It is an independent Kampala electronics shop that helps customers verify the details of the device offered before purchase.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Where can I shop for Apple products in Kampala?',
        answer: 'Visit Kross One Gadgets at Shop #18A, Lugogo Mall, Lugogo Bypass, Kampala. The catalogue includes iPhone, iPad, MacBook, Apple Watch and AirPods models; contact the store to confirm what is available today.'
      },
      {
        question: 'Can I collect an Apple device from Lugogo Mall?',
        answer: 'Yes. Once the team confirms the exact model, price and condition, you can arrange collection from Shop #18A at Lugogo Mall or ask whether delivery is available.'
      },
      {
        question: 'Is Kross One Gadgets an official Apple Store?',
        answer: 'Kross One Gadgets is an independent electronics retailer. Before purchase, the team confirms the exact item condition, applicable warranty and supplier terms for the device in stock.'
      },
      {
        question: 'Can customers looking for an Apple shop in Uganda order from outside Kampala?',
        answer: 'Customers elsewhere in Uganda can contact Kross One Gadgets with the exact Apple model they need. The team will confirm stock and advise whether delivery is available to that location.'
      }
    ]
  },
  {
    slug: 'iphones-kampala',
    title: 'iPhones in Kampala & Uganda',
    seoTitle: 'iPhones Kampala & Uganda',
    description: 'Compare current iPhones at Kross One Gadgets, Shop #18A, Lugogo Mall, Kampala. Confirm today’s model, storage, colour, price, condition and warranty.',
    productFilter: 'iphone',
    liveRoute: '/#/shop/mobiles',
    localIntent: true,
    inventoryTitle: 'Current iPhone models in the catalogue',
    about: ['iPhones', 'iPhone shop', 'Apple smartphones', 'Kampala', 'Uganda'],
    content: [
      {
        heading: 'Compare iPhones in Kampala before you visit',
        paragraphs: [
          'Kross One Gadgets lists the iPhone models customers most often ask for, including the current iPhone 17 range and selected earlier Pro models. Each product page shows the model details available for comparison.',
          'Because phone stock changes quickly, send the exact model, storage and preferred colour on WhatsApp before travelling to Lugogo Mall.'
        ]
      },
      {
        heading: 'Brand-new and certified pre-owned iPhones',
        paragraphs: [
          'Condition matters as much as the model name. Kross One Gadgets confirms whether the particular iPhone is brand new or certified pre-owned, together with its warranty terms. A condition shown for one listing is never silently applied to another device.'
        ],
        points: ['Model and generation', 'Storage and colour', 'Brand-new or certified condition', 'Price and item-specific warranty']
      },
      {
        heading: 'Shopping for an iPhone elsewhere in Uganda?',
        paragraphs: [
          'Customers outside Kampala can ask whether delivery is available to their district. The shop first confirms the exact iPhone and purchase details, then advises on collection or delivery options.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Which iPhone models are available in Kampala?',
        answer: 'The online catalogue shows the iPhone models handled by Kross One Gadgets. Stock changes, so contact the store to confirm the exact model, storage, colour and condition available today.'
      },
      {
        question: 'Where can I view or collect an iPhone in Kampala?',
        answer: 'Kross One Gadgets is at Shop #18A, Lugogo Mall, Lugogo Bypass, Kampala. Confirm the model with the team before travelling to the shop or arranging delivery.'
      },
      {
        question: 'How do I confirm an iPhone price and warranty?',
        answer: 'Send the model and preferred storage or colour by WhatsApp. The store will confirm the current price, whether the item is brand new or certified pre-owned, and the warranty terms for that exact device.'
      },
      {
        question: 'Where is the Kross One iPhone shop in Kampala?',
        answer: 'Kross One Gadgets is at Shop #18A, Lugogo Mall on Lugogo Bypass, Kampala. Contact the team before visiting so the requested iPhone can be confirmed.'
      }
    ]
  },
  {
    slug: 'samsung-galaxy-ultra-kampala',
    title: 'Samsung Galaxy Ultra in Kampala & Uganda',
    seoTitle: 'Samsung Galaxy Ultra Kampala & Uganda',
    description: 'Compare Samsung Galaxy S26 Ultra models at Kross One Gadgets, Lugogo Mall, Kampala. Confirm today’s storage, colour, price and warranty before you visit.',
    productFilter: 'samsung-ultra',
    liveRoute: '/#/shop/mobiles',
    localIntent: true,
    inventoryTitle: 'Samsung Galaxy Ultra models in the catalogue',
    about: ['Samsung Galaxy Ultra', 'Samsung Galaxy S26 Ultra', 'Samsung phones', 'Kampala', 'Uganda'],
    content: [
      {
        heading: 'Latest Samsung Galaxy Ultra phones in Kampala',
        paragraphs: [
          'Kross One Gadgets carries Samsung flagship models through its Lugogo Mall shop. The current catalogue includes the Samsung Galaxy S26 Ultra and its available catalogue variations for customers comparing the latest Ultra phone in Kampala.',
          'Contact the shop before travelling so the exact storage, colour, price and warranty can be confirmed for the device available that day.'
        ]
      },
      {
        heading: 'Samsung Galaxy S26 Ultra buying details',
        paragraphs: [
          'The Galaxy S26 Ultra catalogue highlights Samsung’s current Ultra flagship, including its 6.9-inch display, 200MP main camera and integrated S Pen. Final purchase details come from the exact device and supplier terms, not a generic promise.'
        ],
        points: ['Confirm storage and colour', 'Ask for today’s price', 'Verify the exact warranty terms', 'Arrange Lugogo Mall collection or ask about delivery']
      },
      {
        heading: 'Samsung Ultra enquiries from across Uganda',
        paragraphs: [
          'Customers outside Kampala can send the requested Galaxy Ultra model to the shop. Kross One Gadgets will confirm the item first and advise whether delivery is available to the customer’s location.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Where can I buy a Samsung Galaxy Ultra in Kampala?',
        answer: 'Visit Kross One Gadgets at Shop #18A, Lugogo Mall, Lugogo Bypass, Kampala. Confirm the exact Samsung Ultra model and stock before travelling.'
      },
      {
        question: 'Is the Samsung Galaxy S26 Ultra available in Kampala?',
        answer: 'The Galaxy S26 Ultra is included in the Kross One Gadgets catalogue. Contact the shop to confirm the storage, colour and exact device available today.'
      },
      {
        question: 'Can I order a Samsung Ultra from elsewhere in Uganda?',
        answer: 'Send the requested model and your location to Kross One Gadgets. The team will confirm the phone and advise whether delivery is available to your area.'
      },
      {
        question: 'How do I confirm the Samsung Ultra price and warranty?',
        answer: 'Ask for the exact model and configuration on WhatsApp. Kross One Gadgets will reply with today’s price and the warranty terms for that particular item.'
      }
    ]
  },
  { slug: 'laptops', title: 'Laptops', description: 'Browse MacBook Air, MacBook Pro and HP laptop options at Kross One Gadgets in Kampala.', categories: ['laptops'] },
  { slug: 'ipads-tablets', title: 'iPads & Tablets', description: 'Browse current iPad Pro, iPad Air, iPad mini and iPad models at Kross One Gadgets in Lugogo Mall.', categories: ['tablets'] },
  { slug: 'audio', title: 'Headphones & Speakers', description: 'Explore Bose, JBL, Apple and premium portable-audio options at Kross One Gadgets in Kampala.', categories: ['audio'] },
  { slug: 'watches', title: 'Smart Watches', description: 'Browse Apple Watch, Samsung Galaxy Watch, HUAWEI and smart-watch options at Kross One Gadgets.', categories: ['watches'] },
  { slug: 'gaming', title: 'Gaming & Game Discs', description: 'Explore consoles, controllers and current PlayStation and Nintendo game discs at Kross One Gadgets.', categories: ['gaming', 'game-discs'] },
  { slug: 'bags-travel', title: 'Laptop Bags & Travel', description: 'Browse professional laptop bags and trolley cases at Kross One Gadgets, Lugogo Mall.', categories: ['bags', 'travel'] },
  { slug: 'fragrance-grooming', title: 'Fragrance & Grooming', description: 'Explore premium fragrances and personal-grooming essentials at Kross One Gadgets in Kampala.', categories: ['lifestyle'] },
  { slug: 'visit', title: 'Visit Kross One Gadgets', description: 'Find Kross One Gadgets at Shop #18A, Lugogo Mall, Lugogo Bypass, Kampala. Call or WhatsApp for today’s price, condition and warranty.', categories: [] }
];

const markup = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');

const absoluteUrl = (value) => value.startsWith('http') ? value : `${siteUrl}/${value.replace(/^\//, '')}`;
const collectionUrl = (slug) => `${siteUrl}/collections/${slug}/`;
const productUrl = (id) => `${siteUrl}/products/${id}/`;
const productImage = (product) => absoluteUrl(product.img || 'assets/og-kross-one-gadgets-v3.png');
const categoryName = (category) => categoryLabels[category] || 'Gadgets';
const collectionSlugForCategory = {
  mobiles: 'mobiles', laptops: 'laptops', tablets: 'ipads-tablets', audio: 'audio', watches: 'watches',
  gaming: 'gaming', 'game-discs': 'gaming', bags: 'bags-travel', travel: 'bags-travel', lifestyle: 'fragrance-grooming'
};

const appleProductPattern = /(?:iphone|ipad|macbook|apple watch|airpods|beats)/i;

const productsForCollection = (page, catalog) => {
  if (page.productFilter === 'apple') return catalog.filter((product) => appleProductPattern.test(product.name));
  if (page.productFilter === 'iphone') return catalog.filter((product) => /iphone/i.test(product.name));
  if (page.productFilter === 'samsung-ultra') return catalog.filter((product) => /samsung galaxy s\d+ ultra/i.test(product.name));
  return page.categories ? catalog.filter((product) => page.categories.includes(product.cat)) : catalog;
};

export const parseCatalog = (source) => {
  const match = source.match(/\n\s*P = \[([\s\S]*?)\n\s*\];\n\n\s*TYPE = \[/);
  if (!match) throw new Error('Could not find the storefront catalog while generating SEO pages.');

  const catalog = Function(`"use strict"; return [${match[1]}];`)();
  if (!Array.isArray(catalog) || !catalog.length) throw new Error('The storefront catalog is empty.');
  return catalog;
};

const localBusiness = {
  '@type': 'ElectronicsStore',
  '@id': `${siteUrl}/#organization`,
  name: 'Kross One Gadgets',
  url: `${siteUrl}/`,
  image: `${siteUrl}/assets/og-kross-one-gadgets-v3.png`,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/assets/kross-one-gadgets-logo-square.png`,
    width: 512,
    height: 512
  },
  description: 'Apple, Samsung, laptops, watches, audio, gaming, bags and lifestyle essentials at Shop #18A, Lugogo Mall, Kampala.',
  foundingDate: '2013',
  telephone: '+256752117111',
  email: 'kross1gadgets@gmail.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop #18A, Lugogo Mall, Lugogo Bypass',
    addressLocality: 'Kampala',
    addressCountry: 'UG'
  },
  geo: { '@type': 'GeoCoordinates', latitude: 0.32665, longitude: 32.60683 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '18:00' }
  ],
  areaServed: { '@type': 'City', name: 'Kampala' },
  contactPoint: { '@type': 'ContactPoint', telephone: '+256752117111', contactType: 'sales', availableLanguage: 'English' },
  sameAs: [
    'https://instagram.com/krossonegadgetshop',
    'https://tiktok.com/@krossonegadgetshop',
    'https://facebook.com/krossonegadgetshop'
  ],
  knowsAbout: ['Apple iPhone', 'Samsung Galaxy', 'MacBook', 'iPad', 'Apple Watch', 'smartphones', 'consumer electronics'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Kross One Gadgets catalogue',
    itemListElement: [
      { '@type': 'OfferCatalog', name: 'Apple products in Kampala', url: `${siteUrl}/collections/apple-products-kampala/` },
      { '@type': 'OfferCatalog', name: 'iPhones in Kampala', url: `${siteUrl}/collections/iphones-kampala/` },
      { '@type': 'OfferCatalog', name: 'Samsung Galaxy Ultra in Kampala', url: `${siteUrl}/collections/samsung-galaxy-ultra-kampala/` },
      { '@type': 'OfferCatalog', name: 'Samsung phones', url: `${siteUrl}/collections/mobiles/` },
      { '@type': 'OfferCatalog', name: 'Laptops', url: `${siteUrl}/collections/laptops/` },
      { '@type': 'OfferCatalog', name: 'iPads and tablets', url: `${siteUrl}/collections/ipads-tablets/` }
    ]
  }
};

const website = {
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: 'Kross One Gadgets',
  alternateName: 'Kross One Gadget Shop',
  inLanguage: 'en',
  publisher: { '@id': `${siteUrl}/#organization` }
};

const collectionFaqs = (title) => [
  {
    question: `How do I get today’s price for ${title.toLowerCase()}?`,
    answer: 'Open the product or collection and send the prepared WhatsApp enquiry. Kross One Gadgets confirms the current price before you visit or arrange delivery.'
  },
  {
    question: 'Will Kross One Gadgets confirm the exact condition?',
    answer: 'Yes. Ask for the exact model and Kross One Gadgets will confirm whether the available item is brand new or certified pre-owned before purchase.'
  },
  {
    question: 'How is warranty information provided?',
    answer: 'Warranty terms are confirmed for the exact item in stock. The store does not publish a generic warranty where model, condition or supplier terms may differ.'
  }
];

const faqSchema = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer }
  }))
});

const navigation = () => collectionPages.map((page) => ({
  '@type': 'SiteNavigationElement',
  name: page.slug === 'shop' ? 'Shop' : page.title,
  url: collectionUrl(page.slug)
}));

const head = ({ title, description, canonical, image, schema }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${markup(title)} | Kross One Gadgets</title>
  <meta name="description" content="${markup(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/assets/kross-one-gadgets-logo-square.png" type="image/png" sizes="512x512">
  <link rel="apple-touch-icon" href="/assets/kross-one-gadgets-logo-square.png">
  <link rel="alternate" type="text/plain" href="/llms.txt" title="Kross One Gadgets machine-readable summary">
  <meta name="theme-color" content="#08080b">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Kross One Gadgets">
  <meta property="og:title" content="${markup(title)} | Kross One Gadgets">
  <meta property="og:description" content="${markup(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${markup(title)} | Kross One Gadgets">
  <meta name="twitter:description" content="${markup(description)}">
  <meta name="twitter:image" content="${image}">
  <script type="application/ld+json">${json(schema)}</script>
  <style>
    :root { color-scheme: dark; --bg:#08080b; --panel:#121216; --line:rgba(212,175,90,.2); --gold:#d4af5a; --ink:#f4efe4; --muted:#aaa292; }
    * { box-sizing:border-box; }
    html { overflow-x:hidden; }
    body { min-width:320px; margin:0; overflow-x:hidden; color:var(--ink); background:radial-gradient(circle at 50% -20%,rgba(201,146,46,.15),transparent 35%),var(--bg); font:16px/1.55 Arial,sans-serif; }
    img { max-width:100%; }
    a { color:inherit; text-decoration:none; }
    .shell { width:min(1180px,calc(100% - clamp(32px,6vw,72px))); margin:auto; }
    .site-header { position:sticky; top:0; z-index:20; border-bottom:1px solid var(--line); background:rgba(8,8,11,.9); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); }
    .header-inner { min-height:80px; display:flex; align-items:center; justify-content:space-between; gap:clamp(18px,4vw,48px); }
    .brand { min-width:0; display:flex; align-items:center; gap:12px; font-weight:800; letter-spacing:.04em; }
    .brand img { flex:0 0 auto; width:44px; height:44px; border:1px solid rgba(212,175,90,.36); border-radius:50%; object-fit:cover; box-shadow:0 0 24px rgba(212,175,90,.1); }
    .brand span { min-width:0; }
    .brand strong { display:block; white-space:nowrap; font-size:14px; letter-spacing:.09em; }
    .brand small { display:block; overflow:hidden; color:var(--muted); font-size:9px; letter-spacing:.13em; text-overflow:ellipsis; text-transform:uppercase; white-space:nowrap; }
    .primary-nav { flex:0 0 auto; display:flex; align-items:center; justify-content:flex-end; gap:8px; }
    .primary-nav a { min-height:42px; display:inline-flex; align-items:center; justify-content:center; padding:0 17px; border:1px solid var(--line); border-radius:999px; color:#e3dac9; background:rgba(255,255,255,.025); font-size:12px; font-weight:800; letter-spacing:.055em; transition:border-color .2s ease,color .2s ease,background .2s ease,transform .2s ease; }
    .primary-nav a:hover,.primary-nav a:focus-visible { border-color:rgba(212,175,90,.68); color:#f4d88f; background:rgba(212,175,90,.08); transform:translateY(-1px); outline:none; }
    main { min-width:0; padding:clamp(42px,8vw,88px) 0 64px; }
    .eyebrow { margin:0 0 12px; color:var(--gold); font-size:11px; font-weight:800; letter-spacing:.2em; text-transform:uppercase; }
    h1 { max-width:850px; margin:0; overflow-wrap:anywhere; font-size:clamp(37px,6vw,74px); line-height:1; letter-spacing:-.045em; text-wrap:balance; }
    .intro { max-width:700px; margin:20px 0 30px; color:#c2baab; font-size:clamp(17px,2vw,21px); }
    .actions { display:flex; flex-wrap:wrap; gap:12px; margin:28px 0 50px; }
    .button { min-height:46px; display:inline-flex; align-items:center; justify-content:center; padding:0 20px; border:1px solid var(--gold); border-radius:999px; color:#1a1304; background:linear-gradient(135deg,#f0d38a,#c9922e); font-weight:800; text-align:center; }
    .button.secondary { color:#eee6d3; background:transparent; border-color:var(--line); }
    .grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; }
    .card { min-width:0; overflow:hidden; border:1px solid var(--line); border-radius:18px; background:linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.015)); }
    .card a { height:100%; display:flex; flex-direction:column; }
    .card img { width:100%; aspect-ratio:4/3; display:block; object-fit:cover; background:#111; }
    .card div { flex:1; padding:17px; }
    .kicker { color:#988e78; font-size:10px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
    .card h2 { margin:7px 0 8px; overflow-wrap:anywhere; font-size:20px; letter-spacing:-.025em; }
    .card p { margin:0; color:#bdb4a4; font-size:14px; }
    .card-price { margin:10px 0 0 !important; color:var(--gold) !important; font-size:15px !important; font-weight:800; letter-spacing:-.01em; }
    .card-price.ask { color:#9c937f !important; font-size:13px !important; font-weight:600; }
    .related { margin-top:48px; }
    .rel-grid { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:12px; }
    .rel-card { min-width:0; overflow:hidden; border:1px solid var(--line); border-radius:14px; background:rgba(255,255,255,.025); }
    .rel-card a { display:block; text-decoration:none; }
    .rel-card img { width:100%; aspect-ratio:1/1; display:block; object-fit:cover; background:#111; }
    .rel-card div { padding:11px; }
    .rel-card h3 { margin:0 0 5px; overflow-wrap:anywhere; color:#f3ece0; font-size:13px; line-height:1.25; letter-spacing:-.01em; }
    .rel-card span { color:var(--gold); font-size:12px; font-weight:700; }
    .related-more { margin:18px 0 0; font-size:14px; }
    .related-more a { color:var(--gold); }
    .crumbs { margin:0 0 18px; color:#8d846f; font-size:13px; }
    .crumbs a { color:#bdb4a4; text-decoration:none; }
    .crumbs a:hover { color:var(--gold); text-decoration:underline; }
    .price-block { margin:20px 0 4px; padding:17px 19px; border:1px solid rgba(212,175,90,.34); border-radius:16px; background:linear-gradient(145deg,rgba(212,175,90,.11),rgba(255,255,255,.02)); }
    .price { margin:0; color:var(--gold); font-size:clamp(24px,3.4vw,32px); letter-spacing:-.03em; }
    .price-meta { margin:7px 0 0; color:#d7cebd; font-size:14px; font-weight:600; }
    .price-note { margin:9px 0 0; color:#9c937f; font-size:13px; }
    .price-ask { margin:20px 0 4px; color:#c2baab; font-size:15px; }
    .price-group { margin-top:44px; }
    .price-group h2 { margin:0 0 16px; font-size:clamp(21px,2.6vw,28px); letter-spacing:-.025em; }
    .table-wrap { overflow-x:auto; border:1px solid var(--line); border-radius:16px; }
    .table-wrap table { width:100%; min-width:460px; border-collapse:collapse; font-size:14px; }
    .table-wrap th { padding:13px 15px; color:#978b70; font-size:10px; letter-spacing:.13em; text-transform:uppercase; text-align:left; background:rgba(255,255,255,.035); }
    .table-wrap td { padding:13px 15px; color:#d7cebd; border-top:1px solid var(--line); }
    .table-wrap td a { color:#f3ece0; text-decoration:none; font-weight:650; }
    .table-wrap td a:hover { color:var(--gold); text-decoration:underline; }
    .table-wrap .ask { color:#9c937f; }
    .detail { min-width:0; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:clamp(24px,5vw,60px); align-items:start; }
    .detail > * { min-width:0; }
    .detail img { width:100%; max-height:580px; border:1px solid var(--line); border-radius:22px; object-fit:contain; background:#111; }
    .specs { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-top:24px; }
    .spec { min-width:0; overflow-wrap:anywhere; padding:13px; border:1px solid var(--line); border-radius:13px; background:rgba(255,255,255,.025); }
    .spec b { display:block; margin-bottom:4px; color:#978b70; font-size:10px; letter-spacing:.13em; text-transform:uppercase; }
    .editorial { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr)); gap:16px; margin:0 0 32px; }
    .editorial article { min-width:0; padding:clamp(22px,3vw,30px); border:1px solid var(--line); border-radius:20px; background:linear-gradient(145deg,rgba(212,175,90,.075),rgba(255,255,255,.018)); }
    .editorial h2 { margin:0 0 13px; overflow-wrap:anywhere; font-size:clamp(22px,2.7vw,31px); line-height:1.12; letter-spacing:-.025em; }
    .editorial p { margin:0 0 13px; color:#c2baab; }
    .editorial p:last-child { margin-bottom:0; }
    .editorial ul { margin:16px 0 0; padding-left:19px; color:#d7cebd; }
    .editorial li + li { margin-top:7px; }
    .inventory { min-width:0; padding-top:18px; }
    .inventory h2 { margin:0 0 24px; overflow-wrap:anywhere; font-size:clamp(27px,4vw,42px); letter-spacing:-.035em; }
    .local-note { max-width:680px; margin:20px 0 0; padding:16px 18px; border-left:3px solid var(--gold); color:#c9c0af; background:rgba(212,175,90,.06); }
    .visit { max-width:760px; margin-bottom:32px; padding:28px; border:1px solid var(--line); border-radius:22px; background:rgba(255,255,255,.035); }
    .visit h2 { margin-top:0; }
    .faq { margin-top:56px; padding-top:34px; border-top:1px solid var(--line); }
    .faq h2 { margin:0 0 22px; font-size:clamp(27px,4vw,42px); }
    .faq-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }
    .faq article { min-width:0; padding:18px; border:1px solid var(--line); border-radius:16px; background:rgba(255,255,255,.025); }
    .faq h3 { margin:0 0 9px; overflow-wrap:anywhere; font-size:17px; }
    .faq p { margin:0; color:#bdb4a4; font-size:14px; }
    footer { padding:28px 0; border-top:1px solid var(--line); color:#9f9787; font-size:13px; }
    .footer-nav { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px 18px; margin-bottom:20px; }
    .footer-nav a { min-width:0; color:#e1be70; overflow-wrap:anywhere; }
    footer a { color:#e1be70; }
    @media (max-width:900px) {
      .grid,.faq-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .rel-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
      .detail { grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr); }
      .footer-nav { grid-template-columns:repeat(3,minmax(0,1fr)); }
    }
    @media (max-width:720px) {
      .header-inner { min-height:72px; gap:12px; }
      .brand img { width:40px; height:40px; }
      .brand strong { font-size:12px; letter-spacing:.07em; }
      .brand small { max-width:220px; font-size:8px; }
      .primary-nav { gap:6px; }
      .primary-nav a { min-height:38px; padding:0 12px; font-size:10px; }
      main { padding-top:48px; }
      .detail { grid-template-columns:1fr; }
      .footer-nav { grid-template-columns:repeat(2,minmax(0,1fr)); }
    }
    @media (max-width:560px) {
      .shell { width:min(100% - 28px,1180px); }
      .header-inner { min-height:0; flex-wrap:wrap; padding:13px 0 12px; }
      .brand { flex:1 1 auto; }
      .brand small { display:none; }
      .primary-nav { flex:1 0 100%; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
      .primary-nav a { width:100%; min-width:0; }
      h1 { font-size:clamp(34px,12vw,54px); }
      .actions { margin-bottom:38px; }
      .actions .button { flex:1 1 100%; width:100%; }
      .grid,.faq-grid { grid-template-columns:1fr; }
      .rel-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .editorial article,.visit { padding:20px; }
      .card img { aspect-ratio:16/11; }
      .specs { grid-template-columns:1fr; }
      .footer-nav { grid-template-columns:1fr 1fr; gap:9px 14px; }
    }
    @media (max-width:380px) {
      .shell { width:calc(100% - 24px); }
      .brand strong { font-size:11px; }
      .primary-nav a { padding:0 8px; letter-spacing:.02em; }
      .footer-nav { grid-template-columns:1fr; }
    }
  </style>
</head>`;

const pageFooter = () => `<footer><div class="shell"><nav class="footer-nav" aria-label="Explore Kross One Gadgets">${collectionPages.map((page) => `<a href="/collections/${page.slug}/">${markup(page.slug === 'shop' ? 'Shop all gadgets' : page.title)}</a>`).join('')}<a href="/prices/">Price list, Uganda</a></nav>Kross One Gadgets · Shop #18A, Lugogo Mall, Kampala · <a href="tel:+256752117111">0752 117 111</a> · <a href="mailto:kross1gadgets@gmail.com">kross1gadgets@gmail.com</a></div></footer>`;

const pageHeader = () => `<header class="site-header"><div class="shell header-inner"><a class="brand" href="/" aria-label="Kross One Gadgets home"><img src="/assets/kross-one-gadgets-logo-square.png" alt="" width="44" height="44"><span><strong>KROSS ONE GADGETS</strong><small>Shop #18A · Lugogo Mall</small></span></a><nav class="primary-nav" aria-label="Primary"><a href="${collectionUrl('apple-products-kampala').replace(siteUrl, '')}">Apple</a><a href="${collectionUrl('iphones-kampala').replace(siteUrl, '')}">iPhones</a><a href="${collectionUrl('samsung-galaxy-ultra-kampala').replace(siteUrl, '')}">Samsung Ultra</a><a href="/prices/">Prices</a></nav></div></header>`;

const productCard = (product, pricing) => {
  const entry = pricing?.entries.get(product.id);
  const price = entry
    ? `<p class="card-price">${markup(priceRangeLabel(entry, pricing.currency))}</p>`
    : '<p class="card-price ask">Ask today’s price</p>';
  return `<article class="card"><a href="${productUrl(product.id).replace(siteUrl, '')}"><img src="${productImage(product).replace(siteUrl, '')}" alt="${markup(product.name)}" loading="lazy" decoding="async"><div><span class="kicker">${markup(categoryName(product.cat))}</span><h2>${markup(product.name)}</h2><p>${markup(product.blurb)}</p>${price}</div></a></article>`;
};

const renderFaq = (faqs, heading = 'What customers ask us.') => `<section class="faq" aria-labelledby="questions-title"><p class="eyebrow">Clear answers before you buy</p><h2 id="questions-title">${markup(heading)}</h2><div class="faq-grid">${faqs.map(({ question, answer }) => `<article><h3>${markup(question)}</h3><p>${markup(answer)}</p></article>`).join('')}</div></section>`;

const renderEditorial = (sections = []) => sections.length
  ? `<section class="editorial" aria-label="Local shopping guide">${sections.map(({ heading, paragraphs = [], points = [] }) => `<article><h2>${markup(heading)}</h2>${paragraphs.map((paragraph) => `<p>${markup(paragraph)}</p>`).join('')}${points.length ? `<ul>${points.map((point) => `<li>${markup(point)}</li>`).join('')}</ul>` : ''}</article>`).join('')}</section>`
  : '';

const renderCollection = (page, catalog, pricing) => {
  if (page.slug === 'visit') {
    const canonical = collectionUrl(page.slug);
    const faqs = collectionFaqs(page.title);
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [localBusiness, website, { '@type': 'WebPage', '@id': canonical, url: canonical, name: page.title, description: page.description, about: { '@id': `${siteUrl}/#organization` } }, faqSchema(faqs), ...navigation()]
    };
    return `${head({ title: page.title, description: page.description, canonical, image: `${siteUrl}/assets/og-kross-one-gadgets-v3.png`, schema })}<body>${pageHeader()}<main class="shell"><p class="eyebrow">Visit the shop</p><h1>Kross One Gadgets, Lugogo Mall.</h1><p class="intro">Tell us the model. We reply with today’s price, the condition and the warranty — nothing hidden.</p><section class="visit"><h2>Shop #18A, Lugogo Mall</h2><p>Lugogo Bypass, Kampala</p><p><b>Monday–Saturday:</b> 9:00–20:00<br><b>Sunday:</b> 10:00–18:00</p><div class="actions"><a class="button" href="https://wa.me/256752117111?text=Hello%20Kross%20One%20Gadgets%2C%20I%20would%20like%20today%27s%20price.">Talk on WhatsApp</a><a class="button secondary" href="/#/visit">Open the interactive visit page</a></div></section>${renderFaq(faqs)}</main>${pageFooter()}</body></html>`;
  }

  const products = productsForCollection(page, catalog);
  const canonical = collectionUrl(page.slug);
  const faqs = page.faqs || collectionFaqs(page.title);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      localBusiness,
      website,
      { '@type': 'CollectionPage', '@id': canonical, url: canonical, name: page.title, headline: page.seoTitle || page.title, description: page.description, inLanguage: 'en', isPartOf: { '@id': `${siteUrl}/#website` }, about: (page.about || []).map((name) => ({ '@type': 'Thing', name })), mainEntity: { '@type': 'ItemList', numberOfItems: products.length, itemListElement: products.map((product, position) => ({ '@type': 'ListItem', position: position + 1, url: productUrl(product.id), name: product.name })) } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` }, { '@type': 'ListItem', position: 2, name: page.title, item: canonical }] },
      faqSchema(faqs),
      ...navigation()
    ]
  };
  const image = products.length ? productImage(products[0]) : `${siteUrl}/assets/og-kross-one-gadgets-v3.png`;
  const liveRoute = page.liveRoute || (page.slug === 'shop' ? '/#/shop' : page.slug === 'ipads-tablets' ? '/#/shop/tablets' : page.slug === 'bags-travel' ? '/#/shop/bags' : page.slug === 'fragrance-grooming' ? '/#/shop/lifestyle' : `/#/shop/${page.categories[0]}`);
  const enquiry = page.productFilter === 'iphone'
    ? 'Hello Kross One Gadgets, I would like to confirm which iPhones are in stock today.'
    : page.productFilter === 'samsung-ultra'
      ? 'Hello Kross One Gadgets, I would like to confirm which Samsung Galaxy Ultra models are in stock today.'
      : 'Hello Kross One Gadgets, I would like to confirm which Apple products are in stock today.';
  const localPanel = page.localIntent
    ? `<section class="visit" aria-labelledby="local-shop-title"><h2 id="local-shop-title">Visit Shop #18A at Lugogo Mall.</h2><p>Kross One Gadgets is an independent electronics retailer on Lugogo Bypass in Kampala. Browse the current catalogue below, then contact the team to confirm the exact model, price, condition and warranty before travelling.</p><p><b>Monday–Saturday:</b> 9:00–20:00<br><b>Sunday:</b> 10:00–18:00</p><div class="actions"><a class="button" href="https://wa.me/256752117111?text=${encodeURIComponent(enquiry)}">Check availability on WhatsApp</a><a class="button secondary" href="/collections/visit/">Directions and store details</a></div></section>`
    : '';
  return `${head({ title: page.seoTitle || page.title, description: page.description, canonical, image, schema })}<body>${pageHeader()}<main class="shell"><p class="eyebrow">Kross One Gadgets · Lugogo Mall</p><h1>${markup(page.title)}.</h1><p class="intro">${markup(page.description)} Ask Kross One Gadgets for today’s price, condition and warranty before you visit.</p><div class="actions"><a class="button" href="${liveRoute}">Browse the interactive collection</a><a class="button secondary" href="/collections/visit/">Visit the shop</a></div>${renderEditorial(page.content)}${localPanel}<section class="inventory" aria-labelledby="inventory-title"><p class="eyebrow">Models customers ask for</p><h2 id="inventory-title">${markup(page.inventoryTitle || `${page.title} catalogue`)}</h2><div class="grid" aria-label="${markup(page.title)} catalogue">${products.map((product) => productCard(product, pricing)).join('')}</div></section>${renderFaq(faqs)}</main>${pageFooter()}</body></html>`;
};

/**
 * Compact related card: name, image and price only. Deliberately omits the blurb, which
 * belongs to that product's own page — repeating it here would duplicate another page's
 * unique text across every sibling in the category.
 */
const relatedCard = (product, pricing) => {
  const entry = pricing?.entries.get(product.id);
  return `<article class="rel-card"><a href="${productUrl(product.id).replace(siteUrl, '')}"><img src="${productImage(product).replace(siteUrl, '')}" alt="${markup(product.name)}" loading="lazy" decoding="async"><div><h3>${markup(product.name)}</h3><span>${entry ? markup(priceRangeLabel(entry, pricing.currency)) : 'Ask today’s price'}</span></div></a></article>`;
};

const renderRelated = (product, related, pricing) => {
  if (!related.length) return '';
  const categoryCollection = collectionSlugForCategory[product.cat] || 'shop';
  const label = categoryName(product.cat).toLowerCase();
  return `<section class="related" aria-labelledby="related-title"><p class="eyebrow">Compare before you decide</p><h2 id="related-title">Other ${markup(label)} at Kross One Gadgets</h2><div class="rel-grid" aria-label="Related products">${related.map((item) => relatedCard(item, pricing)).join('')}</div><p class="related-more"><a href="/collections/${categoryCollection}/">See the full ${markup(label)} range in Kampala</a></p></section>`;
};

const renderPriceBlock = (entry, currency) => {
  if (!entry) {
    return `<p class="price-ask"><b>Price:</b> quoted per item. Message 0752 117 111 for today’s figure on the exact variant.</p>`;
  }
  return `<div class="price-block"><p class="price"><b>${markup(priceRangeLabel(entry, currency))}</b></p><p class="price-meta">${markup(conditionText(entry))} · ${markup(availabilityText(entry))}${entry.note ? ` · ${markup(entry.note)}` : ''}</p><p class="price-note">Confirm the current figure before travelling — prices move with stock and configuration.</p></div>`;
};

const renderProduct = (product, catalog, pricing) => {
  const canonical = productUrl(product.id);
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const phoneLocalIntent = /(?:iphone|samsung galaxy s\d+ ultra)/i.test(product.name);
  const productBrand = /iphone|ipad|macbook|apple watch|airpods/i.test(product.name) ? 'Apple' : /samsung/i.test(product.name) ? 'Samsung' : null;
  const categoryLabel = categoryName(product.cat);

  const entry = pricing.entries.get(product.id) || null;
  const priceLabel = entry ? priceRangeLabel(entry, pricing.currency) : null;
  const offers = offerSchema({
    entry,
    currency: pricing.currency,
    priceValidDays: pricing.priceValidDays,
    url: canonical,
    seller: { '@id': `${siteUrl}/#organization` }
  });

  const seoTitle = entry
    ? `${product.name} price in Uganda — ${priceLabel} | Kampala`
    : phoneLocalIntent ? `${product.name} in Kampala, Uganda` : product.name;
  const metaDescription = entry
    ? `${product.name} at ${priceLabel} from Kross One Gadgets, Shop #18A, Lugogo Mall, Kampala. ${conditionText(entry)}. Confirm today’s price, condition and warranty before you travel.`
    : `${product.blurb} Ask Kross One Gadgets in Lugogo Mall, Kampala for today’s price, condition and warranty.`;

  const related = relatedProducts(product, catalog);
  const { editorial, faqs } = buildProductContent(product, { categoryLabel, priced: Boolean(entry), priceLabel, related });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      localBusiness,
      website,
      {
        '@type': 'Product',
        '@id': canonical,
        url: canonical,
        name: product.name,
        description: product.blurb,
        image: productImage(product),
        sku: product.id,
        category: categoryLabel,
        ...(productBrand ? { brand: { '@type': 'Brand', name: productBrand } } : {}),
        ...(offers ? { offers } : {}),
        additionalProperty: specs.map(([name, value]) => ({ '@type': 'PropertyValue', name, value }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: categoryLabel, item: collectionUrl(collectionSlugForCategory[product.cat] || 'shop') },
          { '@type': 'ListItem', position: 3, name: product.name, item: canonical }
        ]
      },
      faqSchema(faqs)
    ]
  };

  const categoryCollection = collectionSlugForCategory[product.cat] || 'shop';
  const specMarkup = specs.map(([name, value]) => `<div class="spec"><b>${markup(name)}</b>${markup(value)}</div>`).join('');
  const whatsapp = `https://wa.me/256752117111?text=${encodeURIComponent(`Hello Kross One Gadgets, I saw the ${product.name} on your website. What is today’s price, condition and warranty?`)}`;
  const localNote = phoneLocalIntent ? `<p class="local-note">Looking for the ${markup(product.name)} in Kampala or Uganda? This model is listed by Kross One Gadgets at Lugogo Mall. Contact the shop to confirm the exact configuration, stock, price, condition and warranty before purchase.</p>` : '';

  return `${head({ title: seoTitle, description: metaDescription, canonical, image: productImage(product), schema })}<body>${pageHeader()}<main class="shell"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> · <a href="/collections/${categoryCollection}/">${markup(categoryLabel)}</a> · <span>${markup(product.name)}</span></nav><section class="detail"><img src="${productImage(product).replace(siteUrl, '')}" alt="${markup(product.name)}"><div><h1>${markup(product.name)}.</h1><p class="intro">${markup(product.blurb)}</p>${renderPriceBlock(entry, pricing.currency)}${localNote}<div class="actions"><a class="button" href="${whatsapp}">${entry ? 'Confirm stock on WhatsApp' : 'Ask today’s price'}</a><a class="button secondary" href="/#/p/${encodeURIComponent(product.id)}">Open product gallery</a></div><div class="specs">${specMarkup}</div></div></section>${renderEditorial(editorial)}${renderRelated(product, related, pricing)}${renderFaq(faqs, `${product.name}: common questions`)}</main>${pageFooter()}</body></html>`;
};

const priceListFaqs = (pricedCount, currency) => [
  {
    question: 'How much do iPhones cost in Uganda?',
    answer: pricedCount
      ? `iPhone prices in Uganda depend on the model, the storage size and whether the handset is brand new or certified pre-owned. The table on this page shows the ${currency} figures Kross One Gadgets currently publishes at Shop #18A, Lugogo Mall. Confirm the figure for your exact configuration on WhatsApp before travelling, because prices move with stock.`
      : `iPhone prices in Uganda vary by model, storage size and condition. Kross One Gadgets quotes each item individually from Shop #18A, Lugogo Mall — message 0752 117 111 with the model and storage you want and the shop replies with today’s figure, the condition and the warranty.`
  },
  {
    question: 'Why do the same phone models cost different amounts in Kampala?',
    answer: 'Three things move the price of an identical model name: whether the unit is sealed, open-box or pre-owned; which storage and memory configuration it is; and the import route it arrived through. A quoted price only means something once those three are pinned down, which is why Kross One Gadgets confirms them per item.'
  },
  {
    question: 'Are the prices on this page final?',
    answer: 'They are the figures published for the configurations listed, and they change as stock changes. Confirm the current price for the exact variant you want before travelling to Lugogo Mall. Kross One Gadgets will tell you if a published figure has moved.'
  },
  {
    question: 'Does Kross One Gadgets accept trade-ins against the price?',
    answer: 'Yes. Bring the phone or laptop you currently own to Shop #18A. The team tests it in front of you, grades the condition and puts the agreed value against the item you are buying, so the balance you pay reflects the trade-in.'
  }
];

const renderPriceList = (catalog, pricing) => {
  const canonical = `${siteUrl}/prices/`;
  const priced = catalog.filter((product) => pricing.entries.has(product.id));
  const grouped = new Map();
  for (const product of catalog) {
    const label = categoryName(product.cat);
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label).push(product);
  }

  const title = 'Gadget & iPhone Price List in Uganda';
  const description = priced.length
    ? `Current ${pricing.currency} prices for iPhone, Samsung Galaxy, laptops and more at Kross One Gadgets, Shop #18A, Lugogo Mall, Kampala. Updated ${pricing.updated || 'regularly'}.`
    : 'Price list for iPhone, Samsung Galaxy, laptops, audio and accessories at Kross One Gadgets, Shop #18A, Lugogo Mall, Kampala. Ask for today’s figure on any model.';

  const faqs = priceListFaqs(priced.length, pricing.currency);

  const rows = [...grouped.entries()].map(([label, items]) => {
    const body = items.map((product) => {
      const entry = pricing.entries.get(product.id);
      return `<tr><td><a href="${productUrl(product.id).replace(siteUrl, '')}">${markup(product.name)}</a></td><td>${entry ? markup(priceRangeLabel(entry, pricing.currency)) : '<span class="ask">Ask today’s price</span>'}</td><td>${entry ? markup(conditionText(entry)) : markup(String((product.specs || []).find(([k]) => /condition/i.test(k))?.[1] || 'Confirm with the shop'))}</td></tr>`;
    }).join('');
    return `<section class="price-group"><h2 id="${markup(label.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${markup(label)} prices in Kampala</h2><div class="table-wrap"><table><thead><tr><th>Model</th><th>Price (${markup(pricing.currency)})</th><th>Condition</th></tr></thead><tbody>${body}</tbody></table></div></section>`;
  }).join('');

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      localBusiness,
      website,
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name: title,
        description,
        inLanguage: 'en',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
        ...(pricing.updated ? { dateModified: pricing.updated } : {}),
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: catalog.length,
          itemListElement: catalog.map((product, position) => ({
            '@type': 'ListItem',
            position: position + 1,
            url: productUrl(product.id),
            name: product.name
          }))
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: title, item: canonical }
        ]
      },
      faqSchema(faqs),
      ...navigation()
    ]
  };

  const intro = priced.length
    ? `Kross One Gadgets publishes ${pricing.currency} prices for ${priced.length} of the ${catalog.length} models in the catalogue. Anything marked “ask today’s price” is quoted per item, because the figure depends on the exact configuration and condition in stock.`
    : `Kross One Gadgets quotes each model individually, because the price depends on the exact configuration and on whether the unit is sealed, open-box or pre-owned. Send the model and storage size you want to 0752 117 111 and the shop replies with today’s figure, the condition and the warranty that applies.`;

  return `${head({ title: `${title} | Kross One Gadgets Kampala`, description, canonical, image: `${siteUrl}/assets/og-kross-one-gadgets-v3.png`, schema })}<body>${pageHeader()}<main class="shell"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> · <span>Price list</span></nav><p class="eyebrow">Kross One Gadgets · Shop #18A, Lugogo Mall</p><h1>Gadget and iPhone price list, Kampala.</h1><p class="intro">${markup(intro)}</p>${pricing.updated ? `<p class="price-note">Prices last reviewed: ${markup(pricing.updated)}.</p>` : ''}<div class="actions"><a class="button" href="https://wa.me/256752117111?text=${encodeURIComponent('Hello Kross One Gadgets, I would like today’s price on a model from your price list.')}">Ask for today’s price</a><a class="button secondary" href="/collections/visit/">Visit Shop #18A</a></div>${renderEditorial([
    {
      heading: 'How pricing works at Kross One Gadgets',
      paragraphs: [
        'A model name on its own does not set a price in Kampala. The same handset can arrive sealed, open-box or pre-owned, in several storage sizes, through different import routes — and each of those changes what the item is worth and what protection comes with it.',
        'So the shop quotes against a specific unit. You get the figure, the condition and the warranty together, before you commit, rather than a headline number that changes when you arrive.'
      ],
      points: [
        'Condition — sealed, open-box or certified pre-owned',
        'Configuration — storage, memory and colour',
        'Warranty — what is covered, for how long, and where a repair happens',
        'Trade-in — the value of a device you bring in comes off the balance'
      ]
    },
    {
      heading: 'Comparing gadget prices across Uganda',
      paragraphs: [
        'It is worth comparing before you buy, and the comparison is only fair when the condition matches. A sealed unit and a pre-owned unit of the same model are different products, and a price that looks unusually low is usually describing the second one.',
        'When you compare, ask every shop the same three questions: is it sealed, what storage is it, and what warranty applies. Kross One Gadgets answers all three in writing before purchase.'
      ]
    }
  ])}${rows}${renderFaq(faqs, 'Questions about prices')}</main>${pageFooter()}</body></html>`;
};

/**
 * Markers around the injected home directory. QA strips everything between them and
 * asserts the remaining document is still byte-identical to the approved storefront, so
 * the integrity guarantee on the design markup survives this addition.
 */
export const HOME_DIRECTORY_START = '<!--kross-one:home-directory:start-->';
export const HOME_DIRECTORY_END = '<!--kross-one:home-directory:end-->';

/**
 * A visible site directory appended to the home page.
 *
 * The storefront home page is rendered client-side by the design runtime, so its static
 * HTML is a template full of unresolved {{ }} bindings. Those bindings are live and must
 * not be touched. Instead this adds real, visible, useful markup at the end of the
 * document: crawlers get a dependable link graph and factual text without waiting on
 * JavaScript, and visitors get a normal directory footer. Nothing here is hidden.
 */
const homeDirectory = (catalog, pricing) => {
  const featuredIds = ['iphone-17-pro-max', 'iphone-17-pro', 'iphone-17', 'galaxy-s26-ultra', 'galaxy-z-fold8', 'galaxy-z-flip8', 'macbook-air-13-m5', 'macbook-pro-14-m5', 'ipad-pro-13-m5', 'ipad-air-m4', 'watch-ultra-3', 'airpods-max'];
  const featured = featuredIds
    .map((id) => catalog.find((product) => product.id === id))
    .filter(Boolean);
  const popular = featured.length >= 6 ? featured : catalog.slice(0, 12);

  const priceFor = (product) => {
    const entry = pricing.entries.get(product.id);
    return entry ? ` — ${markup(priceRangeLabel(entry, pricing.currency))}` : '';
  };

  const styles = `<style>
.k1-directory { box-sizing:border-box; width:100%; padding:56px 5vw 64px; border-top:1px solid rgba(212,175,90,.22); background:#08080b; color:#bdb4a4; font-family:'Instrument Sans',system-ui,-apple-system,'Segoe UI',sans-serif; font-size:14px; line-height:1.62; }
.k1-directory * { box-sizing:border-box; }
.k1-directory .k1-inner { max-width:1180px; margin:0 auto; }
.k1-directory h2 { margin:0 0 14px; color:#f3ece0; font-size:clamp(21px,3vw,30px); line-height:1.14; letter-spacing:-.025em; }
.k1-directory .k1-lede { max-width:72ch; margin:0 0 34px; }
.k1-directory .k1-cols { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:28px; }
.k1-directory .k1-cols > div { min-width:0; }
.k1-directory h3 { margin:0 0 13px; color:#d4af5a; font-size:11px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; }
.k1-directory ul { margin:0; padding:0; list-style:none; }
.k1-directory li + li { margin-top:8px; }
.k1-directory a { color:#bdb4a4; text-decoration:none; overflow-wrap:anywhere; }
.k1-directory a:hover,.k1-directory a:focus-visible { color:#d4af5a; text-decoration:underline; }
.k1-directory address { font-style:normal; }
.k1-directory .k1-legal { max-width:80ch; margin:38px 0 0; padding-top:22px; border-top:1px solid rgba(255,255,255,.08); color:#8d846f; font-size:13px; }
@media (max-width:900px){ .k1-directory .k1-cols { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:560px){ .k1-directory { padding:44px 20px 52px; } .k1-directory .k1-cols { grid-template-columns:1fr; gap:26px; } }
</style>`;

  return `${styles}<section class="k1-directory" aria-labelledby="k1-directory-title"><div class="k1-inner"><h2 id="k1-directory-title">Kross One Gadgets — Apple and Samsung shop in Kampala</h2><p class="k1-lede">Kross One Gadgets is an independent electronics retailer at Shop #18A, Lugogo Mall, on Lugogo Bypass in Kampala, trading since 2013. The shop sells iPhone, Samsung Galaxy, MacBook, iPad, Apple Watch, audio, gaming, bags, fragrance and accessories. Prices, stock, condition and warranty are confirmed per item before purchase — ask on WhatsApp at 0752 117 111 before travelling.</p><div class="k1-cols"><div><h3>Shop by category</h3><ul>${collectionPages.map((page) => `<li><a href="/collections/${page.slug}/">${markup(page.slug === 'shop' ? 'Shop all gadgets' : page.title)}</a></li>`).join('')}<li><a href="/prices/">Price list, Uganda</a></li></ul></div><div><h3>Popular models in Kampala</h3><ul>${popular.map((product) => `<li><a href="/products/${product.id}/">${markup(product.name)}</a>${priceFor(product)}</li>`).join('')}</ul></div><div><h3>Looking for</h3><ul><li><a href="/collections/apple-products-kampala/">Apple shop in Kampala</a></li><li><a href="/collections/iphones-kampala/">iPhones in Kampala</a></li><li><a href="/collections/samsung-galaxy-ultra-kampala/">Samsung Galaxy Ultra in Uganda</a></li><li><a href="/prices/">iPhone prices in Uganda</a></li><li><a href="/collections/laptops/">Laptops in Kampala</a></li><li><a href="/collections/visit/">Directions to the shop</a></li></ul></div><div><h3>Visit the shop</h3><address>Kross One Gadgets<br>Shop #18A, Lugogo Mall<br>Lugogo Bypass, Kampala, Uganda<br><br>Monday–Saturday: 9:00–20:00<br>Sunday: 10:00–18:00<br><br><a href="tel:+256752117111">0752 117 111</a><br><a href="mailto:kross1gadgets@gmail.com">kross1gadgets@gmail.com</a></address></div></div><p class="k1-legal">Kross One Gadgets is an independent retailer. It is not an Apple-owned store, an Apple Authorised Reseller, or an agent of any manufacturer named on this site. Product names and trademarks belong to their respective owners. Catalogue listings describe models available to order and are not a guarantee of shelf stock; confirm the exact item, its condition, its price and its warranty with the shop before purchase.</p></div></section>`;
};

const robotsTxt = () => `User-agent: *
Allow: /

# AI assistants and answer engines are welcome to read and cite this site.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: meta-externalagent
Allow: /

# /admin.html is deliberately NOT disallowed here. It is served with
# "X-Robots-Tag: noindex, nofollow, noarchive, nosnippet" (see vercel.json), and a
# crawler has to be allowed to fetch the page before it can read that header. Blocking
# it in robots.txt instead would leave the URL eligible to appear as a bare link.

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = (urls) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, priority, changefreq }) => `  <url><loc>${url}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`).join('\n')}
</urlset>\n`;

const savePage = async (output, route, document) => {
  const directory = path.join(output, route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), document, 'utf8');
};

export const buildSeoPages = async ({ sourceHtml, output }) => {
  const catalog = parseCatalog(sourceHtml);
  const pricing = await loadPricing();

  await Promise.all(collectionPages.map((page) => savePage(output, `collections/${page.slug}`, renderCollection(page, catalog, pricing))));
  await Promise.all(catalog.map((product) => savePage(output, `products/${product.id}`, renderProduct(product, catalog, pricing))));
  await savePage(output, 'prices', renderPriceList(catalog, pricing));

  // Append the visible directory to the already-written home page. Done as a plain
  // string insert before </body> so the design runtime's own markup is untouched.
  const homePath = path.join(output, 'index.html');
  const homeHtml = await readFile(homePath, 'utf8');
  const closingBody = homeHtml.lastIndexOf('</body>');
  if (closingBody === -1) throw new Error('index.html has no closing </body> tag; cannot attach the home directory.');
  await writeFile(
    homePath,
    `${homeHtml.slice(0, closingBody)}${HOME_DIRECTORY_START}${homeDirectory(catalog, pricing)}${HOME_DIRECTORY_END}${homeHtml.slice(closingBody)}`,
    'utf8'
  );

  const urls = [
    { url: `${siteUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { url: `${siteUrl}/prices/`, priority: '0.9', changefreq: 'weekly' },
    ...collectionPages.map((page) => ({ url: collectionUrl(page.slug), priority: page.slug === 'shop' ? '0.9' : '0.8', changefreq: 'weekly' })),
    ...catalog.map((product) => ({ url: productUrl(product.id), priority: '0.7', changefreq: 'weekly' }))
  ];
  await writeFile(path.join(output, 'sitemap.xml'), sitemap(urls), 'utf8');
  await writeFile(path.join(output, 'robots.txt'), robotsTxt(), 'utf8');

  return {
    catalogCount: catalog.length,
    collectionCount: collectionPages.length,
    sitemapCount: urls.length,
    pricedCount: catalog.filter((product) => pricing.entries.has(product.id)).length
  };
};
