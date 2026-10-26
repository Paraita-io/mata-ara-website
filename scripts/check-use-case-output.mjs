import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { useCases } from '../src/content/use-cases.mjs';
import { findUnprefixedLocaleRootLinks } from './use-case-output-utils.mjs';

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
const renderedTitles = new Set();
const renderedDescriptions = new Set();
const expectedUseCaseRoutes = Object.entries(expected).map(([slug, { locale }]) => `${basePath}/${locale}/${slug}/`);

for (const locale of ['en', 'fr']) {
  const home = await readFile(resolve('dist', locale, 'index.html'), 'utf8');
  const featuresRoute = locale === 'en' ? `${basePath}/en/features/` : `${basePath}/fr/fonctionnalites/`;
  assert.ok(home.includes(`href="${featuresRoute}#premium"`), `${locale} homepage links to its Premium comparison`);
  for (const [, route] of Object.entries({
    mobileData: locale === 'en' ? `${basePath}/en/mobile-data-tracker/` : `${basePath}/fr/suivi-forfait-mobile/`,
    networkCounters: locale === 'en' ? `${basePath}/en/iphone-network-counters/` : `${basePath}/fr/compteurs-reseau-iphone/`,
    travelEsim: locale === 'en' ? `${basePath}/en/travel-esim-data/` : `${basePath}/fr/suivi-esim-voyage/`,
  })) assert.ok(home.includes(`href="${route}"`), `${locale} homepage links directly to ${route}`);
  assert.ok(home.includes(`src="${basePath}/assets/mata-ara-mark.png"`), `${locale} homepage loads the brand mark`);
  assert.ok(home.includes(`href="${basePath}/assets/mata-ara-favicon-32.png"`), `${locale} homepage loads the favicon`);
  assert.ok(home.includes(`href="${basePath}/assets/mata-ara-apple-touch-icon-180.png"`), `${locale} homepage loads the Apple touch icon`);
  const features = await readFile(resolve('dist', locale, locale === 'en' ? 'features' : 'fonctionnalites', 'index.html'), 'utf8');
  assert.ok(features.includes('id="premium"'), `${locale} features page exposes the Premium comparison anchor`);
  assert.match(features, /<table class="comparison-table"><caption>[^<]+<\/caption>/, `${locale} comparison has a caption`);
  const columnHeaders = [...features.matchAll(/<th scope="col">([^<]+)<\/th>/g)].map((match) => match[1]);
  assert.deepEqual(columnHeaders, locale === 'en' ? ['Feature', 'Free', 'Premium'] : ['Fonctionnalité', 'Gratuite', 'Complète'], `${locale} comparison has the localized tier order`);
  assert.match(features, /<th scope="row">[^<]+<\/th>/, `${locale} comparison has scoped row headers`);
  const comparisonRows = locale === 'en' ? [
    ['Configured quota and live network-interface counters', 'Included', 'Included'],
    ['History tab and usage charts', 'Included', 'Included'],
    ['100% quota notification', 'Included', 'Included'],
    ['Rate warning, expiry reminder, and unusual-usage alert', 'Included', 'Included'],
    ['Apple Watch companion and Home Screen widget', 'Included', 'Included'],
    ['Optional notifications at 50%, 75%, and 90% thresholds', '—', 'Included'],
    ['Detailed per-interface upload and download speed history, opened from a monitoring card', '—', 'Included'],
    ['Banner ad on the main screen', 'Shown', 'Removed'],
  ] : [
    ['Quota configuré et compteurs réseau actualisés en direct', 'Inclus', 'Inclus'],
    ['Onglet Historique et graphiques d’usage', 'Inclus', 'Inclus'],
    ['Notifications de quota à 100 %', 'Inclus', 'Inclus'],
    ['Alerte de débit, rappel d’expiration et alerte de consommation inhabituelle', 'Inclus', 'Inclus'],
    ['Compagnon Apple Watch et widget d’écran d’accueil', 'Inclus', 'Inclus'],
    ['Notifications facultatives aux seuils de 50 %, 75 % et 90 %', '—', 'Inclus'],
    ['Historique détaillé des vitesses en envoi et réception par interface, depuis une fiche de suivi', '—', 'Inclus'],
    ['Bannière publicitaire sur l’écran principal', 'Affichée', 'Supprimée'],
  ];
  const renderedRows = [...features.matchAll(/<tr><th scope="row">([^<]+)<\/th><td>([^<]+)<\/td><td>([^<]+)<\/td><\/tr>/g)].map((match) => match.slice(1));
  assert.deepEqual(renderedRows, comparisonRows, `${locale} comparison assigns each capability to the correct tier`);
  assert.ok(features.includes(locale === 'en'
    ? 'Premium is a one-time in-app purchase. The current price is shown by the App Store.'
    : 'La version complète est proposée comme achat intégré unique. Le prix actuel est affiché par l’App Store.'), `${locale} comparison explains the one-time purchase and price`);
  const featureRoutes = locale === 'en'
    ? [`${basePath}/en/mobile-data-tracker/`, `${basePath}/en/iphone-network-counters/`, `${basePath}/en/travel-esim-data/`]
    : [`${basePath}/fr/suivi-forfait-mobile/`, `${basePath}/fr/compteurs-reseau-iphone/`, `${basePath}/fr/suivi-esim-voyage/`];
  for (const route of featureRoutes) assert.ok(features.includes(`href="${route}"`), `${locale} features page links directly to ${route}`);
}

for (const [slug, { id, locale, alternate, related }] of Object.entries(expected)) {
  const html = await readFile(resolve('dist', locale, slug, 'index.html'), 'utf8');
  const route = `${basePath}/${locale}/${slug}/`;
  const alternateRoute = `${basePath}/${locale === 'en' ? 'fr' : 'en'}/${alternate}/`;
  assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`), `${route} has its locale`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route} has exactly one H1`);
  assert.ok(html.includes(`<link rel="canonical" href="${canonicalOrigin}${route}"`), `${route} has its canonical URL`);
  assert.match(html, /<title>[^<]+<\/title>/, `${route} has a title`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${route} has a description`);
  const renderedTitle = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const renderedDescription = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(renderedTitle, `${route} title is present`);
  assert.ok(renderedDescription, `${route} description is present`);
  renderedTitles.add(renderedTitle);
  renderedDescriptions.add(renderedDescription);
  assert.ok(html.includes(`src="${basePath}/assets/mata-ara-mark.png"`), `${route} loads the brand mark`);
  assert.ok(html.includes(`href="${basePath}/assets/mata-ara-favicon-32.png"`), `${route} loads the favicon`);
  assert.ok(html.includes(`href="${basePath}/assets/mata-ara-apple-touch-icon-180.png"`), `${route} loads the Apple touch icon`);
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
assert.equal(renderedTitles.size, 6, 'all rendered use-case titles are unique');
assert.equal(renderedDescriptions.size, 6, 'all rendered use-case descriptions are unique');

for (const route of expectedUseCaseRoutes) {
  assert.ok((await readFile(resolve('dist/sitemap.xml'), 'utf8')).includes(`<loc>${canonicalOrigin}${route}</loc>`), `sitemap includes ${route}`);
}
const robots = await readFile(resolve('dist/robots.txt'), 'utf8');
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}${basePath}/sitemap.xml`), 'robots.txt references the configured sitemap URL');
assert.doesNotMatch(robots, /\/dist\//, 'robots.txt does not expose local dist paths');
for (const slug of Object.keys(expected)) {
  const { locale } = expected[slug];
  const html = await readFile(resolve('dist', locale, slug, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /(?:href|src)="[^"]*\/dist\//, `${locale}/${slug} does not expose dist paths`);
  assert.deepEqual(findUnprefixedLocaleRootLinks(html, basePath), [], `${locale}/${slug} does not expose unprefixed locale-root links`);
}

console.log(`Verified six use-case routes, home and feature discovery, icons, metadata, sitemap and robots under ${basePath || '/'}.`);
