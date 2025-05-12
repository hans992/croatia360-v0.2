// src/app/components/HeroChatbotSection.tsx
"use client";

import React from 'react';
import Chatbot from "@/components/chatbot/Chatbot"; // Provjeri putanju
import Image from 'next/image';

export default function HeroChatbotSection() {
    // URL pozadinske slike - zamijeni ako je potrebno
    const backgroundImageUrl = "https://storage.googleapis.com/croatia360/images/regions/dalmacija/Dubrovnik_wall_tour.jpg"; // Placeholder - ZAMIJENI OVO

    return (
        // Glavni omotač sekcije - stilovi za hero izgled
        <section
            className="relative w-full h-[70vh] md:h-[80vh] min-h-[500px] md:min-h-[600px] overflow-hidden flex items-center justify-center animate-fadeIn"
        >
            {/* Pozadinska Slika */}
            <Image
                src={backgroundImageUrl}
                alt="Pozadina hrvatskog krajolika" // Alt tekst na hrvatskom
                fill
                style={{ objectFit: 'cover' }}
                priority // Važno za LCP (Largest Contentful Paint)
                className="z-[-2]" // Iza sadržaja i sloja
            />
            {/* Tamni sloj preko slike za kontrast */}
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-[-1]"></div>

            {/* Kontejner za sadržaj (centrira unutar full-width sekcije) */}
            <div className="container mx-auto px-4 relative z-10">
                {/* Renderira Chatbot u 'hero' varijanti */}
                <Chatbot
                    variant={'hero'} // Eksplicitno postavljamo hero varijantu
                    redirectOnSubmitUrl="/chat" // URL za preusmjeravanje
                />
            </div>
        </section>
    );
}
