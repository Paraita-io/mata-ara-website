# Mata Ara Website SEO, Use Cases, and Brand Design

## Goal

Improve the Mata Ara website's visual identity and crawlable search content while keeping the site static, fast, and available in English and French.

## Approved scope

- Add a restrained CSS animation to the existing home hero orbits and network points. Keep the art decorative, avoid JavaScript animation, and disable motion under `prefers-reduced-motion`.
- Replace the text-only `M` tile in the site header with the existing Mata Ara mark asset. Add browser and Apple touch icon declarations using existing app-brand artwork.
- Add three dedicated use-case pages in both locales: mobile allowance tracking, iPhone network-interface counters, and travel eSIM allowance tracking.
- Ensure use-case copy is distinct and useful in each language. Describe the relevant workflow, the app's capabilities and limits, related use cases, and an App Store action. Avoid implying per-app traffic measurement, automatic carrier billing data, eSIM provisioning, or unverified network features.
- Link the use-case pages using ordinary HTML anchors from the home use-case cards and from relevant related-page content. Add a visible breadcrumb on each use-case page and matching `BreadcrumbList` structured data.
- Give every new route a unique localized title and description. Preserve static HTML rendering, canonical URLs, `hreflang` alternates, and sitemap inclusion through the existing route metadata and sitemap generator. Keep `robots.txt` and the existing GitHub Pages base-path behavior correct.
- Improve metadata and internal-link coverage only where it supports discovery, indexing, and accurate previews. Do not add keyword stuffing, analytics, a third-party animation dependency, or claims that crawling guarantees indexing or rank.

## Route design

Create paired routes with concise, descriptive slugs:

| Use case | English | French |
| --- | --- | --- |
| Mobile allowance tracking | `/en/mobile-data-tracker/` | `/fr/suivi-forfait-mobile/` |
| iPhone interface counters | `/en/iphone-network-counters/` | `/fr/compteurs-reseau-iphone/` |
| Travel eSIM tracking | `/en/travel-esim-data/` | `/fr/suivi-esim-voyage/` |

Each English and French page is a static route generated from the existing route metadata. Locale switch links must pair equivalent routes.

## Architecture

Extend the existing typed page registry in `src/content/pages.ts` with three use-case page IDs and localized route metadata. Add a focused Astro content component for use-case pages that selects the approved bilingual content and provides the visible breadcrumb, related links, and App Store link. Reuse the shared `SiteLayout` so titles, descriptions, canonical links, language alternates, Open Graph metadata, and document language stay consistent. Add JSON-LD from the same route metadata/content source to avoid mismatches with the visible breadcrumb.

Use the existing `public/assets/mata-ara-mark.png` for the header brand symbol and existing `public/assets/mata-ara-app-icon.png` for the browser/touch icon. Reuse the current hero orbit elements and CSS variables for motion and mark styling.

## Search and crawl considerations

Google Search Central documentation favors crawlable `<a href>` links and notes that sitemaps help discovery but do not guarantee indexing. The site already statically renders HTML and derives its sitemap from canonical links. Keep all new pages readable without JavaScript, link them prominently, pair their localized variants with `hreflang`, and keep the sitemap generated from canonical route URLs. Add only accurate, visible breadcrumb data; do not use app rich-result markup unless its required fields can be verified against the real App Store offer.

## Verification

- Unit-level route/content checks cover all six route pairs, localized titles/descriptions, internal links, and structured-data content.
- Run `npm test` and a GitHub Pages path-configured static build.
- Inspect generated HTML for icon links, animation CSS and reduced-motion fallback, English/French body text, breadcrumbs/JSON-LD, canonical/hreflang, and crawlable use-case links.
- Verify sitemap URLs include all six new pages with the project-site prefix and `robots.txt` points to that sitemap.
- Check both desktop and mobile layouts in the local preview when the browser surface is available; retain semantic headings, accessible links, and the existing skip-link behavior.
