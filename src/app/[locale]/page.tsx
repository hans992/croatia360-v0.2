// src/app/[locale]/page.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StickyChatbotSection from '@/components/StickyChatbotSection';
// Footer se renderira u RootLayout-u, pa ga ne treba importirati ovdje
// import Footer from '@/components/layout/Footer';
import { useTranslation as useServerTranslation } from '@/lib/i18n/server';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';

interface HomePagePropsInternal {
  params: { locale: string };
}

export default async function HomePage(props: HomePagePropsInternal) {
  const params = await props.params;
  let effectiveLocale: Locale;

  if (params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale)) {
    effectiveLocale = params.locale as Locale;
  } else {
    console.warn(`[page.tsx] HomePage - Neispravan ili nepodržan locale '${params?.locale}'. Koristi se fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
    // Možete odlučiti prikazati specifičnu poruku o grešci ili se osloniti na poruku iz RootLayout-a
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useServerTranslation(effectiveLocale, defaultNS);

  const inspirationCards = [
    { id: 'istra', image: "/images/Istria_sunset.jpg", altKey: "alt_istra_sunset", titleKey: "card_istra_title", descriptionKey: "card_istra_description", linkTextKey: "card_learn_more_button" },
    { id: 'krka', image: "/images/Krka.jpg", altKey: "alt_krka_np", titleKey: "card_krka_title", descriptionKey: "card_krka_description", linkTextKey: "card_learn_more_button" },
    { id: 'sibenik', image: "/images/Sibenik_tfortress.jpg", altKey: "alt_sibenik_fortress", titleKey: "card_sibenik_title", descriptionKey: "card_sibenik_description", linkTextKey: "card_learn_more_button" },
    { id: 'pozega', image: "/images/Pozega_Grad.jpg", altKey: "alt_pozega_city", titleKey: "card_pozega_title", descriptionKey: "card_pozega_description", linkTextKey: "card_learn_more_button" },
    { id: 'zagreb', image: "/images/Zagreb_Trg_kralja_Tomislava.jpg", altKey: "alt_zagreb_square", titleKey: "card_zagreb_title", descriptionKey: "card_zagreb_description", linkTextKey: "card_learn_more_button" },
    { id: 'senj', image: "/images/senj.jpg", altKey: "alt_senj_city", titleKey: "card_senj_title", descriptionKey: "card_senj_description", linkTextKey: "card_learn_more_button" },
  ];

  // Ako je locale bio neispravan, a želite prikazati poruku direktno na stranici
  if (!(params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale))) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-red-600">
                {t('error_invalid_locale_message', { requestedLocale: params?.locale, fallbackLocale: effectiveLocale }) || 
                 `Traženi jezik '${params?.locale}' nije podržan. Prikazuje se ${effectiveLocale}.`}
            </p>
            {/* Možete dodati i ostatak stranice s fallback jezikom ako želite */}
        </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="text-center pt-10 pb-10 container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">{t('hero_title_sara_ai')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('hero_subtitle_sara_ai')}</p>
      </div>

      {/* Proslijeđujemo effectiveLocale koji je tipa Locale */}
      <StickyChatbotSection /* locale={effectiveLocale} // Uklonjeno ako nije potrebno */ />

      {/* Content Section */}
      <div className="mt-12 container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-900">{t('inspiration_title')}</h2>
        <p className="text-center text-gray-600 mb-8">{t('inspiration_subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspirationCards.map(card => (
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
                <CardTitle className="mt-4">{t(card.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t(card.descriptionKey)}</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">
                  {t(card.linkTextKey)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
