// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '../../styles/globals.css';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';
import TranslationsProvider from '@/lib/i18n/TranslationsProvider';
import { useTranslation as useServerTranslation } from '@/lib/i18n/server';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(props: { params: { locale: string } }): Promise<Metadata> {
  const params = await props.params;
  let localeToUse: Locale;

  if (params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale)) {
    localeToUse = params.locale as Locale;
  } else {
    console.warn(`[layout.tsx] generateMetadata - Neispravan ili nepodržan locale '${params?.locale}'. Koristi se fallback: ${fallbackLng}`);
    localeToUse = fallbackLng;
  }
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useServerTranslation(localeToUse, defaultNS); // Poziv hook-a je sada na vrhu logičkog bloka
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
  return appLocalesStringArray.map((lng) => ({ locale: lng }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const params = await props.params;
  let effectiveLocale: Locale;

  if (params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale)) {
    effectiveLocale = params.locale as Locale;
  } else {
    console.warn(`[layout.tsx] RootLayout - Neispravan ili nepodržan locale '${params?.locale}'. Koristi se fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
    // Nećemo ovdje renderirati potpuno drugačiji HTML za grešku ako to uzrokuje probleme s hookovima.
    // Middleware bi trebao odraditi većinu posla preusmjeravanja na ispravan locale.
    // Ako dođe do ove točke s nevažećim locale, aplikacija će se renderirati s fallbackLng.
  }

  // Pozivamo useServerTranslation jednom, bez obzira na validnost originalnog 'locale' iz params,
  // jer smo već odredili 'effectiveLocale'.
  const { i18n, t } = await useServerTranslation(effectiveLocale, defaultNS);
  const initialResources = {
    [effectiveLocale]: {
      [defaultNS]: i18n.getResourceBundle(effectiveLocale, defaultNS) || {},
    },
  };

  // Provjera za grešku ako params.locale nije bio validan, ali nakon inicijalizacije i18n s fallbackom.
  if (!(params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale))) {
    // Možete odlučiti prikazati neku poruku unutar postojećeg layouta
    // ili se osloniti da će middleware spriječiti dolazak do ove točke s potpuno nevažećim localeom.
    // Za sada, renderiramo normalno s fallback jezikom.
    // Ako želite specifičnu poruku o grešci, trebate je dodati u children ili na drugačiji način.
    console.error(`[layout.tsx] RootLayout - Renderiranje s fallback jezikom '${effectiveLocale}' zbog neispravnog originalnog localea '${params?.locale}'.`);
  }

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
            {/* Greška za apostrof:
                Greška: Traženi jezik '{params?.locale}' nije podržan ili je došlo do problema s URL-om. Prikazuje se zadani jezik.
                Zamijenjeno s &apos;
            */}
            {/* Primjer prikaza greške ako je locale bio neispravan, ali sada koristimo fallback za renderiranje */}
            {!(params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale)) && (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center" role="alert">
                    <p>
                        {/* Koristimo 't' funkciju koja je već inicijalizirana s fallback jezikom */}
                        {t('error_invalid_locale_message', { requestedLocale: params?.locale, fallbackLocale: effectiveLocale }) || 
                         `Traženi jezik &apos;${params?.locale}&apos; nije podržan. Prikazuje se ${effectiveLocale}.`}
                    </p>
                 </div>
            )}
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
