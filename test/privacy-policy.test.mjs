import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const policy = await readFile(new URL('../src/components/PrivacyPolicy.astro', import.meta.url), 'utf8');
const legal = await readFile(new URL('../src/components/LegalInfo.astro', import.meta.url), 'utf8');

function extractLocaleSection(source, locale) {
  const marker = locale === 'fr' ? '{fr ? (' : ') : (';
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `${locale} section exists`);
  const contentStart = start + marker.length;
  const end = locale === 'fr' ? source.indexOf(') : (', contentStart) : source.lastIndexOf(')}');
  assert.notEqual(end, -1, `${locale} section has an end`);
  return source.slice(contentStart, end);
}

function stripMarkup(markup) {
  return markup.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function paragraphs(source, locale) {
  const section = extractLocaleSection(source, locale);
  return [...section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(([, markup]) => ({
    html: markup,
    text: stripMarkup(markup),
  }));
}

function hasParagraph(entries, predicate) {
  return entries.some(predicate);
}

const policyRequirements = {
  en: [
    ['Google Mobile Ads is identified', ({ text }) => /Google Mobile Ads/.test(text)],
    ['UMP and consent are explained together', ({ text }) => /UMP/i.test(text) && /consent/i.test(text)],
    [
      'ATT denial and non-personalized ads are explained together',
      ({ text }) => /ATT/i.test(text) && /(?:decline|deny)/i.test(text) && /non-personalized ads/i.test(text),
    ],
    [
      'ATT denial and the lack of IDFA transmission are explained together',
      ({ text }) => /ATT/i.test(text) && /IDFA/i.test(text) && /(?:does not send|not send|not transmitted)/i.test(text),
    ],
    [
      'privacy choices and Settings directions are together',
      ({ text }) => /Privacy choices/i.test(text) && /Settings/i.test(text),
    ],
    [
      'GitHub Pages IP logging and its security purpose are together',
      ({ text }) => /GitHub Pages/i.test(text) && /IP address/i.test(text) && /security/i.test(text),
    ],
    [
      'the Google data-disclosure link appears in its disclosure paragraph',
      ({ text, html }) => /Google|AdMob/i.test(text) && /developers\.google\.com\/admob\/ios\/privacy\/data-disclosure/.test(html),
    ],
    [
      'the Google privacy-policy link appears in a Google disclosure paragraph',
      ({ text, html }) => /Google/i.test(text) && /policies\.google\.com\/privacy/.test(html),
    ],
    [
      'the GitHub privacy link appears in a GitHub hosting paragraph',
      ({ text, html }) => /GitHub/i.test(text) && /docs\.github\.com\/en\/site-policy\/privacy-policies\/github-general-privacy-statement/.test(html),
    ],
    ['the privacy contact email appears in a paragraph', ({ text }) => /paraita@paraita\.io/.test(text)],
  ],
  fr: [
    ['Google Mobile Ads est identifié', ({ text }) => /Google Mobile Ads/.test(text)],
    ['UMP et le consentement sont expliqués ensemble', ({ text }) => /UMP/i.test(text) && /consentement/i.test(text)],
    [
      'le refus ATT et les annonces non personnalisées sont expliqués ensemble',
      ({ text }) => /ATT/i.test(text) && /refus|refuser/i.test(text) && /annonces non personnalisées/i.test(text),
    ],
    [
      'le refus ATT et l’absence de transmission de l’IDFA sont expliqués ensemble',
      ({ text }) => /ATT/i.test(text) && /IDFA/i.test(text) && /(?:ne transmet|n’envoie|ne communique)/i.test(text),
    ],
    [
      'les choix de confidentialité et les réglages iOS sont expliqués ensemble',
      ({ text }) => /choix de confidentialité/i.test(text) && /Réglages/i.test(text),
    ],
    [
      'la journalisation IP de GitHub Pages et son but de sécurité sont expliqués ensemble',
      ({ text }) => /GitHub Pages/i.test(text) && /adresse IP/i.test(text) && /sécurité/i.test(text),
    ],
    [
      'le lien Google sur les données AdMob figure dans son paragraphe de divulgation',
      ({ text, html }) => /Google|AdMob/i.test(text) && /developers\.google\.com\/admob\/ios\/privacy\/data-disclosure/.test(html),
    ],
    [
      'le lien vers la politique Google figure dans un paragraphe Google',
      ({ text, html }) => /Google/i.test(text) && /policies\.google\.com\/privacy/.test(html),
    ],
    [
      'le lien vers la confidentialité GitHub figure dans un paragraphe GitHub',
      ({ text, html }) => /GitHub/i.test(text) && /docs\.github\.com\/en\/site-policy\/privacy-policies\/github-general-privacy-statement/.test(html),
    ],
    ['l’email de confidentialité figure dans un paragraphe', ({ text }) => /paraita@paraita\.io/.test(text)],
  ],
};

for (const [locale, requirements] of Object.entries(policyRequirements)) {
  test(`${locale} privacy disclosures stay together within relevant paragraphs`, () => {
    const localeParagraphs = paragraphs(policy, locale);
    for (const [description, predicate] of requirements) {
      assert.ok(hasParagraph(localeParagraphs, predicate), `${locale}: missing ${description} in one paragraph`);
    }

    assert.ok(extractLocaleSection(policy, locale).includes('id="ad-privacy-choices"'), `${locale}: missing privacy choices anchor`);
  });
}

test('neither language contains superseded AdMob test-ID or missing-UMP claims', () => {
  const obsoleteClaims = [
    /AdMob identifiers?.{0,100}test identifiers?/i,
    /does not mean that a UMP consent flow is currently integrated/i,
    /identifiants? AdMob.{0,120}identifiants? de test/i,
    /ne signifie pas qu’un parcours de consentement UMP est actuellement intégré/i,
  ];
  for (const locale of ['en', 'fr']) {
    const localeParagraphs = paragraphs(policy, locale);
    for (const claim of obsoleteClaims) {
      assert.ok(!localeParagraphs.some(({ text }) => claim.test(text)), `${locale}: stale policy claim remains: ${claim}`);
    }
  }
});

function localizedParagraphMarkup(source, locale) {
  const allParagraphs = [...source.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(([, markup]) => markup);
  return allParagraphs.map((markup) => {
    const localized = markup.match(/\{\s*fr\s*\?([\s\S]*?):([\s\S]*?)\}/);
    if (!localized) return stripMarkup(markup);
    return stripMarkup(locale === 'fr' ? localized[1] : localized[2]);
  });
}

const publisherAddressByLocale = {
  en: ['Paraita.io', 'BP 111844', '98709 Mahina', 'Tahiti', 'French Polynesia'],
  fr: ['Paraita.io', 'BP 111844', '98709 Mahina', 'Tahiti', 'Polynésie française'],
};

for (const [locale, requiredDetails] of Object.entries(publisherAddressByLocale)) {
  test(`${locale} legal page contains the complete verified publisher identity and address in one paragraph`, () => {
    const localeParagraphs = localizedParagraphMarkup(legal, locale);
    assert.ok(
      localeParagraphs.some((text) => requiredDetails.every((detail) => text.toLocaleLowerCase().includes(detail.toLocaleLowerCase()))),
      `${locale}: publisher identity and full postal address must appear together in a localized paragraph`,
    );
    assert.ok(legal.includes('paraita@paraita.io'), `${locale}: legal contact email is missing`);
  });
}

test('neither localized legal page has pending identity or disclosure placeholders', () => {
  for (const [locale, placeholder] of [
    ['en', /Before the official launch[\s\S]*must be confirmed/i],
    ['fr', /Avant la mise en ligne officielle[\s\S]*doivent être confirmés/i],
  ]) {
    const localeParagraphs = localizedParagraphMarkup(legal, locale);
    assert.ok(!localeParagraphs.some((text) => placeholder.test(text)), `${locale}: a pending legal placeholder remains`);
  }
});
