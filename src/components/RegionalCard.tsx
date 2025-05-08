// src/app/components/RegionalCard.tsx
"use client"; // Necessary for hooks like useTranslation

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { defaultNS } from '@/lib/i18n/settings'; // Adjust path if necessary

interface RegionalCardProps {
  regionKey: string;
  descriptionKey: string;
  imageUrl: string;
  color1: string;
  color2: string;
  slug: string;
}

const RegionalCard: React.FC<RegionalCardProps> = ({ regionKey, descriptionKey, imageUrl, color1, color2, slug }) => {
  const { t } = useTranslation(defaultNS);

  return (
    <Link href={`/${slug}`} passHref> {/* Updated Link path for root-level slugs like /slavonija */}
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden h-full transform transition-all duration-300 hover:scale-105 cursor-pointer group">
        {/* Image Section */}
        <div className="md:w-2/5 w-full h-56 md:h-auto relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={t(regionKey)}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-110" // Subtle zoom on hover
          />
        </div>
        
        {/* Content Section with Gradient, Blur, and Opacity */}
        <div 
          className="md:w-3/5 w-full p-6 flex flex-col justify-between"
          style={{
            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
          }}
        >
          {/* Inner container for text with semi-transparent blurred background */}
          <div className="bg-black/30 backdrop-blur-md p-5 rounded-lg h-full flex flex-col">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 drop-shadow-md">
              {t(regionKey)}
            </h3>
            <p className="text-gray-50 text-sm lg:text-base mb-5 flex-grow drop-shadow-sm">
              {t(descriptionKey)}
            </p>
            <button className="mt-auto bg-white text-gray-800 font-semibold py-2.5 px-5 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition-colors duration-300 self-start">
              {t('explore_page_discover_region', { regionName: t(regionKey) })}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RegionalCard;
