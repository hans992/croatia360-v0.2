// src/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot";
import { useScrollDirection } from '@/hooks/useScrollDirection';
import Image from 'next/image';

export default function StickyChatbotSection() {
    const [isSticky, setIsSticky] = useState(false);
    const sectionWrapperRef = useRef<HTMLDivElement>(null);
    const [placeholderHeight, setPlaceholderHeight] = useState<number>(0);
    const scrollDirection = useScrollDirection();
    const siteHeaderHeight = 64;
    const initialOffsetTopRef = useRef<number | null>(null);

    // Zamijeni s URL-om tvoje slike visoke kvalitete
    const backgroundImageUrl = "https://storage.googleapis.com/croatia360/images/regions/dalmacija/Dubrovnik_wall_tour.jpg"; // Placeholder - ZAMIJENI OVO

    useEffect(() => {
        const captureInitialOffset = () => {
            if (sectionWrapperRef.current && !isSticky) {
                initialOffsetTopRef.current = sectionWrapperRef.current.offsetTop;
            }
        };
        captureInitialOffset();

        const handleScroll = () => {
            if (initialOffsetTopRef.current === null) {
                 if (sectionWrapperRef.current && !isSticky) {
                     initialOffsetTopRef.current = sectionWrapperRef.current.offsetTop;
                 }
                 if (initialOffsetTopRef.current === null) return;
            }
            const triggerPoint = initialOffsetTopRef.current - siteHeaderHeight;
            setIsSticky(window.scrollY > triggerPoint);
        };

        const timerId = setTimeout(handleScroll, 100);
        window.addEventListener('scroll', handleScroll);
        const handleResize = () => {
            captureInitialOffset();
            handleScroll();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timerId);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [siteHeaderHeight, isSticky]);

    useEffect(() => {
        if (sectionWrapperRef.current && !isSticky) {
            setPlaceholderHeight(sectionWrapperRef.current.offsetHeight);
        } else if (isSticky && placeholderHeight === 0 && sectionWrapperRef.current) {
            setPlaceholderHeight(sectionWrapperRef.current.offsetHeight);
        }
    }, [isSticky, placeholderHeight]);

    const stickyChatbotBarTopClass = scrollDirection === 'down'
        ? 'top-0'
        : `top-[${siteHeaderHeight}px]`;

    return (
        <>
            {/* Placeholder */}
            {isSticky && <div style={{ height: `${placeholderHeight}px` }} />}

            {/* Glavni Omotač Sekcije */}
            <div
                ref={sectionWrapperRef}
                className={
                    isSticky
                        ? `fixed left-0 right-0 will-change-transform transition-all duration-300 ease-in-out ${stickyChatbotBarTopClass} z-40 bg-background/80 backdrop-blur-md shadow-md` // Ljepljiva traka
                        : `relative w-full h-[70vh] md:h-[80vh] min-h-[500px] md:min-h-[600px] overflow-hidden flex items-center justify-center animate-fadeIn` // Hero sekcija - uklonjen container, mx-auto, px-4, my-*, zaobljeni rubovi
                }
            >
                {/* Pozadinska Slika i Sloj (Samo za ne-ljepljivo stanje) */}
                {!isSticky && (
                    <>
                        <Image
                            src={backgroundImageUrl}
                            alt="Pozadina hrvatskog krajolika"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                            className="z-[-2]"
                        />
                        {/* Sloj - možda malo tamniji za bolji kontrast s bijelim tekstom */}
                        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-[-1]"></div>
                    </>
                )}

                {/* Kontejner za Sadržaj (Centrira sadržaj unutar full-width sekcije) */}
                <div className={`container mx-auto px-4 ${isSticky ? '' : 'relative z-10'}`}>
                     {/* Renderira Chatbot */}
                    <Chatbot
                        // Ako želimo potpuno ukloniti sticky, možemo maknuti ovaj uvjet
                        // i uvijek renderirati 'hero' varijantu
                        variant={isSticky ? 'sticky' : 'hero'}
                        redirectOnSubmitUrl="/chat"
                    />
                </div>
            </div>
        </>
    );
}
