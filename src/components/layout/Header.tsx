// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image'; // Vraćamo Image komponentu
import { Button } from '@/components/ui/button';
import { User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { supabase } from '@/lib/supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';
import { usePathname } from 'next/navigation';

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: { name?: string; avatar_url?: string };
};

interface HeaderProps {
  locale: Locale;
}

const Header = ({ locale }: HeaderProps) => {
  const { t } = useTranslation(defaultNS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();

  // URL za logo s Google Cloud Storagea
  const logoUrl = "https://storage.googleapis.com/croatia360/images/logo-croatia360.png";
  
  const kunaLogoPath = "https://storage.googleapis.com/croatia360/images/logo-croatia360.png"; 

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as SupabaseUser | null ?? null);
      setAuthChecked(true);
    });
    // Inicijalno dohvaćanje sesije da se stanje ažurira što prije
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!user) { // Postavi samo ako listener nije već postavio
        setUser(session?.user as SupabaseUser | null ?? null);
      }
      setAuthChecked(true);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ovisnost uklonjena da se oslanja na mount/unmount

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const headerHeightClass = 'h-16';
  const hiddenHeaderClass = '-top-16';
  const displayName = user?.user_metadata?.name || user?.email || (user ? t('user_generic_name') : "");

  const navLinks = [
    { href: '/explore', labelKey: 'header_explore' },
    { href: '/', labelKey: 'header_sara_ai', isPrimary: true },
  ];
  const userNavLinks = user ? [{ href: '/my-trip', labelKey: 'header_my_trip' }] : [];

  return (
    <header
      className={`
        sticky w-full z-50 
        bg-background/80 text-foreground shadow-md backdrop-blur-md
        ${headerHeightClass}
        transition-all duration-300 ease-in-out
        ${scrollDirection === 'down' ? hiddenHeaderClass : 'top-0'}
      `}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href={`/${locale}/`} className="flex items-center space-x-2">
          {/* Koristimo Next Image s GCS URL-om */}
          <Image 
            src={logoUrl} 
            alt={t('alt_croatia360_logo') || "Croatia360 Logo"} 
            width={100} // Originalna širina za omjer
            height={40} // Originalna visina za omjer
            className="h-10 w-auto" // Tailwind za stvarnu veličinu prikaza
            priority 
            // unoptimized={true} // Uklonjeno, neka Next.js pokuša optimizirati
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link
              key={link.labelKey}
              href={`/${locale}${link.href}`}
              className={`transition-colors hover:text-primary ${link.isPrimary ? 'text-primary font-semibold' : 'text-foreground/80'}`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          {userNavLinks.map(link => (
             <Link
              key={link.labelKey}
              href={`/${locale}${link.href}`}
              className="transition-colors hover:text-primary text-foreground/80"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeSwitcher />
          
          {!authChecked ? (
             <div className="h-8 w-24 animate-pulse bg-muted rounded-md"></div> 
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link href={`/${locale}/my-trip`} className="text-sm font-medium hover:text-primary">
                 {displayName}
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={async () => { await supabase.auth.signOut(); setUser(null); }}
              >
                {t('header_logout')}
              </Button>
            </div>
          ) : (
            <Link href={`/${locale}/login`}>
              <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <User className="h-5 w-5 mr-2" />
                {t('header_login')}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeSwitcher />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">{isMobileMenuOpen ? t('header_close_menu') : t('header_open_menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[320px] bg-background text-foreground p-0 flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-border">
                  <Link href={`/${locale}/`} className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    {/* Za kuna.png koristimo <img> tag kao workaround ako i dalje pravi probleme */}
                    <img 
                      src={kunaLogoPath} 
                      alt={t('alt_sara_ai_logo')} 
                      width={30} 
                      height={30} 
                      className="h-8 w-auto"
                    />
                    <span className="font-semibold text-lg text-primary">Croatia360</span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <X className="h-6 w-6" />
                      <span className="sr-only">{t('header_close_menu')}</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex-grow flex flex-col space-y-1 p-4 text-base">
                   {navLinks.map(link => (
                    <SheetClose key={link.labelKey} asChild>
                        <Link 
                            href={`/${locale}${link.href}`} 
                            className={`block px-3 py-2 rounded-md hover:bg-muted transition-colors ${link.isPrimary ? 'text-primary font-semibold' : 'text-foreground/90'}`}
                        >
                            {t(link.labelKey)}
                        </Link>
                    </SheetClose>
                  ))}
                  {userNavLinks.map(link => (
                     <SheetClose key={link.labelKey} asChild>
                        <Link 
                            href={`/${locale}${link.href}`} 
                            className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground/90"
                        >
                            {t(link.labelKey)}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="p-4 border-t border-border">
                  {!authChecked ? (
                     <div className="h-8 w-full animate-pulse bg-muted rounded-md mb-2"></div>
                  ) : user ? (
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium px-3 py-2 text-foreground/80">{t('logged_in_as') || "Prijavljeni kao:"} {displayName}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-destructive text-destructive hover:bg-destructive/10"
                          onClick={async () => { await supabase.auth.signOut(); setUser(null); setIsMobileMenuOpen(false); }}
                        >
                          {t('header_logout')}
                        </Button>
                      </div>
                  ) : (
                    <SheetClose asChild>
                      <Link href={`/${locale}/login`} className="w-full">
                        <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                          <User className="h-5 w-5 mr-2" />
                           {t('login_register_button') || "Prijava / Registracija"}
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
