// src/components/chatbot/Chatbot.tsx
"use client";

import React, { useEffect, useRef } from 'react';
// Importujemo samo Button, ne i Input iz ui
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChat, type Message } from 'ai/react';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';
import { useRouter, useParams } from 'next/navigation';
import { cn } from "@/lib/utils";

interface ChatbotProps {
  variant?: 'hero' | 'page';
  redirectOnSubmitUrl?: string;
  initialQuery?: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({
  variant = 'page',
  redirectOnSubmitUrl,
  initialQuery,
}) => {
  const { t } = useTranslation(defaultNS);
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as Locale;

  const {
    messages,
    input,
    handleInputChange, // Direktno iz useChat
    handleSubmit: originalUseChatSubmit,
    isLoading,
    setInput,
    error,
    append,
  } = useChat({
    api: '/api/chat',
    initialMessages: variant === 'page' ? [
      { id: 'sara-initial-greeting', role: 'assistant', content: t('chatbot_initial_greeting') }
    ] : [],
  });

  const initialQueryProcessedRef = useRef(false);

  useEffect(() => {
    if (variant === 'page' && initialQuery && !initialQueryProcessedRef.current && append) {
      append({ role: 'user', content: initialQuery });
      initialQueryProcessedRef.current = true;
    }
  }, [variant, initialQuery, append]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (redirectOnSubmitUrl && input.trim() && variant === 'hero') {
      const userQuery = input;
      setInput('');
      router.push(`/${currentLocale}${redirectOnSubmitUrl}?initialQuery=${encodeURIComponent(userQuery)}`);
    } else if (variant === 'page') {
      originalUseChatSubmit(e);
    } else if (variant === 'hero' && !redirectOnSubmitUrl) {
      originalUseChatSubmit(e);
    }
  };

  // --- Hero Variant Specific Content (Koristi običan HTML input) ---
  const HeroContent = () => (
    <div className="w-full flex flex-col items-center"> {/* Osnovni omotač iz prethodnog testa */}
      <form onSubmit={handleFormSubmit} className="relative w-full max-w-md mx-auto">
          {/* Zamjena ui/Input s običnim HTML input elementom */}
          <input
              type="text"
              key="hero-chat-input" // Statički key za testiranje stabilnosti
              value={input}
              onChange={handleInputChange} // Direktno iz useChat
              placeholder={t('chatbot_input_placeholder_hero', "Ask SARA AI anything about Croatia...")}
              className={cn( // Koristimo iste Tailwind klase kao za ui/Input
                  "w-full pr-12 pl-5 py-7 rounded-full",
                  "text-base md:text-lg",
                  "bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400",
                  "border border-neutral-300 dark:border-neutral-700",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary dark:focus:ring-offset-neutral-900", // Vraćeni focus stilovi
                  "shadow-lg focus:shadow-xl transition-all duration-300" // Vraćeni focus stilovi
              )}
              disabled={isLoading}
              aria-label={t('chatbot_input_aria_label')}
          />
          <Button
              type="submit"
              className={cn(
                  "absolute right-2.5 top-1/2 transform -translate-y-1/2 p-2.5 rounded-full",
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "transition-transform duration-200 hover:scale-110 active:scale-100",
                  "disabled:opacity-50 disabled:scale-100"
              )}
              size="icon"
              disabled={isLoading || !input.trim()}
              aria-label={t('chatbot_send_button_aria_label')}
          >
              <Send className="h-5 w-5" />
          </Button>
      </form>
    </div>
  );

  // --- Page Variant Specific Content (Koristi običan HTML input) ---
  const PageContent = () => (
     <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(80vh-100px)] border rounded-lg shadow-lg bg-card">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
        {/* Prikaz poruka */}
        {messages.map((message: Message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-muted text-muted-foreground rounded-tl-none'
            }`}>
              {message.content.split('\n').map((line, i) => (
                <span key={i}>{line}<br/></span>
              ))}
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
           <div className="flex justify-start">
             <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-muted text-muted-foreground rounded-tl-none italic animate-pulse">
               {t('chatbot_thinking', "SARA AI is thinking...")}
             </div>
           </div>
        )}
        {error && (
           <div className="flex justify-start">
             <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-destructive/10 text-destructive rounded-tl-none">
                {t('chatbot_error_prefix', "Error:")} {error.message || t('chatbot_error_default_message', "Something went wrong.")}
             </div>
           </div>
        )}
      </div>
      <div className="p-4 border-t border-border bg-background/50">
          {/* Gumbi za prijedloge */}
          <div className="mb-3 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_beaches_text'))} disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_wine_text'))} disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_budget_text'))} disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_nature_text'))} disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
          </div>
          {/* Forma za unos s običnim HTML inputom */}
          <form onSubmit={handleFormSubmit} className="relative w-full">
              <input
                  type="text"
                  key="page-chat-input" // Statički key za testiranje stabilnosti
                  value={input}
                  onChange={handleInputChange} // Direktno iz useChat
                  placeholder={t('chatbot_input_placeholder', "Ask SARA AI anything...")}
                  className={cn( // Koristimo iste Tailwind klase kao za ui/Input
                    "w-full pr-12 pl-4 py-3 rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary" // Vraćeni focus stilovi
                  )}
                  disabled={isLoading}
                  aria-label={t('chatbot_input_aria_label')}
              />
              <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  aria-label={t('chatbot_send_button_aria_label')}
              >
                  <Send className="h-4 w-4" />
              </Button>
          </form>
      </div>
    </div>
  );

  switch (variant) {
    case 'hero':
      return <HeroContent />;
    case 'page':
    default:
      return <PageContent />;
  }
};

export default Chatbot;
