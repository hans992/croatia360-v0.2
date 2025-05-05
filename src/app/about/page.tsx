'use client'

import React, { useState } from 'react'

export default function About() {
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    email: '',
    poruka: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-[#1E4B6D]">O Croatia360</h1>

      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Croatia360 je vaš ultimativni suputnik za istraživanje zadivljujuće ljepote i bogate kulturne baštine Hrvatske.
          Naša misija je pomoći putnicima da otkriju raznolika odredišta Hrvatske i stvore nezaboravna iskustva.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1E4B6D]">Naša priča</h2>
        <p className="mb-4">
          Croatia360 je osnovao tim strastvenih zaljubljenika u putovanja po Hrvatskoj, s ciljem da prikažemo skrivene
          dragulje zemlje uz njene poznate atrakcije. Vjerujemo u održivi turizam koji koristi lokalnim zajednicama i
          pruža autentična iskustva posjetiteljima.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1E4B6D]">Što nudimo</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Sveobuhvatne vodiče kroz najljepša odredišta Hrvatske</li>
          <li>Planiranje putovanja uz pomoć umjetne inteligencije SARA AI, prilagođeno vašim željama i budžetu</li>
          <li>Pažljivo odabrane smještaje, restorane i aktivnosti</li>
          <li>Savjete lokalnih stručnjaka</li>
          <li>Interaktivne alate za planiranje savršene hrvatske avanture</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1E4B6D]">Naše vrijednosti</h2>
        <p className="mb-4">
          U Croatia360 predani smo:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Autentičnosti:</strong> Prikazivanju prave Hrvatske, izvan klasičnih turističkih ruta</li>
          <li><strong>Održivosti:</strong> Promicanju održivog turizma</li>
          <li><strong>Inovacijama:</strong> Korištenju tehnologije za unapređenje putničkih iskustava</li>
          <li><strong>Zajednici:</strong> Podršci lokalnim poduzećima i očuvanju kulturne baštine</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#1E4B6D]">Kontaktirajte nas</h2>
        <p className="mb-4">
          Imate pitanja ili prijedloge? Voljeli bismo čuti vaše mišljenje!
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto border p-6 rounded-lg shadow-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ime *</label>
              <input
                type="text"
                name="ime"
                value={formData.ime}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E4B6D] focus:ring-[#1E4B6D] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prezime</label>
              <input
                type="text"
                name="prezime"
                value={formData.prezime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E4B6D] focus:ring-[#1E4B6D] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E4B6D] focus:ring-[#1E4B6D] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Poruka *</label>
              <textarea
                name="poruka"
                value={formData.poruka}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E4B6D] focus:ring-[#1E4B6D] sm:text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-[#1E4B6D] text-white px-4 py-2 rounded-md hover:bg-[#163a57] transition"
            >
              Pošalji
            </button>
          </form>
        ) : (
          <p className="text-green-600 font-semibold text-center">Hvala na poruci! Javit ćemo vam se uskoro.</p>
        )}
      </div>
    </div>
  )
}
