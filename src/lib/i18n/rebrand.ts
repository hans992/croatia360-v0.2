import { BRAND } from '@/lib/brand';

type TranslationValue = string | number | boolean | null | TranslationValue[] | { [key: string]: TranslationValue };

const replacements: Array<[string, string]> = [
  ['Croatia360', BRAND.name],
  ['croatia360.vercel.app', BRAND.domain],
  ['croatia360-v0-2.vercel.app', BRAND.domain],
];

function rebrandString(value: string) {
  return replacements.reduce((result, [from, to]) => result.replaceAll(from, to), value);
}

export function rebrandTranslationResource<T>(value: T): T {
  if (typeof value === 'string') return rebrandString(value) as T;
  if (Array.isArray(value)) return value.map((item) => rebrandTranslationResource(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, TranslationValue>).map(([key, item]) => [key, rebrandTranslationResource(item)]),
    ) as T;
  }
  return value;
}
