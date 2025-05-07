// src/lib/i18n/settings.ts
export const fallbackLng = 'hr'; 
export const locales = [fallbackLng, 'en'];
export const defaultNS = 'common'; 
export const cookieName = 'i18next';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: locales,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,

  };
}