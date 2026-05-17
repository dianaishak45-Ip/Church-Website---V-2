import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { EVENTS } from '../data';

export default function EventsView() {
  const categories = {
    mass: { label: 'القداسات', color: 'bg-blue-100 text-blue-700' },
    activity: { label: 'الأنشطة', color: 'bg-green-100 text-green-700' },
    meeting: { label: 'الاجتماعات', color: 'bg-purple-100 text-purple-700' },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 lg:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-stone-200 pb-8">
        <div className="space-y-2 text-right">
          <h1 className="arabic-serif text-4xl font-bold text-stone-900">جدول المواعيد والخدمات</h1>
          <p className="arabic-sans text-stone-500">تابع مواعيد القداسات الإلهية والاجتماعات الأسبوعية للكنيسة.</p>
        </div>
        <div className="flex gap-2">
          {Object.entries(categories).map(([key, cat]) => (
            <span key={key} className={`px-4 py-1 rounded-full text-xs font-bold arabic-sans ${cat.color}`}>
              {cat.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
        {EVENTS.map((event, i) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group custom-panel lg:!p-6 !mb-0 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-1.5 h-full ${categories[event.category].color.split(' ')[0]}`} />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-xl bg-stone-50 text-stone-400 group-hover:bg-gold/10 group-hover:text-gold transition-colors`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md ${categories[event.category].color}`}>
                  {categories[event.category].label}
                </span>
              </div>
              
              <div className="space-y-1">
                <h3 className="arabic-serif text-xl font-bold text-stone-800">{event.title}</h3>
                <div className="flex items-center gap-2 text-stone-400 text-sm arabic-sans">
                  <Clock className="w-4 h-4" />
                  <span>{event.day} - {event.time}</span>
                </div>
              </div>

              {event.description && (
                <p className="arabic-sans text-stone-500 text-sm mt-4 border-t border-stone-50 pt-4">
                  {event.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-[11px] font-bold text-stone-300 pt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>مبنى الكنيسة الرئيسي</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span className="arabic-sans">{categories[event.category].label}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="custom-panel !bg-gold/5 border-gold/10 flex flex-col md:flex-row items-center gap-8 shadow-inner">
        <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center shrink-0">
          <Calendar className="w-10 h-10 text-gold" />
        </div>
        <div className="space-y-2 flex-1 text-right">
          <h3 className="arabic-serif text-2xl font-bold text-stone-800">ملاحظة هامة</h3>
          <p className="arabic-sans text-stone-600">
            يرجى التأكد من الحجز المسبق لبعض المناسبات الخاصة عبر مكتب السكرتارية. المواعيد المذكورة أعلاه هي المواعيد الثابتة طوال العام وقد تتغير في فترات الأعياد والصيام الكير.
          </p>
        </div>
      </section>
    </div>
  );
}
