"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { defaultNS, type Locale, fallbackLng } from "@/lib/i18n/settings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Chatbot from "@/components/chatbot/Chatbot";

function getPromptKey(pathname: string, params: { slug?: string }): string {
  if (!pathname) return "sara_widget_prompt_default";
  const localePrefix = pathname.split("/")[1];
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${localePrefix}`), "") || "/";

  if (pathWithoutLocale === "/explore") return "sara_widget_prompt_explore";
  if (pathWithoutLocale.startsWith("/regions/") && params?.slug)
    return "sara_widget_prompt_region";
  if (pathWithoutLocale.startsWith("/partner/")) return "sara_widget_prompt_partner";
  if (pathWithoutLocale === "/my-trip") return "sara_widget_prompt_my_trip";
  return "sara_widget_prompt_default";
}

export default function SaraFloatingWidget() {
  const { t } = useTranslation(defaultNS);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentLocale = (params?.locale as Locale) || fallbackLng;
  const promptKey = getPromptKey(pathname ?? "", { slug: params?.slug as string });
  const promptText = t(promptKey);

  const handleChatClick = () => {
    setOpen(false);
    router.push(`/${currentLocale}/chat`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <motion.button
            type="button"
            aria-label={t("sara_widget_aria_label")}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30 dark:ring-accent/50 transition-all hover:ring-accent focus:outline-none focus:ring-2 focus:ring-accent ai-glow"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <Image
              src="https://storage.googleapis.com/croatiasara2026/images/kuna.png"
              alt=""
              width={32}
              height={32}
              className="opacity-90"
              aria-hidden
            />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-slate-950">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
          </motion.button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="flex w-full flex-col border-l border-border bg-background/98 dark:bg-slate-950/98 backdrop-blur-xl sm:max-w-md shadow-xl dark:shadow-none"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-left text-lg font-semibold text-foreground">
              <Image
                src="https://storage.googleapis.com/croatiasara2026/images/kuna.png"
                alt=""
                width={28}
                height={28}
              />
              SARA AI
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-1 flex-col overflow-hidden">
            <p className="mb-4 text-sm text-muted-foreground">{promptText}</p>
            <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card dark:bg-card/30 shadow-sm">
              <Chatbot isSticky={false} />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleChatClick}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("sara_widget_open_full_chat")}
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
