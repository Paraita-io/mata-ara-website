# English Default and GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents are available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make English the default Mata Ara site language and deploy the static Astro site to the repository's GitHub Pages URL from GitHub Actions.

**Architecture:** Keep explicit `/en/` and `/fr/` routes and render English at `/` as an alias canonicalized to `/en/`. Read an optional Astro base path from `BASE_PATH` and centralize its use in route and public-asset helpers. The Pages workflow sets `BASE_PATH=/mata-ara-website` and `SITE_URL=https://paraita-io.github.io`; local builds default to the domain root.

**Tech Stack:** Astro 7 static output, TypeScript, GitHub Actions, GitHub Pages.

---

## Source and release facts

- Repository: `Paraita-io/mata-ara-website`, branch `main`.
- Astro's default locale is English; locale content pages have explicit `/fr/` and `/en/` prefixes.
- Astro emits directory `index.html` files for page routes; use slash-terminated page URLs so Pages can serve those directory indexes directly.
- In-app privacy link remains `https://paraita.io/privacy` in the separate app repository. This website can serve `/privacy/` under its configured base, but changing the app URL or configuring `paraita.io` as a GitHub Pages custom domain is outside this task. Document this release input.
- GitHub Pages project URL is `https://paraita-io.github.io/mata-ara-website/` based on repository owner/name.
- Use the current official Astro/GitHub workflow versions from the official docs referenced in the design spec. Do not push changes or trigger a deployment during implementation.

## File map

- `astro.config.mjs`: default locale, configured site origin, and optional normalized base path.
- `src/content/pages.ts`: base-aware public route helper used by links, canonicals, and social metadata.
- `src/pages/index.astro`: English default page at the deployment root.
- `src/pages/[locale]/index.astro`: shared localized home page for explicit `/en` and `/fr` routes.
- `src/components/HomePageContent.astro`: shared localized home content to avoid drift between `/` and `/en`.
- `src/components/PressKit.astro`: prefix public previews and download links with the configured base.
- `src/layouts/SiteLayout.astro`: base-aware canonical, hreflang, social image and locale metadata; x-default points to English.
- `scripts/generate-release-metadata.mjs`: keep sitemap locations and the robots sitemap directive consistent with base-aware canonical URLs.
- `.github/workflows/deploy.yml`: build and deploy on `main` pushes and manual workflow dispatch, with least-privilege Pages permissions.
- `README.md`: explain default language, Pages URL, one-time Pages setting, custom-domain setup, and app privacy URL follow-up.

## Chunk 1: English default and canonical home

### Task 1: Make English the default home without duplicating authored content

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/[locale]/index.astro`
- Create: `src/components/HomePageContent.astro`
- Modify: `src/layouts/SiteLayout.astro`

- [ ] Set Astro's `defaultLocale` to `en` while keeping default-locale prefixes enabled.
- [ ] Extract the localized home content into a shared component used by both the root page and explicit locale home routes.
- [ ] Render English at `/` and `/en`; keep French at `/fr`.
- [ ] Set `trailingSlash: 'always'`; canonicalize `/` and `/en/` to the single English route `/en/`, keep `/fr/` canonical French, point `x-default` to English, and preserve `/privacy/` canonicalization to `/fr/confidentialite/`.
- [ ] Confirm the language switch on both English root and `/en` maps to `/fr`; preserve FR/EN pairs on all other pages.
- [ ] Run `npm run build` and inspect the English root, explicit English route, and French route.
- [ ] Commit with a focused message.

## Chunk 2: Repository subpath support

### Task 2: Make routes and assets respect Astro's base path

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/content/pages.ts`
- Modify: `src/layouts/SiteLayout.astro`
- Modify: `src/components/PressKit.astro`
- Modify: `scripts/generate-release-metadata.mjs`
- Inspect: `src/components/`, `src/pages/`, and `public/` for root-absolute internal paths.

- [ ] Read `BASE_PATH` as an environment variable, normalize a leading slash/no trailing slash, and omit Astro's `base` for an empty/root value.
- [ ] Make `routeFor()` prefix the configured Astro `BASE_URL` exactly once and return a trailing slash for page routes, without affecting static route parameters. Keep public asset paths file-like without a trailing slash.
- [ ] Prefix press preview/download URLs and social image URLs with the configured base. Inspect all source absolute paths and fix internal paths; leave external links unchanged.
- [ ] Verify canonical, hreflang, x-default, OG/Twitter and sitemap URLs include the configured base exactly once.
- [ ] Update `scripts/generate-release-metadata.mjs` so both sitemap `<loc>` values and the absolute robots `Sitemap:` directive include `/mata-ara-website` for the Pages build, but no extra path for root builds.
- [ ] Build with no `BASE_PATH` and with `BASE_PATH=/mata-ara-website`; inspect HTML and asset references in both `dist` outputs and confirm localized links resolve directly to `index.html` directories with trailing slashes.
- [ ] Confirm the repository-path sitemap is at `/mata-ara-website/sitemap.xml`, the robots directive names that URL, and the root build retains `/sitemap.xml`.
- [ ] Commit with a focused message.

## Chunk 3: GitHub Pages automation and handoff docs

### Task 3: Add the repository Pages workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

- [ ] Add a workflow triggered by pushes to `main` and `workflow_dispatch`.
- [ ] Use `actions/checkout@v7`, Astro's official `withastro/action@v6`, and `actions/deploy-pages@v5`; grant only `contents: read`, `pages: write`, and `id-token: write`.
- [ ] Set the Pages build environment to `SITE_URL=https://paraita-io.github.io` and `BASE_PATH=/mata-ara-website`.
- [ ] Separate build and deploy jobs, require deploy to wait for build, and bind deploy to environment `github-pages`.
- [ ] Document that the repository Pages source must be set to GitHub Actions and provide the expected project URL.
- [ ] Document custom-domain prerequisites: GitHub Pages domain + DNS/CNAME setup, `SITE_URL` update, and empty `BASE_PATH`.
- [ ] Note that a project site's `robots.txt` is served under the repository prefix, while standard robots discovery is at the host root; do not claim GitHub Pages project output alone publishes a host-root robots file.
- [ ] Document that the existing app privacy URL (`https://paraita.io/privacy`) must be updated in the app/App Store metadata or served by the chosen custom domain before release.
- [ ] Parse/inspect the YAML, build both root and Pages-base variants, and inspect generated routes, assets, sitemap and robots files. Do not push or trigger the workflow.
- [ ] Commit with a focused message.

## Validation constraints

- Do not add or run tests unless requested. Use static build and generated-output/HTTP smoke inspection only.
- Do not push commits, change repository Pages settings, or run the GitHub Actions deployment.
- Keep the default local development URL at `/`; keep all production path behavior environment-configurable.
