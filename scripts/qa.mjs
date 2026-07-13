import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const support = await readFile(path.join(root, 'public', 'support.js'), 'utf8');
const builtHtml = await readFile(path.join(root, 'dist', 'index.html'), 'utf8');

const requireText = (needle, label) => {
  if (!html.includes(needle)) throw new Error(`Missing ${label}: ${needle}`);
};

requireText('<html data-theme="dark">', 'dark-first document state');
requireText("theme: 'dark'", 'dark-first component state');
requireText("let theme = 'dark';", 'dark-first mounted state');
requireText('color: var(--tx); caret-color: var(--tx);', 'theme-aware input text');
requireText("if (this.state.auth) page = 'checkout'", 'checkout route account guard');
requireText("if (!this.state.auth)", 'payment action account guard');
requireText('--cart-bg:#ffffff; --cart-fg:#0d0f14;', 'dark-mode white cart treatment');

const componentMatch = html.match(/<script type="text\/x-dc"[\s\S]*?>([\s\S]*?)<\/script>/);
if (!componentMatch) throw new Error('Design-export component script is missing.');
new Function('DCLogic', `${componentMatch[1]}\nreturn Component;`);
new Function(support);

const assetRefs = [...new Set([...html.matchAll(/["'](assets\/[A-Za-z0-9._/-]+)["']/g)].map((match) => match[1]))];
const missingAssets = [];
for (const ref of assetRefs) {
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

const assetFiles = await readdir(path.join(root, 'public', 'assets'));
console.log(`QA passed: component/runtime syntax, ${assetRefs.length} local references, ${assetFiles.length} packaged assets, auth-gated checkout, dark defaults, and exact dist output.`);
