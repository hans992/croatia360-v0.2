// src/app/[locale]/partner/san-luca-magno/page.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sailboat,
  Users,
  Clock,
  CheckCircle,
  Calendar as CalendarIconLucide,
  Mail,
  Info,
  Briefcase,
  Anchor,
  Sparkles,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Toaster } from 'sonner';
import { toast as sonnerToast } from 'sonner';
import { type SelectSingleEventHandler, type ActiveModifiers } from 'react-day-picker';

// Mock data (ostaje isto)
const tripData = {
  title: "San Luca Magno: Cjelodnevni Privatni Izlet Jedrenjakom - Kornati i Telašćica iz Zadra",
  heroImage: "https://storage.googleapis.com/croatia360/images/partners/san_luca_magno/hero_san_luca_magno.jpg",
  gallery: [
    { id: 1, url: "https://storage.googleapis.com/croatia360/images/partners/san_luca_magno/gallery_1.jpg", alt: "Jedrenjak San Luca Magno na moru" },
    { id: 2, url: "https://storage.googleapis.com/croatia360/images/partners/san_luca_magno/gallery_2.jpg", alt: "Uvala u NP Kornati" },
    { id: 3, url: "https://storage.googleapis.com/croatia360/images/partners/san_luca_magno/gallery_3.jpg", alt: "Slano jezero Mir u PP Telašćica" },
    { id: 4, url: "https://storage.googleapis.com/croatia360/images/partners/san_luca_magno/gallery_4.jpg", alt: "Ručak na brodu" },
    { id: 5, url: "https://storage.googleapis.com/croatia360/images/partners/san_luca_magno/gallery_5.jpg", alt: "Ronjenje u kristalno čistom moru" },
  ],
  shortDescription: "Otkrijte čaroliju Nacionalnog parka Kornati i Parka prirode Telašćica na nezaboravnom cjelodnevnom privatnom izletu autentičnim motornim jedrenjakom San Luca Magno. Uživajte u kristalno čistom moru, skrivenim uvalama, domaćoj hrani i personaliziranoj usluzi. Idealno za grupe do 12 osoba.",
  detailedDescription: [
    "Zaplovite iz Zadra na povijesnom jedrenjaku San Luca Magno (izgrađen 1968., obnovljen 2020.) i doživite jedinstvenu avanturu istražujući zadarski arhipelag.",
    "Naš cjelodnevni privatni izlet vodi vas kroz spektakularne krajolike Nacionalnog parka Kornati, poznatog po svojim brojnim otocima, otočićima i hridima, te Parka prirode Telašćica s impresivnim klifovima i slanim jezerom Mir.",
    "Tijekom 9-satnog izleta, imat ćete priliku zaustaviti se u nekoliko predivnih uvala za plivanje, ronjenje (oprema uključena) i korištenje našeg paddleboarda (SUP). Naš iskusni kapetan prilagodit će rutu kako bi vam pružio najbolje iskustvo, ovisno o vremenskim uvjetima i vašim željama.",
    "U cijenu izleta uključen je ukusan doručak i ručak pripremljen na brodu, kao i domaće vino, voda, kava i limunada. Opustite se na prostranoj palubi, uživajte u suncu i prepustite se čarima Jadrana uz našu ljubaznu posadu.",
    "San Luca Magno je savršen izbor za obitelji, prijatelje ili bilo koga tko želi privatnost i autentično dalmatinsko iskustvo."
  ],
  included: [
    "Privatni najam broda San Luca Magno s posadom (kapetan)",
    "Cjelodnevni izlet (cca 9 sati) u NP Kornati i PP Telašćica",
    "Doručak na brodu",
    "Ručak na brodu (npr. svježa riba ili mesna opcija, salata, kruh)",
    "Pića (domaće bijelo i crno vino, voda, kava, limunada)",
    "Oprema za ronjenje (maske, disalice)",
    "Paddleboard (SUP)",
    "Gorivo",
    "Ulaznice za Nacionalni park Kornati i Park prirode Telašćica (Napomena: Trenutno uključeno u promotivnu cijenu. Molimo provjerite prilikom upita.)",
  ],
  importantInfo: [
    { icon: Anchor, text: "Polazak: Marina Tankerkomerc Zadar (ili druga dogovorena lokacija)." },
    { icon: Clock, text: "Vrijeme polaska: Prema dogovoru (obično oko 9:00 h)." },
    { icon: Users, text: "Maksimalan broj osoba: 12." },
    { icon: Briefcase, text: "Molimo ponesite kupaći kostim, ručnik, kremu za sunčanje i kapu." },
    { icon: ShieldCheck, text: "Ovaj izlet je dostupan na upit. Molimo kontaktirajte nas za provjeru dostupnosti i rezervaciju." },
  ],
  ctaInquiry: "Pošaljite upit za vaš privatni izlet brodom San Luca Magno i doživite Kornate i Telašćicu na najbolji mogući način!",
  ctaBooking: "Ili Bookirajte direktno vaš privatni izlet odmah!",
  contactEmail: "info@sanluca-magno.hr",
  contactPhone: "+385 98 123 4567"
};

const GalleryImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg group">
    <Image src={src} alt={alt} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" />
  </div>
);

export default function SanLucaMagnoPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [numGuests, setNumGuests] = useState<number>(1);

  const handleMockBooking = () => {
    sonnerToast.info("Informacija o rezervaciji", {
      description: "Direktne rezervacije su trenutno u pripremi i služe u prezentacijske svrhe. Molimo Vas da koristite kontakt formu za slanje upita ili nas direktno kontaktirate. Hvala na razumijevanju!",
      duration: 8000,
    });
  };

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inquiryData = {
      name,
      email,
      phone,
      selectedDate: selectedDate ? selectedDate.toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Nije odabran datum',
      numGuests,
      message,
      trip: tripData.title
    };

    try {
      const response = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      const result = await response.json();

      if (response.ok) {
        sonnerToast.success("Upit poslan!", {
          description: "Hvala Vam na upitu. Javit ćemo Vam se u najkraćem mogućem roku.",
        });
        setName(''); setEmail(''); setPhone(''); setMessage(''); setSelectedDate(new Date()); setNumGuests(1);
      } else {
        sonnerToast.error("Greška pri slanju", {
          description: result.error || "Došlo je do pogreške. Molimo pokušajte ponovno.",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      sonnerToast.error("Greška pri slanju", {
        description: "Došlo je do mrežne pogreške. Molimo provjerite svoju vezu i pokušajte ponovno.",
      });
    }
  };
  
  const handleDateSelect: SelectSingleEventHandler = (
    day: Date | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _selectedDay: Date,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _activeModifiers: ActiveModifiers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _e?: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | undefined
  ) => {
    setSelectedDate(day);
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 animate-fadeIn">
        {/* Hero Section (ostaje isti) */}
        <section className="relative h-[70vh] md:h-[80vh] text-white">
          <Image
            src={tripData.heroImage}
            alt={`Hero slika za ${tripData.title}`}
            layout="fill"
            objectFit="cover"
            priority
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-6">
            <Sailboat className="w-16 h-16 mb-4 text-sky-300" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
              {tripData.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
              {tripData.shortDescription}
            </p>
            <Button 
              size="lg" 
              className="mt-8 bg-sky-500 hover:bg-sky-600 text-white text-lg px-8 py-3 shadow-xl transform hover:scale-105 transition-transform duration-300"
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Rezerviraj ili Pošalji Upit
            </Button>
          </div>
        </section>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
          {/* Gallery Section (ostaje ista) */}
          <section id="gallery">
            <h2 className="text-3xl font-bold text-center mb-10 text-sky-700 dark:text-sky-400">Doživite Avanturu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {tripData.gallery.map(img => <GalleryImage key={img.id} src={img.url} alt={img.alt} />)}
            </div>
          </section>

          {/* Detailed Description Section (ostaje ista) */}
          <section id="description">
            <Card className="bg-white dark:bg-slate-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-sky-700 dark:text-sky-400 flex items-center">
                  <Info className="w-6 h-6 mr-2" /> Detaljan Opis Izleta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {tripData.detailedDescription.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Included & Important Info Sections (ostaju iste) */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <section id="included">
              <Card className="bg-white dark:bg-slate-800 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-sky-700 dark:text-sky-400 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2 text-green-500" /> Što je Uključeno?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tripData.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Sparkles className="w-5 h-5 mr-3 mt-1 text-yellow-500 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
            <section id="important-info">
              <Card className="bg-white dark:bg-slate-800 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-sky-700 dark:text-sky-400 flex items-center">
                    <Info className="w-6 h-6 mr-2 text-amber-500" /> Važne Informacije
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tripData.importantInfo.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <item.icon className="w-5 h-5 mr-3 mt-1 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Booking and Calendar Section - AŽURIRANO ZA RESPONZIVNOST */}
          <section id="booking-section">
            <Card className="bg-white dark:bg-slate-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center text-sky-700 dark:text-sky-400">
                  Rezervirajte Svoj Termin ili Pošaljite Upit
                </CardTitle>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400 mt-1">
                  Provjerite dostupnost u kalendaru. Za direktnu rezervaciju (trenutno u demo modu) ili upit, ispunite formu ispod.
                </CardDescription>
              </CardHeader>
              {/* Korištenje flex-col za mobilne uređaje i md:flex-row za veće */}
              <CardContent className="flex flex-col md:flex-row gap-8 md:gap-10 items-start pt-6">
                {/* Lijeva kolona - Kalendar i Mock Booking */}
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start"> {/* Centriranje na mobitelu */}
                  <h3 className="text-lg font-medium mb-3 text-sky-700 dark:text-sky-400 self-start">Odaberite Datum Izleta:</h3>
                  <div className="w-full max-w-xs mx-auto md:mx-0"> {/* Ograničavanje širine DatePicker-a na mobitelu */}
                    <DatePicker
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      // disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) }
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center md:text-left">
                    Kalendar prikazuje opću dostupnost. Za potvrdu termina i iCal sinkronizaciju, molimo pošaljite upit.
                  </p>
                  <div className="mt-6 w-full max-w-xs mx-auto md:mx-0">
                     <label htmlFor="numGuests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Broj osoba (max 12):</label>
                     <Input 
                        type="number" 
                        id="numGuests" 
                        name="numGuests" 
                        min="1" 
                        max="12" 
                        value={numGuests}
                        onChange={(e) => setNumGuests(parseInt(e.target.value))}
                        className="w-full dark:bg-slate-700 dark:border-slate-600" // Puna širina unutar max-w-xs
                      />
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full max-w-xs mx-auto md:mx-0 mt-6 bg-amber-500 hover:bg-amber-600 text-white py-3"
                    onClick={handleMockBooking}
                  >
                    <CalendarIconLucide className="w-5 h-5 mr-2" /> {tripData.ctaBooking} (Demo)
                  </Button>
                   <p className="text-center md:text-left text-sm mt-3 text-amber-700 dark:text-amber-400 font-semibold">
                    Napomena: Direktna rezervacija je u pripremi. Molimo koristite kontakt formu.
                  </p>
                </div>

                {/* Desna kolona - Kontakt Forma */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-lg font-medium mb-3 text-sky-700 dark:text-sky-400">Kontaktirajte Nas za Upit:</h3>
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ime i Prezime</label>
                      <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Adresa</label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                     <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Broj Telefona (Opcionalno)</label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vaša Poruka</label>
                      <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required className="mt-1 dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3">
                      <Mail className="w-5 h-5 mr-2" /> Pošalji Upit
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </section>

           {/* Direct Contact Info (ostaje isto) */}
          <section id="direct-contact" className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4 text-sky-700 dark:text-sky-400">Ili nas kontaktirajte direktno:</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                <a href={`mailto:${tripData.contactEmail}`} className="inline-flex items-center text-lg text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors">
                    <Mail className="w-5 h-5 mr-2"/> {tripData.contactEmail}
                </a>
                {tripData.contactPhone && (
                    <a href={`tel:${tripData.contactPhone.replace(/\s/g, '')}`} className="inline-flex items-center text-lg text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 transition-colors">
                        <Phone className="w-5 h-5 mr-2"/> {tripData.contactPhone}
                    </a>
                )}
            </div>
          </section>

        </main>
        {/* Footer (ostaje isti) */}
        <footer className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} San Luca Magno & Croatia360. Sva prava pridržana.</p>
        </footer>
      </div>
    </>
  );
}
