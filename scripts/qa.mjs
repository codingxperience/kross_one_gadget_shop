import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const adminHtml = await readFile(path.join(root, 'admin.html'), 'utf8');
const support = await readFile(path.join(root, 'public', 'support.js'), 'utf8');
const adminData = await readFile(path.join(root, 'public', 'admin-data.js'), 'utf8');
const assetSources = await readFile(path.join(root, 'ASSET_SOURCES.md'), 'utf8');
const manifest = await readFile(path.join(root, 'public', 'site.webmanifest'), 'utf8');
const foldMotionBlue = await readFile(path.join(root, 'public', 'assets', 'fold-motion-flip-blue.jpeg'));
const foldMotionBurgundy = await readFile(path.join(root, 'public', 'assets', 'fold-motion-fold-burgundy.jpeg'));
const foldMotionVideo = await readFile(path.join(root, 'public', 'assets', 'fold-motion-galaxy-series.mp4'));
const socialCard = await readFile(path.join(root, 'public', 'assets', 'og-kross-one-gadgets-v3.png'));
const builtHtml = await readFile(path.join(root, 'dist', 'index.html'), 'utf8');
const builtAdminHtml = await readFile(path.join(root, 'dist', 'admin.html'), 'utf8');

const requireText = (source, needle, label) => {
  if (!source.includes(needle)) throw new Error(`Missing ${label}: ${needle}`);
};

const hashText = (source) => createHash('sha256').update(source.replace(/\r\n/g, '\n')).digest('hex');
const hashBytes = (source) => createHash('sha256').update(source).digest('hex');

// Storefront: keep the approved v2 client revision and its runtime/assets lossless.
if (hashText(html) !== '90f4c97f3ac7be00ca2b3f0dc68e7d1db42eb3fe597b1d473651e6a633147a6d') {
  throw new Error('index.html differs from the approved responsive Kross One Gadgets v2 client revision.');
}
if (hashText(support) !== 'ae4f0ac8449655e17cca1e3b179effcb6817a3b0d8dc47f112a9c39c25c39fd7') {
  throw new Error('public/support.js differs from the runtime supplied with the v2 handoff.');
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
requireText(html, 'name="twitter:title" content="Kross One Gadgets | Apple &amp; Samsung Store | Lugogo Mall"', 'approved Twitter title');
requireText(html, 'assets/og-kross-one-gadgets-v3.png', 'approved Kross One social preview');
if (socialCard.length < 20_000) throw new Error('The versioned social card is unexpectedly small.');
requireText(manifest, '"name": "Kross One Gadgets"', 'installable storefront name');
requireText(html, 'assets/official-hp-omnibook-x-flip-14.png', 'official HP OmniBook X Flip catalog artwork');
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
for (const model of ['iPhone 17 Pro Max 256GB', 'iPhone 17 Pro Cosmic Orange', 'iPhone 17 256GB', 'Samsung Galaxy S26 Ultra 1TB', 'Samsung Galaxy S25 256GB', 'Galaxy Z Fold8 Ultra', 'Galaxy Z Flip8', 'RIDE 5 for PlayStation 5', 'EA SPORTS FC 26 game disc', 'ThinkPad Professional 16-inch Topload', 'Pierre Cardin 72cm trolley case', 'HP OmniBook X Flip 14-fm0013dx', 'HP Smart Tank 580 printer', 'Apple Watch Ultra 3 49mm', 'HUAWEI WATCH GT 6 Pro', 'HUAWEI WATCH Ultimate 2', 'Green Lion Strive Smart Watch', 'Braun Series 5 51-B1000s', 'Philips Trimmer 5000 MG5921/15', 'JBL PartyBox Stage 320', 'JBL Tune 770NC Headphones', 'Bose SoundLink Max Speaker', 'Ray-Ban Meta Smart Glasses', 'Powerology portable projector', 'Porodo Sovo 10000mAh MagSafe Power Bank', 'Creed Viking Cologne']) {
  requireText(typerMatch[1], model, 'specific animated search inventory item');
}
if (/Sony/i.test(typerMatch[1])) {
  throw new Error('Animated search prompts include Sony, which the owner did not confirm as phone/electronics inventory.');
}

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
for (const item of ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17', 'Samsung Galaxy S26 Ultra', 'HP Smart Tank 580 Wireless All-in-One Printer', 'JBL PartyBox Stage 320', 'Powerology Rotating Stand Portable Projector', 'Ray-Ban Meta Smart Glasses', 'HUAWEI WATCH GT 6 Pro', 'HUAWEI WATCH Ultimate 2', 'Green Lion Strive Smart Watch', 'Porodo Sovo 10000mAh MagSafe Power Bank']) {
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

if (builtHtml !== html) throw new Error('dist/index.html differs from the authoritative storefront source.');
if (builtAdminHtml !== adminHtml) throw new Error('dist/admin.html differs from the authoritative admin console source.');

const assetFiles = await readdir(path.join(root, 'public', 'assets'));
console.log(`QA passed: approved responsive v2 client revision, expanded search prompts, phone/tablet orbit, official catalog media with owner-media exclusion, component syntax for storefront + admin, ${assetRefs.length} storefront and ${adminAssetRefs.length} admin local references, ${assetFiles.length} packaged assets, GitHub Pages-safe URLs, routes/enquiry flow, admin gate/2FA, and exact dist output.`);
