// src/components/Chatbot.tsx

"use client"; 

import React from 'react';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChat, type Message } from 'ai/react'; // Import useChat hook and Message type.

// Interface for component props.
interface ChatbotProps {
  isSticky?: boolean;
}

// Placeholder for predefined conversations (can be removed if UnusedComponents is removed).
const PREDEFINED_CONVERSATIONS = [ /* ... */ ];

const Chatbot: React.FC<ChatbotProps> = ({ isSticky = false }) => {
  // Use the Vercel AI SDK's useChat hook to manage chat state and API interaction.
  const {
    messages,        // Array of chat messages (user/assistant).
    input,           // Current value of the input field.
    handleInputChange, // onChange handler for the input field.
    handleSubmit,    // onSubmit handler for the form.
    isLoading,       // Boolean indicating if a response is being generated.
    setInput,        // Function to programmatically set the input value.
    error,           // Error object if an error occurred during the API call or stream processing.
  } = useChat({
    api: '/api/chat', // The backend endpoint for the chat API.
    initialMessages: [ // Set the initial greeting message from the assistant.
      {
        id: 'sara-initial-greeting',
        role: 'assistant',
        content: "Bok! Ja sam SARA AI, tvoj asistent za putovanja. 👋 Reci mi što tražiš za svoju hrvatsku avanturu, a ja ću ti pomoći isplanirati savršeno putovanje!"
      }
    ],
    // Removed debugging callbacks (onResponse, onFinish, onError) for cleaner production code.
    // The 'error' state is used for displaying issues to the user.
  });

  return (
    // Main container, adjusting padding based on sticky state.
    <div className={`w-full max-w-3xl mx-auto ${isSticky ? 'py-2' : 'py-0'}`}>
      {/* Sticky header content */}
      <div className={`flex items-center ${isSticky ? 'justify-between' : 'justify-center'}`}>
        {isSticky && <Image src="/images/kuna.png" alt="SARA AI Logo" width={90} height={40} />}

        {/* Form handles user input and submission */}
        <form onSubmit={handleSubmit} className={`relative w-full ${isSticky ? 'max-w-xl' : 'max-w-2xl'}`}>
          <Input
            value={input} // Bind input value to useChat state.
            onChange={handleInputChange} // Use useChat's handler.
            placeholder="Pitaj SARA AI bilo što o Hrvatskoj..."
            className="pr-10 py-6 rounded-full border border-[#3ABEFF] bg-white/20 text-gray-800 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-[#3ABEFF] focus:border-[#3ABEFF]
                       focus:shadow-[0_0_15px_#3ABEFF] transition-all duration-300 disabled:opacity-50"
            disabled={isLoading} // Disable while waiting for response.
            aria-label="Unesite pitanje za chatbota"
          />
          <Button
            type="submit" // Submit the form on click.
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
            size="icon"
            disabled={isLoading || !input.trim()} // Disable if loading or input is empty.
            aria-label="Pošalji poruku"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Placeholder for sticky layout */}
        {isSticky}
      </div>

      {/* Chat messages and predefined prompts section (only shown when not sticky) */}
      {!isSticky && (
        <>
          {/* Message display area */}
          <div className="mt-4 max-h-[300px] overflow-y-auto bg-white/10 p-4 rounded-lg scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-white/5">
            <div className="space-y-4">
              {/* Render messages from useChat state */}
              {messages.map((message: Message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-gray-50/80 text-gray-800 rounded-tl-none'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {/* Show loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-gray-50/80 text-gray-800 rounded-tl-none italic">
                    SARA razmišlja...
                  </div>
                </div>
              )}
              {/* Display error message if present in useChat state */}
              {error && (
                 <div className="flex justify-start">
                   <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-red-100 text-red-700 rounded-tl-none">
                      Greška: {error.message || "Došlo je do problema."}
                   </div>
                 </div>
              )}
            </div>
          </div>

          {/* Predefined prompt buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
             {/* Buttons use setInput from useChat and are disabled while loading */}
            <Button variant="outline" size="sm" onClick={() => setInput("Želim plaže")} className="border-blue-200/50 bg-white/20 hover:bg-blue-50/30 text-blue-700" disabled={isLoading}> Želim plaže </Button>
            <Button variant="outline" size="sm" onClick={() => setInput("Pokaži vinske destinacije")} className="border-red-200/50 bg-white/20 hover:bg-red-50/30 text-red-700" disabled={isLoading}> Pokaži vinske destinacije </Button>
            <Button variant="outline" size="sm" onClick={() => setInput("Planiraj s €1500")} className="border-green-200/50 bg-white/20 hover:bg-green-50/30 text-green-700" disabled={isLoading}> Planiraj s €1500 </Button>
            <Button variant="outline" size="sm" onClick={() => setInput("Najbolje prirodne ljepote")} className="border-amber-200/50 bg-white/20 hover:bg-amber-50/30 text-amber-700" disabled={isLoading}> Najbolje prirodne ljepote </Button>
          </div>
        </>
      )}
    </div>
  );
};

// Unused component - kept as per original code. Note: Requires React.useEffect import if kept.
const UnusedComponents = () => {
  React.useEffect(() => {}, []); // This hook requires React.useEffect import
  return (
    <Card>
      <CardHeader>
        <CardTitle>Future Feature</CardTitle>
      </CardHeader>
      <CardContent>
        {PREDEFINED_CONVERSATIONS.length > 0 && 'Will be implemented soon'}
      </CardContent>
    </Card>
  );
};

export default Chatbot;
