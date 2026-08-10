import { createClient } from '@supabase/supabase-js';
import { getStaticExperienceBySlug, type ExperienceType, type MarketplaceExperience } from './experiences';

export interface MarketplaceDiscoveryFilters {
  city: string;
  category?: string;
  guests?: number;
  experienceType?: ExperienceType;
  date?: string;
}

export interface MarketplaceListing {
  id?: string;
  slug: string;
  operatorName: string;
  title: string;
  city: string;
  experienceType: ExperienceType;
  durationMinutes: number;
  maxGuests: number;
  basePriceCents?: number;
  currency: 'EUR';
  pricingUnit: MarketplaceExperience['pricingUnit'];
  heroImage: string;
  shortDescription: string;
  availabilityStatus: 'available' | 'on_request';
}

type DiscoveryRow = {
  id: string;
  slug: string;
  title: string;
  city: string;
  experience_type: ExperienceType;
  duration_minutes: number | null;
  max_guests: number | null;
  base_price_cents: number | null;
  currency: string;
  pricing_unit: MarketplaceExperience['pricingUnit'];
  short_description: string | null;
  operators: { name: string } | null;
  experience_images: Array<{
    url: string;
    sort_order: number;
    is_cover: boolean;
  }> | null;
};

export async function listMarketplaceExperiences(filters: MarketplaceDiscoveryFilters): Promise<MarketplaceListing[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return getFallbackListings(filters);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let query = supabase
      .from('experiences')
      .select(`
        id,
        slug,
        title,
        city,
        experience_type,
        duration_minutes,
        max_guests,
        base_price_cents,
        currency,
        pricing_unit,
        short_description,
        operators!experiences_operator_id_fkey(name),
        experience_images(url, sort_order, is_cover)
      `)
      .eq('status', 'active')
      .ilike('city', filters.city)
      .order('created_at', { ascending: false });

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.experienceType) query = query.eq('experience_type', filters.experienceType);
    if (filters.guests && filters.guests > 0) query = query.gte('max_guests', filters.guests);

    const { data, error } = await query;
    if (error || !data) return getFallbackListings(filters);

    const rows = data as unknown as DiscoveryRow[];
    let blockedIds = new Set<string>();

    if (filters.date && rows.length) {
      const { data: blockedRows, error: availabilityError } = await supabase
        .from('availability')
        .select('experience_id,status')
        .in('experience_id', rows.map((row) => row.id))
        .eq('service_date', filters.date)
        .in('status', ['sold_out', 'blocked']);

      if (!availabilityError && blockedRows) {
        blockedIds = new Set(blockedRows.map((item) => item.experience_id as string));
      }
    }

    return rows
      .filter((row) => !blockedIds.has(row.id))
      .map((row) => {
        const images = [...(row.experience_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
        const cover = images.find((image) => image.is_cover) ?? images[0];
        return {
          id: row.id,
          slug: row.slug,
          operatorName: row.operators?.name ?? 'Croatia360 partner',
          title: row.title,
          city: row.city,
          experienceType: row.experience_type,
          durationMinutes: row.duration_minutes ?? 0,
          maxGuests: row.max_guests ?? 1,
          basePriceCents: row.base_price_cents ?? undefined,
          currency: 'EUR' as const,
          pricingUnit: row.pricing_unit,
          heroImage: cover?.url ?? '',
          shortDescription: row.short_description ?? '',
          availabilityStatus: 'on_request' as const,
        };
      });
  } catch {
    return getFallbackListings(filters);
  }
}

function getFallbackListings(filters: MarketplaceDiscoveryFilters): MarketplaceListing[] {
  const experience = getStaticExperienceBySlug('san-luca-magno-kornati-telascica-private-tour');
  if (!experience) return [];
  if (experience.city.toLowerCase() !== filters.city.toLowerCase()) return [];
  if (filters.category && experience.category !== filters.category) return [];
  if (filters.experienceType && experience.experienceType !== filters.experienceType) return [];
  if (filters.guests && experience.maxGuests < filters.guests) return [];

  return [{
    slug: experience.slug,
    operatorName: experience.operatorName,
    title: experience.title,
    city: experience.city,
    experienceType: experience.experienceType,
    durationMinutes: experience.durationMinutes,
    maxGuests: experience.maxGuests,
    basePriceCents: experience.basePriceCents,
    currency: experience.currency,
    pricingUnit: experience.pricingUnit,
    heroImage: experience.heroImage,
    shortDescription: experience.shortDescription,
    availabilityStatus: 'on_request',
  }];
}
