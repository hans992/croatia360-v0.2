// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { User, Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react'; // React import
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { supabase } from '@/lib/supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale, fallbackLng } from '@/lib/i18n/settings';
import { usePathname, useParams } from 'next/navigation';

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: { name?: string; avatar_url?: string };
};

interface NavLinkItem {
  href: string;
  labelKey: string;
  isPrimary?: boolean;
}

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
  const params = useParams();

  const currentLocale = locale || (params?.locale as Locale) || fallbackLng;
  const isChatPage = pathname ? pathname.endsWith('/chat') : false;

  const logoUrl = "https://storage.googleapis.com/croatiasara2026/images/logo-croatia360.png";

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as SupabaseUser | null ?? null);
      if (!authChecked) setAuthChecked(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!user && session) {
        setUser(session.user as SupabaseUser | null ?? null);
      }
      if (!authChecked) setAuthChecked(true);
    });
    return () => authListener?.subscription.unsubscribe();
  }, [authChecked, user]);

  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [pathname, isMobileMenuOpen]);

  const headerHeightClass = 'h-16';
  const hiddenHeaderClass = '-top-16';
  const displayName = user?.user_metadata?.name || user?.email || (user ? t('user_generic_name') : "");

  const navLinks: NavLinkItem[] = [
    { href: '/explore', labelKey: 'header_explore' },
    { href: '/', labelKey: 'header_sara_ai', isPrimary: true },
  ];
  const userNavLinks: NavLinkItem[] = user ? [{ href: '/my-trip', labelKey: 'header_my_trip' }] : [];

  return (
    <header
      className={`
        sticky w-full z-50 glass-panel
        ${headerHeightClass} transition-all duration-300 ease-in-out
        ${isChatPage ? 'top-0' : (scrollDirection === 'down' ? hiddenHeaderClass : 'top-0')}
      `}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href={`/${currentLocale}/`} className="flex items-center space-x-2 group">
          <Image src={logoUrl} alt={t('alt_croatia360_logo') || "Croatia360 Logo"} width={100} height={40} className="h-10 w-auto transition-opacity group-hover:opacity-90" priority />
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.labelKey} href={`/${currentLocale}${link.href}`} className={`transition-all duration-200 ${link.isPrimary ? 'text-primary font-semibold hover:text-primary/90' : 'text-foreground/70 hover:text-foreground'}`}>
              {t(link.labelKey)}
            </Link>
          ))}
          {userNavLinks.map((link) => (
             <Link key={link.labelKey} href={`/${currentLocale}${link.href}`} className="transition-colors hover:text-primary text-foreground/80">
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
          <LanguageSwitcher currentLocale={currentLocale} />
          <ThemeSwitcher />
          {!authChecked ? (<div className="h-8 w-24 animate-pulse bg-muted rounded-md"></div>) : user ? (
            <div className="flex items-center space-x-3">
              <Link href={`/${currentLocale}/my-trip`} className="text-sm font-medium hover:text-primary">{displayName}</Link>
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10" onClick={async () => { await supabase.auth.signOut(); setUser(null); }}>{t('header_logout')}</Button>
            </div>
          ) : (
            <Link href={`/${currentLocale}/login`}><Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground"><User className="h-5 w-5 mr-2" />{t('header_login')}</Button></Link>
          )}
        </div>
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSwitcher currentLocale={currentLocale} />
          <ThemeSwitcher />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}<span className="sr-only">{isMobileMenuOpen ? t('header_close_menu') : t('header_open_menu')}</span></Button></SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[320px] bg-background text-foreground p-0 flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-border">
                  <Link href={`/${currentLocale}/`} className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}><Image src={logoUrl} alt={t('alt_croatia360_logo')} width={30} height={30} className="h-8 w-auto" /><span className="font-semibold text-lg text-primary">Croatia360</span></Link>
                  <SheetClose asChild><Button variant="ghost" size="icon" className="text-muted-foreground"><X className="h-6 w-6" /><span className="sr-only">{t('header_close_menu')}</span></Button></SheetClose>
                </div>
                <nav className="flex-grow flex flex-col space-y-1 p-4 text-base">
                   {navLinks.map((link) => (<SheetClose key={link.labelKey} asChild><Link href={`/${currentLocale}${link.href}`} className={`block px-3 py-2 rounded-md hover:bg-muted transition-colors ${link.isPrimary ? 'text-primary font-semibold' : 'text-foreground/90'}`}>{t(link.labelKey)}</Link></SheetClose>))}
                   {userNavLinks.map((link) => (<SheetClose key={link.labelKey} asChild><Link href={`/${currentLocale}${link.href}`} className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground/90">{t(link.labelKey)}</Link></SheetClose>))}
                </nav>
                <div className="p-4 border-t border-border">
                  {!authChecked ? (<div className="h-8 w-full animate-pulse bg-muted rounded-md mb-2"></div>) : user ? (
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium px-3 py-2 text-foreground/80">{t('logged_in_as') || "Prijavljeni kao:"} {displayName}</span>
                        <Button variant="outline" size="sm" className="w-full border-destructive text-destructive hover:bg-destructive/10" onClick={async () => { await supabase.auth.signOut(); setUser(null); setIsMobileMenuOpen(false); }}>{t('header_logout')}</Button>
                      </div>
                  ) : (
                    <SheetClose asChild><Link href={`/${currentLocale}/login`} className="w-full"><Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"><User className="h-5 w-5 mr-2" />{t('login_register_button') || "Prijava / Registracija"}</Button></Link></SheetClose>
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
