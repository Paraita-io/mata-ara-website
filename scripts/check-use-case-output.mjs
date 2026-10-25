import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { useCases } from '../src/content/use-cases.mjs';

const siteUrl = process.env.SITE_URL?.trim();
if (!siteUrl) {
  console.log('Skipping use-case output checks; SITE_URL is not configured.');
  process.exit(0);
}
const canonicalOrigin = new URL(siteUrl).origin;
const basePath = `/${(process.env.BASE_PATH?.trim() ?? '').split('/').filter(Boolean).join('/')}`.replace(/^\/$/, '');
const expected = {
  'mobile-data-tracker': { id: 'mobileData', locale: 'en', alternate: 'suivi-forfait-mobile', related: ['iphone-network-counters', 'travel-esim-data'] },
  'suivi-forfait-mobile': { id: 'mobileData', locale: 'fr', alternate: 'mobile-data-tracker', related: ['compteurs-reseau-iphone', 'suivi-esim-voyage'] },
  'iphone-network-counters': { id: 'networkCounters', locale: 'en', alternate: 'compteurs-reseau-iphone', related: ['mobile-data-tracker', 'travel-esim-data'] },
  'compteurs-reseau-iphone': { id: 'networkCounters', locale: 'fr', alternate: 'iphone-network-counters', related: ['suivi-forfait-mobile', 'suivi-esim-voyage'] },
  'travel-esim-data': { id: 'travelEsim', locale: 'en', alternate: 'suivi-esim-voyage', related: ['mobile-data-tracker', 'iphone-network-counters'] },
  'suivi-esim-voyage': { id: 'travelEsim', locale: 'fr', alternate: 'travel-esim-data', related: ['suivi-forfait-mobile', 'compteurs-reseau-iphone'] },
};

const titles = new Set();
const descriptions = new Set();

for (const [slug, { id, locale, alternate, related }] of Object.entries(expected)) {
  const html = await readFile(resolve('dist', locale, slug, 'index.html'), 'utf8');
  const route = `${basePath}/${locale}/${slug}/`;
  const alternateRoute = `${basePath}/${locale === 'en' ? 'fr' : 'en'}/${alternate}/`;
  assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`), `${route} has its locale`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route} has exactly one H1`);
  assert.ok(html.includes(`<link rel="canonical" href="${canonicalOrigin}${route}"`), `${route} has its canonical URL`);
  assert.match(html, /<title>[^<]+<\/title>/, `${route} has a title`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${route} has a description`);
  assert.ok(html.includes(`hreflang="${locale === 'en' ? 'fr' : 'en'}" href="${canonicalOrigin}${alternateRoute}"`), `${route} has its paired locale alternate`);
  assert.ok(html.includes(`href="${basePath}/${locale}/"`), `${route} has a crawlable home breadcrumb`);
  assert.match(html, /<nav[^>]+aria-label="(?:Breadcrumbs?|Fil d’Ariane)"/i, `${route} has visible breadcrumbs`);
  assert.match(html, /<script type="application\/ld\+json">/i, `${route} has breadcrumb structured data`);
  assert.ok(html.includes(`href="${alternateRoute}"`), `${route} links to its paired route`);
  for (const relatedSlug of related) {
    assert.ok(html.includes(`href="${basePath}/${locale}/${relatedSlug}/"`), `${route} has a crawlable link to ${relatedSlug}`);
  }
  assert.match(html, /(?:View on the App Store|The new version will appear on the App Store at launch\.|Voir sur l’App Store|La fiche de la nouvelle version sera disponible à sa sortie\.)/,
    `${route} has the release-gated App Store action`);
  const content = useCases[id][locale];
  assert.ok(html.includes(content.title), `${route} has its localized page title`);
  assert.ok(html.includes(content.description), `${route} has its localized description`);
  titles.add(content.title);
  descriptions.add(content.description);
  assert.ok(html.includes(content.paragraphs[0]), `${route} contains its localized use-case copy`);
  assert.ok(html.includes(content.limitation), `${route} displays its limitation`);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd['@type'], 'BreadcrumbList', `${route} JSON-LD is BreadcrumbList`);
  assert.equal(jsonLd.itemListElement.length, 2, `${route} JSON-LD contains Home and current page`);
  const heading = content.title.replace(/ — Mata Ara$/, '');
  assert.equal(jsonLd.itemListElement[1].name, heading, `${route} JSON-LD matches the visible breadcrumb label`);
  assert.ok(html.includes(`aria-current="page">${heading}</li>`), `${route} visible breadcrumb identifies the current page`);
  assert.equal(jsonLd.itemListElement[0].item, `${canonicalOrigin}${basePath}/${locale}/`, `${route} JSON-LD begins at localized home`);
  assert.equal(jsonLd.itemListElement[1].item, `${canonicalOrigin}${route}`, `${route} JSON-LD ends at current page`);
  assert.ok(html.includes('application/ld+json'), `${route} has structured data when SITE_URL is configured`);
}

assert.equal(titles.size, 6, 'all use-case routes have unique localized titles');
assert.equal(descriptions.size, 6, 'all use-case routes have unique localized descriptions');

console.log(`Verified six use-case routes under ${basePath || '/'} with canonical, paired alternates, breadcrumbs, JSON-LD, copy, and App Store action.`);
