// src/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot";
import { useScrollDirection } from '@/hooks/useScrollDirection';

export default function StickyChatbotSection() {
  const [isSticky, setSticky] = useState(false);
  // Dodajemo tipizaciju za ref
  const chatbotContainerRef = useRef<HTMLDivElement>(null);
  const headerHeight = 56;
  const scrollDirection = useScrollDirection();
  const [placeholderHeight, setPlaceholderHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      if (chatbotContainerRef.current) {
        const elementTopRelativeToDocument = chatbotContainerRef.current.offsetTop;
        if (window.scrollY > elementTopRelativeToDocument - headerHeight) {
          setSticky(true);
        } else {
          setSticky(false);
        }
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
      {/* Placeholder div koji zauzima prostor kada je chatbot sticky */}
      {isSticky && placeholderHeight && (
        <div style={{ height: `${placeholderHeight}px` }} />
      )}
      
      {/* Chatbot container */}
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
