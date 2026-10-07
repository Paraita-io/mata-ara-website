import { defineConfig } from 'astro/config';

const siteUrl = process.env.SITE_URL?.trim();
const requestedBase = process.env.BASE_PATH?.trim() ?? '';
const normalizedBase = requestedBase
  ? `/${requestedBase.split('/').filter(Boolean).join('/')}`
  : '';

export default defineConfig({
  ...(siteUrl ? { site: siteUrl } : {}),
  ...(normalizedBase ? { base: normalizedBase } : {}),
  output: 'static',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'en',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
