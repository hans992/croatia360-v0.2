// src/app/[locale]/page.tsx
import { getServerTranslations } from '@/lib/i18n/server';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';
import Image from "next/image";
// Import StickyChatbotSection which will handle the chatbot's display and stickiness
import StickyChatbotSection from '@/components/StickyChatbotSection'; // Ensure this path is correct
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

// Static data for inspiration cards.
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
    console.warn(`[page.tsx] HomePage - Invalid or unsupported locale '${resolvedParams?.locale}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
  }

  const { t } = await getServerTranslations(effectiveLocale, defaultNS);

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
      {/* Hero section */}


      {/* The StickyChatbotSection will now manage the display of the Chatbot.
        It handles the normal view (styled block) and the compact sticky view.
        The pastel-gradient-bg, backdrop-blur, etc., are now defined within StickyChatbotSection
        for its non-sticky state.
      */}
      <StickyChatbotSection />

      {/* Inspiration section */}
      <section className="py-12 bg-transparent w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">
            {t('inspiration_title')}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {t('inspiration_subtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {inspirationItems.map(item => (
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