// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '../../styles/globals.css';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';
import TranslationsProvider from '@/lib/i18n/TranslationsProvider';
import { getServerTranslations } from '@/lib/i18n/server';
import { BRAND } from '@/lib/brand';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsentBanner from '@/components/layout/CookieConsentBanner';
import SaraFloatingWidget from '@/components/SaraFloatingWidget';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const localeToUse: Locale = params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale)
    ? params.locale as Locale
    : fallbackLng;

  const canonicalPath = `/${localeToUse}`;

  return {
    metadataBase: new URL(BRAND.url),
    title: {
      default: `${BRAND.name} | Boat trips & rentals on the Adriatic`,
      template: `%s | ${BRAND.name}`,
    },
    description: BRAND.description,
    applicationName: BRAND.name,
    alternates: {
      canonical: canonicalPath,
      languages: Object.fromEntries(appLocalesStringArray.map((locale) => [locale, `/${locale}`])),
    },
    openGraph: {
      type: 'website',
      siteName: BRAND.name,
      url: canonicalPath,
      title: `${BRAND.name} | Boat trips & rentals on the Adriatic`,
      description: BRAND.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${BRAND.name} | Boat trips & rentals on the Adriatic`,
      description: BRAND.description,
    },
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
  params: Promise<{ locale: string }>;
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

  const { i18n, t } = await getServerTranslations(effectiveLocale, defaultNS);
  const initialResources = {
    [effectiveLocale]: {
      [defaultNS]: i18n.getResourceBundle(effectiveLocale, defaultNS) || {},
    },
  };

  return (
    <html lang={effectiveLocale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden`}>
        <TranslationsProvider locale={effectiveLocale} namespaces={[defaultNS]} resources={initialResources}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {!isLocaleValid && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center" role="alert">
                <p>
                  {t('error_invalid_locale_message', { requestedLocale: params?.locale, fallbackLocale: effectiveLocale }) ||
                    `Requested language '${params?.locale}' is not supported. Displaying ${effectiveLocale}.`}
                </p>
              </div>
            )}

            <Header locale={effectiveLocale} />
            <main className="flex-grow container mx-auto px-4 pt-0 pb-8">{props.children}</main>
            <Footer locale={effectiveLocale} />
            <CookieConsentBanner />
            <SaraFloatingWidget />
            <Toaster position="bottom-right" />
            <Analytics />
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
