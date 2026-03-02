// src/app/[locale]/blog/page.tsx
import { getServerTranslations } from "@/lib/i18n/server";
import {
  locales as appLocalesStringArray,
  defaultNS,
  fallbackLng,
  type Locale,
} from "@/lib/i18n/settings";
import { blogTips } from "@/lib/blogTips";
import BlogTipCard from "@/components/BlogTipCard";

interface PageParams {
  locale: string;
}

interface BlogPageProps {
  params: Promise<PageParams>;
}

export default async function BlogPage(props: BlogPageProps) {
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
      `[blog/page.tsx] Invalid or unsupported locale '${resolvedParams?.locale}'. Using fallback: ${fallbackLng}`
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
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-12 md:mb-16">
        <h1 className="section-title mb-2">{t("blog_title")}</h1>
        <p className="text-body-lg text-muted-foreground max-w-2xl">
          {t("blog_subtitle")}
        </p>
      </div>
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        aria-label={t("blog_title")}
      >
        {blogTips.map((tip, i) => (
          <div
            key={tip.slug}
            className="animate-hero-slide-up"
            style={{
              animationDelay: `${0.1 + i * 0.05}s`,
              animationFillMode: "backwards",
            }}
          >
            <BlogTipCard
              slug={tip.slug}
              titleKey={tip.titleKey}
              descriptionKey={tip.descriptionKey}
              imageUrl={tip.imageUrl}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
