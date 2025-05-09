// src/app/[locale]/chat/page.tsx
"use client";

import React, { useEffect, Suspense, useState } from 'react';
import Chatbot from '@/components/chatbot/Chatbot';
// Import the new InspirationalSlideshow component
import InspirationalSlideshow from '@/components/chat/InspirationalSlideshow'; // Adjust path
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { type Locale } from '@/lib/i18n/settings';

// Example image URLs from your GCS bucket
const GCS_BASE_URL = "https://storage.googleapis.com/croatia360/images/";
const defaultSlideshowImageUrls: string[] = [
  `${GCS_BASE_URL}inspiring_beach.jpg`,
  `${GCS_BASE_URL}inspiring_culture.jpg`,
  `${GCS_BASE_URL}inspiring_nature.jpg`,
  `${GCS_BASE_URL}inspiring_food.jpg`,
  `${GCS_BASE_URL}Zagreb_Trg_kralja_Tomislava.jpg`, 
  `${GCS_BASE_URL}Hvar_grad.jpg`,
  `${GCS_BASE_URL}Istria_stock.jpg`,
  `${GCS_BASE_URL}senj.jpg`,
  // Dodajte još nekoliko kvalitetnih slika iz Hrvatske
];


const ChatPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const routeParams = useParams();
    const currentLocale = routeParams.locale as Locale;
    const initialQueryFromUrl = searchParams.get('initialQuery');

    // State for slideshow images; can be made dynamic later based on chat context
    const [currentSlideshowImages, setCurrentSlideshowImages] = useState<string[]>(defaultSlideshowImageUrls);

    useEffect(() => {
        if (initialQueryFromUrl) {
            const currentPathname = `/${currentLocale}/chat`;
            router.replace(currentPathname, { scroll: false });

            // TODO for later:
            // Based on initialQueryFromUrl or ongoing chat, you could update currentSlideshowImages
            // For example:
            // const query = initialQueryFromUrl.toLowerCase();
            // if (query.includes('plitvice')) {
            //   setCurrentSlideshowImages([url1_plitvice, url2_plitvice]);
            // } else if (query.includes('dubrovnik')) {
            //   setCurrentSlideshowImages([url1_dubrovnik, url2_dubrovnik]);
            // } else {
            //   setCurrentSlideshowImages(defaultSlideshowImageUrls);
            // }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQueryFromUrl, currentLocale, router]); // router is stable

    const siteHeaderHeight = 64; // Height of your main site header

    return (
        <div
            className="flex flex-col md:flex-row w-full overflow-hidden bg-background text-foreground"
            style={{ height: `calc(100vh - ${siteHeaderHeight}px)` }}
        >
            {/* Chatbot Section */}
            <div className="w-full md:w-1/2 h-full flex flex-col p-2 sm:p-4">
                <Chatbot initialQuery={initialQueryFromUrl} />
            </div>

            {/* Inspirational Slideshow Section */}
            <div className="hidden md:flex md:w-1/2 h-full p-2 sm:p-4 items-center justify-center">
                {/* Using the new InspirationalSlideshow component */}
                <InspirationalSlideshow imageUrls={currentSlideshowImages} autoplayInterval={4000} />
            </div>
        </div>
    );
};

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        Loading Chat Experience...
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}