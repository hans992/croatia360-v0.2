// src/app/[locale]/explore/page.tsx
"use client"; // Needed for state, hooks, and potential future interactivity

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next'; // Import for i18n
import { defaultNS, type Locale } from '@/lib/i18n/settings'; // Import settings

// Define interfaces for structured data
interface Destination {
  id: string;
  nameKey: string;
  regionKey: string;
  descriptionKey: string;
  rating: number;
  reviews: number;
  imageUrl: string; // GCS URL
  featured: boolean;
  slug: string; // For linking
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
  priceRaw?: string; // Keep raw price if needed for display formatting
  priceCategory?: '€' | '€€' | '€€€' | '€€€€';
  tagsKeys: string[];
  imageUrl: string; // GCS URL
  slug: string; // For linking
}

interface ExplorePageProps {
   params: { locale: Locale }; // Receive locale from params
}

export default function ExplorePage({ params: { locale } }: ExplorePageProps) {
  const { t } = useTranslation(defaultNS); // Initialize translation hook

  // Base URL for GCS images
  const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

  // Placeholder data using translation keys and GCS URLs
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
      slug: "sibenik", // Example slug
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
      priceRaw: "€250 / noć", // Keep raw for display flexibility
      priceCategory: "€€€€",
      tagsKeys: ["tag_spa", "tag_pool", "tag_restaurant"],
      imageUrl: `${gcsBaseUrl}Opatija.jpg`,
      slug: "luxury-seaside-resort-opatija",
    },
    {
      id: "kulen_tour_osijek",
      typeKey: "recommendation_type_restaurant", // Or maybe "experience"?
      nameKey: "recommendation_kulen_tour_name",
      locationKey: "recommendation_kulen_tour_location",
      descriptionKey: "recommendation_kulen_tour_description",
      rating: 4.9,
      reviews: 189,
      priceRaw: "35€ / osoba",
      priceCategory: "€€",
      tagsKeys: ["tag_kulen", "tag_gourmet", "tag_local"],
      // Use food_slavonia.jpg as requested
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

  // Options for Select components
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
         {/* SVG Map Section */}
         <div className="mt-6 p-4 border rounded bg-muted/50 text-center flex items-center justify-center overflow-hidden">
            {/* Use GCS URL for the map SVG */}
            <Image 
              src={`${gcsBaseUrl}croatia_map.svg`} 
              alt={t('alt_croatia_map') || "Karta Hrvatske po regijama"} 
              width={400} 
              height={300} 
              className="max-w-full h-auto object-contain" 
              // unoptimized={true} // Add if SVG optimization causes issues
            />
         </div>
      </div>

      {/* Popular Destinations Section */}
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
                  // unoptimized={true} // Add if needed
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
                 {/* Ensure links are locale-aware */}
                 <Button asChild variant="link" className="p-0 text-destructive hover:text-destructive/80">
                    <Link href={`/${locale}/explore/${dest.slug}`}>{t('explore_discover_more_button')}</Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Find Stay, Meal, Adventure Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-primary/90">
            {t('explore_find_section_title')}
          </h2>
          {/* View toggle (Grid/List) - Placeholder */}
          {/* Consider making this functional later */}
          {/* <div className="flex space-x-1">
            <Button variant="outline" size="icon" className="bg-accent border-border"><svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg></Button>
            <Button variant="outline" size="icon" className="border-border"><svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg></Button>
          </div> */}
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
                  // unoptimized={true} // Add if needed
                />
                 {/* Display price category if available */}
                 {rec.priceCategory && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded">
                     {rec.priceCategory}
                  </div>
                )}
                 {/* Fallback to raw price if category isn't set but price is */}
                 {rec.priceRaw && !rec.priceCategory && (
                   <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded">
                    {rec.priceRaw.split(" ")[0]} {/* Show only price amount */}
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
                {/* Display raw price if available */}
                {rec.priceRaw && <span className="text-lg font-semibold text-foreground">{rec.priceRaw}</span>}
                {/* If no raw price but category exists, show category (less common) */}
                {!rec.priceRaw && rec.priceCategory && <span className="text-lg font-semibold text-foreground">{rec.priceCategory}</span>}
                {/* Ensure link is locale-aware */}
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
