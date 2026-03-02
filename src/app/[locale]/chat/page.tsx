// src/app/[locale]/chat/page.tsx
"use client";

import React, { useEffect, Suspense, useState, useCallback } from "react";
import Chatbot from "@/components/chatbot/Chatbot";
import RegionMap from "@/components/map/RegionMap";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { type Locale } from "@/lib/i18n/settings";
import { getRegionFromText, getCroatiaDefault } from "@/lib/regions/coordinates";

const ChatPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const currentLocale = routeParams.locale as Locale;
  const initialQueryFromUrl = searchParams.get("initialQuery");

  const defaultView = getCroatiaDefault();
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [mapZoom, setMapZoom] = useState<number | undefined>(undefined);

  const handleAssistantMessage = useCallback((content: string) => {
    const region = getRegionFromText(content);
    if (region) {
      setMapCenter(region.center);
      setMapZoom(region.zoom);
    }
  }, []);

  useEffect(() => {
    if (initialQueryFromUrl) {
      const currentPathname = `/${currentLocale}/chat`;
      router.replace(currentPathname, { scroll: false });
    }
  }, [initialQueryFromUrl, currentLocale, router]);

  const siteHeaderHeight = 64;

  return (
    <div
      className="flex flex-col md:flex-row w-full overflow-hidden premium-gradient-bg text-foreground"
      style={{ height: `calc(100vh - ${siteHeaderHeight}px)` }}
    >
      <div className="w-full md:w-1/2 h-full flex flex-col p-4 sm:p-6 lg:p-8">
        <Chatbot
          initialQuery={initialQueryFromUrl}
          onAssistantMessage={handleAssistantMessage}
        />
      </div>
      <div className="hidden md:flex md:w-1/2 h-full p-4 sm:p-6 lg:p-8 items-stretch justify-center bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
          <RegionMap
            center={mapCenter ?? defaultView.center}
            zoom={mapZoom ?? defaultView.zoom}
          />
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen premium-gradient-bg text-foreground">
        <div className="animate-pulse font-heading text-lg text-muted-foreground">Loading...</div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}