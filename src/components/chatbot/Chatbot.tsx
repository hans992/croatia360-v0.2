// src/components/chatbot/Chatbot.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react'; // Added useCallback
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
    // Ensure messages are scrolled into view after new message is added by AI
    onFinish: () => {
        if (variant === 'page') {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }
  });

  const initialQueryProcessedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatPageLayoutRef = useRef<HTMLDivElement>(null); // Ref for the main chat page layout

  const [isMobileKeyboardVisible, setIsMobileKeyboardVisible] = useState(false);
  const [inputAreaHeight, setInputAreaHeight] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view on mount and resize
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

  useEffect(() => {
    if (variant === 'page') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, variant]);

  // Measure input area height when it's not fixed (or when mobile keyboard state changes)
  useEffect(() => {
    if (inputAreaRef.current && !isMobileKeyboardVisible) {
      setInputAreaHeight(inputAreaRef.current.offsetHeight);
    }
  }, [isMobileKeyboardVisible, variant]); // Re-measure if variant changes (though less likely for this)


  // Mobile keyboard handling logic
  const handleVisualViewportResize = useCallback(() => {
    if (!isMobileView || !window.visualViewport || !inputAreaRef.current || !messagesContainerRef.current) return;

    const { offsetTop, height: vvHeight } = window.visualViewport;
    const windowHeight = window.innerHeight;
    const keyboardIsOpening = vvHeight < windowHeight * 0.9 && offsetTop > 0; // Heuristic
    
    if (keyboardIsOpening) {
        setIsMobileKeyboardVisible(true);
        // Ensure input area height is current
        const currentInputAreaHeight = inputAreaRef.current.offsetHeight;
        setInputAreaHeight(currentInputAreaHeight);
        messagesContainerRef.current.style.paddingBottom = `${currentInputAreaHeight + 16}px`;
        // Scroll the focused input into view if it's being obscured
        if (document.activeElement === inputRef.current) {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
             messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }

    } else {
        // Keyboard is closing or not significantly open
        if (isMobileKeyboardVisible) { // Only act if it was previously visible
            setIsMobileKeyboardVisible(false);
            messagesContainerRef.current.style.paddingBottom = '1rem'; // Reset padding
        }
    }
  }, [isMobileView, isMobileKeyboardVisible]); // Added isMobileKeyboardVisible to dependencies

  useEffect(() => {
    if (variant !== 'page' || !isMobileView) return;

    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleVisualViewportResize);
      // Initial check in case keyboard is already open (e.g. page refresh)
      if (document.activeElement === inputRef.current) {
        handleVisualViewportResize();
      }
    }
    return () => {
      if (visualViewport) {
        visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
    };
  }, [variant, isMobileView, handleVisualViewportResize]);

  const handleInputFocus = () => {
    if (isMobileView && window.visualViewport) {
        // When input is focused on mobile, visualViewport resize should handle it.
        // We can trigger a re-check just in case.
        handleVisualViewportResize();
        // Ensure the input itself is scrolled into view if somehow obscured
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleInputBlur = () => {
    if (isMobileView) {
      // Delay hiding to allow click on send button or other elements
      setTimeout(() => {
        // Check if focus is still within the chat input area or if keyboard is truly gone
        if (!inputAreaRef.current?.contains(document.activeElement)) {
            // If visualViewport hasn't already set it to false, we do it here
            if(isMobileKeyboardVisible && window.visualViewport && window.visualViewport.height > window.innerHeight * 0.9) {
                setIsMobileKeyboardVisible(false);
                 if(messagesContainerRef.current) messagesContainerRef.current.style.paddingBottom = '1rem';
            }
        }
      }, 200);
    }
  };


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (redirectOnSubmitUrl && input.trim() && variant === 'hero') {
      const userQuery = input;
      setInput('');
      router.push(`/${currentLocale}${redirectOnSubmitUrl}?initialQuery=${encodeURIComponent(userQuery)}`);
    } else if (variant === 'page') {
      originalUseChatSubmit(e);
      // Optionally blur input after submit on mobile to hide keyboard
      if (isMobileView && inputRef.current) {
        // inputRef.current.blur(); // Uncomment this if you want keyboard to hide on submit
      }
    }
  };

  // --- Hero Variant Specific Content ---
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
                    ref={inputRef}
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
                    disabled={isLoading}
                    aria-label={t('chatbot_input_aria_label')}
                    onFocus={handleInputFocus} // Added onFocus
                    // onBlur={handleInputBlur} // Blur might be too aggressive, visualViewport should handle closing
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
    <div ref={chatPageLayoutRef} className="w-full max-w-3xl mx-auto flex flex-col h-full border rounded-lg shadow-lg bg-card overflow-hidden">
      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
        style={{ paddingBottom: isMobileKeyboardVisible && inputAreaHeight > 0 ? `${inputAreaHeight + 16}px` : '1rem' }}
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
        <div ref={messagesEndRef} />
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
      <div
        ref={inputAreaRef}
        className={cn(
            "p-4 border-t border-border bg-card",
            "transition-transform duration-200 ease-out", // Changed from transition-all
            isMobileKeyboardVisible && isMobileView
                ? "fixed bottom-0 left-0 right-0 z-50 shadow-2xl transform translate-y-0" // Ensure it's visible
                : "relative transform translate-y-0" // Default state
        )}
      >
          <div className="mb-3 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_beaches_text'))} disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_wine_text'))} disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_budget_text'))} disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_nature_text'))} disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
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
                  onFocus={handleInputFocus} // Add onFocus
                  onBlur={handleInputBlur}   // Add onBlur
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
