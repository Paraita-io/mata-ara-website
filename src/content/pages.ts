export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export type PageId = 'home' | 'features' | 'privacy' | 'support' | 'contact' | 'press' | 'legal' | 'mobileData' | 'networkCounters' | 'travelEsim';

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
  mobileData: {
    id: 'mobileData',
    localized: {
      fr: { slug: 'suivi-forfait-mobile', nav: 'Suivi du forfait mobile', title: 'Suivi du forfait mobile — Mata Ara', description: 'Configurez votre quota et votre cycle mensuel, puis suivez l’usage cellulaire avec les compteurs de l’appareil.' },
      en: { slug: 'mobile-data-tracker', nav: 'Mobile data tracking', title: 'Mobile Data Tracker — Mata Ara', description: 'Set your mobile quota and billing cycle, then follow cellular usage and remaining data with device counters.' },
    },
  },
  networkCounters: {
    id: 'networkCounters',
    localized: {
      fr: { slug: 'compteurs-reseau-iphone', nav: 'Compteurs réseau iPhone', title: 'Compteurs réseau iPhone — Mata Ara', description: 'Observez l’activité en envoi et en réception par interface grâce aux compteurs disponibles sur votre iPhone.' },
      en: { slug: 'iphone-network-counters', nav: 'iPhone network counters', title: 'iPhone Network Counters — Mata Ara', description: 'Explore upload and download activity by network interface using counters available on your iPhone.' },
    },
  },
  travelEsim: {
    id: 'travelEsim',
    localized: {
      fr: { slug: 'suivi-esim-voyage', nav: 'Suivi eSIM en voyage', title: 'Suivi eSIM en voyage — Mata Ara', description: 'Configurez vous-même une enveloppe à durée fixe et sa date d’expiration, puis suivez l’usage cellulaire.' },
      en: { slug: 'travel-esim-data', nav: 'Travel eSIM tracking', title: 'Travel eSIM Data Tracking — Mata Ara', description: 'Manually set a fixed-period travel quota and expiry date, then follow cellular use on your device.' },
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
