// src/app/components/chat/TripDetailsPanel.tsx
"use client";

import React from 'react';
import Image from 'next/image';

interface TripDetails {
  title?: string;
  itinerary?: Array<{ day: string; activities: string[] }>;
  images?: string[]; // URLs to images
  // ... other potential fields like pdfUrl, mapData, etc.
}

interface TripDetailsPanelProps {
  details?: TripDetails | null; // Podaci za prikaz
}

const TripDetailsPanel: React.FC<TripDetailsPanelProps> = ({ details }) => {
  if (!details || (!details.title && !details.itinerary?.length && !details.images?.length)) {
    // Prikazujemo nešto ako nema detalja, ili neki placeholder kao prije
    return (
      <div className="w-full h-full bg-muted/50 dark:bg-card flex flex-col items-center justify-center rounded-xl p-6 text-center border border-border">
        <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        <p className="text-muted-foreground text-body-lg">Your personalized trip details will appear here as SARA AI crafts your journey!</p>
        <p className="text-caption mt-2">Ask SARA AI to plan a trip to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-card border border-border shadow-card rounded-xl p-6 overflow-y-auto">
      {details.title && <h2 className="text-h2 text-foreground mb-4">{details.title}</h2>}

      {/* Prikaz slika ako postoje */}
      {details.images && details.images.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-2">
          {details.images.slice(0, 4).map((src, index) => ( // Prikazujemo max 4 slike za primjer
            <Image key={index} src={src} alt={`Inspirational image ${index + 1}`} height={ 200 } className="rounded-md object-cover aspect-video" />
          ))}
        </div>
      )}
      
      {/* Prikaz itinerera ako postoji */}
      {details.itinerary && details.itinerary.length > 0 && (
        <div>
          <h3 className="text-h3 text-foreground mb-3">Itinerary:</h3>
          {details.itinerary.map((item, index) => (
            <div key={index} className="mb-4 pb-2 border-b border-border last:border-b-0">
              <h4 className="font-semibold text-foreground">{item.day}</h4>
              <ul className="list-disc list-inside pl-2 mt-1 text-sm text-muted-foreground">
                {item.activities.map((activity, actIndex) => (
                  <li key={actIndex}>{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      
      {/* Ovdje kasnije mogu doći linkovi na PDF, karte, itd. */}
    </div>
  );
};

export default TripDetailsPanel;