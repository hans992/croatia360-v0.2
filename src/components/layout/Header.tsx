"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Globe, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { supabase } from '@/lib/supabaseClient';

type SupabaseUser = {
  email?: string;
  user_metadata?: { name?: string; avatar_url?: string };
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection();

  const [user, setUser] = useState<SupabaseUser | null>(null);

  // Učitaj korisnika i slušaj promjene
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const headerHeightClass = 'h-14';
  const hiddenHeaderClass = '-top-14';

  // Prikaz korisničkog imena ili emaila
  const displayName =
    user?.user_metadata?.name ||
    user?.email ||
    (user ? "Korisnik" : "");

  // Prikaz avatara (ako postoji)
  const avatar = user?.user_metadata?.avatar_url;

  return (
    <header
      className={`
        sticky w-full z-50
        ${headerHeightClass}
        transition-all duration-300 ease-in-out
        ${scrollDirection === 'down' ? hiddenHeaderClass : 'top-0'}
      `}
    >
      <div
        className="absolute inset-0 z-[-1] pastel-gradient-bg bg-opacity-95 backdrop-blur-md shadow-md"
        aria-hidden="true"
      />
      <div className="relative container flex h-full items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo-croatia360.png" alt="Croatia360 Logo" width={150} height={30} priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/explore" className="transition-colors hover:text-gray-900/80 text-gray-700">Istraži</Link>
          <Link href="/" className="transition-colors hover:text-gray-900/80 text-gray-900 font-semibold">SARA AI</Link>
          <Link href="/my-trip" className="transition-colors hover:text-gray-900/80 text-gray-700">Moje putovanje</Link>
          <Link href="/community" className="transition-colors hover:text-gray-900/80 text-gray-700">Zajednica</Link>
        </nav>

        {/* Right Section: Language & User - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900/80">
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-sm">HR</span>
          </Button>
          {user ? (
            <div className="flex items-center space-x-2">
              {avatar && (
                <Image src={avatar} alt="Avatar" width={28} height={28} className="rounded-full" />
              )}
              <span className="text-sm font-medium">{displayName}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-gray-900/80"
                onClick={async () => { await supabase.auth.signOut(); setUser(null); }}
              >
                Odjava
              </Button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900/80">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Prijava</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900/80">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Otvori izbornik</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <span className="font-semibold text-gray-800">Izbornik</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Zatvori izbornik</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col space-y-4 p-4 text-lg">
                  <SheetClose asChild><Link href="/explore" className="transition-colors hover:text-gray-900 text-gray-700">Istraži</Link></SheetClose>
                  <SheetClose asChild><Link href="/" className="transition-colors hover:text-gray-900 text-gray-800 font-semibold">SARA AI</Link></SheetClose>
                  <SheetClose asChild><Link href="/my-trip" className="transition-colors hover:text-gray-900 text-gray-700">Moje putovanje</Link></SheetClose>
                  <SheetClose asChild><Link href="/community" className="transition-colors hover:text-gray-900 text-gray-700">Zajednica</Link></SheetClose>
                </nav>
                <div className="mt-auto p-4 border-t">
                  <div className="flex items-center space-x-4 mb-4">
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                      <Globe className="h-5 w-5" />
                      <span className="ml-1 text-sm">HR</span>
                    </Button>
                    {user ? (
                      <SheetClose asChild>
                        <div className="flex items-center space-x-2">
                          {avatar && (
                            <Image src={avatar} alt="Avatar" width={28} height={28} className="rounded-full" />
                          )}
                          <span className="text-sm font-medium">{displayName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 hover:text-gray-900/80"
                            onClick={async () => { await supabase.auth.signOut(); setUser(null); }}
                          >
                            Odjava
                          </Button>
                        </div>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Link href="/login" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                          <User className="h-5 w-5" />
                          <span className="text-sm font-medium">Prijava</span>
                        </Link>
                      </SheetClose>
                    )}
                  </div>
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
