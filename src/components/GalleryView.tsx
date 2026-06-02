import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ChevronRight, ChevronLeft, Maximize2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
}

const FALLBACK_GALLERY_IMAGES: GalleryItem[] = [
  { id: 'f_up1', url: '/gallery/Gemini_Generated_Image_99hq7m99hq7m99hq.png', title: 'صورة تذكارية تاريخية من أرشيف الكنيسة', category: 'معرض الكنيسة' },
  { id: 'f_up2', url: '/gallery/Gemini_Generated_Image_rxtogerxtogerxto.png', title: 'أيقونة القديس مارمرقس الرسولي شفيع الكنيسة', category: 'معرض الأيقونات' }
];

export default function GalleryView() {
  useSEO({
    title: 'معرض الصور - كنيسة مارمرقس بشبرا',
    description: 'شاهد ألبوم صور كنيسة القديس مارمرقس الرسولي بشبرا، جولة بصرية في رحاب الكنيسة والفن القبطي.',
    keywords: 'صور الكنيسة, معرض الصور, كنيسة مارمرقس, الفن القبطي, أيقونات قبطية',
  });

  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;
    
    if (currentSrc.includes('Gemini_Generated_Image_99hq7m99hq7m99hq.png')) {
      img.src = '/gallery/Gemini_Generated_Image_rxtogerxtogerxto.png';
    }
  };

  useEffect(() => {
    // Dynamic fetch from the gallery folder API
    fetch('/api/gallery')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load gallery');
        return res.json();
      })
      .then((files: string[]) => {
        if (files && files.length > 0) {
          // If there are custom user images, filter out Gemini placeholders
          const hasCustomImages = files.some(file => !file.toLowerCase().includes('gemini_generated_image'));
          const filteredFiles = hasCustomImages
            ? files.filter(file => !file.toLowerCase().includes('gemini_generated_image'))
            : files;

          const mappedItems: GalleryItem[] = filteredFiles.map((file, idx) => {
            // Convert file name into pretty title: "church_gate.jpg" -> "Church Gate"
            let prettyTitle = file
              .substring(0, file.lastIndexOf('.'))
              .replace(/[_-]/g, ' ')
              .trim();
              
            // A few translations for standard tags if they exist, or just capital/arabic case
            if (prettyTitle.toLowerCase().includes('gemini generated image')) {
              prettyTitle = `صورة فنية من الكنيسة رقم ${idx + 1}`;
            }

            return {
              id: `dynamic-${idx}`,
              url: `/gallery/${file}`,
              title: prettyTitle,
              category: 'معرض الكنيسة'
            };
          });
          setGalleryImages(mappedItems);
        } else {
          setGalleryImages(FALLBACK_GALLERY_IMAGES);
        }
      })
      .catch((err) => {
        console.warn('Cannot fetch dynamic gallery, falling back:', err);
        setGalleryImages(FALLBACK_GALLERY_IMAGES);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const nextSlide = () => {
    if (galleryImages.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    if (galleryImages.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  useEffect(() => {
    if (isAutoPlaying && galleryImages.length > 1) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, currentIndex, galleryImages]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 lg:pb-0" dir="rtl">
      <div className="text-center space-y-4">
        <h1 className="arabic-serif text-4xl lg:text-5xl font-bold text-stone-900 italic">معرض الصور التفاعلي</h1>
        <p className="arabic-sans text-stone-500 max-w-xl mx-auto">
          جولة بصرية في رحاب كنيستنا.. استعرض جمال الفن القبطي وروحانية المكان من خلال هذا المعرض المتنقل.
        </p>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative h-[400px] md:h-[600px] w-full overflow-hidden rounded-[3rem] shadow-2xl bg-stone-100 group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                nextSlide();
              } else if (swipe > swipeConfidenceThreshold) {
                prevSlide();
              }
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          >
            {galleryImages.length > 0 && (
              <>
                <img 
                  src={galleryImages[currentIndex].url} 
                  alt={galleryImages[currentIndex].title}
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={handleImageError}
                />
                
                {/* Minimalist Floating Maximize Button */}
                <div className="absolute bottom-6 right-6 z-10">
                  <button 
                    onClick={() => setSelectedImage(galleryImages[currentIndex])}
                    className="flex items-center gap-2 px-5 py-2.5 bg-stone-900/60 hover:bg-stone-900/85 backdrop-blur-md border border-white/10 text-white rounded-full shadow-lg transition-all active:scale-95 text-xs font-bold arabic-sans"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    تكبير الصورة
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {galleryImages.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all z-20 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all z-20 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Progress Dots */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  idx === currentIndex ? 'w-8 bg-gold shadow-[0_0_15px_rgba(176,141,46,0.6)]' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Grid */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-5 md:grid-cols-9 gap-4 px-4 overflow-x-auto pb-4 scrollbar-hide">
          {galleryImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                idx === currentIndex ? 'border-amber-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 bg-stone-950/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-full flex flex-col items-center gap-6"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="max-h-[85vh] w-full object-contain rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
                onError={handleImageError}
              />
              <div className="text-center text-white space-y-2">
                <h2 className="arabic-serif text-3xl font-bold">{selectedImage.title}</h2>
                <span className="arabic-sans text-amber-400 text-sm font-bold">{selectedImage.category}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};