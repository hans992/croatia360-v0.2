// src/components/ThemeSwitcher.tsx
"use client"; // Potrebno zbog hookova

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import za prijevode
import { defaultNS } from '@/lib/i18n/settings'; // Za default namespace

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation(defaultNS); // Inicijalizacija t funkcije

  // Kada se komponenta mounta na klijentu, postavljamo mounted na true
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Vratite placeholder ili null da se izbjegne hydration mismatch
    // Možete stilizirati placeholder da odgovara veličini gumba
    return <div style={{ width: '100px', height: '36px' }} className="animate-pulse bg-muted rounded-md" />; // Prilagodite dimenzije
  }

  const handleThemeChange = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      aria-label={t('theme_switcher_aria_label')} // Prevedeni aria-label
      onClick={handleThemeChange}
      // Vaše postojeće klase ili ih prilagodite
      className="p-2 rounded-md bg-primary text-primary-foreground hover:opacity-80 transition-opacity text-sm" 
    >
      {resolvedTheme === 'dark' ? (
        <span>{t('theme_switcher_light_label')}</span> // Prevedeni tekst
      ) : (
        <span>{t('theme_switcher_dark_label')}</span> // Prevedeni tekst
      )}
    </button>
  );
};

export default ThemeSwitcher;
