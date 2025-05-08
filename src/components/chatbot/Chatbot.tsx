// src/app/components/Chatbot.tsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Automatski dodaj pozdravnu poruku kada se chatbot otvori prvi put
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: t('chatbot_initial_greeting'),
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      
      // Simuliraj prikazivanje sugestija nakon pozdrava
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length, t]);

  // Automatski scroll na dno chata kada stigne nova poruka
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Fokusiraj input polje kada se chatbot otvori
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Dodaj korisničku poruku
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simuliraj odgovor AI-a
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Evo odgovora na tvoje pitanje o "${inputValue}". Hrvatska ima prekrasne destinacije koje bi te mogle zanimati!`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = [
    { id: 'beaches', label: t('chatbot_button_beaches_label'), text: t('chatbot_button_beaches_text') },
    { id: 'wine', label: t('chatbot_button_wine_label'), text: t('chatbot_button_wine_text') },
    { id: 'budget', label: t('chatbot_button_budget_label'), text: t('chatbot_button_budget_text') },
    { id: 'nature', label: t('chatbot_button_nature_label'), text: t('chatbot_button_nature_text') },
  ];

  return (
    <>
      {/* Chatbot toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <Image 
            src="https://storage.googleapis.com/croatia360/images/kuna.png" 
            alt="SARA AI" 
            width={40} 
            height={40} 
            className="rounded-full border-2 border-white"
          />
        )}
      </motion.button>

      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image 
                    src="/images/sara-ai-avatar.png" 
                    alt="SARA AI" 
                    width={40} 
                    height={40} 
                    className="rounded-full border-2 border-white"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="text-white font-bold">SARA AI</h3>
                  <p className="text-blue-100 text-xs">Vaš osobni planer putovanja</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.isUser 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {messages.length === 1 && !isTyping && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">{t('chatbot_suggestions_title')}</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion) => (
                        <motion.button
                          key={suggestion.id}
                          className="bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-full px-3 py-1.5 text-sm text-gray-700 transition-colors shadow-sm"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setInputValue(suggestion.text);
                            setTimeout(() => handleSendMessage(), 100);
                          }}
                        >
                          {suggestion.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('chatbot_input_placeholder')}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                  aria-label={t('chatbot_input_aria_label')}
                />
                <div className="flex space-x-1 ml-2">
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Voice input"
                  >
                    <Mic size={18} />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === ''}
                    className={`p-1.5 rounded-full transition-colors ${
                      inputValue.trim() === '' 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-white bg-blue-500 hover:bg-blue-600'
                    }`}
                    aria-label={t('chatbot_send_button_aria_label')}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
