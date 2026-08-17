export const BRAND = {
  name: 'AdriaticByBoat',
  shortName: 'AdriaticByBoat',
  domain: 'adriaticbyboat.com',
  url: 'https://adriaticbyboat.com',
  tagline: 'Boat trips, private tours and rentals from trusted local operators on the Adriatic.',
  description: 'Discover and request authentic boat trips, private tours and rentals from trusted local operators, starting in Zadar and expanding across the Adriatic coast.',
  bookingReferencePrefix: 'ABB',
} as const;

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BRAND.url}${normalized}`;
}
