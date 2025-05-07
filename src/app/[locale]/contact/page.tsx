// src/app/[locale]/contact/page.tsx
'use client'; 

import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next'; 
import { defaultNS } from '@/lib/i18n/settings'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';   
import { Textarea } from '@/components/ui/textarea'; 

/**
 * ContactPage Component
 *
 * Provides a dedicated page for users to contact the Croatia360 team.
 * Features a contact form similar to the one on the About page.
 */
export default function ContactPage() {
  // Initialize translation hook for the 'common' namespace
  const { t } = useTranslation(defaultNS);

  // State for form data fields
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '', // Last name field
    email: '',
    poruka: '',  // Message field
  });

  // State for managing submission status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles changes in form input fields.
   * @param e - The change event from the input or textarea element.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission.
   * Performs basic validation and sends data to the contact API endpoint.
   * @param e - The form submission event.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser submission
    setError(null); // Reset error before validation
    setSuccess(null); // Reset success message

    // --- Basic Client-Side Validation ---
    // Reuse translation keys from the 'about' contact form for errors/labels
    if (!formData.ime.trim()) {
      setError(t('about_contact_error_name_required'));
      return;
    }
    // Simple email validation regex
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError(t('about_contact_error_invalid_email'));
      return;
    }
    if (!formData.poruka.trim()) {
      setError(t('about_contact_error_message_required'));
      return;
    }
    // --- End Validation ---

    setLoading(true); // Indicate loading state

    try {
      // Send data to the API route (ensure this route exists and handles the data)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (res.ok) {
        // Success: Display success message and clear the form
        setSuccess(t('about_contact_success_message'));
        setFormData({ ime: '', prezime: '', email: '', poruka: '' });
      } else {
        // Error from API: Display API error or a generic one
        setError(responseData.error || t('about_contact_error_send_failed'));
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      // Network or other fetch error
      setError(t('about_contact_error_network'));
    } finally {
      // Reset loading state regardless of outcome
      setLoading(false);
    }
  };

  return (
    // Page container with standard padding
    <div className="container mx-auto px-4 py-12">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-4 text-center text-primary">
        {t('contact_page_title')} {/* New translation key */}
      </h1>
      {/* Introductory Text */}
      <p className="mb-8 text-center text-muted-foreground max-w-xl mx-auto">
        {t('contact_page_intro')} {/* New translation key */}
      </p>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md mx-auto border border-border p-6 sm:p-8 rounded-lg shadow-lg bg-card"
        noValidate // Disable browser validation in favor of our custom validation
      >
        {/* Display feedback messages */}
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-700 dark:text-green-400 p-3 rounded-md text-sm">{success}</div>}

        {/* Form Fields using reused UI components */}
        {/* Note: Reusing translation keys from 'about' contact form for labels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ime" className="block text-sm font-medium text-muted-foreground mb-1">
              {t('about_contact_label_name')} *
            </label>
            <Input
              type="text"
              name="ime"
              id="ime"
              value={formData.ime}
              onChange={handleChange}
              required
              disabled={loading}
              aria-describedby={error && formData.ime.trim() === '' ? 'name-error' : undefined}
            />
            {/* Example for more specific error association (optional) */}
            {/* {error === t('about_contact_error_name_required') && <p id="name-error" className="text-xs text-destructive mt-1">{error}</p>} */}
          </div>

          <div>
            <label htmlFor="prezime" className="block text-sm font-medium text-muted-foreground mb-1">
              {t('about_contact_label_lastname')}
            </label>
            <Input
              type="text"
              name="prezime"
              id="prezime"
              value={formData.prezime}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
            {t('about_contact_label_email')} *
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            aria-describedby={error && (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) ? 'email-error' : undefined}
          />
           {/* {error === t('about_contact_error_invalid_email') && <p id="email-error" className="text-xs text-destructive mt-1">{error}</p>} */}
        </div>

        <div>
          <label htmlFor="poruka" className="block text-sm font-medium text-muted-foreground mb-1">
            {t('about_contact_label_message')} *
          </label>
          <Textarea
            name="poruka"
            id="poruka"
            value={formData.poruka}
            onChange={handleChange}
            required
            rows={5} // Increased rows slightly for dedicated page
            disabled={loading}
            aria-describedby={error && formData.poruka.trim() === '' ? 'message-error' : undefined}
          />
           {/* {error === t('about_contact_error_message_required') && <p id="message-error" className="text-xs text-destructive mt-1">{error}</p>} */}
        </div>

        {/* Submission Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {/* Reuse translation keys for button text */}
          {loading ? t('about_contact_button_sending') : t('about_contact_button_send')}
        </Button>
      </form>
    </div>
  );
}