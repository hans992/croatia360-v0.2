
"use client"; // Needed for sticky behavior logic

import Chatbot from "@/components/chatbot/Chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';

export default function HomePage() {
  const [isSticky, setSticky] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const headerHeight = 56; // Height of the header (h-14)

  // Logic to handle sticky state based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (chatbotRef.current) {
        const offsetTop = chatbotRef.current.getBoundingClientRect().top + window.scrollY;
        // Check if scroll position is past the chatbot's initial position minus header height
        if (window.scrollY > offsetTop - headerHeight) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check in case the page loads scrolled down
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section Text */}
      <div className="text-center pt-10 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">Hej, ja sam SARA AI, tvoj osobni planer putovanja</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Reci mi što želiš, a ja ću se pobrinuti za ostalo: letove, hotele, itinerere, u sekundi. Zamisli me kao svog prijatelja upućenog u putovanja... koji te stvarno razumije.</p>
      </div>

      {/* Chatbot Section - Placeholder for sticky element */}
      <div style={{ height: isSticky ? chatbotRef.current?.offsetHeight : 0 }} />

      {/* Chatbot Section - Actual element that becomes sticky */}
      {/* Added pastel-gradient-bg, backdrop-blur-md, rounded-xl, shadow-xl always */}
      <div
        ref={chatbotRef}
        className={`transition-all duration-300 ease-in-out z-40 pastel-gradient-bg backdrop-blur-md rounded-xl shadow-xl ${isSticky ?
          `fixed top-14 left-0 right-0 border-b` : // Keep border-b only when sticky
          'relative'}`}>
        <div className="container mx-auto px-4 py-4">
           {/* Simplified Chatbot Input Area */}
           <Chatbot isSticky={isSticky} />
        </div>
      </div>

      {/* Content Section - Inspiration Cards */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-900">Inspiracija za Vaše Putovanje</h2>
        <p className="text-center text-gray-600 mb-8">Provjerite neke od ovih destinacija i neka inspiracija za odmor dođe sama.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Example Inspiration Cards */}
           <Card>
              <CardHeader>
                <Image src="/images/Istria_sunset.jpg" alt="Istra Zalazak" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Otkrijte čari Istre</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Istražite slikovite gradove poput Rovinja i Poreča, uživajte u vrhunskoj gastronomiji i predivnim plažama.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Image src="/images/Krka.jpg" alt="NP Krka" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Nacionalni Park Krka</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Posjetite zadivljujuće slapove Krke, prošetajte drvenim stazama i okupajte se u kristalno čistoj vodi.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Image src="/images/Sibenik_tfortress.jpg" alt="Šibenik" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Grad kamene ljepote - Šibenik</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Otkrijte prvi hrvatski grad s katedralom na UNESCO-voj listi, prošetajte uskim kamenim ulicama staroga grada, posjetite srednjovjekovne tvrđave s panoramskim pogledom i osjetite autentičnu dalmatinsku atmosferu na obali Jadranskoga mora.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <Image src="/images/Pozega_Grad.jpg" alt="Pozega_Centar" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Slavonski dragulj - Požega</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Otkrijte raskošni barokni trg, uživajte u vrhunskim vinima lokalnih vinograda, istražite bogatu povijest i doživite autentičnu slavonsku gostoljubivost u jednom od najstarijih gradova kontinentalne Hrvatske.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Image src="/images/Zagreb_Trg_kralja_Tomislava.jpg" alt="Zagreb Trg kralja Tomislava" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Zelena metropola - Zagreb</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Istražite živahni glavni grad gdje se spajaju srednjivjekovna baština Gornjeg grada s elegancijom austrougarskih trgova Donjeg grada, prošetajte parkovima, uživajte u kavama na terasama i otkrijte bogat kulturni život europske metropole prepune muzeja i galerija.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Image src="/images/senj.jpg" alt="Senj" width={400} height={200} className="rounded-t-lg object-cover w-full h-48" />
                <CardTitle className="mt-4">Grad bure i uskoka - Senj</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Istražite tisućljetnu povijest u sjeni moćne tvrđave Nehaj, otkrijte gdje se planina Velebit dramatično susreće s Jadranskim morem, doživite snagu bure koja oblikuje karakter grada i osjetite ponosni duh uskočke tradicije.</CardDescription>
                <Button variant="link" className="p-0 mt-2 text-red-500 hover:text-red-600">Saznaj više</Button>
              </CardContent>
            </Card>
            {/* Add more cards as needed */}
        </div>
      </div>
    </div>
  );
}

