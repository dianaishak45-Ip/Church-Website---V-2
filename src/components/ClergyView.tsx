import { motion } from 'motion/react';
import React from 'react';
import { UserCheck, Calendar } from 'lucide-react';
import { CLERGY_DATA, type Priest } from '../constants/priests';

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
  const currentClergy = CLERGY.filter(p => p.status === 'حالي');
  const pastClergy = CLERGY.filter(p => p.status !== 'حالي');

  const PriestImage = ({ priest, icon: Icon }: { priest: Priest, icon: React.ElementType }) => {
    const [hasError, setHasError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    if (priest.image && !hasError) {
      return (
        <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-md mb-2 bg-stone-50 flex items-center justify-center relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-50 shimmer transition-opacity">
              <Icon className="w-10 h-10 text-stone-200" />
            </div>
          )}
          <motion.img 
            src={priest.image} 
            alt={priest.name} 
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    return (
      <div className="w-32 h-32 rounded-2xl bg-stone-100 flex items-center justify-center mb-2 border-4 border-white shadow-sm">
        <Icon className="w-10 h-10 text-stone-200" />
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentClergy.map((priest, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="custom-panel space-y-4 !mb-0 transition-transform flex flex-col items-center text-center"
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pastClergy.map((priest, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-[2rem] border transition-all space-y-4 flex flex-col items-center text-center ${
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
