import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { siteUrl } from './site-config.mjs';

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
    title: 'Shop Apple Products in Kampala',
    description: 'Browse iPhone, iPad, MacBook, Apple Watch and AirPods at Kross One Gadgets, Shop #18A, Lugogo Mall, Kampala. Ask for current availability, price, condition and warranty.',
    productFilter: 'apple',
    liveRoute: '/#/shop',
    localIntent: true,
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
      }
    ]
  },
  {
    slug: 'iphones-kampala',
    title: 'iPhones in Kampala',
    description: 'Browse current iPhone models at Kross One Gadgets, Shop #18A, Lugogo Mall, Kampala. Ask for today\'s available storage, colour, price, condition and warranty.',
    productFilter: 'iphone',
    liveRoute: '/#/shop/mobiles',
    localIntent: true,
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
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Kross One Gadgets catalogue',
    itemListElement: [
      { '@type': 'OfferCatalog', name: 'Apple products in Kampala', url: `${siteUrl}/collections/apple-products-kampala/` },
      { '@type': 'OfferCatalog', name: 'iPhones in Kampala', url: `${siteUrl}/collections/iphones-kampala/` },
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
    * { box-sizing:border-box; } body { margin:0; color:var(--ink); background:radial-gradient(circle at 50% -20%,rgba(201,146,46,.15),transparent 35%),var(--bg); font:16px/1.55 Arial,sans-serif; }
    a { color:inherit; text-decoration:none; } .shell { width:min(1180px,calc(100% - 36px)); margin:auto; } header { min-height:80px; display:flex; align-items:center; justify-content:space-between; gap:24px; border-bottom:1px solid var(--line); }
    .brand { display:flex; align-items:center; gap:12px; font-weight:800; letter-spacing:.04em; } .brand img { width:42px; height:42px; border-radius:50%; object-fit:cover; } .brand small { display:block; color:var(--muted); font-size:10px; letter-spacing:.13em; text-transform:uppercase; }
    nav { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:14px; color:#d8d0bf; font-size:13px; font-weight:700; } nav a:hover { color:var(--gold); }
    main { padding:clamp(42px,8vw,88px) 0 64px; } .eyebrow { margin:0 0 12px; color:var(--gold); font-size:11px; font-weight:800; letter-spacing:.2em; text-transform:uppercase; } h1 { max-width:850px; margin:0; font-size:clamp(37px,6vw,74px); line-height:1; letter-spacing:-.045em; } .intro { max-width:700px; margin:20px 0 30px; color:#c2baab; font-size:clamp(17px,2vw,21px); }
    .actions { display:flex; flex-wrap:wrap; gap:12px; margin:28px 0 50px; } .button { display:inline-flex; align-items:center; min-height:46px; padding:0 20px; border:1px solid var(--gold); border-radius:999px; color:#1a1304; background:linear-gradient(135deg,#f0d38a,#c9922e); font-weight:800; } .button.secondary { color:#eee6d3; background:transparent; border-color:var(--line); }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:16px; } .card { overflow:hidden; min-width:0; border:1px solid var(--line); border-radius:18px; background:linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.015)); } .card img { display:block; width:100%; aspect-ratio:1/0.82; object-fit:cover; background:#111; } .card div { padding:17px; } .kicker { color:#988e78; font-size:10px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; } .card h2 { margin:7px 0 8px; font-size:20px; letter-spacing:-.025em; } .card p { margin:0; color:#bdb4a4; font-size:14px; }
    .detail { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:clamp(24px,5vw,60px); align-items:start; } .detail img { width:100%; max-height:580px; border:1px solid var(--line); border-radius:22px; object-fit:contain; background:#111; } .specs { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-top:24px; } .spec { padding:13px; border:1px solid var(--line); border-radius:13px; background:rgba(255,255,255,.025); } .spec b { display:block; margin-bottom:4px; color:#978b70; font-size:10px; letter-spacing:.13em; text-transform:uppercase; }
    .visit { max-width:760px; margin-bottom:32px; padding:28px; border:1px solid var(--line); border-radius:22px; background:rgba(255,255,255,.035); } .visit h2 { margin-top:0; } .faq { margin-top:56px; padding-top:34px; border-top:1px solid var(--line); } .faq h2 { margin:0 0 22px; font-size:clamp(27px,4vw,42px); } .faq-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:14px; } .faq article { padding:18px; border:1px solid var(--line); border-radius:16px; background:rgba(255,255,255,.025); } .faq h3 { margin:0 0 9px; font-size:17px; } .faq p { margin:0; color:#bdb4a4; font-size:14px; } footer { padding:28px 0; border-top:1px solid var(--line); color:#9f9787; font-size:13px; } footer nav { justify-content:flex-start; margin-bottom:16px; } footer a { color:#e1be70; }
    @media (max-width:720px) { header { padding:16px 0; align-items:flex-start; flex-direction:column; } nav { justify-content:flex-start; } .detail { grid-template-columns:1fr; } .specs { grid-template-columns:1fr; } }
  </style>
</head>`;

const pageFooter = () => `<footer><div class="shell"><nav aria-label="Explore Kross One Gadgets">${collectionPages.map((page) => `<a href="/collections/${page.slug}/">${markup(page.slug === 'shop' ? 'Shop all gadgets' : page.title)}</a>`).join('')}</nav>Kross One Gadgets · Shop #18A, Lugogo Mall, Kampala · <a href="tel:+256752117111">0752 117 111</a> · <a href="mailto:kross1gadgets@gmail.com">kross1gadgets@gmail.com</a></div></footer>`;

const primaryNavigationSlugs = ['shop', 'apple-products-kampala', 'iphones-kampala', 'laptops', 'ipads-tablets', 'audio', 'watches', 'visit'];
const pageHeader = () => `<header class="shell"><a class="brand" href="/"><img src="/assets/kross-one-gadgets-logo-square.png" alt="Kross One Gadgets"><span>KROSS ONE GADGETS<small>Apple & Samsung Store · Lugogo Mall</small></span></a><nav aria-label="Primary">${primaryNavigationSlugs.map((slug) => collectionPages.find((page) => page.slug === slug)).filter(Boolean).map((page) => `<a href="${collectionUrl(page.slug).replace(siteUrl, '')}">${markup(page.slug === 'shop' ? 'Shop' : page.title)}</a>`).join('')}</nav></header>`;

const productCard = (product) => `<article class="card"><a href="${productUrl(product.id).replace(siteUrl, '')}"><img src="${productImage(product).replace(siteUrl, '')}" alt="${markup(product.name)}" loading="lazy" decoding="async"><div><span class="kicker">${markup(categoryName(product.cat))}</span><h2>${markup(product.name)}</h2><p>${markup(product.blurb)}</p></div></a></article>`;

const renderFaq = (faqs) => `<section class="faq" aria-labelledby="questions-title"><p class="eyebrow">Clear answers before you buy</p><h2 id="questions-title">What customers ask us.</h2><div class="faq-grid">${faqs.map(({ question, answer }) => `<article><h3>${markup(question)}</h3><p>${markup(answer)}</p></article>`).join('')}</div></section>`;

const renderCollection = (page, catalog) => {
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
      { '@type': 'CollectionPage', '@id': canonical, url: canonical, name: page.title, description: page.description, isPartOf: { '@id': `${siteUrl}/#website` }, mainEntity: { '@type': 'ItemList', numberOfItems: products.length, itemListElement: products.map((product, position) => ({ '@type': 'ListItem', position: position + 1, url: productUrl(product.id), name: product.name })) } },
      faqSchema(faqs),
      ...navigation()
    ]
  };
  const image = products.length ? productImage(products[0]) : `${siteUrl}/assets/og-kross-one-gadgets-v3.png`;
  const liveRoute = page.liveRoute || (page.slug === 'shop' ? '/#/shop' : page.slug === 'ipads-tablets' ? '/#/shop/tablets' : page.slug === 'bags-travel' ? '/#/shop/bags' : page.slug === 'fragrance-grooming' ? '/#/shop/lifestyle' : `/#/shop/${page.categories[0]}`);
  const enquiry = page.productFilter === 'iphone'
    ? 'Hello Kross One Gadgets, I would like to confirm which iPhones are in stock today.'
    : 'Hello Kross One Gadgets, I would like to confirm which Apple products are in stock today.';
  const localPanel = page.localIntent
    ? `<section class="visit" aria-labelledby="local-shop-title"><h2 id="local-shop-title">Visit Shop #18A at Lugogo Mall.</h2><p>Kross One Gadgets is an independent electronics retailer on Lugogo Bypass in Kampala. Browse the current catalogue below, then contact the team to confirm the exact model, price, condition and warranty before travelling.</p><p><b>Monday–Saturday:</b> 9:00–20:00<br><b>Sunday:</b> 10:00–18:00</p><div class="actions"><a class="button" href="https://wa.me/256752117111?text=${encodeURIComponent(enquiry)}">Check availability on WhatsApp</a><a class="button secondary" href="/collections/visit/">Directions and store details</a></div></section>`
    : '';
  return `${head({ title: page.title, description: page.description, canonical, image, schema })}<body>${pageHeader()}<main class="shell"><p class="eyebrow">Kross One Gadgets · Lugogo Mall</p><h1>${markup(page.title)}.</h1><p class="intro">${markup(page.description)} Ask Kross One Gadgets for today’s price, condition and warranty before you visit.</p><div class="actions"><a class="button" href="${liveRoute}">Browse the interactive collection</a><a class="button secondary" href="/collections/visit/">Visit the shop</a></div>${localPanel}<section class="grid" aria-label="${markup(page.title)} catalogue">${products.map(productCard).join('')}</section>${renderFaq(faqs)}</main>${pageFooter()}</body></html>`;
};

const renderProduct = (product) => {
  const canonical = productUrl(product.id);
  const specs = Array.isArray(product.specs) ? product.specs : [];
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
        category: categoryName(product.cat),
        additionalProperty: specs.map(([name, value]) => ({ '@type': 'PropertyValue', name, value }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: categoryName(product.cat), item: collectionUrl(collectionSlugForCategory[product.cat] || 'shop') },
          { '@type': 'ListItem', position: 3, name: product.name, item: canonical }
        ]
      }
    ]
  };
  const categoryCollection = collectionSlugForCategory[product.cat] || 'shop';
  const specMarkup = specs.map(([name, value]) => `<div class="spec"><b>${markup(name)}</b>${markup(value)}</div>`).join('');
  const whatsapp = `https://wa.me/256752117111?text=${encodeURIComponent(`Hello Kross One Gadgets, I saw the ${product.name} on your website. What is today’s price, condition and warranty?`)}`;
  return `${head({ title: product.name, description: `${product.blurb} Ask Kross One Gadgets in Lugogo Mall for today’s price, condition and warranty.`, canonical, image: productImage(product), schema })}<body>${pageHeader()}<main class="shell"><p class="eyebrow"><a href="/collections/${categoryCollection}/">${markup(categoryName(product.cat))}</a> · Kross One Gadgets</p><section class="detail"><img src="${productImage(product).replace(siteUrl, '')}" alt="${markup(product.name)}"><div><h1>${markup(product.name)}.</h1><p class="intro">${markup(product.blurb)}</p><div class="actions"><a class="button" href="${whatsapp}">Ask today’s price</a><a class="button secondary" href="/#/p/${encodeURIComponent(product.id)}">Open product gallery</a></div><div class="specs">${specMarkup}</div></div></section></main>${pageFooter()}</body></html>`;
};

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
  await Promise.all(collectionPages.map((page) => savePage(output, `collections/${page.slug}`, renderCollection(page, catalog))));
  await Promise.all(catalog.map((product) => savePage(output, `products/${product.id}`, renderProduct(product))));

  const urls = [
    { url: `${siteUrl}/`, priority: '1.0', changefreq: 'weekly' },
    ...collectionPages.map((page) => ({ url: collectionUrl(page.slug), priority: page.slug === 'shop' ? '0.9' : '0.8', changefreq: 'weekly' })),
    ...catalog.map((product) => ({ url: productUrl(product.id), priority: '0.7', changefreq: 'weekly' }))
  ];
  await writeFile(path.join(output, 'sitemap.xml'), sitemap(urls), 'utf8');
  await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');

  return { catalogCount: catalog.length, collectionCount: collectionPages.length, sitemapCount: urls.length };
};
