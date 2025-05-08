// src/components/StickyChatbotSection.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chatbot from "@/components/chatbot/Chatbot";
import { useScrollDirection } from '@/hooks/useScrollDirection';

export default function StickyChatbotSection() {
  const [isSticky, setSticky] = useState(false);
  const chatbotContainerRef = useRef<HTMLDivElement>(null);
  const scrollDirection = useScrollDirection();
  const [placeholderHeight, setPlaceholderHeight] = useState<number | undefined>(undefined);

  const headerHeight = 64; 

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
    if (chatbotContainerRef.current) {
        updateHeight();
    }
     window.addEventListener('resize', updateHeight);
     return () => window.removeEventListener('resize', updateHeight);
  }, []); 

  return (
    <>
      
      <div style={{ height: isSticky ? placeholderHeight : 0 }} />
      <div
        ref={chatbotContainerRef}
        className={`
          z-40 pastel-gradient-bg backdrop-blur-md rounded-xl shadow-xl
          ${isSticky
            ? `fixed left-0 right-0 top-0 border-b border-gray-200/50 /* Uvijek top-0 kad je fixed */
               will-change-transform transition-all duration-300 ease-in-out /* Primijeni tranziciju na transform i opacity */
               ${scrollDirection === 'down'
                 ? 'translate-y-0 opacity-100' 
                 : '-translate-y-full opacity-0 pointer-events-none' 
               }`
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