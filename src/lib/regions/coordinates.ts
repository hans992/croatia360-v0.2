/**
 * Region center coordinates for Croatia map zoom.
 * Used for keyword-to-region detection from chat messages.
 */

export type Coordinates = [number, number]; // [lat, lng]

export const REGION_COORDINATES: Record<string, { center: Coordinates; zoom: number }> = {
  dalmacija: { center: [43.5, 16.4], zoom: 7 },
  istra: { center: [45.1, 13.9], zoom: 8 },
  kvarner: { center: [45.3, 14.4], zoom: 8 },
  zagreb: { center: [45.81, 15.98], zoom: 10 },
  slavonija: { center: [45.5, 18.7], zoom: 8 },
  "sredisnja-hrvatska": { center: [45.2, 16.0], zoom: 8 },
  "lika-gorski-kotar": { center: [44.8, 15.0], zoom: 8 },
  peljesac: { center: [42.95, 17.2], zoom: 10 },
  dubrovnik: { center: [42.65, 18.09], zoom: 12 },
  split: { center: [43.51, 16.44], zoom: 12 },
  hvar: { center: [43.17, 16.44], zoom: 11 },
  rovinj: { center: [45.08, 13.64], zoom: 12 },
  pula: { center: [44.87, 13.85], zoom: 12 },
  zadar: { center: [44.12, 15.23], zoom: 12 },
  sibenik: { center: [43.73, 15.89], zoom: 12 },
  krka: { center: [43.8, 15.98], zoom: 11 },
  plitvice: { center: [44.88, 15.62], zoom: 11 },
  korcula: { center: [42.96, 17.14], zoom: 11 },
  dingac: { center: [42.95, 17.2], zoom: 11 },
};

const CROATIA_CENTER: Coordinates = [44.5, 15.5];
const CROATIA_ZOOM = 6;

/** Keywords that map to region slugs (lowercase) */
const KEYWORD_TO_REGION: [RegExp | string, string][] = [
  ["pelješac", "peljesac"],
  ["peljesac", "peljesac"],
  ["dingač", "dingac"],
  ["dingac", "dingac"],
  ["dubrovnik", "dubrovnik"],
  ["split", "split"],
  ["hvar", "hvar"],
  ["korčula", "korcula"],
  ["korcula", "korcula"],
  ["rovinj", "rovinj"],
  ["pula", "pula"],
  ["zadar", "zadar"],
  ["šibenik", "sibenik"],
  ["sibenik", "sibenik"],
  ["krka", "krka"],
  ["plitvice", "plitvice"],
  ["plitvička", "plitvice"],
  ["istra", "istra"],
  ["istria", "istra"],
  ["dalmacija", "dalmacija"],
  ["dalmatia", "dalmacija"],
  ["kvarner", "kvarner"],
  ["zagreb", "zagreb"],
  ["slavonija", "slavonija"],
  ["slavonia", "slavonija"],
  ["osijek", "slavonija"],
  ["požega", "slavonija"],
  ["pozega", "slavonija"],
  ["lika", "lika-gorski-kotar"],
  ["gorski kotar", "lika-gorski-kotar"],
  ["središnja", "sredisnja-hrvatska"],
  ["sredisnja", "sredisnja-hrvatska"],
];

/**
 * Extract region from text (chat message) and return center coordinates for map.
 * Returns null if no region detected.
 */
export function getRegionFromText(text: string): {
  slug: string;
  center: Coordinates;
  zoom: number;
} | null {
  const lower = text.toLowerCase();
  for (const [keyword, slug] of KEYWORD_TO_REGION) {
    const match =
      typeof keyword === "string"
        ? lower.includes(keyword)
        : keyword.test(lower);
    if (match && REGION_COORDINATES[slug]) {
      const { center, zoom } = REGION_COORDINATES[slug];
      return { slug, center, zoom };
    }
  }
  return null;
}

export function getCroatiaDefault(): { center: Coordinates; zoom: number } {
  return { center: CROATIA_CENTER, zoom: CROATIA_ZOOM };
}
