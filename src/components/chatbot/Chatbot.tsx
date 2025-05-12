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
    handleInputChange,
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
        // Ensure scroll after AI response
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 0);
      }
    }
  });

  const initialQueryProcessedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // inputAreaRef i messagesContainerRef se manje koriste za dinamičko pozicioniranje u ovom pristupu
  const inputAreaRef = useRef<HTMLDivElement>(null);


  const [isMobileView, setIsMobileView] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // Jednostavnije praćenje fokusa

  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    setIsMobileView(checkMobile());
    const handleResize = () => setIsMobileView(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (variant === 'page' && initialQuery && !initialQueryProcessedRef.current && append) {
      append({ role: 'user', content: initialQuery });
      initialQueryProcessedRef.current = true;
    }
  }, [variant, initialQuery, append]);

  // Scroll to new messages
  useEffect(() => {
    if (variant === 'page' && messages.length > 0) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [messages, variant]);


  // Body scroll lock when input is focused on mobile (Page variant only)
  useEffect(() => {
    if (variant !== 'page' || !isMobileView) return;

    if (isInputFocused) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed'; // Helps prevent pull-to-refresh and other scroll issues
      document.body.style.width = '100%';
      // When keyboard opens, try to scroll the input into view
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // Delay to allow keyboard to open
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => { // Cleanup on unmount or when dependencies change
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isInputFocused, variant, isMobileView]);


  const handleInputFocus = useCallback(() => {
    if (variant !== 'page' || !isMobileView) return;
    setIsInputFocused(true);
  }, [variant, isMobileView]);

  const handleInputBlur = useCallback(() => {
    if (variant !== 'page' || !isMobileView) return;
    // Delay blur slightly to allow submit or suggestion button click
    setTimeout(() => {
        if (inputAreaRef.current && !inputAreaRef.current.contains(document.activeElement)) {
            setIsInputFocused(false);
        }
    }, 200);
  }, [variant, isMobileView]);


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (redirectOnSubmitUrl && input.trim() && variant === 'hero') {
      const userQuery = input;
      setInput(''); // Clear input for hero variant before redirect
      router.push(`/${currentLocale}${redirectOnSubmitUrl}?initialQuery=${encodeURIComponent(userQuery)}`);
    } else if (variant === 'page') {
      if (!input.trim()) return;
      originalUseChatSubmit(e);
      // Keep input focused after submit for page variant, user can manually close keyboard
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
                    // No ref, onFocus, onBlur for hero variant
                    value={input}
                    onChange={handleInputChange}
                    placeholder={t('chatbot_input_placeholder_hero')}
                    className={cn(
                        "w-full pr-12 pl-5 py-7 rounded-full",
                        "text-base md:text-lg",
                        "bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400",
                        "border border-neutral-300 dark:border-neutral-700",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary dark:focus:ring-offset-neutral-900",
                        "shadow-lg focus:shadow-xl transition-all duration-300"
                    )}
                    disabled={isLoading} // isLoading might not be relevant for hero before redirect
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
                    disabled={!input.trim()}
                    aria-label={t('chatbot_send_button_aria_label')}
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
            <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_beaches_text'))} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_wine_text'))} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_budget_text'))} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_nature_text'))} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
            </div>
        </div>
    </div>
  );

  const PageContent = () => (
    // Main container for the chat page variant
    // h-full is important, and its parent on chat/page.tsx must also have a defined height (e.g., calc(100vh - headerHeight))
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full border rounded-lg shadow-lg bg-card overflow-hidden">
      {/* Message Display Area */}
      <div
        // ref={messagesContainerRef} // Ref might not be needed if padding is handled by overall layout
        className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
        // Conditional padding-bottom can be applied here if body scroll lock is not enough
        style={{ paddingBottom: isMobileView && isInputFocused ? `${(inputAreaRef.current?.offsetHeight || 70) + 16}px` : '1rem' }}

      >
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
        <div ref={messagesEndRef} /> {/* For scrolling to bottom */}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
           <div className="flex justify-start">
             <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-muted text-muted-foreground rounded-tl-none italic animate-pulse">
               {t('chatbot_thinking')}
             </div>
           </div>
        )}
        {error && (
           <div className="flex justify-start">
             <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-destructive/10 text-destructive rounded-tl-none">
                {t('chatbot_error_prefix')} {error.message || t('chatbot_error_default_message')}
             </div>
           </div>
        )}
      </div>

      {/* Input Area - Positioned at the bottom of the flex container */}
      <div
        ref={inputAreaRef} // Ref for measuring height
        className={cn(
            "p-4 border-t border-border bg-card", // Base styles
            // No fixed positioning here, relies on flex layout
            // On mobile when keyboard is open, the browser should push this up.
            // The body scroll lock and padding-bottom on messages container help.
        )}
      >
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
                  onChange={handleInputChange}
                  placeholder={t('chatbot_input_placeholder')}
                  className="w-full pr-12 pl-4 py-3 rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
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
