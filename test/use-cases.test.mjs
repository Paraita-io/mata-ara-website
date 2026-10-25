import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { useCases } from '../src/content/use-cases.mjs';

const routeMetadata = await readFile(new URL('../src/content/pages.ts', import.meta.url), 'utf8');

const expected = {
  mobileData: { en: '/en/mobile-data-tracker/', fr: '/fr/suivi-forfait-mobile/' },
  networkCounters: { en: '/en/iphone-network-counters/', fr: '/fr/compteurs-reseau-iphone/' },
  travelEsim: { en: '/en/travel-esim-data/', fr: '/fr/suivi-esim-voyage/' },
};

const localizedMetadata = (id, locale) => {
  const entry = routeMetadata.match(new RegExp(`${id}:\\s*\\{[\\s\\S]*?localized:\\s*\\{([\\s\\S]*?)\\n    \\},\\n  \\},`));
  assert.ok(entry, `missing ${id} page registry entry`);
  const localeEntry = entry[1].match(new RegExp(`${locale}:\\s*\\{([^}]+)\\}`));
  assert.ok(localeEntry, `missing ${locale} route for ${id}`);
  const fields = localeEntry[1];
  const slug = fields.match(/slug:\s*'([^']*)'/)?.[1];
  const title = fields.match(/title:\s*'([^']*)'/)?.[1];
  const description = fields.match(/description:\s*'([^']*)'/)?.[1];
  assert.notEqual(slug, undefined, `missing ${locale} slug for ${id}`);
  assert.ok(title, `missing ${locale} title for ${id}`);
  assert.ok(description, `missing ${locale} description for ${id}`);
  return { route: slug ? `/${locale}/${slug}/` : `/${locale}/`, title, description };
};

test('all three use cases have the approved paired localized routes', () => {
  for (const [id, locales] of Object.entries(expected)) {
    for (const [locale, route] of Object.entries(locales)) {
      assert.equal(localizedMetadata(id, locale).route, route);
    }
  }
});

test('each use case has distinct localized metadata and substantive copy', () => {
  for (const [id, pair] of Object.entries(useCases)) {
    assert.ok(pair.en && pair.fr, `${id} needs English and French content`);
    for (const locale of ['en', 'fr']) {
      const page = pair[locale];
      const metadata = localizedMetadata(id, locale);
      assert.equal(page.title, metadata.title, `${id}/${locale} content title must match route metadata`);
      assert.equal(page.description, metadata.description, `${id}/${locale} content description must match route metadata`);
      assert.ok(page.title.length > 12, `${id}/${locale} needs a specific title`);
      assert.ok(page.description.length > 45, `${id}/${locale} needs a useful description`);
      assert.ok(Array.isArray(page.paragraphs) && page.paragraphs.length >= 3, `${id}/${locale} needs multi-paragraph copy`);
      assert.ok(page.paragraphs.every((paragraph) => paragraph.length > 50), `${id}/${locale} paragraphs should be substantive`);
      assert.ok(page.limitation.length > 25, `${id}/${locale} needs a visible limitation`);
      assert.ok(Array.isArray(page.relatedIds) && page.relatedIds.length >= 1, `${id}/${locale} needs related use cases`);
      assert.ok(page.relatedIds.every((relatedId) => relatedId in useCases && relatedId !== id));
      assert.ok(page.cta.length > 5, `${id}/${locale} needs localized CTA text`);
    }
  }
});

test('interface counters explain they are not per-app traffic in both languages', () => {
  assert.match(useCases.networkCounters.en.limitation, /not (a |show )?per-app traffic/i);
  assert.match(useCases.networkCounters.fr.limitation, /pas (le )?trafic de chaque app|pas le trafic par application/i);
});

test('travel tracking describes manual eSIM setup, no carrier billing data, and a user-set quota', () => {
  assert.match(useCases.travelEsim.en.paragraphs.join(' '), /user-configured|configure.*quota|set.*allowance/i);
  assert.match(useCases.travelEsim.fr.paragraphs.join(' '), /quota configuré|configurez.*quota|enveloppe.*vous-même/i);
  assert.match(useCases.travelEsim.en.limitation, /does not (automatically )?detect.*eSIM|does not detect eSIM.*automatically/i);
  assert.match(useCases.travelEsim.en.limitation, /does not read carrier billing data/i);
  assert.match(useCases.travelEsim.fr.limitation, /ne détecte pas.*eSIM.*automatiquement/i);
  assert.match(useCases.travelEsim.fr.limitation, /ne lit pas.*données de facturation/i);
});
