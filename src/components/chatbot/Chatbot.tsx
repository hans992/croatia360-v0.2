// src/components/chatbot/Chatbot.tsx
"use client"; 

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react"; // Added Loader2 for loading state
import { useChat, type Message } from 'ai/react';
import { useTranslation } from 'react-i18next';
import { defaultNS } from '@/lib/i18n/settings';
import { ScrollArea } from "@/components/ui/scroll-area"; // For scrollable messages

interface ChatbotProps {
  isSticky?: boolean; // We keep this prop to potentially hide messages when sticky
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
    api: '/api/chat', // Ensure this API route exists and works
    initialMessages: [
      {
        id: 'sara-initial-greeting',
        role: 'assistant',
        content: t('chatbot_initial_greeting')
      }
    ],
    // Optional: Add error handling specific to the chat hook if needed
    // onError: (err) => {
    //   console.error("Chat hook error:", err);
    //   // You could potentially set a specific error message state here
    // }
  });

  // Ref for scrolling to the bottom of messages
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    // Main container - simplified, background/shadow handled by parent when sticky
    <div className={`w-full max-w-3xl mx-auto transition-all duration-300 ${isSticky ? 'py-1' : 'py-0'}`}> 
      
      {/* Input form - always visible */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={t('chatbot_input_placeholder')!} // Use translated placeholder
          className="flex-grow py-3 px-4" // Adjusted padding
          disabled={isLoading}
          aria-label={t('chatbot_input_aria_label')}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !input.trim()} // Disable if loading or input empty
          aria-label={t('chatbot_send_button_aria_label')}
        >
          {/* Show loader when loading, otherwise send icon */}
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>

      {/* Messages and suggestions - hidden when sticky */}
      {!isSticky && (
        <div className="mt-4 space-y-4">
          {/* Message display area with ScrollArea */}
          <ScrollArea className="h-[300px] w-full rounded-md border border-border bg-background p-4">
            <div className="space-y-4">
              {messages.map((message: Message) => (
                <div 
                  key={message.id} 
                  className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-none' 
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  }`}>
                    {/* Basic Markdown support could be added here if needed */}
                    {message.content}
                  </div>
                </div>
              ))}
              {/* Loading indicator within messages */}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="flex items-start">
                   <div className="max-w-[85%] p-3 rounded-lg shadow-sm bg-muted text-muted-foreground rounded-bl-none italic flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t('chatbot_thinking')}</span>
                   </div>
                </div>
              )}
              {/* Error display */}
              {error && (
                <div className="flex items-start">
                  <div className="max-w-[85%] p-3 rounded-lg shadow-sm bg-destructive/10 text-destructive rounded-bl-none">
                    {t('chatbot_error_prefix')} {error.message || t('chatbot_error_default_message')}
                  </div>
                </div>
              )}
              {/* Element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Suggestion buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {/* Using standard outline variant */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInput(t('chatbot_button_beaches_text'))} 
              disabled={isLoading}
            >
              {t('chatbot_button_beaches_label')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInput(t('chatbot_button_wine_text'))} 
              disabled={isLoading}
            >
              {t('chatbot_button_wine_label')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInput(t('chatbot_button_budget_text'))} 
              disabled={isLoading}
            >
              {t('chatbot_button_budget_label')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInput(t('chatbot_button_nature_text'))} 
              disabled={isLoading}
            >
              {t('chatbot_button_nature_label')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
