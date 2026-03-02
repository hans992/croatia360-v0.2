// src/app/[locale]/explore/page.tsx
"use client";

// ... (ostali importi ostaju isti)
import RegionalCard from '@/components/RegionalCard';
import PopularDestinationCard from '@/components/PopularDestinationCard';
import RecommendationCard from '@/components/RecommendationCard';
import StickyChatbotSection from '@/components/StickyChatbotSection';
import { useParams, notFound } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale, locales as validLocalesArray } from '@/lib/i18n/settings';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// --- Interfaces ---
interface Destination {
  id: string;
  nameKey: string;
  regionKey: string; // Ključ za dohvaćanje boje regije
  descriptionKey: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  featured: boolean;
  slug: string;
}

interface Recommendation {
  id: string;
  typeKey: string;
  nameKey: string;
  locationKey: string;
  regionKey: string; // <<< DODANO: Ključ za regiju
  descriptionKey: string;
  rating: number;
  reviews: number;
  priceKey?: string;
  priceRaw?: string;
  priceAmount?: string;
  priceUnitKey?: string;
  priceCategory?: '€' | '€€' | '€€€' | '€€€€';
  tagsKeys: string[];
  imageUrl: string;
  slug: string;
}

interface Region {
  id: string;
  nameKey: string;
  descriptionKey: string;
  imageUrl: string;
  color1: string;
  color2: string;
  slug: string;
}

// Base URL for images
const gcsBaseUrl = "https://storage.googleapis.com/croatiasara2026/images/";

// --- Data ---
const regionsData: Region[] = [
  { id: "slavonija", nameKey: "region_slavonija", descriptionKey: "region_slavonija_description_short", imageUrl: `${gcsBaseUrl}Slavonija_zito.jpg`, color1: '#FFD700', color2: '#8B4513', slug: "slavonija" },
  { id: "sredisnja_hrvatska", nameKey: "region_sredisnja", descriptionKey: "region_sredisnja_description_short", imageUrl: `${gcsBaseUrl}Sredisnja_Hrvatska.jpg`, color1: '#800020', color2: '#2E8B57', slug: "sredisnja-hrvatska" },
  { id: "zagreb", nameKey: "region_zagreb", descriptionKey: "region_zagreb_description_short", imageUrl: `${gcsBaseUrl}regions/zagreb/Zagreb_dron_image.jpg`, color1: '#5D3FD3', color2: '#EAE0D5', slug: "zagreb" },
  { id: "lika_gorski_kotar", nameKey: "region_lika_gorski_kotar", descriptionKey: "region_lika_gorski_kotar_description_short", imageUrl: `${gcsBaseUrl}regions/lika_gorski_kotar/Zavizan_house.jpg`, color1: '#228B22', color2: '#40E0D0', slug: "lika-gorski-kotar" },
  { id: "istra", nameKey: "region_istra", descriptionKey: "region_istra_description_short", imageUrl: `${gcsBaseUrl}regions/istra/Rovinj_from_distance.jpg`, color1: '#E07A5F', color2: '#808000', slug: "istra" },
  { id: "kvarner", nameKey: "region_kvarner", descriptionKey: "region_kvarner_description_short", imageUrl: `${gcsBaseUrl}regions/kvarner/Rijeka_grad.jpg`, color1: '#009688', color2: '#CFD8DC', slug: "kvarner" },
  { id: "dalmacija", nameKey: "region_dalmacija", descriptionKey: "region_dalmacija_description_short", imageUrl: `${gcsBaseUrl}regions/dalmacija/Primosten_aerial.jpg`, color1: '#007FFF', color2: '#F8F8FF', slug: "dalmacija" },
];

// --- ExplorePage Component ---
export default function ExplorePage() {
  // --- Hooks ---
  const params = useParams();
  const { t } = useTranslation(defaultNS);

  // --- Locale Validation ---
  const localeParam = params.locale;
  if (typeof localeParam !== 'string' || !validLocalesArray.includes(localeParam as Locale)) {
    notFound();
  }
  const currentLocale = localeParam as Locale;

  // --- Mock Data ---
  const popularDestinations: Destination[] = [
    // Koristimo ID regije iz regionsData kao regionKey
    { id: "sibenik", nameKey: "destination_sibenik_name", regionKey: "dalmacija", descriptionKey: "destination_sibenik_description", rating: 4.9, reviews: 2450, imageUrl: `${gcsBaseUrl}regions/dalmacija/Sibenik_from_the_sea.jpg`, featured: true, slug: "sibenik" },
    { id: "trogir", nameKey: "destination_trogir_name", regionKey: "dalmacija", descriptionKey: "destination_trogir_description", rating: 4.8, reviews: 1890, imageUrl: `${gcsBaseUrl}regions/dalmacija/Trogir_aerial.jpg`, featured: false, slug: "trogir" },
    { id: "opatija", nameKey: "destination_opatija_name", regionKey: "kvarner", descriptionKey: "destination_opatija_description", rating: 4.7, reviews: 980, imageUrl: `${gcsBaseUrl}Opatija.jpg`, featured: false, slug: "opatija" },
  ];

  const recommendations: Recommendation[] = [
    // DODANO: regionKey
    { id: "hotel_opatija", typeKey: "recommendation_type_accommodation", nameKey: "recommendation_opatija_hotel_name", locationKey: "recommendation_opatija_hotel_location", regionKey: "kvarner", descriptionKey: "recommendation_opatija_hotel_description", rating: 4.9, reviews: 320, priceAmount: "250", priceUnitKey: "price_per_night", priceCategory: "€€€€", tagsKeys: ["tag_spa", "tag_pool", "tag_restaurant"], imageUrl: `${gcsBaseUrl}regions/kvarner/Hotel_sv_Jakov_Opatija.jpg`, slug: "luxury-seaside-resort-opatija" },
    { id: "kulen_tour_osijek", typeKey: "recommendation_type_restaurant", nameKey: "recommendation_kulen_tour_name", locationKey: "recommendation_kulen_tour_location", regionKey: "slavonija", descriptionKey: "recommendation_kulen_tour_description", rating: 4.9, reviews: 189, priceAmount: "35", priceUnitKey: "price_per_person", priceCategory: "€€", tagsKeys: ["tag_kulen", "tag_gourmet", "tag_local"], imageUrl: `${gcsBaseUrl}food_slavonia.jpg`, slug: "kulen-tour-osijek" },
    { id: "krka_tour", typeKey: "recommendation_type_activity", nameKey: "recommendation_krka_tour_name", locationKey: "recommendation_krka_tour_location", regionKey: "dalmacija", descriptionKey: "recommendation_krka_tour_description", rating: 4.8, reviews: 1500, priceAmount: "40", priceUnitKey: "price_per_person", priceCategory: "€€", tagsKeys: ["tag_nature", "tag_waterfalls", "tag_hiking"], imageUrl: `${gcsBaseUrl}regions/dalmacija/Visovac_Monastery_NP_Krka.jpg`, slug: "krka-national-park-tour" },
  ];

  // --- Filter Options (ostaju isti) ---
   const categoryOptions = [
    { value: "all", labelKey: "filter_category_all" },
    { value: "accommodation", labelKey: "filter_category_accommodation" },
    { value: "food", labelKey: "filter_category_food" },
    { value: "activities", labelKey: "filter_category_activities" },
    { value: "events", labelKey: "filter_category_events" },
    { value: "sights", labelKey: "filter_category_sights" },
  ];
  const regionFilterOptions = [
    { value: "all", labelKey: "filter_region_all" },
    { value: "istra", labelKey: "region_istra" },
    { value: "kvarner", labelKey: "region_kvarner" },
    { value: "dalmacija", labelKey: "region_dalmacija" },
    { value: "slavonija", labelKey: "region_slavonija" },
    { value: "sredisnja-hrvatska", labelKey: "region_sredisnja" },
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

  // --- Helper za dohvaćanje boje regije ---
  // Kreiramo mapu ID regije -> primarna boja za lakši pristup
  const regionColorMap = regionsData.reduce((acc, region) => {
      acc[region.id] = region.color1; // Koristimo color1 kao primarnu boju za obrub
      return acc;
  }, {} as Record<string, string>);

  // --- Render Page ---
  return (
    <main className="container mx-auto px-4 py-8 animate-fadeIn">
      {/* Sticky chatbot - right under the menu */}
      <StickyChatbotSection />

      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-primary dark:text-foreground">
          {t('explore_page_title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('explore_page_subtitle')}
        </p>
      </section>

      {/* Regional Cards Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary dark:text-foreground">{t('explore_page_select_region_title')}</h2>
        {/* CORRECTED: Flexbox layout for centering */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {regionsData.map((region) => (
            // Dodajemo širinu karticama da se bolje rasporede unutar flex container-a
            <div key={region.id} className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.33%-1.5rem)] lg:w-[calc(25%-1.5rem)]">
                 <RegionalCard
                    regionKey={region.nameKey}
                    descriptionKey={region.descriptionKey}
                    imageUrl={region.imageUrl}
                    color1={region.color1}
                    color2={region.color2}
                    slug={region.slug}
                 />
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="mb-12 p-6 bg-card/50 dark:bg-card/80 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-center text-primary dark:text-foreground">{t('explore_page_search_title')}</h3>
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
              {regionFilterOptions.map(option => (
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
        <h2 className="text-3xl font-bold mb-8 text-center text-primary dark:text-secondary-foreground">{t('explore_page_popular_destinations_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {popularDestinations.map((dest) => {
            // Dohvaćamo boju regije koristeći mapu
            const regionColor = regionColorMap[dest.regionKey] || 'hsl(var(--border))'; // Fallback na boju obruba
            return (
              <PopularDestinationCard
                key={dest.id}
                destination={dest}
                locale={currentLocale}
                regionColor={regionColor} // Proslijeđujemo boju
              />
            );
          })}
        </div>
      </section>

      {/* Recommendations Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-primary dark:text-secondary-foreground">{t('explore_page_recommendations_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recommendations.map((rec) => {
             // Dohvaćamo boju regije koristeći mapu
             const regionColor = regionColorMap[rec.regionKey] || 'hsl(var(--border))'; // Fallback na boju obruba
             return (
               <RecommendationCard
                 key={rec.id}
                 recommendation={rec}
                 locale={currentLocale}
                 regionColor={regionColor} // Proslijeđujemo boju
               />
             );
          })}
        </div>
      </section>
    </main>
  );
}
