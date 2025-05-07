// src/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultNS } from '@/lib/i18n/settings';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  // Uklonjen 'theme' ako se ne koristi; 'resolvedTheme' je obično korisniji
  const { setTheme, resolvedTheme } = useTheme(); 
  const { t } = useTranslation(defaultNS);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: '100px', height: '36px' }} className="animate-pulse bg-muted rounded-md" />;
  }

  const handleThemeChange = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      aria-label={t('theme_switcher_aria_label')}
      onClick={handleThemeChange}
      className="p-2 rounded-md bg-primary text-primary-foreground hover:opacity-80 transition-opacity text-sm" 
    >
      {resolvedTheme === 'dark' ? (
        <span>{t('theme_switcher_light_label')}</span>
      ) : (
        <span>{t('theme_switcher_dark_label')}</span>
      )}
    </button>
  );
};

export default ThemeSwitcher;
