// src/app/components/chatbot/Chatbot.tsx
"use client";

import React from 'react';
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
    <div className={`rounded-lg p-4 ${isSticky 
      ? 'bg-white/95 shadow-lg max-w-3xl mx-auto transform transition-all duration-300 scale-90' 
      : 'bg-white/80 backdrop-blur-sm'}`}>
      
      {/* Sticky version - compact UI */}
      {isSticky && (
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={t('chatbot_placeholder')}
                className="flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
      
      {/* Full version - expanded UI */}
      {!isSticky && (
        <>
          <div className="mb-4 space-y-4">
            {messages.map((message: Message) => (
              <div key={message.id} className={`p-3 rounded-lg ${
                message.role === 'assistant' ? 'bg-blue-50' : 'bg-gray-100'
              }`}>
                {message.content}
              </div>
            ))}
            
            {isLoading && (
              <div className="p-3 rounded-lg bg-blue-50 animate-pulse">
                {t('chatbot_thinking')}
              </div>
            )}
            
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700">
                {t('chatbot_error_prefix')} {error.message || t('chatbot_error_default_message')}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={t('chatbot_placeholder')}
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setInput(t('chatbot_button_beaches_text'))} 
              className="border-blue-200/50 bg-white/20 hover:bg-blue-50/30 text-blue-700" 
              disabled={isLoading}>
              {t('chatbot_button_beaches_label')}
            </Button>
            
            <Button 
              onClick={() => setInput(t('chatbot_button_wine_text'))} 
              className="border-red-200/50 bg-white/20 hover:bg-red-50/30 text-red-700" 
              disabled={isLoading}>
              {t('chatbot_button_wine_label')}
            </Button>
            
            <Button 
              onClick={() => setInput(t('chatbot_button_budget_text'))} 
              className="border-green-200/50 bg-white/20 hover:bg-green-50/30 text-green-700" 
              disabled={isLoading}>
              {t('chatbot_button_budget_label')}
            </Button>
            
            <Button 
              onClick={() => setInput(t('chatbot_button_nature_text'))} 
              className="border-amber-200/50 bg-white/20 hover:bg-amber-50/30 text-amber-700" 
              disabled={isLoading}>
              {t('chatbot_button_nature_label')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
