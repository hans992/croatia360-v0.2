"use client"; // Needed for client-side interactivity

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

// Predefined conversation examples
const PREDEFINED_CONVERSATIONS = [
  {
    question: "Koje su najbolje plaže u Dalmaciji?",
    answer: "Dalmacija ima predivne plaže! Neke od najpopularnijih su Zlatni rat na Braču, plaža Sakarun na Dugom otoku i plaža Stiniva na Visu. Želiš li više detalja o nekoj od njih?"
  },
  {
    question: "Preporuči mi vinske destinacije u Istri.",
    answer: "Istra je poznata po vinarstvu! Preporučujem posjetiti Motovun, Grožnjan i okolicu Poreča gdje možete pronaći brojne vinarije koje nude degustacije Malvazije i Terana."
  }
];

interface ChatbotProps {
  isSticky?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isSticky = false }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Bok! Ja sam SARA, tvoj Croatia360 asistent za putovanja. 👋 Reci mi što tražiš za svoju hrvatsku avanturu, a ja ću ti pomoći isplanirati savršeno putovanje!" }
  ]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);

    // Clear input
    setInput("");

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Hvala na upitu! Trenutno sam demonstracijska verzija, ali uskoro ću moći odgovoriti na sva tvoja pitanja o Hrvatskoj. Možeš isprobati neke od predloženih upita ispod chatbota." 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${isSticky ? 'py-2' : 'py-0'}`}>
      <div className={`flex items-center ${isSticky ? 'justify-between' : 'justify-center'}`}>
        {isSticky && <div className="text-lg font-semibold text-blue-900">SARA AI</div>}
        <div className={`relative w-full ${isSticky ? 'max-w-xl' : 'max-w-2xl'}`}>
          {/* Added neon border/shadow styles */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pitaj me bilo što o Hrvatskoj..."
            className="pr-10 py-6 rounded-full border border-[#3ABEFF] bg-white/20 text-gray-800 placeholder-gray-500 
                       focus:outline-none focus:ring-2 focus:ring-[#3ABEFF] focus:border-[#3ABEFF] 
                       focus:shadow-[0_0_15px_#3ABEFF] transition-all duration-300"
          />
          <Button 
            onClick={handleSendMessage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {isSticky && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-sm bg-white/30 border-white/50 hover:bg-white/50">Istraži</Button>
            <Button variant="outline" size="sm" className="text-sm bg-white/30 border-white/50 hover:bg-white/50">Moje putovanje</Button>
          </div>
        )}
      </div>

      {!isSticky && (
        <>
          {/* Removed Card wrapper for chat messages to fit the glassmorphism style */}
          <div className="mt-4 max-h-[300px] overflow-y-auto bg-white/10 p-4 rounded-lg">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-gray-50/80 text-gray-800 rounded-tl-none'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predefined prompts */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInput("Želim plaže")}
              className="border-blue-200/50 bg-white/20 hover:bg-blue-50/30 text-blue-700"
            >
              Želim plaže
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInput("Pokaži vinske destinacije")}
              className="border-red-200/50 bg-white/20 hover:bg-red-50/30 text-red-700"
            >
              Pokaži vinske destinacije
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInput("Planiraj s €1500")}
              className="border-green-200/50 bg-white/20 hover:bg-green-50/30 text-green-700"
            >
              Planiraj s €1500
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInput("Najbolje prirodne ljepote")}
              className="border-amber-200/50 bg-white/20 hover:bg-amber-50/30 text-amber-700"
            >
              Najbolje prirodne ljepote
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
