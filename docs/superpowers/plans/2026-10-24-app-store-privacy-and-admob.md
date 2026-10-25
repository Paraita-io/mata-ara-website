# App Store Privacy and AdMob Pages Implementation Plan

> **For agentic workers:** REQUIRED: Use `superpowers:subagent-driven-development` to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Mata Ara's bilingual public privacy/legal pages and in-app privacy link accurate and reachable for App Store and AdMob UMP setup, with English as the default language.

**Architecture:** Keep the existing Astro privacy, legal, and compatibility routes and update their explicit EN/FR content; do not create duplicate legal URLs. Use the currently reachable GitHub Pages project-site URL for the compatibility route and app link until the custom domain has DNS records. Add small Node tests for policy-critical copy and verify rendered output after the static build.

**Tech Stack:** Astro 7, Node.js built-in test runner, SwiftUI/Xcode.

---

## Files and responsibilities

- `test/privacy-policy.test.mjs` (create): assert current bilingual policy statements, choices instructions, no stale AdMob test-ID/UMP claims, and publisher details.
- `package.json` (modify): add the `node --test` script.
- `src/components/PrivacyPolicy.astro` (modify): update the existing bilingual policy with accurate AdMob/UMP, ATT, GitHub Pages hosting, choices, and vendor disclosures.
- `src/pages/privacy.astro` (modify): make the compatibility `/privacy` route English by default and link the French alternative.
- `src/components/LegalInfo.astro` (modify): replace the launch placeholder with verified publisher identity, postal address, and contact.
- `README.md` (modify): replace the stale `paraita.io` assumption with current GitHub Pages App Store Connect and AdMob URLs, including localized alternatives and the optional privacy-choices URL.
- `/Users/paraita/src/mata-ara/Mata Ara/Presentation/Views/OptionsViewNew.swift` (modify): point the in-app policy link to the live English-default compatibility route.

## Chunk 1: Update bilingual public policy pages

### Task 1: Add regression tests for privacy and legal copy

**Files:**
- Create: `test/privacy-policy.test.mjs`
- Modify: `package.json`

- [ ] Add tests for both language branches requiring disclosure of AdMob/UMP, ATT-denial non-personalized ads, the in-app privacy-choices path, GitHub Pages IP logging, Google/GitHub privacy links, and the verified Paraita.io contact details.
- [ ] Assert the superseded claims about Google test IDs and missing UMP flow are absent.
- [ ] Add an `npm test` script using Node's built-in test runner.
- [ ] Run `npm test` and confirm failures are only due to missing or stale policy content.

### Task 2: Update privacy and publisher information

**Files:**
- Modify: `src/components/PrivacyPolicy.astro`
- Modify: `src/pages/privacy.astro`
- Modify: `src/components/LegalInfo.astro`

- [ ] Update the privacy policy's last-updated date and advertising sections in English and French. State only verified SDK behaviors: Google Mobile Ads can process IP address, diagnostics/crash data, performance data, device IDs, ad data, and ad interactions; UMP obtains region-dependent consent; UMP `canRequestAds` gates ad requests; ATT denial still allows ads when UMP permits, with personalization disabled and no IDFA in the request; UMP choices remain available from Settings when required.
- [ ] Link to Google's iOS AdMob data disclosure and privacy policy. Avoid promises about Google's retention, processing location, or legal role beyond Google's own documentation.
- [ ] Update the website-hosting disclosure to identify GitHub Pages and explain that GitHub logs visitor IP addresses for security; link to GitHub's privacy statement.
- [ ] Add a shared stable `ad-privacy-choices` anchor in both languages with instructions for in-app settings and iOS ATT settings.
- [ ] Change the `/privacy` compatibility route to English as the default and link directly to the French policy.
- [ ] Replace the legal-page placeholder in both locales with `Paraita.io`, `BP 111844, 98709 Mahina, Tahiti, French Polynesia`, `Paraita.io, BP 111844, 98709 Mahina, Tahiti, Polynésie française`, and `paraita@paraita.io`. Do not invent registration, company-form, tax, or governing-law data.
- [ ] Run `npm test` and verify the new tests pass.

## Chunk 2: Point release destinations to the live site

### Task 3: Update release URL documentation and in-app policy link

**Files:**
- Modify: `README.md`
- Modify: `/Users/paraita/src/mata-ara/Mata Ara/Presentation/Views/OptionsViewNew.swift`

- [ ] Set the default English privacy/support/marketing destinations to `https://paraita-io.github.io/mata-ara-website/privacy/`, `/en/support/`, and the English site root under `/mata-ara-website/`; document French localized policy and support routes.
- [ ] Set the optional App Store Connect privacy-choices URL to the English policy's `#ad-privacy-choices` anchor.
- [ ] Set the AdMob European message privacy URL to the English policy route; explain that the site also links to French.
- [ ] Replace the app's broken `https://paraita.io/privacy` link with the reachable GitHub Pages compatibility route.
- [ ] Update release checklist wording to reflect the current production AdMob IDs and integrated UMP, while keeping final App Store privacy-answer verification as a release task.
- [ ] Run the full iOS simulator test suite in the existing `feature/ios26-migration` workspace as required by that app's `AGENTS.md`.

## Chunk 3: Build and validate public routes

### Task 4: Verify static output and release-facing content

**Files:**
- Verify generated `dist/privacy/index.html`
- Verify generated `dist/en/privacy/index.html`
- Verify generated `dist/fr/confidentialite/index.html`
- Verify generated legal, support, and contact locale routes

- [ ] Run `npm test` and `npm run build`.
- [ ] Inspect generated HTML in both English and French to confirm local network counters, Watch/widget sharing, StoreKit purchases, hourly/daily history-retention periods, AdMob/UMP/ATT behavior, GitHub Pages IP logging, correct publisher identity, functional email links, Google/GitHub privacy links, and the policy-choices anchor.
- [ ] Confirm the compatibility `/privacy` route defaults to English, links to French, has the right `lang` value, and contains no stale AdMob test-ID/UMP claims or legal placeholders.
- [ ] Confirm that all App Store Connect/AdMob URLs documented in README match `SITE_URL=https://paraita-io.github.io` and `BASE_PATH=/mata-ara-website`.
- [ ] Run `git diff --check` in both repositories and review the final diff for unrelated edits.
