// app/privacy-policy/page.tsx
"use client"; // Necessary for components using client-side hooks like useTranslation.

import { useTranslation } from 'react-i18next'; // Or your chosen i18n library hook.
// Ensure your i18n setup (e.g., i18n.js, next-i18next.config.js) is correctly configured
// to load translations from your 'common' namespace (or whichever namespace you use).

/**
 * PrivacyPolicyPage Component
 *
 * Renders the privacy policy content for the AI Tourist Guide application.
 * Content is fetched using an i18n translation hook, allowing for multilingual support.
 * The styling assumes Tailwind CSS with the Typography plugin for prose content.
 */
export default function PrivacyPolicyPage() {
    // Initialize the translation hook, targeting the 'common' namespace
    // where privacy policy and other shared translations are stored.
    const { t } = useTranslation('common');

    // Dynamically generate the current date for the "Last Updated" section.
    // Format according to Croatian locale conventions.
    const currentDate = new Date().toLocaleDateString('hr-HR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
      // Main container for the privacy policy page, centered and with responsive padding.
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <header className="mb-10 sm:mb-12 lg:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            {/* Page title, fetched from translations. */}
            {t('privacyPolicy.pageTitle')}
          </h1>
        </header>

        {/* Article container using Tailwind Typography plugin for rich text formatting. */}
        <article className="prose prose-slate lg:prose-lg max-w-none dark:prose-invert">
          {/* Introduction Section */}
          <section>
            <h2>{t('privacyPolicy.sections.intro.title')}</h2>
            <p>{t('privacyPolicy.sections.intro.p1')}</p>
            <p>{t('privacyPolicy.sections.intro.p2')}</p>
          </section>

          {/* Data Collection Section */}
          <section>
            <h2>{t('privacyPolicy.sections.dataCollection.title')}</h2>
            <p>{t('privacyPolicy.sections.dataCollection.p1')}</p>
            <ul>
              <li>
                <strong>{t('privacyPolicy.sections.dataCollection.list.item1_label')}</strong>{' '}
                {t('privacyPolicy.sections.dataCollection.list.item1_text')}
              </li>
              <li>
                <strong>{t('privacyPolicy.sections.dataCollection.list.item2_label')}</strong>{' '}
                {t('privacyPolicy.sections.dataCollection.list.item2_text')}
              </li>
              <li>
                <strong>{t('privacyPolicy.sections.dataCollection.list.item3_label')}</strong>{' '}
                {t('privacyPolicy.sections.dataCollection.list.item3_text')}
              </li>
            </ul>
            <h3>{t('privacyPolicy.sections.dataCollection.purposeSubheading')}</h3>
            <p>{t('privacyPolicy.sections.dataCollection.purposeP1')}</p>
            <ul>
              <li>{t('privacyPolicy.sections.dataCollection.purposeList.item1')}</li>
              <li>{t('privacyPolicy.sections.dataCollection.purposeList.item2')}</li>
              <li>{t('privacyPolicy.sections.dataCollection.purposeList.item3')}</li>
              <li>{t('privacyPolicy.sections.dataCollection.purposeList.item4')}</li>
            </ul>
          </section>

          {/* Data Sharing Section */}
          <section>
            <h2>{t('privacyPolicy.sections.dataSharing.title')}</h2>
            <p>{t('privacyPolicy.sections.dataSharing.p1')}</p>
            <p>{t('privacyPolicy.sections.dataSharing.p2')}</p>
            <ul>
              <li>
                <strong>{t('privacyPolicy.sections.dataSharing.servicesList.item1_label')}</strong>{' '}
                {t('privacyPolicy.sections.dataSharing.servicesList.item1_text')}
              </li>
              <li>
                <strong>{t('privacyPolicy.sections.dataSharing.servicesList.item2_label')}</strong>{' '}
                {t('privacyPolicy.sections.dataSharing.servicesList.item2_text')}
              </li>
              <li>
                <strong>{t('privacyPolicy.sections.dataSharing.servicesList.item3_label')}</strong>{' '}
                {t('privacyPolicy.sections.dataSharing.servicesList.item3_text')}
              </li>
            </ul>
            <p>{t('privacyPolicy.sections.dataSharing.p3')}</p>
            <p>{t('privacyPolicy.sections.dataSharing.p4')}</p>
          </section>

          {/* User Rights Section (GDPR) */}
          <section>
            <h2>{t('privacyPolicy.sections.yourRights.title')}</h2>
            <p>{t('privacyPolicy.sections.yourRights.p1')}</p>
            <ul>
              <li><strong>{t('privacyPolicy.sections.yourRights.rightsList.item1_label')}</strong> {t('privacyPolicy.sections.yourRights.rightsList.item1_text')}</li>
              <li><strong>{t('privacyPolicy.sections.yourRights.rightsList.item2_label')}</strong> {t('privacyPolicy.sections.yourRights.rightsList.item2_text')}</li>
              <li><strong>{t('privacyPolicy.sections.yourRights.rightsList.item3_label')}</strong> {t('privacyPolicy.sections.yourRights.rightsList.item3_text')}</li>
              <li><strong>{t('privacyPolicy.sections.yourRights.rightsList.item4_label')}</strong> {t('privacyPolicy.sections.yourRights.rightsList.item4_text')}</li>
              <li><strong>{t('privacyPolicy.sections.yourRights.rightsList.item5_label')}</strong> {t('privacyPolicy.sections.yourRights.rightsList.item5_text')}</li>
              <li><strong>{t('privacyPolicy.sections.yourRights.rightsList.item6_label')}</strong> {t('privacyPolicy.sections.yourRights.rightsList.item6_text')}</li>
              <li><strong>{t('privacyPolicy.sections.yourRights.rightsList.item7_label')}</strong> {t('privacyPolicy.sections.yourRights.rightsList.item7_text')}</li>
            </ul>
            {/* Contact instructions now point to a contact form, not a direct email. */}
            <p>{t('privacyPolicy.sections.yourRights.contactP1')}</p>
            <p>{t('privacyPolicy.sections.yourRights.complaintP1')}</p>
          </section>

          {/* Cookies and Analytics Section */}
          <section>
            <h2>{t('privacyPolicy.sections.cookies.title')}</h2>
            <p>{t('privacyPolicy.sections.cookies.p1')}</p>
            <h3>{t('privacyPolicy.sections.cookies.purposeSubheading')}</h3>
            <p>{t('privacyPolicy.sections.cookies.purposeP1')}</p>
            <ul>
              <li><strong>{t('privacyPolicy.sections.cookies.cookiesList.item1_label')}</strong> {t('privacyPolicy.sections.cookies.cookiesList.item1_text')}</li>
              <li><strong>{t('privacyPolicy.sections.cookies.cookiesList.item2_label')}</strong> {t('privacyPolicy.sections.cookies.cookiesList.item2_text')}</li>
            </ul>
            {/* Explicitly states no marketing cookies are used. */}
            <p className="font-semibold">{t('privacyPolicy.sections.cookies.noMarketingP1')}</p>
            <h3>{t('privacyPolicy.sections.cookies.managementSubheading')}</h3>
            <p>{t('privacyPolicy.sections.cookies.managementP1')}</p>
          </section>

          {/* Data Security Section */}
          <section>
            <h2>{t('privacyPolicy.sections.dataSecurity.title')}</h2>
            <p>{t('privacyPolicy.sections.dataSecurity.p1')}</p>
            <p>{t('privacyPolicy.sections.dataSecurity.p2')}</p>
          </section>

          {/* Minors/Children's Privacy Section */}
          <section>
            <h2>{t('privacyPolicy.sections.minors.title')}</h2>
            <p>{t('privacyPolicy.sections.minors.p1')}</p>
          </section>

          {/* Policy Changes Section */}
          <section>
            <h2>{t('privacyPolicy.sections.policyChanges.title')}</h2>
            <p>{t('privacyPolicy.sections.policyChanges.p1')}</p>
            <p>{t('privacyPolicy.sections.policyChanges.p2')}</p>
            {/* Dynamically injects the current date into the translated string. */}
            <p className="italic">
                {t('privacyPolicy.sections.policyChanges.lastUpdatedP1', { currentDate: currentDate })}
            </p>
          </section>

          {/* Footer contact information */}
          <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('privacyPolicy.contactFooter.p1')}
            </p>
          </footer>
        </article>
      </div>
    );
  }