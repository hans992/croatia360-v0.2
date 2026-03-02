// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import '../../styles/globals.css';
import { locales as appLocalesStringArray, defaultNS, fallbackLng, type Locale } from '@/lib/i18n/settings';
import TranslationsProvider from '@/lib/i18n/TranslationsProvider';
import { getServerTranslations } from '@/lib/i18n/server';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsentBanner from '@/components/layout/CookieConsentBanner';
import SaraFloatingWidget from '@/components/SaraFloatingWidget';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// --- Metadata Generation ---

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  let localeToUse: Locale;

  // Validate locale from params
  if (params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale)) {
    localeToUse = params.locale as Locale;
  } else {
    // WARNING: Invalid locale detected in generateMetadata, using fallback.
    console.warn(`[layout.tsx] generateMetadata - Invalid or unsupported locale '${params?.locale}'. Using fallback: ${fallbackLng}`);
    localeToUse = fallbackLng;
  }

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

// --- Static Params Generation ---

export async function generateStaticParams() {
  return appLocalesStringArray.map((lng) => ({ locale: lng }));
}

// --- Root Layout Component ---

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  let effectiveLocale: Locale;
  let isLocaleValid = false;

  // Validate locale from params for the layout
  if (params && typeof params.locale === 'string' && appLocalesStringArray.includes(params.locale)) {
    effectiveLocale = params.locale as Locale;
    isLocaleValid = true;
  } else {
    // WARNING: Invalid locale detected in RootLayout, using fallback.
    console.warn(`[layout.tsx] RootLayout - Invalid or unsupported locale '${params?.locale}'. Using fallback: ${fallbackLng}`);
    effectiveLocale = fallbackLng;
  }

  // Fetch server translations and prepare resources for client provider
  const { i18n, t } = await getServerTranslations(effectiveLocale, defaultNS);
  const initialResources = {
    [effectiveLocale]: {
      [defaultNS]: i18n.getResourceBundle(effectiveLocale, defaultNS) || {},
    },
  };

  return (
    <html lang={effectiveLocale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        {/* Provides i18n context and resources to Client Components */}
        <TranslationsProvider
          locale={effectiveLocale}
          namespaces={[defaultNS]}
          resources={initialResources}
        >
          {/* Handles theme switching */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Optional: Display a message if the originally requested locale was invalid */}
            {!isLocaleValid && (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-center" role="alert">
                    <p>
                        {t('error_invalid_locale_message', { requestedLocale: params?.locale, fallbackLocale: effectiveLocale }) ||
                         `Requested language '${params?.locale}' is not supported. Displaying ${effectiveLocale}.`}
                    </p>
                 </div>
            )}

            {/* Main Layout Structure */}
            <Header locale={effectiveLocale} />
            <main className="flex-grow container mx-auto px-4 pt-0 pb-8">
              {props.children}
            </main>
            <Footer locale={effectiveLocale} />

            {/* Cookie Consent Banner Component */}
            <CookieConsentBanner />

            {/* SARA Omnipresent Floating Widget */}
            <SaraFloatingWidget />
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}