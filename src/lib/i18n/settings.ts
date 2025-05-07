// src/lib/i18n/settings.ts

// Definiramo niz jezika kao 'const' da bismo mogli izvesti tip iz njega.
export const localesArray = ['hr', 'en', 'de', 'it', 'fr', 'cs', 'pl', 'hu'] as const;

// Izvodimo Locale tip iz niza jezika.
// Sada će Locale biti 'hr' | 'en' | 'de' | ...
export type Locale = typeof localesArray[number];

// fallbackLng sada također može biti tipa Locale
export const fallbackLng: Locale = 'hr';

// Eksportiramo 'locales' kao običan string[] za korištenje gdje je to potrebno
// (npr. u i18next konfiguraciji koja očekuje string[]).
export const locales: string[] = [...localesArray];

export const defaultNS = 'common';
export const cookieName = 'i18next-lang';

export function getOptions(lng: string = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    supportedLngs: locales,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
