// src/components/chatbot/Chatbot.tsx
"use client";

import React from 'react';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChat, type Message } from 'ai/react';
import { useTranslation } from 'react-i18next';
import { defaultNS } from '@/lib/i18n/settings';

interface ChatbotProps {
  isSticky?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isSticky = false }) => {
  const { t } = useTranslation(defaultNS);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    error,
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'sara-initial-greeting',
        role: 'assistant',
        content: t('chatbot_initial_greeting')
      }
    ],
  });

  // Zajednička komponenta za formu, da izbjegnemo ponavljanje
  const renderForm = (isCompactForm: boolean) => (
    <form onSubmit={handleSubmit} className={`relative w-full ${isCompactForm ? 'max-w-xl' : 'max-w-2xl'}`}>
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder={t('chatbot_input_placeholder')}
        className="pr-10 py-6 rounded-full border border-[#3ABEFF] bg-white/20 text-black placeholder-gray-700
                   focus:outline-none focus:ring-2 focus:ring-[#3ABEFF] focus:border-[#3ABEFF]
                   focus:shadow-[0_0_15px_#3ABEFF] transition-all duration-300 disabled:opacity-50"
        disabled={isLoading}
        aria-label={t('chatbot_input_aria_label')}
      />
      <Button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
        size="icon"
        disabled={isLoading || !input.trim()}
        aria-label={t('chatbot_send_button_aria_label')}
      >
        <Send className="h-4 w-4" />
      </Button>
      {/* Glow efekt koji se prikazuje ispod forme dok je isLoading true */}
      {isLoading && (
        <div
          className="absolute -bottom-1.5 left-0 right-0 mx-auto w-4/5 h-2.5
                     bg-primary opacity-60 dark:opacity-80
                     rounded-full blur-md
                     animate-pulse
                     pointer-events-none"
        />
      )}
    </form>
  );

  // Prikaz za LJEPLJIVI (STICKY) chatbot - samo input traka s logom
  if (isSticky) {
    return (
      <div className="w-full max-w-3xl mx-auto py-2"> {/* Padding za sticky verziju */}
        <div className="flex items-center justify-between">
          <Image src="https://storage.googleapis.com/croatia360/images/kuna.png" alt={t('alt_sara_ai_logo')} width={90} height={40} />
          {renderForm(true)} {/* Kompaktna forma */}
        </div>
      </div>
    );
  }

  // Prikaz za NORMALNI (NE-LJEPLJIVI) chatbot - puni chat interfejs
  return (
    <div className="w-full max-w-3xl mx-auto py-0 flex flex-col" style={{ minHeight: '400px' /* Primjer minimalne visine, prilagodite */ }}>
      {/* 1. Područje za prikaz poruka */}
      <div className="flex-grow max-h-[300px] md:max-h-[450px] overflow-y-auto bg-white/10 p-4 rounded-lg scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-white/5">
        {/* Prilagodite max-h-[...] po potrebi za vaš layout */}
        <div className="space-y-4">
          {messages.map((message: Message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-gray-50/80 text-black rounded-tl-none'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          {/* Prikaz "Thinking..." unutar područja s porukama */}
          {isLoading && messages.length > 0 && ( // Pokaži samo ako već postoje poruke, da ne bude prazno
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-gray-50/80 text-black rounded-tl-none italic">
                {t('chatbot_thinking')}
              </div>
            </div>
          )}
          {error && (
             <div className="flex justify-start">
               <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-red-100 text-red-700 rounded-tl-none">
                  {t('chatbot_error_prefix')} {error.message || t('chatbot_error_default_message')}
               </div>
             </div>
          )}
        </div>
      </div>

      {/* 2. Gumbi s prijedlozima */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_beaches_text'))} className="border-blue-200/50 bg-white/20 hover:bg-blue-50/30 text-blue-700" disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_wine_text'))} className="border-red-200/50 bg-white/20 hover:bg-red-50/30 text-red-700" disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_budget_text'))} className="border-green-200/50 bg-white/20 hover:bg-green-50/30 text-green-700" disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
        <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_nature_text'))} className="border-amber-200/50 bg-white/20 hover:bg-amber-50/30 text-amber-700" disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
      </div>

      {/* 3. Područje za unos teksta (forma) */}
      <div className="mt-3 flex items-center justify-center"> {/* Malo smanjen mt s mt-4 na mt-3 */}
        {renderForm(false)} {/* Puna (ne-kompaktna) forma */}
      </div>
    </div>
  );
};

export default Chatbot;