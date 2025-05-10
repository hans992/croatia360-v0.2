// src/components/RegionalCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { defaultNS, type Locale } from '@/lib/i18n/settings';
import { ArrowRight } from 'lucide-react';

interface RegionalCardProps {
  regionKey: string;
  descriptionKey: string;
  imageUrl: string;
  color1: string;
  color2: string;
  slug: string;
}

const RegionalCard: React.FC<RegionalCardProps> = ({
  regionKey,
  descriptionKey,
  imageUrl,
  color1,
  color2,
  slug,
}) => {
  const { t } = useTranslation(defaultNS);
  const params = useParams();
  const currentLocale = params.locale as Locale;
  const regionPagePath = `/${currentLocale}/regions/${slug}`;

  return (
    <Link href={regionPagePath} passHref legacyBehavior={false} className="block h-full w-full"> {/* Added w-full */}
      <div className="relative h-full rounded-xl shadow-lg hover:shadow-2xl overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out flex flex-col">
        <div className="relative w-full aspect-[4/3] shrink-0">
          <Image
            src={imageUrl}
            alt={t(regionKey)}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" // Adjusted sizes
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${color1}E6 0%, ${color1}B3 35%, ${color2}66 70%, transparent 100%)`, // Adjusted gradient stops
          }}
        />
        <div className="relative p-4 md:p-5 z-10 flex flex-col justify-end flex-grow text-white mt-auto">
          <div>
            {/* UKLONJEN group-hover:text-yellow-300 */}
            <h3 className="text-xl md:text-2xl font-bold mb-1 drop-shadow-lg transition-colors">
              {t(regionKey)}
            </h3>
            <div
              className="transition-all duration-300 ease-out overflow-hidden 
                         hover-hover:opacity-0 hover-hover:max-h-0 group-hover:opacity-100 group-hover:max-h-[200px] 
                         no-hover:opacity-100 no-hover:max-h-[200px]"
            >
              <p className="text-sm mt-1 mb-2 line-clamp-3 drop-shadow-sm">
                {t(descriptionKey)}
              </p>
              <button
                aria-label={t('explore_page_discover_region_aria_label', { regionName: t(regionKey) }) || `Discover ${t(regionKey)}`}
                className="inline-flex items-center bg-white/90 hover:bg-white text-primary font-semibold py-1.5 px-3 rounded-md shadow hover:shadow-md transition-colors text-xs"
              >
                {t('explore_page_discover_region', { regionName: t(regionKey) })}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RegionalCard;
