"use client"; // Needed for sticky behavior logic

import Chatbot from "@/components/chatbot/Chatbot"; // Ensure this path is correct
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';

export default function HomePage() {
  const [isSticky, setSticky] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const headerHeight = 56; // Assuming your header is h-14 (56px)

  // Logic to handle sticky state based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (chatbotRef.current) {
        // Calculate the offsetTop relative to the document
        const elementTopRelativeToDocument = chatbotRef.current.offsetTop;
        // Check if scroll position (window.scrollY) has passed the point where
        // the top of the element should align with the bottom of the sticky header.
        if (window.scrollY > elementTopRelativeToDocument - headerHeight) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      }
    };

    // Recalculate on resize as well, in case layout changes affect offsetTop
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Add resize listener

    // Initial check in case the page loads scrolled down or element position changes dynamically
    // Use setTimeout to ensure initial layout is stable
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll); // Remove resize listener
      clearTimeout(timeoutId);
    };
    // Re-run effect if headerHeight changes (though it's constant here)
  }, [headerHeight]);

  // Store the height for the placeholder to avoid layout shifts
  const [placeholderHeight, setPlaceholderHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (chatbotRef.current && placeholderHeight === undefined) {
       setPlaceholderHeight(chatbotRef.current.offsetHeight);
    }
     // Optional: Update height on resize if content can change dynamically
     const updateHeight = () => {
       if (chatbotRef.current) {
         setPlaceholderHeight(chatbotRef.current.offsetHeight);
       }
     };
     window.addEventListener('resize', updateHeight);
     return () => window.removeEventListener('resize', updateHeight);
  }, [placeholderHeight]); // Run once initially and maybe on resize


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section Text */}
      <div className="text-center pt-10 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">Hej, ja sam SARA AI, tvoj osobni planer putovanja</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Reci mi što želiš, a ja ću se pobrinuti za ostalo: letove, hotele, itinerere, u sekundi. Zamisli me kao svog prijatelja upućenog u putovanja... koji te stvarno razumije.</p>
      </div>

      {/* Chatbot Section - Placeholder for sticky element */}
      {/* Use calculated height for placeholder */}
      <div style={{ height: isSticky ? placeholderHeight : 0 }} />

      {/* Chatbot Section - Actual element that becomes sticky */}
      {/* --- MODIFICATION START --- */}
      <div
        ref={chatbotRef}
        className={`
          z-40 pastel-gradient-bg backdrop-blur-md rounded-xl shadow-xl
          transition-all duration-300 ease-in-out /* Kept transition-all for simplicity */
          will-change-transform /* ADDED: Hint for browser optimization */
          ${isSticky ?
            `fixed top-14 left-0 right-0 border-b border-gray-200/50` : // Use specific top, add subtle border
            'relative' /* Ensure it's relative when not sticky */
          }
        `}
      >
      {/* --- MODIFICATION END --- */}
        <div className="container mx-auto px-4 py-4">
           {/* Pass the sticky state to the Chatbot component */}
           <Chatbot isSticky={isSticky} />
        </div>
      </div>

      {/* Content Section - Inspiration Cards */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-900">Inspiracija za Vaše Putovanje</h2>
        <p className="text-center text-gray-600 mb-8">Provjerite neke od ovih destinacija i neka inspiracija za odmor dođe sama.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Example Inspiration Cards (Content shortened for brevity) */}
           <Card>
              <CardHeader>
                <Image src="/images/Istria_sunset.jpg" alt="Istra Zalazak" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Otkrijte čari Istre</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Istražite slikovite gradove, uživajte u gastronomiji i plažama.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Image src="/images/Krka.jpg" alt="NP Krka" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Nacionalni Park Krka</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Posjetite zadivljujuće slapove i okupajte se u čistoj vodi.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Image src="/images/Sibenik_tfortress.jpg" alt="Šibenik" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Grad kamene ljepote - Šibenik</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Otkrijte UNESCO katedralu, tvrđave i dalmatinsku atmosferu.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <Image src="/images/Pozega_Grad.jpg" alt="Pozega_Centar" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Slavonski dragulj - Požega</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Otkrijte barokni trg, vrhunska vina i slavonsku gostoljubivost.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Image src="/images/Zagreb_Trg_kralja_Tomislava.jpg" alt="Zagreb Trg kralja Tomislava" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Zelena metropola - Zagreb</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Istražite živahni glavni grad s bogatom poviješću i kulturom.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Image src="/images/senj.jpg" alt="Senj" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Grad bure i uskoka - Senj</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Istražite povijest u sjeni tvrđave Nehaj i osjetite snagu bure.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>
            {/* Add more cards as needed */}
        </div>
      </div>
    </div>
  );
}
