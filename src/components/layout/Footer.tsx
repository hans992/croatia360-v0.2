// src/components/layout/Footer.tsx
"use client";

import { useState, FormEvent, JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Vraćamo Image
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';

interface FooterProps {
  locale: Locale;
}

const Footer = ({ locale }: FooterProps): JSX.Element => {
  const { t } = useTranslation(defaultNS);

  // URL za logo s Google Cloud Storagea
  const logoUrl = "https://storage.googleapis.com/croatiasara/images/logo-croatia360.png";

  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setMessage(t('footer_subscribe_error_enter_email'));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage(t('footer_subscribe_error_invalid_email'));
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setMessage(t('footer_subscribe_success'));
      setEmail('');
    } catch (error) {
      console.error('Greška prilikom slanja prijave:', error);
      setMessage(t('footer_subscribe_error_network'));
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
          <Link href={`/${locale}/`} className="flex items-center space-x-3 mb-3">
             {/* Koristimo Next Image s GCS URL-om */}
            <Image 
              src={logoUrl} 
              alt={t('alt_croatia360_logo') || "Croatia360 Logo"} 
              width={150} // Originalna širina
              height={49} // Originalna visina (prilagodite ako treba)
              className="h-auto w-auto max-w-[150px]" // Ograničenje veličine
              // unoptimized={true} // Uklonjeno
            />
          </Link>
          <p className="text-sm text-muted-foreground">
            {t('footer_brand_subtitle')}
          </p>
          <Link href={`/${locale}/about`} className="text-sm text-primary hover:underline">{t('footer_learn_more')}</Link>
        </div>

        {/* Section 2: Quick Links */}
        <div className="">
          <h4 className="text-lg font-semibold text-foreground mb-4">{t('footer_navigation')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/${locale}/explore`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_explore_destinations')}</Link></li>
            <li><Link href={`/${locale}/#sara-ai-planner`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_sara_ai_planner')}</Link></li>
            <li><Link href={`/${locale}/my-trip`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_my_trip_link')}</Link></li>
            <li><Link href={`/${locale}/blog`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_blog_tips')}</Link></li>
          </ul>
        </div>

        {/* Section 3: Legal & Support */}
        <div className="">
          <h4 className="text-lg font-semibold text-foreground mb-4">{t('footer_support')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/${locale}/contact`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_contact_us')}</Link></li>
            <li><Link href={`/${locale}/faq`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_faq')}</Link></li>
            <li><Link href={`/${locale}/terms`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_terms_of_use')}</Link></li>
            <li><Link href={`/${locale}/privacy`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_privacy_policy')}</Link></li>
          </ul>
        </div>

        {/* Section 4: Newsletter & Social */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">{t('footer_stay_updated')}</h4>
            <p className="text-sm text-muted-foreground mb-3">{t('footer_newsletter_prompt')}</p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder={t('footer_email_placeholder')}
                className="flex-grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label={t('footer_email_placeholder')}
              />
              <Button
                type="submit"
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('footer_subscribing_button') : t('footer_subscribe_button')}
              </Button>
            </form>
            {message && (
              <p className={`text-xs mt-2 ${message === t('footer_subscribe_success') ? 'text-green-600' : 'text-destructive'}`}>
                {message}
              </p>
            )}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3">{t('footer_follow_us')}</h4>
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
          <p>{t('footer_copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
