# Mata Ara Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Build a polished French/English static product website for Mata Ara with accurate release features, App Store support/privacy pages, contact and press kit.

**Architecture:** Use Astro in static output mode to emit all localized pages as complete HTML at build time. Keep translations and product facts explicit, share one semantic site shell, and use minimal vanilla JS only for mobile menu enhancement. Do not add analytics, a server, a contact form, or cookie tracking.

**Tech Stack:** Astro, TypeScript, CSS, static HTML.

---

## Source facts and guardrails

- App source: `/Users/paraita/src/paraita-io/mata-ara`, branch `feature/ios26-migration`.
- Current source supports cellular quotas with monthly or fixed-expiry periods; a fixed plan stores an expiry date and can alert before expiry. Users may recalibrate the quota.
- It tracks total use and upload/download speed by heuristically classified interface categories. `en*` defaults to Wi-Fi (Ethernet may not be separable); `bridge1*` maps to Personal Hotspot and other `bridge*` maps to Bridge. Explain this variability and that system counters may differ from carrier billing.
- It records hourly snapshots for 48 hours and daily snapshots for 93 days to anchor a 90-day visible chart window. It has quota, plan-expiry and anomaly notifications, a Watch companion, and a configurable Home Screen widget.
- StoreKit provides a full-feature purchase. Do not publish a price until confirmed from current App Store Connect metadata.
- Current source uses Google Mobile Ads and an ATT permission request. Its checked-in AdMob application/ad unit identifiers are Google's sample test IDs. Do not make production ad, tracking, or production privacy claims without confirming the release build/IDs and current Google SDK practices.
- Existing in-app privacy link is `https://paraita.io/privacy`; preserve this path. Current App Store listing is `https://apps.apple.com/app/mata-ara/id1527207105`; keep the destination configurable and verify against the release record.
- User confirmed public support/contact email: `paraita@paraita.io`.
- The app icon/logo source is `/Users/paraita/src/paraita-io/mata-ara/general assets/v2/1024.png`; copy it into this repo with attribution/usage context in the press kit. No screenshots are assumed to be cleared for public use.
- Do not publish invented hosting details, data-retention claims, company/legal identity, device compatibility requirements or production domain. Keep canonical domain configurable and label any unverified legal details for launch review.

## File map

- `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`: reproducible Astro static build and commands.
- `src/config/site.ts`: public contact, App Store URL, canonical site URL, route definitions, and release CTA setting from build environment.
- `src/content/pages.ts`: typed French/English page titles, descriptions, body copy, FAQ items, and press boilerplate.
- `src/layouts/SiteLayout.astro`: document metadata, language/hreflang links, shared responsive layout.
- `src/components/SiteHeader.astro`, `SiteFooter.astro`, `LanguageSwitch.astro`: accessible shared navigation and localized links.
- `src/components/FeatureCards.astro`, `PersonaPaths.astro`, `AppStoreLink.astro`: focused landing page sections.
- `src/pages/index.astro`: root French entry with visible language switch and links to locale routes.
- `src/pages/[locale]/[page].astro`: static generation of the 14 localized routes using explicit French/English slugs.
- `src/pages/privacy.astro`: compatibility path for the app's existing unlocalized in-app link.
- `scripts/generate-sitemap.mjs`: emit an absolute sitemap only when the deployment `SITE_URL` is supplied; keep local builds independent of a guessed domain.
- `src/styles/global.css`: brand tokens, typography, responsive layout, focus and reduced-motion rules.
- `public/assets/mata-ara-mark.png`, `public/assets/mata-ara-app-icon.png`: actual v2 mark and app icon from the app repository.
- `public/press-kit/`: downloadable artwork only where source and usage rights are clear.
- `README.md`: local run/build, deployment settings, launch verification inputs, and Apple App Store URL mapping.

## Chunk 1: Static site foundation and route model

### Task 1: Create the Astro static project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/config/site.ts`
- Create: `README.md`

- [ ] Initialize a minimal Astro project with a static `build` script and no analytics or adapter.
- [ ] Configure `site` from `SITE_URL` when supplied, use extensionless routes, and set explicit `fr`/`en` locales with the default locale prefixed.
- [ ] Add site constants: contact email, existing privacy URL path, configurable App Store product URL, and release CTA flag.
- [ ] Define color/type/spacing tokens, page width, responsive breakpoints, focus-visible states, and reduced-motion behavior in CSS.
- [ ] Document install, dev, build, site URL, App Store destination, and release CTA settings in README.

### Task 2: Add typed localized routes, layout, and navigation

**Files:**
- Create: `src/content/pages.ts`
- Create: `src/layouts/SiteLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/LanguageSwitch.astro`
- Create: `src/pages/[locale]/[page].astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/privacy.astro`

- [ ] Define the 7 page identities and their 14 exact locale/slug pairs; keep route names in French and English explicit.
- [ ] Use `getStaticPaths()` to produce full static HTML from the typed content map.
- [ ] Implement one shared layout with correct `lang`, title/description, canonical URL, `hreflang`, semantic landmarks, skip link, and social metadata.
- [ ] Add responsive accessible header/footer and a language switch that maps to the matching translated page when one exists.
- [ ] Make `/` a useful French entry with an explicit English link; ensure no redirect requires JavaScript.
- [ ] Serve the privacy policy at `/privacy` for the app's current in-app link, with clear FR/EN alternatives.

## Chunk 2: Product story and App Store support content

### Task 3: Build the home and features pages

**Files:**
- Modify: `src/content/pages.ts`
- Create: `src/components/PersonaPaths.astro`
- Create: `src/components/FeatureCards.astro`
- Create: `src/components/AppStoreLink.astro`
- Modify: `src/pages/[locale]/[page].astro`
- Modify: `src/styles/global.css`

- [ ] Write distinct French and English home-page content for everyday data tracking, network-interface monitoring, and travel eSIM users.
- [ ] For travel, describe setting a manual fixed quota and expiry date, monitoring cellular use, recalibrating, and the expiry alert. Say the app does not detect eSIM profiles and device totals can differ from carrier billing.
- [ ] For interface monitoring, describe heuristic/device-dependent classification, including Wi-Fi/Ethernet and hotspot/bridge ambiguity.
- [ ] Present cellular quota, remaining usage, upload/download speed, history, local alerts, anomaly warning, Apple Watch, configurable widgets, and full-version purchase only where verified in source.
- [ ] Use one configurable App Store link on home and press kit; support a release-state label without a dead CTA if no valid store URL is configured.
- [ ] Build responsive sections with visible hierarchy and ensure hero content remains understandable when imagery or JavaScript is unavailable.

### Task 4: Write the support page and FAQ

**Files:**
- Modify: `src/content/pages.ts`
- Modify: `src/pages/[locale]/[page].astro`

- [ ] Add a support page in each locale with `mailto:paraita@paraita.io` as a visible, working contact route.
- [ ] Answer quota setup, fixed trip expiry, notification permissions, measurement differences, classification variability, history availability, Watch/widget refresh, and purchase restoration using verified app behavior.
- [ ] Explain what to include in a support email (device/OS/app version and steps to reproduce) without requesting network logs or unnecessary personal information.

## Chunk 3: Privacy, legal, contact, and press kit

### Task 5: Publish the privacy policy and contact page

**Files:**
- Modify: `src/content/pages.ts`
- Modify: `src/pages/privacy.astro`
- Modify: `src/pages/[locale]/[page].astro`

- [ ] Describe on-device interface counters, quota/settings and local history; describe local sharing with the Watch/widget targets through the app group accurately.
- [ ] Describe StoreKit purchase verification by Apple and Google Mobile Ads/ATT at the level confirmed by current SDK documentation and the release configuration.
- [ ] Distinguish advertising/diagnostic data handled by third parties from the local network usage history; link directly to Google's applicable privacy documentation.
- [ ] State accurate retention behavior for local history (hourly snapshots up to 48 hours; daily snapshots up to 93 days, supporting a 90-day visible chart window, subject to app cleanup behavior). Explain local data removal/reset based on the actual available controls; don't promise server-side deletion if Mata Ara has no account/server.
- [ ] Cover policy updates, choices/consent, data subject contact and children using only claims supported by release configuration and applicable law.
- [ ] Add contact page in both locales with the developer email and a short note for support, privacy, press and business inquiries.
- [ ] Flag unresolved production AdMob identifiers/behavior, App Store privacy answers and legal identity as release checklist items in README rather than shipping false assurances.

### Task 6: Build legal and press-kit pages

**Files:**
- Modify: `src/content/pages.ts`
- Modify: `src/pages/[locale]/[page].astro`
- Create: `public/assets/mata-ara-mark.png`
- Create: `public/assets/mata-ara-app-icon.png`
- Create: `public/press-kit/`

- [ ] Add a legal page in French and English with verified publisher/contact facts and links to privacy/support; keep jurisdiction-specific disclosures out until the publisher details are confirmed.
- [ ] Copy the real v2 icon/mark assets from the app repository and keep filenames human-readable.
- [ ] Add press boilerplate, product facts/platforms, contact, App Store link, and downloadable artwork with clear brand-use terms.
- [ ] Do not fabricate screenshots, press quotes, reviews, awards or unapproved third-party trademarks.

## Chunk 4: Release metadata and handoff

### Task 7: Finish search metadata, accessibility, and release settings

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/layouts/SiteLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `README.md`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml` or a generated sitemap approach

- [ ] Ensure every localized page has unique title/description, canonical URL, and reciprocal `hreflang` links.
- [ ] Set indexable pages and the generated sitemap to include FR/EN routes plus privacy alias handling without duplicate canonical confusion; omit absolute canonical/sitemap URLs when `SITE_URL` is unset instead of emitting a fake domain.
- [ ] Verify all interactive controls are keyboard-operable, menu buttons have names/states, contrast/focus styles are visible, and content remains usable at narrow widths and zoom.
- [ ] Keep absolute canonical URLs configurable; document `SITE_URL` and that App Store Connect support/marketing/privacy URLs must point at the final deployment routes.
- [ ] Add a release checklist for product listing ID, production ads/ATT configuration, privacy disclosures, publisher/legal identity, hosting and domain, and in-app privacy URL.

### Task 8: Build and inspect the static output

**Files:**
- Inspect: `dist/`
- Inspect: `README.md`

- [ ] Run `npm run build` and resolve all build errors and warnings that indicate broken routes/assets.
- [ ] Confirm generated output includes all 14 locale pages, `/privacy`, and shared artwork; when `SITE_URL` is configured also confirm the absolute sitemap and its robots reference, and when it is absent confirm no invalid absolute URLs were emitted.
- [ ] Inspect generated HTML source for complete text without JavaScript, correct route/language/canonical metadata, working email and store links, and no placeholder text.
- [ ] Review every privacy, eSIM, interface, platform and legal claim against the current app source and verified release facts.
- [ ] Inspect desktop and narrow mobile rendering in a browser and correct any overflow, inaccessible controls, or broken downloads.
- [ ] Report any external launch input still requiring confirmation; do not mark an unverified privacy/legal statement ready for publication.

---

## Release inputs that must be verified before launch

- `SITE_URL` and production hosting/domain behavior (including the existing `/privacy` URL).
- Whether the current App Store record/ID is retained for the major version.
- Production AdMob app/unit IDs, ATT/consent behavior, and Google's current data collection behavior in the configured SDK.
- Final App Store privacy answers, in-app privacy URL, and the retention/deletion wording.
- Publisher's legal name, applicable jurisdiction disclosures, and legal/contact address requirements.
- Press asset permissions and any new App Store screenshots supplied by the product owner.
