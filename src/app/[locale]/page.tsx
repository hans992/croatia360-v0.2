// src/app/[locale]/page.tsx
import StickyChatbotSection from '@/components/StickyChatbotSection';
import { getServerTranslations } from '@/lib/i18n/server';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';

// The InspireCard is a Client Component, imported into this Server Component.
import InspireCard from '@/components/InspireCard';

interface PageParams {
  locale: string;
}

interface PageSearchParams {
  [key: string]: string | string[] | undefined;
}

interface HomePageProps {
  params: Promise<PageParams>; // Locale parameter.
  searchParams?: Promise<PageSearchParams>; // Optional search parameters.
}

// Static data for inspiration cards. Could also be fetched from a CMS or API.
const inspirationItems = [
  {
    titleKey: 'inspiration_beaches_title',
    descriptionKey: 'inspiration_beaches_description',
    imageUrl: '/images/inspiration/beaches.jpg', // Ensure paths are relative to /public directory.
    color1: '#0088cc',
    color2: '#005580',
    slug: 'beaches'
  },
  {
    titleKey: 'inspiration_culture_title',
    descriptionKey: 'inspiration_culture_description',
    imageUrl: '/images/inspiration/culture.jpg',
    color1: '#8e44ad',
    color2: '#5b2c6f',
    slug: 'culture'
  },
  {
    titleKey: 'inspiration_nature_title',
    descriptionKey: 'inspiration_nature_description',
    imageUrl: '/images/inspiration/nature.jpg',
    color1: '#27ae60',
    color2: '#196f3d',
    slug: 'nature'
  },
  {
    titleKey: 'inspiration_food_title',
    descriptionKey: 'inspiration_food_description',
    imageUrl: '/images/inspiration/food.jpg',
    color1: '#d35400',
    color2: '#a04000',
    slug: 'food'
  }
];

// This is an async Server Component.
export default async function HomePage(props: HomePageProps) {
  const resolvedParams = await props.params;
  let effectiveLocale: Locale;
  let isLocaleFromParamsValid = false;

  // Validate and determine the effective locale for translations.
  if (resolvedParams && typeof resolvedParams.locale === 'string' && appLocalesStringArray.includes(resolvedParams.locale)) {
    effectiveLocale = resolvedParams.locale as Locale;
    isLocaleFromParamsValid = true;
  } else {
    console.warn(`[page.tsx] HomePage - Invalid or unsupported locale '${resolvedParams?.locale}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng; // Fallback to default language if locale is invalid.
  }

  // Fetch server-side translations for page-level content.
  const { t } = await getServerTranslations(effectiveLocale, defaultNS);

  // Handle invalid locale by showing an error message.
  if (!isLocaleFromParamsValid) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 bg-red-100 border border-red-400 p-4 rounded-md">
          {t('error_invalid_locale_message', { requestedLocale: resolvedParams?.locale, fallbackLocale: effectiveLocale }) ||
            `Traženi jezik '${resolvedParams?.locale}' nije podržan ili je neispravan. Prikazuje se zadani jezik (${effectiveLocale}). Molimo provjerite URL.`}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center pt-10 pb-10 container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">{t('hero_title_sara_ai')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('hero_subtitle_sara_ai')}</p>
      </div>

      <StickyChatbotSection />

      <section className="py-12 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">
            {t('inspiration_title')}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {t('inspiration_subtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {inspirationItems.map(item => (
              // Props are passed to the InspireCard Client Component.
              // The InspireCard itself will handle translations for its content using these keys.
              <InspireCard
                key={item.slug}
                titleKey={item.titleKey}
                descriptionKey={item.descriptionKey}
                imageUrl={item.imageUrl}
                color1={item.color1}
                color2={item.color2}
                slug={item.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}