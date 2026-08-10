export type ExperienceType = 'private' | 'shared' | 'rental';

export interface MarketplaceExperience {
  slug: string;
  operatorSlug: string;
  operatorName: string;
  title: string;
  city: string;
  region: string;
  category: string;
  experienceType: ExperienceType;
  durationMinutes: number;
  maxGuests: number;
  basePriceCents?: number;
  currency: 'EUR';
  pricingUnit: 'group' | 'person' | 'hour' | 'day';
  heroImage: string;
  gallery: Array<{ url: string; alt: string }>;
  shortDescription: string;
  description: string[];
  included: string[];
  importantInfo: string[];
  meetingPoint: string;
  contactEmail: string;
  contactPhone?: string;
  instantBooking: boolean;
}

export const experiences: MarketplaceExperience[] = [
  {
    slug: 'san-luca-magno-kornati-telascica-private-tour',
    operatorSlug: 'san-luca-magno',
    operatorName: 'San Luca Magno',
    title: 'San Luca Magno: Privatni izlet jedrenjakom na Kornate i Telašćicu iz Zadra',
    city: 'Zadar',
    region: 'Dalmatia',
    category: 'boat-tour',
    experienceType: 'private',
    durationMinutes: 540,
    maxGuests: 12,
    currency: 'EUR',
    pricingUnit: 'group',
    heroImage: 'https://storage.googleapis.com/croatiasara2026/images/partners/san-luca-magno-zadar/San_Luca_Magno_1.jpg',
    gallery: [
      {
        url: 'https://storage.googleapis.com/croatiasara2026/images/partners/san-luca-magno-zadar/San_Luca_Magno_2.jpg',
        alt: 'Jedrenjak San Luca Magno na moru',
      },
      {
        url: 'https://storage.googleapis.com/croatiasara2026/images/partners/san-luca-magno-zadar/San_Luca_Magno_1.jpg',
        alt: 'San Luca Magno u zadarskom arhipelagu',
      },
      {
        url: 'https://storage.googleapis.com/croatiasara2026/images/partners/san-luca-magno-zadar/San_Luca_Magno_3.jpg',
        alt: 'Privatni izlet brodom iz Zadra',
      },
    ],
    shortDescription:
      'Otkrijte Kornate i Telašćicu na privatnom cjelodnevnom izletu autentičnim motornim jedrenjakom iz Zadra, uz kupanje, domaću hranu i fleksibilnu rutu za grupe do 12 osoba.',
    description: [
      'Zaplovite iz Zadra na povijesnom jedrenjaku San Luca Magno, izgrađenom 1968. i obnovljenom 2020., te istražite zadarski arhipelag uz privatnu posadu.',
      'Cjelodnevni izlet vodi prema Nacionalnom parku Kornati i Parku prirode Telašćica, s pauzama za kupanje, ronjenje i SUP u uvalama koje kapetan prilagođava vremenu i željama gostiju.',
      'Doručak i ručak pripremaju se na brodu, a u iskustvo su uključena pića, gorivo i oprema za aktivnosti na moru.',
    ],
    included: [
      'Privatni najam broda s kapetanom',
      'Cjelodnevni izlet od približno 9 sati',
      'Doručak i ručak na brodu',
      'Voda, kava, limunada i domaće vino',
      'Oprema za ronjenje i SUP',
      'Gorivo',
    ],
    importantInfo: [
      'Polazak iz Zadra, prema dogovorenoj lokaciji.',
      'Uobičajeni polazak je oko 09:00.',
      'Maksimalno 12 gostiju.',
      'Rezervacija je trenutno dostupna na upit.',
    ],
    meetingPoint: 'Zadar, Croatia',
    contactEmail: 'info@sanluca-magno.hr',
    contactPhone: '+385 98 123 4567',
    instantBooking: false,
  },
];

export function getExperienceBySlug(slug: string) {
  return experiences.find((experience) => experience.slug === slug);
}
