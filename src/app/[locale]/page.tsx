// src/app/[locale]/page.tsx
import { getServerTranslations } from '@/lib/i18n/server';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';

// Import the standard Chatbot component
import Chatbot from '@/components/chatbot/Chatbot';
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

// Base URL for images from Google Cloud Storage
const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

// Static data for inspiration cards. Could also be fetched from a CMS or API.
const inspirationItems = [
  {
    titleKey: 'inspiration_beaches_title',
    descriptionKey: 'inspiration_beaches_description',
    imageUrl: `${gcsBaseUrl}inspiring_beach.jpg`, // Ensure these GCS image paths are correct.
    color1: '#0088cc',
    color2: '#005580',
    slug: 'beaches'
  },
  {
    titleKey: 'inspiration_culture_title',
    descriptionKey: 'inspiration_culture_description',
    imageUrl: `${gcsBaseUrl}inspiring_culture.jpg`,
    color1: '#8e44ad',
    color2: '#5b2c6f',
    slug: 'culture'
  },
  {
    titleKey: 'inspiration_nature_title',
    descriptionKey: 'inspiration_nature_description',
    imageUrl: `${gcsBaseUrl}inspiring_nature.jpg`,
    color1: '#27ae60',
    color2: '#196f3d',
    slug: 'nature'
  },
  {
    titleKey: 'inspiration_food_title',
    descriptionKey: 'inspiration_food_description',
    imageUrl: `${gcsBaseUrl}inspiring_food.jpg`,
    color1: '#d35400',
    color2: '#a04000',
    slug: 'food'
  }
];

// This is an async Server Component for the Home Page.
export default async function HomePage(props: HomePageProps) {
  const resolvedParams = await props.params;
  let effectiveLocale: Locale;
  let isLocaleFromParamsValid = false;

  // Validate and determine the effective locale for translations.
  if (resolvedParams && typeof resolvedParams.locale === 'string' && appLocalesStringArray.includes(resolvedParams.locale)) {
    effectiveLocale = resolvedParams.locale as Locale;
    isLocaleFromParamsValid = true;
  } else {
    // Log a warning and use fallback language if the provided locale is invalid or unsupported.
    console.warn(`[page.tsx] HomePage - Invalid or unsupported locale '${resolvedParams?.locale}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng; // Fallback to default language if locale is invalid.
  }

  // Fetch server-side translations for page-level content.
  const { t } = await getServerTranslations(effectiveLocale, defaultNS);

  // Handle invalid locale by showing an error message instead of rendering the page.
  if (!isLocaleFromParamsValid) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 bg-red-100 border border-red-400 p-4 rounded-md">
          {/* Display translated error message or a default Croatian message if translation fails. */}
          {t('error_invalid_locale_message', { requestedLocale: resolvedParams?.locale, fallbackLocale: effectiveLocale }) ||
            `Traženi jezik '${resolvedParams?.locale}' nije podržan ili je neispravan. Prikazuje se zadani jezik (${effectiveLocale}). Molimo provjerite URL.`}
        </p>
      </div>
    );
  }

  // Render the main page content.
  return (
    <>
      {/* Hero section with title and subtitle */}
      <div className="text-center pt-10 pb-10 container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">{t('hero_title_sara_ai')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('hero_subtitle_sara_ai')}</p>
      </div>

      {/* Static Chatbot section */}
      {/* Wrapper div for the Chatbot to control its spacing on the page */}
      <div className="container mx-auto px-4 my-8 md:my-12">
        <Chatbot />
      </div>

      {/* Inspiration section */}
      <section className="py-12 bg-transparent w-full"> {/* Background is transparent as per your previous version */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">
            {t('inspiration_title')}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {t('inspiration_subtitle')}
          </p>

          {/* Grid for displaying inspiration cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {inspirationItems.map(item => (
              // Each InspireCard is a client component that handles its own translation for title/description.
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