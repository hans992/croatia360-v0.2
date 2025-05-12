// src/components/PopularDestinationCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Award } from 'lucide-react'; // Added Award icon for featured
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';

// Interface for the component props
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

interface PopularDestinationCardProps {
    destination: Destination;
    locale: Locale;
}

const PopularDestinationCard: React.FC<PopularDestinationCardProps> = ({ destination, locale }) => {
    const { t } = useTranslation(defaultNS); // Use translation hook

    return (
        <Card className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out bg-card text-card-foreground border border-transparent hover:border-primary/30 flex flex-col h-full">
            {/* Link wraps the entire card content */}
            <Link href={`/${locale}/destinations/${destination.slug}`} className="flex flex-col h-full">
                <CardHeader className="p-0">
                    <div className="relative w-full aspect-[16/10] overflow-hidden"> {/* Fixed aspect ratio */}
                        <Image
                            src={destination.imageUrl}
                            alt={t(destination.nameKey)}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimized sizes
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-500 ease-in-out group-hover:scale-105" // Subtle zoom on hover
                        />
                        {/* Optional: Add a subtle overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>

                        {/* Featured Badge */}
                        {destination.featured && (
                            <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-md">
                                <Award className="w-3 h-3 mr-1" />
                                {t('featured_label', 'Istaknuto')} {/* Added translation key */}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col flex-grow"> {/* Content takes remaining space */}
                    <CardTitle className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors duration-300">{t(destination.nameKey)}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-3">{t(destination.regionKey)}</CardDescription>
                    {/* Description hidden on smaller cards, shown on larger */}
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-grow hidden sm:block">{t(destination.descriptionKey)}</p>
                    {/* Rating pushed to the bottom */}
                    <div className="mt-auto flex items-center text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span className="font-medium text-foreground">{destination.rating.toFixed(1)}</span>
                        <span className="ml-1">({destination.reviews} {t('reviews_label', 'recenzija')})</span> {/* Added translation key */}
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
};

export default PopularDestinationCard;
