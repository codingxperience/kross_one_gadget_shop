import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectionPages, parseCatalog, siteUrl } from './seo-pages.mjs';
import { extractComponentLogic } from './precompile-dc.mjs';
import { rewriteSiteOrigin } from './site-config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceSiteUrl = 'https://www.kross-one-gadgets.co.ug';
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const adminHtml = await readFile(path.join(root, 'admin.html'), 'utf8');
const support = await readFile(path.join(root, 'public', 'support.js'), 'utf8');
const adminData = await readFile(path.join(root, 'public', 'admin-data.js'), 'utf8');
const assetSources = await readFile(path.join(root, 'ASSET_SOURCES.md'), 'utf8');
const manifest = await readFile(path.join(root, 'public', 'site.webmanifest'), 'utf8');
const robots = await readFile(path.join(root, 'public', 'robots.txt'), 'utf8');
const sitemap = await readFile(path.join(root, 'public', 'sitemap.xml'), 'utf8');
const googleVerification = await readFile(path.join(root, 'public', 'googlee264a0cdaaba06d8.html'), 'utf8');
const vercelConfig = await readFile(path.join(root, 'vercel.json'), 'utf8');
const foldMotionBlue = await readFile(path.join(root, 'public', 'assets', 'fold-motion-flip-blue.jpeg'));
const foldMotionBurgundy = await readFile(path.join(root, 'public', 'assets', 'fold-motion-fold-burgundy.jpeg'));
const foldMotionVideo = await readFile(path.join(root, 'public', 'assets', 'fold-motion-galaxy-series.mp4'));
const socialCard = await readFile(path.join(root, 'public', 'assets', 'og-kross-one-gadgets-v3.png'));
const builtHtml = await readFile(path.join(root, 'dist', 'index.html'), 'utf8');
const builtAdminHtml = await readFile(path.join(root, 'dist', 'admin.html'), 'utf8');
const builtAppLogic = await readFile(path.join(root, 'dist', 'app-logic.js'), 'utf8');
const builtAdminLogic = await readFile(path.join(root, 'dist', 'admin-logic.js'), 'utf8');
const builtRobots = await readFile(path.join(root, 'dist', 'robots.txt'), 'utf8');
const builtLlms = await readFile(path.join(root, 'dist', 'llms.txt'), 'utf8');
const builtGoogleVerification = await readFile(path.join(root, 'dist', 'googlee264a0cdaaba06d8.html'), 'utf8');
const builtSitemap = await readFile(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
const builtLaptopCollection = await readFile(path.join(root, 'dist', 'collections', 'laptops', 'index.html'), 'utf8');
const builtIpadCollection = await readFile(path.join(root, 'dist', 'collections', 'ipads-tablets', 'index.html'), 'utf8');
const builtProductPage = await readFile(path.join(root, 'dist', 'products', 'macbook-air-13-m5', 'index.html'), 'utf8');
const seoCatalog = parseCatalog(html);

const requireText = (source, needle, label) => {
  if (!source.includes(needle)) throw new Error(`Missing ${label}: ${needle}`);
};

const validateJsonLd = (label, source) => {
  const blocks = [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) throw new Error(`${label}: no JSON-LD block was found.`);
  for (const [, json] of blocks) JSON.parse(json);
};

const hashText = (source) => createHash('sha256').update(source.replace(/\r\n/g, '\n')).digest('hex');
const hashBytes = (source) => createHash('sha256').update(source).digest('hex');

// Storefront: keep the approved v2 client revision and its runtime/assets lossless.
if (hashText(html) !== 'ac0df9430ab4d22ae400b2d6e612d2f59cee9f41b96c58b1a9c1b63b6556b11f') {
  throw new Error('index.html differs from the approved responsive Kross One Gadgets v2 client revision.');
}
if (hashText(support) !== '8a955e8f2bf16b5a69dc1e14015c15db35632676c50a978d5ac94a6f8adc84db') {
  throw new Error('public/support.js differs from the CSP-compatible reviewed runtime.');
}
if (hashBytes(foldMotionBlue) !== 'f3a4969d23d2999007bdb3fe7ff659e7da1d5deaca7a525e72b0e305ce6cd97d') {
  throw new Error('Blue Galaxy Fold-series motion visual differs from the approved supplied asset.');
}
if (hashBytes(foldMotionBurgundy) !== '0bf2cde2b70297150550bb39079266596aae50ebbef3b7ff87b1e82be3230b8b') {
  throw new Error('Burgundy Galaxy Fold-series motion visual differs from the approved supplied asset.');
}
if (hashBytes(foldMotionVideo) !== '79d5459f3e91c7102dd56ba4c3510019dd19bfc499098d75c905b6ec8ef7df2f') {
  throw new Error('Galaxy Fold-series motion clip differs from the approved supplied asset.');
}

// Storefront: distinctive v2 structure, routes, content, and enquiry flow.
requireText(html, "html { scroll-behavior: smooth; background: #08080b; }", 'v2 dark canvas');
requireText(html, 'family=Archivo:wdth,wght@62..125,400..900&family=Instrument+Sans', 'v2 typography');
requireText(html, 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'visit map runtime');
requireText(html, 'assets/fold-motion-flip-blue.jpeg', 'approved blue Galaxy motion artwork');
requireText(html, 'assets/fold-motion-fold-burgundy.jpeg', 'approved burgundy Galaxy motion artwork');
requireText(html, 'assets/fold-motion-galaxy-series.mp4', 'approved Galaxy motion clip');
requireText(html, 'mix-blend-mode:screen', 'screen-blended transparent Fold motion treatment');
requireText(html, 'mix-blend-mode:multiply', 'light-background transparent Fold motion treatment');
requireText(html, 'mask-image:radial-gradient', 'feathered transparent Fold motion treatment');
requireText(html, 'official-samsung-galaxy-s26-ultra-share.jpg', 'official Galaxy S26 Ultra camera visual');
requireText(html, 'official-samsung-galaxy-s26-ultra-key-visual.jpg', 'official Galaxy S26 Ultra key visual');
requireText(html, 'assets/kross-one-gadgets-poster.jpg', 'approved Kross One storefront poster');
requireText(html, 'Original products. The people behind the promise.', 'Kross One poster feature headline');
requireText(assetSources, 'kross-one-gadgets-poster.jpg', 'Kross One poster source ledger');
requireText(html, '@media (max-width: 1100px)', 'phone/tablet circular motion breakpoint');
requireText(html, 'data-mobile-orbit', 'phone/tablet circular product motion');
requireText(html, 'data-util-window', 'small-screen utility message window');
requireText(html, 'data-menubtn', 'left navigation menu control');
requireText(html, 'data-filterbtn', 'premium collection filter control');
requireText(html, 'data-viewbtn', 'collection layout control');
requireText(html, 'data-viewmode="{{ viewMode }}"', 'grid/list collection mode');
requireText(html, 'data-recent-grid', 'recent inventory category emphasis');
requireText(html, '[data-wa-fab] { display: none !important; }', 'single small-screen WhatsApp action');
requireText(html, '<title>Kross One Gadgets | Apple &amp; Samsung Store | Lugogo Mall</title>', 'approved storefront title');
requireText(html, 'property="og:title" content="Kross One Gadgets | Apple &amp; Samsung Store | Lugogo Mall"', 'approved Open Graph title');
requireText(html, '"@type": "ElectronicsStore"', 'Google Local Business structured data');
requireText(html, 'name="robots" content="index,follow', 'Google crawl directive');
requireText(robots, `Sitemap: ${sourceSiteUrl}/sitemap.xml`, 'source Google sitemap directive');
requireText(sitemap, `<loc>${sourceSiteUrl}/</loc>`, 'source canonical sitemap URL');
requireText(googleVerification, 'google-site-verification: googlee264a0cdaaba06d8.html', 'Google Search Console verification token');
requireText(html, 'assets/kross-one-gadgets-logo-square.png', 'square Kross One logo icon');
requireText(html, '"@type": "WebSite"', 'website structured data');
requireText(html, '"@type": "SiteNavigationElement"', 'site navigation structured data');
requireText(adminHtml, 'name="robots" content="noindex,nofollow,noarchive,nosnippet"', 'admin search exclusion');
requireText(vercelConfig, 'Content-Security-Policy', 'Vercel content security policy');
if (vercelConfig.includes("'unsafe-eval'")) throw new Error('The production Content Security Policy must not allow unsafe-eval.');
requireText(vercelConfig, 'X-Robots-Tag', 'Vercel admin search exclusion header');
requireText(support, '__dcPrecompiledLogicFactories', 'precompiled design-logic runtime path');
requireText(support, '__dcRequirePrecompiledLogic', 'strict precompiled design-logic guard');
requireText(html, 'name="twitter:title" content="Kross One Gadgets | Apple &amp; Samsung Store | Lugogo Mall"', 'approved Twitter title');
requireText(html, 'assets/og-kross-one-gadgets-v3.png', 'approved Kross One social preview');
if (socialCard.length < 20_000) throw new Error('The versioned social card is unexpectedly small.');
requireText(manifest, '"name": "Kross One Gadgets"', 'installable storefront name');
requireText(html, `${sourceSiteUrl}/#website`, 'source custom-domain WebSite identity');
requireText(html, '"alternateName": "Kross One Gadget Shop"', 'Google site-name alternative');
requireText(html, '"@type": "GeoCoordinates"', 'store geocoordinates');
requireText(html, 'assets/official-hp-omnibook-x-flip-14.png', 'official HP OmniBook X Flip catalog artwork');
requireText(html, 'data-word-gadgets', 'Kross One Gadgets homepage wordmark');
requireText(html, 'assets/official-apple-macbook-air-m5-hero.png', 'official Apple MacBook Air M5 artwork');
requireText(html, 'assets/official-apple-macbook-pro-m5-space-black.jpg', 'official Apple MacBook Pro M5 artwork');
requireText(html, 'assets/official-apple-ipad-pro-m5-hero.jpg', 'official Apple iPad Pro M5 artwork');
requireText(html, 'assets/official-apple-ipad-air-m4-hero.png', 'official Apple iPad Air M4 artwork');
requireText(html, 'assets/official-apple-watch-ultra3-og.png', 'official Apple Watch Ultra 3 artwork');
requireText(html, 'assets/official-samsung-watch8-silver-perspective.jpg', 'official Samsung Galaxy Watch8 artwork');
requireText(html, 'assets/official-braun-series5-51-b1000s.jpg', 'official Braun Series 5 artwork');
requireText(html, 'assets/official-philips-mg5921-15.png', 'official Philips MG5921/15 artwork');
requireText(html, 'assets/official-creed-viking-cologne.jpg', 'official Creed fragrance artwork');
requireText(html, 'assets/official-valentino-born-in-roma-donna.jpg', 'official Valentino fragrance artwork');
requireText(html, 'assets/official-armani-prive-rouge-malachite.jpg', 'official Armani fragrance artwork');
requireText(html, 'assets/official-carolina-herrera-212-vip-men.jpg', 'official Carolina Herrera fragrance artwork');
requireText(html, 'Bose SoundLink Max Portable Speaker', 'Bose speaker catalog item');
requireText(html, 'JBL Tune 770NC Wireless Headphones', 'JBL headphone catalog item');
requireText(html, 'RIDE 5 — PlayStation 5', 'PlayStation game-disc catalog item');
requireText(html, 'EA SPORTS FC 26 — PlayStation', 'EA game-disc catalog item');
requireText(html, 'ThinkPad Professional 16″ Topload Gen 2', 'Lenovo laptop bag catalog item');
requireText(html, 'Pierre Cardin 72cm Soft-Shell Trolley Case', 'travel-bag catalog item');
requireText(html, 'aria-label="Enquiry list"', 'enquiry list control');
requireText(html, 'Send list on WhatsApp', 'WhatsApp enquiry-list action');
requireText(html, "else if (seg[0] === 'visit') page = 'visit';", 'visit route');
requireText(html, "else if (seg[0] === 'technology') { page = 'home'; param = 'inside'; }", 'inside route');
requireText(html, 'Shop #18A, Lugogo Mall', 'shop location');

const foldStart = html.indexOf('<section data-fold ');
const stageStart = html.indexOf('<div data-fold-stage', foldStart);
const stageEnd = html.indexOf('<div style="position:relative;max-width:1440px;margin:0 auto;padding:clamp(28px', stageStart);
if (foldStart < 0 || stageStart < 0 || stageEnd < 0) throw new Error('Samsung Fold 8 animated stage is missing.');
const foldStageHtml = html.slice(stageStart, stageEnd);
requireText(foldStageHtml, 'assets/fold-motion-flip-blue.jpeg', 'approved blue Galaxy visual in the Fold-stage motion');
requireText(foldStageHtml, 'assets/fold-motion-fold-burgundy.jpeg', 'approved burgundy Galaxy visual in the Fold-stage motion');
requireText(foldStageHtml, 'assets/fold-motion-galaxy-series.mp4', 'approved Galaxy clip in the Fold-stage motion');
if (foldStageHtml.includes('official-samsung-')) throw new Error('The Fold-stage motion must retain the approved supplied Galaxy visuals, not the product-card media.');

const typerMatch = html.match(/TYPE = \[([\s\S]*?)\];/);
if (!typerMatch) throw new Error('Animated search prompt inventory is missing.');
for (const model of ['iPhone 17 Pro Max 256GB', 'iPhone 17 Pro Cosmic Orange', 'iPhone 17 256GB', 'Samsung Galaxy S26 Ultra 1TB', 'Samsung Galaxy S26 Ultra Black 512GB', 'Samsung Galaxy S25 256GB', 'Galaxy Z Fold8 Ultra', 'Galaxy Z Flip8', 'MacBook Air 13-inch M5', 'MacBook Pro 16-inch M5 Max', 'iPad Pro 13-inch M5', 'iPad Air 11-inch M4', 'iPad 11-inch A16', 'RIDE 5 for PlayStation 5', 'EA SPORTS FC 26 game disc', 'ThinkPad Professional 16-inch Topload', 'Pierre Cardin 72cm trolley case', 'HP OmniBook X Flip 14-fm0013dx', 'HP Smart Tank 580 printer', 'Apple Watch Ultra 3 49mm', 'HUAWEI WATCH GT 6 Pro', 'HUAWEI WATCH Ultimate 2', 'Green Lion Strive Smart Watch', 'Braun Series 5 51-B1000s', 'Philips Trimmer 5000 MG5921/15', 'JBL PartyBox Stage 320', 'JBL Tune 770NC Headphones', 'Bose SoundLink Max Speaker', 'Ray-Ban Meta Smart Glasses', 'Powerology portable projector', 'Porodo Sovo 10000mAh MagSafe Power Bank', 'Creed Viking Cologne']) {
  requireText(typerMatch[1], model, 'specific animated search inventory item');
}
if (/Sony/i.test(typerMatch[1])) {
  throw new Error('Animated search prompts include Sony, which the owner did not confirm as phone/electronics inventory.');
}

if (seoCatalog.filter((product) => product.cat === 'laptops').length < 6) {
  throw new Error('The storefront must include the requested HP laptop plus five authentic current MacBook models.');
}
if (seoCatalog.filter((product) => product.cat === 'tablets').length < 5) {
  throw new Error('The storefront must include at least five authentic iPad models.');
}
if (collectionPages.length < 10) throw new Error('Crawlable collection pages are incomplete.');

const ownerMediaNames = [
  'apple-watch-ultra-2.mp4', 'bose-qc-ultra-white.webp', 'bose-soundlink-max-black.jpg',
  'bose-soundlink-micro-front.webp', 'games-ps4-gta-v.webp', 'hp-omnibook-7-flip-front.webp',
  'jbl-tune-770nc-black.webp', 'laptop-bag-lenovo-t210.webp', 'perfume-kkw-fragrance.jpeg',
  'philips-rotary-shaver.webp', 'samsung-watch8-bedtime.mp4', 'smartwatch-alexa-pink.jpg',
  'trolley-bag-silver.webp'
];
for (const privateReference of ['game cds.jpeg', 'laptop bags on shop.jpeg', 'ladys bag.jpeg', 'trolly bags-onshop.jpeg', 'WhatsApp Image 2026-08-02 at 3.29.59 PM.jpeg', 'WhatsApp Image 2026-08-02 at 3.29.15 PM.jpeg', 'WhatsApp Image 2026-08-02 at 3.28.44 PM.jpeg', 'WhatsApp Image 2026-08-02 at 3.28.01 PM.jpeg', 'WhatsApp Image 2026-08-02 at 3.27.29 PM.jpeg', 'Watch huweai.jpeg', 'Smart watch.jpeg', 'Wireless power bank.jpeg']) {
  if (html.toLowerCase().includes(privateReference)) throw new Error(`Private owner reference must not be displayed: ${privateReference}`);
}
const ownerMediaPattern = /^(?:apple-watch-ultra-2|bose-qc-ultra-|bose-soundlink-max-|bose-soundlink-micro-|games-ps4-|hp-omnibook-7-flip|jbl-tune-770nc-|laptop-bag-|perfume-(?:amber|kkw)|philips-(?:rotary|shaver)|samsung-watch8-(?:bedtime|rear|side|silver)|smartwatch-|trolley-bag-)/;
for (const name of ownerMediaNames) {
  if (html.includes(name)) throw new Error(`Owner-supplied media must not be displayed: ${name}`);
  try {
    await stat(path.join(root, 'public', 'assets', name));
    throw new Error(`Owner-supplied media must not be packaged: ${name}`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}
const ownerRefs = [...html.matchAll(/assets\/([^"']+)/g)].map((match) => match[1]).filter((name) => ownerMediaPattern.test(name) && !name.startsWith('official-'));
if (ownerRefs.length) throw new Error(`Owner-supplied media references remain: ${ownerRefs.join(', ')}`);
const ownerFiles = (await readdir(path.join(root, 'public', 'assets'))).filter((name) => ownerMediaPattern.test(name) && !name.startsWith('official-'));
if (ownerFiles.length) throw new Error(`Owner-supplied media files remain packaged: ${ownerFiles.join(', ')}`);
for (const item of ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17', 'Samsung Galaxy S26 Ultra', 'MacBook Air 13-inch — M5', 'MacBook Air 15-inch — M5', 'MacBook Pro 14-inch — M5', 'MacBook Pro 14-inch — M5 Pro', 'MacBook Pro 16-inch — M5 Max', 'iPad Pro 11-inch — M5', 'iPad Pro 13-inch — M5', 'iPad Air 11-inch — M4', 'iPad Air 13-inch — M4', 'iPad mini — A17 Pro', 'iPad 11-inch — A16', 'HP Smart Tank 580 Wireless All-in-One Printer', 'JBL PartyBox Stage 320', 'Powerology Rotating Stand Portable Projector', 'Ray-Ban Meta Smart Glasses', 'HUAWEI WATCH GT 6 Pro', 'HUAWEI WATCH Ultimate 2', 'Green Lion Strive Smart Watch', 'Porodo Sovo 10000mAh MagSafe Power Bank']) {
  requireText(html, item, 'owner-confirmed catalog item');
}
for (const maker of ['HP', 'Braun', 'Philips', 'JBL', 'Bose', 'Samsung', 'Apple', 'Creed', 'Chanel', 'Dior', 'Valentino', 'Armani', 'Carolina Herrera', 'PlayStation', 'Electronic Arts', 'Nintendo', 'Lenovo', 'Pierre Cardin', 'Powerology', 'Ray-Ban', 'HUAWEI', 'Green Lion', 'Porodo']) {
  requireText(assetSources, maker, 'official asset source ledger');
}

const pagesSafe = (label, source) => {
  const rootRelativeUrls = [...source.matchAll(/(?:src|href)=["']\/(?!\/)/g)];
  if (rootRelativeUrls.length) {
    throw new Error(`${label}: root-relative URLs are not allowed because the site is deployed from a GitHub Pages project subpath.`);
  }
};
pagesSafe('index.html', html);
pagesSafe('admin.html', adminHtml);

const parseComponent = (label, source) => {
  const componentMatch = source.match(/<script type="text\/x-dc"[\s\S]*?>([\s\S]*?)<\/script>/);
  if (!componentMatch) throw new Error(`${label}: design-export component script is missing.`);
  new Function('DCLogic', `${componentMatch[1]}\nreturn Component;`);
};
parseComponent('index.html', html);
parseComponent('admin.html', adminHtml);
new Function(support);
new Function(adminData);

const evaluateFactoryBundle = (label, bundle, name) => {
  const fakeWindow = {};
  new Function('window', bundle)(fakeWindow);
  const factory = fakeWindow.__dcPrecompiledLogicFactories?.[name];
  if (typeof factory !== 'function') throw new Error(`${label}: precompiled factory ${name} is missing.`);
  const Component = factory(class {}, {});
  if (typeof Component !== 'function') throw new Error(`${label}: precompiled factory did not return a component class.`);
  if (!fakeWindow.__dcRequirePrecompiledLogic) throw new Error(`${label}: strict precompiled runtime flag is missing.`);
};
evaluateFactoryBundle('storefront', builtAppLogic, 'Root');
evaluateFactoryBundle('admin', builtAdminLogic, 'admin');

// Admin console: staff gate, two-factor step, shared catalog, prototype honesty.
requireText(adminHtml, '<script src="admin-data.js"></script>', 'admin shared-catalog script');
requireText(adminHtml, 'Sign in to the console', 'admin sign-in gate');
requireText(adminHtml, 'Two-factor verification', 'admin two-factor step');
requireText(adminHtml, 'Prototype console — all data lives in this browser only.', 'admin prototype disclosure');
requireText(adminData, 'window.KROSS_CATALOG', 'admin catalog global');

const collectAssetRefs = (source) => [...new Set([...source.matchAll(/["'](assets\/[A-Za-z0-9._/-]+)["']/g)].map((match) => match[1]))];
const assetRefs = collectAssetRefs(html);
const adminAssetRefs = collectAssetRefs(adminHtml + adminData);
const missingAssets = [];
for (const ref of new Set([...assetRefs, ...adminAssetRefs])) {
  try {
    await stat(path.join(root, 'public', ref));
  } catch {
    missingAssets.push(ref);
  }
}
if (missingAssets.length) throw new Error(`Missing local assets: ${missingAssets.join(', ')}`);

const runtimeTag = '<script src="./support.js"></script>';
const expectedBuiltHtml = rewriteSiteOrigin(html).replace(runtimeTag, `<script src="./app-logic.js"></script>\n${runtimeTag}`);
const expectedBuiltAdminHtml = adminHtml.replace(runtimeTag, `<script src="./admin-logic.js"></script>\n${runtimeTag}`);
if (builtHtml !== expectedBuiltHtml) throw new Error('dist/index.html is not the exact approved storefront plus its precompiled logic bundle.');
if (builtAdminHtml !== expectedBuiltAdminHtml) throw new Error('dist/admin.html is not the exact admin source plus its precompiled logic bundle.');
if (builtHtml.indexOf('app-logic.js') > builtHtml.indexOf('support.js')) throw new Error('Storefront precompiled logic must load before support.js.');
if (builtAdminHtml.indexOf('admin-logic.js') > builtAdminHtml.indexOf('support.js')) throw new Error('Admin precompiled logic must load before support.js.');
for (const [label, sourceHtml, bundle] of [['storefront', html, builtAppLogic], ['admin', adminHtml, builtAdminLogic]]) {
  const sourceLogic = extractComponentLogic(label === 'storefront' ? rewriteSiteOrigin(sourceHtml) : sourceHtml, label);
  const bundledLogicMatch = bundle.match(/const createComponent = \(DCLogic, React\) => \{\n([\s\S]*?)\n    return Component;\n  \};/);
  if (!bundledLogicMatch) throw new Error(`${label}: compiled component body is missing.`);
  const bundledLogic = bundledLogicMatch[1].split('\n').map((line) => line.replace(/^    /, '')).join('\n').trim();
  if (bundledLogic !== sourceLogic.trim()) throw new Error(`${label}: compiled component body differs from the authoritative inline logic.`);
}
if (builtGoogleVerification !== googleVerification) throw new Error('The Google Search Console verification file was not copied to the deployment root.');
requireText(builtRobots, `Sitemap: ${siteUrl}/sitemap.xml`, 'built canonical robots sitemap directive');
requireText(builtLlms, `Canonical website: ${siteUrl}/`, 'AI discovery canonical identity');
requireText(builtHtml, `${siteUrl}/#website`, 'built custom-domain WebSite identity');
requireText(builtSitemap, `${siteUrl}/collections/laptops/`, 'generated laptops collection sitemap URL');
requireText(builtSitemap, `${siteUrl}/products/macbook-air-13-m5/`, 'generated product sitemap URL');
if (builtSitemap.includes('kross-one-gadget-shop.vercel.app')) throw new Error('The generated sitemap still contains the retired Vercel origin.');
const sitemapUrlCount = [...builtSitemap.matchAll(/<loc>/g)].length;
if (sitemapUrlCount !== 1 + collectionPages.length + seoCatalog.length) throw new Error(`Generated sitemap URL count is incorrect: ${sitemapUrlCount}.`);
requireText(builtLaptopCollection, 'MacBook Air 13-inch', 'crawlable laptops collection content');
requireText(builtIpadCollection, 'iPad Pro 13-inch', 'crawlable iPads collection content');
requireText(builtLaptopCollection, '"@type":"FAQPage"', 'visible collection FAQ structured data');
requireText(builtProductPage, '"@type":"Product"', 'product structured data');
for (const [label, document] of [['home', builtHtml], ['laptops collection', builtLaptopCollection], ['iPads collection', builtIpadCollection], ['product', builtProductPage]]) validateJsonLd(label, document);

const assetFiles = await readdir(path.join(root, 'public', 'assets'));
console.log(`QA passed: approved responsive v2 client revision, strict-CSP precompiled storefront + admin logic, custom-domain canonical signals, crawlable collections/products/FAQ data, AI discovery index, expanded search prompts, phone/tablet orbit, official catalog media with owner-media exclusion, ${assetRefs.length} storefront and ${adminAssetRefs.length} admin local references, ${assetFiles.length} packaged assets, routes/enquiry flow, admin gate/2FA, and exact reviewed dist output.`);
