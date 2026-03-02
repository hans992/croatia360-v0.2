"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { Sparkles, Send } from "lucide-react";
import { defaultNS, type Locale } from "@/lib/i18n/settings";
import VideoBackground from "./VideoBackground";
import { Button } from "@/components/ui/button";

interface HomeHeroProps {
  useVideo?: boolean;
  imageUrl?: string;
}

export default function HomeHero({ useVideo = true, imageUrl }: HomeHeroProps) {
  const { t } = useTranslation(defaultNS);
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as Locale) || "en";
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(
        `/${locale}/chat?initialQuery=${encodeURIComponent(query.trim())}`
      );
    }
  };

  const content = (
    <div className="container mx-auto relative z-10 px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="hero-glass-input inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium mb-6 animate-hero-fade-in animate-hero-delay-1"
          style={{ animationFillMode: "both" }}
        >
          <Sparkles className="h-4 w-4" />
          <span>{t("hero_trust")}</span>
        </div>
        <h1
          className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight mb-4 animate-hero-fade-in animate-hero-delay-2 drop-shadow-lg"
          style={{ animationFillMode: "both" }}
        >
          {t("hero_headline")}
        </h1>
        <p
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-hero-fade-in animate-hero-delay-3 drop-shadow-md"
          style={{ animationFillMode: "both" }}
        >
          {t("chatbot_hero_subtitle")}
        </p>

        {/* Massive AI input */}
        <form
          onSubmit={handleSubmit}
          className="animate-hero-fade-in animate-hero-delay-4"
          style={{ animationFillMode: "both" }}
        >
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("hero_input_placeholder")}
              rows={4}
          className="hero-glass-input w-full px-6 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-white placeholder:text-white/70 text-lg resize-none transition-all duration-normal"
              aria-label={t("hero_input_placeholder")}
            />
            <Button
              type="submit"
              size="lg"
              className="absolute right-3 bottom-3 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-6 shadow-glow-accent transition-all duration-normal"
              disabled={!query.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-4 text-white/70 text-sm">
            {t("hero_cta")} — or{" "}
            <Link
              href={`/${locale}/chat`}
              className="text-accent hover:underline font-medium"
            >
              open chat
            </Link>
          </p>
        </form>
      </div>
    </div>
  );

  if (useVideo) {
    return (
      <section className="full-bleed hero-section-light relative min-h-[85vh] overflow-hidden flex items-center pt-1">
        <VideoBackground overlayOpacity={0.25} className="absolute inset-0 min-h-[85vh]" />
        <div className="relative z-10 w-full flex justify-center px-4">
          <div className="hero-glass-panel rounded-3xl p-8 md:p-12 max-w-4xl w-full">
            {content}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="full-bleed hero-section-light relative min-h-[85vh] overflow-hidden flex items-center pt-1">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: imageUrl
            ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(${imageUrl})`
            : undefined,
          backgroundColor: !imageUrl ? "hsl(222 47% 4%)" : undefined,
        }}
        aria-hidden
      />
      <div className="hero-glass-panel rounded-3xl p-8 md:p-12 mx-4 md:mx-auto max-w-4xl w-full relative z-10">
        {content}
      </div>
    </section>
  );
}
