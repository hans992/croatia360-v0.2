// src/app/[locale]/explore/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale, locales as validLocalesArray } from '@/lib/i18n/settings';
import { useParams, notFound } from 'next/navigation';

// Import RegionalCard component
import RegionalCard from '@/components/RegionalCard';

// --- Interfaces ---
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
}

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
}

// --- Data for Regional Cards ---
// Define Region interface
interface Region {
  id: string;
  nameKey: string;
  descriptionKey: string;
  imageUrl: string;
  color1: string;
  color2: string;
  slug: string;
}

const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/"; // Base URL for images

const regionsData: Region[] = [
  {
    id: "slavonija",
    nameKey: "region_slavonija",
    descriptionKey: "region_slavonija_description_short",
    imageUrl: `${gcsBaseUrl}regions/slavonija_card.jpg`,
    color1: '#FFD700', // Zlatno Žuta
    color2: '#8B4513', // Duboka Smeđa
    slug: "slavonija",
  },
  {
    id: "sredisnja_hrvatska",
    nameKey: "region_sredisnja",
    descriptionKey: "region_sredisnja_description_short",
    imageUrl: `${gcsBaseUrl}regions/sredisnja_card.jpg`,
    color1: '#2E8B57', // Smaragdno Zelena
    color2: '#800020', // Burgundac Crvena
    slug: "sredisnja-hrvatska",
  },
  {
    id: "zagreb",
    nameKey: "region_zagreb",
    descriptionKey: "region_zagreb_description_short",
    imageUrl: `${gcsBaseUrl}regions/zagreb_card.jpg`,
    color1: '#004C99', // ZG Plava
    color2: '#D2B48C', // Topla Bež/Kamen Siva
    slug: "zagreb",
  },
  {
    id: "lika_gorski_kotar",
    nameKey: "region_lika_gorski_kotar",
    descriptionKey: "region_lika_gorski_kotar_description_short",
    imageUrl: `${gcsBaseUrl}regions/lika_gorski_kotar_card.jpg`,
    color1: '#228B22', // Duboko Zelena (Šumska)
    color2: '#40E0D0', // Kristalno Tirkizna
    slug: "lika-gorski-kotar",
  },
  {
    id: "istra",
    nameKey: "region_istra",
    descriptionKey: "region_istra_description_short",
    imageUrl: `${gcsBaseUrl}regions/istra_card.jpg`,
    color1: '#E07A5F', // Terakota/Istrian Crvena
    color2: '#808000', // Maslinasto Zelena
    slug: "istra",
  },
  {
    id: "dalmacija",
    nameKey: "region_dalmacija",
    descriptionKey: "region_dalmacija_description_short",
    imageUrl: `${gcsBaseUrl}regions/dalmacija_card.jpg`,
    color1: '#007FFF', // Jadransko Plava (Azure)
    color2: '#F8F8FF', // Bijela Boja Kamena/Bjelokost
    slug: "dalmacija",
  },
];


// --- Component ---
export default function ExplorePage() {
  // --- Hooks ---
  const params = useParams();
  const { t } = useTranslation(defaultNS);

  // --- Locale Validation ---
  const localeParam = params.locale;
  
  if (typeof localeParam !== 'string' || !validLocalesArray.includes(localeParam as Locale)) {
    return notFound();
  }
  
  // Koristimo localeParam direktno umjesto da ga spremamo u novu varijablu
  // koja se ne koristi (ovo rješava ESLint grešku)

  // --- Component Data & Options ---
  const popularDestinations: Destination[] = [
    { id: "sibenik", nameKey: "destination_sibenik_name", regionKey: "region_dalmacija", descriptionKey: "destination_sibenik_description", rating: 4.9, reviews: 2450, imageUrl: `${gcsBaseUrl}destinations/Sibenik_tfortress.jpg`, featured: true, slug: "sibenik" },
    { id: "trogir", nameKey: "destination_trogir_name", regionKey: "region_dalmacija", descriptionKey: "destination_trogir_description", rating: 4.8, reviews: 1890, imageUrl: `${gcsBaseUrl}destinations/Trogir_grad.jpg`, featured: false, slug: "trogir" },
    { id: "opatija", nameKey: "destination_opatija_name", regionKey: "region_kvarner", descriptionKey: "destination_opatija_description", rating: 4.7, reviews: 980, imageUrl: `${gcsBaseUrl}destinations/Opatija.jpg`, featured: false, slug: "opatija" },
  ];

  const recommendations: Recommendation[] = [
    { id: "hotel_opatija", typeKey: "recommendation_type_accommodation", nameKey: "recommendation_opatija_hotel_name", locationKey: "recommendation_opatija_hotel_location", descriptionKey: "recommendation_opatija_hotel_description", rating: 4.9, reviews: 320, priceRaw: "€250 / noć", priceCategory: "€€€€", tagsKeys: ["tag_spa", "tag_pool", "tag_restaurant"], imageUrl: `${gcsBaseUrl}recommendations/Opatija.jpg`, slug: "luxury-seaside-resort-opatija" },
    { id: "kulen_tour_osijek", typeKey: "recommendation_type_restaurant", nameKey: "recommendation_kulen_tour_name", locationKey: "recommendation_kulen_tour_location", descriptionKey: "recommendation_kulen_tour_description", rating: 4.9, reviews: 189, priceRaw: "35€ / osoba", priceCategory: "€€", tagsKeys: ["tag_kulen", "tag_gourmet", "tag_local"], imageUrl: `${gcsBaseUrl}recommendations/food_slavonia.jpg`, slug: "kulen-tour-osijek" },
    { id: "krka_tour", typeKey: "recommendation_type_activity", nameKey: "recommendation_krka_tour_name", locationKey: "recommendation_krka_tour_location", descriptionKey: "recommendation_krka_tour_description", rating: 4.8, reviews: 1500, priceRaw: "€40 / osoba", priceCategory: "€€", tagsKeys: ["tag_nature", "tag_waterfalls", "tag_hiking"], imageUrl: `${gcsBaseUrl}recommendations/Krka.jpg`, slug: "krka-national-park-tour" },
  ];

  // --- Filter Options ---
  const categoryOptions = [
    { value: "all", labelKey: "filter_category_all" },
    { value: "accommodation", labelKey: "filter_category_accommodation" },
    { value: "food", labelKey: "filter_category_food" },
    { value: "activities", labelKey: "filter_category_activities" },
    { value: "events", labelKey: "filter_category_events" },
    { value: "sights", labelKey: "filter_category_sights" },
  ];

  const regionOptions = [
    { value: "all", labelKey: "filter_region_all" },
    { value: "istra", labelKey: "region_istra" },
    { value: "kvarner", labelKey: "region_kvarner" },
    { value: "dalmacija", labelKey: "region_dalmacija" },
    { value: "slavonija", labelKey: "region_slavonija" },
    { value: "sredisnja", labelKey: "region_sredisnja" },
    { value: "zagreb", labelKey: "region_zagreb" },
    { value: "lika_gorski_kotar", labelKey: "region_lika_gorski_kotar"}
  ];

  const priceOptions = [
    { value: "any", labelKey: "filter_price_any" },
    { value: "€", labelKey: "filter_price_1" },
    { value: "€€", labelKey: "filter_price_2" },
    { value: "€€€", labelKey: "filter_price_3" },
    { value: "€€€€", labelKey: "filter_price_4" },
  ];

  // --- Render ---
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          {t('explore_page_title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('explore_page_subtitle')}
        </p>
      </section>

      {/* Regional Cards Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('explore_page_select_region_title')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {regionsData.map((region) => (
            <RegionalCard
              key={region.id}
              regionKey={region.nameKey}
              descriptionKey={region.descriptionKey}
              imageUrl={region.imageUrl}
              color1={region.color1}
              color2={region.color2}
              slug={region.slug}
            />
          ))}
        </div>
      </section>

      {/* Search & Filters Section (Moved below regional cards) */}
      <section className="mb-12 p-6 bg-gray-50 rounded-lg shadow">
        <h3 className="text-2xl font-semibold mb-6 text-center">{t('explore_page_search_title')}</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <Input
            type="search"
            placeholder={t('explore_search_placeholder')}
            className="flex-grow text-base p-3 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <Button size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-base px-8 py-3">
            {t('explore_search_button')}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Select>
            <SelectTrigger className="w-full text-base p-3">{t('filter_category_label')}</SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-base">{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full text-base p-3">{t('filter_region_label')}</SelectTrigger>
            <SelectContent>
              {regionOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-base">{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full text-base p-3">{t('filter_price_label')}</SelectTrigger>
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
        <h2 className="text-3xl font-bold mb-8 text-center">{t('explore_page_popular_destinations_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest) => (
            <Card key={dest.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/destinations/${dest.slug}`} className="block">
                <CardHeader className="p-0">
                  <div className="relative w-full h-56">
                    <Image src={dest.imageUrl} alt={t(dest.nameKey)} layout="fill" objectFit="cover" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-1">{t(dest.nameKey)}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-2">{t(dest.regionKey)}</CardDescription>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{t(dest.descriptionKey)}</p>
                  <div className="flex items-center text-sm">
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
        <h2 className="text-3xl font-bold mb-8 text-center">{t('explore_page_recommendations_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/recommendations/${rec.slug}`} className="block">
                <CardHeader className="p-0">
                  <div className="relative w-full h-56">
                    <Image src={rec.imageUrl} alt={t(rec.nameKey)} layout="fill" objectFit="cover" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-xs uppercase text-blue-600 font-semibold mb-1">{t(rec.typeKey)}</p>
                  <CardTitle className="text-xl font-semibold mb-1">{t(rec.nameKey)}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-2">{t(rec.locationKey)}</CardDescription>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{t(rec.descriptionKey)}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                      <span>{rec.rating.toFixed(1)} ({rec.reviews} {t('reviews_label')})</span>
                    </div>
                    {rec.priceRaw && <span className="font-semibold">{rec.priceRaw}</span>}
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
