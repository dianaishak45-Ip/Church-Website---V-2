import { motion } from 'motion/react';
import { Bell, Calendar, MapPin, Tag, ArrowLeft, Megaphone, Sparkles, Bus, PartyPopper } from 'lucide-react';

const ANNOUNCEMENTS = [
  {
    id: 'a1',
    category: 'feasts',
    title: 'عيد القيامة المجيد',
    date: '٢٠٢٤/٠٥/٠٥',
    description: 'نهنئ جميع أبناء الكنيسة بعيد القيامة المجيد. ستبدأ صلوات قداس العيد في تمام الساعة الثامنة مساءً.',
    tag: 'عيد سيدي',
    color: 'amber'
  },
  {
    id: 'a2',
    category: 'trips',
    title: 'رحلة إلى دير مارمينا بمريوط',
    date: '٢٠٢٤/٠٦/١٥',
    description: 'تعلن لجنة الرحلات عن تنظيم رحلة ليوم واحد إلى دير الشهيد العظيم مارمينا العجائبي وكنيسة القديسة دميانة.',
    tag: 'رحلة كنسية',
    color: 'blue'
  },
  {
    id: 'a3',
    category: 'events',
    title: 'نهضة صوم السيدة العذراء',
    date: '٢٠٢٤/٠٨/٠٧',
    description: 'تبدأ نهضة القديسة العذراء مريم بصلوات العشية يومياً، يليها كورال وكلمات روحية لآباء كهنة ومفكرين.',
    tag: 'نهضة روحية',
    color: 'purple'
  },
  {
    id: 'a4',
    category: 'general',
    title: 'بدء التسجيل في كورال الكنيسة',
    date: '٢٠٢٤/٠٤/٢٥',
    description: 'فتح باب الاختبارات للأصوات الجديدة للانضمام لكورال الكنيسة لجميع المراحل العمرية.',
    tag: 'خدمة الموهوبين',
    color: 'green'
  }
];

export default function AnnouncementsView() {
  const getIcon = (category: string) => {
    switch (category) {
      case 'feasts': return <Sparkles className="w-5 h-5" />;
      case 'trips': return <Bus className="w-5 h-5" />;
      case 'events': return <PartyPopper className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'amber': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'purple': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'green': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-stone-50 text-stone-700 border-stone-100';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 lg:pb-0" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-stone-200 pb-8 text-right">
        <div className="space-y-2">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-gold/10 text-gold rounded-2xl">
              <Megaphone className="w-8 h-8" />
            </div>
            <h1 className="arabic-serif text-4xl lg:text-5xl font-bold text-stone-900">لوحة الإعلانات</h1>
          </div>
          <p className="arabic-sans text-stone-500 text-lg">أحدث أخبار وتنبيهات الكنيسة والخدمات والرحلات القادمة.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6">
        {ANNOUNCEMENTS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative custom-panel flex flex-col md:flex-row gap-8 items-start !mb-0"
          >
            {/* Side Indicator */}
            <div className={`absolute top-0 right-0 bottom-0 w-2 ${getColorClass(item.color).split(' ')[0]}`} />

            <div className={`shrink-0 p-5 rounded-3xl ${getColorClass(item.color).replace('amber', 'gold').replace('50', '10')} flex items-center justify-center`}>
              {getIcon(item.category)}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold arabic-sans border ${getColorClass(item.color).replace('amber', 'gold').replace('50', '10')}`}>
                    {item.tag}
                  </span>
                  <div className="flex items-center gap-2 text-stone-400 text-sm arabic-sans">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              <h3 className="arabic-serif text-2xl lg:text-3xl font-bold text-stone-900 group-hover:text-gold transition-colors">
                {item.title}
              </h3>

              <p className="arabic-sans text-stone-600 leading-relaxed text-lg">
                {item.description}
              </p>

              <div className="pt-4 flex items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-xl hover:bg-gold transition-colors arabic-sans font-bold text-sm shadow-md">
                  <span>التفاصيل</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subscription/Contact CTA */}
      <div className="bg-stone-900 rounded-[3rem] p-12 text-center space-y-6 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -ml-32 -mt-32" />
        <h3 className="arabic-serif text-3xl font-bold">تواصل معنا لمزيد من التفاصيل</h3>
        <p className="arabic-sans text-stone-400 max-w-xl mx-auto leading-relaxed">
          يمكنكم متابعة صفحة الكنيسة الرسمية على مواقع التواصل الاجتماعي أو الاتصال بمكتب السكرتارية لمتابعة كل جديد.
        </p>
      </div>
    </div>
  );
}
