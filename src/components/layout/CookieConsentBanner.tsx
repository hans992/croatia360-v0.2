// src/components/layout/CookieConsentBanner.tsx
"use client"; 

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link'; // For navigation to the privacy policy page.

// Define the key for storing consent status in localStorage.
const CONSENT_LOCAL_STORAGE_KEY = 'cookie_consent_status';

/**
 * CookieConsentBanner Component
 *
 * Displays a banner to inform users about cookie usage and obtain their consent.
 * The user's choice (accepted or declined) is stored in localStorage to prevent
 * the banner from reappearing on subsequent visits within the same browser.
 *
 * Styling is done using Tailwind CSS.
 */
export default function CookieConsentBanner() {
  // State to control the visibility of the banner.
  const [isVisible, setIsVisible] = useState(false);
  // i18n hook to load translations. Assumes translations are in the 'common' namespace.
  const { t, i18n } = useTranslation('common');

  // Effect to check for existing consent on component mount.
  useEffect(() => {
    // localStorage is a browser API, ensure it's accessed only on the client-side.
    if (typeof window !== 'undefined') {
      const consentStatus = localStorage.getItem(CONSENT_LOCAL_STORAGE_KEY);
      // If no consent status is found, make the banner visible.
      if (!consentStatus) {
        setIsVisible(true);
      }
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  /**
   * Handles the user's action (accept or decline).
   * @param {('accepted' | 'declined')} status - The consent status to set.
   */
  const handleConsentAction = (status: 'accepted' | 'declined') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONSENT_LOCAL_STORAGE_KEY, status);
    }
    setIsVisible(false); // Hide the banner after action.

    // Here you might want to trigger other actions based on consent, e.g.:
    // if (status === 'accepted') {
    //   // Initialize analytics, load third-party scripts that use cookies, etc.
    //   console.log("Cookie consent accepted. Initializing analytics...");
    // } else {
    //   // Ensure non-essential cookies are disabled or not loaded.
    //   console.log("Cookie consent declined for analytical cookies.");
    // }
  };

  // If the banner is not supposed to be visible (e.g., consent already given), render nothing.
  if (!isVisible) {
    return null;
  }

  // Determine the correct privacy policy link based on the current language.
  // This assumes your i18n setup provides the current language via i18n.language.
  // The paths are taken from the translation files.
  const policyLink = t('cookie_consent_banner.policy_link_url', { lng: i18n.language });

  return (
    // Banner container, fixed at the bottom of the viewport.
    <div
      className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 shadow-lg z-50"
      role="dialog"
      aria-live="assertive"
      aria-label={t('cookie_consent_banner.message')} // For accessibility
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Consent message and learn more link */}
        <div className="text-sm text-center sm:text-left">
          <p>
            {t('cookie_consent_banner.message')}
            <Link href={policyLink} className="underline hover:text-slate-300 ml-1">
              {t('cookie_consent_banner.learn_more')}
            </Link>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => handleConsentAction('declined')}
            className="px-4 py-2 text-sm font-medium rounded-md bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
            aria-label={`${t('cookie_consent_banner.decline_button')} analytical cookies`}
          >
            {t('cookie_consent_banner.decline_button')}
          </button>
          <button
            onClick={() => handleConsentAction('accepted')}
            className="px-4 py-2 text-sm font-medium rounded-md bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
            aria-label={`${t('cookie_consent_banner.accept_button')} cookies`}
          >
            {t('cookie_consent_banner.accept_button')}
          </button>
        </div>
      </div>
    </div>
  );
}