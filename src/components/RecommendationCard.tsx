// src/components/RecommendationCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';

// Interface for the component props
interface Recommendation {
    id: string;
    typeKey: string;
    nameKey: string;
    locationKey: string;
    regionKey: string;
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

interface RecommendationCardProps {
    recommendation: Recommendation;
    locale: Locale;
    regionColor: string; // Prop za boju regije
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, locale, regionColor }) => {
    const { t } = useTranslation(defaultNS);

    return (
         // CORRECTED: Zamijenjen border-l-4 s border-b-4
        <Card
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out bg-card text-card-foreground border-b-4 flex flex-col h-full" // Promijenjeno u border-b-4
            style={{ borderBottomColor: regionColor }} // <<< DODANO: Primjena boje na donji obrub
        >
            <Link href={`/${locale}/recommendations/${recommendation.slug}`} className="flex flex-col h-full">
                <CardHeader className="p-0">
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                        <Image
                            src={recommendation.imageUrl}
                            alt={t(recommendation.nameKey)}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
                         {recommendation.priceCategory && (
                             <Badge
                                variant="secondary"
                                className="absolute top-2 right-2 text-xs font-bold bg-black/50 text-white backdrop-blur-sm"
                             >
                                 {recommendation.priceCategory}
                             </Badge>
                         )}
                    </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col flex-grow">
                    <p className="text-xs uppercase text-primary font-semibold mb-1 tracking-wide">{t(recommendation.typeKey)}</p>
                    <CardTitle className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors duration-300">{t(recommendation.nameKey)}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-2">
                        {t(recommendation.locationKey)} - <span className="font-medium">{t(`region_${recommendation.regionKey}`)}</span> {/* Uklonjen inline stil za boju regije odavde */}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-grow hidden sm:block">{t(recommendation.descriptionKey)}</p>
                    {recommendation.tagsKeys && recommendation.tagsKeys.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                            {recommendation.tagsKeys.slice(0, 3).map(tagKey => (
                                <Badge key={tagKey} variant="outline" className="text-xs px-1.5 py-0.5">
                                    {t(tagKey)}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <div className="mt-auto flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                            <span className="font-medium text-foreground">{recommendation.rating.toFixed(1)}</span>
                            <span className="ml-1">({recommendation.reviews} {t('reviews_label')})</span>
                        </div>
                        {(recommendation.priceAmount && recommendation.priceUnitKey) && (
                            <span className="font-semibold text-accent">€{recommendation.priceAmount} / {t(recommendation.priceUnitKey)}</span>
                        )}
                        {recommendation.priceRaw && !recommendation.priceAmount && <span className="font-semibold text-accent">{recommendation.priceRaw}</span>}
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
};

export default RecommendationCard;
