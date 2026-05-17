import { motion } from 'motion/react';
import { MapPin, Navigation, Car, Train, Bus, Info } from 'lucide-react';

export default function LocationView() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 lg:pb-0">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold arabic-sans uppercase tracking-widest border border-gold/20">
          <MapPin className="w-3 h-3" />
          أهلاً بكم في بيتنا
        </div>
        <h1 className="arabic-serif text-4xl lg:text-5xl font-bold text-stone-900">موقع الكنيسة</h1>
        <p className="arabic-sans text-stone-500 max-w-xl mx-auto text-lg leading-relaxed">
          تقع الكنيسة في قلب حي شبرا العريق، ويسهل الوصول إليها بمختلف وسائل المواصلات.
        </p>
      </div>

      {/* Map and Info Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Directions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="custom-panel !p-8 space-y-8">
            <h2 className="arabic-serif text-2xl font-bold text-stone-800 flex items-center gap-3">
              <Navigation className="w-6 h-6 text-gold" />
              كيفية الوصول
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4 items-start translate-x-2">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Train className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="arabic-serif font-bold text-stone-800">مترو الأنفاق</h3>
                  <p className="arabic-sans text-sm text-stone-500 leading-relaxed">
                    الخط الثاني (شبرا الخيمة) - محطة سانت تريزا أو محطة روض الفرج.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start translate-x-2">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                  <Bus className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="arabic-serif font-bold text-stone-800">الحافلات</h3>
                  <p className="arabic-sans text-sm text-stone-500 leading-relaxed">
                    أي حافلة تمر بشارع شبرا الرئيسي أو شارع خلوصي.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start translate-x-2">
                <div className="w-10 h-10 bg-gold/10 text-gold rounded-xl flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="arabic-serif font-bold text-stone-800">السيارات الخاصة</h3>
                  <p className="arabic-sans text-sm text-stone-500 leading-relaxed">
                    يمكنك استخدام خدمة GPS للوصول لشارع الشيخ أحمد رافع المتفرع من منطقة الساحل.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-50">
              <div className="flex gap-3 bg-stone-50 p-4 rounded-2xl">
                <Info className="w-5 h-5 text-stone-400 shrink-0" />
                <p className="arabic-sans text-xs text-stone-500 leading-loose">
                  نظراً لتواجد الكنيسة في منطقة حيوية، ننصح باستخدام المواصلات العامة في أوقات الذروة لسهولة الحركة.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Map */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full aspect-video lg:aspect-auto lg:h-full bg-stone-100 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white relative"
          >
            {/* Embedded Google Map (Placeholder for St. Mark Shubra area) */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.336153724395!2d31.246416624536643!3d30.084534716654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f8ea9b3dc37%3A0xe54e5b62b339462c!2sSt.%20Mark%20Coptic%20Orthodox%20Church%2C%20Shubra!5e0!3m2!1sen!2seg!4v1713626000000!5m2!1sen!2seg" 
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Church Map Location"
            ></iframe>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
