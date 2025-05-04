"use client"; 

import Chatbot from "@/components/chatbot/Chatbot"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection'; 

export default function HomePage() {
  const [isSticky, setSticky] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const headerHeight = 56; // 14 * 4 = 56px
  
  const scrollDirection = useScrollDirection(); 

  // Effect to determine if the chatbot container should BE sticky (fixed or relative)
  useEffect(() => {
    const handleScroll = () => {
      if (chatbotRef.current) {
        const elementTopRelativeToDocument = chatbotRef.current.offsetTop;
        // This determines if the component should switch to position: fixed
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

  // Placeholder height logic (remains the same)
  const [placeholderHeight, setPlaceholderHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (chatbotRef.current && placeholderHeight === undefined) {
       setPlaceholderHeight(chatbotRef.current.offsetHeight);
    }
     const updateHeight = () => {
       if (chatbotRef.current) { setPlaceholderHeight(chatbotRef.current.offsetHeight); }
     };
     window.addEventListener('resize', updateHeight);
     return () => window.removeEventListener('resize', updateHeight);
  }, [placeholderHeight]); 

  // Determine the correct top class ONLY when it IS sticky
  // If scrolling down (header hidden) -> top-0
  // If scrolling up (header visible) -> top-14 (or top-[56px])
  const chatbotTopClassWhenSticky = scrollDirection === 'down' ? 'top-0' : `top-[${headerHeight}px]`; // Or 'top-14'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center pt-10 pb-10">
         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">Hej, ja sam SARA AI, tvoj osobni planer putovanja</h1>
         <p className="text-lg text-gray-600 max-w-2xl mx-auto">Reci mi što želiš, a ja ću se pobrinuti za ostalo: letove, hotele, itinerere, u sekundi. Zamisli me kao svog prijatelja upućenog u putovanja... koji te stvarno razumije.</p>
       </div>

      {/* Chatbot Placeholder */}
      <div style={{ height: isSticky ? placeholderHeight : 0 }} />

      {/* Chatbot Section - Actual element */}
      <div
        ref={chatbotRef}
        className={`
          z-40 pastel-gradient-bg backdrop-blur-md rounded-xl shadow-xl
          will-change-top /* Hint browser about 'top' changes */
          ${isSticky 
            ? `fixed left-0 right-0 border-b border-gray-200/50 
               transition-[top] duration-300 ease-in-out /* Transition ONLY the 'top' property */
               ${chatbotTopClassWhenSticky}` // Apply calculated top class
            : 'relative' // When not sticky, just relative, no specific 'top', no transition
          }
        `}
      >
        <div className="container mx-auto px-4 py-4">
           <Chatbot isSticky={isSticky} />
        </div>
      </div>

      {/* Content Section */}
       <div className="mt-12">
         <h2 className="text-2xl font-semibold mb-6 text-center text-blue-900">Inspiracija za Vaše Putovanje</h2>
         <p className="text-center text-gray-600 mb-8">Provjerite neke od ovih destinacija i neka inspiracija za odmor dođe sama.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cards... */}
            <Card> {/* Istra */} <CardHeader><Image src="/images/Istria_sunset.jpg" alt="Istra Zalazak" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" /><CardTitle className="mt-4">Otkrijte čari Istre</CardTitle></CardHeader><CardContent><CardDescription>Istražite slikovite gradove, uživajte u gastronomiji i plažama.</CardDescription><Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button></CardContent></Card>
            <Card> {/* Krka */} <CardHeader><Image src="/images/Krka.jpg" alt="NP Krka" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" /><CardTitle className="mt-4">Nacionalni Park Krka</CardTitle></CardHeader><CardContent><CardDescription>Posjetite zadivljujuće slapove i okupajte se u čistoj vodi.</CardDescription><Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button></CardContent></Card>
            <Card> {/* Sibenik */} <CardHeader><Image src="/images/Sibenik_tfortress.jpg" alt="Šibenik" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" /><CardTitle className="mt-4">Grad kamene ljepote - Šibenik</CardTitle></CardHeader><CardContent><CardDescription>Otkrijte UNESCO katedralu, tvrđave i dalmatinsku atmosferu.</CardDescription><Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button></CardContent></Card>
            <Card> {/* Pozega */} <CardHeader><Image src="/images/Pozega_Grad.jpg" alt="Pozega_Centar" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" /><CardTitle className="mt-4">Slavonski dragulj - Požega</CardTitle></CardHeader><CardContent><CardDescription>Otkrijte barokni trg, vrhunska vina i slavonsku gostoljubivost.</CardDescription><Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button></CardContent></Card>
            <Card> {/* Zagreb */} <CardHeader><Image src="/images/Zagreb_Trg_kralja_Tomislava.jpg" alt="Zagreb Trg kralja Tomislava" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" /><CardTitle className="mt-4">Zelena metropola - Zagreb</CardTitle></CardHeader><CardContent><CardDescription>Istražite živahni glavni grad s bogatom poviješću i kulturom.</CardDescription><Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button></CardContent></Card>
            <Card> {/* Senj */} <CardHeader><Image src="/images/senj.jpg" alt="Senj" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" /><CardTitle className="mt-4">Grad bure i uskoka - Senj</CardTitle></CardHeader><CardContent><CardDescription>Istražite povijest u sjeni tvrđave Nehaj i osjetite snagu bure.</CardDescription><Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button></CardContent></Card>
         </div>
       </div>
    </div>
  );
}
