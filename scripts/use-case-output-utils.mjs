/** Return locale-root hrefs that are missing the configured project-site prefix. */
export function findUnprefixedLocaleRootLinks(html, basePath) {
  const unprefixed = [];
  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:en|fr)\//.test(href) || (basePath && /^\/(?:en|fr)\//.test(href))) {
      unprefixed.push(href);
    }
  }
  return unprefixed;
}
