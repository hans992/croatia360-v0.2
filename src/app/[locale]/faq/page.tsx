// src/app/[locale]/faq/page.tsx
import { getServerTranslations } from "@/lib/i18n/server";
import {
  locales as appLocalesStringArray,
  defaultNS,
  fallbackLng,
  type Locale,
} from "@/lib/i18n/settings";
import { faqItems } from "@/lib/faqItems";
import FaqAccordion from "@/components/FaqAccordion";

interface PageParams {
  locale: string;
}

interface FaqPageProps {
  params: Promise<PageParams>;
}

export default async function FaqPage(props: FaqPageProps) {
  const resolvedParams = await props.params;
  let effectiveLocale: Locale;
  let isLocaleFromParamsValid = false;

  if (
    resolvedParams &&
    typeof resolvedParams.locale === "string" &&
    appLocalesStringArray.includes(resolvedParams.locale)
  ) {
    effectiveLocale = resolvedParams.locale as Locale;
    isLocaleFromParamsValid = true;
  } else {
    console.warn(
      `[faq/page.tsx] Invalid or unsupported locale '${resolvedParams?.locale}'. Using fallback: ${fallbackLng}`
    );
    effectiveLocale = fallbackLng;
  }

  const { t } = await getServerTranslations(effectiveLocale, defaultNS);

  if (!isLocaleFromParamsValid) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 bg-red-100 border border-red-400 p-4 rounded-md dark:bg-red-950/30 dark:text-red-400 dark:border-red-800">
          {t("error_invalid_locale_message", {
            requestedLocale: resolvedParams?.locale,
            fallbackLocale: effectiveLocale,
          }) ||
            `Traženi jezik '${resolvedParams?.locale}' nije podržan. Prikazuje se ${effectiveLocale}.`}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <div className="mb-12 md:mb-16">
        <h1 className="section-title mb-2">{t("faq_title")}</h1>
        <p className="text-body-lg text-muted-foreground">
          {t("faq_subtitle")}
        </p>
      </div>
      <section aria-label={t("faq_title")}>
        <FaqAccordion items={faqItems} />
      </section>
    </div>
  );
}
