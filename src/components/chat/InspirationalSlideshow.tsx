// src/app/components/chat/InspirationalSlideshow.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Using Next.js Image for optimization

interface InspirationalSlideshowProps {
  imageUrls?: string[];        // Array of image URLs
  autoplayInterval?: number; // Interval for autoplay in milliseconds
}

const InspirationalSlideshow: React.FC<InspirationalSlideshowProps> = ({
  imageUrls = [], // Default to an empty array if no images are provided
  autoplayInterval = 5000, // Default to 5 seconds per image
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Ensure there are images to cycle through
    if (!imageUrls || imageUrls.length === 0) return;

    // Autoplay logic: change image at the specified interval
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, autoplayInterval);

    // Cleanup timer on component unmount or when dependencies change
    return () => clearTimeout(timer);
  }, [currentIndex, imageUrls, autoplayInterval]);

  // If no images are provided, display a placeholder message
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center rounded-lg text-center p-4">
        <p className="text-slate-500">No inspirational images available at the moment.</p>
      </div>
    );
  }

  return (
    // Relative container for absolute positioning of images
    <div className="relative w-full h-full overflow-hidden rounded-lg shadow-xl bg-black">
      {imageUrls.map((url, index) => (
        <div
          key={url} // Use URL as key if they are unique, otherwise index
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0' // Show current, hide others
          }`}
        >
          <Image
            src={url}
            alt={`Inspirational image ${index + 1}`}
            layout="fill" // Fill the container
            objectFit="cover" // Cover the area, may crop; use "contain" if full image is preferred
            priority={index === 0} // Prioritize loading the first image
            className="rounded-lg" // Apply rounded corners to the image itself
            unoptimized={url.startsWith('http')} // Consider if images are external and optimization is problematic
          />
        </div>
      ))}
      {/* Optional: Navigation Dots for manual control or visual feedback */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2 p-1 bg-black/20 rounded-full">
        {imageUrls.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default InspirationalSlideshow;