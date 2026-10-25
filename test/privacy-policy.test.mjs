import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const policy = await readFile(new URL('../src/components/PrivacyPolicy.astro', import.meta.url), 'utf8');
const legal = await readFile(new URL('../src/components/LegalInfo.astro', import.meta.url), 'utf8');

function localeSection(source, locale) {
  const marker = locale === 'fr' ? '{fr ? (' : ') : (';
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `${locale} policy section exists`);
  const sectionStart = start + marker.length;
  const end = locale === 'fr' ? source.indexOf(') : (', sectionStart) : source.lastIndexOf(')}');
  assert.notEqual(end, -1, `${locale} policy section has an end`);
  return source.slice(sectionStart, end);
}

const languageRequirements = {
  en: [
    ['Google Mobile Ads', /Google Mobile Ads/],
    ['UMP consent flow', /UMP[\s\S]*(?:consent|privacy choices)/i],
    ['ATT denial still permits non-personalized ads', /deny[\s\S]*non-personalized ads/i],
    ['ATT denial does not send IDFA', /ATT[\s\S]*IDFA[\s\S]*not send/i],
    ['in-app privacy choices instructions', /id="ad-privacy-choices"[\s\S]*Settings[\s\S]*Privacy choices/],
    ['GitHub Pages IP logging', /GitHub Pages[\s\S]*IP address[\s\S]*security/i],
    ['Google data disclosure link', /developers\.google\.com\/admob\/ios\/privacy\/data-disclosure/],
    ['Google privacy policy link', /policies\.google\.com\/privacy/],
    ['GitHub privacy statement link', /docs\.github\.com\/en\/site-policy\/privacy-policies\/github-general-privacy-statement/],
    ['privacy contact email', /paraita@paraita\.io/],
  ],
  fr: [
    ['Google Mobile Ads', /Google Mobile Ads/],
    ['parcours de consentement UMP', /UMP[\s\S]*(?:consentement|choix de confidentialité)/i],
    ['le refus ATT autorise les annonces non personnalisées', /refus[\s\S]*annonces non personnalisées/i],
    ['le refus ATT ne transmet pas l’IDFA', /ATT[\s\S]*IDFA[\s\S]*(?:ne transmet|n’envoie)/i],
    ['instructions de choix de confidentialité dans l’app', /id="ad-privacy-choices"[\s\S]*Réglages[\s\S]*(?:Choix de confidentialité|choix de confidentialité)/],
    ['journalisation IP GitHub Pages', /GitHub Pages[\s\S]*adresse IP[\s\S]*sécurité/i],
    ['lien vers la déclaration de données Google', /developers\.google\.com\/admob\/ios\/privacy\/data-disclosure/],
    ['lien vers la politique Google', /policies\.google\.com\/privacy/],
    ['lien vers la déclaration de confidentialité GitHub', /docs\.github\.com\/en\/site-policy\/privacy-policies\/github-general-privacy-statement/],
    ['email de contact confidentialité', /paraita@paraita\.io/],
  ],
};

for (const [locale, requirements] of Object.entries(languageRequirements)) {
  test(`${locale} privacy policy explains AdMob, UMP, ATT, hosting and privacy choices`, () => {
    const section = localeSection(policy, locale);
    for (const [description, expression] of requirements) {
      assert.match(section, expression, `${locale}: missing ${description}`);
    }
  });
}

test('privacy policy no longer contains superseded AdMob test-ID or missing-UMP claims', () => {
  assert.doesNotMatch(policy, /AdMob identifiers?.{0,100}(?:test identifiers?|identifiants? de test)/i);
  assert.doesNotMatch(policy, /does not mean that a UMP consent flow is currently integrated/i);
  assert.doesNotMatch(policy, /ne signifie pas qu’un parcours de consentement UMP est actuellement intégré/i);
});

test('legal page publishes the verified Paraita.io identity and postal address in both locales', () => {
  const lower = legal.toLocaleLowerCase();
  for (const detail of [
    'Paraita.io',
    'BP 111844',
    '98709 Mahina',
    'Tahiti',
    'French Polynesia',
    'Polynésie française',
    'paraita@paraita.io',
  ]) {
    assert.ok(lower.includes(detail.toLocaleLowerCase()), `missing legal detail: ${detail}`);
  }
  assert.doesNotMatch(legal, /Before the official launch[\s\S]*must be confirmed/i);
  assert.doesNotMatch(legal, /Avant la mise en ligne officielle[\s\S]*doivent être confirmés/i);
});
