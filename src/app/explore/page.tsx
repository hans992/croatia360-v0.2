
"use client"; // Needed for potential future interactivity

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ExplorePage() {
  // Placeholder data - replace with actual data fetching and filtering later
  const popularDestinations = [
    {
      name: "Dubrovnik",
      region: "Dalmacija",
      description: "Opasan zidinama uz more",
      rating: 4.9,
      reviews: 2450,
      image: "/images/Sibenik_tfortress.jpg",
      featured: true,
    },
    {
      name: "Split",
      region: "Dalmacija",
      description: "Rimske ruševine i živahni noćni život",
      rating: 4.8,
      reviews: 1890,
      image: "/images/Trogir_grad.jpg",
      featured: false,
    },
    {
      name: "Opatija",
      region: "Kvarner",
      description: "Elegantna rivijera s Habsburškim vilama",
      rating: 4.7,
      reviews: 980,
      image: "/images/Opatija.jpg",
      featured: false,
    },
  ];

  const recommendations = [
     {
      type: "Smještaj",
      name: "Luksuzni Odmaralište uz More",
      location: "Opatija, Kvarner",
      description: "Elegantno odmaralište s 5 zvjezdica s prekrasnim pogledom na more i privatnim pristupom plaži.",
      rating: 4.9,
      reviews: 320,
      price: "€250 / noć",
      priceCategory: "€€€€",
      tags: ["Spa", "Bazen", "Restoran"],
      image: "/images/Opatija.jpg",
    },
    {
      type: "Restoran",
      name: "Bistro s Tartufima",
      location: "Motovun, Istra",
      description: "Specijaliziran za jela s tartufima sa sezonskim istarskim sastojcima.",
      rating: 4.9,
      reviews: 189,
      price: null,
      priceCategory: "€€€",
      tags: ["Tartufi", "Gourmet", "Lokalno"],
      image: "/images/food_istria.jpg",
    },
     {
      type: "Aktivnost",
      name: "Obilazak Nacionalnog Parka Krka",
      location: "Blizu Šibenika, Dalmacija",
      description: "Istražite zadivljujuće slapove i prirodne ljepote NP Krka.",
      rating: 4.8,
      reviews: 1500,
      price: "€40 / osoba",
      priceCategory: "€€",
      tags: ["Priroda", "Slapovi", "Pješačenje"],
      image: "/images/Krka.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-blue-900">Istraži Hrvatsku</h1> {/* Color updated */}
      <p className="text-gray-600 mb-6">Otkrijte destinacije, pronađite smještaj, restorane, iskustva i još mnogo toga.</p>

      {/* Search and Filters Section */}
      <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input placeholder="Gdje želiš ići? Unesi odredište, aktivnost..." className="flex-grow" />
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sve kategorije" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sve kategorije</SelectItem>
              <SelectItem value="accommodation">Smještaj</SelectItem>
              <SelectItem value="food">Hrana</SelectItem>
              <SelectItem value="activities">Aktivnosti</SelectItem>
              <SelectItem value="events">Događaji</SelectItem>
              <SelectItem value="sights">Znamenitosti</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sve regije" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sve regije</SelectItem>
              <SelectItem value="istra">Istra</SelectItem>
              <SelectItem value="kvarner">Kvarner</SelectItem>
              <SelectItem value="dalmacija">Dalmacija</SelectItem>
              <SelectItem value="slavonija">Slavonija</SelectItem>
              <SelectItem value="sredisnja">Središnja Hrvatska</SelectItem>
              <SelectItem value="zagreb">Zagreb</SelectItem>
            </SelectContent>
          </Select>
           <Select defaultValue="any">
            <SelectTrigger className="w-full md:w-[120px]">
              <SelectValue placeholder="Cijena" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Bilo koja</SelectItem>
              <SelectItem value="€">€</SelectItem>
              <SelectItem value="€€">€€</SelectItem>
              <SelectItem value="€€€">€€€</SelectItem>
              <SelectItem value="€€€€">€€€€</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full md:w-auto bg-red-500 hover:bg-red-600">Traži</Button> {/* Color updated */}
        </div>
         {/* SVG Map Section */}
         <div className="mt-6 p-4 border rounded bg-gray-50 text-center flex items-center justify-center overflow-hidden">
            {/* Embed the actual SVG map */}
            <Image 
              src="/images/croatia_map.svg" 
              alt="Karta Hrvatske po regijama" 
              width={800} // Adjust width as needed
              height={600} // Adjust height as needed
              className="max-w-full h-auto object-contain" 
            />
         </div>
      </div>

      {/* Popular Destinations Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-blue-900">Popularne Destinacije</h2> {/* Color updated */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest) => (
            <Card key={dest.name} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0 relative">
                <Image src={dest.image} alt={dest.name} width={400} height={200} className="w-full h-48 object-cover" />
                {dest.featured && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Istaknuto</div>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-1">{dest.region}</p>
                <CardTitle className="text-lg font-semibold mb-1 text-blue-900">{dest.name}</CardTitle> {/* Color updated */}
                <CardDescription className="text-sm mb-2">{dest.description}</CardDescription>
                <div className="flex items-center text-sm text-yellow-500">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span>{dest.rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({dest.reviews} recenzija)</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                 <Button asChild variant="link" className="p-0 text-red-500 hover:text-red-600"><Link href="#">Otkrij Više</Link></Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Find Stay, Meal, Adventure Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-900">Pronađite svoj boravak, obrok ili avanturu</h2> {/* Color updated */}
          {/* View toggle (Grid/List) - Placeholder */}
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" className="bg-gray-200 border-gray-300"><svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg></Button>
            <Button variant="outline" size="icon" className="border-gray-300"><svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg></Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0 relative">
                <Image src={rec.image} alt={rec.name} width={400} height={200} className="w-full h-48 object-cover" />
                 {rec.priceCategory && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded">
                    {rec.price ? rec.priceCategory : rec.priceCategory}
                  </div>
                )}
                 {rec.price && !rec.priceCategory && (
                   <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded">
                    {rec.price.split(" ")[0]}
                  </div>
                 )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="flex items-center text-sm text-yellow-500 mb-1">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span>{rec.rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({rec.reviews} recenzija)</span>
                </div>
                <CardTitle className="text-lg font-semibold mb-1 text-blue-900">{rec.name}</CardTitle> {/* Color updated */}
                <p className="text-sm text-gray-500 mb-2">{rec.location}</p>
                <CardDescription className="text-sm mb-3">{rec.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {rec.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                {rec.price && <span className="text-lg font-semibold text-gray-800">{rec.price}</span>}
                {!rec.price && rec.priceCategory && <span className="text-lg font-semibold text-gray-800">{rec.priceCategory}</span>}
                <Button asChild variant="link" className="p-0 text-red-500 hover:text-red-600"><Link href="#">Otkrij Sada</Link></Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

