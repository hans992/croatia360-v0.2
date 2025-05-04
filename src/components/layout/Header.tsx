"use client"; 

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Globe, User, Menu, X } from 'lucide-react';
import { useState } from 'react'; 
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useScrollDirection } from '@/hooks/useScrollDirection'; 

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection(); 

  const headerHeightClass = 'h-14'; 
  const hiddenHeaderClass = '-top-14'; 

  return (
    <header 
      className={`
        sticky w-full z-50 /* Overall positioning and stack order */
        ${headerHeightClass} /* Define height */
        transition-all duration-300 ease-in-out /* Animate position change */
        ${scrollDirection === 'down' ? hiddenHeaderClass : 'top-0'} /* Hide/show logic */
        /* Remove background styles from the main header tag */
      `}
    >
      {/* --- NEW: Background Element --- */}
      <div 
        className="absolute inset-0 z-[-1] /* Position behind content */
                   pastel-gradient-bg bg-opacity-95 /* Apply gradient and transparency */
                   backdrop-blur-md /* Apply blur */
                   shadow-md /* Apply shadow to the background layer */
                  " 
        aria-hidden="true" // Hide from screen readers
      />
      
      {/* --- Content Container - sits ON TOP of the background div --- */}
      <div className="relative container flex h-full items-center justify-between px-4"> 
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo-croatia360.png" alt="Croatia360 Logo" width={150} height={30} priority />
        </Link>

        {/* Desktop Navigation - Use text color with good contrast */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
           {/* Using dark text assuming parts of the pastel gradient might be very light */}
           {/* TRY ADJUSTING THESE COLORS based on your gradient */}
           <Link href="/explore" className="transition-colors hover:text-gray-900/80 text-gray-700">Istraži</Link>
           <Link href="/" className="transition-colors hover:text-gray-900/80 text-gray-900 font-semibold">SARA AI</Link> 
           <Link href="/my-trip" className="transition-colors hover:text-gray-900/80 text-gray-700">Moje putovanje</Link>
           <Link href="/community" className="transition-colors hover:text-gray-900/80 text-gray-700">Zajednica</Link>
        </nav>

        {/* Right Section: Language & User - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
           {/* Use contrasting text/icon color */}
           <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900/80">
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-sm">HR</span>
          </Button>
          <Link href="/my-trip" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900/80">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Ivana Horvat</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              {/* Use contrasting icon color */}
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900/80"> 
                <Menu className="h-6 w-6" />
                <span className="sr-only">Otvori izbornik</span>
              </Button>
            </SheetTrigger>
            {/* Mobile menu content has its own solid background */}
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white"> 
              {/* ... rest of mobile menu code ... (ensure internal text colors are appropriate for white background) */}
               <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <span className="font-semibold text-gray-800">Izbornik</span>
                  <SheetClose asChild><Button variant="ghost" size="icon" className="text-gray-600"><X className="h-6 w-6" /><span className="sr-only">Zatvori izbornik</span></Button></SheetClose>
                </div>
                <nav className="flex flex-col space-y-4 p-4 text-lg">
                  <SheetClose asChild><Link href="/explore" className="transition-colors hover:text-gray-900 text-gray-700">Istraži</Link></SheetClose>
                  <SheetClose asChild><Link href="/" className="transition-colors hover:text-gray-900 text-gray-800 font-semibold">SARA AI</Link></SheetClose>
                  <SheetClose asChild><Link href="/my-trip" className="transition-colors hover:text-gray-900 text-gray-700">Moje putovanje</Link></SheetClose>
                   <SheetClose asChild><Link href="/community" className="transition-colors hover:text-gray-900 text-gray-700">Zajednica</Link></SheetClose>
                </nav>
                <div className="mt-auto p-4 border-t">
                   <div className="flex items-center space-x-4 mb-4">
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900"><Globe className="h-5 w-5" /><span className="ml-1 text-sm">HR</span></Button>
                      <SheetClose asChild><Link href="/my-trip" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"><User className="h-5 w-5" /><span className="text-sm font-medium">Ivana Horvat</span></Link></SheetClose>
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
