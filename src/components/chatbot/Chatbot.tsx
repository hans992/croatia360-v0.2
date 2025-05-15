// src/components/chatbot/Chatbot.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChat, type Message } from 'ai/react';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';
import { useRouter, useParams } from 'next/navigation';
import { cn } from "@/lib/utils";

// Props for the Chatbot component
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

  // Create a ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    input,
    handleInputChange: originalHandleInputChange, // Renamed to avoid conflict
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
    // onFinish: () => { // Optional: if you need to do something when message stream finishes
    //   inputRef.current?.focus(); // Re-focus after AI response
    // }
  });

  const initialQueryProcessedRef = useRef(false);

  useEffect(() => {
    if (variant === 'page' && initialQuery && !initialQueryProcessedRef.current && append) {
      append({ role: 'user', content: initialQuery });
      initialQueryProcessedRef.current = true;
      // Optionally focus input after processing initial query if needed
      // setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [variant, initialQuery, append]);

  // Wrapped input change handler to maintain focus
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleInputChange(e); // Call the original handler from useChat
    // Use setTimeout to re-focus after React has processed the state update and re-render
    // This helps ensure that the focus is set on the potentially re-rendered input element
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (redirectOnSubmitUrl && input.trim() && variant === 'hero') { // Redirect only for hero variant on submit
      const userQuery = input;
      setInput(''); // Clear input before redirecting
      router.push(`/${currentLocale}${redirectOnSubmitUrl}?initialQuery=${encodeURIComponent(userQuery)}`);
    } else if (variant === 'page') { // Submit for chat only for page variant
      originalUseChatSubmit(e);
      // Consider focusing the input again after submission for page variant
      // setTimeout(() => inputRef.current?.focus(), 0);
    } else if (variant === 'hero' && !redirectOnSubmitUrl) {
        // If hero variant has no redirect URL, it should probably also submit the chat
        originalUseChatSubmit(e);
        // setTimeout(() => inputRef.current?.focus(), 0);
    }
    // For hero variant that redirects, focus is lost anyway due to navigation.
    // For hero variant that might submit (if no redirect), focus should be maintained.
  };

  // --- Hero Variant Specific Content ---
  const HeroContent = () => (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 text-center md:text-left">
        <div className="md:w-1/2 space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-tight text-white text-shadow-md">
                {t('chatbot_hero_greeting_1', "Hi! I'm SARA AI,")} <br className="hidden md:block" />
                <span className="opacity-80">{t('chatbot_hero_greeting_2', "your travel assistant.")}</span> ✨
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-md mx-auto md:mx-0">
                {t('chatbot_hero_subtitle', "Tell me what you're looking for in your Croatian adventure, and I'll help you plan the perfect trip!")}
            </p>
        </div>
        <div className="md:w-1/2 w-full max-w-md flex flex-col items-center gap-4">
            <form onSubmit={handleFormSubmit} className="relative w-full">
                <Input
                    ref={inputRef} // Assign the ref to the input element
                    value={input}
                    onChange={handleInputChange} // Use the wrapped handler
                    placeholder={t('chatbot_input_placeholder_hero', "Ask SARA AI anything about Croatia...")}
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
                    disabled={isLoading || !input.trim()} // Disable button if input is empty or loading
                    aria-label={t('chatbot_send_button_aria_label')}
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
            <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_beaches_text')); setTimeout(() => inputRef.current?.focus(), 0); }} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_wine_text')); setTimeout(() => inputRef.current?.focus(), 0); }} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_budget_text')); setTimeout(() => inputRef.current?.focus(), 0); }} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
                <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_nature_text')); setTimeout(() => inputRef.current?.focus(), 0); }} className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs" disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
            </div>
        </div>
    </div>
  );

  // --- Page Variant Specific Content (Full Chat Interface) ---
  const PageContent = () => (
     <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(80vh-100px)] border rounded-lg shadow-lg bg-card">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
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
          <div className="mb-3 flex flex-wrap gap-2 justify-center">
              {/* Also ensure focus is returned after clicking these suggestion buttons */}
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_beaches_text')); setTimeout(() => inputRef.current?.focus(), 0); }} disabled={isLoading}> {t('chatbot_button_beaches_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_wine_text')); setTimeout(() => inputRef.current?.focus(), 0); }} disabled={isLoading}> {t('chatbot_button_wine_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_budget_text')); setTimeout(() => inputRef.current?.focus(), 0); }} disabled={isLoading}> {t('chatbot_button_budget_label')} </Button>
              <Button variant="outline" size="sm" onClick={() => { setInput(t('chatbot_button_nature_text')); setTimeout(() => inputRef.current?.focus(), 0); }} disabled={isLoading}> {t('chatbot_button_nature_label')} </Button>
          </div>
          <form onSubmit={handleFormSubmit} className="relative w-full">
              <Input
                  ref={inputRef} // Assign the ref to the input element
                  value={input}
                  onChange={handleInputChange} // Use the wrapped handler
                  placeholder={t('chatbot_input_placeholder', "Ask SARA AI anything...")}
                  className="w-full pr-12 pl-4 py-3 rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
                  disabled={isLoading}
                  aria-label={t('chatbot_input_aria_label')}
              />
              <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                  size="icon"
                  disabled={isLoading || !input.trim()} // Disable button if input is empty or loading
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
    case 'page':
    default:
      return <PageContent />;
  }
};

export default Chatbot;
