// src/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot";
import { useScrollDirection } from '@/hooks/useScrollDirection';

// Uklonjen 'locale' iz propsa jer Chatbot koristi useTranslation i dobiva locale iz konteksta
interface StickyChatbotSectionProps {
  // locale: string; // Uklonjeno ako nije potrebno direktno ovdje
}

export default function StickyChatbotSection(/* { locale }: StickyChatbotSectionProps */) {
  const [isSticky, setSticky] = useState(false);
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
  }, [headerHeight]); // Dodana ovisnost headerHeight ako se može mijenjati

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
      <div style={{ height: isSticky ? placeholderHeight : 0 }} />
      <div
        ref={chatbotContainerRef}
        className={`
          z-40 pastel-gradient-bg backdrop-blur-md rounded-xl shadow-xl
          will-change-top
          ${isSticky 
            ? `fixed left-0 right-0 border-b border-gray-200/50 
               transition-[top] duration-300 ease-in-out
               ${chatbotTopClassWhenSticky}`
            : 'relative'
          }
        `}
      >
        <div className="container mx-auto px-4 py-4">
           <Chatbot isSticky={isSticky} />
        </div>
      </div>
    </>
  );
}
