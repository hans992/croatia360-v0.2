"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: t('chatbot_initial_greeting'),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Evo odgovora na tvoje pitanje o "${userMessage.content}". Hrvatska ima prekrasne destinacije koje bi te mogle zanimati!`,
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
    <section className="relative flex flex-col items-center justify-center min-h-[600px] py-12 bg-gradient-to-tr from-blue-600 via-sky-400 to-fuchsia-600 overflow-hidden">
      {/* Glassmorphism Card */}
      <motion.div
        className="w-full max-w-2xl rounded-3xl shadow-2xl bg-white/60 backdrop-blur-2xl border border-white/30 p-0 md:p-8 flex flex-col"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-white/30">
          <div className="relative">
            <Image
              src="/images/sara-ai-avatar.png"
              alt="SARA AI"
              width={56}
              height={56}
              className="rounded-full border-4 border-blue-400 shadow-lg"
            />
            {/* Pulsing border */}
            <span className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-cyan-400 animate-pulse pointer-events-none"></span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 drop-shadow">SARA AI</h1>
            <p className="text-blue-800 text-sm md:text-base font-medium">{t('hero_subtitle_sara_ai')}</p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-h-[260px] max-h-[320px] overflow-y-auto py-6 px-2 md:px-4 space-y-4 custom-scrollbar">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-md transition-all
                ${message.isUser
                  ? 'bg-gradient-to-r from-fuchsia-500 to-pink-400 text-white rounded-tr-none'
                  : 'bg-white/80 backdrop-blur-lg border border-blue-200 text-blue-900 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                <div className={`text-xs mt-1 ${message.isUser ? 'text-pink-100' : 'text-blue-400'}`}>
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
              <div className="bg-white/80 border border-blue-200 px-5 py-3 rounded-2xl rounded-tl-none max-w-[80%] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="ml-2 text-blue-600 text-xs">{t('chatbot_thinking')}</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && !isTyping && (
          <div className="flex flex-wrap gap-2 mb-4 px-2 md:px-4">
            <span className="text-sm text-blue-700 font-semibold">{t('chatbot_suggestions_title')}</span>
            {suggestions.map((suggestion) => (
              <motion.button
                key={suggestion.id}
                className="bg-gradient-to-r from-sky-400 to-fuchsia-500 text-white font-semibold rounded-full px-4 py-1.5 shadow hover:scale-105 transition-transform"
                whileHover={{ scale: 1.08 }}
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
        )}

        {/* Input area */}
        <form
          className="flex items-center gap-2 mt-2 bg-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg border border-white/60"
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <button
            type="button"
            className="text-blue-400 hover:text-blue-600 p-2 rounded-full transition-colors"
            aria-label="Attach file"
            tabIndex={-1}
          >
            <Paperclip size={20} />
          </button>
          <button
            type="button"
            className="text-blue-400 hover:text-blue-600 p-2 rounded-full transition-colors"
            aria-label="Voice input"
            tabIndex={-1}
          >
            <Mic size={20} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={t('chatbot_input_placeholder')}
            className="flex-1 bg-transparent outline-none px-2 text-gray-900 placeholder-blue-400"
            aria-label={t('chatbot_input_aria_label')}
          />
          <button
            type="submit"
            disabled={inputValue.trim() === ''}
            className={`rounded-full p-2 transition-all shadow
              ${inputValue.trim() === ''
                ? 'bg-gradient-to-r from-blue-200 to-fuchsia-200 text-blue-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white hover:scale-110'
              }`}
            aria-label={t('chatbot_send_button_aria_label')}
          >
            <Send size={22} />
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Chatbot;
