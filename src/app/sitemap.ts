import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/brand';
import { locales } from '@/lib/i18n/settings';

const publicRoutes = ['', '/zadar/boat-tours', '/about', '/faq', '/contact', '/blog'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) => publicRoutes.map((route) => ({
    url: `${BRAND.url}/${locale}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/zadar/boat-tours' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route === '/zadar/boat-tours' ? 0.95 : 0.65,
  })));
}
