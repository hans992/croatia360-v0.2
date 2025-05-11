// src/app/[locale]/regions/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getServerTranslations } from '@/lib/i18n/server';
import { defaultNS, fallbackLng, type Locale, locales as appLocalesStringArray } from '@/lib/i18n/settings';
import type { Metadata, ResolvingMetadata } from 'next';
import { Plane, Car, Bus, Train, BedDouble, Utensils, Bike, Sailboat, CalendarDays, LandmarkIcon } from 'lucide-react'; // Primjeri ikona

// Interface for the data structure of a region
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
  // Data for new sections (examples, will be expanded)
  transportIntroKey?: string;
  transportDetails?: Array<{ typeKey: string; detailsKey: string; icon: React.ElementType }>;
  accommodationIntroKey?: string;
  accommodationExamples?: Array<{ nameKey: string; descriptionKey: string; icon: React.ElementType }>;
  foodIntroKey?: string;
  foodExamples?: Array<{ nameKey: string; descriptionKey: string; icon: React.ElementType }>;
  activitiesIntroKey?: string;
  activityExamples?: Array<{ nameKey: string; descriptionKey: string; icon: React.ElementType }>;
  eventsIntroKey?: string;
  eventExamples?: Array<{ nameKey: string; descriptionKey: string; icon: React.ElementType }>;
  sightsIntroKey?: string;
  sightExamples?: Array<{ nameKey: string; descriptionKey: string; icon: React.ElementType }>;
}

interface ResolvedPageParams {
  locale: string;
  slug: string;
}

interface ResolvedSearchParams {
  [key: string]: string | string[] | undefined;
}

const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

async function getRegionDataBySlug(slug: string, locale: Locale): Promise<RegionData | null> {
  console.log(`[getRegionDataBySlug] Fetching data for dynamic slug: '${slug}', locale: '${locale}'`);
  const lowerSlug = slug.toLowerCase();
  const baseKey = `region_${lowerSlug.replace(/-/g, '_')}`;

  // Mock database of regions
  const regionsDatabase: Record<string, Partial<Omit<RegionData, 'id' | 'nameKey' | 'titleKey' | 'descriptionKey' | 'longDescriptionKey'>>> = {
    'slavonija': {
      heroImageUrl: `${gcsBaseUrl}regions/slavonija/Slavonski_Brod_fortress.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/slavonija/Osijek_trg_tram_Lovro_Pavlicic.jpg`, `${gcsBaseUrl}regions/slavonija/Kutjevo_wineyard_Perak.jpg`],
      color1: '#FFD700', color2: '#8B4513',
      transportIntroKey: 'region_transport_intro_example',
      transportDetails: [
        { typeKey: 'transport_type_airplane', detailsKey: 'transport_slavonija_airplane_details', icon: Plane },
        { typeKey: 'transport_type_car', detailsKey: 'transport_slavonija_car_details', icon: Car },
        { typeKey: 'transport_type_bus', detailsKey: 'transport_slavonija_bus_details', icon: Bus },
        { typeKey: 'transport_type_train', detailsKey: 'transport_slavonija_train_details', icon: Train },
      ],
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
    
    // Add similar detailed structures for other regions (dalmacija, istra, etc.)
    'dalmacija': {
      heroImageUrl: `${gcsBaseUrl}regions/dalmacija/Zadar_charter_yacht.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/dalmacija/Dubrovnik_srd.jpg`, `${gcsBaseUrl}regions/dalmacija/Makarska_from_the_sea.jpg`],
      color1: '#007FFF', color2: '#F8F8FF',
      transportIntroKey: 'region_transport_intro_example',
      transportDetails: [
        { typeKey: 'transport_type_airplane', detailsKey: 'transport_dalmacija_airplane_details', icon: Plane },
        { typeKey: 'transport_type_car', detailsKey: 'transport_dalmacija_car_details', icon: Car },
        { typeKey: 'transport_type_bus', detailsKey: 'transport_dalmacija_bus_details', icon: Bus },
        { typeKey: 'transport_type_train', detailsKey: 'transport_dalmacija_train_details', icon: Train },
      ],
      accommodationIntroKey: 'region_accommodation_intro_example',
      accommodationExamples: [
        { nameKey: 'accommodation_dalmacija_example_hotel_name', descriptionKey: 'accommodation_dalmacija_example_hotel_desc', icon: BedDouble },
        { nameKey: 'accommodation_dalmacija_example_rural_name', descriptionKey: 'accommodation_dalmacija_example_rural_desc', icon: BedDouble },
      ],
      foodIntroKey: 'region_food_intro_example',
      foodExamples: [
        { nameKey: 'food_dalmacija_pasticada_name', descriptionKey: 'food_dalmacija_pasticada_desc', icon: Utensils },
        { nameKey: 'food_dalmacija_brudet_name', descriptionKey: 'food_dalmacija_brudet_desc', icon: Utensils },
      ],
      activitiesIntroKey: 'region_activities_intro_example',
      activityExamples: [
        { nameKey: 'activities_dalmacija_np_krka_name', descriptionKey: 'activities_dalmacija_np_krka_desc', icon: Bike },
        { nameKey: 'activities_dalmacija_boat_trip_name', descriptionKey: 'activities_slavonija_boat_trip_desc', icon: Sailboat },
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
      color1: '#E07A5F', color2: '#808000',
    },
    'sredisnja-hrvatska': {
      heroImageUrl: `${gcsBaseUrl}regions/sredisnja_hrvatska/Madjerkin_breg_wineyard.jpg`,
      color1: '#800020', color2: '#2E8B57',
    },
    'zagreb': {
      heroImageUrl: `${gcsBaseUrl}regions/zagreb/Zagreb_dron_image.jpg`,
      color1: '#004C99', color2: '#D2B48C',
    },
    'lika-gorski-kotar': {
      heroImageUrl: `${gcsBaseUrl}regions/lika_gorski_kotar/Velebit_snow_light.jpg`,
      color1: '#228B22', color2: '#40E0D0',
    },
    'kvarner': {
      heroImageUrl: `${gcsBaseUrl}regions/kvarner/Rijeka_grad.jpg`,
      color1: '#1E90FF', color2: '#FFFAF0',
    }
  };

  const regionSpecificData = regionsDatabase[lowerSlug];

  if (regionSpecificData) {
    return {
      id: lowerSlug,
      nameKey: baseKey,
      titleKey: `${baseKey}_page_title`,
      descriptionKey: `${baseKey}_description_detailed`,
      longDescriptionKey: `${baseKey}_long_description`,
      ...regionSpecificData,
    } as RegionData;
  }

  console.warn(`[getRegionDataBySlug] No data found for slug: '${slug}'`);
  return null;
}

interface PageAsyncProps {
  params: Promise<ResolvedPageParams>;
  searchParams?: Promise<ResolvedSearchParams>;
}

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
  const primaryRegionBorderColor = { borderColor: regionData.color1 };

  // Helper function to render a section with cards
  const renderSectionWithCards = (
    sectionTitleKey: string,
    introKey: string | undefined,
    items: Array<{ nameKey: string; descriptionKey: string; icon: React.ElementType }> | undefined,
    iconColor?: string
  ) => {
    if (!items || items.length === 0) {
      // If no specific items, show a generic placeholder or hide section
      if (!introKey) return null; // Hide if no intro either
      return (
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left" style={primaryRegionColorText}>
            {t(sectionTitleKey, { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
          </h2>
          <p className="text-muted-foreground mb-8 text-center md:text-left">
            {t(introKey, { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
          </p>
          {/* Optional: Add a generic "Coming soon" or "Explore more with SARA AI" card */}
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
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-l-4"
              style={primaryRegionBorderColor}
            >
              <item.icon className="w-8 h-8 mb-3" style={{ color: iconColor || regionData.color1 }} />
              <h3 className="font-bold text-xl mb-2">{t(item.nameKey, { ns: 'regions' })}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descriptionKey, { ns: 'regions' })}</p>
            </div>
          ))}
        </div>
        {/* Optional: "View More" button linking to a dedicated page for this category */}
        {/* <div className="text-center mt-8">
          <a href={`/${effectiveLocale}/explore?region=${slug}&category=${sectionTitleKey.replace('region_','').replace('_title','')} `} 
             className="text-primary hover:underline" style={primaryRegionColorText}>
            {t('view_more_button', { ns: 'regions' })}
          </a>
        </div> */}
      </section>
    );
  };
  
  // Helper function for Transport section
  const renderTransportSection = () => {
    if (!regionData.transportDetails || regionData.transportDetails.length === 0) return null;
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
        <div className="space-y-6">
          {regionData.transportDetails.map((item, index) => (
            <div key={index} className="bg-card text-card-foreground p-6 rounded-xl shadow-lg border-l-4" style={primaryRegionBorderColor}>
              <div className="flex items-center mb-2">
                <item.icon className="w-7 h-7 mr-3" style={primaryRegionColorText} />
                <h3 className="font-semibold text-xl" style={primaryRegionColorText}>{t(item.typeKey, { ns: 'regions' })}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(item.detailsKey, { ns: 'regions' })}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };


  return (
    <div className="animate-fadeIn bg-background text-foreground">
      <section className="relative h-[60vh] min-h-[450px] md:h-[70vh] lg:h-[75vh] text-white overflow-hidden">
        <Image
          src={regionData.heroImageUrl}
          alt={t(regionData.nameKey, { ns: defaultNS })}
          fill
          style={{ objectFit: 'cover' }}
          priority
          className="brightness-70 group-hover:brightness-75 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={heroGradientStyle} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-center">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 md:mb-4 tracking-tight leading-tight"
            style={{ textShadow: `0 2px 10px ${regionData.color2 === '#F8F8FF' || regionData.color2 === '#FFFAF0' ? 'rgba(0,0,0,0.5)' : regionData.color2}` }}
          >
            {t(regionData.titleKey, { ns: 'regions', defaultValue: t(regionData.nameKey, { ns: defaultNS }) })}
          </h1>
          <p 
            className="text-lg md:text-xl lg:text-2xl max-w-3xl mt-2"
            style={{ textShadow: `0 1px 6px ${regionData.color2 === '#F8F8FF' || regionData.color2 === '#FFFAF0' ? 'rgba(0,0,0,0.4)' : regionData.color2}` }}
          >
            {t(regionData.descriptionKey, { ns: 'regions' })}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {regionData.longDescriptionKey && (
          <section aria-labelledby="about-region-heading" className="mb-12 md:mb-16">
            <h2 id="about-region-heading" className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center md:text-left" style={primaryRegionColorText}>
              {t('region_about_title', { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
              {t(regionData.longDescriptionKey, { ns: 'regions' }).split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {renderTransportSection()}
        
        {renderSectionWithCards('region_accommodation_title', regionData.accommodationIntroKey, regionData.accommodationExamples, regionData.color1)}
        {renderSectionWithCards('region_food_title', regionData.foodIntroKey, regionData.foodExamples, regionData.color1)}
        {renderSectionWithCards('region_activities_title', regionData.activitiesIntroKey, regionData.activityExamples, regionData.color1)}
        {renderSectionWithCards('region_events_title', regionData.eventsIntroKey, regionData.eventExamples, regionData.color1)}
        {renderSectionWithCards('region_sights_title', regionData.sightsIntroKey, regionData.sightExamples, regionData.color1)}

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
        
        {/* TODO: Consider adding a region-specific Chatbot interaction point here */}
        {/* <section className="my-12 md:my-16 text-center p-8 bg-card rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4" style={primaryRegionColorText}>Imate još pitanja o {t(regionData.nameKey, { ns: defaultNS })}?</h3>
          <p className="text-muted-foreground mb-6">{t('region_chatbot_prompt', { ns: 'regions', defaultValue: 'Naš SARA AI asistent spreman je pomoći!' })}</p>
          <Button size="lg" style={{ backgroundColor: regionData.color1, borderColor: regionData.color2 }} className="text-white">
            Pitajte SARA AI
          </Button>
        </section> */}

        <section className="text-center mt-12 md:mt-16 py-8">
           <a
            href={`/${effectiveLocale}/explore`}
            className="inline-block bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background font-semibold py-3 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
          >
            {t('region_back_to_explore_button', { ns: 'regions' })}
          </a>
        </section>
      </main>
    </div>
  );
}

// --- Metadata and Static Params ---
interface MetadataAsyncProps {
  params: Promise<ResolvedPageParams>;
  searchParams?: Promise<ResolvedSearchParams>;
}

export async function generateMetadata(
  props: MetadataAsyncProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await props.params;
  const resolvedSearchParams = props.searchParams ? await props.searchParams : {};
  const resolvedParent = await parent;

  if (Object.keys(resolvedSearchParams).length > 0) {
    console.log('[generateMetadata] Search Params:', resolvedSearchParams);
  }
  if (resolvedParent && Object.keys(resolvedParent).length > 0) {
    console.log('[generateMetadata] Parent Metadata (resolved): Has keys');
  }

  const { locale: localeParam, slug } = resolvedParams;
  const effectiveLocale = appLocalesStringArray.includes(localeParam as Locale) ? localeParam as Locale : fallbackLng;

  const regionData = await getRegionDataBySlug(slug, effectiveLocale);
  const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']);

  if (!regionData) {
    return {
      title: t('common_not_found_title', { ns: defaultNS }),
    };
  }

  const title = t(regionData.titleKey, { ns: 'regions', defaultValue: t(regionData.nameKey, { ns: defaultNS }) });
  const description = t(regionData.descriptionKey, { ns: 'regions' });
  const siteName = t('site_name', { ns: defaultNS, defaultValue: 'Croatia360' });

  return {
    title: `${title} | ${siteName}`,
    description: description,
    themeColor: regionData.color1, // Set browser theme color
    openGraph: {
      title: `${title} | ${siteName}`,
      description: description,
      images: [
        {
          url: regionData.heroImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      url: `https://www.croatia360.hr/${effectiveLocale}/regions/${slug}`, // Replace with your domain
      type: 'article',
      siteName: siteName,
    },
  };
}

export async function generateStaticParams(): Promise<Array<ResolvedPageParams>> {
  const regionSlugs = ['slavonija', 'dalmacija', 'istra', 'sredisnja-hrvatska', 'zagreb', 'lika-gorski-kotar', 'kvarner'];
  const locales = appLocalesStringArray as readonly string[];

  return locales.flatMap(locale =>
    regionSlugs.map(slug => ({
      locale,
      slug,
    }))
  );
}
