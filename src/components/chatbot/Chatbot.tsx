// src/components/chatbot/Chatbot.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react"; // Added Sparkles icon
import { useChat, type Message } from 'ai/react';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';
import { useRouter, useParams } from 'next/navigation';
import { cn } from "@/lib/utils"; // Import cn utility

// Props for the Chatbot component
interface ChatbotProps {
  isSticky?: boolean; // Kept for compatibility if used elsewhere
  variant?: 'sticky' | 'hero' | 'page'; // New variant prop
  redirectOnSubmitUrl?: string;
  initialQuery?: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({
  variant = 'page', // Default to 'page' variant
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
    // Initial messages are only relevant for the full chat page variant
    initialMessages: variant === 'page' ? [
      { id: 'sara-initial-greeting', role: 'assistant', content: t('chatbot_initial_greeting') }
    ] : [],
  });

  const initialQueryProcessedRef = useRef(false);

  // Effect to handle initialQuery on the dedicated chat page ('page' variant)
  useEffect(() => {
    if (variant === 'page' && initialQuery && !initialQueryProcessedRef.current && append) {
      append({ role: 'user', content: initialQuery });
      initialQueryProcessedRef.current = true;
    }
  }, [variant, initialQuery, append]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Redirect logic only applies if redirectOnSubmitUrl is provided (typically for 'hero' variant)
    if (redirectOnSubmitUrl && input.trim()) {
      const userQuery = input;
      setInput(''); // Clear input before redirecting
      router.push(`/${currentLocale}${redirectOnSubmitUrl}?initialQuery=${encodeURIComponent(userQuery)}`);
    } else if (variant === 'page') {
      // Only call the actual chat submission logic on the dedicated chat page
      originalUseChatSubmit(e);
    }
    // For 'sticky' variant, form submission might not do anything or could trigger redirect
  };

  // --- Hero Variant Specific Content ---
  const HeroContent = () => (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 text-center md:text-left">
        {/* Left Side: Text */}
        <div className="md:w-1/2 space-y-4 text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-shadow-md">
                {t('chatbot_hero_greeting_1', "Hi! I'm SARA AI,")} <br className="hidden md:block" />
                <span className="text-primary-foreground/80">{t('chatbot_hero_greeting_2', "your travel assistant.")}</span> ✨
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-md mx-auto md:mx-0">
                {t('chatbot_hero_subtitle', "Tell me what you're looking for in your Croatian adventure, and I'll help you plan the perfect trip!")}
            </p>
        </div>

        {/* Right Side: Input and Buttons */}
        <div className="md:w-1/2 w-full max-w-md flex flex-col items-center gap-4">
            {/* Form for Hero */}
            <form onSubmit={handleFormSubmit} className="relative w-full">
                <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder={t('chatbot_input_placeholder_hero', "Ask SARA AI anything about Croatia...")}
                    className={cn(
                        "w-full pr-12 pl-5 py-7 rounded-full", // Adjusted padding
                        "text-base md:text-lg", // Responsive text size
                        "bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400",
                        "border border-neutral-300 dark:border-neutral-700",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary dark:focus:ring-offset-neutral-900",
                        "shadow-lg focus:shadow-xl transition-all duration-300"
                    )}
                    disabled={isLoading} // Consider if loading state is relevant here
                    aria-label={t('chatbot_input_aria_label')}
                />
                <Button
                    type="submit"
                    className={cn(
                        "absolute right-2.5 top-1/2 transform -translate-y-1/2 p-2.5 rounded-full", // Adjusted padding & position
                        "bg-primary hover:bg-primary/90 text-primary-foreground",
                        "transition-transform duration-200 hover:scale-110 active:scale-100",
                        "disabled:opacity-50 disabled:scale-100"
                    )}
                    size="icon"
                    disabled={!input.trim()} // Disable if input is empty
                    aria-label={t('chatbot_send_button_aria_label')}
                >
                    <Send className="h-5 w-5" /> {/* Slightly larger icon */}
                </Button>
            </form>
             {/* Suggestion Buttons for Hero */}
            <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_beaches_text'))} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_wine_text'))} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_budget_text'))} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_nature_text'))} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
            </div>
        </div>
    </div>
  );

  // --- Sticky Variant Specific Content ---
  const StickyContent = () => (
     <div className="w-full max-w-5xl mx-auto py-2"> {/* Increased max-width */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo/Brand on the left */}
          <div className="flex items-center gap-2 flex-shrink-0">
             <Sparkles className="h-6 w-6 text-primary" /> {/* Using Sparkles icon */}
             <span className="text-lg font-semibold text-foreground hidden sm:inline">
                {t('chatbot_sticky_title', 'Plan with SARA AI')}
             </span>
          </div>
          {/* Form takes up remaining space */}
          <form onSubmit={handleFormSubmit} className="relative flex-grow max-w-xl">
              <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={t('chatbot_input_placeholder_sticky', "Ask SARA AI...")}
                  className="w-full pr-10 pl-4 py-2 rounded-full border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:ring-1 focus:ring-primary" // Compact styling
                  disabled={isLoading}
                  aria-label={t('chatbot_input_aria_label')}
              />
              <Button
                  type="submit"
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                  size="icon"
                  disabled={!input.trim()}
                  aria-label={t('chatbot_send_button_aria_label')}
              >
                  <Send className="h-3.5 w-3.5" />
              </Button>
          </form>
        </div>
      </div>
  );

  // --- Page Variant Specific Content (Full Chat Interface) ---
  const PageContent = () => (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(80vh-100px)] border rounded-lg shadow-lg bg-card"> {/* Example height */}
      {/* Message Display Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
        {messages.map((message: Message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-none' // User message style
                : 'bg-muted text-muted-foreground rounded-tl-none' // Assistant message style
            }`}>
              {/* Basic Markdown rendering (can be enhanced) */}
              {message.content.split('\n').map((line, i) => (
                <span key={i}>{line}<br/></span>
              ))}
            </div>
          </div>
        ))}
        {/* Loading Indicator */}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
           <div className="flex justify-start">
             <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-muted text-muted-foreground rounded-tl-none italic animate-pulse">
               {t('chatbot_thinking', "SARA AI is thinking...")}
             </div>
           </div>
        )}
         {/* Error Message */}
        {error && (
           <div className="flex justify-start">
             <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-destructive/10 text-destructive rounded-tl-none">
                {t('chatbot_error_prefix', "Error:")} {error.message || t('chatbot_error_default_message', "Something went wrong.")}
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/50">
           {/* Suggestion Buttons */}
          <div className="mb-3 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_beaches_text'))} disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_wine_text'))} disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_budget_text'))} disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => setInput(t('chatbot_button_nature_text'))} disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
          </div>
           {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="relative w-full">
              <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={t('chatbot_input_placeholder', "Ask SARA AI anything...")}
                  className="w-full pr-12 pl-4 py-3 rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
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

  // --- Render based on variant ---
  switch (variant) {
    case 'hero':
      return <HeroContent />;
    case 'sticky':
      return <StickyContent />;
    case 'page':
    default:
      return <PageContent />;
  }
};

export default Chatbot;