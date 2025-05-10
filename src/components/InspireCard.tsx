// src/components/InspireCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { defaultNS } from '@/lib/i18n/settings';
import { ArrowRight } from 'lucide-react'; // Ikona za gumb

interface InspireCardProps {
  titleKey: string;
  descriptionKey: string;
  imageUrl: string;
  color1: string;
  color2: string;
  slug: string; // npr. "beaches", "culture"
}

const InspireCard: React.FC<InspireCardProps> = ({
  titleKey,
  descriptionKey,
  imageUrl,
  color1,
  color2,
  slug
}) => {
  const { t } = useTranslation(defaultNS);
  // Pretpostavka da link vodi na explore stranicu s filterom kategorije
  // ili na specifičnu stranicu inspiracije ako je tako definirano
  const linkHref = `/explore?category=${slug}`; // Prilagodi ako je drugačija struktura linka

  return (
    <Link href={linkHref} className="block h-full group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
      <div className="relative h-full w-full">
        {/* Slika - zauzima cijelu pozadinu kartice */}
        <Image
          src={imageUrl}
          alt={t(titleKey)}
          fill
          className="object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradijent overlay - suptilniji i ide od dna prema gore */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${color1}BF 0%, ${color1}80 35%, ${color2}1A 65%, transparent 100%)`
          }}
        ></div>

        {/* Sadržaj kartice - pozicioniran na dnu */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md group-hover:text-yellow-300 transition-colors">
              {t(titleKey)}
            </h3>
            <p className="text-white text-sm mb-4 line-clamp-2 drop-shadow-sm">
              {t(descriptionKey)}
            </p>
            <button
              aria-label={t('inspiration_discover_more_aria', { inspiration_title: t(titleKey) }) || `Discover more about ${t(titleKey)}`}
              className="inline-flex items-center bg-white/90 hover:bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-sm group-hover:pl-3 group-hover:pr-2"
            >
              {t('inspiration_discover_more')}
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InspireCard;
