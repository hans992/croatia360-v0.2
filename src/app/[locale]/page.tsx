// src/app/[locale]/page.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StickyChatbotSection from '@/components/StickyChatbotSection';
import { getServerTranslations } from '@/lib/i18n/server';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';

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

export default async function HomePage(props: HomePageProps) {
  const resolvedParams = await props.params;
  let effectiveLocale: Locale;
  let isLocaleFromParamsValid = false;

  if (resolvedParams && typeof resolvedParams.locale === 'string' && appLocalesStringArray.includes(resolvedParams.locale)) {
    effectiveLocale = resolvedParams.locale as Locale;
    isLocaleFromParamsValid = true;
  } else {
    // Logiranje upozorenja ostaje, ali ne prekidamo renderiranje
    console.warn(`[page.tsx] HomePage - Invalid or unsupported locale '${resolvedParams?.locale}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
  }

  const { t } = await getServerTranslations(effectiveLocale, defaultNS);

  const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

  const inspirationCards = [
    { id: 'istra', image: `${gcsBaseUrl}Istria_sunset.jpg`, altKey: "alt_istra_sunset", titleKey: "card_istra_title", descriptionKey: "card_istra_description", linkTextKey: "card_learn_more_button" },
    { id: 'krka', image: `${gcsBaseUrl}Krka.jpg`, altKey: "alt_krka_np", titleKey: "card_krka_title", descriptionKey: "card_krka_description", linkTextKey: "card_learn_more_button" },
    { id: 'sibenik', image: `${gcsBaseUrl}Sibenik_tfortress.jpg`, altKey: "alt_sibenik_fortress", titleKey: "card_sibenik_title", descriptionKey: "card_sibenik_description", linkTextKey: "card_learn_more_button" },
    { id: 'pozega', image: `${gcsBaseUrl}Pozega_Grad.jpg`, altKey: "alt_pozega_city", titleKey: "card_pozega_title", descriptionKey: "card_pozega_description", linkTextKey: "card_learn_more_button" },
    { id: 'zagreb', image: `${gcsBaseUrl}Zagreb_Trg_kralja_Tomislava.jpg`, altKey: "alt_zagreb_square", titleKey: "card_zagreb_title", descriptionKey: "card_zagreb_description", linkTextKey: "card_learn_more_button" },
    { id: 'senj', image: `${gcsBaseUrl}senj.jpg`, altKey: "alt_senj_city", titleKey: "card_senj_title", descriptionKey: "card_senj_description", linkTextKey: "card_learn_more_button" },
  ];

  // Prikaz poruke o grešci ako originalni locale nije bio valjan
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
      <div className="mt-12 container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-900">{t('inspiration_title')}</h2>
        <p className="text-center text-gray-600 mb-8">{t('inspiration_subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspirationCards.map(card => {
            const titleTranslation = t(card.titleKey);
            // Uklonjen console.log
            
            return (
              <Card key={card.id}>
                <CardHeader>
                  <Image 
                    src={card.image} 
                    alt={t(card.altKey)}
                    width={400} 
                    height={200} 
                    className="rounded-t-lg object-cover w-full h-48" 
                    priority={['istra', 'krka', 'sibenik'].includes(card.id)}
                  />
                  <CardTitle className="mt-8">{titleTranslation}</CardTitle> 
                </CardHeader>
                <CardContent>
                  <CardDescription>{t(card.descriptionKey)}</CardDescription>
                  <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">
                    {t(card.linkTextKey)}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
