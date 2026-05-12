import { motion } from 'motion/react';
import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Phone, 
  MessageSquare,
  Activity,
  Baby,
  Stethoscope,
  Trees
} from 'lucide-react';

export default function ChurchServicesView() {
  const services = [
    {
      id: 'st-mark-hospital',
      icon: Activity,
      title: 'مستشفى القديس مرقس',
      subtitle: 'رعاية طبية متميزة',
      desc: 'مركز طبي متكامل يقدم خدمات صحية لجميع فئات المجتمع بأسعار مُخفّضة وبأحدث الأجهزة الطبية.',
      schedule: 'تعمل على مدار ٢٤ ساعة',
      color: 'bg-red-50 text-red-700',
      tag: 'طبي'
    },
    {
      id: 'kindergarten',
      icon: Baby,
      title: 'حضانة كنيسة مارمرقس',
      subtitle: 'تربية وتعليم',
      desc: 'بيئة تعليمية آمنة ومرحة لتطوير مهارات الأطفال واكتشاف مواهبهم في سن مبكرة.',
      schedule: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م',
      color: 'bg-blue-50 text-blue-700',
      tag: 'تعليم'
    },
    {
      id: 'dialysis-center',
      icon: Stethoscope,
      title: 'مركز الغسيل الكلوي',
      subtitle: 'خدمة تخصصية',
      desc: 'وحدة مجهزة بأحدث ماكينات الغسيل الكلوي لخدمة المرضى تحت إشراف نخبة من الأطباء.',
      schedule: 'يومياً حسب المواعيد المسجلة',
      color: 'bg-emerald-50 text-emerald-700',
      tag: 'طبي تخصصي'
    },
    {
      id: 'villa-oraby',
      icon: Trees,
      title: 'فيلا عرابي',
      subtitle: 'مؤتمرات ورحلات',
      desc: 'بيت للمؤتمرات والرحلات مجهز بالكامل لاستقبال المجموعات والخدمات الكنسية لقضاء أوقات روحية.',
      schedule: 'متاحة للحجز المسبق',
      color: 'bg-amber-50 text-amber-700',
      tag: 'خدمات خارجية'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 lg:pb-0">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-bold arabic-sans uppercase tracking-widest">
          خدمتكم شرف لنا
        </div>
        <h1 className="arabic-serif text-xl lg:text-5xl font-bold text-stone-900 leading-tight">خدماتنا المجتمعية</h1>
        <p className="arabic-sans text-stone-500 max-w-2xl mx-auto text-sm lg:text-lg leading-relaxed">
          تفتخر الكنيسة بتقديم مجموعة من الخدمات الطبية والتعليمية والترفيهية التي تهدف لخدمة الجميع بروح المحبة والعطاء.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 text-right" dir="rtl">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group custom-panel hover:shadow-xl hover:-translate-y-1 transition-all space-y-6 !mb-0"
          >
            <div className={`w-16 h-16 ${service.color.replace('amber', 'gold').replace('50', '10')} rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110`}>
              <service.icon className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-1 bg-gold/5 text-gold/60 rounded uppercase tracking-wider arabic-sans">
                  {service.tag}
                </span>
                <span className="text-stone-300 arabic-sans text-xs">{service.subtitle}</span>
              </div>
              <h3 className="arabic-serif text-lg lg:text-3xl font-bold text-stone-800">{service.title}</h3>
              <p className="arabic-sans text-stone-500 text-sm leading-relaxed min-h-[3rem]">
                {service.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-50 flex items-center gap-3 text-gold">
              <Clock className="w-4 h-4" />
              <span className="arabic-sans text-sm font-bold">{service.schedule}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Kindergarten Section */}
      <section className="bg-stone-900 rounded-[3rem] p-8 lg:p-16 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 lg:order-1 text-right" dir="rtl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold rounded-full text-[10px] font-bold arabic-sans">
                التربية والتعليم
              </div>
              <h2 className="arabic-serif text-2xl lg:text-5xl font-bold">حضانة مارمرقس النموذجية</h2>
              <p className="arabic-sans text-stone-400 leading-relaxed text-lg">
                نضع حجر الأساس لمستقبل أطفالكم من خلال برنامج تعليمي متكامل يعتمد على اللعب والابتكار في بيئة مسيحية آمنة.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'إشراف تربوي وطبي متخصص للأطفال.',
                'تنمية المهارات اللغوية والذهنية والجسدية.',
                'بيئة آمنة مجهزة بأحدث وسائل الترفيه والتعليم.',
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-gold mt-1 shrink-0" />
                  <p className="arabic-sans text-stone-300 text-sm">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 flex-1">
                <div className="w-10 h-10 bg-gold/20 text-gold rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 arabic-sans">رقم مكتب الحضانة</div>
                  <div className="text-lg font-bold arabic-sans">0224316533</div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] lg:aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1544365391-8299b70ad008?q=80&w=1000" 
                alt="Kindergarten" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
              <div className="absolute bottom-8 right-8 left-8 text-right">
                <p className="arabic-serif text-xl lg:text-2xl font-bold italic">"دَعُوا الأَوْلاَدَ يَأْتُونَ إِلَيَّ وَلاَ تَمْنَعُوهُمْ"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Footer */}
      <div className="custom-panel text-center space-y-8 !bg-gold/5 border-gold/10">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="arabic-serif text-3xl font-bold text-stone-900">هل لديك استفسار عن خدماتنا؟</h2>
          <p className="arabic-sans text-stone-600">
            يسعدنا دائماً تواصلكم معنا. نحن هنا لخدمتكم وتقديم الدعم اللازم لكافة الأنشطة والخدمات المجتمعية والطبية.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-10 py-4 bg-stone-900 text-white rounded-2xl font-bold arabic-sans hover:bg-gold transition-colors flex items-center gap-2 shadow-lg">
            <MessageSquare className="w-5 h-5" />
            <span>تواصل مع مكتب الخدمة</span>
          </button>
          <button className="px-10 py-4 bg-white text-stone-700 border border-gold/20 rounded-2xl font-bold arabic-sans hover:bg-gold/10 transition-colors shadow-sm">
            تفاصيل الحجوزات
          </button>
        </div>
      </div>
    </div>
  );
}
