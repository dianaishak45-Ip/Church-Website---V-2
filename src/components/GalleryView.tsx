import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ChevronRight, ChevronLeft, Maximize2 } from 'lucide-react';

const GALLARY_IMAGES = [
  { id: '1', url: 'https://picsum.photos/seed/church1/1200/800', title: 'الباب الرئيسي', category: 'المبنى' },
  { id: '2', url: 'https://picsum.photos/seed/church2/800/1200', title: 'الأيقونة الأثرية', category: 'الفن القبطي' },
  { id: '3', url: 'https://picsum.photos/seed/church3/1200/1200', title: 'القبة الرئيسية', category: 'المبنى' },
  { id: '4', url: 'https://picsum.photos/seed/church4/1200/800', title: 'المذبح المقدس', category: 'الداخل' },
  { id: '5', url: 'https://picsum.photos/seed/church5/800/1200', title: 'خدمة التربية الكنسية', category: 'الأنشطة' },
  { id: '6', url: 'https://picsum.photos/seed/church6/1200/800', title: 'صلاة القداس', category: 'الروحانيات' },
  { id: '7', url: 'https://picsum.photos/seed/church7/800/1200', title: 'منارة الكنيسة', category: 'المبنى' },
  { id: '8', url: 'https://picsum.photos/seed/church8/1200/1200', title: 'كورال الكنيسة', category: 'الأنشطة' },
  { id: '9', url: 'https://picsum.photos/seed/church9/1200/800', title: 'الحدائق الخارجية', category: 'الخارج' },
];

export default function GalleryView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<typeof GALLARY_IMAGES[0] | null>(null);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % GALLARY_IMAGES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + GALLARY_IMAGES.length) % GALLARY_IMAGES.length);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, currentIndex]);

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
            <img 
              src={GALLARY_IMAGES[currentIndex].url} 
              alt={GALLARY_IMAGES[currentIndex].title}
              className="w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            
            {/* Image Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-900/20 flex flex-col justify-end p-8 md:p-16 text-right">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="text-gold font-bold arabic-sans text-sm tracking-widest uppercase">
                  {GALLARY_IMAGES[currentIndex].category}
                </div>
                <h2 className="arabic-serif text-3xl md:text-5xl font-bold text-white shadow-stone-900">
                  {GALLARY_IMAGES[currentIndex].title}
                </h2>
                <button 
                  onClick={() => setSelectedImage(GALLARY_IMAGES[currentIndex])}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-colors arabic-sans font-bold text-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                  تكبير الصورة
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
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

        {/* Progress Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {GALLARY_IMAGES.map((_, idx) => (
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
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-5 md:grid-cols-9 gap-4 px-4 overflow-x-auto pb-4 scrollbar-hide">
        {GALLARY_IMAGES.map((img, idx) => (
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
            <img src={img.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
          </button>
        ))}
      </div>

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
