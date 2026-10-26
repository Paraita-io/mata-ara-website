import assert from 'node:assert/strict';
import test from 'node:test';
import { findUnprefixedLocaleRootLinks } from '../scripts/use-case-output-utils.mjs';

test('detects locale-root hrefs missing the configured project-site prefix', () => {
  const html = '<a href="en/features/">English</a><a href="/fr/contact/">French</a><a href="/mata-ara-website/en/features/">Prefixed</a>';
  assert.deepEqual(findUnprefixedLocaleRootLinks(html, '/mata-ara-website'), ['en/features/', '/fr/contact/']);
});

test('allows root-leading locale routes on root deployments and ignores absolute URLs', () => {
  const html = '<a href="/en/features/">English</a><a href="en/contact/">Relative</a><a href="https://example.com/fr/contact/">External</a>';
  assert.deepEqual(findUnprefixedLocaleRootLinks(html, ''), ['en/contact/']);
});
