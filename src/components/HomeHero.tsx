"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Send, ShipWheel, Sparkles } from "lucide-react";
import { type Locale } from "@/lib/i18n/settings";
import VideoBackground from "./VideoBackground";
import { Button } from "@/components/ui/button";
import { getMarketplaceCopy } from "@/lib/marketplace/copy";

interface HomeHeroProps {
  useVideo?: boolean;
  imageUrl?: string;
}

export default function HomeHero({ useVideo = true, imageUrl }: HomeHeroProps) {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as Locale) || "en";
  const copy = getMarketplaceCopy(locale);
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/chat?initialQuery=${encodeURIComponent(query.trim())}`);
    }
  };

  const content = (
    <div className="container mx-auto relative z-10 px-4 py-10 md:py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="hero-glass-input inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium mb-6 animate-hero-fade-in animate-hero-delay-1" style={{ animationFillMode: "both" }}>
          <ShipWheel className="h-4 w-4" />
          <span>{copy.homeEyebrow}</span>
        </div>

        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight mb-5 animate-hero-fade-in animate-hero-delay-2 drop-shadow-lg" style={{ animationFillMode: "both" }}>
          {copy.homeTitle}
        </h1>

        <p className="text-base md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-hero-fade-in animate-hero-delay-3 drop-shadow-md" style={{ animationFillMode: "both" }}>
          {copy.homeDescription}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-hero-fade-in animate-hero-delay-4" style={{ animationFillMode: "both" }}>
          <Button asChild size="lg" className="min-w-[220px] rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-6 shadow-glow-accent">
            <Link href={`/${locale}/zadar/boat-tours`}>
              {copy.homeCta}<ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-[180px] rounded-xl border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white px-6 py-6 backdrop-blur-sm">
            <Link href={`/${locale}/chat`}><Sparkles className="mr-2 h-5 w-5" />Ask SARA AI</Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-2xl animate-hero-fade-in animate-hero-delay-4" style={{ animationFillMode: "both" }}>
          <p className="mb-3 text-sm font-medium text-white/80">Not sure which boat experience fits you? Describe the day you want.</p>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Quiet coves, swimming and lunch for 6 people…"
              className="hero-glass-input w-full rounded-2xl px-5 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-accent/50 text-white placeholder:text-white/65 text-base transition-all duration-normal"
              aria-label="Ask SARA AI about a boat experience"
            />
            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!query.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Ask SARA AI</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  if (useVideo) {
    return (
      <section className="full-bleed hero-section-light relative min-h-[85vh] overflow-hidden flex items-center pt-1">
        <VideoBackground overlayOpacity={0.35} className="absolute inset-0 min-h-[85vh]" />
        <div className="relative z-10 w-full flex justify-center px-4">
          <div className="hero-glass-panel rounded-3xl p-5 md:p-10 max-w-5xl w-full">{content}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="full-bleed hero-section-light relative min-h-[85vh] overflow-hidden flex items-center pt-1">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: imageUrl ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${imageUrl})` : undefined, backgroundColor: !imageUrl ? "hsl(222 47% 4%)" : undefined }} aria-hidden />
      <div className="hero-glass-panel rounded-3xl p-5 md:p-10 mx-4 md:mx-auto max-w-5xl w-full relative z-10">{content}</div>
    </section>
  );
}
