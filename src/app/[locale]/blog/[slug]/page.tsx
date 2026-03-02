// src/app/[locale]/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerTranslations } from "@/lib/i18n/server";
import {
  locales as appLocalesStringArray,
  defaultNS,
  fallbackLng,
  type Locale,
} from "@/lib/i18n/settings";
import { getBlogTipBySlug } from "@/lib/blogTips";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

interface PageParams {
  locale: string;
  slug: string;
}

interface BlogSlugPageProps {
  params: Promise<PageParams>;
}

export async function generateMetadata(props: BlogSlugPageProps): Promise<Metadata> {
  const resolvedParams = await props.params;
  const localeParam = resolvedParams.locale as string;
  const slug = resolvedParams.slug;
  const effectiveLocale = appLocalesStringArray.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : fallbackLng;
  const tip = getBlogTipBySlug(slug);
  if (!tip) return { title: "Croatia360" };
  const { t } = await getServerTranslations(effectiveLocale, defaultNS);
  return {
    title: `${t(tip.titleKey)} | Croatia360 Blog & Tips`,
  };
}

export default async function BlogSlugPage(props: BlogSlugPageProps) {
  const resolvedParams = await props.params;
  const { locale: localeParam, slug } = resolvedParams;

  let effectiveLocale: Locale;
  let isLocaleValid = false;
  if (
    typeof localeParam === "string" &&
    appLocalesStringArray.includes(localeParam as Locale)
  ) {
    effectiveLocale = localeParam as Locale;
    isLocaleValid = true;
  } else {
    effectiveLocale = fallbackLng;
  }

  const tip = getBlogTipBySlug(slug);
  if (!tip) notFound();

  const { t } = await getServerTranslations(effectiveLocale, defaultNS);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <Link
        href={`/${effectiveLocale}/blog`}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("blog_back_to_list")}
      </Link>

      <article>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t(tip.titleKey)}
        </h1>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">
          <Image
            src={tip.imageUrl}
            alt={t(tip.titleKey)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {t(tip.bodyKey)}
          </p>
        </div>
      </article>

      {!isLocaleValid && (
        <p className="mt-8 text-sm text-amber-600 dark:text-amber-400">
          {t("error_invalid_locale_message", {
            requestedLocale: localeParam,
            fallbackLocale: effectiveLocale,
          })}
        </p>
      )}
    </div>
  );
}
