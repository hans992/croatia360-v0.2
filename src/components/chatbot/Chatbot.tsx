// src/components/Chatbot.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, UserCircle2 } from "lucide-react"; // Added Bot and UserCircle2 icons
import { useChat, type Message } from 'ai/react';

// Define region colors based on pasted_content.txt guidelines
const regionColors: Record<string, { primary: string; secondary: string; accent: string; text: string; inputText: string; inputBg: string; inputBorder: string; buttonBg: string; buttonHoverBg: string; userBubbleBg: string; userBubbleText: string; assistantBubbleBg: string; assistantBubbleText: string; }> = {
  default: {
    primary: "hsl(var(--primary))", // Default primary color from globals.css
    secondary: "hsl(var(--secondary))",
    accent: "hsl(var(--accent))",
    text: "hsl(var(--foreground))",
    inputText: "hsl(var(--foreground))",
    inputBg: "hsl(var(--background))", // Lighter background for input
    inputBorder: "hsl(var(--border))",
    buttonBg: "hsl(var(--primary))",
    buttonHoverBg: "hsl(var(--primary) / 0.9)",
    userBubbleBg: "hsl(var(--primary))",
    userBubbleText: "hsl(var(--primary-foreground))",
    assistantBubbleBg: "hsl(var(--muted))",
    assistantBubbleText: "hsl(var(--muted-foreground))",
  },
  dalmacija: { // Plava boja mora
    primary: "#0077B6", // Jadransko Plava (Darker)
    secondary: "#00B4D8",
    accent: "#CAF0F8",
    text: "#03045E",
    inputText: "#03045E",
    inputBg: "#E0F7FA",
    inputBorder: "#0077B6",
    buttonBg: "#0077B6",
    buttonHoverBg: "#005F8E",
    userBubbleBg: "#0077B6",
    userBubbleText: "#FFFFFF",
    assistantBubbleBg: "#ADE8F4",
    assistantBubbleText: "#03045E",
  },
  istra: { // Zelena boja maslina i unutrašnjosti
    primary: "#556B2F", // Maslinasto Zelena
    secondary: "#8FBC8F",
    accent: "#OLIVENDRAB", // Olive Drab
    text: "#2F4F4F",
    inputText: "#2F4F4F",
    inputBg: "#F0FFF0", // Honeydew
    inputBorder: "#556B2F",
    buttonBg: "#556B2F",
    buttonHoverBg: "#4A5D2A",
    userBubbleBg: "#556B2F",
    userBubbleText: "#FFFFFF",
    assistantBubbleBg: "#C1E1C1",
    assistantBubbleText: "#2F4F4F",
  },
  kvarner: { // Kombinacija plave i zelene
    primary: "#20B2AA", // Light Sea Green
    secondary: "#3CB371",
    accent: "#AFEEEE",
    text: "#008080",
    inputText: "#008080",
    inputBg: "#F0FFFF", // Azure
    inputBorder: "#20B2AA",
    buttonBg: "#20B2AA",
    buttonHoverBg: "#1A8E87",
    userBubbleBg: "#20B2AA",
    userBubbleText: "#FFFFFF",
    assistantBubbleBg: "#AFEEEE",
    assistantBubbleText: "#008080",
  },
  lika: { // Smeđa i zelena boja planina i šuma
    primary: "#8B4513", // Saddle Brown
    secondary: "#228B22",
    accent: "#D2B48C",
    text: "#553E2F",
    inputText: "#553E2F",
    inputBg: "#FAF0E6", // Linen
    inputBorder: "#8B4513",
    buttonBg: "#8B4513",
    buttonHoverBg: "#7A3D11",
    userBubbleBg: "#8B4513",
    userBubbleText: "#FFFFFF",
    assistantBubbleBg: "#D2B48C",
    assistantBubbleText: "#553E2F",
  },
  sredisnja: { // Zlatna i zelena boja polja i brežuljaka
    primary: "#FFD700", // Gold
    secondary: "#90EE90",
    accent: "#DAA520", // Goldenrod
    text: "#5C4033",
    inputText: "#5C4033",
    inputBg: "#FFFACD", // LemonChiffon
    inputBorder: "#FFD700",
    buttonBg: "#FFD700",
    buttonHoverBg: "#EBC700",
    userBubbleBg: "#FFD700",
    userBubbleText: "#5C4033",
    assistantBubbleBg: "#F0E68C",
    assistantBubbleText: "#5C4033",
  },
  slavonija: { // Zlatna i smeđa boja žitnih polja
    primary: "#B8860B", // DarkGoldenrod
    secondary: "#F4A460",
    accent: "#DEB887", // BurlyWood
    text: "#800000", // Maroon
    inputText: "#800000",
    inputBg: "#FFF8DC", // Cornsilk
    inputBorder: "#B8860B",
    buttonBg: "#B8860B",
    buttonHoverBg: "#A7770A",
    userBubbleBg: "#B8860B",
    userBubbleText: "#FFFFFF",
    assistantBubbleBg: "#FFEBCD",
    assistantBubbleText: "#800000",
  },
  zagreb: { // Plava i bijela boja grada
    primary: "#0047AB", // Cobalt Blue
    secondary: "#ADD8E6",
    accent: "#F0F8FF", // AliceBlue
    text: "#191970", // MidnightBlue
    inputText: "#191970",
    inputBg: "#F0F8FF",
    inputBorder: "#0047AB",
    buttonBg: "#0047AB",
    buttonHoverBg: "#003A8C",
    userBubbleBg: "#0047AB",
    userBubbleText: "#FFFFFF",
    assistantBubbleBg: "#E6E6FA",
    assistantBubbleText: "#191970",
  },
};

interface ChatbotProps {
  isSticky?: boolean;
  currentRegion?: string; // Allow passing current region
}

const Chatbot: React.FC<ChatbotProps> = ({ isSticky = false, currentRegion = 'default' }) => {
  const [activeRegion, setActiveRegion] = useState(currentRegion);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, error, reload } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'sara-initial-greeting',
        role: 'assistant',
        content: "Bok! Ja sam SARA AI, tvoj osobni vodič kroz Hrvatsku. 👋 Kako ti mogu pomoći u planiranju nezaboravne avanture?"
      }
    ],
    onFinish: (message) => {
      // Simple keyword-based region detection from assistant's response
      const lowerCaseContent = message.content.toLowerCase();
      if (lowerCaseContent.includes("dalmacij")) setActiveRegion("dalmacija");
      else if (lowerCaseContent.includes("istr")) setActiveRegion("istra");
      else if (lowerCaseContent.includes("kvarner")) setActiveRegion("kvarner");
      else if (lowerCaseContent.includes("lika") || lowerCaseContent.includes("ličko")) setActiveRegion("lika");
      else if (lowerCaseContent.includes("središnj")) setActiveRegion("sredisnja");
      else if (lowerCaseContent.includes("slavonij")) setActiveRegion("slavonija");
      else if (lowerCaseContent.includes("zagreb")) setActiveRegion("zagreb");
      // else setActiveRegion("default"); // Optionally revert to default if no region mentioned
    }
  });

  const colors = regionColors[activeRegion] || regionColors.default;

  // Scroll to bottom of messages when new messages are added or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const predefinedPrompts = [
    { label: "Plaže u Dalmaciji", query: "Koje su najbolje plaže u Dalmaciji?", region: "dalmacija" },
    { label: "Vinske ceste Istre", query: "Preporuči mi vinske ceste u Istri.", region: "istra" },
    { label: "Nacionalni parkovi Kvarnera", query: "Koji nacionalni parkovi postoje na Kvarneru?", region: "kvarner" },
    { label: "Planinarenje u Lici", query: "Gdje mogu planinariti u Lici?", region: "lika" },
    { label: "Dvorci Središnje Hrvatske", query: "Koji su najpoznatiji dvorci Središnje Hrvatske?", region: "sredisnja" },
    { label: "Gastronomija Slavonije", query: "Što moram probati od hrane u Slavoniji?", region: "slavonija" },
    { label: "Muzeji u Zagrebu", query: "Koji su najbolji muzeji u Zagrebu?", region: "zagreb" },
  ];

  const handlePromptClick = (query: string, region: string) => {
    setInput(query);
    setActiveRegion(region);
    // Optionally, you could immediately submit the form here if desired
    // handleSubmit(new Event('submit') as any); 
  };

  return (
    <div className={`w-full max-w-3xl mx-auto rounded-lg shadow-xl overflow-hidden ${isSticky ? 'py-2' : 'p-0 bg-card'}`} style={{ borderColor: colors.primary }}>
      <div className={`flex items-center p-4 border-b`} style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder }}>
        <Image src="/images/kuna.png" alt="SARA AI Logo" width={isSticky ? 30 : 40} height={isSticky ? 30 : 40} className="mr-3" />
        <form onSubmit={handleSubmit} className="relative w-full">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Pitaj SARA AI o Hrvatskoj..."
            className="pr-12 py-3 rounded-full text-sm md:text-base"
            style={{
              backgroundColor: colors.inputBg,
              color: colors.inputText,
              borderColor: colors.inputBorder,
              '--tw-ring-color': colors.primary // For focus ring
            } as React.CSSProperties}
            disabled={isLoading}
            aria-label="Unesite pitanje za chatbota"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full text-white transition-colors duration-200"
            style={{ backgroundColor: colors.buttonBg }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.buttonHoverBg}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.buttonBg}
            disabled={isLoading || !input.trim()}
            aria-label="Pošalji poruku"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {!isSticky && (
        <>
          <div className="h-[350px] md:h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-rounded"
               style={{ backgroundColor: colors.inputBg, scrollbarColor: `${colors.primary} ${colors.inputBg}` }}>
            {messages.map((message: Message) => (
              <div key={message.id} className={`flex items-end space-x-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && <Bot size={24} className="flex-shrink-0" style={{ color: colors.primary }}/>}
                <div
                  className={`max-w-[75%] md:max-w-[70%] p-3 rounded-xl shadow-md text-sm md:text-base leading-relaxed`}
                  style={{
                    backgroundColor: message.role === 'user' ? colors.userBubbleBg : colors.assistantBubbleBg,
                    color: message.role === 'user' ? colors.userBubbleText : colors.assistantBubbleText,
                    borderTopLeftRadius: message.role === 'user' ? '12px' : '0px',
                    borderTopRightRadius: message.role === 'user' ? '0px' : '12px',
                  }}
                >
                  {message.content.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </div>
                {message.role === 'user' && <UserCircle2 size={24} className="flex-shrink-0" style={{ color: colors.userBubbleBg }}/>}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end space-x-2 justify-start">
                <Bot size={24} className="flex-shrink-0" style={{ color: colors.primary }}/>
                <div className="max-w-[75%] p-3 rounded-xl shadow-md italic" style={{ backgroundColor: colors.assistantBubbleBg, color: colors.assistantBubbleText, borderTopLeftRadius: '0px' }}>
                  SARA razmišlja...
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-end space-x-2 justify-start">
                 <Bot size={24} className="flex-shrink-0 text-red-500"/>
                 <div className="max-w-[75%] p-3 rounded-xl shadow-md bg-red-100 text-red-700 border border-red-300" style={{borderTopLeftRadius: '0px'}}>
                    Dogodila se greška: {error.message || "Pokušajte ponovno."}
                    <Button onClick={() => reload()} variant="link" className="text-xs p-0 h-auto text-red-700 hover:text-red-500 ml-1">Pokušaj ponovno</Button>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t" style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder }}>
            <p className="text-xs text-muted-foreground mb-2 text-center" style={{color: colors.text}}>Ili isprobajte neki od ovih prijedloga:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {predefinedPrompts.map((prompt) => (
                <Button
                  key={prompt.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromptClick(prompt.query, prompt.region)}
                  className="text-xs md:text-sm w-full h-auto py-1.5 px-2 justify-start text-left whitespace-normal transition-colors duration-200"
                  style={{
                    borderColor: regionColors[prompt.region]?.primary || colors.inputBorder,
                    color: regionColors[prompt.region]?.text || colors.text,
                    backgroundColor: regionColors[prompt.region]?.inputBg || colors.inputBg,
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = regionColors[prompt.region]?.accent || colors.accent }
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = regionColors[prompt.region]?.inputBg || colors.inputBg }
                  disabled={isLoading}
                >
                  {prompt.label}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;

