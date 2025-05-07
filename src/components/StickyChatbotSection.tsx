// src/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot";
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface StickyChatbotSectionProps {
  locale: string; // Primamo locale da ga možemo proslijediti Chatbotu ako treba
}

export default function StickyChatbotSection({ locale }: StickyChatbotSectionProps) {
  // ... vaša postojeća logika za sticky ...
  const [isSticky, setSticky] = useState(false);
  const chatbotContainerRef = useRef<HTMLDivElement>(null);
  const headerHeight = 56;
  const scrollDirection = useScrollDirection();
  const [placeholderHeight, setPlaceholderHeight] = useState<number | undefined>(undefined);

  useEffect(() => { /* ... scroll i resize listeneri ... */
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

  useEffect(() => { /* ... placeholder height listener ... */
    const updateHeight = () => {
       if (chatbotContainerRef.current) { setPlaceholderHeight(chatbotContainerRef.current.offsetHeight); }
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
           {/* Chatbot će koristiti useTranslation iz react-i18next zahvaljujući TranslationsProvideru u layoutu */}
           <Chatbot isSticky={isSticky} />
        </div>
      </div>
    </>
  );
}