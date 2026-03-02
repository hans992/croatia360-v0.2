// src/components/chatbot/Chatbot.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { defaultNS, type Locale } from "@/lib/i18n/settings";
import { useRouter, useParams } from "next/navigation";

type Message = { id: string; role: "user" | "assistant"; content: string };

interface ChatbotProps {
  isSticky?: boolean;
  redirectOnSubmitUrl?: string;
  initialQuery?: string | null;
  onAssistantMessage?: (content: string) => void;
}

// Module-level set to prevent duplicate initialQuery sends (e.g. React Strict Mode double-mount)
const initialQuerySentFor = new Set<string>();

const Chatbot: React.FC<ChatbotProps> = ({
  isSticky = false,
  redirectOnSubmitUrl,
  initialQuery,
  onAssistantMessage,
}) => {
  const { t } = useTranslation(defaultNS);
  const router = useRouter();
  const params = useParams();
  const currentLocale = params.locale as Locale;
  const requestInFlightRef = useRef(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "sara-initial-greeting",
      role: "assistant",
      content: t("chatbot_initial_greeting"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (requestInFlightRef.current) return; // Prevent duplicate/concurrent requests
    requestInFlightRef.current = true;
    setError(null);
    setIsLoading(true);

    const userMsg: Message = { id: `user-${crypto.randomUUID()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const chatMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ messages: chatMessages, locale: currentLocale }),
      });

      const raw = await res.text();
      let data: { message?: string; error?: string };
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(
          res.ok
            ? "Invalid response from server. Please try again."
            : `Server error (${res.status}). Please try again later.`
        );
      }

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const assistantMsg: Message = {
        id: `assistant-${crypto.randomUUID()}`,
        role: "assistant",
        content: data.message ?? "",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      onAssistantMessage?.(data.message ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery?.trim() && !initialQuerySentFor.has(initialQuery.trim())) {
      initialQuerySentFor.add(initialQuery.trim());
      sendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFirstUserMessage =
      messages.filter((m) => m.role === "user").length === 0;

    if (redirectOnSubmitUrl && isFirstUserMessage && input.trim()) {
      const userQuery = input;
      setInput("");
      router.push(
        `/${currentLocale}${redirectOnSubmitUrl}?initialQuery=${encodeURIComponent(userQuery)}`
      );
    } else {
      sendMessage(input);
    }
  };

  const renderForm = (isCompactForm: boolean) => (
    <form
      onSubmit={handleFormSubmit}
      className={`relative w-full ${isCompactForm ? "max-w-xl" : "max-w-2xl"}`}
    >
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("chatbot_input_placeholder")}
        className="pr-12 py-5 rounded-full border-2 border-primary/20 bg-background dark:bg-card/30 
                   placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30
                   transition-all duration-normal disabled:opacity-50"
        disabled={isLoading}
        aria-label={t("chatbot_input_aria_label")}
      />
      <Button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 shadow-card"
        size="icon"
        disabled={isLoading || !input.trim()}
        aria-label={t("chatbot_send_button_aria_label")}
      >
        <Send className="h-4 w-4" />
      </Button>
      {isLoading && (
        <div
          className="absolute -bottom-1.5 left-0 right-0 mx-auto w-4/5 h-2.5
                     bg-primary opacity-60 dark:opacity-80
                     rounded-full blur-md
                     animate-pulse
                     pointer-events-none"
        />
      )}
    </form>
  );

  if (isSticky) {
    return (
      <div className="w-full max-w-3xl mx-auto py-2">
        <div className="flex items-center justify-between">
          <Image
            src="https://storage.googleapis.com/croatiasara2026/images/kuna.png"
            alt={t("alt_sara_ai_logo")}
            width={90}
            height={40}
          />
          {renderForm(true)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
      <div className="flex-grow max-h-full overflow-y-auto p-4 rounded-xl scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted/60 dark:bg-card/50 text-foreground border border-border/60 dark:border-border/50 border-l-4 border-l-accent/60 rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && messages.filter((m) => m.id !== "sara-initial-greeting").length > 0 && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-4 rounded-2xl rounded-bl-md bg-muted/60 dark:bg-card/50 border border-border/60 dark:border-border/50 border-l-4 border-l-accent/60 italic text-muted-foreground">
                {t("chatbot_thinking")}
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-4 rounded-2xl rounded-bl-md bg-destructive/10 border border-destructive/20 text-destructive">
                {t("chatbot_error_prefix")} {error}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput(t("chatbot_button_beaches_text"))}
          className="rounded-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-foreground"
          disabled={isLoading}
        >
          {t("chatbot_button_beaches_label")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput(t("chatbot_button_wine_text"))}
          className="rounded-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-foreground"
          disabled={isLoading}
        >
          {t("chatbot_button_wine_label")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput(t("chatbot_button_budget_text"))}
          className="rounded-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-foreground"
          disabled={isLoading}
        >
          {t("chatbot_button_budget_label")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput(t("chatbot_button_nature_text"))}
          className="rounded-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-foreground"
          disabled={isLoading}
        >
          {t("chatbot_button_nature_label")}
        </Button>
      </div>
      <div className="mt-4 flex items-center justify-center">
        {renderForm(false)}
      </div>
    </div>
  );
};

export default Chatbot;
