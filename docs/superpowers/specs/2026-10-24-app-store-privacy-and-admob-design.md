# App Store Privacy and AdMob Site Pages

## Goal

Prepare Mata Ara's public website privacy and legal destinations for the current App Store and Google AdMob/UMP configuration, in English by default with French localizations.

## Existing state

- The site already has English and French privacy, support, contact, and legal routes. There are no additional branches containing newer policy content.
- The current privacy policy incorrectly says AdMob identifiers are Google test identifiers and that UMP is not integrated. The app now uses its configured AdMob identifiers, Google Mobile Ads SDK 13.11.0, UMP 3.1.0, ATT, UMP consent collection, a privacy choices entry point when UMP requires it, and non-personalized treatment after ATT denial. Do not assert live account status from source identifiers alone.
- The website is deployed at `https://paraita-io.github.io/mata-ara-website/`; this URL returns HTTP 200. Public DNS resolvers return no address for `paraita.io`, while the app still links to `https://paraita.io/privacy`.
- The legal page has a launch-blocking placeholder. The publisher has now confirmed the public identity and postal contact as Paraita.io, BP 111844, 98709 Mahina, Tahiti, French Polynesia.

## Requirements and design

- Update the existing English and French privacy-policy content instead of creating duplicate policy pages. Keep English as the default language and make the `/privacy` compatibility route display English with a clear French alternative. Preserve the explicit `/en/privacy/` and `/fr/confidentialite/` routes.
- Explain the app's local network counters, settings/history retention, Apple Watch/widget transfer, StoreKit purchases, advertising, third-party SDK handling, user choices, and contact route. Keep claims bounded to the actual app and vendor documentation.
- Disclose that Google Mobile Ads may process IP address, diagnostics/crash information, performance data, device identifiers, advertising data, and ad interactions; link to Google's current iOS data-disclosure and privacy pages rather than promising Google's retention or processing details.
- Explain that UMP collects and updates region-dependent ad consent, that UMP's `canRequestAds` gates ad requests, and that in-app Privacy choices opens the UMP form when required.
- Explain accurately that ATT denial does not itself remove all ads: the app may request ads when UMP allows them, passes non-personalized publisher privacy treatment, and Google Mobile Ads does not send IDFA when ATT is denied. ATT authorization alone does not override UMP choices.
- Disclose that the static site is hosted by GitHub Pages and that GitHub logs visitor IP addresses for security, with a link to GitHub's privacy statement.
- Replace the placeholder on both legal-information pages with the verified publisher name, mailing address, and email. Do not invent company form, registration identifiers, governing law, or a custom EULA.
- Keep the existing bilingual support and contact routes. No extra Terms page is needed solely for Apple Store and AdMob privacy links. Provide URLs suitable for App Store Connect and AdMob, and point the app's in-app privacy link to the live GitHub Pages compatibility URL until the custom domain's DNS works.

## Out of scope

- Editing AdMob account messages, App Store Connect records, or DNS.
- Claiming that these pages guarantee legal compliance in every jurisdiction or App Review approval.
- Replacing the user's verified publisher details with inferred entity or jurisdiction claims.

## Verification

- Build the Astro site and inspect its generated English-default, explicit English, French, support, legal, and privacy compatibility pages.
- Verify key bilingual claims, publisher contact details, localized alternate links, and the app's in-app privacy destination.
- Run the iOS build and tests because the in-app URL constant changes in the Mata Ara project.
