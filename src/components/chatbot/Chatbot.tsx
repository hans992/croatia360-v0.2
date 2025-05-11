// src/components/chatbot/Chatbot.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, BotMessageSquare, User, MessageSquarePlus } from "lucide-react"; // Dodane ikone
import { useChat, type Message } from 'ai/react';
import { useTranslation } from 'react-i18next';
import { defaultNS, type Locale } from '@/lib/i18n/settings';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion'; // Za animacije

interface ChatbotProps {
  isSticky?: boolean;
  redirectOnSubmitUrl?: string;
  initialQuery?: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({
  isSticky = false,
  redirectOnSubmitUrl,
  initialQuery,
}) => {
  const { t } = useTranslation(defaultNS);
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as Locale;
  const messagesEndRef = useRef<HTMLDivElement>(null); // Za automatsko scrollanje

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
    api: '/api/chat', // Osigurajte da ova API ruta postoji i radi
    initialMessages: [
      {
        id: 'sara-initial-greeting',
        role: 'assistant',
        content: t('chatbot_initial_greeting')
      }
    ],
    onFinish: () => {
      // Možete dodati logiku nakon što AI završi s odgovorom
    }
  });

  const initialQueryProcessedRef = useRef(false);

  useEffect(() => {
    if (initialQuery && !initialQueryProcessedRef.current && append) {
      append({ role: 'user', content: initialQuery });
      initialQueryProcessedRef.current = true;
    }
  }, [initialQuery, append]);

  // Automatsko scrollanje na dno kada stigne nova poruka
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // Unaprijeđeni prikaz forme
  const renderForm = (isCompactForm: boolean) => (
    <form onSubmit={handleFormSubmit} className={`relative w-full ${isCompactForm ? 'max-w-2xl' : 'max-w-3xl'}`}>
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder={isCompactForm ? t('chatbot_input_placeholder_sticky') : t('chatbot_input_placeholder')}
        className={`pr-14 py-3 text-base rounded-full border-2 
                   ${isSticky || isCompactForm 
                     ? 'bg-background/70 dark:bg-slate-800/70 border-slate-300 dark:border-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-foreground focus:ring-primary focus:border-primary' 
                     : 'bg-white/20 dark:bg-slate-900/30 border-sky-200/50 dark:border-sky-700/50 placeholder-sky-100 dark:placeholder-sky-300/70 text-white focus:ring-sky-300 dark:focus:ring-sky-500 focus:border-sky-300 dark:focus:border-sky-500'
                   } 
                   focus:shadow-[0_0_15px_rgba(58,190,255,0.5)] dark:focus:shadow-[0_0_15px_rgba(58,190,255,0.3)]
                   transition-all duration-300 disabled:opacity-60 shadow-md`}
        disabled={isLoading}
        aria-label={t('chatbot_input_aria_label')}
      />
      <Button
        type="submit"
        className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 p-2.5 rounded-full 
                   ${isSticky || isCompactForm ? 'bg-primary hover:bg-primary/90' : 'bg-sky-400 hover:bg-sky-300 dark:bg-sky-500 dark:hover:dark:bg-sky-400'} 
                   text-white shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100`}
        size="icon"
        disabled={isLoading || !input.trim()}
        aria-label={t('chatbot_send_button_aria_label')}
      >
        <Send className="h-5 w-5" />
      </Button>
      {isLoading && !isCompactForm && ( // Prikaz pulsirajuće linije samo u ne-kompaktnoj formi
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-1
                     bg-sky-400/70 dark:bg-sky-300/70
                     rounded-full blur-sm
                     animate-pulse"
        />
      )}
    </form>
  );

  // Unaprijeđeni prikaz za ljepljivu (sticky) verziju
  if (isSticky) {
    return (
      <div className="w-full max-w-4xl mx-auto py-2.5 flex items-center gap-3">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0"
        >
          <Image 
            src="https://storage.googleapis.com/croatia360/images/kuna.png" // Vaš logo
            alt={t('alt_sara_ai_logo')} 
            width={44} // Malo veći
            height={44}
            className="rounded-full border-2 border-primary/50 shadow-md"
          />
        </motion.div>
        {renderForm(true)}
      </div>
    );
  }

  // Unaprijeđeni prikaz za puni chat (ne-ljepljiva sekcija na naslovnici ili /chat stranica)
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full items-center">
      {/* SARA AI Header u ne-ljepljivoj verziji */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-block p-3 bg-white/20 dark:bg-slate-900/30 rounded-full shadow-lg mb-3"
        >
          <Image 
            src="https://storage.googleapis.com/croatia360/images/kuna.png" // Vaš logo
            alt={t('alt_sara_ai_logo')} 
            width={72} 
            height={72}
            className="rounded-full"
          />
        </motion.div>
        <motion.h2 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-shadow-sm" // text-shadow-sm za bolju čitljivost na gradijentu
        >
          {t('chatbot_welcome_title_short')} <Sparkles className="inline-block w-7 h-7 text-yellow-300" />
        </motion.h2>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-lg md:text-xl text-sky-100 dark:text-sky-200/90 max-w-xl mx-auto text-shadow-xs"
        >
          {t('chatbot_welcome_subtitle')}
        </motion.p>
      </div>

      {/* Područje za poruke */}
      <div className="flex-grow w-full max-h-[400px] md:max-h-[500px] overflow-y-auto bg-white/10 dark:bg-black/20 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-inner mb-6 scrollbar-thin scrollbar-thumb-sky-300/70 dark:scrollbar-thumb-sky-600/70 scrollbar-track-transparent scrollbar-thumb-rounded-full">
        <div className="space-y-4">
          {messages.map((message: Message, index: number) => (
            <motion.div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className={`flex items-end gap-2 max-w-[85%]`}>
                {message.role === 'assistant' && (
                  <BotMessageSquare className="w-6 h-6 mb-1 text-sky-200 dark:text-sky-400 flex-shrink-0" />
                )}
                <div className={`p-3 md:p-4 rounded-2xl shadow-md break-words
                  ${ message.role === 'user'
                      ? 'bg-sky-500 dark:bg-sky-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  {/* Ovdje možete dodati Markdown parser ako AI vraća Markdown */}
                  {message.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                </div>
                {message.role === 'user' && (
                  <User className="w-6 h-6 mb-1 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && messages.filter(m => m.id !== 'sara-initial-greeting').length > 0 && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
               <div className="flex items-end gap-2 max-w-[85%]">
                <BotMessageSquare className="w-6 h-6 mb-1 text-sky-200 dark:text-sky-400 flex-shrink-0" />
                <div className="p-3 md:p-4 rounded-2xl shadow-md bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 rounded-bl-none italic">
                  {t('chatbot_thinking')}
                  <span className="inline-block ml-1 animate-bounce">.</span>
                  <span className="inline-block ml-1 animate-bounce delay-75">.</span>
                  <span className="inline-block ml-1 animate-bounce delay-150">.</span>
                </div>
              </div>
            </motion.div>
          )}
          {error && (
             <div className="flex justify-start">
               <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-red-100 text-red-700 rounded-tl-none">
                  {t('chatbot_error_prefix')} {error.message || t('chatbot_error_default_message')}
               </div>
             </div>
          )}
          <div ref={messagesEndRef} /> {/* Za automatsko scrollanje */}
        </div>
      </div>
      
      {/* Gumbi za brze upite */}
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-6">
        {[
          { labelKey: 'chatbot_button_beaches_label', queryKey: 'chatbot_button_beaches_text', color: 'bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600' },
          { labelKey: 'chatbot_button_wine_label', queryKey: 'chatbot_button_wine_text', color: 'bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600' },
          { labelKey: 'chatbot_button_budget_label', queryKey: 'chatbot_button_budget_text', color: 'bg-green-400 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-600' },
          { labelKey: 'chatbot_button_nature_label', queryKey: 'chatbot_button_nature_text', color: 'bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600' },
        ].map(btn => (
          <Button 
            key={btn.labelKey}
            variant="default" 
            size="sm" 
            onClick={() => {setInput(t(btn.queryKey)); document.querySelector<HTMLFormElement>('form[class*="max-w-3xl"]')?.requestSubmit();}} // Automatski submit forme nakon klika
            className={`${btn.color} text-white rounded-full px-4 py-2 text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95`} 
            disabled={isLoading}
          > 
            <MessageSquarePlus className="w-4 h-4 mr-1.5" /> {t(btn.labelKey)}
          </Button>
        ))}
      </div>

      {/* Input forma */}
      <div className="w-full">
        {renderForm(false)}
      </div>
    </div>
  );
};

export default Chatbot;