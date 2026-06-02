import { motion } from 'motion/react';
import React from 'react';
import { UserCheck, Calendar } from 'lucide-react';
import { CLERGY_DATA, type Priest } from '../constants/priests';
import { useSEO } from '../hooks/useSEO';

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

  const PriestImage = ({ priest, icon: Icon }: { priest: Priest, icon: React.ElementType }) => {
    const [hasError, setHasError] = React.useState(false);

    const getInitials = (name: string) => {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return parts[parts.length - 2][0] + parts[parts.length - 1][0];
      }
      return name[0];
    };

    if (priest.image && !hasError) {
      return (
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-md mb-2 bg-white flex items-center justify-center relative mx-auto">
          <img 
            src={priest.image} 
            alt={priest.name} 
            className="w-full h-full object-contain p-1"
            onError={() => {
              setHasError(true);
            }}
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-stone-50 flex flex-col items-center justify-center mb-2 border-4 border-white shadow-sm group mx-auto">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform border border-stone-100 shadow-inner">
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-stone-300" />
        </div>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter opacity-50">
          {getInitials(priest.name)}
        </span>
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
              className="custom-panel space-y-4 !mb-0 transition-transform flex flex-col items-center text-center w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm"
            >
              <PriestImage priest={priest} icon={UserCheck} />
              <div className="border-b border-stone-50 pb-4 w-full">
                <h3 className="arabic-serif text-xl font-bold text-stone-900">{priest.name}</h3>
              </div>
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-center text-sm">
                  <span className="arabic-sans text-stone-400">تاريخ السيامة</span>
                  <span className="arabic-sans font-bold text-stone-700">{priest.ordination}</span>
                </div>
                {priest.promotion && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="arabic-sans text-stone-400">تاريخ القمصية</span>
                    <span className="arabic-sans font-bold text-gold">{priest.promotion}</span>
                  </div>
                )}
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
              className={`p-6 rounded-[2rem] border transition-all space-y-4 flex flex-col items-center text-center w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm ${
                priest.status === 'تنيح' 
                ? 'bg-gold/5 border-gold/10 shadow-sm' 
                : 'bg-transparent border-stone-200/60'
              }`}
            >
              <PriestImage priest={priest} icon={Calendar} />
              
              <div className="flex flex-col items-center gap-4 border-b border-stone-50/50 pb-4 w-full">
                <div>
                  <h3 className="arabic-serif text-xl font-bold text-stone-900">{priest.name}</h3>
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
              <div className="space-y-2 w-full">
                {priest.ordination && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="arabic-sans text-stone-400">تاريخ السيامة</span>
                    <span className="arabic-sans font-bold text-stone-700">{priest.ordination}</span>
                  </div>
                )}
                {priest.promotion && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="arabic-sans text-stone-400">تاريخ القمصية</span>
                    <span className="arabic-sans font-bold text-gold text-xs">{priest.promotion}</span>
                  </div>
                )}
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
    </div>
  );
}