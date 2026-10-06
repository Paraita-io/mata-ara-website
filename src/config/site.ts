const env = process.env;

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

export const site = {
  name: 'Mata Ara',
  contactEmail: 'paraita@paraita.io',
  privacyPath: '/privacy',
  appStoreUrl:
    env.APP_STORE_URL || 'https://apps.apple.com/app/mata-ara/id1527207105',
  releaseCtaEnabled: parseBoolean(env.RELEASE_CTA_ENABLED, false),
} as const;
