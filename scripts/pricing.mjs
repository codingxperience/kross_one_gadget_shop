import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pricingFile = path.join(root, 'data', 'pricing.json');

const conditionSchema = {
  new: 'https://schema.org/NewCondition',
  refurbished: 'https://schema.org/RefurbishedCondition',
  used: 'https://schema.org/UsedCondition'
};

const conditionLabel = {
  new: 'Brand new, sealed',
  refurbished: 'Certified refurbished',
  used: 'Certified pre-owned'
};

const availabilitySchema = {
  InStock: 'https://schema.org/InStock',
  OutOfStock: 'https://schema.org/OutOfStock',
  PreOrder: 'https://schema.org/PreOrder',
  LimitedAvailability: 'https://schema.org/LimitedAvailability'
};

const availabilityLabel = {
  InStock: 'In stock at Shop #18A',
  OutOfStock: 'Out of stock — ask when it returns',
  PreOrder: 'Available to pre-order',
  LimitedAvailability: 'Limited stock — confirm before travelling'
};

/**
 * Reads data/pricing.json. A missing or malformed file is not fatal: the site builds
 * without prices rather than failing a deployment, because no price is always safer
 * than a wrong price.
 */
export const loadPricing = async () => {
  let raw;
  try {
    raw = JSON.parse(await readFile(pricingFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`Pricing: data/pricing.json could not be read (${error.message}). Building without prices.`);
    }
    return { currency: 'UGX', updated: null, priceValidDays: 30, entries: new Map() };
  }

  const currency = typeof raw.currency === 'string' ? raw.currency : 'UGX';
  const priceValidDays = Number.isFinite(raw.priceValidDays) ? raw.priceValidDays : 30;
  const entries = new Map();

  for (const [id, value] of Object.entries(raw.products || {})) {
    const price = Number(value?.price);
    if (!Number.isFinite(price) || price <= 0) {
      console.warn(`Pricing: skipping "${id}" — price must be a positive number.`);
      continue;
    }
    const priceHigh = Number.isFinite(Number(value?.priceHigh)) && Number(value.priceHigh) > price
      ? Number(value.priceHigh)
      : null;
    const condition = conditionSchema[value?.condition] ? value.condition : 'new';
    const availability = availabilitySchema[value?.availability] ? value.availability : 'InStock';
    entries.set(id, {
      price,
      priceHigh,
      condition,
      availability,
      note: typeof value?.note === 'string' && value.note.trim() ? value.note.trim() : null
    });
  }

  return { currency, updated: raw.updated || null, priceValidDays, entries };
};

const amountFormatter = new Intl.NumberFormat('en-UG');

/** "UGX 6,200,000" — the format Ugandan shoppers and Google both read cleanly. */
export const formatPrice = (amount, currency) => `${currency} ${amountFormatter.format(Math.round(amount))}`;

export const priceRangeLabel = (entry, currency) => entry.priceHigh
  ? `${formatPrice(entry.price, currency)} – ${formatPrice(entry.priceHigh, currency)}`
  : formatPrice(entry.price, currency);

export const priceValidUntil = (priceValidDays) => {
  const date = new Date();
  date.setDate(date.getDate() + priceValidDays);
  return date.toISOString().slice(0, 10);
};

export const conditionText = (entry) => conditionLabel[entry.condition];
export const availabilityText = (entry) => availabilityLabel[entry.availability];

/**
 * Builds schema.org Offer (or AggregateOffer for a configuration range).
 * Returns null when there is no price, so no incomplete Offer is ever emitted.
 */
export const offerSchema = ({ entry, currency, priceValidDays, url, seller }) => {
  if (!entry) return null;
  const shared = {
    priceCurrency: currency,
    availability: availabilitySchema[entry.availability],
    itemCondition: conditionSchema[entry.condition],
    url,
    priceValidUntil: priceValidUntil(priceValidDays),
    seller
  };
  if (entry.priceHigh) {
    return {
      '@type': 'AggregateOffer',
      lowPrice: entry.price,
      highPrice: entry.priceHigh,
      offerCount: 2,
      ...shared
    };
  }
  return { '@type': 'Offer', price: entry.price, ...shared };
};
