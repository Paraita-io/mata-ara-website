export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export type PageId = 'home' | 'features' | 'privacy' | 'support' | 'contact' | 'press' | 'legal';

type LocalizedPage = { slug: string; nav: string; title: string; description: string };
export type PageDefinition = { id: PageId; localized: Record<Locale, LocalizedPage> };

/** Explicit route and metadata source for every public page. Routes match static directory index output. */
export const pages = {
  home: {
    id: 'home',
    localized: {
      fr: { slug: '', nav: 'Accueil', title: 'Mata Ara — Votre réseau, en clair', description: 'Suivez votre forfait mobile, observez l’activité réseau de votre appareil et gardez un œil sur votre enveloppe en voyage.' },
      en: { slug: '', nav: 'Home', title: 'Mata Ara — Your network, made clear', description: 'Track your mobile plan, explore network activity on your device, and keep an eye on your allowance while travelling.' },
    },
  },
  features: {
    id: 'features',
    localized: {
      fr: { slug: 'fonctionnalites', nav: 'Fonctionnalités', title: 'Fonctionnalités — Mata Ara', description: 'Du suivi de forfait aux compteurs réseau, découvrez une vue claire de votre consommation.' },
      en: { slug: 'features', nav: 'Features', title: 'Features — Mata Ara', description: 'From plan tracking to network counters, get a clearer view of your usage.' },
    },
  },
  privacy: {
    id: 'privacy',
    localized: {
      fr: { slug: 'confidentialite', nav: 'Confidentialité', title: 'Confidentialité — Mata Ara', description: 'Politique de confidentialité de l’application Mata Ara.' },
      en: { slug: 'privacy', nav: 'Privacy', title: 'Privacy — Mata Ara', description: 'Mata Ara application privacy policy.' },
    },
  },
  support: {
    id: 'support',
    localized: {
      fr: { slug: 'assistance', nav: 'Assistance', title: 'Assistance — Mata Ara', description: 'Aide et coordonnées pour obtenir de l’assistance sur Mata Ara.' },
      en: { slug: 'support', nav: 'Support', title: 'Support — Mata Ara', description: 'Help and contact details for Mata Ara support.' },
    },
  },
  contact: {
    id: 'contact',
    localized: {
      fr: { slug: 'contact', nav: 'Contact', title: 'Nous contacter — Mata Ara', description: 'Contacter l’équipe Mata Ara.' },
      en: { slug: 'contact', nav: 'Contact', title: 'Contact us — Mata Ara', description: 'Contact the Mata Ara team.' },
    },
  },
  press: {
    id: 'press',
    localized: {
      fr: { slug: 'press-kit', nav: 'Presse', title: 'Kit presse — Mata Ara', description: 'Informations et ressources officielles pour présenter Mata Ara.' },
      en: { slug: 'press-kit', nav: 'Press kit', title: 'Press kit — Mata Ara', description: 'Official information and resources for covering Mata Ara.' },
    },
  },
  legal: {
    id: 'legal',
    localized: {
      fr: { slug: 'mentions-legales', nav: 'Mentions légales', title: 'Mentions légales — Mata Ara', description: 'Informations légales relatives au site Mata Ara.' },
      en: { slug: 'legal', nav: 'Legal', title: 'Legal — Mata Ara', description: 'Legal information about the Mata Ara website.' },
    },
  },
} satisfies Record<PageId, PageDefinition>;

export function routeFor(id: PageId, locale: Locale): string {
  const slug = pages[id].localized[locale].slug;
  const route = slug ? `/${locale}/${slug}/` : `/${locale}/`;
  return publicPath(route);
}

export function publicPath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}

export function localizedPage(id: PageId, locale: Locale): LocalizedPage {
  return pages[id].localized[locale];
}

export function allPageEntries() {
  return (Object.keys(pages) as PageId[]).flatMap((id) =>
    locales.map((locale) => ({ id, locale, ...pages[id].localized[locale] })),
  );
}
