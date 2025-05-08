// src/app/components/StickyChatbotSection.tsx
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

  const initialOffsetTopRef = useRef<number | null>(null);

  useEffect(() => {
    const setInitialOffset = () => {
      if (chatbotContainerRef.current && !isSticky) { 
        initialOffsetTopRef.current = chatbotContainerRef.current.offsetTop;
      }
    };

    setInitialOffset();

    const handleScroll = () => {
      if (initialOffsetTopRef.current === null) {
        
        if (chatbotContainerRef.current && !isSticky) {
          initialOffsetTopRef.current = chatbotContainerRef.current.offsetTop;
        }
        
        if (initialOffsetTopRef.current === null) return;
      }

      const triggerPoint = initialOffsetTopRef.current - headerHeight;

      if (window.scrollY > triggerPoint) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    const timerId = setTimeout(handleScroll, 50);

    window.addEventListener('scroll', handleScroll);

    
    const handleResize = () => {
      if (chatbotContainerRef.current && !isSticky) { 
        initialOffsetTopRef.current = chatbotContainerRef.current.offsetTop;
        handleScroll(); 
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [headerHeight, isSticky]); 
  
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
            ? `fixed left-0 right-0 top-0 border-b border-gray-200/50
               will-change-transform transition-all duration-300 ease-in-out
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