// src/hooks/useScrollDirection.ts
import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    // Threshold to avoid detecting minor scrolls
    const threshold = 10; 

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      // Only update if scroll direction changes and passes the threshold
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > threshold) {
        setScrollDirection(direction);
      }
      
      // Update lastScrollY, ensuring it's not negative
      lastScrollY = scrollY > 0 ? scrollY : 0; 
    };

    // Add event listener
    window.addEventListener('scroll', updateScrollDirection);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [scrollDirection]); // Re-run effect if scrollDirection changes

  return scrollDirection;
}
