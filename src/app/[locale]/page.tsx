// src/app/[locale]/page.tsx
import { getServerTranslations } from '@/lib/i18n/server';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';
import InspireCard from '@/components/InspireCard';
import HomeHero from '@/components/HomeHero';

interface PageParams {
  locale: string;
}

interface PageSearchParams {
  [key: string]: string | string[] | undefined;
}

interface HomePageProps {
  params: Promise<PageParams>;
  searchParams?: Promise<PageSearchParams>;
}

const gcsBaseUrl = "https://storage.googleapis.com/croatiasara2026/images/";
const heroImageUrl = `${gcsBaseUrl}regions/dalmacija/Dubrovnik_wall_tour.jpg`;

const inspirationItems = [
  { titleKey: 'inspiration_beaches_title', descriptionKey: 'inspiration_beaches_description', imageUrl: `${gcsBaseUrl}inspiring_beach.jpg`, color1: '#0c4a6e', color2: '#0369a1', slug: 'beaches', chatQuery: 'I want beaches' },
  { titleKey: 'inspiration_culture_title', descriptionKey: 'inspiration_culture_description', imageUrl: `${gcsBaseUrl}inspiring_culture.jpg`, color1: '#4c1d95', color2: '#6d28d9', slug: 'culture', chatQuery: 'Culture and history' },
  { titleKey: 'inspiration_nature_title', descriptionKey: 'inspiration_nature_description', imageUrl: `${gcsBaseUrl}inspiring_nature.jpg`, color1: '#14532d', color2: '#15803d', slug: 'nature', chatQuery: 'Best natural beauties' },
  { titleKey: 'inspiration_food_title', descriptionKey: 'inspiration_food_description', imageUrl: `${gcsBaseUrl}inspiring_food.jpg`, color1: '#9a3412', color2: '#c2410c', slug: 'food', chatQuery: 'Gastronomy and wine' }
];

export default async function HomePage(props: HomePageProps) {
  const resolvedParams = await props.params;
  let effectiveLocale: Locale;
  let isLocaleFromParamsValid = false;

  if (resolvedParams && typeof resolvedParams.locale === 'string' && appLocalesStringArray.includes(resolvedParams.locale)) {
    effectiveLocale = resolvedParams.locale as Locale;
    isLocaleFromParamsValid = true;
  } else {
    console.warn(`[page.tsx] HomePage - Invalid or unsupported locale '${resolvedParams?.locale}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
  }

  const { t } = await getServerTranslations(effectiveLocale, defaultNS);

  if (!isLocaleFromParamsValid) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 bg-red-100 border border-red-400 p-4 rounded-md">
          {t('error_invalid_locale_message', { requestedLocale: resolvedParams?.locale, fallbackLocale: effectiveLocale }) || `Traženi jezik '${resolvedParams?.locale}' nije podržan. Prikazuje se ${effectiveLocale}.`}
        </p>
      </div>
    );
  }

  return (
    <>
      <HomeHero useVideo={true} imageUrl={heroImageUrl} />

      <section className="py-16 md:py-24 container mx-auto px-4" id="sara-ai-planner">
        <div className="mb-16">
          <h2 className="section-title mb-2">{t('inspiration_title')}</h2>
          <p className="text-body-lg text-muted-foreground mb-6 max-w-xl">{t('inspiration_subtitle')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {inspirationItems.map((item, i) => (
              <div key={item.slug} className="animate-hero-slide-up" style={{ animationDelay: `${0.1 + i * 0.05}s`, animationFillMode: 'backwards' }}>
                <InspireCard titleKey={item.titleKey} descriptionKey={item.descriptionKey} imageUrl={item.imageUrl} color1={item.color1} color2={item.color2} slug={item.slug} chatQuery={item.chatQuery} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
