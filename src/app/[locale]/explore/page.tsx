// src/app/[locale]/explore/page.tsx
"use client"; // This directive indicates that this is a Client Component

// Import necessary UI components from shadcn/ui and lucide-react for icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added SelectValue
import { Star } from "lucide-react"; // Icon for ratings

// Import Next.js specific functionalities
import Image from "next/image"; // Optimized image component
import Link from "next/link"; // For client-side navigation

// Import i18n utilities
import { useTranslation } from 'react-i18next'; // Hook for using translations
import { defaultNS, type Locale, locales as validLocalesArray } from '@/lib/i18n/settings'; // i18n configuration

// Import Next.js navigation hooks
import { useParams, notFound } from 'next/navigation'; // To access route parameters and handle 404

// Import custom components
import RegionalCard from '@/components/RegionalCard'; // Card component for displaying regions

// --- Interfaces ---
// Defines the structure for a Destination object
interface Destination {
  id: string;
  nameKey: string;        // Translation key for destination name
  regionKey: string;      // Translation key for destination's region
  descriptionKey: string; // Translation key for destination description
  rating: number;
  reviews: number;
  imageUrl: string;
  featured: boolean;
  slug: string;           // URL-friendly identifier
}

// Defines the structure for a Recommendation object
interface Recommendation {
  id: string;
  typeKey: string;        // Translation key for recommendation type (e.g., accommodation, restaurant)
  nameKey: string;        // Translation key for recommendation name
  locationKey: string;    // Translation key for recommendation location
  descriptionKey: string; // Translation key for recommendation description
  rating: number;
  reviews: number;
  priceKey?: string;       // Translation key for price description (e.g., "per night")
  priceRaw?: string;       // Raw price string (e.g., "€250 / noć")
  priceCategory?: '€' | '€€' | '€€€' | '€€€€'; // Price category
  tagsKeys: string[];     // Array of translation keys for tags
  imageUrl: string;
  slug: string;
}

// Defines the structure for a Region object, used for RegionalCards
interface Region {
  id: string;
  nameKey: string;           // Translation key for region name
  descriptionKey: string;    // Translation key for region short description
  imageUrl: string;
  color1: string;            // Primary color for the region's card gradient
  color2: string;            // Secondary color for the region's card gradient
  slug: string;
}

// Base URL for images stored on Google Cloud Storage
const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

// --- Data for Regional Cards ---
// This array holds the data for each region to be displayed.
// Ensure image URLs are correct and translation keys exist.
const regionsData: Region[] = [
  {
    id: "slavonija",
    nameKey: "region_slavonija",
    descriptionKey: "region_slavonija_description_short",
    imageUrl: `${gcsBaseUrl}Slavonija_zito.jpg`, // Suggesting a specific card image
    color1: '#FFD700', // Gold
    color2: '#8B4513', // SaddleBrown
    slug: "slavonija",
  },
  {
    id: "sredisnja_hrvatska",
    nameKey: "region_sredisnja",
    descriptionKey: "region_sredisnja_description_short",
    imageUrl: `${gcsBaseUrl}Sredisnja_Hrvatska.jpg`,
    color1: '#800020', // Burgundy
    color2: '#2E8B57', // SeaGreen
    slug: "sredisnja-hrvatska",
  },
  {
    id: "zagreb",
    nameKey: "region_zagreb",
    descriptionKey: "region_zagreb_description_short",
    imageUrl: `${gcsBaseUrl}regions/zagreb/Zagreb_dron_image.jpg`,
    color1: '#5D3FD3', // UPDATED: Regal Purple / Iris
    color2: '#EAE0D5', // UPDATED: Warm Parchment / Light Beige
    slug: "zagreb",
  },
  {
    id: "lika_gorski_kotar",
    nameKey: "region_lika_gorski_kotar",
    descriptionKey: "region_lika_gorski_kotar_description_short",
    imageUrl: `${gcsBaseUrl}regions/lika_gorski_kotar/Zavizan_house.jpg`,
    color1: '#228B22', // ForestGreen
    color2: '#40E0D0', // Turquoise
    slug: "lika-gorski-kotar",
  },
  {
    id: "istra",
    nameKey: "region_istra",
    descriptionKey: "region_istra_description_short",
    imageUrl: `${gcsBaseUrl}regions/istra/Rovinj_from_distance.jpg`,
    color1: '#E07A5F', // Terra Cotta
    color2: '#808000', // Olive
    slug: "istra",
  },
  {
    id: "kvarner", // NEWLY ADDED REGION
    nameKey: "region_kvarner",
    descriptionKey: "region_kvarner_description_short", // Ensure this key exists in i18n files
    imageUrl: `${gcsBaseUrl}regions/kvarner/Rijeka_grad`, // Ensure this image exists
    color1: '#009688', // Teal
    color2: '#CFD8DC', // Blue Grey
    slug: "kvarner",
  },
  {
    id: "dalmacija",
    nameKey: "region_dalmacija",
    descriptionKey: "region_dalmacija_description_short",
    imageUrl: `${gcsBaseUrl}regions/dalmacija/Primosten_aerial.jpg`,
    color1: '#007FFF', // Azure Blue (Kept as is, now distinct from Zagreb)
    color2: '#F8F8FF', // GhostWhite
    slug: "dalmacija",
  },
];


// --- ExplorePage Component ---
export default function ExplorePage() {
  // --- Hooks ---
  const params = useParams(); // Access route parameters (e.g., locale)
  const { t } = useTranslation(defaultNS); // Initialize translation hook with default namespace

  // --- Locale Validation ---
  // Extracts locale from URL params and validates it against the list of supported locales.
  const localeParam = params.locale;
  if (typeof localeParam !== 'string' || !validLocalesArray.includes(localeParam as Locale)) {
    notFound(); // If locale is invalid, show a 404 page
  }
  const currentLocale = localeParam as Locale; // Cast to Locale type after validation

  // --- Mock Data for Popular Destinations and Recommendations ---
  // In a real application, this data would be fetched from an API or database.
  const popularDestinations: Destination[] = [
    { id: "sibenik", nameKey: "destination_sibenik_name", regionKey: "region_dalmacija", descriptionKey: "destination_sibenik_description", rating: 4.9, reviews: 2450, imageUrl: `${gcsBaseUrl}regions/dalmacija/Sibenik_from_the_sea.jpg`, featured: true, slug: "sibenik" },
    { id: "trogir", nameKey: "destination_trogir_name", regionKey: "region_dalmacija", descriptionKey: "destination_trogir_description", rating: 4.8, reviews: 1890, imageUrl: `${gcsBaseUrl}regions/dalmacija/Trogir_aerial.jpg`, featured: false, slug: "trogir" },
    { id: "opatija", nameKey: "destination_opatija_name", regionKey: "region_kvarner", descriptionKey: "destination_opatija_description", rating: 4.7, reviews: 980, imageUrl: `${gcsBaseUrl}Opatija.jpg`, featured: false, slug: "opatija" },
  ];

  const recommendations: Recommendation[] = [
    { id: "hotel_opatija", typeKey: "recommendation_type_accommodation", nameKey: "recommendation_opatija_hotel_name", locationKey: "recommendation_opatija_hotel_location", descriptionKey: "recommendation_opatija_hotel_description", rating: 4.9, reviews: 320, priceRaw: "€250 / noć", priceCategory: "€€€€", tagsKeys: ["tag_spa", "tag_pool", "tag_restaurant"], imageUrl: `${gcsBaseUrl}Opatija.jpg`, slug: "luxury-seaside-resort-opatija" },
    { id: "kulen_tour_osijek", typeKey: "recommendation_type_restaurant", nameKey: "recommendation_kulen_tour_name", locationKey: "recommendation_kulen_tour_location", descriptionKey: "recommendation_kulen_tour_description", rating: 4.9, reviews: 189, priceRaw: "35€ / osoba", priceCategory: "€€", tagsKeys: ["tag_kulen", "tag_gourmet", "tag_local"], imageUrl: `${gcsBaseUrl}food_slavonia.jpg`, slug: "kulen-tour-osijek" },
    { id: "krka_tour", typeKey: "recommendation_type_activity", nameKey: "recommendation_krka_tour_name", locationKey: "recommendation_krka_tour_location", descriptionKey: "recommendation_krka_tour_description", rating: 4.8, reviews: 1500, priceRaw: "€40 / osoba", priceCategory: "€€", tagsKeys: ["tag_nature", "tag_waterfalls", "tag_hiking"], imageUrl: `${gcsBaseUrl}regions/dalmacija/Visovac_Monastery_NP_Krka.jpg`, slug: "krka-national-park-tour" },
  ];

  // --- Filter Options ---
  // Data for populating filter dropdowns. Labels are translation keys.
  const categoryOptions = [
    { value: "all", labelKey: "filter_category_all" },
    { value: "accommodation", labelKey: "filter_category_accommodation" },
    { value: "food", labelKey: "filter_category_food" },
    { value: "activities", labelKey: "filter_category_activities" },
    { value: "events", labelKey: "filter_category_events" },
    { value: "sights", labelKey: "filter_category_sights" },
  ];

  const regionFilterOptions = [ // Renamed to avoid conflict with regionsData
    { value: "all", labelKey: "filter_region_all" },
    { value: "istra", labelKey: "region_istra" },
    { value: "kvarner", labelKey: "region_kvarner" },
    { value: "dalmacija", labelKey: "region_dalmacija" },
    { value: "slavonija", labelKey: "region_slavonija" },
    { value: "sredisnja-hrvatska", labelKey: "region_sredisnja" }, // Ensure slug matches
    { value: "zagreb", labelKey: "region_zagreb" },
    { value: "lika-gorski-kotar", labelKey: "region_lika_gorski_kotar"}
  ];

  const priceOptions = [
    { value: "any", labelKey: "filter_price_any" },
    { value: "€", labelKey: "filter_price_1" },
    { value: "€€", labelKey: "filter_price_2" },
    { value: "€€€", labelKey: "filter_price_3" },
    { value: "€€€€", labelKey: "filter_price_4" },
  ];

  // --- Render Page ---
  return (
    <main className="container mx-auto px-4 py-8 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-primary dark:text-primary-foreground">
          {t('explore_page_title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('explore_page_subtitle')}
        </p>
      </section>

      {/* Regional Cards Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-secondary dark:text-secondary-foreground">{t('explore_page_select_region_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8"> {/* Adjusted grid for potentially 7 items */}
          {regionsData.map((region) => (
            <RegionalCard
              key={region.id}
              regionKey={region.nameKey}
              descriptionKey={region.descriptionKey}
              imageUrl={region.imageUrl}
              color1={region.color1}
              color2={region.color2}
              slug={region.slug} // Slug is passed to RegionalCard to construct the link
            />
          ))}
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="mb-12 p-6 bg-card/50 dark:bg-card/80 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-center text-primary dark:text-primary-foreground">{t('explore_page_search_title')}</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <Input
            type="search"
            aria-label={t('explore_search_aria_label')}
            placeholder={t('explore_search_placeholder')}
            className="flex-grow text-base p-3 border-border rounded-md focus:ring-ring focus:border-ring"
          />
          <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-3">
            {t('explore_search_button')}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Select>
            <SelectTrigger className="w-full text-base p-3 rounded-md border-border">
              <SelectValue placeholder={t('filter_category_label')} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-base">{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full text-base p-3 rounded-md border-border">
               <SelectValue placeholder={t('filter_region_label')} />
            </SelectTrigger>
            <SelectContent>
              {regionFilterOptions.map(option => ( // Using regionFilterOptions
                <SelectItem key={option.value} value={option.value} className="text-base">{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full text-base p-3 rounded-md border-border">
              <SelectValue placeholder={t('filter_price_label')} />
            </SelectTrigger>
            <SelectContent>
              {priceOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-base">{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-secondary dark:text-secondary-foreground">{t('explore_page_popular_destinations_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {popularDestinations.map((dest) => (
            <Card key={dest.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card text-card-foreground">
              <Link href={`/${currentLocale}/destinations/${dest.slug}`} className="block"> {/* Added currentLocale to link */}
                <CardHeader className="p-0">
                  <div className="relative w-full h-56">
                    <Image src={dest.imageUrl} alt={t(dest.nameKey)} fill style={{objectFit: 'cover'}} />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-1">{t(dest.nameKey)}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-2">{t(dest.regionKey)}</CardDescription>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{t(dest.descriptionKey)}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span>{dest.rating.toFixed(1)} ({dest.reviews} {t('reviews_label')})</span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Recommendations Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-secondary dark:text-secondary-foreground">{t('explore_page_recommendations_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card text-card-foreground">
              <Link href={`/${currentLocale}/recommendations/${rec.slug}`} className="block"> {/* Added currentLocale to link */}
                <CardHeader className="p-0">
                  <div className="relative w-full h-56">
                    <Image src={rec.imageUrl} alt={t(rec.nameKey)} fill style={{objectFit: 'cover'}} />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-xs uppercase text-primary font-semibold mb-1">{t(rec.typeKey)}</p>
                  <CardTitle className="text-xl font-semibold mb-1">{t(rec.nameKey)}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-2">{t(rec.locationKey)}</CardDescription>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{t(rec.descriptionKey)}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                      <span>{rec.rating.toFixed(1)} ({rec.reviews} {t('reviews_label')})</span>
                    </div>
                    {rec.priceRaw && <span className="font-semibold text-foreground">{rec.priceRaw}</span>}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
