// src/app/[locale]/explore/page.tsx
"use client"; // Ova direktiva označava da je ovo klijentska komponenta

// Import potrebnih UI komponenti iz shadcn/ui i lucide-react za ikone
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Dodan CardFooter
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search, TrendingUp, ThumbsUp } from "lucide-react"; // Dodane nove ikone

// Import Next.js specifičnih funkcionalnosti
import Image from "next/image"; // Optimizirana image komponenta
import Link from "next/link"; // Za klijent-side navigaciju

// Import i18n alata
import { useTranslation } from 'react-i18next'; // Hook za korištenje prijevoda
import { defaultNS, type Locale, locales as validLocalesArray } from '@/lib/i18n/settings'; // i18n konfiguracija

// Import Next.js navigacijskih hookova
import { useParams, notFound } from 'next/navigation'; // Za pristup parametrima rute i rukovanje 404 greškom

// Import prilagođenih komponenti
import RegionalCard from '@/components/RegionalCard'; // Kartica za prikaz regija

// --- Sučelja ---
// Definira strukturu za Destination objekt
interface Destination {
  id: string;
  nameKey: string;
  regionKey: string;
  descriptionKey: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  featured: boolean;
  slug: string;
  type?: 'destination'; // Dodano za razlikovanje
}

// Definira strukturu za Recommendation objekt
interface Recommendation {
  id: string;
  typeKey: string;
  nameKey: string;
  locationKey: string;
  descriptionKey: string;
  rating: number;
  reviews: number;
  priceKey?: string;
  priceRaw?: string;
  priceCategory?: '€' | '€€' | '€€€' | '€€€€';
  tagsKeys: string[];
  imageUrl: string;
  slug: string;
  type?: 'recommendation'; // Dodano za razlikovanje
}

// Definira strukturu za Region objekt, koristi se za RegionalCards
interface Region {
  id: string;
  nameKey: string;
  descriptionKey: string;
  imageUrl: string;
  color1: string;
  color2: string;
  slug: string;
}

// Bazni URL za slike pohranjene na Google Cloud Storage
const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

// --- Podaci za Regionalne Kartice ---
// Ovaj niz sadrži podatke za svaku regiju koja će biti prikazana.
// Provjeri da su URL-ovi slika točni i da ključevi za prijevod postoje.
const regionsData: Region[] = [
  {
    id: "slavonija",
    nameKey: "region_slavonija",
    descriptionKey: "region_slavonija_description_short",
    imageUrl: `${gcsBaseUrl}regions/slavonija/Slavonija_Card.jpg`,
    color1: '#FFD700', color2: '#8B4513',
    slug: "slavonija",
  },
  {
    id: "sredisnja_hrvatska",
    nameKey: "region_sredisnja",
    descriptionKey: "region_sredisnja_description_short",
    imageUrl: `${gcsBaseUrl}regions/sredisnja_hrvatska/Sredisnja_Card.jpg`,
    color1: '#800020', color2: '#2E8B57',
    slug: "sredisnja-hrvatska",
  },
  {
    id: "zagreb",
    nameKey: "region_zagreb",
    descriptionKey: "region_zagreb_description_short",
    imageUrl: `${gcsBaseUrl}regions/zagreb/Zagreb_Card.jpg`,
    color1: '#5D3FD3', color2: '#EAE0D5', // Ažurirane boje
    slug: "zagreb",
  },
  {
    id: "lika_gorski_kotar",
    nameKey: "region_lika_gorski_kotar",
    descriptionKey: "region_lika_gorski_kotar_description_short",
    imageUrl: `${gcsBaseUrl}regions/lika_gorski_kotar/Lika_Gorski_Kotar_Card.jpg`,
    color1: '#228B22', color2: '#40E0D0',
    slug: "lika-gorski-kotar",
  },
  {
    id: "istra",
    nameKey: "region_istra",
    descriptionKey: "region_istra_description_short",
    imageUrl: `${gcsBaseUrl}regions/istra/Istria_Card.jpg`,
    color1: '#E07A5F', color2: '#808000',
    slug: "istra",
  },
  {
    id: "kvarner", // Dodana regija Kvarner
    nameKey: "region_kvarner",
    descriptionKey: "region_kvarner_description_short",
    imageUrl: `${gcsBaseUrl}regions/kvarner/Kvarner_Card.jpg`,
    color1: '#009688', color2: '#CFD8DC',
    slug: "kvarner",
  },
  {
    id: "dalmacija",
    nameKey: "region_dalmacija",
    descriptionKey: "region_dalmacija_description_short",
    imageUrl: `${gcsBaseUrl}regions/dalmacija/Dalmacija_Card.jpg`,
    color1: '#007FFF', color2: '#F8F8FF',
    slug: "dalmacija",
  },
];

// --- ExplorePage Komponenta ---
export default function ExplorePage() {
  // --- Hookovi ---
  const params = useParams();
  const { t } = useTranslation(defaultNS);

  // --- Validacija Jezika ---
  const localeParam = params.locale;
  if (typeof localeParam !== 'string' || !validLocalesArray.includes(localeParam as Locale)) {
    notFound();
  }
  const currentLocale = localeParam as Locale;

  // --- Mock Podaci za Popularne Destinacije i Preporuke ---
  const popularDestinations: Destination[] = [
    { id: "sibenik", nameKey: "destination_sibenik_name", regionKey: "region_dalmacija", descriptionKey: "destination_sibenik_description", rating: 4.9, reviews: 2450, imageUrl: `${gcsBaseUrl}destinations/sibenik/Sibenik_Explore.jpg`, featured: true, slug: "sibenik", type: 'destination' },
    { id: "trogir", nameKey: "destination_trogir_name", regionKey: "region_dalmacija", descriptionKey: "destination_trogir_description", rating: 4.8, reviews: 1890, imageUrl: `${gcsBaseUrl}destinations/trogir/Trogir_Explore.jpg`, featured: false, slug: "trogir", type: 'destination' },
    { id: "opatija", nameKey: "destination_opatija_name", regionKey: "region_kvarner", descriptionKey: "destination_opatija_description", rating: 4.7, reviews: 980, imageUrl: `${gcsBaseUrl}destinations/opatija/Opatija_Explore.jpg`, featured: false, slug: "opatija", type: 'destination' },
    // Dodaj još popularnih destinacija po potrebi
  ];

  const recommendations: Recommendation[] = [
    { id: "hotel_opatija", typeKey: "recommendation_type_accommodation", nameKey: "recommendation_opatija_hotel_name", locationKey: "recommendation_opatija_hotel_location", descriptionKey: "recommendation_opatija_hotel_description", rating: 4.9, reviews: 320, priceRaw: "€250 / noć", priceCategory: "€€€€", tagsKeys: ["tag_spa", "tag_pool", "tag_restaurant"], imageUrl: `${gcsBaseUrl}recommendations/opatija/Opatija_Hotel_Explore.jpg`, slug: "luxury-seaside-resort-opatija", type: 'recommendation' },
    { id: "kulen_tour_osijek", typeKey: "recommendation_type_restaurant", nameKey: "recommendation_kulen_tour_name", locationKey: "recommendation_kulen_tour_location", descriptionKey: "recommendation_kulen_tour_description", rating: 4.9, reviews: 189, priceRaw: "35€ / osoba", priceCategory: "€€", tagsKeys: ["tag_kulen", "tag_gourmet", "tag_local"], imageUrl: `${gcsBaseUrl}recommendations/slavonija/Kulen_Tour_Explore.jpg`, slug: "kulen-tour-osijek", type: 'recommendation' },
    { id: "krka_tour", typeKey: "recommendation_type_activity", nameKey: "recommendation_krka_tour_name", locationKey: "recommendation_krka_tour_location", descriptionKey: "recommendation_krka_tour_description", rating: 4.8, reviews: 1500, priceRaw: "€40 / osoba", priceCategory: "€€", tagsKeys: ["tag_nature", "tag_waterfalls", "tag_hiking"], imageUrl: `${gcsBaseUrl}recommendations/dalmacija/Krka_NP_Explore.jpg`, slug: "krka-national-park-tour", type: 'recommendation' },
  ];

  // --- Opcije za Filtere ---
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

  // --- Renderiranje Stranice ---
  return (
    <main className="container mx-auto px-4 py-8 animate-fadeIn">
      {/* Hero Sekcija */}
      <section className="text-center py-12 md:py-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-primary dark:text-primary-foreground">
          {t('explore_page_title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('explore_page_subtitle')}
        </p>
      </section>

      {/* Sekcija Regionalnih Kartica - Korištenje Flexboxa za bolji raspored */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center text-secondary dark:text-secondary-foreground">
          {t('explore_page_select_region_title')}
        </h2>
        {/* Flex kontejner za kartice */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {regionsData.map((region) => (
            // Svaka kartica zauzima određeni dio širine ovisno o veličini ekrana
            <div key={region.id} className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.333rem)]"> {/* Izračun širine s obzirom na gap */}
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

      {/* Sekcija Pretrage i Filtera */}
      <section className="mb-16 md:mb-20 p-6 md:p-8 bg-card/60 dark:bg-card/80 rounded-xl shadow-xl">
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-center text-primary dark:text-primary-foreground flex items-center justify-center">
          <Search className="w-7 h-7 md:w-8 md:h-8 mr-3" />
          {t('explore_page_search_title')}
        </h3>
        <div className="flex flex-col lg:flex-row gap-4 mb-6 items-end">
          <Input
            type="search"
            aria-label={t('explore_search_aria_label')}
            placeholder={t('explore_search_placeholder')}
            className="flex-grow text-base p-3 h-12 border-border rounded-md focus:ring-ring focus:border-ring"
          />
          <Button size="lg" className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 h-12">
            {t('explore_search_button')}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select>
            <SelectTrigger className="w-full text-base p-3 h-12 rounded-md border-border">
              <SelectValue placeholder={t('filter_category_label')} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-base">{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full text-base p-3 h-12 rounded-md border-border">
               <SelectValue placeholder={t('filter_region_label')} />
            </SelectTrigger>
            <SelectContent>
              {regionFilterOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-base">{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full text-base p-3 h-12 rounded-md border-border">
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

      {/* Sekcija Popularnih Destinacija - Redizajnirano */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center text-secondary dark:text-secondary-foreground flex items-center justify-center">
            <TrendingUp className="w-8 h-8 md:w-9 md:h-9 mr-3" />
            {t('explore_page_popular_destinations_title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {popularDestinations.map((item) => (
            <Card key={item.id} className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out bg-card text-card-foreground flex flex-col">
              <Link href={`/${currentLocale}/destinations/${item.slug}`} className="block flex flex-col h-full">
                <CardHeader className="p-0 relative">
                  <div className="aspect-video w-full overflow-hidden"> {/* Fiksni omjer slike */}
                    <Image
                      src={item.imageUrl}
                      alt={t(item.nameKey)}
                      fill
                      style={{objectFit: 'cover'}}
                      className="transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded-full shadow-md">
                      {t('explore_featured_badge')}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-5 flex-grow">
                  <CardTitle className="text-xl lg:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">{t(item.nameKey)}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-secondary" />
                    {t(item.regionKey)}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{t(item.descriptionKey)}</p>
                </CardContent>
                <CardFooter className="p-5 pt-0 border-t border-border/50 mt-auto">
                    <div className="flex items-center text-sm text-amber-500">
                        <Star className="w-5 h-5 mr-1.5" fill="currentColor" />
                        <span className="font-bold text-foreground">{item.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground ml-1">({item.reviews} {t('reviews_label')})</span>
                    </div>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Sekcija Preporuka - Redizajnirano */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center text-secondary dark:text-secondary-foreground flex items-center justify-center">
            <ThumbsUp className="w-8 h-8 md:w-9 md:h-9 mr-3" />
            {t('explore_page_recommendations_title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recommendations.map((item) => (
            <Card key={item.id} className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out bg-card text-card-foreground flex flex-col">
              <Link href={`/${currentLocale}/recommendations/${item.slug}`} className="block flex flex-col h-full">
                <CardHeader className="p-0 relative">
                  <div className="aspect-video w-full overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={t(item.nameKey)}
                      fill
                      style={{objectFit: 'cover'}}
                      className="transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                   <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-primary-foreground px-3 py-1 text-xs font-semibold rounded-full shadow-md">
                      {t(item.typeKey)}
                    </div>
                </CardHeader>
                <CardContent className="p-5 flex-grow">
                  <CardTitle className="text-xl lg:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">{t(item.nameKey)}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-1 flex items-center">
                     <MapPin className="w-4 h-4 mr-2 text-secondary" />
                    {t(item.locationKey)}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{t(item.descriptionKey)}</p>
                  {item.tagsKeys && item.tagsKeys.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tagsKeys.map(tagKey => (
                        <span key={tagKey} className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">{t(tagKey)}</span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-5 pt-0 border-t border-border/50 mt-auto flex items-center justify-between">
                    <div className="flex items-center text-sm text-amber-500">
                        <Star className="w-5 h-5 mr-1.5" fill="currentColor" />
                        <span className="font-bold text-foreground">{item.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground ml-1">({item.reviews} {t('reviews_label')})</span>
                    </div>
                    {item.priceRaw && <span className="font-semibold text-lg text-primary">{item.priceRaw}</span>}
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
