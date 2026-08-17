// src/components/layout/Footer.tsx
"use client";

import { useState, FormEvent, JSX } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, ShipWheel } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';
import { BRAND } from '@/lib/brand';

interface FooterProps {
  locale: Locale;
}

const Footer = ({ locale }: FooterProps): JSX.Element => {
  const { t } = useTranslation(defaultNS);
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
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({} as { message?: string; error?: string }));
      if (!response.ok) setMessage(data?.error || t('footer_subscribe_error_network'));
      else {
        setMessage(t('footer_subscribe_success'));
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      setMessage(t('footer_subscribe_error_network'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 text-card-foreground border-t border-border mt-20 py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link href={`/${locale}/`} className="inline-flex items-center gap-2.5 mb-3" aria-label={`${BRAND.name} home`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20"><ShipWheel className="h-5 w-5" /></span>
            <span className="font-heading text-xl font-extrabold tracking-tight">Adriatic<span className="text-primary">ByBoat</span></span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">{BRAND.tagline}</p>
          <Link href={`/${locale}/about`} className="text-sm text-primary hover:underline">{t('footer_learn_more')}</Link>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-4">{t('footer_navigation')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/${locale}/zadar/boat-tours`} className="text-muted-foreground hover:text-primary transition-colors">Boat tours from Zadar</Link></li>
            <li><Link href={`/${locale}/explore`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_explore_destinations')}</Link></li>
            <li><Link href={`/${locale}/#sara-ai-planner`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_sara_ai_planner')}</Link></li>
            <li><Link href={`/${locale}/blog`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_blog_tips')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-4">{t('footer_support')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/${locale}/contact`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_contact_us')}</Link></li>
            <li><Link href={`/${locale}/faq`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_faq')}</Link></li>
            <li><Link href={`/${locale}/terms`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_terms_of_use')}</Link></li>
            <li><Link href={`/${locale}/privacy`} className="text-muted-foreground hover:text-primary transition-colors">{t('footer_privacy_policy')}</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-3">{t('footer_stay_updated')}</h4>
            <p className="text-sm text-muted-foreground mb-3">{t('footer_newsletter_prompt')}</p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
              <Input type="email" placeholder={t('footer_email_placeholder')} className="flex-grow" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} aria-label={t('footer_email_placeholder')} />
              <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap" disabled={isSubmitting}>
                {isSubmitting ? t('footer_subscribing_button') : t('footer_subscribe_button')}
              </Button>
            </form>
            {message && <p className={`text-caption mt-2 ${message === t('footer_subscribe_success') ? 'text-success' : 'text-destructive'}`}>{message}</p>}
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-3">{t('footer_follow_us')}</h4>
            <div className="flex space-x-3">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 mt-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between gap-2 items-center text-sm text-muted-foreground">
          <p>© {currentYear} {BRAND.name}. All rights reserved.</p>
          <p className="text-xs">Local boat experiences on the Adriatic.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
