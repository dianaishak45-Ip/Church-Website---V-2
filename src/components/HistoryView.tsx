import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, Award, Building2, Users, Star, ShieldCheck, X, Quote } from 'lucide-react';
import React, { useState } from 'react';
import { CLERGY_DATA, Priest } from '../constants/priests';
import { useSEO } from '../hooks/useSEO';

import heroImg from '../images/hero.jpg';
import logoImg from '../images/logo.png';

const PriestCard: React.FC<{ father: Priest, onSelect: (p: Priest) => void }> = ({ father, onSelect }) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[parts.length - 2][0] + parts[parts.length - 1][0];
    }
    return name[0];
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={() => onSelect(father)}
      className="custom-panel !p-6 !mb-0 text-center space-y-4 transition-all cursor-pointer group"
    >
      <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-md border-4 border-white bg-stone-50 flex items-center justify-center">
        {father.image && !hasError ? (
          <img 
            src={father.image}
            alt={father.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-all duration-500"
            onError={() => {
              setHasError(true);
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex flex-col items-center justify-center">
            <Users className="w-8 h-8 text-stone-300 mb-1" />
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter opacity-50">
              {getInitials(father.name)}
            </span>
          </div>
        )}
      </div>
      <h3 className="arabic-serif text-xl font-bold text-stone-800">{father.name}</h3>
      <div className="text-gold font-bold arabic-sans text-[10px] uppercase tracking-widest bg-gold/5 px-3 py-1 rounded-full inline-block">
        {father.title}
      </div>
      <p className="arabic-sans text-stone-500 text-xs leading-relaxed line-clamp-2">
        {father.summary?.[0] || 'سيرة عطرة ومسيرة حافلة بالعطاء في تاريخ الكنيسة.'}
      </p>
    </motion.div>
  );
};

export default function HistoryView() {
  useSEO({
    title: 'تاريخ الكنيسة - كنيسة مارمرقس بشبرا',
    description: 'تاريخ كنيسة الشهيد العظيم مارمرقس الرسولي بشبرا، من نشأتها بجمعية أصدقاء الكتاب المقدس وحتى اليوم.',
    keywords: 'تاريخ كنيسة مارمرقس, كنيسة شبرا, الكنيسة القبطية, جمعية أصدقاء الكتاب المقدس, كنائس شبرا',
  });

  const [selectedPriest, setSelectedPriest] = useState<Priest | null>(null);

  const milestones = [
    { year: '١٩٠٨', title: 'البذور الأولى', desc: 'تأسيس جمعية أصدقاء الكتاب المقدس التي كانت صاحبة الفضل في التفكير في إنشاء الكنيسة.' },
    { year: '١٩٥٠', title: 'شراء الأرض', desc: 'شراء قطعة الأرض الحالية بمساحة ١٥٠٠ متر مربع بحدائق شبرا.' },
    { year: '٢٤ مايو ١٩٥٣', title: 'حجر الأساس التاريخي', desc: 'وضع حجر الأساس بيد الرئيس محمد نجيب في يوم عيد العنصرة، وهي أول كنيسة يضع رئيس جمهورية حجر أساسها بنفسه.' },
    { year: '١٩٦٠', title: 'البناء الخرساني', desc: 'بدء تشييد الهيكل الخرساني الحالي للكنيسة.' },
    { year: '١٩٦٩', title: 'افتتاح الكنيسة العلوية', desc: 'إقامة أول قداس إلهي بالكنيسة العلوية في عيد الميلاد المجيد.' },
    { year: '٢٠١٤', title: 'مقر أسقفية شبرا', desc: 'اختيار الكنيسة لتكون مقراً لنيافة الحبر الجليل الأنبا أنجيلوس أسقف عام كنائس شبرا الشمالية.' },
  ];

  const mainFathers = CLERGY_DATA.slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto space-y-20 pb-24 lg:pb-0">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 text-gold rounded-full text-sm font-bold arabic-sans border border-gold/20">
          <Star className="w-4 h-4 fill-gold" />
          تراث روحي يمتد لأكثر من ٧٠ عاماً
        </div>
        <h1 className="arabic-serif text-xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-tight">تاريخ الكنيسة العريق</h1>
        <p className="arabic-sans text-stone-500 max-w-3xl mx-auto text-base leading-relaxed">
          حكاية إيمان بدأت بجمعية أصدقاء الكتاب المقدس واستمرت لتصبح شجرة مثمرة يستظل تحتها الكثيرون.
        </p>
      </motion.div>

      {/* Intro & History Centered */}
      <section className="space-y-12 max-w-4xl mx-auto text-center">
        <div className="space-y-8">
          <div className="inline-flex p-4 bg-gold text-white rounded-3xl shadow-xl shadow-gold/20 mx-auto" id="intro-icon">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="arabic-serif text-3xl lg:text-5xl font-bold text-stone-800">نشأة الكنيسة</h2>
          
          <div className="relative py-10 px-8 lg:px-16 bg-stone-50 rounded-[3rem] border border-stone-100 shadow-inner overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            
            <div className="relative space-y-8">
              <p className="arabic-sans text-stone-600 text-lg lg:text-2xl leading-relaxed italic font-medium">
                "إن يوم ٢٤ مايو ١٩٥٣ كان يوماً تاريخياً، لأنه اليوم الذي بدأت فيه أول نبتة لهذه الكنيسة..."
              </p>
              
              <div className="h-px w-24 bg-gold/30 mx-auto" />
              
              <ul className="space-y-6 arabic-sans text-stone-700 text-base lg:text-lg max-w-2xl mx-auto">
                <li className="flex items-start gap-3 justify-center text-right group">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <p>تأسست الكنيسة بجهود جمعية أصدقاء الكتاب المقدس (تأسست ١٩٠٨).</p>
                </li>
                <li className="flex items-start gap-3 justify-center text-right group">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <p>تميزت منذ بدايتها بمبدأ "مجانية الخدمة" ووضع الصناديق بدلاً من الأطباق.</p>
                </li>
                <li className="flex items-start gap-3 justify-center text-right group">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <p>زارها وباركها بابوات الكنيسة (البابا كيرلس السادس، البابا شنودة الثالث، والبابا تواضروس الثاني).</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative group max-w-3xl mx-auto">
          <div className="absolute inset-0 bg-gold/10 rounded-[2.5rem] rotate-2 group-hover:rotate-0 transition-all duration-500 opacity-20" />
          <div className="relative aspect-video bg-stone-100 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl" id="history-image-container">
            <img 
              src={heroImg} 
              alt="تاريخ الكنيسة" 
              className="w-full h-full object-cover transition-all group-hover:scale-105 duration-700"
            />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="space-y-12 custom-panel !p-10 lg:!p-16">
        <h2 className="arabic-serif text-3xl lg:text-4xl font-bold text-center text-stone-800">أبرز المحطات التاريخية</h2>
        <div className="relative">
          <div className="absolute top-0 right-1/2 bottom-0 w-px bg-stone-200 hidden md:block" />
          
          <div className="space-y-16">
            {milestones.map((ms, i) => (
              <motion.div 
                key={ms.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-10 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`flex-1 text-center ${i % 2 === 1 ? 'md:text-left' : 'md:text-right'} space-y-3`}>
                  <div className="arabic-sans inline-block px-3 py-0.5 bg-gold/10 text-gold rounded font-bold text-sm mb-2">
                    {ms.year}
                  </div>
                  <h3 className="arabic-serif text-2xl font-bold text-stone-800">{ms.title}</h3>
                  <p className="arabic-sans text-stone-500 text-lg leading-relaxed">{ms.desc}</p>
                </div>
                
                <div className="relative z-10 w-14 h-14 bg-white border-4 border-gold rounded-full flex items-center justify-center shrink-0 shadow-xl shadow-gold/20">
                  <div className="w-4 h-4 bg-gold rounded-full" />
                </div>
                
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spiritual Fathers */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="arabic-serif text-3xl lg:text-4xl font-bold text-stone-800">أعمدة الكنيسة الروحية</h2>
          <p className="arabic-sans text-stone-500 max-w-2xl mx-auto">قامات روحية تركت بصمة لا تُمحى في تاريخ الكنيسة وشعبها.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainFathers.map((father) => (
            <PriestCard key={father.name} father={father} onSelect={setSelectedPriest} />
          ))}
        </div>
      </section>

      {/* Priest Detail Modal */}
      <AnimatePresence>
        {selectedPriest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-stone-900/60"
            onClick={() => setSelectedPriest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full overflow-hidden relative max-h-[90vh] flex flex-col text-right"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPriest(null)}
                className="absolute top-6 left-6 p-2 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Header with Image */}
                <div className="bg-stone-50 p-8 pt-12 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-2xl rounded-full -mr-16 -mt-16" />
                  
                  {selectedPriest.image ? (
                    <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl relative z-10 bg-white">
                      <img 
                        src={selectedPriest.image} 
                        alt={selectedPriest.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-[2.5rem] bg-gradient-to-br from-stone-100 to-stone-200 border-8 border-white shadow-xl relative z-10 flex items-center justify-center">
                      <Users className="w-16 h-16 text-stone-300" />
                    </div>
                  )}

                  <div className="space-y-2 relative z-10">
                    <h2 className="arabic-serif text-3xl font-bold text-stone-900">{selectedPriest.name}</h2>
                    {selectedPriest.title && (
                      <div className="flex items-center justify-center gap-2 text-gold">
                        <Star className="w-4 h-4 fill-gold" />
                        <span className="arabic-serif text-xl font-medium">{selectedPriest.title}</span>
                        <Star className="w-4 h-4 fill-gold" />
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-3">
                      <span className="px-3 py-1 bg-gold/10 text-gold text-xs rounded-full arabic-sans font-bold">
                        {selectedPriest.status === 'تنيح' ? 'تنيح بسلام' : selectedPriest.status === 'حالي' ? 'خدمة حالية' : 'خدمة سابقة'}
                      </span>
                      <span className="w-1.5 h-1.5 bg-stone-300 rounded-full" />
                      <span className="arabic-sans text-stone-400 text-sm">مدرسة الآباء القديسين</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 space-y-10">
                  {/* Summary Points or Placeholder */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-gold mb-8">
                       <BookOpen className="w-6 h-6" />
                       <h4 className="arabic-serif text-xl font-bold">لمحات من حياته المباركة</h4>
                    </div>
                    
                    {selectedPriest.summary ? (
                      <ul className="space-y-6">
                        {selectedPriest.summary.map((point: string, idx: number) => (
                          <motion.li 
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex gap-4 group"
                          >
                            <div className="mt-2 w-2 h-2 bg-gold rounded-full shrink-0 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_8px_rgba(180,115,31,0.4)]" />
                            <p className="arabic-sans text-stone-600 leading-relaxed text-lg text-right w-full">
                              {point}
                            </p>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-12 text-center text-stone-400 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-100">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="arabic-sans">جاري العمل على توثيق السيرة الكاملة...</p>
                      </div>
                    )}
                  </div>

                  {/* Dates Footer */}
                  <div className="grid grid-cols-2 gap-4 py-8 border-t border-stone-100">
                    <div className="p-4 bg-stone-50 rounded-2xl space-y-1">
                      <p className="arabic-sans text-xs text-stone-400 uppercase tracking-wider">تاريخ السيامة</p>
                      <p className="arabic-serif text-lg font-bold text-stone-900">{selectedPriest.ordination}</p>
                    </div>
                    <div className="p-4 bg-gold/5 rounded-2xl space-y-1">
                      <p className="arabic-sans text-xs text-stone-400 uppercase tracking-wider">تاريخ القمصية</p>
                      <p className="arabic-serif text-lg font-bold text-gold">{selectedPriest.promotion}</p>
                    </div>
                  </div>

                  <div className="flex justify-center italic">
                    <Quote className="w-8 h-8 text-stone-100 absolute -bottom-4 right-8 transform -scale-x-100" />
                    <p className="arabic-serif text-stone-400 text-lg">"بَرَكَةُ الصِّدِّيقِ عَلَى الرَّأْسِ"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Treasures & Relics */}
      <section className="bg-gold rounded-[3rem] p-12 lg:p-16 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="space-y-8">
            <div className="inline-flex p-4 bg-white/20 rounded-3xl border border-white/20 mx-auto">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="arabic-serif text-3xl lg:text-5xl font-bold leading-tight">ذخائر الكنيسة المقدسة</h2>
            <p className="arabic-sans text-white/90 text-xl max-w-2xl mx-auto">
              تحتوي الكنيسة على ذخائر ثمينة تبارك كل من يطأ هذه العتبات المقدسة:
            </p>
            
            <div className="h-px w-24 bg-white/30 mx-auto" />

            <ul className="space-y-6 arabic-sans text-white text-lg lg:text-xl">
              <li className="flex items-center gap-4 justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1)] shrink-0" />
                <p>جزء من رفات القديس "مار مرقس الرسول" شفيع الكنيسة.</p>
              </li>
              <li className="flex items-center gap-4 justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1)] shrink-0" />
                <p>رفات كوكبة من الشهداء والقديسين (أكثر من مئة قديس).</p>
              </li>
              <li className="flex items-center gap-4 justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1)] shrink-0" />
                <p>قطعة غالية من خشبة صليب السيد المسيح وشوكة من إكليل الشوك.</p>
              </li>
              <li className="flex items-center gap-4 justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1)] shrink-0" />
                <p>بقع من دم المسيح ظهرت على تونية الشماس يوسف إسكندر (١٩٦٣).</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}