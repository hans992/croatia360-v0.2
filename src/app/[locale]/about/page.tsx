// src/app/[locale]/about/page.tsx
'use client';

import React, { useState, FormEvent } from 'react'; // Dodan FormEvent
import { useTranslation } from 'react-i18next'; // Import za i18n
import { defaultNS } from '@/lib/i18n/settings'; // Za default namespace
import { Button } from '@/components/ui/button'; // Za konzistentnost gumba
import { Input } from '@/components/ui/input';   // Za konzistentnost inputa
import { Textarea } from '@/components/ui/textarea'; // Za konzistentnost textarea

// interface AboutPageProps { // Ako stranica prima params, npr. locale
//   params: { locale: Locale };
// }

// export default function AboutPage({ params: { locale } }: AboutPageProps) { // Ako primate locale
export default function AboutPage() {
  const { t } = useTranslation(defaultNS); // Inicijalizacija i18n

  const [formData, setFormData] = useState({
    ime: '',
    prezime: '', // Prezime je bilo u formi, ali ne i u state-u, dodajem
    email: '',
    poruka: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { // Tipiziran event
    e.preventDefault();
    setError(null); // Resetiraj grešku prije validacije
    setSuccess(null); // Resetiraj uspjeh

    if (!formData.ime.trim()) {
      setError(t('about_contact_error_name_required'));
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError(t('about_contact_error_invalid_email'));
      return;
    }
    if (!formData.poruka.trim()) {
      setError(t('about_contact_error_message_required'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', { // Pretpostavljam da ova API ruta postoji
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json(); // Preimenovano da se izbjegne sukob s ESLint pravilom za 'data'

      if (res.ok) {
        setSuccess(t('about_contact_success_message'));
        setFormData({ ime: '', prezime: '', email: '', poruka: '' });
      } else {
        setError(responseData.error || t('about_contact_error_send_failed'));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) { // err je prefiksiran s _ jer se ne koristi direktno
      setError(t('about_contact_error_network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        {t('about_page_main_title')}
      </h1>

      <div className="prose dark:prose-invert max-w-none lg:prose-lg xl:prose-xl">
        <p className="mb-6">
          {t('about_intro_paragraph')}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary/90">
          {t('about_our_story_title')}
        </h2>
        <p className="mb-4">
          {t('about_our_story_paragraph')}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary/90">
          {t('about_what_we_offer_title')}
        </h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>{t('about_offer_item1')}</li>
          <li>{t('about_offer_item2')}</li>
          <li>{t('about_offer_item3')}</li>
          <li>{t('about_offer_item4')}</li>
          <li>{t('about_offer_item5')}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary/90">
          {t('about_our_values_title')}
        </h2>
        <p className="mb-4">
          {t('about_our_values_intro')}
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>{t('about_value1_title')}:</strong> {t('about_value1_description')}</li>
          <li><strong>{t('about_value2_title')}:</strong> {t('about_value2_description')}</li>
          <li><strong>{t('about_value3_title')}:</strong> {t('about_value3_description')}</li>
          <li><strong>{t('about_value4_title')}:</strong> {t('about_value4_description')}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary/90">
          {t('about_contact_us_title')}
        </h2>
        <p className="mb-4">
          {t('about_contact_us_prompt')}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-md mx-auto border border-border p-6 rounded-lg shadow-lg bg-card"
        >
          {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}
          {success && <div className="bg-green-500/10 text-green-700 dark:text-green-400 p-3 rounded-md text-sm">{success}</div>}

          <div>
            <label htmlFor="ime" className="block text-sm font-medium text-muted-foreground mb-1">
              {t('about_contact_label_name')} *
            </label>
            <Input // Korištenje shadcn/ui Input
              type="text"
              name="ime"
              id="ime"
              value={formData.ime}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="prezime" className="block text-sm font-medium text-muted-foreground mb-1">
              {t('about_contact_label_lastname')}
            </label>
            <Input // Korištenje shadcn/ui Input
              type="text"
              name="prezime"
              id="prezime"
              value={formData.prezime}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
              {t('about_contact_label_email')} *
            </label>
            <Input // Korištenje shadcn/ui Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="poruka" className="block text-sm font-medium text-muted-foreground mb-1">
              {t('about_contact_label_message')} *
            </label>
            <Textarea // Korištenje shadcn/ui Textarea
              name="poruka"
              id="poruka"
              value={formData.poruka}
              onChange={handleChange}
              required
              rows={4}
              disabled={loading}
            />
          </div>

          <Button // Korištenje shadcn/ui Button
            type="submit"
            disabled={loading}
            className="w-full" // Oslanja se na default variant
          >
            {loading ? t('about_contact_button_sending') : t('about_contact_button_send')}
          </Button>
        </form>
      </div>
    </div>
  );
}
