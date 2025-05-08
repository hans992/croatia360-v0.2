// src/components/RegionalCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { defaultNS } from '@/lib/i18n/settings';

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
  slug 
}) => {
  const { t } = useTranslation(defaultNS);

  return (
    <Link href={`/${slug}`} passHref>
      <div className="relative h-[300px] md:h-[350px] rounded-xl shadow-xl overflow-hidden group cursor-pointer">
        {/* Slika (uvijek vidljiva) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={imageUrl}
            alt={t(regionKey)}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Gradijent overlay (uvijek vidljiv) */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
          style={{
            background: `linear-gradient(to top, ${color1}CC, ${color2}00)`,
          }}
        />
        
        {/* Naslov (uvijek vidljiv) */}
        <div className="absolute inset-x-0 bottom-0 p-6 z-10">
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {t(regionKey)}
          </h3>
          
          {/* Opis i gumb - vidljivi samo na hover na desktop uređajima, uvijek vidljivi na mobilnim */}
          <div className="transform transition-all duration-300 
            hover-hover:opacity-0 hover-hover:translate-y-8 hover-hover:group-hover:opacity-100 hover-hover:group-hover:translate-y-0
            no-hover:opacity-100">
            <p className="text-white text-sm mb-3">{t(descriptionKey)}</p>
            <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-100 transition-colors">
              {t('explore_page_discover_region', { regionName: t(regionKey) })}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RegionalCard;
