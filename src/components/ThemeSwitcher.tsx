// src/components/ThemeSwitcher.js (ili .tsx)

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Kada se komponenta mounta na klijentu, postavljamo mounted na true
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleThemeChange = () => {

    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      aria-label="Promijeni temu"
      onClick={handleThemeChange}
      className="p-2 rounded-md bg-primary text-primary-foreground hover:opacity-80 transition-opacity" // Primjer stilizacije, prilagodite svojim Tailwind klasama
    >
      {resolvedTheme === 'dark' ? (
        <span>☀️ Svijetla</span>
      ) : (
        <span>🌙 Tamna</span>
      )}
    </button>
  );
};

export default ThemeSwitcher;