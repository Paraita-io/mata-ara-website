# Mata Ara website design

## Goal

Create a public, bilingual website for the next major Mata Ara release. It must explain the features present on the current `feature/ios26-migration` branch, serve as a credible App Store support and privacy destination, and give potential users clear entry points based on how they use the app.

## Audiences and content paths

The home page opens with the core promise of understanding network data usage and offers three paths:

1. **Everyday data tracking:** configure a cellular data limit, see usage and remaining quota, review recent/history charts, and receive local quota notifications.
2. **Device interface monitoring:** follow supported visible interfaces (cellular, Wi-Fi, Bluetooth, VPN, personal hotspot, Ethernet, and bridge), inspect upload/download activity and history, and configure their labels/order. Explain platform/device limits accurately.
3. **Travel with an eSIM:** set a manual quota that matches the travel plan, monitor cellular usage during the trip, and recalibrate when needed. Do not imply that Mata Ara detects eSIM plans, distinguishes SIM profiles, or reads the carrier's billing meter. Include a concise note that device measurements can differ from carrier billing.

The general feature page expands on the app, Apple Watch companion, configurable Home Screen widget, historical periods, quota configuration, notifications, and premium unlock. Do not promise functionality absent from the branch or imply guaranteed network measurement accuracy.

## Site map and routes

Every route has a French and English variant, a language switcher that preserves the current page where possible, localized page metadata, and a shared responsive header/footer.

- `/fr/` and `/en/`: product landing page, three audience paths, release feature overview, App Store call to action.
- `/fr/fonctionnalites/` and `/en/features/`: feature details grounded in the current source.
- `/fr/confidentialite/` and `/en/privacy/`: plain-language privacy policy covering on-device network counters/settings/history; Watch/widget sharing through the Apple App Group; StoreKit purchase handling; Google Mobile Ads and third-party disclosures, choices, retention/deletion, children, policy updates, and a privacy contact. Verify every claim against the SDK setup and current privacy practices before launch. Where implementation alone cannot establish a third-party SDK's collection or retention, point to Google's current documentation and avoid unsupported promises. Do not publish an invented retention period.
- `/fr/assistance/` and `/en/support/`: FAQ and troubleshooting for permissions, quota setup, measurement limits, widget/Watch sync, history, and purchases, with direct email support.
- `/fr/contact/` and `/en/contact/`: contact details including `paraita@paraita.io`, with `mailto:` link.
- `/fr/press-kit/` and `/en/press-kit/`: product summary, approved app icon/logo artwork, description boilerplate, supported platform/feature facts, and downloadable assets with clear usage terms. Use actual assets from the app repository; do not fabricate screenshots or press claims.
- `/fr/mentions-legales/` and `/en/legal/`: publisher identity, contact, hosting disclosure if known, intellectual-property notes, and applicable legal links. Include only verified details; do not guess hosting provider or legal entity particulars.

The App Store listing's support URL will point to the support page and privacy URL to the privacy page. The home page can serve as the marketing URL. Links should be stable and work without client-side JavaScript.

## Design and implementation direction

Build a static site with server-generated/static HTML so App Review can fetch privacy/support content directly and search engines can index localized pages. Use semantic HTML, accessible responsive styling, a restrained visual system derived from Mata Ara's real app artwork/colors, and light JavaScript only for navigation enhancements. Keep page content in explicit French and English sources rather than machine-translating at runtime. Shared page templates should prevent navigation and legal links from drifting across routes.

No account, backend, analytics, cookie banner, or contact form is needed. Contact is an email link. Avoid adding tracking to a site whose privacy position is that app network measurements stay on device.

## Privacy and App Review accuracy

Apple requires a user-support link with current contact information and a privacy-policy link. Its review guidance says the policy should identify collected data and uses, address third-party sharing, and describe retention/deletion and consent revocation. The existing policy found via the App Store is dated 2020 and contains unverified statements, so it is a source of historical contact/service details only, not text to copy. The new policy must be checked against the current release build, SDK behavior and App Store privacy answers before release. The site supports review readiness but cannot guarantee approval.

## Validation

After implementation, verify all 14 localized routes resolve, all links work, language alternates are present, metadata/canonical URLs are correct for deployment, pages render without JavaScript, keyboard/mobile layouts remain usable, and downloads resolve. Review all product and privacy claims against the Swift source and validate the public email and legal identity with existing app metadata. The repository's eventual deployment domain is not yet confirmed, so canonical metadata and absolute links must remain deployment-configurable until supplied.
