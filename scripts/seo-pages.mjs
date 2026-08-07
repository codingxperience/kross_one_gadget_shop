import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const siteUrl = 'https://kross-one-gadget-shop.vercel.app';

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

export const parseCatalog = (source) => {
  const match = source.match(/\n\s*P = \[([\s\S]*?)\n\s*\];\n\n\s*FIN = \[/);
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
  telephone: '+256752117111',
  email: 'kross1gadgets@gmail.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop #18A, Lugogo Mall, Lugogo Bypass',
    addressLocality: 'Kampala',
    addressCountry: 'UG'
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '18:00' }
  ]
};

const navigation = () => collectionPages.slice(0, -1).map((page) => ({
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
    .visit { max-width:760px; padding:28px; border:1px solid var(--line); border-radius:22px; background:rgba(255,255,255,.035); } .visit h2 { margin-top:0; } footer { padding:28px 0; border-top:1px solid var(--line); color:#9f9787; font-size:13px; } footer a { color:#e1be70; }
    @media (max-width:720px) { header { padding:16px 0; align-items:flex-start; flex-direction:column; } nav { justify-content:flex-start; } .detail { grid-template-columns:1fr; } .specs { grid-template-columns:1fr; } }
  </style>
</head>`;

const pageFooter = () => `<footer><div class="shell">Kross One Gadgets · Shop #18A, Lugogo Mall, Kampala · <a href="tel:+256752117111">0752 117 111</a> · <a href="mailto:kross1gadgets@gmail.com">kross1gadgets@gmail.com</a></div></footer>`;

const pageHeader = () => `<header class="shell"><a class="brand" href="/"><img src="/assets/kross-one-gadgets-logo-square.png" alt="Kross One Gadgets"><span>KROSS ONE GADGETS<small>Apple & Samsung Store · Lugogo Mall</small></span></a><nav>${collectionPages.slice(0, 8).map((page) => `<a href="${collectionUrl(page.slug).replace(siteUrl, '')}">${markup(page.slug === 'shop' ? 'Shop' : page.title)}</a>`).join('')}</nav></header>`;

const productCard = (product) => `<article class="card"><a href="${productUrl(product.id).replace(siteUrl, '')}"><img src="${productImage(product).replace(siteUrl, '')}" alt="${markup(product.name)}" loading="lazy" decoding="async"><div><span class="kicker">${markup(categoryName(product.cat))}</span><h2>${markup(product.name)}</h2><p>${markup(product.blurb)}</p></div></a></article>`;

const renderCollection = (page, catalog) => {
  if (page.slug === 'visit') {
    const canonical = collectionUrl(page.slug);
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [localBusiness, { '@type': 'WebPage', '@id': canonical, url: canonical, name: page.title, description: page.description, about: { '@id': `${siteUrl}/#organization` } }, ...navigation()]
    };
    return `${head({ title: page.title, description: page.description, canonical, image: `${siteUrl}/assets/og-kross-one-gadgets-v3.png`, schema })}<body>${pageHeader()}<main class="shell"><p class="eyebrow">Visit the shop</p><h1>Kross One Gadgets, Lugogo Mall.</h1><p class="intro">Tell us the model. We reply with today’s price, the condition and the warranty — nothing hidden.</p><section class="visit"><h2>Shop #18A, Lugogo Mall</h2><p>Lugogo Bypass, Kampala</p><p><b>Monday–Saturday:</b> 9:00–20:00<br><b>Sunday:</b> 10:00–18:00</p><div class="actions"><a class="button" href="https://wa.me/256752117111?text=Hello%20Kross%20One%20Gadgets%2C%20I%20would%20like%20today%27s%20price.">Talk on WhatsApp</a><a class="button secondary" href="/#/visit">Open the interactive visit page</a></div></section></main>${pageFooter()}</body></html>`;
  }

  const products = page.categories ? catalog.filter((product) => page.categories.includes(product.cat)) : catalog;
  const canonical = collectionUrl(page.slug);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      localBusiness,
      { '@type': 'CollectionPage', '@id': canonical, url: canonical, name: page.title, description: page.description, isPartOf: { '@id': `${siteUrl}/#website` }, mainEntity: { '@type': 'ItemList', numberOfItems: products.length, itemListElement: products.map((product, position) => ({ '@type': 'ListItem', position: position + 1, url: productUrl(product.id), name: product.name })) } },
      ...navigation()
    ]
  };
  const image = products.length ? productImage(products[0]) : `${siteUrl}/assets/og-kross-one-gadgets-v3.png`;
  const liveRoute = page.slug === 'shop' ? '/#/shop' : page.slug === 'ipads-tablets' ? '/#/shop/tablets' : page.slug === 'bags-travel' ? '/#/shop/bags' : page.slug === 'fragrance-grooming' ? '/#/shop/lifestyle' : `/#/shop/${page.categories[0]}`;
  return `${head({ title: page.title, description: page.description, canonical, image, schema })}<body>${pageHeader()}<main class="shell"><p class="eyebrow">Kross One Gadgets · Lugogo Mall</p><h1>${markup(page.title)}.</h1><p class="intro">${markup(page.description)} Ask Kross One Gadgets for today’s price, condition and warranty before you visit.</p><div class="actions"><a class="button" href="${liveRoute}">Browse the interactive collection</a><a class="button secondary" href="/collections/visit/">Visit the shop</a></div><section class="grid" aria-label="${markup(page.title)} catalogue">${products.map(productCard).join('')}</section></main>${pageFooter()}</body></html>`;
};

const renderProduct = (product) => {
  const canonical = productUrl(product.id);
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      localBusiness,
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

  return { catalogCount: catalog.length, collectionCount: collectionPages.length, sitemapCount: urls.length };
};
