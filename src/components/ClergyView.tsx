import { motion, AnimatePresence } from 'motion/react';
import React from 'react';
import { UserCheck, Calendar, X, Clock, AlertCircle, QrCode } from 'lucide-react';
import { CLERGY_DATA, type Priest } from '../constants/priests';
import { useSEO } from '../hooks/useSEO';
import { confessionList } from '../data/churchServicesData';

const CLERGY = CLERGY_DATA;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export default function ClergyView() {
  useSEO({
    title: 'الآباء الكهنة - كنيسة مارمرقس بشبرا',
    description: 'تعرف على الآباء الكهنة الحاليين والسابقين الذين خدموا بكنيسة الشهيد العظيم مارمرقس الرسولي بشبرا.',
    keywords: 'آباء הכنيسة, كهنة شبرا, كنيسة مارمرقس, آباء كنيسة مارمرقس بشبرا, إرشاد روحي',
  });

  const [selectedPriest, setSelectedPriest] = React.useState<Priest | null>(null);

  const getConfessionSchedule = (priestName: string) => {
    const normalize = (name: string) => {
      return name
        .replace(/أبونا|القمص|القس|الأنبا/g, '')
        .replace(/[أإآا]/g, 'ا')
        .replace(/[ىي]/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/چ/g, 'ج')
        .replace(/\u200f|\u200e/g, '') // remove invisible direction markers if any
        .replace(/\s+/g, '')
        .trim();
    };
    
    const normalizedPriest = normalize(priestName);
    
    return confessionList.find(c => {
      const normalizedFather = normalize(c.father);
      return normalizedPriest.includes(normalizedFather) || normalizedFather.includes(normalizedPriest);
    });
  };

  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date(2100, 0, 1); // Latest if no date
    const match = dateStr.match(/(\d+)\s+([^\s]+)\s+(\d+)/);
    if (!match) {
      const yearOnly = dateStr.match(/\d{4}/);
      return yearOnly ? new Date(parseInt(yearOnly[0]), 0, 1) : new Date(2100, 0, 1);
    }
    
    const day = parseInt(match[1]);
    const monthStr = match[2];
    const year = parseInt(match[3]);
    
    const months: { [key: string]: number } = {
      'يناير': 0, 'فبراير': 1, 'مارس': 2, 'إبريل': 3, 'مايو': 4, 'يونيو': 5,
      'يوليو': 6, 'أغسطس': 7, 'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11
    };
    
    return new Date(year, months[monthStr] ?? 0, day);
  };

  const currentClergy = CLERGY
    .filter(p => p.status === 'حالي')
    .sort((a, b) => parseDate(a.ordination).getTime() - parseDate(b.ordination).getTime());
  
  const pastClergy = CLERGY.filter(p => p.status !== 'حالي');

  const PriestImage = ({ priest, icon: Icon, size = "large" }: { priest: Priest, icon: React.ElementType, size?: "compact" | "large" }) => {
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      setHasError(false);
    }, [priest.image]);

    const getInitials = (name: string) => {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return parts[parts.length - 2][0] + parts[parts.length - 1][0];
      }
      return name[0];
    };

    const initials = getInitials(priest.name);

    const sizeClasses = size === "compact" 
      ? "w-24 h-24 md:w-28 md:h-28 border-2 shadow-sm mb-1" 
      : "w-32 h-32 md:w-40 md:h-40 border-4 shadow-md mb-2";

    const bubbleClasses = size === "compact"
      ? "w-12 h-12 md:w-14 md:h-14 mb-0.5"
      : "w-16 h-16 md:w-20 md:h-20 mb-1";

    const iconClasses = size === "compact"
      ? "w-6 h-6 md:w-7 md:h-7"
      : "w-8 h-8 md:w-10 md:h-10";

    const showFallback = !priest.image || hasError;

    return (
      <div className={`${sizeClasses} rounded-2xl border-white bg-stone-50 flex items-center justify-center relative mx-auto overflow-hidden group`}>
        {showFallback ? (
          <div className="absolute inset-0 bg-stone-50 flex flex-col items-center justify-center z-0 transition-opacity duration-300">
            <div className={`${bubbleClasses} rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform border border-stone-100 shadow-inner`}>
              <Icon className={`${iconClasses} text-stone-300`} />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter opacity-50">
              {initials}
            </span>
          </div>
        ) : (
          <img 
            src={priest.image} 
            alt={priest.name} 
            className="w-full h-full object-contain p-1 relative z-10 bg-white"
            onError={() => {
              setHasError(true);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 lg:pb-0 text-right" dir="rtl">
      <div className="text-center space-y-4">
        <h1 className="arabic-serif text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">الآباء الكهنة</h1>
        <p className="arabic-sans text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed">
          "رُعَاةٌ حَسَبَ قَلْبِي، فَيَرْعَوْنَكُمْ بِالْمَعْرِفَةِ وَالْفَهْمِ." - إرميا ٣ : ١٥
        </p>
      </div>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px bg-stone-200 flex-1" />
          <h2 className="arabic-serif text-2xl font-bold text-gold">الآباء الحاليون</h2>
          <div className="h-px bg-stone-200 flex-1" />
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6"
        >
          {currentClergy.map((priest, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPriest(priest)}
              className="bg-white border border-stone-150 p-4 rounded-[2rem] shadow-sm space-y-3 !mb-0 transition-all flex flex-col items-center text-center w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[280px] cursor-pointer hover:shadow-md hover:border-gold/30 active:scale-98 relative group"
            >
              <PriestImage priest={priest} icon={UserCheck} size="compact" />
              <div className="border-b border-stone-50 pb-2.5 w-full">
                <h3 className="arabic-serif text-lg font-bold text-stone-900 group-hover:text-gold transition-colors">{priest.name}</h3>
              </div>
              <div className="space-y-1.5 w-full flex-1 text-xs">
                <div className="flex justify-between items-center text-stone-500">
                  <span className="arabic-sans">تاريخ السيامة</span>
                  <span className="arabic-sans font-bold text-stone-700">{priest.ordination}</span>
                </div>
                {priest.promotion && (
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="arabic-sans">تاريخ القمصية</span>
                    <span className="arabic-sans font-bold text-gold">{priest.promotion}</span>
                  </div>
                )}
              </div>
              <div className="w-full pt-2.5 border-t border-stone-100 flex items-center justify-center gap-1 text-xs font-bold text-gold group-hover:text-amber-700 transition-colors mt-auto">
                <span className="arabic-sans">مواعيد الاعتراف والتفاصيل</span>
                <span className="text-[10px] transition-transform group-hover:translate-x-[-2px]">←</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
 
      <section className="space-y-8 p-8 lg:p-12 custom-panel !bg-stone-50/30">
        <div className="flex items-center gap-4">
          <div className="h-px bg-stone-200 flex-1" />
          <h2 className="arabic-serif text-2xl font-bold text-stone-500">آباء خدموا بالكنيسة</h2>
          <div className="h-px bg-stone-200 flex-1" />
        </div>
 
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6"
        >
          {pastClergy.map((priest, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPriest(priest)}
              className={`p-4 rounded-[2rem] border transition-all space-y-3 flex flex-col items-center text-center w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[280px] cursor-pointer hover:shadow-md hover:border-gold/30 active:scale-98 relative group ${
                priest.status === 'تنيح' 
                ? 'bg-gold/5 border-gold/10' 
                : 'bg-transparent border-stone-200/60'
              }`}
            >
              <PriestImage priest={priest} icon={Calendar} size="compact" />
              
              <div className="flex flex-col items-center border-b border-stone-50/50 pb-2 w-full">
                <div>
                  <h3 className="arabic-serif text-lg font-bold text-stone-900 group-hover:text-gold transition-colors">{priest.name}</h3>
                  <div className="flex justify-center gap-2 mt-1">
                    {priest.status === 'تنيح' && (
                      <span className="text-[10px] bg-stone-800 text-stone-100 px-2 py-0.5 rounded-full arabic-sans">تنيح</span>
                    )}
                    {priest.note && (
                      <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full arabic-sans">{priest.note}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 w-full flex-1 text-xs">
                {priest.ordination && (
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="arabic-sans">تاريخ السيامة</span>
                    <span className="arabic-sans font-bold text-stone-700">{priest.ordination}</span>
                  </div>
                )}
                {priest.promotion && (
                  <div className="flex justify-between items-center text-stone-500">
                    <span className="arabic-sans">تاريخ القمصية</span>
                    <span className="arabic-sans font-bold text-gold text-xs">{priest.promotion}</span>
                  </div>
                )}
              </div>
              <div className="w-full pt-2.5 border-t border-stone-100 flex items-center justify-center gap-1 text-xs font-bold text-stone-400 group-hover:text-stone-700 transition-colors mt-auto">
                <span className="arabic-sans">السيرة العطرة والتفاصيل</span>
                <span className="text-[10px] transition-transform group-hover:translate-x-[-2px]">←</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="bg-stone-900 rounded-[3rem] p-12 text-center space-y-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <h3 className="arabic-serif text-3xl font-bold">لطلب سر الاعتراف أو الإرشاد الروحي</h3>
        <p className="arabic-sans text-stone-400 max-w-xl mx-auto leading-relaxed">
          يمكنكم التواصل مع الآباء في المواعيد المعلنة بالكنيسة، أو الحضور لمقابلة الأب الكاهن المسؤول. جميع المحادثات والاعترافات سرية تماماً.
        </p>
      </div>

      <AnimatePresence>
        {selectedPriest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPriest(null)}
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] p-5 md:p-6 shadow-2xl border border-stone-200 overflow-y-auto max-h-[85vh] text-right z-10"
              dir="rtl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPriest(null)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors cursor-pointer z-20"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4 pt-1">
                {/* Priest Header */}
                <div className="text-center space-y-2.5">
                  <PriestImage priest={selectedPriest} icon={UserCheck} size="large" />
                  <div>
                    <h3 className="arabic-serif text-xl font-black text-stone-950">{selectedPriest.name}</h3>
                    {selectedPriest.title && (
                      <span className="text-[11px] bg-gold/10 text-amber-800 font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block arabic-sans">
                        {selectedPriest.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dates Information */}
                <div className={`grid ${selectedPriest.birthDate ? 'grid-cols-3 gap-1.5 md:gap-2' : 'grid-cols-2 gap-3'} p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs`}>
                  {selectedPriest.birthDate && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400 block arabic-sans">تاريخ الميلاد</span>
                      <span className="font-bold text-stone-750 block text-[10px] md:text-xs">{selectedPriest.birthDate}</span>
                    </div>
                  )}
                  <div className={`space-y-0.5 ${selectedPriest.birthDate ? 'border-r border-stone-200 pr-1.5 md:pr-2' : ''}`}>
                    <span className="text-[10px] text-stone-400 block arabic-sans">تاريخ السيامة</span>
                    <span className="font-bold text-stone-750 block text-[10px] md:text-xs">{selectedPriest.ordination || 'غير محدد'}</span>
                  </div>
                  {selectedPriest.promotion ? (
                    <div className={`space-y-0.5 ${selectedPriest.birthDate ? 'border-r border-stone-200 pr-1.5 md:pr-2' : 'border-r border-stone-200 pr-2'}`}>
                      <span className="text-[10px] text-stone-400 block arabic-sans">تاريخ القمصية</span>
                      <span className="font-bold text-gold block text-[10px] md:text-xs">{selectedPriest.promotion}</span>
                    </div>
                  ) : (
                    <div className={`space-y-0.5 ${selectedPriest.birthDate ? 'border-r border-stone-200 pr-1.5 md:pr-2' : 'border-r border-stone-200 pr-2'}`}>
                      <span className="text-[10px] text-stone-400 block arabic-sans">الرتبة الكنسية</span>
                      <span className="font-bold text-stone-750 block text-[10px] md:text-xs">قس</span>
                    </div>
                  )}
                </div>

                {/* Confessions Schedule (Current Priests Only) */}
                {selectedPriest.status === 'حالي' && (() => {
                  const scheduleItem = getConfessionSchedule(selectedPriest.name);
                  return (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                        <h4 className="arabic-serif text-base font-bold text-stone-900">مواعيد سر الاعتراف والإرشاد الروحي</h4>
                      </div>
                      
                      {scheduleItem ? (
                        <>
                          {scheduleItem.schedule && scheduleItem.schedule.length > 0 ? (
                            <div className="space-y-1.5">
                              {scheduleItem.schedule.map((slot, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex justify-between items-center p-2 rounded-lg border border-stone-150/80 bg-stone-50 text-stone-700 hover:bg-gold/[0.03] transition-colors"
                                >
                                  <span className="font-bold px-2 py-0.5 bg-amber-500/10 text-amber-950 border border-amber-200/30 rounded text-[10px]">
                                    {slot.day}
                                  </span>
                                  <span className="font-bold text-stone-900 text-xs" dir="rtl">
                                    {slot.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 bg-stone-50 text-stone-700 leading-relaxed italic flex items-start gap-1.5 border border-stone-100 rounded-lg text-xs">
                              <span className="text-gold text-xs mt-0.5 shrink-0 select-none">ℹ️</span>
                              <span className="font-semibold text-stone-800 leading-normal">
                                {scheduleItem.notes || 'الحجز الخاص بجلسته للاعترافات يتم بالتنسيق والكود (QR Code) أو سكرتارية الآباء.'}
                              </span>
                            </div>
                          )}

                          {/* Extra QR Reservation Note */}
                          {(scheduleItem.father.includes('بيشوي') || scheduleItem.father.includes('فيلوباتير')) && (
                            <div className="p-3 bg-amber-500/[0.04] border border-amber-500/10 rounded-xl text-amber-900 text-xs leading-relaxed flex items-center gap-2">
                              <div className="p-1 bg-gold/15 rounded-lg">
                                <QrCode className="w-4 h-4 text-amber-700 shrink-0" />
                              </div>
                              <span className="font-semibold arabic-sans">يتاح الحجز المسبق لجلسته عبر الأكواد (QR) لدى ممثلي لجنة الأمانة.</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-3 bg-stone-50 text-stone-600 italic rounded-lg border border-stone-100 text-xs leading-relaxed">
                          يرجى مراجعة سكرتارية الآباء لحجز وتنسيق موعد جلسة الاعتراف.
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Biography Highlights ( historical/deceased/past fathers ) */}
                {selectedPriest.summary && selectedPriest.summary.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                      <span className="text-base">📜</span>
                      <h4 className="arabic-serif text-base font-bold text-stone-900">سيرة حياة الأب الفاضل</h4>
                    </div>
                    <ul className="space-y-1.5">
                      {selectedPriest.summary.map((point, pIdx) => (
                        <li key={pIdx} className="text-xs text-stone-600 leading-relaxed pr-3.5 relative before:content-[''] before:absolute before:right-0 before:top-2 before:w-1 before:h-1 before:bg-gold before:rounded-full">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}