const fallbackSiteUrl = 'https://www.kross-one-gadgets.co.ug';
const configuredSiteUrl = (process.env.PUBLIC_SITE_URL || fallbackSiteUrl).trim().replace(/\/+$/, '');

let parsedSiteUrl;
try {
  parsedSiteUrl = new URL(configuredSiteUrl);
} catch {
  throw new Error(`PUBLIC_SITE_URL is not a valid absolute URL: ${configuredSiteUrl}`);
}

if (parsedSiteUrl.protocol !== 'https:' || parsedSiteUrl.pathname !== '/' || parsedSiteUrl.search || parsedSiteUrl.hash) {
  throw new Error('PUBLIC_SITE_URL must be an HTTPS origin without a path, query string or fragment.');
}

export const siteUrl = configuredSiteUrl;

const knownOrigins = [
  'https://kross-one-gadget-shop.vercel.app',
  'https://www.kross-one-gadgets.co.ug',
  'https://kross-one-gadgets.co.ug'
];

export const rewriteSiteOrigin = (source) => knownOrigins.reduce(
  (result, origin) => result.replaceAll(origin, siteUrl),
  source
);
