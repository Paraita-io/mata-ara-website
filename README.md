# Mata Ara website

Static French and English product, support, privacy, contact, legal, and press-kit pages for Mata Ara. English is the default at `/`; `/en` remains available and `/fr` serves French. Astro generates the site at build time; no server adapter, analytics, or cookie tracking is configured.

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
| `BASE_PATH` | unset | Optional path prefix for project-site hosting, such as `/mata-ara-website`. Leave unset for a root deployment or custom domain. |
| `APP_STORE_URL` | `https://apps.apple.com/app/mata-ara/id1527207105` | App Store product destination. Confirm the product record for the major release before launch. |
| `RELEASE_CTA_ENABLED` | `false` | Set to `true` to enable the release/download call to action after the listing is ready. Accepted true values are `true`, `1`, `yes`, and `on`. |

Example:

```sh
SITE_URL=https://example.com \
BASE_PATH= \
APP_STORE_URL=https://apps.apple.com/app/mata-ara/id1527207105 \
RELEASE_CTA_ENABLED=true npm run build
```

Routes use explicit `/fr/` and `/en/` locale prefixes. Astro emits static directory `index.html` files and serves slash-terminated page URLs. The root home page is English and canonicalizes to `/en/`.

## GitHub Pages

The repository includes a GitHub Actions workflow that builds and publishes the site on each push to `main`, or when run manually from the Actions tab. The expected project-site URL is `https://paraita-io.github.io/mata-ara-website/`. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the publishing source. The workflow sets `SITE_URL=https://paraita-io.github.io` and `BASE_PATH=/mata-ara-website` so pages, internal links, and assets work below the repository path.

For local development, `npm run dev` uses the root path by default. To preview the project-site path locally, build with the same `SITE_URL` and `BASE_PATH` values and run `npm run preview`.

For a custom domain, configure its DNS records and GitHub Pages custom-domain setting, add a `public/CNAME` file containing that domain, set `SITE_URL` to its HTTPS origin, and use an empty `BASE_PATH`. Update the Pages workflow values too. A project site's `robots.txt` is emitted under its repository prefix; standard robots discovery is at the host root, which this project-site artifact cannot control.

The app's in-app privacy link points to `https://paraita-io.github.io/mata-ara-website/privacy/`. The custom domain `paraita.io` is not currently configured with working DNS records; do not use it for release URLs unless DNS and hosting are restored and verified.

## Release checks

Before publishing, confirm the production domain and `/privacy` compatibility URL, the App Store product record, current App Store privacy answers, ad/ATT release configuration, privacy wording, and publisher/legal details. App Store Connect support and privacy URLs should target the final localized pages.

### App Store Connect URL mapping

The current GitHub Pages deployment uses these public URLs:

| App Store Connect field | URL |
| --- | --- |
| Marketing URL | `https://paraita-io.github.io/mata-ara-website/en/` or `https://paraita-io.github.io/mata-ara-website/fr/` |
| Support URL | `https://paraita-io.github.io/mata-ara-website/en/support/` or `https://paraita-io.github.io/mata-ara-website/fr/assistance/` |
| Privacy Policy URL | `https://paraita-io.github.io/mata-ara-website/privacy/` (English compatibility route), `https://paraita-io.github.io/mata-ara-website/en/privacy/`, or `https://paraita-io.github.io/mata-ara-website/fr/confidentialite/` |
| Privacy Choices URL (optional) | `https://paraita-io.github.io/mata-ara-website/en/privacy/#ad-privacy-choices` |
| AdMob European consent message privacy URL | `https://paraita-io.github.io/mata-ara-website/en/privacy/` (the page links to French) |

The workflow sets `SITE_URL=https://paraita-io.github.io` and `BASE_PATH=/mata-ara-website`. It emits `sitemap.xml` with the canonical localized pages and adds its absolute URL to `robots.txt`. Without `SITE_URL`, the build omits the sitemap and uses a host-independent `robots.txt`; canonical, social-preview and `hreflang` absolute URLs are likewise omitted.

### Privacy and App Store release checklist

- Verify the configured AdMob application and ad-unit identifiers against the intended production account, and confirm which Google Mobile Ads features and data collection are active in the submitted build.
- Verify the ATT prompt text/timing and the ads behavior for both authorized and denied states. Confirm that the integrated UMP consent flow is configured for the release markets and that its privacy choices entry works when required.
- Reconcile the policy with the final SDK configuration and submit accurate App Store Connect App Privacy answers, including data collected by Google Mobile Ads and any Apple purchase processing disclosures.
- Confirm the intended audience and age rating, and review applicable child/minor privacy and advertising requirements for each release market; verify corresponding App Store and ad SDK settings.
- Confirm that the disclosed publisher identity, address, jurisdiction, and hosting disclosures are accurate and meet the publisher's applicable legal requirements.
- Confirm the Mata Ara mark and app-icon permissions for every intended press use; the press-kit downloads are supplied for review and editorial preparation and do not grant reproduction or commercial-use rights.
- Confirm the French and English privacy policy and contact URLs are live, publicly fetchable, and match the release build before App Review.
