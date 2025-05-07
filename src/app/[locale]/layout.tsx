// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '../../styles/globals.css';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';
import TranslationsProvider from '@/lib/i18n/TranslationsProvider';
// Updated import and function name
import { getServerTranslations } from '@/lib/i18n/server';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(props: { params: { locale: string } }): Promise<Metadata> {
  const params = await props.params;
  let localeToUse: Locale;

  if (params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale)) {
    localeToUse = params.locale as Locale;
  } else {
    console.warn(`[layout.tsx] generateMetadata - Invalid or unsupported locale '${params?.locale}'. Using fallback: ${fallbackLng}`);
    localeToUse = fallbackLng;
  }
  
  // Updated function call
  const { t } = await getServerTranslations(localeToUse, defaultNS);
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
  let isLocaleValid = false;

  if (params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale)) {
    effectiveLocale = params.locale as Locale;
    isLocaleValid = true;
  } else {
    console.warn(`[layout.tsx] RootLayout - Invalid or unsupported locale '${params?.locale}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
  }

  // Updated function call
  const { i18n, t } = await getServerTranslations(effectiveLocale, defaultNS);
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
            {!isLocaleValid && (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center" role="alert">
                    <p>
                        {t('error_invalid_locale_message', { requestedLocale: params?.locale, fallbackLocale: effectiveLocale }) || 
                         `Traženi jezik '${params?.locale}' nije podržan. Prikazuje se ${effectiveLocale}.`}
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
