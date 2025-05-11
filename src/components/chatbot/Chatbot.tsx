// src/components/chatbot/Chatbot.tsx
"use client";

import React, { useEffect, useRef } // Added useRef
  from 'react';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { useChat, type Message } from 'ai/react';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';
import { useRouter, useParams } from 'next/navigation';

// Props for the Chatbot component
interface ChatbotProps {
  isSticky?: boolean;
  redirectOnSubmitUrl?: string;
  initialQuery?: string | null; // New prop for initial query on chat page
}

const Chatbot: React.FC<ChatbotProps> = ({
  isSticky = false,
  redirectOnSubmitUrl,
  initialQuery, // New prop
}) => {
  const { t } = useTranslation(defaultNS);
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as Locale;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalUseChatSubmit,
    isLoading,
    setInput,
    error,
    append, // Destructure append function from useChat
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

  // Ref to track if the initial query has been processed
  const initialQueryProcessedRef = useRef(false);

  // Effect to handle initialQuery on the dedicated chat page
  useEffect(() => {
    if (initialQuery && !initialQueryProcessedRef.current && append) {
      // Only process if initialQuery is present, not yet processed, and append is available
      append({ role: 'user', content: initialQuery });
      initialQueryProcessedRef.current = true; // Mark as processed
      // No need to call setInput, append handles adding the message
    }
  }, [initialQuery, append]); // Depend on initialQuery and append

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFirstUserMessage = messages.filter(m => m.role === 'user').length === 0 && !initialQueryProcessedRef.current;

    if (redirectOnSubmitUrl && isFirstUserMessage && input.trim()) {
      const userQuery = input;
      setInput('');
      router.push(`/${currentLocale}${redirectOnSubmitUrl}?initialQuery=${encodeURIComponent(userQuery)}`);
    } else {
      originalUseChatSubmit(e);
    }
  };

  const renderForm = (isCompactForm: boolean) => (
    <form onSubmit={handleFormSubmit} className={`relative w-full ${isCompactForm ? 'max-w-xl' : 'max-w-2xl'}`}>
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

  if (isSticky) {
    return (
      <div className="w-full max-w-3xl mx-auto py-2">
        <div className="flex items-center justify-between">
          <Image src="https://storage.googleapis.com/croatia360/images/kuna.png" alt={t('alt_sara_ai_logo')} width={90} height={40} />
          {renderForm(true)}
        </div>
      </div>
    );
  }

  return (
    // Ensure this container can take full height for proper flex-grow behavior of messages area
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full"> {/* Added h-full */}
      <div className="flex-grow max-h-full overflow-y-auto bg-white/10 p-4 rounded-lg scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-white/5">
      {/* Changed max-h to max-h-full; parent needs defined height for this to work well */}
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
          {isLoading && messages.filter(m => m.id !== 'sara-initial-greeting').length > 0 && ( // Show thinking only if there are actual user messages or pending responses
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
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-6">
        {[
          { 
            labelKey: 'chatbot_button_beaches_label', 
            queryKey: 'chatbot_button_beaches_text', 
            baseColor: 'blue', // Osnovna boja za generiranje Tailwind klasa
            icon: Sparkles // Primjer ikone, prilagodite po potrebi
          },
          { 
            labelKey: 'chatbot_button_wine_label', 
            queryKey: 'chatbot_button_wine_text', 
            baseColor: 'red',
            icon: Sparkles
          },
          { 
            labelKey: 'chatbot_button_budget_label', 
            queryKey: 'chatbot_button_budget_text', 
            baseColor: 'green',
            icon: Sparkles
          },
          { 
            labelKey: 'chatbot_button_nature_label', 
            queryKey: 'chatbot_button_nature_text', 
            baseColor: 'yellow',
            icon: Sparkles
          },
        ].map(btn => {
          // Dinamičko generiranje klasa za bolju čitljivost i održavanje
          const lightBg = `bg-${btn.baseColor}-500`;
          const lightHoverBg = `hover:bg-${btn.baseColor}-600`;
          const darkBg = `dark:bg-${btn.baseColor}-600`; // Malo tamnija ili ista za tamnu temu
          const darkHoverBg = `dark:hover:bg-${btn.baseColor}-500`; // Svjetlija na hover u tamnoj temi

          return (
            <Button 
              key={btn.labelKey}
              variant="default" 
              size="sm" 
              onClick={() => {
                setInput(t(btn.queryKey));
                // Pronalazi formu i submit-a je. Osigurajte da postoji samo jedna forma ili prilagodite selektor.
                const form = document.querySelector<HTMLFormElement>('form[class*="max-w-3xl"]');
                if (form) {
                  // Kreiranje i slanje submit eventa
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                }
              }}
              className={`text-white rounded-full px-5 py-2.5 text-sm font-medium shadow-md hover:shadow-lg 
                         transition-all transform hover:scale-105 active:scale-95
                         ${lightBg} ${lightHoverBg} 
                         ${darkBg} ${darkHoverBg}
                         dark:ring-1 dark:ring-white/20`} // Dodan suptilni ring za bolji kontrast u tamnoj temi
              disabled={isLoading}
            > 
              <btn.icon className="w-4 h-4 mr-2 opacity-90" /> {t(btn.labelKey)}
            </Button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center">
        {renderForm(false)}
      </div>
    </div>
  );
};

export default Chatbot;