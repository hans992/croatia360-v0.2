// src/lib/i18n/server.ts
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions, defaultNS, locales as appLocales, fallbackLng } from './settings';
import { rebrandTranslationResource } from './rebrand';

const initI18next = async (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend(async (language: string, namespace: string) => {
      try {
        const loaded = await import(`../../../public/locales/${language}/${namespace}.json`);
        return rebrandTranslationResource(loaded.default ?? loaded);
      } catch (error) {
        console.error(`Greška pri učitavanju prijevoda za ${language}/${namespace} na serveru:`, error);
        return {};
      }
    }))
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function getServerTranslations(
  lng: string,
  ns: string | string[] = defaultNS,
  options: { keyPrefix?: string } = {}
) {
  const effectiveLng = appLocales.includes(lng) ? lng : fallbackLng;
  const i18nextInstance = await initI18next(effectiveLng, ns);
  return {
    t: i18nextInstance.getFixedT(effectiveLng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
}
