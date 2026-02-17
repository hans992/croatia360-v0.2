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
    <div className="relative w-full aspect-[4/3] min-h-[300px] overflow-hidden rounded-2xl bg-muted">
      {imageUrls.map((url, index) => (
        <div
          key={url}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={url}
            alt={`Inspirational image ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            unoptimized={url.startsWith('http')}
          />
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2 p-2 bg-black/30 backdrop-blur-sm rounded-full">
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