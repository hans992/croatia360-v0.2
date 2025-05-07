// src/app/[locale]/explore/page.tsx
"use client"; // Ostaje klijentska komponenta

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale, locales as validLocalesArray } from '@/lib/i18n/settings'; // Importiraj i locales kao polje za provjeru
import { useParams, notFound } from 'next/navigation'; // <--- Import useParams i notFound

// Definicije sučelja Destination i Recommendation ostaju iste
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

// Komponenta sada ne mora definirati ExplorePageProps za params ako koristi useParams
export default function ExplorePage() {
  const params = useParams();
  // useParams može vratiti string | string[] za svaki parametar.
  // Za [locale] rutu, očekujemo string.
  const localeParam = params.locale;

  let locale: Locale;

  if (typeof localeParam === 'string' && validLocalesArray.includes(localeParam as Locale)) {
    locale = localeParam as Locale;
  } else {
    // Ako locale nije validan ili nije string, preusmjeri na 404 ili default locale.
    // Za sada ćemo pozvati notFound() što će prikazati 404 stranicu.
    // Možeš implementirati i fallback na default locale ako želiš.
    return notFound();
  }

  const { t } = useTranslation(defaultNS); // Inicijaliziraj hook za prijevod

  // Ostatak tvoje postojeće logike komponente...
  const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

  const popularDestinations: Destination[] = [
    {
      id: "sibenik",
      nameKey: "destination_sibenik_name",
      regionKey: "region_dalmacija",
      descriptionKey: "destination_sibenik_description",
      rating: 4.9,
      reviews: 2450,
      imageUrl: `${gcsBaseUrl}Sibenik_tfortress.jpg`,
      featured: true,
      slug: "sibenik",
    },
    {
      id: "trogir",
      nameKey: "destination_trogir_name",
      regionKey: "region_dalmacija",
      descriptionKey: "destination_trogir_description",
      rating: 4.8,
      reviews: 1890,
      imageUrl: `${gcsBaseUrl}Trogir_grad.jpg`,
      featured: false,
      slug: "trogir",
    },
    {
      id: "opatija",
      nameKey: "destination_opatija_name",
      regionKey: "region_kvarner",
      descriptionKey: "destination_opatija_description",
      rating: 4.7,
      reviews: 980,
      imageUrl: `${gcsBaseUrl}Opatija.jpg`,
      featured: false,
      slug: "opatija",
    },
  ];

  const recommendations: Recommendation[] = [
     {
      id: "hotel_opatija",
      typeKey: "recommendation_type_accommodation",
      nameKey: "recommendation_opatija_hotel_name",
      locationKey: "recommendation_opatija_hotel_location",
      descriptionKey: "recommendation_opatija_hotel_description",
      rating: 4.9,
      reviews: 320,
      priceRaw: "€250 / noć", 
      priceCategory: "€€€€",
      tagsKeys: ["tag_spa", "tag_pool", "tag_restaurant"],
      imageUrl: `${gcsBaseUrl}Opatija.jpg`,
      slug: "luxury-seaside-resort-opatija",
    },
    {
      id: "kulen_tour_osijek",
      typeKey: "recommendation_type_restaurant", 
      nameKey: "recommendation_kulen_tour_name",
      locationKey: "recommendation_kulen_tour_location",
      descriptionKey: "recommendation_kulen_tour_description",
      rating: 4.9,
      reviews: 189,
      priceRaw: "35€ / osoba",
      priceCategory: "€€",
      tagsKeys: ["tag_kulen", "tag_gourmet", "tag_local"],
      imageUrl: `${gcsBaseUrl}food_slavonia.jpg`, 
      slug: "kulen-tour-osijek",
    },
     {
      id: "krka_tour",
      typeKey: "recommendation_type_activity",
      nameKey: "recommendation_krka_tour_name",
      locationKey: "recommendation_krka_tour_location",
      descriptionKey: "recommendation_krka_tour_description",
      rating: 4.8,
      reviews: 1500,
      priceRaw: "€40 / osoba",
      priceCategory: "€€",
      tagsKeys: ["tag_nature", "tag_waterfalls", "tag_hiking"],
      imageUrl: `${gcsBaseUrl}Krka.jpg`,
      slug: "krka-national-park-tour",
    },
  ];

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
  ];

   const priceOptions = [
    { value: "any", labelKey: "filter_price_any" },
    { value: "€", labelKey: "filter_price_1" },
    { value: "€€", labelKey: "filter_price_2" },
    { value: "€€€", labelKey: "filter_price_3" },
    { value: "€€€€", labelKey: "filter_price_4" },
  ];

  // JSX ostaje isti kao prije, samo pazi da koristiš 'locale' varijablu
  // koja je sada dohvaćena i validirana iz useParams.
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-primary">
        {t('explore_page_title')}
      </h1>
      <p className="text-muted-foreground mb-6">
        {t('explore_page_subtitle')}
      </p>
    
      {/* Search and Filters Section */}
      <div className="mb-8 p-4 border rounded-lg bg-card shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input 
            placeholder={t('explore_search_placeholder')!} 
            className="flex-grow" 
            aria-label={t('explore_search_aria_label')}
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]" aria-label={t('filter_category_label')}>
              <SelectValue placeholder={t('filter_category_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]" aria-label={t('filter_region_label')}>
              <SelectValue placeholder={t('filter_region_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {regionOptions.map(option => (
                 <SelectItem key={option.value} value={option.value}>{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select defaultValue="any">
            <SelectTrigger className="w-full md:w-[120px]" aria-label={t('filter_price_label')}>
              <SelectValue placeholder={t('filter_price_placeholder')} />
            </SelectTrigger>
            <SelectContent>
               {priceOptions.map(option => (
                 <SelectItem key={option.value} value={option.value}>{option.labelKey ? t(option.labelKey) : option.value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
            {t('explore_search_button')}
          </Button>
        </div>
         <div className="mt-6 p-4 border rounded bg-muted/50 text-center flex items-center justify-center overflow-hidden">
            <Image 
              src={`${gcsBaseUrl}croatia_map.svg`} 
              alt={t('alt_croatia_map') || "Karta Hrvatske po regijama"} 
              width={400} 
              height={300} 
              className="max-w-full h-auto object-contain" 
            />
         </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-primary/90">
          {t('explore_popular_destinations_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest) => (
            <Card key={dest.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0 relative">
                <Image 
                  src={dest.imageUrl} 
                  alt={t(dest.nameKey)} 
                  width={400} 
                  height={200} 
                  className="w-full h-48 object-cover" 
                />
                {dest.featured && (
                  <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                    {t('explore_featured_badge')}
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <p className="text-sm text-muted-foreground mb-1">{t(dest.regionKey)}</p>
                <CardTitle className="text-lg font-semibold mb-1 text-primary">{t(dest.nameKey)}</CardTitle>
                <CardDescription className="text-sm mb-2">{t(dest.descriptionKey)}</CardDescription>
                <div className="flex items-center text-sm text-yellow-500">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span>{dest.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">({dest.reviews} {t('reviews_suffix', { count: dest.reviews })})</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                 <Button asChild variant="link" className="p-0 text-destructive hover:text-destructive/80">
                    <Link href={`/${locale}/explore/${dest.slug}`}>{t('explore_discover_more_button')}</Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-primary/90">
            {t('explore_find_section_title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0 relative">
                <Image 
                  src={rec.imageUrl} 
                  alt={t(rec.nameKey)} 
                  width={400} 
                  height={200} 
                  className="w-full h-48 object-cover" 
                />
                 {rec.priceCategory && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded">
                     {rec.priceCategory}
                  </div>
                )}
                 {rec.priceRaw && !rec.priceCategory && (
                   <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded">
                    {rec.priceRaw.split(" ")[0]}
                  </div>
                 )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="flex items-center text-sm text-yellow-500 mb-1">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span>{rec.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">({rec.reviews} {t('reviews_suffix', { count: rec.reviews })})</span>
                </div>
                <CardTitle className="text-lg font-semibold mb-1 text-primary">{t(rec.nameKey)}</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">{t(rec.locationKey)}</p>
                <CardDescription className="text-sm mb-3">{t(rec.descriptionKey)}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {rec.tagsKeys.map(tagKey => (
                    <span key={tagKey} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{t(tagKey)}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                {rec.priceRaw && <span className="text-lg font-semibold text-foreground">{rec.priceRaw}</span>}
                {!rec.priceRaw && rec.priceCategory && <span className="text-lg font-semibold text-foreground">{rec.priceCategory}</span>}
                <Button asChild variant="link" className="p-0 text-destructive hover:text-destructive/80">
                    <Link href={`/${locale}/explore/${rec.slug}`}>{t('explore_discover_now_button')}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}