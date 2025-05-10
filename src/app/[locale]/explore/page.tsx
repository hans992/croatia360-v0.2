// src/app/[locale]/explore/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Search, TrendingUp, ThumbsUp, Tags } from "lucide-react"; // ISPRAVLJENA IKONA: Tags

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale, locales as validLocalesArray } from '@/lib/i18n/settings';
import { useParams, notFound } from 'next/navigation';

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
  type?: 'destination';
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
  type?: 'recommendation';
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

interface FilterOption {
  value: string;
  labelKey: string;
}

const gcsBaseUrl = "https://storage.googleapis.com/croatia360/images/";

const regionsData: Region[] = [
  { id: "slavonija", nameKey: "region_slavonija", descriptionKey: "region_slavonija_description_short", imageUrl: `${gcsBaseUrl}regions/slavonija/Slavonija_Card.jpg`, color1: '#FFD700', color2: '#8B4513', slug: "slavonija" },
  { id: "sredisnja_hrvatska", nameKey: "region_sredisnja", descriptionKey: "region_sredisnja_description_short", imageUrl: `${gcsBaseUrl}regions/sredisnja_hrvatska/Sredisnja_Card.jpg`, color1: '#800020', color2: '#2E8B57', slug: "sredisnja-hrvatska" },
  { id: "zagreb", nameKey: "region_zagreb", descriptionKey: "region_zagreb_description_short", imageUrl: `${gcsBaseUrl}regions/zagreb/Zagreb_Card.jpg`, color1: '#5D3FD3', color2: '#EAE0D5', slug: "zagreb" },
  { id: "lika_gorski_kotar", nameKey: "region_lika_gorski_kotar", descriptionKey: "region_lika_gorski_kotar_description_short", imageUrl: `${gcsBaseUrl}regions/lika_gorski_kotar/Lika_Gorski_Kotar_Card.jpg`, color1: '#228B22', color2: '#40E0D0', slug: "lika-gorski-kotar" },
  { id: "istra", nameKey: "region_istra", descriptionKey: "region_istra_description_short", imageUrl: `${gcsBaseUrl}regions/istra/Istria_Card.jpg`, color1: '#E07A5F', color2: '#808000', slug: "istra" },
  { id: "kvarner", nameKey: "region_kvarner", descriptionKey: "region_kvarner_description_short", imageUrl: `${gcsBaseUrl}regions/kvarner/Kvarner_Card.jpg`, color1: '#009688', color2: '#CFD8DC', slug: "kvarner" },
  { id: "dalmacija", nameKey: "region_dalmacija", descriptionKey: "region_dalmacija_description_short", imageUrl: `${gcsBaseUrl}regions/dalmacija/Dalmacija_Card.jpg`, color1: '#007FFF', color2: '#F8F8FF', slug: "dalmacija" },
];

export default function ExplorePage() {
  const params = useParams();
  const { t } = useTranslation(defaultNS);
  const localeParam = params.locale;

  if (typeof localeParam !== 'string' || !validLocalesArray.includes(localeParam as Locale)) {
    notFound();
  }
  const currentLocale = localeParam as Locale;

  const popularDestinations: Destination[] = [ /* ... ostaje isto ... */ ];
  const recommendations: Recommendation[] = [ /* ... ostaje isto ... */ ];
  const categoryOptions: FilterOption[] = [ /* ... ostaje isto ... */ ];
  const regionFilterOptions: FilterOption[] = [ /* ... ostaje isto ... */ ];
  const priceOptions: FilterOption[] = [ /* ... ostaje isto ... */ ];

  return (
    <main className="container mx-auto px-4 py-8 animate-fadeIn">
      <section className="text-center py-12 md:py-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-primary dark:text-primary-foreground">
          {t('explore_page_title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('explore_page_subtitle')}
        </p>
      </section>

      {/* Regional Cards Section - Flexbox za centriranje zadnjeg reda */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center text-secondary dark:text-secondary-foreground">
          {t('explore_page_select_region_title')}
        </h2>
        <div className="flex flex-wrap justify-center -m-3 md:-m-4"> {/* Negativni margin za kompenzaciju paddinga na itemima */}
          {regionsData.map((region) => (
            // Svaka kartica zauzima trećinu na lg, polovinu na sm, punu širinu na xs
            // Padding na itemima stvara razmak
            <div key={region.id} className="w-full sm:w-1/2 lg:w-1/3 p-3 md:p-4 flex"> {/* DODANO: flex da osigura jednaku visinu djece ako RegionalCard koristi h-full */}
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

      {/* Search & Filters Section - Pozadina promijenjena */}
      <section className="mb-16 md:mb-20 p-6 md:p-8 bg-slate-100 dark:bg-slate-800/50 backdrop-blur-md rounded-xl shadow-xl">
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-center text-primary dark:text-primary-foreground flex items-center justify-center">
          <Search className="w-7 h-7 md:w-8 md:h-8 mr-3" />
          {t('explore_page_search_title')}
        </h3>
        <div className="flex flex-col lg:flex-row gap-4 mb-6 items-end">
          <Input
            type="search"
            aria-label={t('explore_search_aria_label')}
            placeholder={t('explore_search_placeholder')}
            className="flex-grow text-base p-3 h-12 border-border rounded-md focus:ring-ring focus:border-ring bg-background dark:bg-slate-700"
          />
          <Button size="lg" className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 h-12">
            {t('explore_search_button')}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Select komponente ostaju iste */}
          <Select>
            <SelectTrigger className="w-full text-base p-3 h-12 rounded-md border-border bg-background dark:bg-slate-700">
              <SelectValue placeholder={t('filter_category_label')} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-base">{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full text-base p-3 h-12 rounded-md border-border bg-background dark:bg-slate-700">
               <SelectValue placeholder={t('filter_region_label')} />
            </SelectTrigger>
            <SelectContent>
              {regionFilterOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-base">{t(option.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full text-base p-3 h-12 rounded-md border-border bg-background dark:bg-slate-700">
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

      {/* Popular Destinations Section - Kartice s novom pozadinom */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center text-secondary dark:text-secondary-foreground flex items-center justify-center">
            <TrendingUp className="w-8 h-8 md:w-9 md:h-9 mr-3" />
            {t('explore_page_popular_destinations_title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {popularDestinations.map((item) => (
            <Card key={item.id} className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 flex flex-col"> {/* PROMIJENJENA POZADINA */}
              <Link href={`/${currentLocale}/destinations/${item.slug}`} className="block flex flex-col h-full">
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
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rounded-full shadow-md z-10">
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
                <CardFooter className="p-5 pt-0 border-t border-border/20 mt-auto">
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

      {/* Recommendations Section - Kartice s novom pozadinom i popravkom za tag */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center text-secondary dark:text-secondary-foreground flex items-center justify-center">
            <ThumbsUp className="w-8 h-8 md:w-9 md:h-9 mr-3" />
            {t('explore_page_recommendations_title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recommendations.map((item) => (
            <Card key={item.id} className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 flex flex-col"> {/* PROMIJENJENA POZADINA */}
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
                   <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2.5 py-1 text-xs font-semibold rounded-full shadow-md z-10 flex items-center">
                      <Tags className="w-3.5 h-3.5 mr-1.5" /> {/* ISPRAVLJENA IKONA */}
                      {t(item.typeKey)}
                    </div>
                </CardHeader>
                {/* CardContent sada ima padding-top da se naslov ne preklapa sa značkom */}
                <CardContent className="p-5 pt-10 flex-grow"> {/* DODAN pt-10 */}
                  <CardTitle className="text-xl lg:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">{t(item.nameKey)}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mb-1 flex items-center">
                     <MapPin className="w-4 h-4 mr-2 text-secondary" />
                    {t(item.locationKey)}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{t(item.descriptionKey)}</p>
                  {item.tagsKeys && item.tagsKeys.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 mt-auto pt-3">
                      {item.tagsKeys.map(tagKey => (
                        <span key={tagKey} className="text-xs bg-accent/20 text-accent-foreground px-2.5 py-1 rounded-full">{t(tagKey)}</span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-5 pt-0 border-t border-border/20 mt-auto flex items-center justify-between">
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
