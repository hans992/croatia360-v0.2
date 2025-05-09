// src/app/[locale]/regions/[slug]/page.tsx

// Essential imports for Next.js, React, and i18n
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getServerTranslations } from '@/lib/i18n/server';
import { defaultNS, fallbackLng, type Locale, locales as appLocalesStringArray } from '@/lib/i18n/settings';
import type { Metadata, ResolvingMetadata } from 'next';
// Import Lucide icons if you plan to use them for POI/Gastronomy/Activities cards
// import { Landmark, Utensils, Sparkles } from 'lucide-react';

// Interface for the data structure of a region
interface RegionData {
  id: string;
  nameKey: string; // Translation key for the region's name (from common.json)
  titleKey: string; // Translation key for the page title (from regions.json)
  descriptionKey: string; // Translation key for the hero description (from regions.json)
  longDescriptionKey?: string; // Translation key for the detailed "About" text (from regions.json)
  heroImageUrl: string;
  galleryImageUrls?: string[];
  color1: string; // Primary color for the region
  color2: string; // Secondary color for the region
  // Future additions:
  // pointsOfInterest: Array<{ nameKey: string; descriptionKey: string; imageUrl?: string; slug: string; }>;
  // events: Array<{ nameKey: string; date: string; descriptionKey: string; slug: string; }>;
}

// Define the structure of resolved params for this dynamic page
interface ResolvedPageParams {
  locale: string;
  slug: string; // slug is now a dynamic part of the path
}

// Define the structure of resolved searchParams
interface ResolvedSearchParams {
  [key: string]: string | string[] | undefined;
}

// Base URL for images - consistent with other pages
const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

// --- Mock Data Fetching Function for a REGION based on SLUG ---
// In a real application, this would fetch data from a CMS, database, or a dedicated API
async function getRegionDataBySlug(slug: string, locale: Locale): Promise<RegionData | null> {
  console.log(`[getRegionDataBySlug] Fetching data for dynamic slug: '${slug}', locale: '${locale}'`);

  // Mock database of regions. Ensure image paths are correct and images exist.
  // Colors are taken from your explore/page.tsx for consistency.
  const regionsDatabase: Record<string, Omit<RegionData, 'id' | 'nameKey' | 'titleKey' | 'descriptionKey' | 'longDescriptionKey'>> = {
    'slavonija': {
      heroImageUrl: `${gcsBaseUrl}regions/slavonija/Slavonija_Hero.jpg`, // Example: croatia360/images/regions/slavonija/Slavonija_Hero.jpg
      galleryImageUrls: [
        `${gcsBaseUrl}regions/slavonija/Slavonija_Gallery_1.jpg`,
        `${gcsBaseUrl}regions/slavonija/Slavonija_Gallery_2.jpg`,
        `${gcsBaseUrl}regions/slavonija/Slavonija_Gallery_3.jpg`,
      ],
      color1: '#FFD700', // Gold
      color2: '#8B4513', // SaddleBrown
    },
    'dalmacija': {
      heroImageUrl: `${gcsBaseUrl}regions/dalmacija/Dalmacija_Hero.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/dalmacija/Dalmacija_Gallery_1.jpg`],
      color1: '#007FFF', // Azure
      color2: '#F8F8FF', // GhostWhite
    },
    'istra': {
      heroImageUrl: `${gcsBaseUrl}regions/istra/Istria_Hero.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/istra/Istria_Gallery_1.jpg`],
      color1: '#E07A5F', // Terra Cotta
      color2: '#808000', // Olive
    },
    'sredisnja-hrvatska': { // Assuming slug is 'sredisnja-hrvatska'
      heroImageUrl: `${gcsBaseUrl}regions/sredisnja_hrvatska/Sredisnja_Hero.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/sredisnja_hrvatska/Sredisnja_Gallery_1.jpg`],
      color1: '#800020', // Burgundy
      color2: '#2E8B57', // SeaGreen
    },
    'zagreb': {
      heroImageUrl: `${gcsBaseUrl}regions/zagreb/Zagreb_Hero.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/zagreb/Zagreb_Gallery_1.jpg`],
      color1: '#004C99', // ZG Blue
      color2: '#D2B48C', // Tan
    },
    'lika-gorski-kotar': { // Assuming slug is 'lika-gorski-kotar'
      heroImageUrl: `${gcsBaseUrl}regions/lika_gorski_kotar/Lika_Gorski_Kotar_Hero.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/lika_gorski_kotar/Lika_Gorski_Kotar_Gallery_1.jpg`],
      color1: '#228B22', // ForestGreen
      color2: '#40E0D0', // Turquoise
    },
    'kvarner': { // Added Kvarner as an example
      heroImageUrl: `${gcsBaseUrl}regions/kvarner/Kvarner_Hero.jpg`,
      galleryImageUrls: [`${gcsBaseUrl}regions/kvarner/Kvarner_Gallery_1.jpg`],
      color1: '#1E90FF', // DodgerBlue
      color2: '#FFFAF0', // FloralWhite
    }
  };

  const regionSpecificData = regionsDatabase[slug.toLowerCase()]; // Ensure slug matching is case-insensitive

  if (regionSpecificData) {
    // Construct translation keys based on the slug
    // This assumes your keys in regions.json will follow this pattern
    const baseKey = `region_${slug.replace(/-/g, '_')}`;
    return {
      id: slug,
      nameKey: baseKey, // This key should exist in common.json (e.g., "region_slavonija")
      titleKey: `${baseKey}_page_title`, // e.g., "region_slavonija_page_title" (from regions.json)
      descriptionKey: `${baseKey}_description_detailed`, // (from regions.json)
      longDescriptionKey: `${baseKey}_long_description`, // (from regions.json)
      ...regionSpecificData
    } as RegionData;
  }

  console.warn(`[getRegionDataBySlug] No data found for slug: '${slug}'`);
  return null;
}

// Props for the Page component, with params and searchParams as Promises
interface PageAsyncProps {
  params: Promise<ResolvedPageParams>;
  searchParams?: Promise<ResolvedSearchParams>;
}

// --- Region Page Server Component ---
export default async function RegionSlugPage(props: PageAsyncProps) {
  // Await the promises to get the actual params and searchParams
  const resolvedParams = await props.params;
  const resolvedSearchParams = props.searchParams ? await props.searchParams : {};

  // "Use" searchParams to satisfy ESLint if not actively used for logic
  if (Object.keys(resolvedSearchParams).length > 0) {
    console.log('[RegionSlugPage] Search Params:', resolvedSearchParams);
  }

  const { locale: localeParamFromParams, slug } = resolvedParams;

  // Validate and determine the effective locale
  let effectiveLocale: Locale;
  if (localeParamFromParams && appLocalesStringArray.includes(localeParamFromParams as Locale)) {
    effectiveLocale = localeParamFromParams as Locale;
  } else {
    console.warn(`[regions/${slug}/page.tsx] - Invalid or unsupported locale '${localeParamFromParams}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
  }

  // Load translations from defaultNS (e.g., 'common') and 'regions' namespace
  const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']);
  const regionData = await getRegionDataBySlug(slug, effectiveLocale);

  // If no data is found for the slug, render a 404 page
  if (!regionData) {
    console.error(`[regions/${slug}/page.tsx] No data returned by getRegionDataBySlug for slug '${slug}'. Rendering 404.`);
    notFound();
  }

  // Dynamic style for the hero section gradient using regional colors
  const heroGradientStyle = {
    backgroundImage: `linear-gradient(to top, ${regionData.color1}BF 0%, ${regionData.color1}80 25%, ${regionData.color2}33 60%, transparent 100%)`,
  };

  // Style for primary text elements using the region's main color
  const primaryRegionColorText = { color: regionData.color1 };

  return (
    <div className="animate-fadeIn bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[450px] md:h-[70vh] lg:h-[75vh] text-white overflow-hidden">
        <Image
          src={regionData.heroImageUrl}
          alt={t(regionData.nameKey, { ns: defaultNS })} // Name key from common.json
          fill
          style={{ objectFit: 'cover' }}
          priority // Important for LCP
          className="brightness-70 group-hover:brightness-75 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={heroGradientStyle}
        />
        {/* Hero Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-center">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-3 md:mb-4 tracking-tight leading-tight"
            style={{ textShadow: `0 2px 10px ${regionData.color2 === '#F8F8FF' || regionData.color2 === '#FFFAF0' ? 'rgba(0,0,0,0.5)' : regionData.color2}` }} // Darker shadow for light secondary colors
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

      {/* Main Content Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* About the Region Section */}
        {regionData.longDescriptionKey && (
          <section aria-labelledby="about-region-heading" className="mb-12 md:mb-16">
            <h2
              id="about-region-heading"
              className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center md:text-left"
              style={primaryRegionColorText}
            >
              {t('region_about_title', { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
              {t(regionData.longDescriptionKey, { ns: 'regions' }).split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {regionData.galleryImageUrls && regionData.galleryImageUrls.length > 0 && (
          <section aria-labelledby="gallery-heading" className="mb-12 md:mb-16">
            <h2
              id="gallery-heading"
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={primaryRegionColorText}
            >
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // For image optimization
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Discover More Section (POI, Gastronomy, Activities) */}
        <section aria-labelledby="discover-more-subheading" className="mb-12 md:mb-16">
          <h2
            id="discover-more-subheading"
            className="text-3xl md:text-4xl font-bold mb-8 text-center"
            style={primaryRegionColorText}
          >
            {t('region_discover_more_title', { ns: 'regions', regionName: t(regionData.nameKey, { ns: defaultNS }) })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { titleKey: 'region_poi_title_example', descriptionKey: 'region_poi_description_example' /* icon: Landmark */ },
              { titleKey: 'region_gastronomy_title_example', descriptionKey: 'region_gastronomy_description_example' /* icon: Utensils */ },
              { titleKey: 'region_activities_title_example', descriptionKey: 'region_activities_description_example' /* icon: Sparkles */ },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-card text-card-foreground p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-l-4"
                style={{ borderColor: regionData.color1 }} // Accent border with primary region color
              >
                {/* Example: <item.icon className="w-8 h-8 mb-3" style={primaryRegionColorText} /> */}
                <h3 className="font-bold text-xl lg:text-2xl mb-2" style={primaryRegionColorText}>
                  {t(item.titleKey, { ns: 'regions' })}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(item.descriptionKey, { ns: 'regions' })}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Explore Button */}
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

// Props for generateMetadata, expecting Promises for params and searchParams
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

  // "Use" searchParams and parent to satisfy ESLint
  if (Object.keys(resolvedSearchParams).length > 0) {
    console.log('[generateMetadata] Search Params:', resolvedSearchParams);
  }
  if (resolvedParent && Object.keys(resolvedParent).length > 0) { // Check if resolvedParent has keys before logging
    console.log('[generateMetadata] Parent Metadata (resolved): Has keys');
  }

  const { locale: localeParam, slug } = resolvedParams;
  const effectiveLocale = appLocalesStringArray.includes(localeParam as Locale) ? localeParam as Locale : fallbackLng;

  const regionData = await getRegionDataBySlug(slug, effectiveLocale);
  const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']);

  if (!regionData) {
    return {
      title: t('common_not_found_title', { ns: defaultNS }), // Key from common.json
    };
  }

  const title = t(regionData.titleKey, { ns: 'regions', defaultValue: t(regionData.nameKey, { ns: defaultNS }) });
  const description = t(regionData.descriptionKey, { ns: 'regions' });
  const siteName = t('site_name', { ns: defaultNS, defaultValue: 'Croatia360' }); // Key from common.json

  return {
    title: `${title} | ${siteName}`,
    description: description,
    // Optionally set theme color based on region's primary color
    // themeColor: regionData.color1, 
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
        // Example of merging images from parent (layout) OpenGraph data
        // ...(resolvedParent.openGraph?.images || []),
      ],
      url: `https://www.croatia360.hr/${effectiveLocale}/regions/${slug}`, // Replace with your actual domain
      type: 'article',
      siteName: siteName,
    },
    // Add other metadata as needed, e.g., Twitter cards
    // twitter: {
    //   card: 'summary_large_image',
    //   title: `${title} | ${siteName}`,
    //   description: description,
    //   images: [regionData.heroImageUrl],
    // },
  };
}

// Function to generate static paths for all regions and locales
export async function generateStaticParams(): Promise<Array<ResolvedPageParams>> {
  // Ensure this list matches the slugs used in `regionsDatabase` and on your explore page
  const regionSlugs = ['slavonija', 'dalmacija', 'istra', 'sredisnja-hrvatska', 'zagreb', 'lika-gorski-kotar', 'kvarner'];
  const locales = appLocalesStringArray as readonly string[]; // Cast to ensure it's treated as a string array

  return locales.flatMap(locale =>
    regionSlugs.map(slug => ({
      locale,
      slug,
    }))
  );
}
