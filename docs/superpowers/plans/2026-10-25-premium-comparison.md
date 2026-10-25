# Free and Premium Comparison Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` if delegation is available. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the current free and Premium differences visible on the home and Features pages in English and French.

**Architecture:** Keep one bilingual comparison definition inside the Features page component. Render a semantic three-column table with Premium including the Free tier, give it the `#premium` anchor, and add a compact home callout linking to it with `routeFor`.

**Tech Stack:** Astro 7, HTML, CSS, static GitHub Pages build.

---

## File map

- `src/components/FeatureCards.astro`: add the bilingual free/Premium comparison table and one-time purchase note after the feature/tools content.
- `src/components/HomePageContent.astro`: add the compact bilingual Premium callout after the home use-case cards and link it to `routeFor('features', locale) + '#premium'`.
- `src/styles/global.css`: add readable responsive table/callout styles consistent with existing site tokens.
- `docs/superpowers/specs/2026-10-25-free-premium-comparison-design.md`: authoritative tier facts; do not widen the copy beyond verified app gates.

## Task 1: Add the bilingual comparison to Features

**Files:**
- Modify: `src/components/FeatureCards.astro`
- Modify: `src/styles/global.css`

- [ ] Add an English/French comparison section with stable `id="premium"` and three semantic columns: feature, Free, Premium.
- [ ] Show shared features as included in both tiers: configured quota and live interface counters; general History tab; Apple Watch and Home Screen widget; 100% quota notification; rate warning, expiry reminder and unusual-usage alerts.
- [ ] Show Premium-only features accurately: detailed per-interface upload/download speed-history sheet opened from a monitoring card; optional 50%, 75% and 90% threshold notifications; removal of the main-screen banner ad. Avoid saying all ads disappear throughout the app.
- [ ] State that Premium is a one-time in-app purchase and that the current price is shown by the App Store; do not hard-code a price.
- [ ] Style the table to remain readable on mobile and desktop. Retain table semantics, headers, visible focus states and adequate contrast.

## Task 2: Promote Premium from the home page

**Files:**
- Modify: `src/components/HomePageContent.astro`
- Modify: `src/styles/global.css`

- [ ] Add a concise bilingual Premium callout after the use-case cards and before the existing lower home detail section.
- [ ] Mention the three Premium benefits: threshold alerts, detailed per-interface speed history, and removal of the main-screen banner.
- [ ] Add a descriptive ordinary `<a href>` to the Features page's `#premium` section using `routeFor`; preserve the current locale and GitHub Pages base prefix.

## Task 3: Build and inspect the rendered pages

- [ ] Run `SITE_URL=https://paraita-io.github.io BASE_PATH=/mata-ara-website npm run build`.
- [ ] Inspect generated `/en/features/`, `/fr/fonctionnalites/`, `/en/`, and `/fr/` HTML for matching comparison claims, the stable anchor, and prefixed home-to-comparison links.
- [ ] Open the local Safari preview and confirm the table and callout remain legible at desktop and narrow/mobile widths.
- [ ] Run `git diff --check` and review the copy against the approved design before committing.

## Sources

- Approved tier facts: `docs/superpowers/specs/2026-10-25-free-premium-comparison-design.md`.
- Current app gates: `Mata Ara/Presentation/Views/OptionsViewNew.swift`, `Mata Ara/Presentation/Views/MainViewMultiInterface.swift`, `Mata Ara/Domain/Services/AdConsentManager.swift`, and `Mata Ara/iap/PurchasableContent.storekit`.
