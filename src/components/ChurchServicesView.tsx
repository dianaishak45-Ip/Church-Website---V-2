import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  CheckCircle2, 
  Phone, 
  HeartHandshake,
  Flame,
  Music,
  GraduationCap,
  Calendar,
  Users,
  Search,
  User,
  MapPin,
  CalendarDays,
  QrCode,
  Building,
  Heart,
  ChevronRight,
  Filter,
  Check,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import SocietyServiceCard from './SocietyServiceCard';
import {
  TabType,
  SocietyService,
  SpiritualMeeting,
  ConfessionItem,
  societyServices,
  spiritualMeetings,
  confessionList,
  tasbehaSchedule,
  educationSchedule
} from '../data/churchServicesData';

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.031 0C5.39.002.016 5.378 0 12.019a11.967 11.967 0 0 0 1.6 5.992L0 24l6.155-1.613a11.942 11.942 0 0 0 5.867 1.543l.006.001c6.643 0 12.017-5.376 12.022-12.019A12.014 12.014 0 0 0 12.031 0zm6.544 17.02c-.275.772-1.579 1.488-2.228 1.558-.553.058-1.272.29-3.71-.722-3.116-1.294-5.12-4.46-5.275-4.665-.156-.206-1.25-1.666-1.25-3.181 0-1.516.793-2.26.108-2.585-.275-.083-.712-.132-.992-.132-.234 0-.585.088-.891.424-.311.341-1.185 1.163-1.185 2.836 0 1.674 1.216 3.292 1.383 3.518.167.227 2.394 3.659 5.8 5.132 2.831 1.226 3.504.981 4.175.918.67-.063 2.16-.883 2.463-1.737.303-.854.303-1.587.212-1.737-.091-.151-.341-.24-.712-.424zM12.03 21.796c-1.896-.001-3.754-.51-5.374-1.472l-.386-.23-3.664.961.978-3.57-.253-.404a9.756 9.756 0 0 1-1.5-5.26c.004-5.412 4.406-9.81 9.818-9.81 2.624 0 5.09 1.022 6.945 2.879 1.854 1.856 2.873 4.324 2.871 6.946-.008 5.414-4.412 9.814-9.824 9.814z"/>
  </svg>
);

const CrossIcon = ({ className = "w-5 h-5 text-gold" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="7" y1="10" x2="17" y2="10" />
    <line x1="9" y1="6" x2="15" y2="6" />
    <line x1="9.5" y1="17" x2="14.5" y2="15" />
  </svg>
);

export default function ChurchServicesView() {
  useSEO({
    title: 'أنشطة وخدمات الكنيسة - كنيسة مارمرقس بشبرا',
    description: 'تعرف بالتفصيل على الخدمات الروحية والمجتمعية، مواعيد التسبحة الكنسية السنوية والكيهكية، واجتماعات التربية الكنسية ومدارس الأحد بكنيسة مارمرقس بشبرا.',
    keywords: 'مستشفى مارمرقس بشبرا, مواعيد التسبحة, الخدمات الروحية, التربية الكنسية, مدارس الأحد, اعترافات الآباء الكهنة',
  });

  const [visibleSection, setVisibleSection] = useState<'society' | 'spiritual' | 'tasbeha' | 'confessions' | 'education'>('society');
  const [meetingSearch, setMeetingSearch] = useState('');
  
  const [educationDay, setEducationDay] = useState<'الجمعة' | 'الأحد'>('الجمعة');

  // List of sections and their details
  const sectionList = [
    { id: 'society' as const, label: 'الخدمات المجتمعية', icon: HeartHandshake, desc: 'الرعاية والطب والأنشطة الاجتماعية' },
    { id: 'spiritual' as const, label: 'الاجتماعات الأسبوعية', icon: Flame, desc: 'اجتماعات الصلاة والشباب ودراسة الكتاب' },
    { id: 'tasbeha' as const, label: 'مواعيد التسبحة الكنسية', icon: Music, desc: 'الصلوات والتسبيح الكنسي' },
    { id: 'confessions' as const, label: 'سر الاعتراف والإرشاد', icon: CheckCircle2, desc: 'مواعيد اعترافات الآباء الكهنة والأكواد' },
    { id: 'education' as const, label: 'التربية الكنسية ومدارس الأحد', icon: GraduationCap, desc: 'بناء عقيدة المخدومين والشباب' }
  ];

  const specialResorts = useMemo(() => {
    return societyServices.filter(s => s.id === 'san-mark-marsa' || s.id === 'obour-land');
  }, []);

  const generalSociety = useMemo(() => {
    return societyServices.filter(s => s.id !== 'san-mark-marsa' && s.id !== 'obour-land');
  }, []);

  // Handle tab selection with smooth scrolling to top of the content container
  const handleTabSelect = (id: 'society' | 'spiritual' | 'tasbeha' | 'confessions' | 'education') => {
    setVisibleSection(id);
    const container = document.getElementById('services-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offset = -110; // accounts for page header and sticky row
      window.scrollTo({
        top: rect.top + scrollTop + offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 text-right px-4" dir="rtl" id="church-services-root">
      
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-4xl mx-auto px-4" id="services-header">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 text-stone-900 rounded-full text-xs font-bold arabic-sans border border-gold/20 leading-none">
          خدمتكم بركة لنا ومحبة لقاء ✨
        </div>
        <h1 className="arabic-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-950 leading-tight">
          الخدمات الكنسية والأنشطة
        </h1>
        <p className="arabic-sans text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
          دليل متكامل يجمع شتى الخدمات الروحية والتعليمية والمجتمعية التي يسعد كنيسة القديس مارمرقس بشبرا بتقديمها برعاية ومباركة الآباء الكهنة.
        </p>
      </div>

      {/* MOBILE ONLY Sticky Anchor Jumping Row */}
      <div className="sticky top-0 z-30 lg:hidden w-full bg-white/95 backdrop-blur-md py-3 border-b border-stone-200/50 shadow-sm overflow-x-auto scrollbar-none rounded-2xl px-1">
        <div className="flex gap-2 min-w-max px-2" dir="rtl">
          {sectionList.map((sec) => {
            const isActive = visibleSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleTabSelect(sec.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 border-gold text-gold shadow-md'
                    : 'bg-white border-stone-150 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <sec.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="arabic-sans leading-none">{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Structural Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start" id="services-container">
        
        {/* DESKTOP BAR: Elegant Sticky Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4" dir="rtl" id="services-desktop-sidebar">
          <div className="bg-white border border-stone-150 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="arabic-serif font-black text-stone-900 text-base">دليل وتصنيف الخدمات</h3>
              <p className="arabic-sans text-[10px] text-stone-400 mt-1">اختر قسماً لعرض تفاصيل الخدمة</p>
            </div>
            
            <div className="space-y-2">
              {sectionList.map((sec) => {
                const isActive = visibleSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleTabSelect(sec.id)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-300 text-right group border ${
                      isActive
                        ? 'bg-stone-900 border-gold text-white shadow-md scale-[1.02]'
                        : 'bg-white border-transparent text-stone-800 hover:bg-stone-50 hover:border-stone-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive ? 'bg-gold text-stone-900' : 'bg-stone-100 text-stone-600 group-hover:scale-105 group-hover:bg-amber-500/10 group-hover:text-amber-800'
                    }`}>
                      <sec.icon className="w-5 h-5 animate-none" />
                    </div>
                    <div className="flex flex-col text-right leading-tight min-w-0">
                      <span className={`arabic-serif text-sm font-black truncate transition-colors ${isActive ? 'text-gold' : 'text-stone-950'}`}>
                        {sec.label}
                      </span>
                      <span className={`arabic-sans text-[10px] mt-1 transition-colors truncate ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
                        {sec.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CONTENT CHANNELS: Dynamic tab presentation */}
        <div className="lg:col-span-9 min-w-0" id="services-details-canvas">
          <AnimatePresence mode="wait">
            <motion.div
              key={visibleSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-8"
            >
              
              {/* ======================= SECTION 1: SERVICES (SOCIETY) ======================= */}
              {visibleSection === 'society' && (
                <section id="section-society" className="space-y-8">
                  <div className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-150 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-900 flex items-center justify-center">
                          <HeartHandshake className="w-5.5 h-5.5 text-gold" />
                        </div>
                        <h2 className="arabic-serif text-2xl md:text-3xl font-black text-stone-950">
                          الخدمات المجتمعية والاجتماعية
                        </h2>
                      </div>
                      <p className="arabic-sans text-stone-600 text-xs sm:text-sm max-w-xl leading-relaxed">
                        باقة من الخدمات الطبية والتنموية والرعوية وبيوت المؤتمرات ومصايف الكنيسة لدعم ورعاية شتى متطلبات الحياة والمصايف والشباب بالتنسيق المباشر.
                      </p>
                    </div>
                    <span className="bg-stone-900 text-gold font-bold font-sans text-xs px-3.5 py-1.5 rounded-full border border-gold/10 shrink-0">
                      {societyServices.length} خدمات مسجلة
                    </span>
                  </div>

                  {/* Categorized sub-services */}
                  <div className="space-y-12">
                    {/* Special retreats list */}
                    <div className="space-y-6" id="special-retreats-section">
                      <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                        <span className="text-xl">🏡</span>
                        <h3 className="arabic-serif text-lg md:text-xl font-black text-stone-900">
                          بيوت المؤتمرات والمصايف والرحلات الخارجية
                        </h3>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="special-retreats-grid">
                        {specialResorts.map((service) => (
                          <SocietyServiceCard key={service.id} service={service} />
                        ))}
                      </div>
                    </div>

                    {/* General societal list */}
                    <div className="space-y-6 pt-4" id="general-society-section">
                      <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
                        <span className="text-xl">🏥</span>
                        <h3 className="arabic-serif text-lg md:text-xl font-black text-stone-900">
                          الخدمات التنموية والطبية والتأهيلية
                        </h3>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="general-society-grid">
                        {generalSociety.map((service) => (
                          <SocietyServiceCard key={service.id} service={service} />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ======================= SECTION 2: SPIRITUAL SERVICES ======================= */}
              {visibleSection === 'spiritual' && (
                <section id="section-spiritual" className="space-y-8">
                  <div className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-150 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-900 flex items-center justify-center">
                          <Flame className="w-5.5 h-5.5 text-gold" />
                        </div>
                        <h2 className="arabic-serif text-2xl md:text-3xl font-black text-stone-950">
                          الاجتماعات الروحية الأسبوعية
                        </h2>
                      </div>
                      <p className="arabic-sans text-stone-600 text-xs sm:text-sm max-w-xl leading-relaxed">
                        جداول ومواعيد الاجتماعات الروحية ودراسة الكلمة المقدسة طوال الأسبوع ببركة صلوات الآباء الكهنة.
                      </p>
                    </div>
                    <span className="bg-stone-900 text-gold font-bold font-sans text-xs px-3.5 py-1.5 rounded-full border border-gold/10 shrink-0">
                      {spiritualMeetings.length} اجتماعات أسبوعية
                    </span>
                  </div>

                  <div className="space-y-6" id="spiritual-meetings-root">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {spiritualMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          id={`meeting-card-${meeting.id}`}
                          className="group bg-white hover:border-gold/40 hover:bg-stone-50/25 border-2 border-stone-150 rounded-[28px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm relative overflow-hidden text-right"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-gold to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                          <div className="space-y-3.5 text-right">
                            <div className="space-y-1">
                              <h4 className="arabic-serif text-xl font-black text-stone-950 group-hover:text-amber-800 transition-colors block leading-relaxed">
                                {meeting.title}
                              </h4>
                              <p className="arabic-sans text-xs text-stone-500 leading-relaxed max-w-md mt-1">{meeting.desc}</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-dashed border-stone-200">
                              <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-150">
                                <CalendarDays className="w-5 h-5 text-gold shrink-0" />
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] font-bold text-stone-400 arabic-sans leading-none mb-1">التوقيت</span>
                                  <span className="arabic-sans text-xs sm:text-sm font-bold text-stone-900">{meeting.schedule}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 bg-amber-500/[0.02] px-3.5 py-2.5 rounded-xl border border-amber-500/[0.06]">
                                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] font-bold text-stone-400 arabic-sans leading-none mb-1">المكان</span>
                                  <span className="arabic-sans text-xs sm:text-sm font-semibold text-stone-700 leading-normal">{meeting.location}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-150">
                                <User className="w-5 h-5 text-gold shrink-0" />
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] font-bold text-stone-400 arabic-sans leading-none mb-1">أمانة وإشراف الخدمة</span>
                                  <span className="arabic-sans text-xs sm:text-sm font-bold text-stone-900">{meeting.responsible}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ======================= SECTION 3: TASBEHA SCHEDULE ======================= */}
              {visibleSection === 'tasbeha' && (
                <section id="section-tasbeha" className="space-y-8">
                  <div className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-150 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-900 flex items-center justify-center">
                          <Music className="w-5.5 h-5.5 text-gold" />
                        </div>
                        <h2 className="arabic-serif text-2xl md:text-3xl font-black text-stone-950">
                          مواعيد التسبحة الكنسية السنوية
                        </h2>
                      </div>
                      <p className="arabic-sans text-stone-600 text-xs sm:text-sm max-w-xl leading-relaxed">
                        الحياة الطقسية الغنية بالتسبيح وروحانيات نصف الليل العطرة وأوقات رفع البخور العشية والمدائح المشتركة.
                      </p>
                    </div>
                    <span className="bg-stone-900 text-gold font-bold font-sans text-xs px-3.5 py-1.5 rounded-full border border-gold/10 shrink-0">
                      {tasbehaSchedule.length} مواعيد أسبوعية
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="tasbeha-schedule-grid">
                    {tasbehaSchedule.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white rounded-[24px] border border-stone-200/80 hover:border-gold/30 p-6 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group text-right"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500/80 via-gold/80 to-amber-600/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-3.5 border-b border-stone-100">
                            <div className="flex items-center gap-2 bg-stone-900 text-gold px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm arabic-serif shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              يوم {item.day}
                            </div>
                          </div>

                          <div className="space-y-2 pt-1 font-right">
                            <h4 className="arabic-serif text-sm sm:text-base font-black text-stone-900 leading-relaxed group-hover:text-amber-700 transition-colors duration-300">
                              {item.type}
                            </h4>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-dashed border-stone-150 space-y-3">
                          <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-100">
                            <Clock className="w-4 h-4 text-gold shrink-0" />
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] font-bold text-stone-400 arabic-sans leading-none mb-0.5">التوقيت</span>
                              <span className="arabic-sans text-xs sm:text-sm font-bold text-stone-900" dir="rtl">
                                {item.time}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/[0.02] rounded-xl border border-amber-500/[0.06]">
                            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                            <div className="flex flex-col text-right">
                              <span className="text-[9px] font-bold text-stone-400 arabic-sans leading-none mb-0.5">موقع ومذبح الصلاة</span>
                              <span className="text-xs font-bold text-stone-700 arabic-sans leading-tight">
                                {item.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ======================= SECTION 4: CONFESSIONS SCHEDULE ======================= */}
              {visibleSection === 'confessions' && (
                <section id="section-confessions" className="space-y-8">
                  <div className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-150 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-900 flex items-center justify-center">
                          <CheckCircle2 className="w-5.5 h-5.5 text-gold animate-none" />
                        </div>
                        <h2 className="arabic-serif text-2xl md:text-3xl font-black text-stone-950">
                          سر الاعتراف والإرشاد الروحي
                        </h2>
                      </div>
                      <p className="arabic-sans text-stone-600 text-xs sm:text-sm max-w-xl leading-relaxed">
                        مواعيد وساعات جلسات اعترافات الآباء الكهنة الأجلاء طوال الأسبوع، وحجز الأكواد مع لجنة الأمانة.
                      </p>
                    </div>
                    <span className="bg-stone-900 text-gold font-bold font-sans text-xs px-3.5 py-1.5 rounded-full border border-gold/10 shrink-0">
                      {confessionList.length} آباء كهنة
                    </span>
                  </div>

                  <div className="space-y-6" id="spiritual-confessions-root">
                    {/* Grid of Priest Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="confession-unified-grid" dir="rtl">
                      {confessionList.map((c, idx) => {
                        return (
                          <div 
                            key={idx} 
                            className="bg-gradient-to-br from-white to-stone-50/50 border-2 border-stone-150 hover:border-gold/45 hover:shadow-xl rounded-[32px] p-6 shadow-sm flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                          >
                            {/* Premium Top Line Accent on Hover */}
                            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-gold to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                            <div className="space-y-4">
                              {/* Priest Profile Header */}
                              <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border-2 border-gold/30 text-gold flex items-center justify-center shadow-md shrink-0 transition-all duration-700 group-hover:rotate-[360deg] group-hover:border-gold/60">
                                  <CrossIcon className="w-6 h-6 text-gold" />
                                </div>
                                <div className="text-right">
                                  <h4 className="arabic-serif text-lg sm:text-xl font-black text-stone-950 group-hover:text-amber-800 transition-colors duration-200 leading-normal">
                                    {c.father}
                                  </h4>
                                  <p className="text-[11px] sm:text-xs text-stone-500 font-bold arabic-sans mt-0.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block animate-pulse shrink-0" />
                                    كاهن كنيسة مارمرقس بشبرا
                                  </p>
                                </div>
                              </div>

                              {/* Priest Schedule or Notes */}
                              {c.schedule.length > 0 ? (
                                <div className="space-y-3 pt-4 border-t border-stone-150">
                                  <p className="text-sm sm:text-base text-stone-500 font-bold arabic-sans block mb-1">مواعيد جلسات الإرشاد والاعتراف:</p>
                                  {c.schedule.map((slot, sIdx) => {
                                    return (
                                      <div 
                                        key={sIdx} 
                                        className="flex justify-between items-center text-sm sm:text-base p-3.5 rounded-2xl border border-stone-150/80 bg-stone-50/40 text-stone-700 hover:bg-amber-500/[0.02] hover:border-gold/30 hover:shadow-2xs transition-all duration-200"
                                      >
                                        <span className="font-bold px-3.5 py-1.5 rounded-xl border border-amber-200/50 text-xs sm:text-sm whitespace-nowrap leading-none bg-amber-50/70 text-amber-950 shadow-3xs select-none">
                                          {slot.day}
                                        </span>
                                        <div className="flex items-center gap-2 pr-2" dir="rtl">
                                          <Clock className="w-5 h-5 text-amber-600/70 shrink-0" />
                                          <span className="font-bold text-stone-900 text-sm sm:text-base text-right leading-normal tracking-wide" dir="rtl">
                                            {slot.time}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="pt-4 border-t border-stone-150 text-sm sm:text-base text-stone-605 leading-relaxed italic flex items-star gap-2 bg-stone-50/20 p-3.5 rounded-2xl">
                                  <span className="text-gold text-sm mt-0.5 shrink-0 select-none">ℹ️</span>
                                  <span className="font-bold text-stone-750 leading-relaxed">{c.notes}</span>
                                </div>
                              )}
                            </div>

                            {/* Extra QR Reservation Note */}
                            {(c.father.includes('بيشوي') || c.father.includes('فيلوباتير')) && (
                              <div className="mt-5 p-3.5 bg-amber-500/[0.04] border border-amber-500/10 rounded-2xl text-amber-900 text-sm sm:text-base leading-relaxed flex items-center gap-2.5">
                                <div className="p-1.5 bg-gold/15 rounded-xl">
                                  <QrCode className="w-5 h-5 text-amber-700 shrink-0 animate-pulse" />
                                </div>
                                <span className="font-semibold arabic-sans">يتاح الحجز المسبق لجلسته عبر الأكواد (QR) لدى ممثلي لجنة الأمانة.</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* ======================= SECTION 5: EDUCATION / SUNDAY SCHOOL ======================= */}
              {visibleSection === 'education' && (
                <section id="section-education" className="space-y-8">
                  <div className="bg-gradient-to-br from-white to-stone-50/50 border border-stone-150 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-900 flex items-center justify-center">
                          <GraduationCap className="w-5.5 h-5.5 text-gold" />
                        </div>
                        <h2 className="arabic-serif text-2xl md:text-3xl font-black text-stone-950">
                          التربية الكنسية ومدارس الأحد
                        </h2>
                      </div>
                      <p className="arabic-sans text-stone-600 text-xs sm:text-sm max-w-xl leading-relaxed">
                        فصول الخدمة الكرازية، والتعليم واللاهوت الكنسي للنشء والشباب من حضانة لأولى ثانوي وحتى إعداد الخدام والخريجين.
                      </p>
                    </div>

                    <div className="bg-white border border-stone-200 p-1 rounded-2xl flex shadow-sm w-full md:w-auto shrink-0 select-none" id="education-day-switcher" dir="rtl">
                      <button
                        onClick={() => setEducationDay('الجمعة')}
                        className={`flex-1 md:flex-none px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer arabic-serif flex items-center justify-center gap-1.5 ${
                          educationDay === 'الجمعة'
                            ? 'bg-stone-900 text-gold shadow-sm'
                            : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>📅</span>
                        يوم الجمعة
                      </button>
                      <button
                        onClick={() => setEducationDay('الأحد')}
                        className={`flex-1 md:flex-none px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer arabic-serif flex items-center justify-center gap-1.5 ${
                          educationDay === 'الأحد'
                            ? 'bg-stone-900 text-gold shadow-sm'
                            : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>⛪</span>
                        يوم الأحد
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="education-cards-list">
                    {educationSchedule
                      .filter(item => item.day === educationDay)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-stone-200/80 hover:border-gold hover:bg-stone-50/20 rounded-[28px] p-6 sm:p-7 transition-all duration-300 shadow-sm flex flex-col justify-between gap-5 group text-right relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-gold to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                          <div className="space-y-3">
                            <h4 className="arabic-serif text-lg sm:text-xl font-black text-stone-950 group-hover:text-amber-800 transition-colors duration-250 leading-relaxed">
                              {item.target}
                            </h4>
                          </div>

                          <div className="space-y-3 pt-4 border-t border-dashed border-stone-200">
                            <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-150">
                              <Clock className="w-4.5 h-4.5 text-gold shrink-0" />
                              <div className="flex flex-col text-right">
                                <span className="text-[10px] font-bold text-stone-400 arabic-sans leading-none mb-1">التوقيت</span>
                                <span className="arabic-sans text-xs sm:text-sm font-bold text-stone-900">
                                  {item.time}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 bg-amber-500/[0.02] px-3.5 py-2.5 rounded-xl border border-amber-500/[0.06]">
                              <MapPin className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                              <div className="flex flex-col text-right">
                                <span className="text-[10px] font-bold text-stone-400 arabic-sans leading-none mb-1">الموقع</span>
                                <span className="arabic-sans text-xs sm:text-sm font-semibold text-stone-700 leading-normal">
                                  {item.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
