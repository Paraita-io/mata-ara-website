/** Localized editorial content for the static use-case routes. Feature details mirror FeatureCards.astro. */
export const useCases = {
  mobileData: {
    en: {
      title: 'Mobile Data Tracker — Mata Ara',
      description: 'Set your mobile quota and billing cycle, then follow cellular usage and remaining data with device counters.',
      paragraphs: [
        'Enter the data allowance from your mobile plan and choose a monthly cycle start day from 1 to 28. Mata Ara compares cellular usage on your device with the quota you configured, so you can see what remains during the cycle.',
        'Review upload and download activity, then use hourly and daily history to understand how usage changes. Charts can show 24 hours, 7 days, 1 month, or 3 months of recorded history.',
        'If the displayed total needs adjustment, you can recalibrate tracking in the app. The counters come from your device and may not match your carrier’s billing total; use your carrier’s records as the billing reference.',
      ],
      limitation: 'Mata Ara uses device counters and a quota you configure; its total can differ from your carrier’s billing measurement.',
      relatedIds: ['networkCounters', 'travelEsim'],
      cta: 'Get Mata Ara on the App Store',
    },
    fr: {
      title: 'Suivi du forfait mobile — Mata Ara',
      description: 'Configurez votre quota et votre cycle mensuel, puis suivez l’usage cellulaire avec les compteurs de l’appareil.',
      paragraphs: [
        'Saisissez le volume de données de votre forfait et choisissez le jour de début de votre cycle mensuel, entre le 1er et le 28. Mata Ara compare l’usage cellulaire mesuré sur votre appareil au quota configuré pour vous indiquer ce qu’il vous reste pendant le cycle.',
        'Consultez l’activité en envoi et en réception, puis l’historique horaire et journalier pour comprendre son évolution. Les graphiques peuvent couvrir 24 heures, 7 jours, 1 mois ou 3 mois de relevés.',
        'Si le total affiché doit être ajusté, vous pouvez recalibrer le suivi dans l’app. Les compteurs viennent de l’appareil et peuvent différer du total de facturation de votre opérateur ; consultez celui-ci comme référence de facturation.',
      ],
      limitation: 'Mata Ara utilise les compteurs de l’appareil et un quota que vous configurez ; le total peut différer de la mesure de facturation de votre opérateur.',
      relatedIds: ['networkCounters', 'travelEsim'],
      cta: 'Obtenir Mata Ara sur l’App Store',
    },
  },
  networkCounters: {
    en: {
      title: 'iPhone Network Counters — Mata Ara',
      description: 'Explore upload and download activity by network interface using counters available on your iPhone.',
      paragraphs: [
        'Mata Ara presents the network counters available on your iPhone, grouped into interface families. This gives you a way to explore incoming and outgoing activity across the device’s network connections.',
        'Compare activity and speeds by interface family to see how device usage changes over time. The app also keeps hourly and daily snapshots for its history charts when the device can refresh its data.',
        'Interface names are categorized with heuristics, and the available counters and classifications depend on the device and its configuration. For example, some interfaces can be ambiguous and Ethernet is not distinguished on every device.',
      ],
      limitation: 'These are device network-interface counters, not per-app traffic; interface classification is heuristic and can be ambiguous.',
      relatedIds: ['mobileData', 'travelEsim'],
      cta: 'Get Mata Ara on the App Store',
    },
    fr: {
      title: 'Compteurs réseau iPhone — Mata Ara',
      description: 'Observez l’activité en envoi et en réception par interface grâce aux compteurs disponibles sur votre iPhone.',
      paragraphs: [
        'Mata Ara présente les compteurs réseau disponibles sur votre iPhone, regroupés par familles d’interfaces. Vous pouvez ainsi observer l’activité entrante et sortante des connexions réseau de l’appareil.',
        'Comparez l’activité et les débits par famille d’interfaces pour suivre l’évolution de l’usage. L’app conserve aussi des relevés horaires et journaliers pour ses graphiques lorsque l’appareil peut actualiser les données.',
        'Les noms d’interfaces sont classés à l’aide de règles heuristiques ; les compteurs et leur classification dépendent de l’appareil et de sa configuration. Certaines interfaces peuvent être ambiguës et Ethernet n’est pas distingué sur tous les appareils.',
      ],
      limitation: 'Ce sont des compteurs d’interfaces réseau de l’appareil, pas le trafic de chaque app ; le classement est heuristique et peut être ambigu.',
      relatedIds: ['mobileData', 'travelEsim'],
      cta: 'Obtenir Mata Ara sur l’App Store',
    },
  },
  travelEsim: {
    en: {
      title: 'Travel eSIM Data Tracking — Mata Ara',
      description: 'Manually set a fixed-period travel quota and expiry date, then follow cellular use on your device.',
      paragraphs: [
        'When you travel with a temporary data plan, set a user-configured quota and its expiry date in Mata Ara. Choose a fixed period and enter the allowance provided with your plan.',
        'Mata Ara follows the device’s cellular counters during the trip. You can review usage and recalibrate tracking if needed, and the app can send a local notification when your configured plan is due to expire within 24 hours.',
        'This workflow can be used for a travel eSIM or another temporary mobile plan. It helps you compare device usage with the allowance and dates you entered yourself.',
      ],
      limitation: 'Mata Ara does not automatically detect eSIM profiles or their expiry, and does not read carrier billing data; device totals can differ from your carrier’s.',
      relatedIds: ['mobileData', 'networkCounters'],
      cta: 'Get Mata Ara on the App Store',
    },
    fr: {
      title: 'Suivi eSIM en voyage — Mata Ara',
      description: 'Configurez vous-même une enveloppe à durée fixe et sa date d’expiration, puis suivez l’usage cellulaire.',
      paragraphs: [
        'Lors d’un voyage avec un forfait temporaire, configurez dans Mata Ara un quota et sa date d’expiration. Choisissez une période fixe et saisissez le volume de données fourni avec votre forfait.',
        'Mata Ara suit les compteurs cellulaires de l’appareil pendant le séjour. Consultez l’usage et recalibrez le suivi si nécessaire ; l’app peut envoyer une notification locale lorsque le forfait configuré expire dans les 24 heures.',
        'Ce suivi convient à une eSIM de voyage ou à un autre forfait mobile temporaire. Il vous aide à comparer les compteurs de l’appareil à l’enveloppe et aux dates que vous avez saisies.',
      ],
      limitation: 'Mata Ara ne détecte pas les profils eSIM ni leur expiration automatiquement et ne lit pas les données de facturation de l’opérateur ; les totaux peuvent différer.',
      relatedIds: ['mobileData', 'networkCounters'],
      cta: 'Obtenir Mata Ara sur l’App Store',
    },
  },
};
