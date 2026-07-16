import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const adminHtml = await readFile(path.join(root, 'admin.html'), 'utf8');
const support = await readFile(path.join(root, 'public', 'support.js'), 'utf8');
const adminData = await readFile(path.join(root, 'public', 'admin-data.js'), 'utf8');
const builtHtml = await readFile(path.join(root, 'dist', 'index.html'), 'utf8');
const builtAdminHtml = await readFile(path.join(root, 'dist', 'admin.html'), 'utf8');

const requireText = (source, needle, label) => {
  if (!source.includes(needle)) throw new Error(`Missing ${label}: ${needle}`);
};

// Storefront: dark-first defaults, native to the latest handoff.
requireText(html, '<html data-theme="dark">', 'dark-first document state');
requireText(html, "theme: 'dark'", 'dark-first component state');
requireText(html, "let theme = 'dark';", 'dark-first mounted state');
requireText(html, 'color: var(--tx); caret-color: var(--tx);', 'theme-aware input text');

// Storefront: checkout requires an account and preserves checkout intent through auth.
const checkoutIntents = html.split("this._postAuth = '#/checkout';").length - 1;
if (checkoutIntents < 2) throw new Error('Checkout must be account-gated on both the route and the payment action, preserving checkout intent.');

// Storefront: cart control inverts with the theme (light-on-dark in dark mode).
requireText(html, 'aria-label="Cart" style="display:flex;align-items:center;gap:9px;background:var(--tx);color:var(--bg)', 'theme-inverting cart treatment');

// Storefront: promo codes accepted in cart and checkout, shown in tracking.
if (html.split('placeholder="Promo code"').length - 1 < 2) throw new Error('Promo code entry must be present in both cart and checkout.');
requireText(html, 'trackHasPromo', 'promo line on order tracking');

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

const desktopHeader = html.slice(html.indexOf('<sc-if value="{{ isDesktop }}"'), html.indexOf('<sc-if value="{{ isMobile }}"'));
const savedIndex = desktopHeader.indexOf('href="#/saved"');
const cartIndex = desktopHeader.indexOf('aria-label="Cart"');
const signInIndex = desktopHeader.indexOf('href="#/login"');
if (!(savedIndex >= 0 && savedIndex < cartIndex && cartIndex < signInIndex)) {
  throw new Error('Desktop navigation order must be Saved, Cart, Sign in.');
}

if (builtHtml !== html) throw new Error('dist/index.html differs from the authoritative storefront source.');
if (builtAdminHtml !== adminHtml) throw new Error('dist/admin.html differs from the authoritative admin console source.');

const assetFiles = await readdir(path.join(root, 'public', 'assets'));
console.log(`QA passed: component/runtime syntax for storefront + admin, ${assetRefs.length} storefront and ${adminAssetRefs.length} admin local references, ${assetFiles.length} packaged assets, GitHub Pages-safe URLs, auth-gated checkout, promo codes, dark defaults, admin gate/2FA, and exact dist output.`);
