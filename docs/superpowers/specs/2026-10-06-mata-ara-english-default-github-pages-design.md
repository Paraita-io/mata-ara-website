# Mata Ara English Default and GitHub Pages Design

## Goal

Make English the default language and prepare this static Astro site for automatic GitHub Pages publishing from the existing `Paraita-io/mata-ara-website` repository, while retaining local development and support for a future custom domain.

## Approved behavior

- `/` presents the English home page without JavaScript. `/en` remains the canonical English home route and `/fr` remains the French home route.
- English is Astro's default locale and the root page's metadata/canonical language is English. Language switching continues to map to the corresponding page.
- The root English alias and `/en` both canonicalize to the same prefixed English route; `x-default` points to that English canonical. The `/privacy` compatibility path canonicalizes to the French localized privacy page.
- Local development uses the site root by default. Builds accept a configurable `BASE_PATH` so Astro routes, navigation, canonical/hreflang links, social images, press assets and the legacy `/privacy` compatibility page work when hosted below a repository path.
- The GitHub Pages workflow builds with `BASE_PATH=/mata-ara-website` and `SITE_URL=https://paraita-io.github.io`, and deploys on pushes to `main` or a manual workflow dispatch. It does not run until changes are pushed; no push or deployment is part of this task.
- A future custom-domain deployment can set `SITE_URL` to the domain origin and `BASE_PATH` to an empty value, and must also configure DNS and the custom domain/CNAME in GitHub Pages. The README will explain these steps and build inputs.

## Implementation shape

- Resolve `BASE_PATH` in `astro.config.mjs` and configure Astro's `base` only when non-root. Keep `site` configurable through `SITE_URL`.
- Make the shared route helper prepend Astro's configured base to public URLs while keeping `getStaticPaths()` route parameters independent of the base.
- Render English content at the root and keep the explicit `/en` route as the canonical English home. Keep `/privacy` and all other internal destinations base-aware.
- Prefix static public asset URLs with the configured base, including press-kit previews/downloads and the social image URL.
- Add a least-privilege Pages workflow using the official Astro GitHub Action and GitHub's Pages deployment action.
- Grant only `contents: read`, `pages: write`, and `id-token: write`; make the deployment job depend on the build job and use the `github-pages` environment.
- Document the default Pages URL, one-time GitHub Pages setting (`Settings > Pages > Source: GitHub Actions`), custom-domain overrides, and the fact that deployment begins only after pushing the workflow to GitHub.

## Validation

- Build and inspect with no `BASE_PATH` to preserve local root routes.
- Build and inspect with `/mata-ara-website` to ensure every internal link, asset, canonical, hreflang, social image and sitemap URL includes the repository prefix exactly once.
- Confirm both root and explicit locale home pages render English, while `/fr` renders French.
- Confirm the static output still contains all 16 HTML routes and the `/privacy` compatibility content.
- Parse/validate the workflow YAML and review action permissions/triggers; do not push or trigger a deployment.

## References

- Astro's [GitHub Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/) recommends its official GitHub Action and explains `site`, `base`, and repository-path internal links.
- GitHub's [custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) documents the Pages artifact and deployment environment.
