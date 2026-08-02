import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const adminHtml = await readFile(path.join(root, 'admin.html'), 'utf8');
const support = await readFile(path.join(root, 'public', 'support.js'), 'utf8');
const adminData = await readFile(path.join(root, 'public', 'admin-data.js'), 'utf8');
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
if (hashText(html) !== '1521d6274bf54bb0a8aa9630c98bb2f0b40142c427a083e10b7bcef2fd246192') {
  throw new Error('index.html differs from the approved Kross One Gadget Shop v2 client revision.');
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
requireText(html, 'data-mobile-orbit', 'mobile circular product motion');
requireText(html, 'assets/hp-omnibook-7-flip-front.webp', 'HP OmniBook catalog artwork');
requireText(html, 'assets/apple-watch-ultra-2.mp4', 'Apple Watch product video');
requireText(html, 'assets/samsung-watch8-bedtime.mp4', 'Samsung Galaxy Watch8 product video');
requireText(html, 'Bose SoundLink Max Portable Speaker', 'Bose speaker catalog item');
requireText(html, 'JBL Tune 770NC Wireless Headphones', 'JBL headphone catalog item');
requireText(html, 'PS4 Games & PlayStation VR Demo Disc', 'games disc catalog item');
requireText(html, 'aria-label="Enquiry list"', 'enquiry list control');
requireText(html, 'Send list on WhatsApp', 'WhatsApp enquiry-list action');
requireText(html, "else if (seg[0] === 'visit') page = 'visit';", 'visit route');
requireText(html, "else if (seg[0] === 'technology') { page = 'home'; param = 'inside'; }", 'inside route');
requireText(html, 'Shop #18A, Lugogo Mall', 'shop location');

const typerMatch = html.match(/TYPE = \[([\s\S]*?)\];/);
if (!typerMatch) throw new Error('Animated search prompt inventory is missing.');
for (const model of ['iPhone 17 Pro Max 256GB', 'Samsung Galaxy S25 Ultra 256GB', 'Samsung Galaxy Watch8 44mm Silver']) {
  requireText(typerMatch[1], model, 'specific Apple/Samsung animated search model');
}
if (/Sony|JBL|PlayStation/i.test(typerMatch[1])) {
  throw new Error('Animated search prompts must only advertise specific Apple and Samsung inventory.');
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
console.log(`QA passed: approved v2 client revision, Apple/Samsung search prompts, mobile orbit, expanded catalog/media, component syntax for storefront + admin, ${assetRefs.length} storefront and ${adminAssetRefs.length} admin local references, ${assetFiles.length} packaged assets, GitHub Pages-safe URLs, routes/enquiry flow, admin gate/2FA, and exact dist output.`);
