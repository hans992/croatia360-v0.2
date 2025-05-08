// src/app/[locale]/page.tsx
"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { defaultNS } from '@/lib/i18n/settings';
import StickyChatbotSection from '@/components/StickyChatbotSection';
import InspireCard from '@/components/InspireCard';

// Definicija inspiracijskih kartica
const inspirationItems = [
  {
    titleKey: 'inspiration_beaches_title',
    descriptionKey: 'inspiration_beaches_description',
    imageUrl: '/images/inspiration/beaches.jpg',
    color1: '#0088cc',
    color2: '#005580',
    slug: 'beaches'
  },
  {
    titleKey: 'inspiration_culture_title',
    descriptionKey: 'inspiration_culture_description',
    imageUrl: '/images/inspiration/culture.jpg',
    color1: '#8e44ad',
    color2: '#5b2c6f',
    slug: 'culture'
  },
  {
    titleKey: 'inspiration_nature_title',
    descriptionKey: 'inspiration_nature_description',
    imageUrl: '/images/inspiration/nature.jpg',
    color1: '#27ae60',
    color2: '#196f3d',
    slug: 'nature'
  },
  {
    titleKey: 'inspiration_food_title',
    descriptionKey: 'inspiration_food_description',
    imageUrl: '/images/inspiration/food.jpg',
    color1: '#d35400',
    color2: '#a04000',
    slug: 'food'
  }
];

// Koristimo _ prefiks za parametre koje ne koristimo direktno
export default function HomePage(_props: { params: { locale?: string } }) {
  const { t } = useTranslation(defaultNS);
  
  // Potpuno uklanjamo nekorištene varijable
  // Nema više resolvedParams, effectiveLocale, itd.

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero section s chatbotom */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              Croatia360
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
              {t('hero_subtitle_sara_ai')}
            </p>
          </div>
          
          {/* Chatbot komponenta */}
          <StickyChatbotSection />
        </div>
      </section>

      {/* Inspiracijska sekcija */}
      <section className="py-12 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t('inspiration_subtitle')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inspirationItems.map((item) => (
              <InspireCard 
                key={item.slug}
                titleKey={item.titleKey}
                descriptionKey={item.descriptionKey}
                imageUrl={item.imageUrl}
                color1={item.color1}
                color2={item.color2}
                slug={item.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
