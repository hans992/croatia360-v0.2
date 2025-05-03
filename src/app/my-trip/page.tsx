
"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sun, Cloud, CloudRain, MapPin, CalendarDays, Euro } from "lucide-react";

export default function MyTripPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Placeholder weather data
  const weatherForecast = [
    { day: "Danas", temp: "22°C", icon: <Sun className="w-6 h-6 text-yellow-500" /> },
    { day: "Sutra", temp: "20°C", icon: <Cloud className="w-6 h-6 text-gray-500" /> },
    { day: "Petak", temp: "18°C", icon: <CloudRain className="w-6 h-6 text-blue-500" /> },
  ];

  // Placeholder itinerary data based on image 4_My-1.jpg
  const itinerary = {
    title: "Vikend bijeg u Istru",
    duration: "3 Dana / 2 Noći",
    items: [
      { day: "Dan 1", description: "Dolazak u Rovinj, smještaj u hotelu Adriatic, šetnja starim gradom.", cost: "€150 (smještaj)" },
      { day: "Dan 2", description: "Posjet Poreču (Eufrazijeva bazilika), ručak u konobi, degustacija vina u Motovunu.", cost: "€50 (ručak) + €30 (degustacija)" },
      { day: "Dan 3", description: "Posjet Puli (Arena), doručak, povratak.", cost: "€20 (ulaznice)" },
    ],
    totalCost: "€250",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Moje putovanje - Ivana Horvat</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Calendar & Weather */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Kalendar putovanja</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Vremenska prognoza (Primjer: Rovinj)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around items-center">
                {weatherForecast.map((weather) => (
                  <div key={weather.day} className="flex flex-col items-center space-y-1">
                    <span className="text-sm font-medium text-gray-600">{weather.day}</span>
                    {weather.icon}
                    <span className="text-lg font-semibold text-gray-800">{weather.temp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Itinerary */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-900">{itinerary.title}</CardTitle>
              <CardDescription className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center"><CalendarDays className="w-4 h-4 mr-1" /> {itinerary.duration}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Istra, Hrvatska</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Dan</TableHead>
                    <TableHead>Opis Aktivnosti</TableHead>
                    <TableHead className="text-right">Procijenjeni Trošak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itinerary.items.map((item) => (
                    <TableRow key={item.day}>
                      <TableCell className="font-medium">{item.day}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.cost}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-100">
                    <TableCell colSpan={2} className="text-right">Ukupno:</TableCell>
                    <TableCell className="text-right flex items-center justify-end"><Euro className="w-4 h-4 mr-1" /> {itinerary.totalCost.replace('€','')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

