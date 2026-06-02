import { motion } from 'motion/react';
import { MapPin, Phone, BookOpen, ChevronLeft, Train, Bus, Car, Info, MessageSquare } from 'lucide-react';
import { LiveStreamWidget } from './LiveStreamWidget';
import { AnnouncementSlider } from './AnnouncementSlider';
import heroImg from '../images/hero.jpg';
import { useSEO } from '../hooks/useSEO';

const churchInteriorImg = heroImg; // Using same hero for now as fallback or specific interior if exists

interface HomeViewProps {
  onTabChange?: (tab: string) => void;
  onOpenSuggestions?: () => void;
}

export default function HomeView({ onTabChange, onOpenSuggestions }: HomeViewProps) {
  useSEO({
    title: 'الرئيسية - كنيسة مارمرقس بشبرا',
    description: 'مرحباً بكم في كنيسة القديس مارمرقس الرسولي بشبرا. بيت الله المفتوح للجميع.',
    keywords: 'كنيسة, مارمرقس, شبرا, الكنيسة القبطية الأرثوذكسية, قراءات اليوم, بث مباشر',
  });

  return (
    <div className="space-y-12 pb-24 lg:pb-12 max-w-[1400px] mx-auto px-4">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[45vh] sm:h-[55vh] lg:h-[60vh] max-h-[550px] rounded-[1.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl bg-stone-900"
      >
        <img 
          src={heroImg} 
          alt="كنيسة مارمرقس بشبرا" 
          className="absolute inset-0 w-full h-full object-cover object-[center_65%]"
        />
  
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
  
        <div className="absolute inset-0 flex items-end p-6 sm:p-10 lg:p-16 z-10">
          <div className="space-y-4 w-full text-right">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="arabic-serif font-bold text-white leading-tight drop-shadow-2xl text-xl sm:text-2xl lg:text-4xl">
                 مرحباً بكم في كنيسة القديس مارمرقس الرسولي بشبرا
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="arabic-sans text-stone-200 font-medium opacity-90 text-sm sm:text-base lg:text-lg max-w-2xl ml-auto"
            >
               بيت الله المفتوح للجميع.. حيث تلتقي الأصالة بالروحانية في قلب حي شبرا العريق.
              </motion.p>
            </div>
          </div>
        </motion.section>

      {/* Daily Reading Mini-Widget */}
      <section className="custom-panel flex flex-col md:flex-row items-center gap-8 group">
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gold/10 text-gold rounded-3xl flex items-center justify-center shrink-0">
          <BookOpen className="w-8 h-8 lg:w-10 lg:h-10" />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-right">
          <h2 className="arabic-serif text-xl lg:text-2xl font-bold text-stone-800">قراءات اليوم الروحية</h2>
          <p className="arabic-sans text-stone-500 italic leading-relaxed text-sm lg:text-base">
            "كُلُّ شَيْءٍ مُسْتَطَاعٌ لِلْمُؤْمِني." - (مرقس ٩ : ٢٣)
          </p>
        </div>
        <button 
          onClick={() => onTabChange?.('readings')}
          className="px-6 py-3 lg:px-8 lg:py-4 bg-stone-900 text-white rounded-2xl font-bold arabic-sans flex items-center gap-2 hover:bg-gold transition-colors text-sm lg:text-base"
        >
          <span>عرض القراءات والسنكسار</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </section>

      {/* Announcements Section */}
      <section>
        <AnnouncementSlider />
      </section>

      {/* Live Stream Section */}
      <section className="custom-panel !p-6 lg:!p-10">
        <LiveStreamWidget />
      </section>



      {/* Mission Section */}
      <section className="bg-gold rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-14 text-white overflow-hidden relative shadow-xl">
        <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 lg:space-y-6">
            <h2 className="arabic-serif text-2xl lg:text-4xl font-bold">رسالتنا الكنسية</h2>
            <p className="arabic-sans text-base lg:text-lg opacity-90 leading-relaxed text-justify max-w-xl">
              تأسست كنيستنا لتكون منارة روحية تقدم تعاليم الإنجيل والتقاليد الكنسية للأجيال المتعاقبة. نحن نؤمن بأن الكنيسة هي جماعة المؤمنين التي تسعى للنمو الروحي وخدمة المجتمع المحيط بكل حب وتفانٍ.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="text-xs lg:text-sm">١٣ شارع الشيخ أحمد رافع، شريف، الساحل، القاهرة</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <Phone className="w-4 h-4 text-white/80" />
                <span className="text-xs lg:text-sm">0224316533</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative h-72 rounded-2xl overflow-hidden border-4 border-white/10 shadow-lg">
            <img 
              src={heroImg} 
              alt="Church Interior" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Suggestions and Contact CTA Section */}
      <section className="custom-panel !p-6 lg:!p-10 flex flex-col md:flex-row items-center gap-8 group border border-gold/20 rounded-[2.5rem] relative overflow-hidden bg-stone-50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-xl pointer-events-none" />
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gold/10 text-gold rounded-3xl flex items-center justify-center shrink-0">
          <MessageSquare className="w-8 h-8 lg:w-10 lg:h-10 animate-pulse" />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-right" dir="rtl">
          <h2 className="arabic-serif text-xl lg:text-2xl font-bold text-stone-900">صندوق الاقتراحات والتواصل السريع</h2>
          <p className="arabic-sans text-stone-500 text-sm leading-relaxed">
            مشاركتكم تهمّنا.. يسعدنا استقبال مقترحاتكم البنّاءة لتطوير خدمات الكنيسة والأنشطة المختلفة، أو إرسال طلب صلاة لرفع الأسماء بالقداس الإلهي.
          </p>
        </div>
        <button 
          onClick={onOpenSuggestions}
          className="px-6 py-3 lg:px-8 lg:py-4 bg-stone-900 text-white rounded-2xl font-bold arabic-sans flex items-center gap-2 hover:bg-gold transition-colors text-sm lg:text-base cursor-pointer shadow-md hover:shadow-lg whitespace-nowrap"
        >
          <span>أرسل اقتراحاً أو طلب صلاة</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </section>

      {/* Map Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1 text-right">
            <h2 className="arabic-serif text-2xl lg:text-3xl font-bold text-stone-900">موقعنا وكيفية الوصول</h2>
            <p className="arabic-sans text-stone-500 text-xs lg:text-sm">تشرفنا دائماً زيارتكم في أي وقت</p>
          </div>
          <div className="flex items-center gap-2 bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
            <Info className="w-4 h-4 text-stone-400" />
            <p className="arabic-sans text-[10px] text-stone-500" dir="rtl">
              ننصح باستعمال خرائط جوجل لسهولة الوصول.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Train, title: 'مترو الأنفاق', desc: 'محطة الخلفاوي', color: 'bg-blue-50 text-blue-600' },
            { icon: Bus, title: 'الحافلات', desc: 'أي حافلة تمر بشارع شبرا الرئيسي', color: 'bg-green-50 text-green-600' },
            { icon: Car, title: 'السيارات', desc: 'شارع الشيخ أحمد رافع، الساحل', color: 'bg-gold/10 text-gold' },
          ].map((item, idx) => (
            <div key={idx} className="custom-panel !p-4 flex items-center gap-4 !mb-0 group hover:border-gold/30 transition-colors">
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-right" dir="rtl">
                <h4 className="arabic-serif font-bold text-stone-800 text-sm">{item.title}</h4>
                <p className="arabic-sans text-[10px] text-stone-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full aspect-[21/9] min-h-[300px] sm:min-h-[400px] bg-stone-100 rounded-[2.5rem] overflow-hidden shadow-md border-4 border-white relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.336153724395!2d31.246416624536643!3d30.084534716654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f8ea9b3dc37%3A0xe54e5b62b339462c!2sSt.%20Mark%20Coptic%20Orthodox%20Church%2C%20Shubra!5e0!3m2!1sen!2seg!4v1713626000000!5m2!1sen!2seg" 
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Church Map Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
}