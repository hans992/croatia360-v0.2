// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '../../styles/globals.css';
// Importirajte Locale tip iz settings
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';
import TranslationsProvider from '@/lib/i18n/TranslationsProvider';
import { useTranslation as useServerTranslation } from '@/lib/i18n/server';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(props: { params: { locale: string } }): Promise<Metadata> {
  const params = await props.params;

  if (!params || typeof params.locale !== 'string') {
    console.error('[layout.tsx] generateMetadata - Neispravni params ili locale:', params);
    return {
      title: "Error loading title",
      description: "Error loading description",
    };
  }
  const locale = params.locale;
  // Osiguravamo da je effectiveLocale tipa Locale
  const effectiveLocale: Locale = appLocalesStringArray.includes(locale) ? locale as Locale : fallbackLng;
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useServerTranslation(effectiveLocale, defaultNS);
  return {
    title: t('site_title'),
    description: t('site_description'),
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export async function generateStaticParams() {
  // Za generateStaticParams, params.locale mora biti string, pa koristimo appLocalesStringArray
  return appLocalesStringArray.map((lng) => ({ locale: lng }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string }; // params.locale iz URL-a je string
}) {
  const params = await props.params;
  let effectiveLocale: Locale; // Deklariramo tip

  if (!params || typeof params.locale !== 'string' || !appLocalesStringArray.includes(params.locale)) {
    console.error('[layout.tsx] RootLayout - Neispravni ili nepodržani params.locale:', params.locale);
    effectiveLocale = fallbackLng; // Koristi fallback ako je params.locale neispravan ili nije podržan
    
    // Opcionalno: možete ovdje prikazati stranicu s greškom ili preusmjeriti
    // Za sada, nastavljamo s fallbackLng da aplikacija ne pukne
    const { i18n: i18nErr } = await useServerTranslation(effectiveLocale, defaultNS);
    const initialResourcesErr = {
        [effectiveLocale]: { // Koristimo effectiveLocale (koji je fallbackLng)
            [defaultNS]: i18nErr.getResourceBundle(effectiveLocale, defaultNS) || {},
        },
    };
    return (
        <html lang={effectiveLocale} suppressHydrationWarning>
          <body className={`${inter.className} flex flex-col min-h-screen`}>
            <TranslationsProvider
              locale={effectiveLocale}
              namespaces={[defaultNS]}
              resources={initialResourcesErr}
            >
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <div className="flex-grow flex items-center justify-center p-4 text-center">
                    Greška: Traženi jezik '{params?.locale}' nije podržan ili je došlo do problema s URL-om. Prikazuje se zadani jezik.
                </div>
              </ThemeProvider>
            </TranslationsProvider>
          </body>
        </html>
      );
  } else {
    effectiveLocale = params.locale as Locale; // Sigurno kastanje jer smo provjerili s includes
  }

  const { i18n } = await useServerTranslation(effectiveLocale, defaultNS);
  const initialResources = {
    [effectiveLocale]: {
      [defaultNS]: i18n.getResourceBundle(effectiveLocale, defaultNS) || {},
    },
  };

  return (
    <html lang={effectiveLocale} suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-background text-foreground`}>
        <TranslationsProvider
          locale={effectiveLocale}
          namespaces={[defaultNS]}
          resources={initialResources}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Sada prosljeđujemo effectiveLocale koji je tipa Locale */}
            <Header locale={effectiveLocale} />
            <main className="flex-grow container mx-auto px-4 pt-4 pb-8">
              {props.children}
            </main>
            <Footer locale={effectiveLocale} />
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
