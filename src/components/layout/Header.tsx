"use client"; // Added directive because this component uses useState for mobile menu

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Globe, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Use Sheet for mobile menu

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo-croatia360.png" alt="Croatia360 Logo" width={150} height={30} priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/explore" className="transition-colors hover:text-foreground/80 text-foreground/60">Istraži</Link>
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">SARA AI</Link>
          <Link href="/my-trip" className="transition-colors hover:text-foreground/80 text-foreground/60">Moje putovanje</Link>
          {/* <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link> */}
        </nav>

        {/* Right Section: Language & User - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground/80">
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-sm">HR</span>
          </Button>
          <Link href="/my-trip" className="flex items-center space-x-2 text-foreground/60 hover:text-foreground/80">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Ivana Horvat</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Otvori izbornik</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <span className="font-semibold">Izbornik</span>
                  <SheetClose asChild>
                     <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Zatvori izbornik</span>
                      </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col space-y-4 p-4 text-lg">
                  <SheetClose asChild>
                    <Link href="/explore" className="transition-colors hover:text-foreground/80 text-foreground/60">Istraži</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">SARA AI</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/my-trip" className="transition-colors hover:text-foreground/80 text-foreground/60">Moje putovanje</Link>
                  </SheetClose>
                  {/* <SheetClose asChild>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
                  </SheetClose> */}
                </nav>
                <div className="mt-auto p-4 border-t">
                   <div className="flex items-center space-x-4 mb-4">
                      <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground/80">
                        <Globe className="h-5 w-5" />
                        <span className="ml-1 text-sm">HR</span>
                      </Button>
                      <SheetClose asChild>
                        <Link href="/my-trip" className="flex items-center space-x-2 text-foreground/60 hover:text-foreground/80">
                          <User className="h-5 w-5" />
                          <span className="text-sm font-medium">Ivana Horvat</span>
                        </Link>
                      </SheetClose>
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

