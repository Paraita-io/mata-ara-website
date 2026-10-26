import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const header = await readFile(new URL('../src/components/SiteHeader.astro', import.meta.url), 'utf8');
const layout = await readFile(new URL('../src/layouts/SiteLayout.astro', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const home = await readFile(new URL('../src/components/HomePageContent.astro', import.meta.url), 'utf8');

const pngDimensions = async (path) => {
  const image = await readFile(new URL(path, import.meta.url));
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${path} must be PNG artwork`);
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
};

test('header brand uses the existing mark as a sized decorative image', () => {
  assert.match(header, /<img\b[^>]*src=\{publicPath\('assets\/mata-ara-mark\.png'\)\}/);
  assert.match(header, /width="\d+"\s+height="\d+"\s+alt=""/);
  assert.match(header, /<a class="brand"[^>]*aria-label=/, 'brand link keeps its accessible text label');
  assert.doesNotMatch(header, /brand-mark[^>]*>M</);
});

test('layout declares base-path-safe browser and Apple touch icons from app artwork variants', async () => {
  assert.match(layout, /rel="icon"[^>]*href=\{publicPath\('assets\/mata-ara-favicon-32\.png'\)\}/);
  assert.match(layout, /rel="apple-touch-icon"[^>]*href=\{publicPath\('assets\/mata-ara-apple-touch-icon-180\.png'\)\}/);
  assert.deepEqual(await pngDimensions('../public/assets/mata-ara-favicon-32.png'), { width: 32, height: 32 });
  assert.deepEqual(await pngDimensions('../public/assets/mata-ara-apple-touch-icon-180.png'), { width: 180, height: 180 });
});

test('hero orbits and dots use restrained transform and opacity animation', () => {
  assert.match(css, /\.network-orbit\s*\{[^}]*animation:\s*hero-orbit[^;]*;/s);
  assert.match(css, /\.orbit-dot\s*\{[^}]*animation:\s*hero-dot[^;]*;/s);
  assert.match(css, /@keyframes hero-orbit\s*\{[^}]*transform:/s);
  assert.match(css, /@keyframes hero-dot\s*\{[^}]*opacity:/s);
  assert.match(home, /class="hero-art" aria-hidden="true"/, 'hero art remains decorative and hidden from assistive technology');
  for (const name of ['hero-orbit', 'hero-dot']) {
    const body = css.match(new RegExp(`@keyframes ${name}\\s*\\{([^}]+)\\}`))?.[1] ?? '';
    assert.ok(body, `${name} keyframes must exist`);
    assert.doesNotMatch(body, /(?:^|[;{])\s*(?!transform\s*:|opacity\s*:)[a-z-]+\s*:/m, `${name} may animate only transforms and opacity`);
  }
});

test('reduced-motion preference disables the decorative hero animations', () => {
  const reducedMotion = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(reducedMotion, /\.network-orbit\s*,\s*\.orbit-dot\s*\{[^}]*animation:\s*none\s*!important/s);
});
