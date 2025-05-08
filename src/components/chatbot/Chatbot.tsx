// src/components/chatbot/Chatbot.tsx
"use client"; 

import React from 'react';
import Image from "next/image";
// Uklonjeni neiskorišteni Card importi
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className={`w-full max-w-3xl mx-auto ${isSticky ? 'py-2' : 'py-0'}`}>
      <div className={`flex items-center ${isSticky ? 'justify-between' : 'justify-center'}`}>
        {isSticky && <Image src="https://storage.googleapis.com/croatia360/images/kuna.png" alt={t('alt_sara_ai_logo')} width={90} height={40} />}

        <form onSubmit={handleSubmit} className={`relative w-full ${isSticky ? 'max-w-xl' : 'max-w-2xl'}`}>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder={t('chatbot_input_placeholder')}
            className="pr-10 py-6 rounded-full border border-[#3ABEFF] bg-white/20 text-gray-800 placeholder-gray-500
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
        </form>
      </div>

      {!isSticky && (
        <>
          <div className="mt-4 max-h-[300px] overflow-y-auto bg-white/10 p-4 rounded-lg scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-white/5">
            <div className="space-y-4">
              {messages.map((message: Message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-gray-50/80 text-gray-800 rounded-tl-none'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-gray-50/80 text-gray-800 rounded-tl-none italic">
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

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_beaches_text'))} className="border-blue-200/50 bg-white/20 hover:bg-blue-50/30 text-blue-700" disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
            <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_wine_text'))} className="border-red-200/50 bg-white/20 hover:bg-red-50/30 text-red-700" disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
            <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_budget_text'))} className="border-green-200/50 bg-white/20 hover:bg-green-50/30 text-green-700" disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
            <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_nature_text'))} className="border-amber-200/50 bg-white/20 hover:bg-amber-50/30 text-amber-700" disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
