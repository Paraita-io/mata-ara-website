# Mata Ara Free and Premium Comparison Design

## Goal

Make the difference between the free and Premium versions easy to find on the Mata Ara website, without claiming features are Premium-exclusive unless the app enforces that gate.

## Verified product facts

The current app code gates two Premium benefits:

1. Optional quota notifications at 50%, 75%, and 90% (the 100% notification remains available without Premium).
2. Removal of the banner ad shown on the main screen.

The quota tracker, network-interface counters, histories, Apple Watch companion, Home Screen widget, rate warning, quota-expiry reminder, and unusual-usage alerts are not Premium-gated in the current code. Do not present them as Premium-only.

The Premium entitlement uses a StoreKit non-consumable product. Describe it as a one-time in-app purchase and do not hard-code a price; the App Store supplies the price for the storefront.

## Approved UX

- Add a concise Free/Premium promotion on the home page after the use-case cards. State the two Premium differences and link to the full comparison on the Features page.
- Add a complete bilingual comparison section on the Features page, with a stable `id="premium"` anchor.
- Use a semantic comparison table with three columns: capability, Free, and Premium. Premium includes the Free features. Rows must clearly show shared core tracking, the 100% alert, smart alerts and Watch/widget support as shared; 50/75/90 threshold alerts as Premium-only; and the main-screen banner as shown in Free and removed in Premium.
- Add a short note that Premium is a one-time in-app purchase and the current price is shown by the App Store. Do not invent a fixed price or imply that all ads disappear throughout the app.
- Keep the copy in English and French. Use the existing page metadata and route helpers; keep the home-to-comparison link as an ordinary crawlable `<a href>`.
- Style the comparison for both desktop and mobile, preserving readable headings, table headers, contrast, and keyboard navigation. Avoid animation or additional JavaScript for the table.

## Scope

- Home page: the compact Premium callout.
- Features page: the full Free/Premium comparison.
- Shared CSS for responsive presentation.
- Build-output verification that both locales include the comparison anchor, accurate distinctions, and internal home links.

No new route, App Store Connect change, purchase-flow change, ad SDK change, or price claim is included.

## Verification

- Build the static site with the GitHub Pages `SITE_URL` and `BASE_PATH`.
- Inspect English and French rendered HTML for the table, shared vs Premium-only rows, one-time purchase note, and home link to the Features comparison anchor.
- Verify no existing copy describes network monitoring, Watch/widget, or smart alerts as Premium-exclusive.
