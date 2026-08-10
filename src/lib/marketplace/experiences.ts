import { createClient } from '@supabase/supabase-js';

export type ExperienceType = 'private' | 'shared' | 'rental';

export interface MarketplaceExperience {
  id?: string;
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

type MarketplaceRow = {
  id: string;
  slug: string;
  title: string;
  city: string;
  region: string | null;
  category: string;
  experience_type: ExperienceType;
  duration_minutes: number | null;
  max_guests: number | null;
  base_price_cents: number | null;
  currency: string;
  pricing_unit: MarketplaceExperience['pricingUnit'];
  short_description: string | null;
  description: string | null;
  included: unknown;
  important_info: unknown;
  meeting_point: string | null;
  instant_booking: boolean;
  operators: {
    name: string;
    slug: string;
    email: string | null;
    phone: string | null;
  } | null;
  experience_images: Array<{
    url: string;
    alt_text: string | null;
    sort_order: number;
    is_cover: boolean;
  }> | null;
};

const staticExperiences: MarketplaceExperience[] = [
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

export function getStaticExperienceBySlug(slug: string) {
  return staticExperiences.find((experience) => experience.slug === slug);
}

export async function getMarketplaceExperienceBySlug(slug: string): Promise<MarketplaceExperience | undefined> {
  const fallback = getStaticExperienceBySlug(slug);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return fallback;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from('experiences')
      .select(`
        id,
        slug,
        title,
        city,
        region,
        category,
        experience_type,
        duration_minutes,
        max_guests,
        base_price_cents,
        currency,
        pricing_unit,
        short_description,
        description,
        included,
        important_info,
        meeting_point,
        instant_booking,
        operators!experiences_operator_id_fkey(name, slug, email, phone),
        experience_images(url, alt_text, sort_order, is_cover)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !data) return fallback;

    return mapMarketplaceRow(data as unknown as MarketplaceRow, fallback);
  } catch {
    return fallback;
  }
}

function mapMarketplaceRow(row: MarketplaceRow, fallback?: MarketplaceExperience): MarketplaceExperience {
  const images = [...(row.experience_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const cover = images.find((image) => image.is_cover) ?? images[0];
  const description = row.description
    ? row.description.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
    : fallback?.description ?? [];

  return {
    id: row.id,
    slug: row.slug,
    operatorSlug: row.operators?.slug ?? fallback?.operatorSlug ?? 'operator',
    operatorName: row.operators?.name ?? fallback?.operatorName ?? 'Croatia360 partner',
    title: row.title,
    city: row.city,
    region: row.region ?? fallback?.region ?? '',
    category: row.category,
    experienceType: row.experience_type,
    durationMinutes: row.duration_minutes ?? fallback?.durationMinutes ?? 0,
    maxGuests: row.max_guests ?? fallback?.maxGuests ?? 1,
    basePriceCents: row.base_price_cents ?? undefined,
    currency: row.currency === 'EUR' ? 'EUR' : fallback?.currency ?? 'EUR',
    pricingUnit: row.pricing_unit,
    heroImage: cover?.url ?? fallback?.heroImage ?? '',
    gallery: images.length
      ? images.map((image) => ({ url: image.url, alt: image.alt_text ?? row.title }))
      : fallback?.gallery ?? [],
    shortDescription: row.short_description ?? fallback?.shortDescription ?? '',
    description,
    included: toStringArray(row.included, fallback?.included),
    importantInfo: toStringArray(row.important_info, fallback?.importantInfo),
    meetingPoint: row.meeting_point ?? fallback?.meetingPoint ?? row.city,
    contactEmail: row.operators?.email ?? fallback?.contactEmail ?? '',
    contactPhone: row.operators?.phone ?? fallback?.contactPhone,
    instantBooking: row.instant_booking,
  };
}

function toStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === 'string');
}
