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
  // Simulating data for Slavonija
  if (slug === 'slavonija') {
    return {
      id: 'slavonija',
      nameKey: 'region_slavonija', // From your explore page data
      titleKey: 'region_slavonija_page_title', // e.g., "Otkrijte Slavoniju"
      descriptionKey: 'region_slavonija_description_detailed', // Placeholder for a more detailed description
      longDescriptionKey: 'region_slavonija_long_description', // Even more details
      heroImageUrl: `${gcsBaseUrl}Slavonija_Hero.jpg`, // Replace with an actual hero image for Slavonija
      galleryImageUrls: [
        `${gcsBaseUrl}Slavonija_Gallery_1.jpg`,
        `${gcsBaseUrl}Slavonija_Gallery_2.jpg`,
        `${gcsBaseUrl}Slavonija_Gallery_3.jpg`,
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
  if (localeParam && appLocalesStringArray.includes(localeParam)) {
    effectiveLocale = localeParam as Locale;
  } else {
    console.warn(`[regions/${slug}/page.tsx] - Invalid or unsupported locale '${localeParam}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
    // Optionally redirect to a valid locale or show a specific error
    // For now, we proceed with the fallback locale
  }

  // Fetch translations
  const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']); // Add 'regions' namespace if you plan to have region-specific translations

  // Fetch data for the region
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 p-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
            {t(regionData.titleKey, { defaultValue: t(regionData.nameKey) })}
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl">
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
            <div className="prose prose-lg max-w-none text-foreground/90"> {/* Tailwind Typography for nice text styling */}
              {/* Split by newlines if your translation string contains them */}
              {t(regionData.longDescriptionKey).split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
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
                <div key={index} className="relative aspect-video overflow-hidden rounded-lg shadow-lg group">
                  <Image
                    src={imageUrl}
                    alt={`${t(regionData.nameKey)} - ${t('gallery_image_alt_text_prefix')} ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="transform transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Optional: Add a subtle overlay or icon on hover */}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Placeholder for Points of Interest, Activities, Gastronomy etc. */}
        {/* These would likely be separate components or sections */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-secondary mb-6">
            {t('region_discover_more_title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Card - TODO: Create a reusable Card component for these items */}
            <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-xl transition-shadow">
              <h4 className="font-bold text-lg mb-2 text-card-foreground">{t('region_poi_title_example')}</h4>
              <p className="text-sm text-muted-foreground">{t('region_poi_description_example')}</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-xl transition-shadow">
              <h4 className="font-bold text-lg mb-2 text-card-foreground">{t('region_gastronomy_title_example')}</h4>
              <p className="text-sm text-muted-foreground">{t('region_gastronomy_description_example')}</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-xl transition-shadow">
              <h4 className="font-bold text-lg mb-2 text-card-foreground">{t('region_activities_title_example')}</h4>
              <p className
="text-sm text-muted-foreground">{t('region_activities_description_example')}</p>
            </div>
          </div>
        </section>

        {/* Call to action or link back to explore page */}
        <section className="text-center mt-12 py-8">
           <a
            href={`/${effectiveLocale}/explore`}
            className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 px-8 rounded-lg shadow-button transition-colors"
          >
            {t('region_back_to_explore_button')}
          </a>
        </section>
      </main>
    </div>
  );
}

// --- Optional: Metadata Generation ---
// You can generate dynamic metadata for SEO based on the region
// import type { Metadata, ResolvingMetadata } from 'next';

// export async function generateMetadata(
//   { params }: RegionPageProps,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const { locale, slug } = params;
//   const regionData = await getRegionData(slug, locale as Locale); // Cast locale safely after validation
//   const { t } = await getServerTranslations(locale as Locale, [defaultNS, 'regions']);

//   if (!regionData) {
//     return {
//       title: t('common_not_found_title'), // Generic not found title
//     };
//   }

//   const title = t(regionData.titleKey, { defaultValue: t(regionData.nameKey) });
//   const description = t(regionData.descriptionKey);

//   // Optionally fetch and merge parent metadata (e.g., site name)
//   // const previousImages = (await parent).openGraph?.images || []

//   return {
//     title: `${title} | Croatia360`,
//     description: description,
//     openGraph: {
//       title: title,
//       description: description,
//       images: [
//         {
//           url: regionData.heroImageUrl,
//           width: 1200, // Specify image dimensions
//           height: 630,
//           alt: title,
//         },
//         // ...previousImages, // If you want to include parent images
//       ],
//       url: `https://www.croatia360.hr/${locale}/regions/${slug}`, // Replace with your actual domain
//       type: 'article', // or 'website'
//     },
//     // Add other metadata like keywords, canonical URL, etc.
//   };
// }

// --- Optional: Static Site Generation (SSG) for Regions ---
// If your regions don't change often, you can pre-render them at build time.
// export async function generateStaticParams() {
//   const regionSlugs = ['slavonija', 'dalmacija', 'istra']; // Add all your region slugs here
//   const locales = appLocalesStringArray;

//   return locales.flatMap(locale =>
//     regionSlugs.map(slug => ({
//       locale,
//       slug,
//     }))
//   );
// }