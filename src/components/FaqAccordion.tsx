"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { defaultNS } from "@/lib/i18n/settings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/faqItems";

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const { t } = useTranslation(defaultNS);

  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={item.questionKey ?? item.question ?? index} value={`faq-${index}`}>
          <AccordionTrigger className="text-left">
            {item.question ?? t(item.questionKey ?? '')}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.answer ?? t(item.answerKey ?? '')}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
