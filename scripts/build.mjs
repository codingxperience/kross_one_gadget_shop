import { cp, copyFile, mkdir, readFile, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildSeoPages } from './seo-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceHtml = path.join(root, 'index.html');
const sourceAdminHtml = path.join(root, 'admin.html');
const sourcePublic = path.join(root, 'public');
const output = path.join(root, 'dist');

await Promise.all([stat(sourceHtml), stat(sourceAdminHtml), stat(sourcePublic)]);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await copyFile(sourceHtml, path.join(output, 'index.html'));
await copyFile(sourceAdminHtml, path.join(output, 'admin.html'));
await cp(sourcePublic, output, { recursive: true });
const seoBuild = await buildSeoPages({ sourceHtml: await readFile(sourceHtml, 'utf8'), output });

console.log(`Production storefront and admin console copied to dist/ without transforming the approved v2 client revision. Generated ${seoBuild.collectionCount} crawlable collection pages, ${seoBuild.catalogCount} product pages and ${seoBuild.sitemapCount} sitemap URLs.`);
