// src/app/components/InspireCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { defaultNS } from '@/lib/i18n/settings';

interface InspireCardProps {
  titleKey: string;
  descriptionKey: string;
  imageUrl: string;
  color1: string;
  color2: string;
  slug: string;
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

  return (
    <Link href={`/inspiration/${slug}`} className="block h-full">
      <div className="relative h-full overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg">
        {/* Slika */}
        <div className="relative h-48 w-full">
          <Image 
            src={imageUrl} 
            alt={t(titleKey)} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Gradijent overlay */}
        <div 
          className="absolute inset-0 opacity-70" 
          style={{
            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
          }}
        ></div>
        
        {/* Sadržaj (uvijek vidljiv) */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-white">
            {t(titleKey)}
          </h3>
          
          <div>
            <p className="text-white text-sm mb-3">
              {t(descriptionKey)}
            </p>
            <button className="bg-white text-blue-600 px-3 py-1 text-sm rounded-md font-medium">
              {t('inspiration_discover_more')}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InspireCard;
