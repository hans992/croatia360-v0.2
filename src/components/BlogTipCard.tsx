"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { defaultNS, type Locale } from "@/lib/i18n/settings";

interface BlogTipCardProps {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  imageUrl: string;
}

const BlogTipCard: React.FC<BlogTipCardProps> = ({
  slug,
  titleKey,
  descriptionKey,
  imageUrl,
}) => {
  const { t } = useTranslation(defaultNS);
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const href = `/${locale}/blog/${slug}`;

  return (
    <Link href={href} className="block h-full group">
      <motion.div
        className="relative h-full overflow-hidden rounded-2xl premium-card-hover backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        <div className="relative h-56 w-full">
          <Image
            src={imageUrl}
            alt={t(titleKey)}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-95" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="font-heading text-xl font-semibold text-white mb-2 drop-shadow-lg">
            {t(titleKey)}
          </h3>
          <p className="text-white/90 text-sm mb-4 line-clamp-2">
            {t(descriptionKey)}
          </p>
          <span className="inline-flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
            {t("blog_read_more")}
            <span className="text-accent">→</span>
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogTipCard;
