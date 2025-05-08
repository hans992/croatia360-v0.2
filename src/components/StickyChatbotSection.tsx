// src/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot";
import { useScrollDirection } from '@/hooks/useScrollDirection';

export default function StickyChatbotSection() {
  const [isSticky, setSticky] = useState(false);
  // Specify HTMLDivElement as the generic type for the ref
  const chatbotContainerRef = useRef<HTMLDivElement>(null);
  const headerHeight = 56;
  const scrollDirection = useScrollDirection();
  const [placeholderHeight, setPlaceholderHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      if (chatbotContainerRef.current) {
        // Now TypeScript knows chatbotContainerRef.current is an HTMLDivElement
        const elementTopRelativeToDocument = chatbotContainerRef.current.getBoundingClientRect().top + window.scrollY;
        setSticky(window.scrollY > elementTopRelativeToDocument - headerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [headerHeight]);

  useEffect(() => {
    const updateHeight = () => {
      if (chatbotContainerRef.current) {
        // Now TypeScript knows chatbotContainerRef.current is an HTMLDivElement
        setPlaceholderHeight(chatbotContainerRef.current.offsetHeight);
      }
    };

    if (chatbotContainerRef.current && placeholderHeight === undefined) {
      updateHeight();
    }

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [placeholderHeight]);

  const chatbotTopClassWhenSticky = scrollDirection === 'down' ? 'top-0' : `top-[${headerHeight}px]`;

  return (
    <>
      {/* Placeholder div to prevent content jump when chatbot becomes sticky */}
      {isSticky && placeholderHeight && (
        <div style={{ height: `${placeholderHeight}px` }} />
      )}
      
      {/* Chatbot container with conditional sticky positioning */}
      <div 
        ref={chatbotContainerRef}
        className={`w-full transition-all duration-300 ${
          isSticky 
            ? `fixed ${chatbotTopClassWhenSticky} left-0 z-40` 
            : ''
        }`}
      >
        <Chatbot isSticky={isSticky} />
      </div>
    </>
  );
}
