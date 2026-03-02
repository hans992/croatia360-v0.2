// src/app/components/InspireCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { defaultNS, type Locale } from '@/lib/i18n/settings';

interface InspireCardProps {
  titleKey: string;
  descriptionKey: string;
  imageUrl: string;
  color1: string;
  color2: string;
  slug: string;
  chatQuery?: string;
}

const InspireCard: React.FC<InspireCardProps> = ({
  titleKey,
  descriptionKey,
  imageUrl,
  color1,
  color2,
  slug,
  chatQuery
}) => {
  const { t } = useTranslation(defaultNS);
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const href = chatQuery
    ? `/${locale}/chat?initialQuery=${encodeURIComponent(chatQuery)}`
    : `/${locale}/inspiration/${slug}`;

  return (
    <Link href={href} className="block h-full group">
      <motion.div
        className="relative h-full overflow-hidden rounded-2xl premium-card-hover backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        <div className="relative h-56 w-full">
          <Image 
            src={imageUrl} 
            alt={t(titleKey)} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div 
          className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90" 
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${color1}dd 50%, ${color2}ee 100%)`
          }}
        />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="font-heading text-xl font-semibold text-white mb-2 drop-shadow-lg">
            {t(titleKey)}
          </h3>
          <p className="text-white/90 text-sm mb-4 line-clamp-2">
            {t(descriptionKey)}
          </p>
          <span className="inline-flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
            {t('inspiration_discover_more')}
            <span className="text-accent">→</span>
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default InspireCard;
