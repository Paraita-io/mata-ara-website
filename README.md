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
