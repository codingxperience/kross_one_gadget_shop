import { cp, copyFile, mkdir, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

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

console.log('Production storefront and admin console copied to dist/ without transforming the authoritative handoff.');
