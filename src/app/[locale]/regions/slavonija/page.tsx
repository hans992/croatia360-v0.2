// src/app/[locale]/regions/[slug]/page.tsx

// Essential imports for Next.js, React, and i18n
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getServerTranslations } from '@/lib/i18n/server'; // For server-side translations
import { defaultNS, fallbackLng, type Locale, locales as appLocalesStringArray } from '@/lib/i18n/settings';

// Placeholder for fetching region-specific data
// In a real application, this would fetch data from a CMS or database based on the slug
interface RegionData {
  id: string;
  nameKey: string; // Key for localized name
  titleKey: string; // Key for localized page title
  descriptionKey: string; // Key for localized detailed description
  longDescriptionKey?: string; // Key for a longer, more detailed description
  heroImageUrl: string;
  galleryImageUrls?: string[];
  // Add other relevant fields: points of interest, cultural heritage, activities, gastronomy, etc.
  // Example:
  // pointsOfInterest: Array<{ nameKey: string; descriptionKey: string; imageUrl?: string; slug: string; }>;
  // events: Array<{ nameKey: string; date: string; descriptionKey: string; slug: string; }>;
}

// Props for the page component
interface RegionPageProps {
  params: {
    locale: string;
    slug: string; // The slug for the region, e.g., "slavonija"
  };
}

// Base URL for images - consistent with other pages
const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

// --- Mock Data Fetching Function ---
// This function simulates fetching data for a specific region
// TODO: Replace with actual data fetching logic (CMS, Database, API)
async function getRegionData(slug: string, locale: Locale): Promise<RegionData | null> {
  // Using the 'locale' parameter to avoid ESLint error, e.g., by logging it.
  // In a real scenario, 'locale' would be used to fetch localized content.
  console.log(`[getRegionData] Fetching data for slug: '${slug}', locale: '${locale}'`);

  // Simulating data for Slavonija
  if (slug === 'slavonija') {
    return {
      id: 'slavonija',
      nameKey: 'region_slavonija', // From your explore page data
      titleKey: 'region_slavonija_page_title', // e.g., "Otkrijte Slavoniju"
      descriptionKey: 'region_slavonija_description_detailed', // Placeholder for a more detailed description
      longDescriptionKey: 'region_slavonija_long_description', // Even more details
      heroImageUrl: `${gcsBaseUrl}regions/slavonija/Slavonija_Hero.jpg`, // Example: specific path for region hero images
      galleryImageUrls: [
        `${gcsBaseUrl}regions/slavonija/Slavonija_Gallery_1.jpg`,
        `${gcsBaseUrl}regions/slavonija/Slavonija_Gallery_2.jpg`,
        `${gcsBaseUrl}regions/slavonija/Slavonija_Gallery_3.jpg`,
        // Add more gallery images
      ],
      // pointsOfInterest: [
      //   { nameKey: 'poi_osijek_tvrdja', descriptionKey: 'poi_osijek_tvrdja_desc', imageUrl: `${gcsBaseUrl}Osijek_Tvrdja.jpg`, slug: 'osijek-tvrdja'},
      //   { nameKey: 'poi_kutjevacki_podrumi', descriptionKey: 'poi_kutjevacki_podrumi_desc', imageUrl: `${gcsBaseUrl}Kutjevo_Vino.jpg`, slug: 'kutjevacki-podrumi'},
      // ]
    };
  }
  // Add other regions here or implement a more dynamic fetching mechanism
  // if (slug === 'istra') { ... }
  return null; // Region not found
}

// --- Region Page Server Component ---
export default async function RegionPage({ params }: RegionPageProps) {
  const { locale: localeParam, slug } = params;

  // Validate locale
  let effectiveLocale: Locale;
  if (localeParam && appLocalesStringArray.includes(localeParam as Locale)) {
    effectiveLocale = localeParam as Locale;
  } else {
    console.warn(`[regions/${slug}/page.tsx] - Invalid or unsupported locale '${localeParam}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
    // Optionally redirect to a valid locale or show a specific error
    // For now, we proceed with the fallback locale
  }

  // Fetch translations
  // Ensure you have a 'regions.json' (and for other locales) in your public/locales/<locale>/ folder
  const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']);

  // Fetch data for the region, now passing 'effectiveLocale' which will be used in getRegionData
  const regionData = await getRegionData(slug, effectiveLocale);

  // If no data is found for the slug, return a 404 page
  if (!regionData) {
    notFound();
  }

  // --- Render Page ---
  return (
    <div className="animate-fadeIn"> {/* Using a simple fadeIn animation from globals.css if defined, or Tailwind's own */}
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] md:h-[70vh] text-white">
        <Image
          src={regionData.heroImageUrl}
          alt={t(regionData.nameKey)} // Alt text from localized region name
          layout="fill"
          objectFit="cover"
          priority // Prioritize loading of the hero image
          className="brightness-75" // Adjust brightness for text readability
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 p-4 md:p-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
            {t(regionData.titleKey, { defaultValue: t(regionData.nameKey) })}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl">
            {t(regionData.descriptionKey)}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction/About the Region */}
        {regionData.longDescriptionKey && (
          <section aria-labelledby="about-region-heading" className="mb-12">
            <h2 id="about-region-heading" className="text-3xl font-bold text-primary mb-6">
              {t('region_about_title', { regionName: t(regionData.nameKey) })}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90"> {/* Tailwind Typography for nice text styling */}
              {/* Split by newlines if your translation string contains them, or use a dedicated component for rich text */}
              {t(regionData.longDescriptionKey).split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section (if images are available) */}
        {regionData.galleryImageUrls && regionData.galleryImageUrls.length > 0 && (
          <section aria-labelledby="gallery-heading" className="mb-12">
            <h2 id="gallery-heading" className="text-3xl font-bold text-primary mb-8 text-center">
              {t('region_gallery_title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {regionData.galleryImageUrls.map((imageUrl, index) => (
                <div key={index} className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-lg group"> {/* Changed aspect ratio slightly */}
                  <Image
                    src={imageUrl}
                    alt={`${t(regionData.nameKey)} - ${t('gallery_image_alt_text_prefix', { index: index + 1 })}`}
                    layout="fill"
                    objectFit="cover"
                    className="transform transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Example sizes for optimization
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Placeholder for Points of Interest, Activities, Gastronomy etc. */}
        {/* These would likely be separate components or sections */}
        <section aria-labelledby="discover-more-heading" className="mb-12">
          <h2 id="discover-more-heading" className="text-3xl font-bold text-primary mb-8 text-center">
            {t('region_discover_more_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Card - TODO: Create a reusable Card component for these items */}
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-card hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-bold text-xl mb-2">{t('region_poi_title_example')}</h3>
              <p className="text-sm text-muted-foreground">{t('region_poi_description_example')}</p>
            </div>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-card hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-bold text-xl mb-2">{t('region_gastronomy_title_example')}</h3>
              <p className="text-sm text-muted-foreground">{t('region_gastronomy_description_example')}</p>
            </div>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-card hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-bold text-xl mb-2">{t('region_activities_title_example')}</h3>
              <p className="text-sm text-muted-foreground">{t('region_activities_description_example')}</p>
            </div>
          </div>
        </section>

        {/* Call to action or link back to explore page */}
        <section className="text-center mt-12 py-8">
           <a // Using <a> tag for simplicity, could be <Link> from next/link as well
            href={`/${effectiveLocale}/explore`}
            className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-semibold py-3 px-8 rounded-lg shadow-button transition-colors"
          >
            {t('region_back_to_explore_button')}
          </a>
        </section>
      </main>
    </div>
  );
}

// --- Optional: Metadata Generation ---
// (Keep this commented out or implement fully if needed)
// import type { Metadata, ResolvingMetadata } from 'next';
//
// export async function generateMetadata(
//   { params }: RegionPageProps,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const { locale: localeParam, slug } = params;
//   const effectiveLocale = appLocalesStringArray.includes(localeParam as Locale) ? localeParam as Locale : fallbackLng;
//   const regionData = await getRegionData(slug, effectiveLocale);
//   const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']);

//   if (!regionData) {
//     return {
//       title: t('common_not_found_title', { ns: defaultNS }),
//     };
//   }

//   const title = t(regionData.titleKey, { defaultValue: t(regionData.nameKey) });
//   const description = t(regionData.descriptionKey);
//   const siteName = t('site_name', { ns: defaultNS }); // Assuming you have a site_name in your defaultNS

//   return {
//     title: `${title} | ${siteName}`,
//     description: description,
//     openGraph: {
//       title: `${title} | ${siteName}`,
//       description: description,
//       images: [
//         {
//           url: regionData.heroImageUrl,
//           width: 1200,
//           height: 630,
//           alt: title,
//         },
//       ],
//       url: `https://www.croatia360.hr/${effectiveLocale}/regions/${slug}`, // Replace with your actual domain
//       type: 'article',
//       siteName: siteName,
//     },
//     // twitter: { // Example for Twitter Card
//     //   card: 'summary_large_image',
//     //   title: `${title} | ${siteName}`,
//     //   description: description,
//     //   images: [regionData.heroImageUrl],
//     // },
//   };
// }

// --- Optional: Static Site Generation (SSG) for Regions ---
// (Keep this commented out or implement if needed)
// export async function generateStaticParams() {
//   // Example: Define slugs for regions you want to pre-render
//   const regionSlugs = ['slavonija', 'dalmacija', 'istra', 'sredisnja-hrvatska', 'zagreb', 'lika-gorski-kotar'];
//   const locales = appLocalesStringArray;

//   return locales.flatMap(locale =>
//     regionSlugs.map(slug => ({
//       locale,
//       slug,
//     }))
//   );
// }