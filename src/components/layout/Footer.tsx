"use client";

import { useState, FormEvent, JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'; // Added social icons

const Footer = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setMessage('Molimo unesite email adresu.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Molimo unesite ispravnu email adresu.');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    try {
      // Mocking API call for now, replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   setMessage(data.message || 'Hvala na prijavi!');
      //   setEmail('');
      // } else {
      //   setMessage(data.error || 'Došlo je do greške. Pokušajte ponovno.');
      // }
      setMessage('Hvala na prijavi! Uskoro ćete primati naše novosti.'); // Mock success
      setEmail('');
    } catch (error) {
      console.error('Greška prilikom slanja prijave:', error);
      setMessage('Došlo je do mrežne greške. Provjerite vezu i pokušajte ponovno.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Section 1: Brand & About */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-3 mb-3">
            {/* Using kuna.png as SARA AI logo, to be refined later if a separate Croatia360 logo is made */}
            <Image src="/images/logo-croatia360.png" alt="Croatia360 Logo" width={150} height={150} />
          </Link>
          <p className="text-sm text-muted-foreground">
            Vaš personalizirani AI vodič za otkrivanje čuda Hrvatske. Sofisticirano, elegantno, nezaboravno.
          </p>
          <Link href="/about" className="text-sm text-primary hover:underline">Saznajte više o nama</Link>
        </div>

        {/* Section 2: Quick Links */}
        <div className="">
          <h4 className="text-lg font-semibold text-foreground mb-4">Navigacija</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors">Istraži destinacije</Link></li>
            <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">SARA AI Planer</Link></li>
            <li><Link href="/my-trip" className="text-muted-foreground hover:text-primary transition-colors">Moje putovanje</Link></li>
            {/* <li><Link href="/community" className="text-muted-foreground hover:text-primary transition-colors">Zajednica</Link></li> */}
            <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog & Savjeti</Link></li> 
          </ul>
        </div>

        {/* Section 3: Legal & Support */}
        <div className="">
          <h4 className="text-lg font-semibold text-foreground mb-4">Podrška</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Kontaktirajte nas</Link></li>
            <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">Česta pitanja</Link></li>
            <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Uvjeti korištenja</Link></li>
            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Politika privatnosti</Link></li>
          </ul>
        </div>

        {/* Section 4: Newsletter & Social */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Budite u toku</h4>
            <p className="text-sm text-muted-foreground mb-3">Primajte inspiraciju i ekskluzivne ponude direktno u Vaš sandučić.</p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Vaša email adresa"
                className="flex-grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label="Email adresa za newsletter"
              />
              <Button
                type="submit"
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Slanje...' : 'Pretplati se'}
              </Button>
            </form>
            {message && (
              <p className={`text-xs mt-2 ${message.includes('Hvala') ? 'text-green-600' : 'text-destructive'}`}>
                {message}
              </p>
            )}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">Pratite nas</h4>
            <div className="flex space-x-3">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={20} /></Link>
              <Link href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors"><Youtube size={20} /></Link>
            </div>
          </div> 
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-6 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Croatia360 by SARA AI. Sva prava pridržana.</p>
          {/* Language Selector - Placeholder, functionality to be implemented */}
          <div className="flex space-x-3 mt-2 md:mt-0">
            <span>HR</span>
            {/* <Link href="#" className="hover:text-primary">EN</Link>
            <Link href="#" className="hover:text-primary">DE</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

