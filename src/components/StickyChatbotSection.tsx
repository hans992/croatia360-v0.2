// src/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot"; 
import { useScrollDirection } from '@/hooks/useScrollDirection'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyChatbotSection() {
  const [isSticky, setIsSticky] = useState(false);
  const sectionWrapperRef = useRef<HTMLDivElement>(null); // Ref for the initial section position
  const [placeholderHeight, setPlaceholderHeight] = useState<number>(0); // Height for the placeholder when sticky
  
  const scrollDirection = useScrollDirection();
  const siteHeaderHeight = 64; // Assumed height of your main site header in pixels

  const initialOffsetTopRef = useRef<number | null>(null); // To store the initial top offset of the section

  // Effect to capture the initial offset and handle scroll/resize events
  useEffect(() => {
    const captureInitialOffset = () => {
      if (sectionWrapperRef.current && !isSticky) {
        initialOffsetTopRef.current = sectionWrapperRef.current.offsetTop;
      }
    };

    captureInitialOffset(); // Capture on mount

    const handleScroll = () => {
      if (initialOffsetTopRef.current === null) { // Fallback if not captured initially
        if (sectionWrapperRef.current && !isSticky) {
            initialOffsetTopRef.current = sectionWrapperRef.current.offsetTop;
        }
        if (initialOffsetTopRef.current === null) return; 
      }
      
      // Point at which the section should become sticky
      const triggerPoint = initialOffsetTopRef.current - siteHeaderHeight;

      if (window.scrollY > triggerPoint) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Check scroll position shortly after mount and on scroll/resize
    const timerId = setTimeout(handleScroll, 100); 
    window.addEventListener('scroll', handleScroll);
    
    const handleResize = () => { 
      captureInitialOffset(); // Recalculate offset on resize
      handleScroll();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup listeners on component unmount
    return () => {
      clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [siteHeaderHeight, isSticky]); // Rerun if isSticky or siteHeaderHeight changes

  // Effect to set the placeholder height
  useEffect(() => {
    if (sectionWrapperRef.current && !isSticky) {
      setPlaceholderHeight(sectionWrapperRef.current.offsetHeight);
    }
    // Fallback if it becomes sticky and placeholder height wasn't set
    else if (isSticky && placeholderHeight === 0 && sectionWrapperRef.current) {
        setPlaceholderHeight(sectionWrapperRef.current.offsetHeight);
    }
  }, [isSticky, placeholderHeight]);

  // Determine the 'top' class for the sticky chatbot bar based on main header's visibility
  const stickyChatbotBarTopClass = scrollDirection === 'down' 
    ? 'top-0' // If main header is hidden (scrolling down), stick to very top
    : `top-[${siteHeaderHeight}px]`; // If main header is visible (scrolling up), stick below it

  return (
    <>
      {/* Placeholder to prevent layout jump when the section becomes sticky */}
      {isSticky && <div style={{ height: `${placeholderHeight}px` }} />}

      {/* The main div that initially holds the non-sticky section.
        When isSticky becomes true, this div's content is replaced by the fixed sticky bar,
        but the ref (sectionWrapperRef) is still on this outer div to manage the placeholder height.
        The actual sticky bar is rendered inside the AnimatePresence.
      */}
      <div ref={sectionWrapperRef} className={isSticky ? "fixed left-0 right-0 z-40" : "relative"}>
        <AnimatePresence initial={false}>
          {isSticky ? (
            <motion.div
              key="sticky-chatbot"
              initial={{ y: -100, opacity: 0 }} // Start off-screen and transparent
              animate={{ y: 0, opacity: 1 }}    // Animate to full visibility
              exit={{ y: -100, opacity: 0 }}     // Animate out
              transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
              className={`will-change-transform 
                         ${stickyChatbotBarTopClass} 
                         bg-background/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl border-b border-border/20`} 
            >
              <div className="container mx-auto px-4">
                <Chatbot isSticky={true} redirectOnSubmitUrl="/chat" />
              </div>
            </motion.div>
          ) : (
            // Enhanced Non-Sticky Section
            <motion.section
              key="non-sticky-chatbot"
              initial={{ opacity: 0, y: 20 }} // Start slightly down and transparent
              animate={{ opacity: 1, y: 0 }}   // Animate to full visibility
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative container mx-auto px-4 my-10 md:my-16 py-10 md:py-16 
                         overflow-hidden rounded-3xl 
                         bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 
                         dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900
                         shadow-2xl text-white" // Enhanced styling
            >
              {/* Subtle background pattern or effect */}
              <div className="absolute inset-0 opacity-10 dark:opacity-[0.07]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="wowPattern" patternUnits="userSpaceOnUse" width="70" height="70" patternTransform="scale(1) rotate(30)">
                      <path d="M0 10h70M10 0v70" stroke="currentColor" strokeWidth="0.4" opacity="0.6"/>
                      <circle cx="35" cy="35" r="1.2" fill="currentColor" opacity="0.8"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#wowPattern)" />
                </svg>
              </div>
              
              {/* Chatbot Content */}
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
