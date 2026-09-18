import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildSeoPages } from './seo-pages.mjs';
import { precompileDcDocument } from './precompile-dc.mjs';
import { rewriteSiteOrigin, siteUrl } from './site-config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceHtml = path.join(root, 'index.html');
const sourceAdminHtml = path.join(root, 'admin.html');
const sourcePublic = path.join(root, 'public');
const output = path.join(root, 'dist');

await Promise.all([stat(sourceHtml), stat(sourceAdminHtml), stat(sourcePublic)]);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(sourcePublic, output, { recursive: true });
const [sourceStorefrontHtml, adminHtml] = await Promise.all([
  readFile(sourceHtml, 'utf8'),
  readFile(sourceAdminHtml, 'utf8')
]);
const storefrontHtml = rewriteSiteOrigin(sourceStorefrontHtml);
const [builtStorefrontHtml, builtAdminHtml] = await Promise.all([
  precompileDcDocument({ html: storefrontHtml, output, label: 'index.html', names: ['Root', 'index'], scriptFile: 'app-logic.js' }),
  precompileDcDocument({ html: adminHtml, output, label: 'admin.html', names: ['admin'], scriptFile: 'admin-logic.js' })
]);
await Promise.all([
  writeFile(path.join(output, 'index.html'), builtStorefrontHtml, 'utf8'),
  writeFile(path.join(output, 'admin.html'), builtAdminHtml, 'utf8')
]);
const seoBuild = await buildSeoPages({ sourceHtml: storefrontHtml, output });

// Both machine-readable indexes must carry the canonical origin, not a retired one.
await Promise.all(['llms.txt', 'llms-full.txt'].map(async (name) => {
  const file = path.join(output, name);
  await writeFile(file, rewriteSiteOrigin(await readFile(file, 'utf8')), 'utf8');
}));

console.log(`Production storefront and admin logic precompiled for a strict Content Security Policy at ${siteUrl}. Generated ${seoBuild.collectionCount} crawlable collection pages, ${seoBuild.catalogCount} product pages, a price list and ${seoBuild.sitemapCount} sitemap URLs.`);

const unpriced = seoBuild.catalogCount - seoBuild.pricedCount;
if (unpriced > 0) {
  console.log(`Pricing: ${seoBuild.pricedCount} of ${seoBuild.catalogCount} products publish a price. ${unpriced} show "ask today's price" and carry no Offer markup — add them in data/pricing.json to become eligible for price-rich results.`);
} else {
  console.log(`Pricing: all ${seoBuild.catalogCount} products publish a price.`);
}
