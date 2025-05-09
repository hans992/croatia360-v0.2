// src/app/[locale]/chat/page.tsx
"use client";

import React, { useEffect, Suspense } from 'react';
import Chatbot from '@/components/chatbot/Chatbot'; 
import { useSearchParams, useRouter, useParams } from 'next/navigation'; // For reading query params and locale
import { type Locale } from '@/lib/i18n/settings'; // Assuming Locale type

// Placeholder for inspirational images component
const InspirationalImagesPlaceholder = () => {
  return (
    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center rounded-lg animate-pulse">
      <p className="text-slate-500 text-lg">Inspirational Images Coming Soon...</p>
    </div>
  );
};

// Content of the chat page, wrapped in Suspense in the default export
const ChatPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const routeParams = useParams(); // For locale, if needed for anything else here
    const currentLocale = routeParams.locale as Locale;

    const initialQueryFromUrl = searchParams.get('initialQuery');

    useEffect(() => {
        // Clean up the URL by removing the initialQuery parameter after it's been read.
        // This prevents re-processing on refresh or if the user navigates back/forward.
        if (initialQueryFromUrl) {
            // Construct current pathname without query params to replace
            // Ensure locale is part of the path for replacement
            const currentPathname = `/${currentLocale}/chat`;
            router.replace(currentPathname, { scroll: false });
        }
        // Only run this effect if initialQueryFromUrl changes (effectively once after it's present)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQueryFromUrl, currentLocale, router]);


    return (
        // Main container for the split-screen layout, takes full screen height
        <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-background text-foreground">
            {/* Chatbot Section (Left or Full on Mobile) */}
            <div className="w-full md:w-1/2 h-full flex flex-col p-2 sm:p-4">
                {/* Pass the initialQuery to the Chatbot component */}
                {/* The Chatbot component itself should not have redirectOnSubmitUrl here */}
                <Chatbot initialQuery={initialQueryFromUrl} />
            </div>

            {/* Inspirational Images Section (Right, Hidden on Mobile) */}
            <div className="hidden md:flex md:w-1/2 h-full p-2 sm:p-4 items-center justify-center">
                <InspirationalImagesPlaceholder />
            </div>
        </div>
    );
};

// Default export for the page, wrapping content in Suspense
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