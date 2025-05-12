// src/app/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot";
import { useScrollDirection } from '@/hooks/useScrollDirection';
import Image from 'next/image'; // Import Image component

export default function StickyChatbotSection() {
    const [isSticky, setIsSticky] = useState(false);
    const sectionWrapperRef = useRef<HTMLDivElement>(null);
    const [placeholderHeight, setPlaceholderHeight] = useState<number>(0);
    const scrollDirection = useScrollDirection();
    const siteHeaderHeight = 64; // Assume header height
    const initialOffsetTopRef = useRef<number | null>(null);

    // Background image URL (replace with your high-quality image URL)
    // Suggestion: A beautiful, slightly abstract Croatian landscape/seascape
    const backgroundImageUrl = "https://storage.googleapis.com/croatia360/images/regions/dalmacija/Dubrovnik_wall_tour.jpg"; // Placeholder - REPLACE THIS

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
        : `top-[${siteHeaderHeight}px]`; // Sticks below header

    return (
        <>
            {/* Placeholder to prevent layout jump */}
            {isSticky && <div style={{ height: `${placeholderHeight}px` }} />}

            {/* Main Section Wrapper */}
            <div
                ref={sectionWrapperRef}
                className={
                    isSticky
                        ? `fixed left-0 right-0 will-change-transform transition-all duration-300 ease-in-out ${stickyChatbotBarTopClass} z-40 bg-background/80 backdrop-blur-md shadow-md` // Sticky bar styling
                        : `relative w-full h-[70vh] md:h-[80vh] min-h-[500px] md:min-h-[600px] my-0 overflow-hidden flex items-center justify-center animate-fadeIn` // Non-sticky hero section styling
                }
            >
                {/* Background Image and Overlay (Only for non-sticky state) */}
                {!isSticky && (
                    <>
                        <Image
                            src={backgroundImageUrl}
                            alt="Pozadina hrvatskog krajolika" // Alt text in Croatian
                            fill
                            style={{ objectFit: 'cover' }}
                            priority // Load image early
                            className="z-[-2]" // Place behind content and overlay
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 z-[-1]"></div>
                    </>
                )}

                {/* Content Container */}
                <div className={`container mx-auto px-4 ${isSticky ? '' : 'relative z-10'}`}>
                    {/* Render Chatbot: compact when sticky, full version otherwise */}
                    <Chatbot
                        isSticky={isSticky}
                        redirectOnSubmitUrl="/chat"
                        // Pass a prop to indicate it's the hero section version for styling inside Chatbot
                        variant={isSticky ? 'sticky' : 'hero'}
                    />
                </div>
            </div>
        </>
    );
}
