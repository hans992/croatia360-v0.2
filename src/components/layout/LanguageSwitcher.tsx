// src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "../../../i18n-config"; // Provjerite je li putanja do i18n-config točna
import { Globe } from "lucide-react"; // Primjer korištenja Lucide ikone
import { useState } from "react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = pathname.split("/")[1] as Locale;

  const redirectedPathName = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const handleLanguageChange = (locale: Locale) => {
    const newPath = redirectedPathName(locale);
    router.push(newPath);
    setIsOpen(false);
  };

  // Mapiranje kodova jezika na njihove pune nazive za prikaz
  const languageNames: Record<Locale, string> = {
    hr: "Hrvatski",
    en: "English",
    de: "Deutsch",
    it: "Italiano",
    fr: "Français",
    cs: "Čeština",
    pl: "Polski",
    hu: "Magyar",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Odaberi jezik"
      >
        <Globe size={24} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <ul>
            {i18n.locales.map((locale) => {
              // Ne prikazuj trenutno odabrani jezik u listi
              if (locale === currentLocale) return null;
              return (
                <li key={locale}>
                  <button
                    onClick={() => handleLanguageChange(locale)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {languageNames[locale] || locale} 
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
