"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { defaultNS, type Locale } from "@/lib/i18n/settings";

interface HomeHeroProps {
  imageUrl: string;
}

export default function HomeHero({ imageUrl }: HomeHeroProps) {
  const { t } = useTranslation(defaultNS);
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";

  return (
    <section className="relative min-h-[70vh] overflow-hidden flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt="Dubrovnik city walls"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
          aria-hidden
        />
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10 px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-6 animate-hero-fade-in animate-hero-delay-1"
            style={{ animationFillMode: "both" }}
          >
            <Sparkles className="h-4 w-4" />
            <span>{t("hero_trust")}</span>
          </div>
          <h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 animate-hero-fade-in animate-hero-delay-2 drop-shadow-lg"
            style={{ animationFillMode: "both" }}
          >
            {t("hero_headline")}
          </h1>
          <p
            className="text-lg md:text-xl text-white/90 mb-8 max-w-xl animate-hero-fade-in animate-hero-delay-3 drop-shadow-md"
            style={{ animationFillMode: "both" }}
          >
            {t("chatbot_hero_subtitle")}
          </p>
          <Link
            href={`/${locale}/chat`}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 animate-hero-fade-in animate-hero-delay-4 hover:scale-[1.02]"
            style={{ animationFillMode: "both" }}
          >
            {t("hero_cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
