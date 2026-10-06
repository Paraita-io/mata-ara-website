import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDir = resolve('dist');
const configured = process.env.SITE_URL?.trim();
const robotsPath = resolve(outputDir, 'robots.txt');
const sitemapPath = resolve(outputDir, 'sitemap.xml');

if (!configured) {
  await rm(sitemapPath, { force: true });
  await writeFile(robotsPath, 'User-agent: *\nAllow: /\n', 'utf8');
  process.exit(0);
}

let siteUrl;
try {
  siteUrl = new URL(configured);
} catch {
  throw new Error('SITE_URL must be an absolute HTTPS origin, for example https://mata-ara.example.');
}
if (siteUrl.protocol !== 'https:' || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash || siteUrl.username || siteUrl.password) {
  throw new Error('SITE_URL must be an HTTPS origin without a path, query, credentials, or fragment.');
}
const origin = siteUrl.origin;
const htmlFiles = [];
async function collectHtml(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await collectHtml(path);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}
await collectHtml(outputDir);
const canonicalUrls = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?\s*>/i);
  if (!match) continue;
  const canonical = new URL(match[1], `${origin}/`);
  if (canonical.origin === origin) canonicalUrls.add(canonical.href);
}
const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const urls = [...canonicalUrls].sort().map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n');

await mkdir(outputDir, { recursive: true });
await writeFile(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
await writeFile(robotsPath, `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`, 'utf8');
