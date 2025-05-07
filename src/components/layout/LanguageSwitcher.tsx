// src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
// Umjesto i18n-config, koristit ćemo naš centralni settings.ts
import { locales as appLocales, type Locale as AppLocaleType } from "@/lib/i18n/settings"; // Pretpostavljamo da Locale tip možemo definirati ili importirati
import { Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next'; // Za prijevod aria-label
import { defaultNS } from '@/lib/i18n/settings';

// Ako Locale tip nije eksportiran iz settings.ts, možemo ga definirati ovdje
// na temelju onoga što i18n.locales očekuje.
// Za sada, pretpostavimo da je AppLocaleType string.
type Locale = AppLocaleType; // Ili jednostavno string ako AppLocaleType nije definiran u settings.ts

// Definicija propsa koje komponenta prima
interface LanguageSwitcherProps {
  currentLocale: Locale; // Primamo trenutni locale kao prop
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(defaultNS); // Za prijevod

  // Nema potrebe za ponovnim izračunavanjem currentLocale, jer ga dobivamo kao prop

  const redirectedPathName = (newLocale: Locale) => {
    if (!pathname) return "/";
    // Uklanjamo stari jezični prefiks, ako postoji
    const pathSegments = pathname.split('/');
    if (appLocales.includes(pathSegments[1] as Locale)) {
      pathSegments.splice(1, 1); // Ukloni stari locale segment
    }
    const newPath = `/${newLocale}${pathSegments.join('/') || '/'}`;
    // Osiguraj da se ne dupliraju kose crte ako je pathSegments.join('/') prazan
    return newPath.replace(/\/\//g, '/');
  };

  const handleLanguageChange = (newLocale: Locale) => {
    const newPath = redirectedPathName(newLocale);
    router.push(newPath);
    setIsOpen(false);
  };

  // Mapiranje kodova jezika na njihove pune nazive za prikaz
  // Ovo bi također moglo doći iz i18n resursa ako želite da i nazivi jezika budu prevedeni
  const languageNames: Record<Locale, string> = {
    hr: "Hrvatski",
    en: "English",
    de: "Deutsch",
    it: "Italiano",
    fr: "Français",
    cs: "Čeština",
    pl: "Polski",
    hu: "Magyar",
    // Dodajte ostale jezike koje podržavate
  };

  // Efekt za zatvaranje dropdowna klikom izvan njega
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest('.language-switcher-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    // Dodajemo klasu za detekciju klika izvan
    <div className="relative language-switcher-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label={t('language_switcher_toggle_aria_label') || "Odaberi jezik"} // Prevedeni aria-label
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={20} /> {/* Malo manja ikona može bolje izgledati */}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-popover text-popover-foreground border border-border rounded-md shadow-lg z-50 py-1">
          <ul>
            {/* Koristimo appLocales iz naših postavki */}
            {appLocales.map((locale) => {
              return (
                <li key={locale}>
                  <button
                    onClick={() => handleLanguageChange(locale as Locale)}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground
                                ${locale === currentLocale ? 'font-semibold bg-accent' : ''}`}
                  >
                    {languageNames[locale as Locale] || locale.toUpperCase()}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
