export const i18n = {
  defaultLocale: "hr",
  locales: ["hr", "en", "de", "it", "fr", "cs", "pl", "hu"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
