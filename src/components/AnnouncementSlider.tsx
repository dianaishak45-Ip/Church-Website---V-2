import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import announcement1 from '../images/Announcement_1.jpg';
import announcement2 from '../images/Announcement_2.jpg';
import announcement3 from '../images/Announcement_3.jpg';

const FALLBACK_SLIDES = [
  announcement1,
  announcement2,
  announcement3,
];

export const AnnouncementSlider: React.FC = () => {
  const [images, setImages] = useState<string[]>(FALLBACK_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dynamic announcements images from API
    fetch('/api/announcements')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load announcements');
        return res.json();
      })
      .then((data: string[]) => {
        if (data && data.length > 0) {
          setImages(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic announcements, using fallback slides:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto" dir="rtl">
      <div className="text-center">
        <h2 className="arabic-serif text-2xl lg:text-3xl font-bold text-stone-900 mb-2 font-noto">أخبار الكنيسة</h2>
      </div>
      
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-stone-100/50 w-fit mx-auto transition-all duration-500">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={`${currentIndex}-${images[currentIndex]}`}
            src={images[currentIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-auto max-w-full max-h-[600px] block mx-auto object-contain"
            alt={`Announcement ${currentIndex + 1}`}
          />
        </AnimatePresence>
      </div>

      {/* Pagination "Slider" below */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
              }}
              className="group py-2 px-1 focus:outline-none"
            >
              <div className={`h-1.5 transition-all duration-500 rounded-full ${
                currentIndex === idx 
                  ? 'w-10 bg-gold shadow-[0_0_8px_rgba(202,160,85,0.4)]' 
                  : 'w-4 bg-stone-300 group-hover:bg-stone-400'
              }`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
