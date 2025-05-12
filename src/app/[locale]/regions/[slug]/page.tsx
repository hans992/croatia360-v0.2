// src/app/[locale]/regions/[slug]/page.tsx

// Essential Next.js and React imports
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link'; // Import Next.js Link component

// Internationalization (i18n) utilities
import { getServerTranslations } from '@/lib/i18n/server';
import { defaultNS, fallbackLng, type Locale, locales as appLocalesStringArray } from '@/lib/i18n/settings';
import type { TFunction } from 'i18next';

// Metadata and type imports for Next.js
import type { Metadata, ResolvingMetadata } from 'next';

// Lucide icons for various elements
import { Plane, Car, Bus, Train, BedDouble, Utensils, Bike, Sailboat, CalendarDays, LandmarkIcon, type LucideIcon, Ship } from 'lucide-react'; // Added Ship icon as an alternative for Sailboat if preferred

// --- Component-specific interfaces ---

// Interface for items within example sections (accommodation, food, activities, etc.)
interface ExampleItem {
  nameKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  linkTo?: string; // Optional: Path to a dedicated page for this item
}

// Interface for transport details
interface TransportDetailItem {
  typeKey: string;
  detailsKey: string;
  icon: LucideIcon;
  linkTo?: string; // Optional: Link for transport details if needed
}

// Main interface for the data structure of a region
interface RegionData {
  id: string;
  nameKey: string;
  titleKey: string;
  descriptionKey: string;
  longDescriptionKey?: string;
  heroImageUrl: string;
  galleryImageUrls?: string[];
  color1: string;
  color2: string;
  transportIntroKey?: string;
  transportDetails?: Array<TransportDetailItem>;
  accommodationIntroKey?: string;
  accommodationExamples?: Array<ExampleItem>;
  foodIntroKey?: string;
  foodExamples?: Array<ExampleItem>;
  activitiesIntroKey?: string;
  activityExamples?: Array<ExampleItem>;
  eventsIntroKey?: string;
  eventExamples?: Array<ExampleItem>;
  sightsIntroKey?: string;
  sightExamples?: Array<ExampleItem>;
}

interface ResolvedPageParams {
  locale: string;
  slug: string;
}

interface ResolvedSearchParams {
  [key: string]: string | string[] | undefined;
}

// Base URL for images from Google Cloud Storage
const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

// Mock database of regions with detailed information
async function getRegionDataBySlug(slug: string, locale: Locale): Promise<RegionData | null> {
  console.log(`[getRegionDataBySlug] Fetching data for dynamic slug: '${slug}', locale: '${locale}'`);
  const lowerSlug = slug.toLowerCase();
  const baseKey = `region_${lowerSlug.replace(/-/g, '_')}`; // e.g., region_sredisnja_hrvatska

  // Default structure for example items to avoid repetition
  const getDefaultExamples = (regionSlug: string, section: string, count: number = 2, icon: LucideIcon = LandmarkIcon): ExampleItem[] => {
    return Array.from({ length: count }, (_, i) => ({
      nameKey: `${section}_${regionSlug}_example_${i + 1}_name`,
      descriptionKey: `${section}_${regionSlug}_example_${i + 1}_desc`,
      icon: icon,
    }));
  };
  
  // Default transport details
  const getDefaultTransportDetails = (regionSlug: string): TransportDetailItem[] => [
    { typeKey: 'transport_type_airplane', detailsKey: `transport_${regionSlug}_airplane_details`, icon: Plane },
    { typeKey: 'transport_type_car', detailsKey: `transport_${regionSlug}_car_details`, icon: Car },
    { typeKey: 'transport_type_bus', detailsKey: `transport_${regionSlug}_bus_details`, icon: Bus },
    { typeKey: 'transport_type_train', detailsKey: `transport_${regionSlug}_train_details`, icon: Train },
  ];


  const regionsDatabase: Record<string, Partial<Omit<RegionData, 'id' | 'nameKey' | 'titleKey' | 'descriptionKey' | 'longDescriptionKey'>>> = {
    'slavonija': {
      heroImageUrl: `${gcsBaseUrl}regions/slavonija/Slavonski_Brod_fortress.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/slavonija/Osijek_trg_tram_Lovro_Pavlicic.jpg`, `${gcsBaseUrl}regions/slavonija/Kutjevo_wineyard_Perak.jpg`],
      color1: '#FFD700', color2: '#8B4513', // Gold, Brown
      transportIntroKey: 'region_transport_intro_example',
      transportDetails: getDefaultTransportDetails('slavonija'),
      accommodationIntroKey: 'region_accommodation_intro_example',
      accommodationExamples: [
        { nameKey: 'accommodation_slavonija_example_hotel_name', descriptionKey: 'accommodation_slavonija_example_hotel_desc', icon: BedDouble },
        { nameKey: 'accommodation_slavonija_example_rural_name', descriptionKey: 'accommodation_slavonija_example_rural_desc', icon: BedDouble },
      ],
      foodIntroKey: 'region_food_intro_example',
      foodExamples: [
        { nameKey: 'food_slavonija_kulen_name', descriptionKey: 'food_slavonija_kulen_desc', icon: Utensils },
        { nameKey: 'food_slavonija_fis_paprikas_name', descriptionKey: 'food_slavonija_fis_paprikas_desc', icon: Utensils },
      ],
      activitiesIntroKey: 'region_activities_intro_example',
      activityExamples: [
        { nameKey: 'activities_slavonija_kopacki_rit_name', descriptionKey: 'activities_slavonija_kopacki_rit_desc', icon: Bike },
        { nameKey: 'activities_slavonija_wine_tour_name', descriptionKey: 'activities_slavonija_wine_tour_desc', icon: Bike },
      ],
      eventsIntroKey: 'region_events_intro_example',
      eventExamples: [
        { nameKey: 'events_slavonija_vinkovacke_jeseni_name', descriptionKey: 'events_slavonija_vinkovacke_jeseni_desc', icon: CalendarDays },
      ],
      sightsIntroKey: 'region_sights_intro_example',
      sightExamples: [
        { nameKey: 'sights_slavonija_osijek_tvrdja_name', descriptionKey: 'sights_slavonija_osijek_tvrdja_desc', icon: LandmarkIcon },
        { nameKey: 'sights_slavonija_djakovo_cathedral_name', descriptionKey: 'sights_slavonija_djakovo_cathedral_desc', icon: LandmarkIcon },
      ],
    },
    'dalmacija': {
      heroImageUrl: `${gcsBaseUrl}regions/dalmacija/Zadar_charter_yacht.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/dalmacija/Dubrovnik_srd.jpg`, `${gcsBaseUrl}regions/dalmacija/Makarska_from_the_sea.jpg`],
      color1: '#007FFF', color2: '#F8F8FF', // Azure, GhostWhite
      transportIntroKey: 'region_transport_intro_example',
      transportDetails: [
        ...getDefaultTransportDetails('dalmacija'),
        { typeKey: 'transport_type_boat', detailsKey: 'transport_dalmacija_boat_details', icon: Sailboat }, // Added boat transport
      ],
      accommodationIntroKey: 'region_accommodation_intro_example',
      accommodationExamples: [
        { nameKey: 'accommodation_dalmacija_example_hotel_name', descriptionKey: 'accommodation_dalmacija_example_hotel_desc', icon: BedDouble },
        { nameKey: 'accommodation_dalmacija_example_apartment_name', descriptionKey: 'accommodation_dalmacija_example_apartment_desc', icon: BedDouble },
      ],
      foodIntroKey: 'region_food_intro_example',
      foodExamples: [
        { nameKey: 'food_dalmacija_pasticada_name', descriptionKey: 'food_dalmacija_pasticada_desc', icon: Utensils },
        { nameKey: 'food_dalmacija_brudet_name', descriptionKey: 'food_dalmacija_brudet_desc', icon: Utensils },
      ],
      activitiesIntroKey: 'region_activities_intro_example',
      activityExamples: [
        { nameKey: 'activities_dalmacija_np_krka_name', descriptionKey: 'activities_dalmacija_np_krka_desc', icon: Bike },
        { nameKey: 'activities_dalmacija_sailing_name', descriptionKey: 'activities_dalmacija_sailing_desc', icon: Sailboat, linkTo: '/partner/san-luca-magno' },
      ],
      eventsIntroKey: 'region_events_intro_example',
      eventExamples: [
        { nameKey: 'events_dalmacija_ultra_europe_name', descriptionKey: 'events_dalmacija_ultra_europe_desc', icon: CalendarDays },
      ],
      sightsIntroKey: 'region_sights_intro_example',
      sightExamples: [
        { nameKey: 'sights_dalmacija_dubrovnik_walls_name', descriptionKey: 'sights_dalmacija_dubrovnik_walls_desc', icon: LandmarkIcon },
        { nameKey: 'sights_dalmacija_dioklecian_palace_name', descriptionKey: 'sights_dalmacija_dioklecian_palace_desc', icon: LandmarkIcon },
      ],
    },
    'istra': {
      heroImageUrl: `${gcsBaseUrl}regions/istra/Rovinj_from_distance.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/istra/Pula_arena_evening.jpg`, `${gcsBaseUrl}regions/istra/Motovun_hilltop_town.jpg`],
      color1: '#E07A5F', color2: '#3D405B', // Terracotta, Dark Blue-Gray
      transportIntroKey: 'region_transport_intro_example',
      transportDetails: [
        ...getDefaultTransportDetails('istra'),
        { typeKey: 'transport_type_boat', detailsKey: 'transport_istra_boat_details', icon: Sailboat }, // Added boat transport
      ],
      accommodationIntroKey: 'region_accommodation_intro_example',
      accommodationExamples: getDefaultExamples('istra', 'accommodation', 2, BedDouble),
      foodIntroKey: 'region_food_intro_example',
      foodExamples: getDefaultExamples('istra', 'food', 2, Utensils),
      activitiesIntroKey: 'region_activities_intro_example',
      activityExamples: getDefaultExamples('istra', 'activities', 2, Bike),
      eventsIntroKey: 'region_events_intro_example',
      eventExamples: getDefaultExamples('istra', 'events', 1, CalendarDays),
      sightsIntroKey: 'region_sights_intro_example',
      sightExamples: getDefaultExamples('istra', 'sights', 2, LandmarkIcon),
    },
    'sredisnja-hrvatska': { // Slug: sredisnja-hrvatska
      heroImageUrl: `${gcsBaseUrl}regions/sredisnja_hrvatska/Madjerkin_breg_wineyard.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/sredisnja_hrvatska/Trakoscan_castle_lake.jpg`, `${gcsBaseUrl}regions/sredisnja_hrvatska/Varazdin_old_town.jpg`],
      color1: '#800020', color2: '#2E8B57', // Burgundy, SeaGreen
      transportIntroKey: 'region_transport_intro_example',
      transportDetails: getDefaultTransportDetails('sredisnja_hrvatska'),
      accommodationIntroKey: 'region_accommodation_intro_example',
      accommodationExamples: getDefaultExamples('sredisnja_hrvatska', 'accommodation', 2, BedDouble),
      foodIntroKey: 'region_food_intro_example',
      foodExamples: getDefaultExamples('sredisnja_hrvatska', 'food', 2, Utensils),
      activitiesIntroKey: 'region_activities_intro_example',
      activityExamples: getDefaultExamples('sredisnja_hrvatska', 'activities', 2, Bike),
      eventsIntroKey: 'region_events_intro_example',
      eventExamples: getDefaultExamples('sredisnja_hrvatska', 'events', 1, CalendarDays),
      sightsIntroKey: 'region_sights_intro_example',
      sightExamples: getDefaultExamples('sredisnja_hrvatska', 'sights', 2, LandmarkIcon),
    },
    'zagreb': {
      heroImageUrl: `${gcsBaseUrl}regions/zagreb/Zagreb_dron_image.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/zagreb/Zagreb_cathedral_night.jpg`, `${gcsBaseUrl}regions/zagreb/Tkalciceva_street_day.jpg`],
      color1: '#5D3FD3', color2: '#EAE0D5', // VioletBlue, Beige
      transportIntroKey: 'region_transport_intro_example',
      transportDetails: getDefaultTransportDetails('zagreb'),
      accommodationIntroKey: 'region_accommodation_intro_example',
      accommodationExamples: getDefaultExamples('zagreb', 'accommodation', 2, BedDouble),
      foodIntroKey: 'region_food_intro_example',
      foodExamples: getDefaultExamples('zagreb', 'food', 2, Utensils),
      activitiesIntroKey: 'region_activities_intro_example',
      activityExamples: getDefaultExamples('zagreb', 'activities', 2, Bike),
      eventsIntroKey: 'region_events_intro_example',
      eventExamples: getDefaultExamples('zagreb', 'events', 1, CalendarDays),
      sightsIntroKey: 'region_sights_intro_example',
      sightExamples: getDefaultExamples('zagreb', 'sights', 2, LandmarkIcon),
    },
    'lika-gorski-kotar': { // Slug: lika-gorski-kotar
      heroImageUrl: `${gcsBaseUrl}regions/lika_gorski_kotar/Velebit_snow_light.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/lika_gorski_kotar/Plitvice_lakes_waterfalls.jpg`, `${gcsBaseUrl}regions/lika_gorski_kotar/Risnjak_national_park_forest.jpg`],
      color1: '#228B22', color2: '#40E0D0', // ForestGreen, Turquoise
      transportIntroKey: 'region_transport_intro_example',
      transportDetails: getDefaultTransportDetails('lika_gorski_kotar'),
      accommodationIntroKey: 'region_accommodation_intro_example',
      accommodationExamples: getDefaultExamples('lika_gorski_kotar', 'accommodation', 2, BedDouble),
      foodIntroKey: 'region_food_intro_example',
      foodExamples: getDefaultExamples('lika_gorski_kotar', 'food', 2, Utensils),
      activitiesIntroKey: 'region_activities_intro_example',
      activityExamples: getDefaultExamples('lika_gorski_kotar', 'activities', 2, Bike),
      eventsIntroKey: 'region_events_intro_example',
      eventExamples: getDefaultExamples('lika_gorski_kotar', 'events', 1, CalendarDays),
      sightsIntroKey: 'region_sights_intro_example',
      sightExamples: getDefaultExamples('lika_gorski_kotar', 'sights', 2, LandmarkIcon),
    },
    'kvarner': {
      heroImageUrl: `${gcsBaseUrl}regions/kvarner/Rijeka_grad.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/kvarner/Opatija_lungomare.jpg`, `${gcsBaseUrl}regions/kvarner/Krk_bridge_view.jpg`],
      color1: '#009688', color2: '#CFD8DC', // Teal, BlueGrey
      transportIntroKey: 'region_transport_intro_example',
      transportDetails: [
        ...getDefaultTransportDetails('kvarner'),
        { typeKey: 'transport_type_boat', detailsKey: 'transport_kvarner_boat_details', icon: Sailboat }, // Added boat transport
      ],
      accommodationIntroKey: 'region_accommodation_intro_example',
      accommodationExamples: getDefaultExamples('kvarner', 'accommodation', 2, BedDouble),
      foodIntroKey: 'region_food_intro_example',
      foodExamples: getDefaultExamples('kvarner', 'food', 2, Utensils),
      activitiesIntroKey: 'region_activities_intro_example',
      activityExamples: getDefaultExamples('kvarner', 'activities', 2, Bike),
      eventsIntroKey: 'region_events_intro_example',
      eventExamples: getDefaultExamples('kvarner', 'events', 1, CalendarDays),
      sightsIntroKey: 'region_sights_intro_example',
      sightExamples: getDefaultExamples('kvarner', 'sights', 2, LandmarkIcon),
    }
  };

  const regionSpecificData = regionsDatabase[lowerSlug];

  if (regionSpecificData) {
    // Construct the full RegionData object, ensuring all keys are present
    // The baseKey will generate nameKey, titleKey, descriptionKey, longDescriptionKey
    // e.g., for 'istra', baseKey is 'region_istra'
    // nameKey becomes 'region_istra'
    // titleKey becomes 'region_istra_page_title'
    // descriptionKey becomes 'region_istra_description_detailed'
    // longDescriptionKey becomes 'region_istra_long_description'
    return {
      id: lowerSlug,
      nameKey: baseKey,
      titleKey: `${baseKey}_page_title`,
      descriptionKey: `${baseKey}_description_detailed`,
      longDescriptionKey: `${baseKey}_long_description`, // This key is used for the "About" section
      ...regionSpecificData, // Spread the specific data for the region
    } as RegionData; // Type assertion
  }

  console.warn(`[getRegionDataBySlug] No data found for slug: '${slug}'`);
  return null;
}

interface PageAsyncProps {
  params: Promise<ResolvedPageParams>;
  searchParams?: Promise<ResolvedSearchParams>;
}

// --- Reusable Transportation Card Component ---
interface TransportationCardProps {
  icon: LucideIcon;
  typeKey: string;
  detailsKey: string;
  primaryColor?: string;
  t: TFunction<[typeof defaultNS, 'regions'], undefined>;
  linkTo?: string; // Optional link for transport card
  locale: Locale; // Pass locale for Link component
}

const TransportationCard: React.FC<TransportationCardProps> = ({
  icon: IconComponent,
  typeKey,
  detailsKey,
  primaryColor,
  t,
  linkTo,
  locale,
}) => {
  const iconStyle = primaryColor ? { color: primaryColor } : {};
  const borderStyle = primaryColor ? { borderColor: primaryColor } : {};

  const cardContent = (
    <div 
      className="bg-card text-card-foreground p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 flex flex-col h-full"
      style={borderStyle}
    >
      <div className="flex items-center mb-3">
        <IconComponent className="w-7 h-7 mr-3 shrink-0" style={iconStyle} />
        <h3 className="font-semibold text-lg" style={iconStyle}>
          {t(typeKey, { ns: 'regions' })}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-grow">
        {t(detailsKey, { ns: 'regions' })}
      </p>
    </div>
  );

  if (linkTo) {
    return (
      <Link href={`/${locale}${linkTo.startsWith('/') ? linkTo : `/${linkTo}`}`} passHref legacyBehavior>
        <a className="block h-full">{cardContent}</a>
      </Link>
    );
  }

  return cardContent;
};

// Main Region Page Component (Server Component)
export default async function RegionSlugPage(props: PageAsyncProps) {
  const resolvedParams = await props.params;
  const resolvedSearchParams = props.searchParams ? await props.searchParams : {};

  if (Object.keys(resolvedSearchParams).length > 0) {
    console.log('[RegionSlugPage] Search Params:', resolvedSearchParams);
  }

  const { locale: localeParamFromParams, slug } = resolvedParams;

  let effectiveLocale: Locale;
  if (localeParamFromParams && appLocalesStringArray.includes(localeParamFromParams as Locale)) {
    effectiveLocale = localeParamFromParams as Locale;
  } else {
    console.warn(`[regions/${slug}/page.tsx] - Invalid or unsupported locale '${localeParamFromParams}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
  }

  const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']);
  const regionData = await getRegionDataBySlug(slug, effectiveLocale);

  if (!regionData) {
    console.error(`[regions/${slug}/page.tsx] No data for slug '${slug}'. Rendering 404.`);
    notFound();
  }

  const heroGradientStyle = {
    backgroundImage: `linear-gradient(to top, ${regionData.color1}BF 0%, ${regionData.color1}80 25%, ${regionData.color2}33 60%, transparent 100%)`,
  };
  const primaryRegionColorText = { color: regionData.color1 };

  // Helper function to render sections with multiple cards (e.g., accommodation, food)
  const renderSectionWithCards = (
    sectionTitleKey: string,
    introKey: string | undefined,
    items: Array<ExampleItem> | undefined,
    iconColor?: string
  ) => {
    if (!items || items.length === 0) {
      // If there are no items, but there is an intro key, still render the title and intro
      if (!introKey) return null;
      return (
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left" style={primaryRegionColorText}>
            {t(sectionTitleKey, { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
          </h2>
          <p className="text-muted-foreground mb-8 text-center md:text-left">
            {t(introKey, { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
          </p>
        </section>
      );
    }

    return (
      <section className="mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left" style={primaryRegionColorText}>
          {t(sectionTitleKey, { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
        </h2>
        {introKey && (
          <p className="text-muted-foreground mb-8 text-center md:text-left">
            {t(introKey, { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, index) => {
            const cardItemContent = (
              <div
                className="bg-card text-card-foreground p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 flex flex-col h-full"
                style={{ borderColor: iconColor || regionData.color1 }}
              >
                <item.icon className="w-8 h-8 mb-3" style={{ color: iconColor || regionData.color1 }} />
                <h3 className="font-bold text-xl mb-2">{t(item.nameKey, { ns: 'regions' })}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{t(item.descriptionKey, { ns: 'regions' })}</p>
              </div>
            );

            if (item.linkTo) {
              return (
                <Link key={index} href={`/${effectiveLocale}${item.linkTo.startsWith('/') ? item.linkTo : `/${item.linkTo}`}`} passHref legacyBehavior>
                  <a className="block h-full">{cardItemContent}</a>
                </Link>
              );
            }
            return <div key={index} className="h-full">{cardItemContent}</div>;
          })}
        </div>
      </section>
    );
  };
  
  // Updated helper function for Transport section using TransportationCard
  const renderTransportSection = () => {
    if (!regionData.transportDetails || regionData.transportDetails.length === 0) {
        // If no transport details, but there is an intro key, render title and intro
        if (!regionData.transportIntroKey) return null;
        return (
            <section className="mb-12 md:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left" style={primaryRegionColorText}>
                {t('region_transport_title', { ns: 'regions' })}
                </h2>
                <p className="text-muted-foreground mb-8 text-center md:text-left">
                {t(regionData.transportIntroKey, { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
                </p>
            </section>
        );
    }
    return (
      <section className="mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left" style={primaryRegionColorText}>
          {t('region_transport_title', { ns: 'regions' })}
        </h2>
        {regionData.transportIntroKey && (
          <p className="text-muted-foreground mb-8 text-center md:text-left">
            {t(regionData.transportIntroKey, { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {regionData.transportDetails.map((item, index) => (
            <TransportationCard
              key={index}
              icon={item.icon}
              typeKey={item.typeKey}
              detailsKey={item.detailsKey}
              primaryColor={regionData.color1}
              t={t} 
              linkTo={item.linkTo}
              locale={effectiveLocale}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="animate-fadeIn bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[450px] md:h-[70vh] lg:h-[75vh] text-white overflow-hidden group">
        <Image
          src={regionData.heroImageUrl}
          alt={t(regionData.nameKey, { ns: defaultNS })} // Alt text uses the general region name from defaultNS
          fill
          style={{ objectFit: 'cover' }}
          priority
          className="brightness-70 group-hover:brightness-75 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={heroGradientStyle} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-center">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 md:mb-4 tracking-tight leading-tight"
            style={{ textShadow: `0 2px 10px ${regionData.color2 === '#F8F8FF' || regionData.color2 === '#FFFAF0' || regionData.color2 === '#EAE0D5' || regionData.color2 === '#CFD8DC' ? 'rgba(0,0,0,0.5)' : regionData.color2}` }}
          >
            {/* Title uses region-specific titleKey from 'regions' namespace, falls back to nameKey from defaultNS */}
            {t(regionData.titleKey, { ns: 'regions', defaultValue: t(regionData.nameKey, { ns: defaultNS }) })}
          </h1>
          <p 
            className="text-lg md:text-xl lg:text-2xl max-w-3xl mt-2"
            style={{ textShadow: `0 1px 6px ${regionData.color2 === '#F8F8FF' || regionData.color2 === '#FFFAF0' || regionData.color2 === '#EAE0D5' || regionData.color2 === '#CFD8DC' ? 'rgba(0,0,0,0.4)' : regionData.color2}` }}
          >
            {/* Description uses region-specific descriptionKey from 'regions' namespace */}
            {t(regionData.descriptionKey, { ns: 'regions' })}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* About Section - uses longDescriptionKey */}
        {regionData.longDescriptionKey && (
          <section aria-labelledby="about-region-heading" className="mb-12 md:mb-16">
            <h2 id="about-region-heading" className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center md:text-left" style={primaryRegionColorText}>
              {/* "About region" title, uses regionName from defaultNS */}
              {t('region_about_title', { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
              {/* Long description is split into paragraphs */}
              {t(regionData.longDescriptionKey, { ns: 'regions' }).split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* Dynamically rendered sections */}
        {renderTransportSection()}
        {renderSectionWithCards('region_accommodation_title', regionData.accommodationIntroKey, regionData.accommodationExamples, regionData.color1)}
        {renderSectionWithCards('region_food_title', regionData.foodIntroKey, regionData.foodExamples, regionData.color1)}
        {renderSectionWithCards('region_activities_title', regionData.activitiesIntroKey, regionData.activityExamples, regionData.color1)}
        {renderSectionWithCards('region_events_title', regionData.eventsIntroKey, regionData.eventExamples, regionData.color1)}
        {renderSectionWithCards('region_sights_title', regionData.sightsIntroKey, regionData.sightExamples, regionData.color1)}

        {/* Gallery Section */}
        {regionData.galleryImageUrls && regionData.galleryImageUrls.length > 0 && (
          <section aria-labelledby="gallery-heading" className="mt-12 md:mt-16 mb-12 md:mb-16">
            <h2 id="gallery-heading" className="text-3xl md:text-4xl font-bold mb-8 text-center" style={primaryRegionColorText}>
              {t('region_gallery_title', { ns: 'regions' })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {regionData.galleryImageUrls.map((imageUrl, index) => (
                <div key={index} className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-lg group hover:shadow-2xl transition-shadow duration-300">
                  <Image
                    src={imageUrl}
                    alt={`${t(regionData.nameKey, { ns: defaultNS })} - ${t('gallery_image_alt_text_prefix', { ns: 'regions', index: index + 1 })}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Back to Explore Button */}
        <section className="text-center mt-12 md:mt-16 py-8">
           <Link // Changed from <a> to <Link> for Next.js navigation
            href={`/${effectiveLocale}/explore`}
            className="inline-block bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background font-semibold py-3 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
          >
            {t('region_back_to_explore_button', { ns: 'regions' })}
          </Link>
        </section>
      </main>
    </div>
  );
}

// --- Metadata and Static Page Generation ---
interface MetadataAsyncProps {
  params: Promise<ResolvedPageParams>;
  searchParams?: Promise<ResolvedSearchParams>;
}

export async function generateMetadata(
  props: MetadataAsyncProps,
  _parent: ResolvingMetadata // _parent can be used to access parent metadata
): Promise<Metadata> {
  const resolvedParams = await props.params;

  const { locale: localeParam, slug } = resolvedParams;
  const effectiveLocale = appLocalesStringArray.includes(localeParam as Locale) 
    ? localeParam as Locale 
    : fallbackLng;

  const regionData = await getRegionDataBySlug(slug, effectiveLocale);
  const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']);

  if (!regionData) {
    return {
      // Fallback title if region data is not found
      title: t('common_not_found_title', { ns: defaultNS }),
    };
  }

  // Generate title and description using i18n
  // DefaultValue for titleKey uses nameKey from defaultNS if titleKey is not found in 'regions'
  const title = t(regionData.titleKey, { ns: 'regions', defaultValue: t(regionData.nameKey, { ns: defaultNS }) });
  const description = t(regionData.descriptionKey, { ns: 'regions' });
  const siteName = t('site_name', { ns: defaultNS, defaultValue: 'Croatia360' });

  return {
    title: `${title} | ${siteName}`,
    description: description,
    themeColor: regionData.color1, // Use primary color for theme
    openGraph: {
      title: `${title} | ${siteName}`,
      description: description,
      images: [
        {
          url: regionData.heroImageUrl,
          width: 1200,
          height: 630,
          alt: title, // Use generated title for alt text
        },
        // Optionally add more images for Open Graph
        ...(regionData.galleryImageUrls?.slice(0, 2).map(url => ({ url })) || [])
      ],
      url: `https://www.croatia360.hr/${effectiveLocale}/regions/${slug}`, // Ensure this URL is correct
      type: 'article', // More specific type for content pages
      siteName: siteName,
      locale: effectiveLocale, // Add locale to Open Graph data
      // Consider adding article-specific OG tags if applicable (e.g., published_time, author)
    },
    // Add Twitter card metadata for better sharing on Twitter
    twitter: {
        card: "summary_large_image",
        title: `${title} | ${siteName}`,
        description: description,
        images: [regionData.heroImageUrl], // Ensure this is a direct URL to the image
    },
    // Add canonical URL to prevent duplicate content issues
    alternates: {
        canonical: `https://www.croatia360.hr/${effectiveLocale}/regions/${slug}`,
        languages: {
            ...Object.fromEntries(appLocalesStringArray.map(loc => [loc, `https://www.croatia360.hr/${loc}/regions/${slug}`])),
            'x-default': `https://www.croatia360.hr/${fallbackLng}/regions/${slug}`,
        }
    },
  };
}

// Generates static paths for all regions and locales during build time
export async function generateStaticParams(): Promise<Array<ResolvedPageParams>> {
  const regionSlugs = ['slavonija', 'dalmacija', 'istra', 'sredisnja-hrvatska', 'zagreb', 'lika-gorski-kotar', 'kvarner'];
  const locales = appLocalesStringArray as readonly string[]; // All supported locales

  // Create a flat array of all locale/slug combinations
  return locales.flatMap(locale =>
    regionSlugs.map(slug => ({
      locale,
      slug,
    }))
  );
}
