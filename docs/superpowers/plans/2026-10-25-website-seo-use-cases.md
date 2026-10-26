# Website SEO and Use-Case Pages Implementation Plan

> **For agentic workers:** REQUIRED: Use `superpowers:subagent-driven-development` (if subagents are available) or `superpowers:executing-plans` to implement this plan. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Improve Mata Ara's brand presentation and search discovery with gentle motion, real brand icons, and six useful static use-case pages in English and French.

**Architecture:** Extend the existing typed page registry with three localized page pairs and render their content from a focused data module and Astro component. Reuse `SiteLayout`, `routeFor`, `BASE_URL`, canonical/hreflang generation, and the sitemap generator; use static semantic anchors and a visible breadcrumb whose JSON-LD comes from the same data.

**Tech Stack:** Astro 7, CSS, JavaScript/Node built-in test runner, GitHub Pages static build.

---

## File map

- `src/content/pages.ts`: route IDs, localized slugs, unique localized page titles and descriptions.
- `src/content/use-cases.mjs`: bilingual page copy and breadcrumb/related-link information, importable by both Astro and Node tests.
- `src/components/UseCasePage.astro`: page-specific heading, content, limits, related links, existing release-gated `AppStoreLink`, visible breadcrumb and `BreadcrumbList` JSON-LD.
- `src/pages/[locale]/[page].astro`: dispatch use-case IDs to the dedicated component while retaining existing page rendering.
- `src/components/PersonaPaths.astro`: link homepage cards directly to corresponding use-case routes.
- `src/components/FeatureCards.astro`: add directly related links from the matching feature sections to their dedicated use-case routes.
- `src/components/SiteHeader.astro`, `src/layouts/SiteLayout.astro`: use the existing mark in the header and expose favicon/touch-icon metadata; `public/assets/mata-ara-favicon-32.png` and `public/assets/mata-ara-apple-touch-icon-180.png` are sized variants derived from the existing app artwork.
- `src/styles/global.css`: animate existing hero orbits/network points and keep the existing reduced-motion rules effective.
- `test/use-cases.test.mjs`: verify all localized copy, route pairing, breadcrumb/related route references, and accurate scope claims.
- `test/branding.test.mjs`: verify the header mark, favicon declarations, and reduced-motion-aware animation contract.
- `scripts/generate-release-metadata.mjs`: change only if sitemap output reveals a gap; keep its behavior derived from canonical links.
- `scripts/check-use-case-output.mjs`: verify homepage/feature discovery links, icons, metadata and sitemap/robots output after the configured build.
- `README.md`: document post-deployment Search Console sitemap submission and the limits of indexing guarantees.

## Chunk 1: Add localized routes and substantive use-case content

### Task 1: Add failing tests for the route and content pairs

**Files:**
- Create: `test/use-cases.test.mjs`
- Create: `src/content/use-cases.mjs`
- Modify: `src/content/pages.ts`

- [x] Add tests importing the use-case content module and requiring three distinct topics in `en` and `fr`, localized page title/description, useful multi-paragraph copy, a visible limitation, related-link IDs, and CTA text.
- [x] Read `src/content/pages.ts` in the test and require the approved localized slug strings to be registered for each use-case page ID.
- [x] Require that content says network counters are not per-app traffic, that eSIM is not detected automatically and carrier billing data is not read, and that a user-configured quota is used for travel. Keep each claim in its relevant page.
- [x] Assert the approved locale route pairs: `/en/mobile-data-tracker/` ↔ `/fr/suivi-forfait-mobile/`, `/en/iphone-network-counters/` ↔ `/fr/compteurs-reseau-iphone/`, and `/en/travel-esim-data/` ↔ `/fr/suivi-esim-voyage/`.
- [x] Run `npm test` and confirm the new tests fail because use-case data and page entries are missing.
- [x] Add the minimal content module and typed page-registry entries required for the tests. The content must distinguish the three use cases, use natural English/French, and link to verified existing app functions only.
- [x] Run `npm test` and confirm the route/content tests pass.
- [x] Commit the route metadata and bilingual content tests/data.

### Task 2: Render static use-case pages with breadcrumbs and internal links

**Files:**
- Create: `src/components/UseCasePage.astro`
- Modify: `src/pages/[locale]/[page].astro`
- Modify: `src/content/use-cases.mjs`

- [x] Implement the dedicated page component with breadcrumbs (Home → use case), descriptive sections, app capabilities and limits, related use cases, and the existing `AppStoreLink` component so its release gate remains respected. Build all hrefs through `routeFor`/`publicPath`; create absolute JSON-LD URLs only when `SITE_URL` is configured.
- [x] Dispatch the three new page IDs through the existing localized dynamic route to `UseCasePage` and suppress the generic page intro for these IDs, so `UseCasePage` provides the page's only H1. Leave existing features, privacy, support, contact, legal and press rendering unchanged.
- [x] Run `npm test`; verify existing unit assertions pass. Defer rendered-H1, breadcrumb, links and JSON-LD checks to the configured static build in Task 5 because the project uses Node's built-in test runner without an Astro component-rendering harness.
- [x] Commit the page component and route dispatch.

## Chunk 2: Improve homepage UX and brand identity

### Task 3: Link homepage use-case cards to the new pages

**Files:**
- Modify: `src/components/PersonaPaths.astro`
- Modify: `test/use-cases.test.mjs`

- [x] Add an assertion that each homepage use-case card resolves directly to the matching localized use-case route (not a fragment on the general features page).
- [x] Run the test to confirm it fails with the current `#data`, `#interfaces`, and `#travel` targets.
- [x] Change card hrefs to `routeFor` the corresponding use-case page ID; preserve visible copy and semantic `<a href>` elements.
- [x] Run the focused tests and commit the homepage links.

### Task 4: Use the Mata Ara mark, add site icons, animate the hero art

**Files:**
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/layouts/SiteLayout.astro`
- Modify: `src/styles/global.css`
- Create: `test/branding.test.mjs`
- Create: `public/assets/mata-ara-favicon-32.png` and `public/assets/mata-ara-apple-touch-icon-180.png` as resized variants of the existing app icon.

- [x] Add failing source/render checks requiring the header to use the existing `public/assets/mata-ara-mark.png`, and the layout to declare the derived 32×32 browser favicon and 180×180 Apple touch icon.
- [x] Add failing CSS checks for a restrained orbit/dot animation and ensure the existing `prefers-reduced-motion: reduce` media query disables animation.
- [x] Replace the header's CSS `M` tile with a sized image using empty alt text and accessible existing brand link text. Add favicon and Apple touch icon URLs through Astro's `BASE_URL`-aware public path helper.
- [x] Animate the existing orbits and orbit dots slowly, using transforms/opacity only; leave the decorative hero `aria-hidden`. Retain the current reduced-motion override.
- [x] Run `npm test`, inspect responsive CSS values, and commit the icon/motion changes.

## Chunk 3: Validate crawling and localized SEO output

### Task 5: Verify metadata, alternates, internal discovery, and sitemap

**Files:**
- Modify: `src/content/pages.ts`
- Modify: `src/components/FeatureCards.astro`
- Modify: `test/use-cases.test.mjs`
- Modify: `scripts/check-use-case-output.mjs`
- Modify: `README.md`
- Modify: `src/layouts/SiteLayout.astro` only if a verified metadata gap remains.
- Modify: `scripts/generate-release-metadata.mjs` only if a verified sitemap or robots gap remains.
- Modify: `README.md` release/SEO notes if needed.
- Verify: generated routes and metadata.

- [x] Run `npm test` and `SITE_URL=https://paraita-io.github.io BASE_PATH=/mata-ara-website npm run build`; the configured build runs `scripts/check-use-case-output.mjs` after generating the static routes and release metadata.
- [x] Inspect all six generated use-case files for `<html lang>`, unique `<title>` and meta description, self canonical, correctly paired `hreflang`, exactly one H1, visible breadcrumbs, JSON-LD parity, ordinary crawlable anchor links, and the release-gated App Store CTA.
- [x] Inspect homepage output to confirm its links point directly to all use-case pages in each locale.
- [x] Add crawlable links from the three matching existing feature sections to their dedicated use-case pages, and verify them in the built HTML.
- [x] Verify `dist/sitemap.xml` includes each localized route with `/mata-ara-website/` and `dist/robots.txt` references the configured sitemap URL. Confirm no `/dist/` local paths or unprefixed route URLs leak into canonical/JSON-LD/icon URLs.
- [x] Verify generated HTML loads the brand mark and favicon/touch icons under the configured base prefix.
- [x] Document how to verify the public property in Google Search Console and submit `/mata-ara-website/sitemap.xml` after deployment; state that submission helps discovery but does not guarantee indexing.
- [x] Run `git diff --check` and review all changed files for unsupported app claims, repeated/near-duplicate copy, keyboard accessibility, and reduced-motion behavior.
- [x] Run the static build one final time after any fixes; report that indexing depends on search-engine crawling and Search Console submission, not on the code changes alone.

## Sources

- Approved design: `docs/superpowers/specs/2026-10-25-seo-use-cases-and-branding-design.md`.
- Google Search Central: crawlable links (`https://developers.google.com/search/docs/crawling-indexing/links-crawlable`), sitemaps (`https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview`), and structured data guidelines (`https://developers.google.com/search/docs/appearance/structured-data/sd-policies`).
