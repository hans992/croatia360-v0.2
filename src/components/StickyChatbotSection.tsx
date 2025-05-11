// src/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot"; 
import { useScrollDirection } from '@/hooks/useScrollDirection'; 
import { motion, AnimatePresence } from 'framer-motion'; // Za animacije

export default function StickyChatbotSection() {
  const [isSticky, setIsSticky] = useState(false);
  const sectionWrapperRef = useRef<HTMLDivElement>(null);
  const [placeholderHeight, setPlaceholderHeight] = useState<number>(0);
  
  const scrollDirection = useScrollDirection();
  const siteHeaderHeight = 64; // Pretpostavljena visina vašeg glavnog headera

  const initialOffsetTopRef = useRef<number | null>(null);

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

      if (window.scrollY > triggerPoint) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
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
    }
    else if (isSticky && placeholderHeight === 0 && sectionWrapperRef.current) {
        setPlaceholderHeight(sectionWrapperRef.current.offsetHeight);
    }
  }, [isSticky, placeholderHeight]);

  const stickyChatbotBarTopClass = scrollDirection === 'down' 
    ? 'top-0'
    : `top-[${siteHeaderHeight}px]`;

  return (
    <>
      {/* Placeholder za sprječavanje skakanja layouta */}
      {isSticky && <div style={{ height: `${placeholderHeight}px` }} />}

      <div ref={sectionWrapperRef} className={isSticky ? "fixed left-0 right-0 z-40" : "relative"}>
        <AnimatePresence>
          {isSticky ? (
            <motion.div
              key="sticky-chatbot"
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={`will-change-transform transition-all duration-300 ease-in-out
                         ${stickyChatbotBarTopClass} 
                         bg-background/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-xl border-b border-border/20`} 
            >
              <div className="container mx-auto px-4">
                <Chatbot isSticky={true} redirectOnSubmitUrl="/chat" />
              </div>
            </motion.div>
          ) : (
            // Unaprijeđena Ne-Ljepljiva Sekcija
            <motion.section
              key="non-sticky-chatbot"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative container mx-auto px-4 my-10 md:my-16 py-8 md:py-12 
                         overflow-hidden rounded-3xl 
                         bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 
                         dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900
                         shadow-2xl text-white"
            >
              {/* Suptilni pozadinski uzorak ili efekt */}
              <div className="absolute inset-0 opacity-10 dark:opacity-5">
                {/* Primjer SVG uzorka - može se zamijeniti ili poboljšati */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="wowPattern" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="scale(1) rotate(45)">
                      <path d="M0 10h60M10 0v60" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
                      <circle cx="30" cy="30" r="1.5" fill="currentColor" opacity="0.7"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#wowPattern)" />
                </svg>
              </div>
              
              {/* Sadržaj Chatbota */}
              <div className="relative z-10"> 
                <Chatbot isSticky={false} redirectOnSubmitUrl="/chat" />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}