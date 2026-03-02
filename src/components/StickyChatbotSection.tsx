// src/app/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot"; 
import { useScrollDirection } from '@/hooks/useScrollDirection'; 

export default function StickyChatbotSection() {
  const [isSticky, setIsSticky] = useState(false);
  // Ref for the entire section that contains the chatbot in its non-sticky state
  const sectionWrapperRef = useRef<HTMLDivElement>(null);
  const [placeholderHeight, setPlaceholderHeight] = useState<number>(0);
  
  const scrollDirection = useScrollDirection(); // Used to position sticky bar relative to main header
  const siteHeaderHeight = 64; // Assumed height of your main site header in pixels

  // Ref to store the original offsetTop of the section for scroll calculations
  const initialOffsetTopRef = useRef<number | null>(null);

  useEffect(() => {
    // Function to capture the initial offsetTop when the component mounts or is not sticky
    const captureInitialOffset = () => {
      if (sectionWrapperRef.current && !isSticky) { // Only measure when not sticky
        initialOffsetTopRef.current = sectionWrapperRef.current.offsetTop;
      }
    };

    captureInitialOffset(); // Initial capture

    const handleScroll = () => {
      if (initialOffsetTopRef.current === null) {
        // Fallback: if offset wasn't captured, try again (e.g., if ref wasn't ready initially)
        if (sectionWrapperRef.current && !isSticky) {
            initialOffsetTopRef.current = sectionWrapperRef.current.offsetTop;
        }
        if (initialOffsetTopRef.current === null) return; // Can't proceed without offset
      }
      
      // Determine the point at which the section should become sticky
      // It becomes sticky when its original top position is scrolled siteHeaderHeight pixels past the viewport top
      const triggerPoint = initialOffsetTopRef.current - siteHeaderHeight;

      if (window.scrollY > triggerPoint) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    const timerId = setTimeout(handleScroll, 100); // Check state after initial render and layout
    window.addEventListener('scroll', handleScroll);
    
    const handleResize = () => { // Recalculate on resize
      captureInitialOffset();
      handleScroll();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [siteHeaderHeight, isSticky]); // Rerun if isSticky changes to re-capture offset correctly

  // Effect to set the placeholder height based on the non-sticky section's height
  useEffect(() => {
    if (sectionWrapperRef.current && !isSticky) {
      setPlaceholderHeight(sectionWrapperRef.current.offsetHeight);
    }
    // If it becomes sticky and placeholderHeight is 0 (or undefined),
    // it means we might have missed the initial measurement or it loaded sticky.
    // This is a fallback, ideally placeholderHeight is set before becoming sticky.
    else if (isSticky && placeholderHeight === 0 && sectionWrapperRef.current) {
        setPlaceholderHeight(sectionWrapperRef.current.offsetHeight);
    }
  }, [isSticky, placeholderHeight]); // Rerun if isSticky changes

  // Determine the 'top' class for the sticky chatbot bar based on main header's visibility
  const stickyChatbotBarTopClass = scrollDirection === 'down' 
    ? 'top-0' 
    : 'top-16'; // top-16 = 64px, matches siteHeaderHeight

  return (
    <>
      {/* Placeholder to prevent layout jump when the section becomes sticky */}
      {isSticky && <div style={{ height: `${placeholderHeight}px` }} />}

      <div
        ref={sectionWrapperRef}
        className={
          isSticky
            ? `fixed left-0 right-0 will-change-transform transition-all duration-normal ease-out
               ${stickyChatbotBarTopClass} z-40 glass-panel shadow-card`
            : `relative container mx-auto px-4 my-8 md:my-12 py-8 md:py-10 
               premium-chat-bg glass-panel rounded-2xl ai-glow shadow-card`
        }
      >
        {/* When sticky, Chatbot renders compact version.
          When not sticky, Chatbot renders full version within the styled section.
          The inner .container div is for the sticky state to constrain width.
        */}
        {isSticky ? (
          <div className="container mx-auto px-4"> {/* Constrains width of sticky bar content */}
            <Chatbot isSticky={true} redirectOnSubmitUrl="/chat" />
          </div>
        ) : (
          <Chatbot isSticky={false} redirectOnSubmitUrl="/chat" />
        )}
      </div>
    </>
  );
}