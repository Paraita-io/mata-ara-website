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

### App Store Connect URL mapping

Use the final public HTTPS origin after hosting is configured:

| App Store Connect field | URL |
| --- | --- |
| Marketing URL | `https://<production-domain>/en` (or `/fr`) |
| Support URL | `https://<production-domain>/en/support` (or `/fr/assistance`) |
| Privacy Policy URL | `https://<production-domain>/privacy` (compatibility route used by the current app), or the localized `/fr/confidentialite` / `/en/privacy` page |

The bracketed production domain is a release input, not a literal URL. Set `SITE_URL` to that HTTPS origin when building for production. The build then emits `sitemap.xml` with only the 14 canonical localized pages and adds its absolute URL to `robots.txt`. Without `SITE_URL`, the build omits the sitemap and uses a host-independent `robots.txt`; it does not guess a production domain. Canonical and social-preview absolute URLs are likewise omitted until the origin is configured.

### Privacy and App Store release checklist

- Replace the Google sample AdMob application and ad-unit identifiers with the release identifiers, and verify which Google Mobile Ads features and data collection are active in the submitted build.
- Verify the ATT prompt text/timing and the ads behavior for both authorized and denied states. Confirm and implement any consent flow required for the release markets; the current app source includes the Google UMP package but no UMP consent flow was found in the app code.
- Reconcile the policy with the final SDK configuration and submit accurate App Store Connect App Privacy answers, including data collected by Google Mobile Ads and any Apple purchase processing disclosures.
- Confirm the intended audience and age rating, and review applicable child/minor privacy and advertising requirements for each release market; verify corresponding App Store and ad SDK settings.
- Confirm the legal publisher/controller name and any required publisher, jurisdiction, and hosting disclosures before publishing the legal pages and privacy policy.
- Replace the legal-information notice on both `/fr/mentions-legales` and `/en/legal` with the verified publisher identity and any disclosures required for the publisher's jurisdiction. Do not launch with the notice still stating that these details are pending.
- Confirm the Mata Ara mark and app-icon permissions for every intended press use; the press-kit downloads are supplied for review and editorial preparation and do not grant reproduction or commercial-use rights.
- Confirm the French and English privacy policy and contact URLs are live, publicly fetchable, and match the release build before App Review.
