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
const foldFlip = await readFile(path.join(root, 'public', 'assets', 'fold-flip8.png'));
const foldZ = await readFile(path.join(root, 'public', 'assets', 'fold-zfold8.png'));
const builtHtml = await readFile(path.join(root, 'dist', 'index.html'), 'utf8');
const builtAdminHtml = await readFile(path.join(root, 'dist', 'admin.html'), 'utf8');

const requireText = (source, needle, label) => {
  if (!source.includes(needle)) throw new Error(`Missing ${label}: ${needle}`);
};

const hashText = (source) => createHash('sha256').update(source.replace(/\r\n/g, '\n')).digest('hex');
const hashBytes = (source) => createHash('sha256').update(source).digest('hex');

// Storefront: keep the approved v2 client revision and its runtime/assets lossless.
if (hashText(html) !== '21b6658aef93be1a5ceaa660d1d21a19c305e8ef340e0603c1d5188208f7202f') {
  throw new Error('index.html differs from the approved responsive Kross One Gadget Shop v2 client revision.');
}
if (hashText(support) !== 'ae4f0ac8449655e17cca1e3b179effcb6817a3b0d8dc47f112a9c39c25c39fd7') {
  throw new Error('public/support.js differs from the runtime supplied with the v2 handoff.');
}
if (hashBytes(foldFlip) !== '118dbc80075088641904f8082fc4084ec8b0068e01610b9af9807d22fe4e2583') {
  throw new Error('fold-flip8.png differs from the v2 handoff asset.');
}
if (hashBytes(foldZ) !== '73f8ec353b15cb37bf5a42effc7ea05033b50e6505a9a56eb90862048147bd87') {
  throw new Error('fold-zfold8.png differs from the v2 handoff asset.');
}

// Storefront: distinctive v2 structure, routes, content, and enquiry flow.
requireText(html, "html { scroll-behavior: smooth; background: #08080b; }", 'v2 dark canvas');
requireText(html, 'family=Archivo:wdth,wght@62..125,400..900&family=Instrument+Sans', 'v2 typography');
requireText(html, 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'visit map runtime');
requireText(html, 'assets/fold-flip8.png', 'Galaxy Z Flip 8 artwork');
requireText(html, 'assets/fold-zfold8.png', 'Galaxy Z Fold 8 artwork');
requireText(html, '@media (max-width: 1100px)', 'phone/tablet circular motion breakpoint');
requireText(html, 'data-mobile-orbit', 'phone/tablet circular product motion');
requireText(html, 'data-util-window', 'small-screen utility message window');
requireText(html, 'data-menubtn', 'left navigation menu control');
requireText(html, 'assets/official-hp-omnibook-x-flip-14.png', 'official HP OmniBook X Flip catalog artwork');
requireText(html, 'assets/official-apple-watch-ultra2-hero.jpg', 'official Apple Watch Ultra 2 artwork');
requireText(html, 'assets/official-samsung-watch8-silver-perspective.jpg', 'official Samsung Galaxy Watch8 artwork');
requireText(html, 'assets/official-braun-series5-51-b1000s.jpg', 'official Braun Series 5 artwork');
requireText(html, 'assets/official-philips-mg5921-15.png', 'official Philips MG5921/15 artwork');
requireText(html, 'assets/official-creed-viking-cologne.jpg', 'official Creed fragrance artwork');
requireText(html, 'assets/official-valentino-born-in-roma-donna.jpg', 'official Valentino fragrance artwork');
requireText(html, 'assets/official-armani-prive-rouge-malachite.jpg', 'official Armani fragrance artwork');
requireText(html, 'assets/official-carolina-herrera-212-vip-men.jpg', 'official Carolina Herrera fragrance artwork');
requireText(html, 'Bose SoundLink Max Portable Speaker', 'Bose speaker catalog item');
requireText(html, 'JBL Tune 770NC Wireless Headphones', 'JBL headphone catalog item');
requireText(html, 'aria-label="Enquiry list"', 'enquiry list control');
requireText(html, 'Send list on WhatsApp', 'WhatsApp enquiry-list action');
requireText(html, "else if (seg[0] === 'visit') page = 'visit';", 'visit route');
requireText(html, "else if (seg[0] === 'technology') { page = 'home'; param = 'inside'; }", 'inside route');
requireText(html, 'Shop #18A, Lugogo Mall', 'shop location');

const typerMatch = html.match(/TYPE = \[([\s\S]*?)\];/);
if (!typerMatch) throw new Error('Animated search prompt inventory is missing.');
for (const model of ['iPhone 17 Pro Max 256GB', 'Samsung Galaxy S25 Ultra 256GB', 'HP OmniBook X Flip 14-fm0013dx', 'Braun Series 5 51-B1000s', 'Philips Trimmer 5000 MG5921/15', 'JBL Tune 770NC Headphones', 'Bose SoundLink Max Speaker', 'Creed Viking Cologne', 'Bleu de Chanel Eau de Parfum', 'Dior Sauvage Eau de Parfum', 'Valentino Donna Born in Roma', 'Armani Privé Rouge Malachite', 'Carolina Herrera 212 VIP Men']) {
  requireText(typerMatch[1], model, 'specific animated search inventory item');
}
if (/Sony|PlayStation/i.test(typerMatch[1])) {
  throw new Error('Animated search prompts advertise inventory the owner did not confirm.');
}

const ownerMediaNames = [
  'apple-watch-ultra-2.mp4', 'bose-qc-ultra-white.webp', 'bose-soundlink-max-black.jpg',
  'bose-soundlink-micro-front.webp', 'games-ps4-gta-v.webp', 'hp-omnibook-7-flip-front.webp',
  'jbl-tune-770nc-black.webp', 'laptop-bag-lenovo-t210.webp', 'perfume-kkw-fragrance.jpeg',
  'philips-rotary-shaver.webp', 'samsung-watch8-bedtime.mp4', 'smartwatch-alexa-pink.jpg',
  'trolley-bag-silver.webp'
];
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
for (const maker of ['HP', 'Braun', 'Philips', 'JBL', 'Bose', 'Samsung', 'Apple', 'Creed', 'Chanel', 'Dior', 'Valentino', 'Armani', 'Carolina Herrera']) {
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
