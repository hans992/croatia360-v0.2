// src/lib/i18n/server.ts
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
// Dodajte fallbackLng u import ovdje
import { getOptions, defaultNS, locales as appLocales, fallbackLng } from './settings';

/**
 * Inicijalizira i18next instancu za korištenje na serveru.
 * @param lng Jezik za inicijalizaciju.
 * @param ns Namespace(ovi) za učitavanje.
 * @returns Inicijalizirana i18next instanca.
 */
const initI18next = async (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend(async (language: string, namespace: string) => {
      try {
        // Putanja mora biti relativna od OVE datoteke do vašeg public/locales direktorija.
        return await import(`../../../public/locales/${language}/${namespace}.json`);
      } catch (error) {
        console.error(`Greška pri učitavanju prijevoda za ${language}/${namespace}:`, error);
        return {}; // Vrati prazan objekt u slučaju greške da aplikacija ne pukne
      }
    }))
    .init(getOptions(lng, ns));
  return i18nInstance;
};

/**
 * Hook za korištenje prijevoda unutar Server Components.
 * @param lng Trenutni jezik.
 * @param ns Namespace(ovi) za korištenje (opcionalno, zadano na defaultNS).
 * @param options Dodatne opcije, npr. keyPrefix.
 * @returns Objekt s 't' funkcijom za prevođenje i 'i18n' instancom.
 */
export async function useTranslation(
  lng: string,
  ns: string | string[] = defaultNS,
  options: { keyPrefix?: string } = {}
) {
  // Provjerite je li traženi jezik podržan, inače koristite fallbackLng
  // fallbackLng je sada ispravno prepoznat jer je importiran
  const effectiveLng = appLocales.includes(lng) ? lng : fallbackLng;
  const i18nextInstance = await initI18next(effectiveLng, ns);
  return {
    t: i18nextInstance.getFixedT(effectiveLng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
}
