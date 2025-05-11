// src/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot"; 
import { useScrollDirection } from '@/hooks/useScrollDirection'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyChatbotSection() {
  const [isSticky, setIsSticky] = useState(false);
  const sectionWrapperRef = useRef<HTMLDivElement>(null);
  const [placeholderHeight, setPlaceholderHeight] = useState<number>(0);
  
  const scrollDirection = useScrollDirection();
  // Visina headera definirana u Header.tsx kao 'h-16' (4rem = 64px)
  const siteHeaderHeight = 64; 

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

  // Logika za poziciju ljepljive trake
  // Ako je header skriven (scrollDirection === 'down'), chatbot ide na vrh (top-0)
  // Ako je header vidljiv, chatbot ide ispod njega (top-[64px])
  const stickyChatbotBarTopClass = scrollDirection === 'down' 
    ? 'top-0'
    : `top-[${siteHeaderHeight}px]`;

  return (
    <>
      {isSticky && <div style={{ height: `${placeholderHeight}px` }} />}

      {/* Vanjski div sada samo drži ref i služi kao kontejner za AnimatePresence */}
      <div ref={sectionWrapperRef} className="relative">
        <AnimatePresence initial={false}>
          {isSticky ? (
            <motion.div
              key="sticky-chatbot"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
              // Ljepljiva traka sada eksplicitno ima 'fixed' i pozicioniranje
              className={`fixed left-0 right-0 z-40 will-change-transform 
                         ${stickyChatbotBarTopClass} 
                         bg-background/85 dark:bg-slate-900/85 backdrop-blur-lg shadow-xl border-b border-border/20`} 
            >
              <div className="container mx-auto px-4">
                <Chatbot isSticky={true} redirectOnSubmitUrl="/chat" />
              </div>
            </motion.div>
          ) : (
            <motion.section
              key="non-sticky-chatbot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative container mx-auto px-4 my-10 md:my-16 py-10 md:py-16 
                         overflow-hidden rounded-3xl 
                         bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 
                         dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900
                         shadow-2xl text-white"
            >
              <div className="absolute inset-0 opacity-10 dark:opacity-[0.07]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="wowPatternSticky" patternUnits="userSpaceOnUse" width="70" height="70" patternTransform="scale(1) rotate(30)">
                      <path d="M0 10h70M10 0v70" stroke="currentColor" strokeWidth="0.4" opacity="0.6"/>
                      <circle cx="35" cy="35" r="1.2" fill="currentColor" opacity="0.8"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#wowPatternSticky)" />
                </svg>
              </div>
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