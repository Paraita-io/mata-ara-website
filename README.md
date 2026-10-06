# Mata Ara website

Static French and English product, support, privacy, contact, legal, and press-kit pages for Mata Ara. Astro generates the site at build time; no server adapter, analytics, or cookie tracking is configured.

## Requirements

- Node.js 22.12 or newer
- npm

## Install and run

```sh
npm install
npm run dev
```

The development server prints its local address. To generate and preview the static site:

```sh
npm run build
npm run preview
```

The build output is written to `dist/`.

## Build settings

Set these environment variables in the deployment environment before running `npm run build`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `SITE_URL` | unset | Public origin used for absolute canonical and sitemap URLs. Supply the final HTTPS origin, without a path. Without it, builds do not assume a production domain. |
| `APP_STORE_URL` | `https://apps.apple.com/app/mata-ara/id1527207105` | App Store product destination. Confirm the product record for the major release before launch. |
| `RELEASE_CTA_ENABLED` | `false` | Set to `true` to enable the release/download call to action after the listing is ready. Accepted true values are `true`, `1`, `yes`, and `on`. |

Example:

```sh
SITE_URL=https://example.com \
APP_STORE_URL=https://apps.apple.com/app/mata-ara/id1527207105 \
RELEASE_CTA_ENABLED=true npm run build
```

Routes use explicit `/fr/` and `/en/` locale prefixes, including the default French locale. Astro emits static extensionless routes.

## Release checks

Before publishing, confirm the production domain and `/privacy` compatibility URL, the App Store product record, current App Store privacy answers, ad/ATT release configuration, privacy wording, and publisher/legal details. App Store Connect support and privacy URLs should target the final localized pages.

### Privacy and App Store release checklist

- Replace the Google sample AdMob application and ad-unit identifiers with the release identifiers, and verify which Google Mobile Ads features and data collection are active in the submitted build.
- Verify the ATT prompt text/timing and the ads behavior for both authorized and denied states. Confirm and implement any consent flow required for the release markets; the current app source includes the Google UMP package but no UMP consent flow was found in the app code.
- Reconcile the policy with the final SDK configuration and submit accurate App Store Connect App Privacy answers, including data collected by Google Mobile Ads and any Apple purchase processing disclosures.
- Confirm the legal publisher/controller name and any required publisher, jurisdiction, and hosting disclosures before publishing the legal pages and privacy policy.
- Confirm the French and English privacy policy and contact URLs are live, publicly fetchable, and match the release build before App Review.
