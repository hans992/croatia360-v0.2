// src/app/[locale]/regions/slavonija/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getServerTranslations } from '@/lib/i18n/server';
import { defaultNS, fallbackLng, type Locale, locales as appLocalesStringArray } from '@/lib/i18n/settings';
import type { Metadata, ResolvingMetadata } from 'next'; // Import Metadata types if using generateMetadata

interface RegionData {
  id: string;
  nameKey: string;
  titleKey: string;
  descriptionKey: string;
  longDescriptionKey?: string;
  heroImageUrl: string;
  galleryImageUrls?: string[];
}

const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

async function getRegionData(slug: string, locale: Locale): Promise<RegionData | null> {
  console.log(`[getRegionData] Fetching data for slug: '${slug}', locale: '${locale}'`);
  if (slug === 'slavonija') {
    return {
      id: 'slavonija',
      nameKey: 'region_slavonija',
      titleKey: 'region_slavonija_page_title',
      descriptionKey: 'region_slavonija_description_detailed',
      longDescriptionKey: 'region_slavonija_long_description',
      heroImageUrl: `${gcsBaseUrl}regions/slavonija/Slavonija_Hero.jpg`,
      galleryImageUrls: [
        `${gcsBaseUrl}regions/slavonija/Slavonija_Gallery_1.jpg`,
        `${gcsBaseUrl}regions/slavonija/Slavonija_Gallery_2.jpg`,
        `${gcsBaseUrl}regions/slavonija/Slavonija_Gallery_3.jpg`,
      ],
    };
  }
  return null;
}

// Define props for the page component directly as expected by Next.js
interface PageProps {
  params: { locale: string; slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// --- Region Page Server Component ---
// Explicitly type the props according to Next.js App Router conventions
export default async function RegionPage({ params, searchParams }: PageProps) {
  const { locale: localeParamFromParams, slug } = params; // Renamed to avoid conflict if searchParams also had 'locale'

  // Validate locale
  let effectiveLocale: Locale;
  if (localeParamFromParams && appLocalesStringArray.includes(localeParamFromParams as Locale)) {
    effectiveLocale = localeParamFromParams as Locale;
  } else {
    console.warn(`[regions/${slug}/page.tsx] - Invalid or unsupported locale '${localeParamFromParams}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
  }

  const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']);
  const regionData = await getRegionData(slug, effectiveLocale);

  if (!regionData) {
    notFound();
  }

  // --- Render Page ---
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] md:h-[70vh] text-white">
        <Image
          src={regionData.heroImageUrl}
          alt={t(regionData.nameKey)}
          fill // Changed layout="fill" to fill shorthand for Next 13+
          style={{ objectFit: 'cover' }} // style objectFit with fill
          priority
          className="brightness-75"
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
        {regionData.longDescriptionKey && (
          <section aria-labelledby="about-region-heading" className="mb-12">
            <h2 id="about-region-heading" className="text-3xl font-bold text-primary mb-6">
              {t('region_about_title', { regionName: t(regionData.nameKey) })}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
              {t(regionData.longDescriptionKey).split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {regionData.galleryImageUrls && regionData.galleryImageUrls.length > 0 && (
          <section aria-labelledby="gallery-heading" className="mb-12">
            <h2 id="gallery-heading" className="text-3xl font-bold text-primary mb-8 text-center">
              {t('region_gallery_title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {regionData.galleryImageUrls.map((imageUrl, index) => (
                <div key={index} className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-lg group">
                  <Image
                    src={imageUrl}
                    alt={`${t(regionData.nameKey)} - ${t('gallery_image_alt_text_prefix', { index: index + 1 })}`}
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

        <section aria-labelledby="discover-more-heading" className="mb-12">
          <h2 id="discover-more-heading" className="text-3xl font-bold text-primary mb-8 text-center">
            {t('region_discover_more_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <section className="text-center mt-12 py-8">
           <a
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
// Props for generateMetadata should also match Next.js expectations
interface MetadataProps {
  params: { locale: string; slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { params, searchParams }: MetadataProps, // Use the same PageProps structure for consistency
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale: localeParam, slug } = params;
  const effectiveLocale = appLocalesStringArray.includes(localeParam as Locale) ? localeParam as Locale : fallbackLng;

  // Await data fetching
  const regionData = await getRegionData(slug, effectiveLocale);
  const { t } = await getServerTranslations(effectiveLocale, [defaultNS, 'regions']);

  if (!regionData) {
    return {
      title: t('common_not_found_title', { ns: defaultNS }),
    };
  }

  const title = t(regionData.titleKey, { defaultValue: t(regionData.nameKey) });
  const description = t(regionData.descriptionKey);
  const siteName = t('site_name', { ns: defaultNS, defaultValue: 'Croatia360' }); // Assuming you have a site_name in your defaultNS

  return {
    title: `${title} | ${siteName}`,
    description: description,
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
      url: `https://www.croatia360.hr/${effectiveLocale}/regions/${slug}`, // Replace with your actual domain
      type: 'article',
      siteName: siteName,
    },
  };
}

// --- Optional: Static Site Generation (SSG) for Regions ---
export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const regionSlugs = ['slavonija', 'dalmacija', 'istra', 'sredisnja-hrvatska', 'zagreb', 'lika-gorski-kotar'];
  const locales = appLocalesStringArray as readonly string[]; // Cast to readonly string[] if needed

  return locales.flatMap(locale =>
    regionSlugs.map(slug => ({
      locale,
      slug,
    }))
  );
}