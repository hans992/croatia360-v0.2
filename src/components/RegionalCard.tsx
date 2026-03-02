// src/components/RegionalCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { defaultNS, type Locale } from '@/lib/i18n/settings';

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
  const { t } = useTranslation(defaultNS); // Osiguraj da je defaultNS ispravan (npr. 'common')
  const params = useParams();
  const currentLocale = params.locale as Locale;

  const regionPagePath = `/${currentLocale}/regions/${slug}`;

  return (
    <Link href={regionPagePath} passHref legacyBehavior={false}>
      <motion.div
        className="relative h-[300px] md:h-[350px] rounded-xl shadow-xl overflow-hidden group cursor-pointer backdrop-blur-md bg-white/10 dark:bg-white/10 border border-white/20 dark:border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={imageUrl}
            alt={t(regionKey)}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${color1}BF 0%, ${color1}99 30%, ${color2}33 60%, transparent 100%)`,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 z-10 flex flex-col justify-end h-full">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">
              {t(regionKey)}
            </h3>
            <div
              className="transform transition-all duration-300 ease-out
                         hover-hover:opacity-0 hover-hover:translate-y-4 hover-hover:group-hover:opacity-100 hover-hover:group-hover:translate-y-0
                         no-hover:opacity-100"
            >
              <p className="text-white text-sm mb-3 line-clamp-2 md:line-clamp-3 drop-shadow-sm">
                {t(descriptionKey)}
              </p>
              <button
                aria-label={t('explore_page_discover_region_aria_label', { regionName: t(regionKey) }) || `Discover ${t(regionKey)}`}
                className="bg-white text-primary hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-xs md:text-sm"
              >
                {t('explore_page_discover_region', { regionName: t(regionKey) })}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default RegionalCard;