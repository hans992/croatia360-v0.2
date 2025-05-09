// src/app/[locale]/chat/page.tsx
"use client";

import React, { useEffect, Suspense } from 'react';
import Chatbot from '@/components/chatbot/Chatbot'; // Your Chatbot component
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { type Locale } from '@/lib/i18n/settings';

// Placeholder for the inspirational images component
const InspirationalImagesPlaceholder = () => {
  return (
    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center rounded-lg animate-pulse">
      <p className="text-slate-500 text-lg">Inspirational Images Coming Soon...</p>
    </div>
  );
};

// This component handles the main content logic, using hooks that require Suspense
const ChatPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const routeParams = useParams(); // To get current locale if needed for other operations
    const currentLocale = routeParams.locale as Locale;

    const initialQueryFromUrl = searchParams.get('initialQuery');

    // Effect to clean up the initialQuery from the URL after processing
    useEffect(() => {
        if (initialQueryFromUrl) {
            const currentPathname = `/${currentLocale}/chat`;
            // Replace current URL without the query parameter to prevent resubmission on refresh
            router.replace(currentPathname, { scroll: false });
        }
        // This effect should only run when initialQueryFromUrl or other dependencies change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQueryFromUrl, currentLocale, router]); // router is stable, currentLocale from params is stable per page

    const siteHeaderHeight = 64; // Define the height of your main site header in pixels

    return (
        // Main container for the split-screen layout.
        // It takes the full viewport height minus the site header's height.
        <div
            className="flex flex-col md:flex-row w-full overflow-hidden bg-background text-foreground"
            style={{ height: `calc(100vh - ${siteHeaderHeight}px)` }}
        >
            {/* Chatbot Section (takes half width on desktop, full width on mobile) */}
            <div className="w-full md:w-1/2 h-full flex flex-col p-2 sm:p-4">
                {/* Pass the initialQuery to the Chatbot component.
                  The Chatbot should not have redirectOnSubmitUrl on this page.
                  Its internal structure (flex-col, flex-grow messages, input at bottom)
                  will adapt to the h-full of this parent div.
                */}
                <Chatbot initialQuery={initialQueryFromUrl} />
            </div>

            {/* Inspirational Images Section (takes half width on desktop, hidden on mobile) */}
            <div className="hidden md:flex md:w-1/2 h-full p-2 sm:p-4 items-center justify-center">
                <InspirationalImagesPlaceholder />
            </div>
        </div>
    );
};

// Default export for the page, wrapping content in Suspense for useSearchParams
export default function ChatPage() {
  return (
    <Suspense fallback={
      // Fallback UI shown while searchParams are being read or component is loading
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        Loading Chat Experience...
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}