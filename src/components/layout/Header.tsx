"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Globe, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { supabase } from '@/lib/supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: { name?: string; avatar_url?: string };
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } else {
        setUser(data.user as SupabaseUser | null);
      }
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as SupabaseUser | null ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const headerHeightClass = 'h-16'; // Slightly increased height for a more spacious feel
  const hiddenHeaderClass = '-top-16';

  const displayName = user?.user_metadata?.name || user?.email || (user ? "Korisnik" : "");
  // const avatar = user?.user_metadata?.avatar_url; // Avatar not used in this design for now

  return (
    <header
      className={`
        sticky w-full z-50 
        bg-background text-foreground shadow-md 
        ${headerHeightClass}
        transition-all duration-300 ease-in-out
        ${scrollDirection === 'down' ? hiddenHeaderClass : 'top-0'}
      `}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo-croatia360.png" alt="Croatia360 Logo" width={100} height={100} priority /> 
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/explore" className="transition-colors hover:text-primary text-foreground/80">Istraži</Link>
          <Link href="/" className="transition-colors hover:text-primary text-primary font-semibold">SARA AI</Link>
          {user && (
            <Link href="/my-trip" className="transition-colors hover:text-primary text-foreground/80">Moje putovanje</Link>
          )}
          {/* <Link href="/community" className="transition-colors hover:text-primary text-foreground/80">Zajednica</Link> */}
        </nav>

        {/* Right Section: Language & User - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          
          {user ? (
            <div className="flex items-center space-x-3">
              <Link href="/my-trip" className="text-sm font-medium hover:text-primary">
                 {displayName}
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={async () => { await supabase.auth.signOut(); setUser(null); }}
              >
                Odjava
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <User className="h-5 w-5 mr-2" />
                Prijava
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Otvori izbornik</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[320px] bg-background text-foreground p-0">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b border-border">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image src="/images/kuna.png" alt="SARA AI Logo" width={30} height={30} />
                    <span className="font-semibold text-lg text-primary">Croatia360</span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Zatvori izbornik</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col space-y-1 p-4 text-base">
                  <SheetClose asChild><Link href="/explore" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground/90">Istraži</Link></SheetClose>
                  <SheetClose asChild><Link href="/" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-primary font-semibold">SARA AI</Link></SheetClose>
                  {user && (
                    <SheetClose asChild><Link href="/my-trip" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground/90">Moje putovanje</Link></SheetClose>
                  )}
                  {/* <SheetClose asChild><Link href="/community" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground/90">Zajednica</Link></SheetClose> */}
                </nav>
                <div className="mt-auto p-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" className="text-foreground/80 hover:text-primary w-full justify-start">
                      <Globe className="h-5 w-5 mr-2" />
                      <span>Hrvatski (HR)</span>
                    </Button>
                   </div>
                  {user ? (
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium px-3 py-2 text-foreground/80">Prijavljeni kao: {displayName}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-destructive text-destructive hover:bg-destructive/10"
                          onClick={async () => { await supabase.auth.signOut(); setUser(null); setIsMobileMenuOpen(false); }}
                        >
                          Odjava
                        </Button>
                      </div>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/login" className="w-full">
                        <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                          <User className="h-5 w-5 mr-2" />
                           Prijava / Registracija
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

