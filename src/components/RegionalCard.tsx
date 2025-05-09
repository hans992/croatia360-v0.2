// src/components/RegionalCard.tsx
"use client"; // Marks this as a Client Component

import React from 'react';
import Image from 'next/image'; // Next.js optimized image component
import Link from 'next/link'; // Next.js component for client-side navigation
import { useTranslation } from 'react-i18next'; // Hook for translations
import { useParams } from 'next/navigation'; // Hook to access route parameters (like locale)
import { defaultNS, type Locale } from '@/lib/i18n/settings'; // Import i18n settings and Locale type

// Define the expected props for the RegionalCard component
interface RegionalCardProps {
  regionKey: string;      // Translation key for the region's name
  descriptionKey: string; // Translation key for the region's short description
  imageUrl: string;       // URL for the region's image
  color1: string;         // Primary color for the gradient
  color2: string;         // Secondary color for the gradient
  slug: string;           // URL-friendly slug for the region
}

// The RegionalCard functional component
const RegionalCard: React.FC<RegionalCardProps> = ({
  regionKey,
  descriptionKey,
  imageUrl,
  color1,
  color2,
  slug,
}) => {
  // Initialize the translation hook
  const { t } = useTranslation(defaultNS);
  // Get current route parameters using the useParams hook
  const params = useParams();
  // Extract the current locale from the route parameters
  const currentLocale = params.locale as Locale; // Type assertion to Locale

  // Construct the dynamic href for the Link component
  // It will navigate to /<locale>/regions/<slug>
  const regionPagePath = `/${currentLocale}/regions/${slug}`;

  return (
    // Link component wraps the entire card for navigation
    <Link href={regionPagePath} passHref legacyBehavior={false}> {/* It's good practice to set legacyBehavior to false with new Next.js versions */}
      {/* Outer div for the card, handling relative positioning, sizing, and hover effects */}
      <div className="relative h-[300px] md:h-[350px] rounded-xl shadow-xl overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
        {/* Image container - absolute positioning to fill the card */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={imageUrl}
            alt={t(regionKey)} // Alt text for accessibility, using translated region name
            layout="fill" // Fills the parent container
            objectFit="cover" // Covers the area, cropping if necessary
            className="transition-transform duration-500 ease-out group-hover:scale-110" // Zoom effect on hover
            priority={false} // Set to true only for LCP images, usually not for multiple cards
          />
        </div>

        {/* Gradient overlay - enhances text readability over the image */}
        <div
          className="absolute inset-0" // No need for bg-gradient-to-t from-black/80 here if using inline style for dynamic colors
          style={{
            // Dynamic gradient using provided colors with alpha for transparency
            // Adjust alpha (e.g., BF for ~75%, CC for ~80%) and stop points (e.g., 60%) as needed
            background: `linear-gradient(to top, ${color1}BF 0%, ${color1}99 30%, ${color2}33 60%, transparent 100%)`,
          }}
        />

        {/* Content container - positioned at the bottom, uses flex to align content */}
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 z-10 flex flex-col justify-end h-full">
          {/* Wrapper for text content that appears/animates on hover */}
          <div>
            {/* Region title */}
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg">
              {t(regionKey)}
            </h3>

            {/* Description and button container - handles hover visibility */}
            <div
              className="transform transition-all duration-300 ease-out 
                         hover-hover:opacity-0 hover-hover:translate-y-4 hover-hover:group-hover:opacity-100 hover-hover:group-hover:translate-y-0
                         no-hover:opacity-100" // Visible on no-hover devices (touch), animates on hover devices
            >
              {/* Region short description */}
              <p className="text-white text-sm mb-3 line-clamp-2 md:line-clamp-3 drop-shadow-sm">
                {t(descriptionKey)}
              </p>
              {/* "Discover" button */}
              <button
                aria-label={t('explore_page_discover_region_aria_label', { regionName: t(regionKey) }) || `Discover ${t(regionKey)}`} // ARIA label for accessibility
                className="bg-white text-primary hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-xs md:text-sm"
              >
                {t('explore_page_discover_region_button_text') || t('explore_page_discover_region', { regionName: t(regionKey) })} {/* Fallback for button text */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RegionalCard;