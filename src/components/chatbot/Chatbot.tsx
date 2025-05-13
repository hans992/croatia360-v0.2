// src/components/chatbot/Chatbot.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
    handleInputChange: originalHandleInputChange,
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
  const inputAreaRef = useRef<HTMLDivElement>(null); // Za mjerenje visine

  const [isMobileView, setIsMobileView] = useState(false);
  const [estimatedInputAreaHeight, setEstimatedInputAreaHeight] = useState(130); // Povećana procjena

  // Određivanje mobilnog prikaza i mjerenje visine input područja
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    const updateMobileView = () => setIsMobileView(checkMobile());
    updateMobileView();

    const measureInputArea = () => {
      if (inputAreaRef.current) {
        const height = inputAreaRef.current.offsetHeight;
        if (height > 0) setEstimatedInputAreaHeight(height);
      }
    };
    measureInputArea(); // Početno mjerenje
    // Debounced mjerenje pri resize-u
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
        updateMobileView();
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(measureInputArea, 200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
    };
  }, []); // Samo na mount/unmount

  useEffect(() => {
    if (variant === 'page' && initialQuery && !initialQueryProcessedRef.current && append) {
      append({ role: 'user', content: initialQuery });
      initialQueryProcessedRef.current = true;
    }
  }, [variant, initialQuery, append]);

  // Skrolaj na nove poruke
  useEffect(() => {
    if (variant === 'page' && messages.length > 0) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 150); // Malo veći delay
    }
  }, [messages, variant]);


  // Omotač za handleInputChange da EKSPLICITNO VRATI FOKUS
  const handleInputChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleInputChange(e); // Pozovi originalni handler iz useChat
    // Odmah nakon promjene, ako smo na mobilnom i ovo je chat stranica, vrati fokus
    if (isMobileView && variant === 'page') {
      // Koristimo requestAnimationFrame da osiguramo da se fokus vrati nakon što React završi s trenutnim ciklusom
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  };

  // Handler za fokus na inputu
  const handleInputFocus = useCallback(() => {
    if (isMobileView && variant === 'page') {
      // Kada input dobije fokus, osiguraj da je vidljiv
      // Preglednik bi trebao sam podići viewport
      // Možemo dodati klasu na body ako želimo spriječiti skrolanje tijela
      document.body.classList.add('chat-input-focused');
      // Skrolaj input u prikaz nakon što se tipkovnica (nadamo se) pojavi
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    }
    if (isMobileView && variant === 'hero') {
        document.body.classList.add('hero-chat-active');
    }
  }, [isMobileView, variant]);

  // Handler za blur na inputu
  const handleInputBlur = useCallback(() => {
    if (isMobileView && variant === 'page') {
      document.body.classList.remove('chat-input-focused');
    }
    if (isMobileView && variant === 'hero') {
        document.body.classList.remove('hero-chat-active');
    }
  }, [isMobileView, variant]);


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentInput = input; // Spremi trenutnu vrijednost inputa
    if (!currentInput.trim()) return;

    if (redirectOnSubmitUrl && variant === 'hero') {
      setInput(''); // Očisti input prije redirecta
      document.body.classList.remove('hero-chat-active');
      router.push(`/${currentLocale}${redirectOnSubmitUrl}?initialQuery=${encodeURIComponent(currentInput)}`);
    } else if (variant === 'page') {
      originalUseChatSubmit(e); // useChat će sam očistiti input ako je tako konfiguriran
      // Nakon slanja, EKSPLICITNO VRATI FOKUS na input ako smo na mobilnom
      if (isMobileView) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
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
            <form onSubmit={handleFormSubmit} className="relative w-full">
                <Input
                    ref={inputRef} // Ref za upravljanje fokusom i klasom na body
                    value={input}
                    onChange={handleInputChangeWrapper} // Koristimo omotač
                    placeholder={t('chatbot_input_placeholder_hero')}
                    className={cn(
                        "w-full pr-12 pl-5 py-7 rounded-full", "text-base md:text-lg",
                        "bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400",
                        "border border-neutral-300 dark:border-neutral-700",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary dark:focus:ring-offset-neutral-900",
                        "shadow-lg focus:shadow-xl transition-all duration-300",
                        "transform-gpu" // Dodano za potencijalno poboljšanje renderinga
                    )}
                    type="text" // Eksplicitno text
                    disabled={isLoading}
                    aria-label={t('chatbot_input_aria_label')}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                <Button
                    type="submit"
                    className={cn( /* ... klase ... */ )}
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    aria-label={t('chatbot_send_button_aria_label')}
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
            <div className="flex flex-wrap gap-2 justify-center">
                 {/* ... suggestion buttons ... onClick sada uključuje inputRef.current?.focus() ... */}
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
        style={{ paddingBottom: `${estimatedInputAreaHeight + 20}px` }} // Povećan padding za svaki slučaj
      >
        {messages.map((message: Message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-muted text-muted-foreground rounded-tl-none'
            }`}>
              {message.content.split('\n').map((line, i) => ( <span key={i}>{line}<br/></span> ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex justify-start"> <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-muted text-muted-foreground rounded-tl-none italic animate-pulse"> {t('chatbot_thinking')} </div> </div>
        )}
        {error && (
           <div className="flex justify-start"> <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-destructive/10 text-destructive rounded-tl-none"> {t('chatbot_error_prefix')} {error.message || t('chatbot_error_default_message')} </div> </div>
        )}
      </div>

      <div ref={inputAreaRef} className="p-4 border-t border-border bg-card shrink-0">
          <div className="mb-3 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_beaches_text')); inputRef.current?.focus(); }} disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_wine_text'));   inputRef.current?.focus(); }} disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_budget_text'));  inputRef.current?.focus(); }} disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_nature_text')); inputRef.current?.focus(); }} disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
          </div>
          <form onSubmit={handleFormSubmit} className="relative w-full">
              <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChangeWrapper} // Koristimo omotač
                  placeholder={t('chatbot_input_placeholder')}
                  className="w-full pr-12 pl-4 py-3 rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary transform-gpu" // Dodan transform-gpu
                  type="text" // Eksplicitno text
                  disabled={isLoading}
                  aria-label={t('chatbot_input_aria_label')}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
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
