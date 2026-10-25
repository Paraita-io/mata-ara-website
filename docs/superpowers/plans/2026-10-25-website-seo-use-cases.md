# Website SEO and Use-Case Pages Implementation Plan

> **For agentic workers:** REQUIRED: Use `superpowers:subagent-driven-development` (if subagents are available) or `superpowers:executing-plans` to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

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
- `src/components/SiteHeader.astro`, `src/layouts/SiteLayout.astro`: use the existing mark in the header and expose favicon/touch-icon metadata.
- `src/styles/global.css`: animate existing hero orbits/network points and keep the existing reduced-motion rules effective.
- `test/use-cases.test.mjs`: verify all localized copy, route pairing, breadcrumb/related route references, and accurate scope claims.
- `test/branding.test.mjs`: verify the header mark, favicon declarations, and reduced-motion-aware animation contract.
- `scripts/generate-release-metadata.mjs`: change only if sitemap output reveals a gap; keep its behavior derived from canonical links.

## Chunk 1: Add localized routes and substantive use-case content

### Task 1: Add failing tests for the route and content pairs

**Files:**
- Create: `test/use-cases.test.mjs`
- Create: `src/content/use-cases.mjs`
- Modify: `src/content/pages.ts`

- [ ] Add tests importing the use-case content module and requiring three distinct topics in `en` and `fr`, localized page title/description, useful multi-paragraph copy, a visible limitation, related-link IDs, and CTA text.
- [ ] Read `src/content/pages.ts` in the test and require the approved localized slug strings to be registered for each use-case page ID.
- [ ] Require that content says network counters are not per-app traffic, that eSIM is not detected automatically and carrier billing data is not read, and that a user-configured quota is used for travel. Keep each claim in its relevant page.
- [ ] Assert the approved locale route pairs: `/en/mobile-data-tracker/` ↔ `/fr/suivi-forfait-mobile/`, `/en/iphone-network-counters/` ↔ `/fr/compteurs-reseau-iphone/`, and `/en/travel-esim-data/` ↔ `/fr/suivi-esim-voyage/`.
- [ ] Run `npm test` and confirm the new tests fail because use-case data and page entries are missing.
- [ ] Add the minimal content module and typed page-registry entries required for the tests. The content must distinguish the three use cases, use natural English/French, and link to verified existing app functions only.
- [ ] Run `npm test` and confirm the route/content tests pass.
- [ ] Commit the route metadata and bilingual content tests/data.

### Task 2: Render static use-case pages with breadcrumbs and internal links

**Files:**
- Create: `src/components/UseCasePage.astro`
- Modify: `src/pages/[locale]/[page].astro`
- Modify: `src/content/use-cases.mjs`

- [ ] Implement the dedicated page component with breadcrumbs (Home → use case), descriptive sections, app capabilities and limits, related use cases, and the existing `AppStoreLink` component so its release gate remains respected. Build all hrefs through `routeFor`/`publicPath`; create absolute JSON-LD URLs only when `SITE_URL` is configured.
- [ ] Dispatch the three new page IDs through the existing localized dynamic route to `UseCasePage` and suppress the generic page intro for these IDs, so `UseCasePage` provides the page's only H1. Leave existing features, privacy, support, contact, legal and press rendering unchanged.
- [ ] Run `npm test`; verify existing unit assertions pass. Defer rendered-H1, breadcrumb, links and JSON-LD checks to the configured static build in Task 5 because the project uses Node's built-in test runner without an Astro component-rendering harness.
- [ ] Commit the page component and route dispatch.

## Chunk 2: Improve homepage UX and brand identity

### Task 3: Link homepage use-case cards to the new pages

**Files:**
- Modify: `src/components/PersonaPaths.astro`
- Modify: `test/use-cases.test.mjs`

- [ ] Add an assertion that each homepage use-case card resolves directly to the matching localized use-case route (not a fragment on the general features page).
- [ ] Run the test to confirm it fails with the current `#data`, `#interfaces`, and `#travel` targets.
- [ ] Change card hrefs to `routeFor` the corresponding use-case page ID; preserve visible copy and semantic `<a href>` elements.
- [ ] Run the focused tests and commit the homepage links.

### Task 4: Use the Mata Ara mark, add site icons, animate the hero art

**Files:**
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/layouts/SiteLayout.astro`
- Modify: `src/styles/global.css`
- Create: `test/branding.test.mjs`

- [ ] Add failing source/render checks requiring the header to use the existing `public/assets/mata-ara-mark.png`, and the layout to declare the existing `mata-ara-app-icon.png` for browser and Apple touch icons.
- [ ] Add failing CSS checks for a restrained orbit/dot animation and ensure the existing `prefers-reduced-motion: reduce` media query disables animation.
- [ ] Replace the header's CSS `M` tile with a sized image using empty alt text and accessible existing brand link text. Add favicon and Apple touch icon URLs through Astro's `BASE_URL`-aware public path helper.
- [ ] Animate the existing orbits and orbit dots slowly, using transforms/opacity only; leave the decorative hero `aria-hidden`. Retain the current reduced-motion override.
- [ ] Run `npm test`, inspect responsive CSS values, and commit the icon/motion changes.

## Chunk 3: Validate crawling and localized SEO output

### Task 5: Verify metadata, alternates, internal discovery, and sitemap

**Files:**
- Modify: `src/content/pages.ts`
- Modify: `src/layouts/SiteLayout.astro` only if a verified metadata gap remains.
- Modify: `scripts/generate-release-metadata.mjs` only if a verified sitemap or robots gap remains.
- Modify: `README.md` release/SEO notes if needed.
- Verify: generated routes and metadata.

- [ ] Run `npm test` and `SITE_URL=https://paraita-io.github.io BASE_PATH=/mata-ara-website npm run build`.
- [ ] Inspect all six generated use-case files for `<html lang>`, unique `<title>` and meta description, self canonical, correctly paired `hreflang`, exactly one H1, visible breadcrumbs, JSON-LD parity, ordinary crawlable anchor links, and the release-gated App Store CTA.
- [ ] Inspect homepage output to confirm its links point directly to all use-case pages in each locale.
- [ ] Verify `dist/sitemap.xml` includes each localized route with `/mata-ara-website/` and `dist/robots.txt` references the configured sitemap URL. Confirm no `/dist/` local paths or unprefixed route URLs leak into canonical/JSON-LD/icon URLs.
- [ ] Run `git diff --check` and review all changed files for unsupported app claims, repeated/near-duplicate copy, keyboard accessibility, and reduced-motion behavior.
- [ ] Run the static build one final time after any fixes; report that indexing depends on search-engine crawling and Search Console submission, not on the code changes alone.

## Sources

- Approved design: `docs/superpowers/specs/2026-10-25-seo-use-cases-and-branding-design.md`.
- Google Search Central: crawlable links (`https://developers.google.com/search/docs/crawling-indexing/links-crawlable`), sitemaps (`https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview`), and structured data guidelines (`https://developers.google.com/search/docs/appearance/structured-data/sd-policies`).
