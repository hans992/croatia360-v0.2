// src/components/chatbot/Chatbot.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react'; // useCallback uklonjen za sada
import { Input } from "@/components/ui/input";
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
    handleInputChange, // Koristimo direktno iz useChat
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
    onFinish: () => {
      if (variant === 'page') {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 0);
      }
    }
  });

  const initialQueryProcessedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null); // Za mjerenje visine za padding

  const [estimatedInputAreaHeight, setEstimatedInputAreaHeight] = useState(130); // Početna procjena

  // Mjerenje visine input područja za fiksni padding
  useEffect(() => {
    const measureInputArea = () => {
      if (inputAreaRef.current) {
        const height = inputAreaRef.current.offsetHeight;
        if (height > 0 && height !== estimatedInputAreaHeight) { // Ažuriraj samo ako se promijenila
            setEstimatedInputAreaHeight(height);
        }
      }
    };
    measureInputArea(); // Početno mjerenje
    // Ponovno mjeri pri promjeni veličine prozora (npr. promjena orijentacije)
    window.addEventListener('resize', measureInputArea);
    return () => window.removeEventListener('resize', measureInputArea);
  }, [estimatedInputAreaHeight]); // Ponovno pokreni ako se procijenjena visina promijeni (manje vjerojatno)


  useEffect(() => {
    if (variant === 'page' && initialQuery && !initialQueryProcessedRef.current && append) {
      append({ role: 'user', content: initialQuery });
      initialQueryProcessedRef.current = true;
    }
  }, [variant, initialQuery, append]);

  useEffect(() => {
    if (variant === 'page' && messages.length > 0) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [messages, variant]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentInputValue = input;
    if (!currentInputValue.trim()) return;

    if (redirectOnSubmitUrl && variant === 'hero') {
      setInput('');
      router.push(`/${currentLocale}${redirectOnSubmitUrl}?initialQuery=${encodeURIComponent(currentInputValue)}`);
    } else if (variant === 'page') {
      originalUseChatSubmit(e);
      // Nakon slanja, NE DIRAMO FOKUS.
      // Ako se tipkovnica zatvori, korisnik će morati ponovno kliknuti.
      // Ovo je najsigurniji način da se izbjegne borba s preglednikom.
    }
  };

  const HeroContent = () => (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 text-center md:text-left">
        <div className="md:w-1/2 space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-tight text-white text-shadow-md">
                {t('chatbot_hero_greeting_1')} <br className="hidden md:block" />
                <span className="opacity-80">{t('chatbot_hero_greeting_2')}</span> ✨
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-md mx-auto md:mx-0">
                {t('chatbot_hero_subtitle')}
            </p>
        </div>
        <div className="md:w-1/2 w-full max-w-md flex flex-col items-center gap-4">
            <div key="hero-input-wrapper" className="relative w-full">
              <form onSubmit={handleFormSubmit} className="relative w-full">
                  <Input
                      ref={inputRef} // Ref je i dalje koristan za .focus() na klik gumba za prijedloge
                      value={input}
                      onChange={handleInputChange} // DIREKTNO KORIŠTENJE HANDLERA IZ useChat
                      placeholder={t('chatbot_input_placeholder_hero')}
                      className={cn(
                          "w-full pr-12 pl-5 py-7 rounded-full", "text-base md:text-lg",
                          "bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400",
                          "border border-neutral-300 dark:border-neutral-700",
                          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary dark:focus:ring-offset-neutral-900",
                          "shadow-lg focus:shadow-xl transition-all duration-300"
                      )}
                      style={{ transform: 'translateZ(0)' }}
                      type="text"
                      disabled={isLoading}
                      aria-label={t('chatbot_input_aria_label')}
                      // UKLONJENI onFocus i onBlur za hero
                  />
                  <Button type="submit" className={cn("absolute right-2.5 top-1/2 transform -translate-y-1/2 p-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-200 hover:scale-110 active:scale-100 disabled:opacity-50 disabled:scale-100")} size="icon" disabled={isLoading || !input.trim()} aria-label={t('chatbot_send_button_aria_label')}>
                      <Send className="h-5 w-5" />
                  </Button>
              </form>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => {setInput(t('chatbot_button_beaches_text')); inputRef.current?.focus();}} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => {setInput(t('chatbot_button_wine_text')); inputRef.current?.focus();}} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => {setInput(t('chatbot_button_budget_text')); inputRef.current?.focus();}} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => {setInput(t('chatbot_button_nature_text')); inputRef.current?.focus();}} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
            </div>
        </div>
    </div>
  );

  const PageContent = () => (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full border rounded-lg shadow-lg bg-card overflow-hidden">
      <div
        className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
        style={{ paddingBottom: `${estimatedInputAreaHeight + 20}px` }}
      >
        {messages.map((message: Message) => ( <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${ message.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-muted-foreground rounded-tl-none'}`}>{message.content.split('\n').map((line, i) => ( <span key={i}>{line}<br/></span> ))}</div></div>))}
        <div ref={messagesEndRef} />
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && ( <div className="flex justify-start"> <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-muted text-muted-foreground rounded-tl-none italic animate-pulse"> {t('chatbot_thinking')} </div> </div> )}
        {error && ( <div className="flex justify-start"> <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-destructive/10 text-destructive rounded-tl-none"> {t('chatbot_error_prefix')} {error.message || t('chatbot_error_default_message')} </div> </div> )}
      </div>
      <div ref={inputAreaRef} className="p-4 border-t border-border bg-card shrink-0">
          <div className="mb-3 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_beaches_text')); inputRef.current?.focus(); }} disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_wine_text'));   inputRef.current?.focus(); }} disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_budget_text'));  inputRef.current?.focus(); }} disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_nature_text')); inputRef.current?.focus(); }} disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
          </div>
          <div key="page-input-wrapper" className="relative w-full">
            <form onSubmit={handleFormSubmit} className="relative w-full">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange} // DIREKTNO KORIŠTENJE HANDLERA IZ useChat
                    placeholder={t('chatbot_input_placeholder')}
                    className="w-full pr-12 pl-4 py-3 rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
                    style={{ transform: 'translateZ(0)' }}
                    type="text"
                    disabled={isLoading}
                    aria-label={t('chatbot_input_aria_label')}
                    // UKLONJENI onFocus i onBlur za page varijantu da vidimo default ponašanje
                    // Ako je potrebno, možemo vratiti onFocus samo za scrollIntoView
                    // onFocus={() => {
                    //   if (isMobileView) {
                    //     setTimeout(() => inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
                    //   }
                    // }}
                />
                <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50" size="icon" disabled={isLoading || !input.trim()} aria-label={t('chatbot_send_button_aria_label')}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
          </div>
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
