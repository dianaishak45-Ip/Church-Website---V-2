import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FALLBACK_IMAGES = [
  '/assets/images/Announcement 1.jpg',
  '/assets/images/Announcement 2.jpg',
  '/assets/images/Announcement 3.jpg'
];

export const AnnouncementsSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FALLBACK_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="arabic-serif text-xl lg:text-4xl font-bold text-center gold-text mb-8">اخبار الكنيسة</h2>
      
      <div 
        className="relative max-w-[600px] mx-auto group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-2xl border border-gold/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center bg-white"
            >
              <img 
                src={FALLBACK_IMAGES[currentIndex]} 
                alt={`Announcement ${currentIndex + 1}`} 
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  console.error('Image failed to load:', FALLBACK_IMAGES[currentIndex]);
                  // You can set a fallback placeholder here if needed
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x800?text=Announcement';
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {FALLBACK_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="relative w-3 h-3 rounded-full overflow-hidden"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div className={`absolute inset-0 bg-gold/20 transition-opacity ${idx === currentIndex ? 'opacity-0' : 'opacity-100'}`} />
              <motion.div 
                className="absolute inset-0 bg-gold"
                initial={false}
                animate={{ 
                  scale: idx === currentIndex ? 1 : 0,
                  opacity: idx === currentIndex ? 1 : 0 
                }}
              />
              {idx === currentIndex && (
                <motion.div 
                  className="absolute inset-0 bg-gold/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
