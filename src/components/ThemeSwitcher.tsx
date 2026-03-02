// src/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultNS } from '@/lib/i18n/settings';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation(defaultNS);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: 36, height: 36 }} className="animate-pulse bg-muted rounded-md" />;
  }

  const handleThemeChange = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      aria-label={t('theme_switcher_aria_label')}
      onClick={handleThemeChange}
      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={20} aria-hidden />
      ) : (
        <Moon size={20} aria-hidden />
      )}
    </button>
  );
};

export default ThemeSwitcher;
