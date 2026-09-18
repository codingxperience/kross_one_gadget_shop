/**
 * Price entry helper.
 *
 *   npm run prices:template   → writes data/prices.csv, one row per catalogue product
 *   npm run prices:import     → validates data/prices.csv and rewrites data/pricing.json
 *
 * Editing JSON by hand is a poor job to hand a shop owner: one stray comma and the build
 * loses every price. A spreadsheet round-trip is the same data with a far better failure
 * mode, and the importer refuses anything it cannot verify instead of publishing it.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseCatalog } from './seo-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogSource = path.join(root, 'index.html');
const csvFile = path.join(root, 'data', 'prices.csv');
const pricingFile = path.join(root, 'data', 'pricing.json');

const CONDITIONS = ['new', 'refurbished', 'used'];
const AVAILABILITIES = ['InStock', 'OutOfStock', 'PreOrder', 'LimitedAvailability'];
const COLUMNS = ['id', 'name', 'category', 'price_ugx', 'price_high_ugx', 'condition', 'availability', 'note'];

const categoryLabels = {
  'game-discs': 'Game Discs', bags: 'Laptop Bags', travel: 'Travel & Trolley Bags', mobiles: 'Mobiles',
  laptops: 'Laptops', tablets: 'iPads & Tablets', audio: 'Audio', watches: 'Smart Watches',
  gaming: 'Gaming', cameras: 'Cameras', accessories: 'Accessories', lifestyle: 'Fragrance & Grooming'
};

const csvCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const toCsv = (rows) => rows.map((row) => row.map(csvCell).join(',')).join('\n') + '\n';

/** Minimal RFC 4180 reader: quoted fields, embedded commas/newlines, doubled quotes. */
const parseCsv = (source) => {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const text = source.replace(/^﻿/, '').replace(/\r\n/g, '\n');

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else { quoted = false; }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') { quoted = true; continue; }
    if (char === ',') { row.push(field); field = ''; continue; }
    if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += char;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter((entry) => entry.some((cell) => cell.trim() !== ''));
};

const loadCatalog = async () => parseCatalog(await readFile(catalogSource, 'utf8'));

const loadPricingFile = async () => {
  try {
    return JSON.parse(await readFile(pricingFile, 'utf8'));
  } catch {
    return { currency: 'UGX', priceValidDays: 30, products: {} };
  }
};

const writeTemplate = async () => {
  const [catalog, pricing] = await Promise.all([loadCatalog(), loadPricingFile()]);
  const existing = pricing.products || {};
  const rows = [COLUMNS];

  for (const product of catalog) {
    const current = existing[product.id] || {};
    rows.push([
      product.id,
      product.name,
      categoryLabels[product.cat] || product.cat,
      current.price ?? '',
      current.priceHigh ?? '',
      current.condition ?? '',
      current.availability ?? '',
      current.note ?? ''
    ]);
  }

  await writeFile(csvFile, toCsv(rows), 'utf8');
  const filled = catalog.filter((product) => existing[product.id]).length;
  console.log(`Wrote data/prices.csv with ${catalog.length} products (${filled} already priced).`);
  console.log('');
  console.log('Open it in Excel, Google Sheets or LibreOffice and fill in price_ugx.');
  console.log('  price_ugx       whole shillings, no separators — 6200000, not "6,200,000 UGX"');
  console.log(`  price_high_ugx  optional; set it only when the model spans a range across storage tiers`);
  console.log(`  condition       ${CONDITIONS.join(' | ')}   (blank means new)`);
  console.log(`  availability    ${AVAILABILITIES.join(' | ')}   (blank means InStock)`);
  console.log('  note            optional, shown beside the price — e.g. "256GB, sealed"');
  console.log('');
  console.log('Leave price_ugx blank for anything not settled; that product keeps "ask today\'s price".');
  console.log('Then run:  npm run prices:import');
};

const importTemplate = async () => {
  const [catalog, pricing] = await Promise.all([loadCatalog(), loadPricingFile()]);
  const known = new Map(catalog.map((product) => [product.id, product]));

  let source;
  try {
    source = await readFile(csvFile, 'utf8');
  } catch {
    console.error('data/prices.csv not found. Run "npm run prices:template" first.');
    process.exitCode = 1;
    return;
  }

  const rows = parseCsv(source);
  if (!rows.length) {
    console.error('data/prices.csv is empty.');
    process.exitCode = 1;
    return;
  }

  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  const missing = COLUMNS.filter((column) => !header.includes(column));
  if (missing.length) {
    console.error(`data/prices.csv is missing required column(s): ${missing.join(', ')}`);
    console.error('Regenerate it with "npm run prices:template" and re-enter the prices.');
    process.exitCode = 1;
    return;
  }
  const at = (row, column) => (row[header.indexOf(column)] ?? '').trim();

  const products = {};
  const errors = [];
  const seen = new Set();

  rows.slice(1).forEach((row, index) => {
    const line = index + 2; // header is line 1
    const id = at(row, 'id');
    if (!id) return;

    if (!known.has(id)) {
      errors.push(`line ${line}: "${id}" is not a product in the catalogue.`);
      return;
    }
    if (seen.has(id)) {
      errors.push(`line ${line}: "${id}" appears more than once.`);
      return;
    }
    seen.add(id);

    const rawPrice = at(row, 'price_ugx').replace(/[,\s]/g, '');
    if (!rawPrice) return; // deliberately unpriced

    const price = Number(rawPrice);
    if (!Number.isFinite(price) || price <= 0) {
      errors.push(`line ${line} (${id}): price_ugx "${at(row, 'price_ugx')}" is not a positive number.`);
      return;
    }
    if (!Number.isInteger(price)) {
      errors.push(`line ${line} (${id}): price_ugx must be whole shillings, got ${price}.`);
      return;
    }

    const entry = { price };

    const rawHigh = at(row, 'price_high_ugx').replace(/[,\s]/g, '');
    if (rawHigh) {
      const high = Number(rawHigh);
      if (!Number.isFinite(high) || high <= price) {
        errors.push(`line ${line} (${id}): price_high_ugx must be a number greater than price_ugx.`);
        return;
      }
      entry.priceHigh = high;
    }

    const condition = at(row, 'condition') || 'new';
    if (!CONDITIONS.includes(condition)) {
      errors.push(`line ${line} (${id}): condition "${condition}" must be one of ${CONDITIONS.join(', ')}.`);
      return;
    }
    entry.condition = condition;

    const availability = at(row, 'availability') || 'InStock';
    if (!AVAILABILITIES.includes(availability)) {
      errors.push(`line ${line} (${id}): availability "${availability}" must be one of ${AVAILABILITIES.join(', ')}.`);
      return;
    }
    entry.availability = availability;

    const note = at(row, 'note');
    if (note) entry.note = note;

    products[id] = entry;
  });

  if (errors.length) {
    console.error(`data/prices.csv has ${errors.length} problem(s). Nothing was written:`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exitCode = 1;
    return;
  }

  const next = { ...pricing, updated: new Date().toISOString().slice(0, 10), products };
  await writeFile(pricingFile, `${JSON.stringify(next, null, 2)}\n`, 'utf8');

  const count = Object.keys(products).length;
  console.log(`Imported ${count} price(s) into data/pricing.json (of ${catalog.length} products).`);
  if (count < catalog.length) {
    console.log(`${catalog.length - count} product(s) stay at "ask today's price" and carry no Offer markup.`);
  }
  console.log('Run "npm run build" to publish them.');
};

const mode = process.argv[2];
if (mode === 'template') await writeTemplate();
else if (mode === 'import') await importTemplate();
else {
  console.error('Usage: node scripts/prices.mjs <template|import>');
  process.exitCode = 1;
}
