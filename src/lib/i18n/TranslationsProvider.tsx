// src/lib/i18n/TranslationsProvider.tsx
'use client';

// ISPRAVAK: I18nextProvider se importira iz 'react-i18next'
import { I18nextProvider } from 'react-i18next';
import { createInstance, Resource } from 'i18next'; // Resource je ispravno iz 'i18next'
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions, locales as appLocales, fallbackLng } from './settings';
import { ReactNode, useEffect, useState } from 'react';

interface TranslationsProviderProps {
  children: ReactNode;
  locale: string;
  namespaces: string[];
  resources?: Resource;
}

let i18nInstance: ReturnType<typeof createInstance>;

const initClientI18next = (locale: string, namespaces: string[], resources?: Resource) => {
  const effectiveLocale = appLocales.includes(locale) ? locale : fallbackLng;

  if (i18nInstance && i18nInstance.language === effectiveLocale) {
    namespaces.forEach(ns => {
      if (!i18nInstance.hasResourceBundle(effectiveLocale, ns) && resources && resources[effectiveLocale] && resources[effectiveLocale][ns]) {
        // @ts-ignore // Može biti potrebno ako TS ima problema s tipizacijom ovdje
        i18nInstance.addResourceBundle(effectiveLocale, ns, resources[effectiveLocale][ns]);
      }
    });
    return i18nInstance;
  }

  const instance = createInstance();
  instance
    .use(initReactI18next)
    .use(resourcesToBackend(async (language: string, namespace: string) => {
      try {
        return await import(`../../../../public/locales/${language}/${namespace}.json`);
      } catch (error) {
        console.error(`Greška pri učitavanju prijevoda za ${language}/${namespace} na klijentu:`, error);
        return {};
      }
    }));

  if (!instance.isInitialized || resources) {
    instance.init({
      ...getOptions(effectiveLocale, namespaces),
      resources,
    });
  }
  i18nInstance = instance;
  return i18nInstance;
};

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationsProviderProps) {
  const [i18n, setI18n] = useState(() => initClientI18next(locale, namespaces, resources));

  useEffect(() => {
    const newInstance = initClientI18next(locale, namespaces, resources);
    if (newInstance !== i18n) {
      setI18n(newInstance);
    }
  }, [locale, namespaces, resources, i18n]); // Dodan i18n u ovisnosti

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
