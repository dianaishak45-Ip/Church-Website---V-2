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
  MessageSquare,
  X
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

interface ChurchServicesViewProps {
  initialSection?: 'society' | 'spiritual' | 'tasbeha' | 'confessions' | 'education';
}

export default function ChurchServicesView({ initialSection }: ChurchServicesViewProps = {}) {
  useSEO({
    title: 'أنشطة وخدمات الكنيسة - كنيسة مارمرقس بشبرا',
    description: 'تعرف بالتفصيل على الخدمات الروحية والمجتمعية، مواعيد التسبحة الكنسية السنوية والكيهكية، واجتماعات التربية الكنسية ومدارس الأحد بكنيسة مارمرقس بشبرا.',
    keywords: 'مستشفى مارمرقس بشبرا, مواعيد التسبحة, الخدمات الروحية, التربية الكنسية, مدارس الأحد, اعترافات الآباء الكهنة',
  });

  const [visibleSection, setVisibleSection] = useState<'society' | 'spiritual' | 'tasbeha' | 'confessions' | 'education'>(initialSection || 'society');

  useEffect(() => {
    if (initialSection) {
      setVisibleSection(initialSection);
    }
  }, [initialSection]);
  const [selectedMeetingDay, setSelectedMeetingDay] = useState<string>('الكل');
  const [selectedConfessionPriest, setSelectedConfessionPriest] = useState<ConfessionItem | null>(null);
  const [societyTab, setSocietyTab] = useState<'resorts' | 'development'>('resorts');
  
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
    return societyServices.filter(s => s.id === 'san-mark-marsa' || s.id === 'obour-land' || s.id === 'ark-of-salvation');
  }, []);

  const generalSociety = useMemo(() => {
    return societyServices.filter(s => s.id !== 'san-mark-marsa' && s.id !== 'obour-land' && s.id !== 'ark-of-salvation');
  }, []);

  const filteredMeetings = useMemo(() => {
    if (selectedMeetingDay === 'الكل') return spiritualMeetings;
    return spiritualMeetings.filter(meeting => 
      meeting.schedule.includes(selectedMeetingDay)
    );
  }, [selectedMeetingDay]);

  // Handle tab selection with smooth scrolling to top of the content container
  const handleTabSelect = (id: 'society' | 'spiritual' | 'tasbeha' | 'confessions' | 'education') => {
    setVisibleSection(id);
    const container = document.getElementById('services-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const isMobile = window.innerWidth < 1024;
      const offset = isMobile ? -75 : -110; // offset based on header presence
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

      {/* MOBILE ONLY Sticky/Embedded Vertical Navigation - Extremely readable */}
      <div className="lg:hidden w-full bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm space-y-4" id="mobile-tabs-bar">
        <div className="border-b border-stone-100 pb-2.5">
          <h3 className="arabic-serif font-black text-stone-900 text-sm">أقسام الخدمات والأنشطة</h3>
          <p className="arabic-sans text-[10px] text-stone-400 mt-1">اختر القسم الذي تود تصفحه لتحديث التفاصيل بالأسفل:</p>
        </div>
        
        <div className="flex flex-col gap-2">
          {sectionList.map((sec) => {
            const isActive = visibleSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleTabSelect(sec.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 text-right group border text-xs font-bold leading-none ${
                  isActive
                    ? 'bg-stone-950 border-gold/40 text-gold shadow-xs'
                    : 'bg-stone-50/60 border-stone-150 text-stone-700 hover:bg-stone-100/50'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-gold/15 text-gold' : 'bg-white text-stone-500 border border-stone-200'
                  }`}>
                    <sec.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-right leading-tight max-w-[180px] sm:max-w-xs min-w-0">
                    <span className="arabic-serif text-xs sm:text-sm font-black truncate">{sec.label}</span>
                    <span className={`arabic-sans text-[9px] mt-1 font-medium truncate ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                      {sec.desc}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  ) : (
                    <span className="text-[10px] text-stone-300">←</span>
                  )}
                </div>
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
                  {/* Clean, Premium Side-by-side Segmented Controls */}
                  <div className="grid grid-cols-2 gap-2 w-full bg-stone-100/80 p-1.5 rounded-[1.25rem] border border-stone-200/60" id="society-sub-tabs" dir="rtl">
                    <button
                      onClick={() => setSocietyTab('resorts')}
                      className={`py-3.5 px-2 text-center rounded-xl text-[11px] sm:text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer select-none leading-snug ${
                        societyTab === 'resorts'
                          ? 'bg-stone-950 text-gold shadow-3xs'
                          : 'text-stone-600 hover:text-stone-905 hover:bg-white/50'
                      }`}
                    >
                      <span className="arabic-serif">بيوت المؤتمرات والمصايف والرحلات الخارجية</span>
                    </button>
                    <button
                      onClick={() => setSocietyTab('development')}
                      className={`py-3.5 px-2 text-center rounded-xl text-[11px] sm:text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer select-none leading-snug ${
                        societyTab === 'development'
                          ? 'bg-stone-950 text-gold shadow-3xs'
                          : 'text-stone-600 hover:text-stone-905 hover:bg-white/50'
                      }`}
                    >
                      <span className="arabic-serif">الخدمات التنموية والطبية والتأهيلية</span>
                    </button>
                  </div>

                  {/* Dynamic Slide-in Display of Active Tab */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={societyTab}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6 pt-4"
                    >
                      {societyTab === 'resorts' ? (
                        <div className="space-y-6" id="special-retreats-section">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="special-retreats-grid">
                            {specialResorts.map((service) => (
                              <SocietyServiceCard key={service.id} service={service} />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6" id="general-society-section">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="general-society-grid">
                            {generalSociety.map((service) => (
                              <SocietyServiceCard key={service.id} service={service} />
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </section>
              )}

              {/* ======================= SECTION 2: SPIRITUAL SERVICES ======================= */}
              {visibleSection === 'spiritual' && (
                <section id="section-spiritual" className="space-y-8">
                  <div className="space-y-6" id="spiritual-meetings-root">
                    {/* Week Days Filtration Bar */}
                    <div className="flex flex-col items-center gap-3 bg-stone-50 border border-stone-200/60 p-5 rounded-[2rem] shadow-3xs" id="spiritual-meetings-filter-bar" dir="rtl">
                      <div className="flex items-center gap-2 self-start mr-1 md:self-auto md:mr-0">
                        <Filter className="w-4 h-4 text-gold" />
                        <span className="arabic-serif text-sm font-black text-stone-900">تصفية الاجتماعات حسب اليوم:</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-1.5 w-full">
                        {([
                          { label: 'كافة الاجتماعات 📋', value: 'الكل' },
                          { label: 'السبت 📅', value: 'السبت' },
                          { label: 'الأحد 📅', value: 'الأحد' },
                          { label: 'الاثنين 📅', value: 'الاثنين' },
                          { label: 'الثلاثاء 📅', value: 'الثلاثاء' },
                          { label: 'الأربعاء 📅', value: 'الأربعاء' },
                          { label: 'الخميس 📅', value: 'الخميس' },
                          { label: 'الجمعة 📅', value: 'الجمعة' }
                        ] as const).map((day) => {
                          const isSelected = selectedMeetingDay === day.value;
                          return (
                            <button
                              key={day.value}
                              onClick={() => setSelectedMeetingDay(day.value)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-stone-950 border-gold/40 text-gold shadow-3xs'
                                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-100/50'
                              }`}
                            >
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {filteredMeetings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredMeetings.map((meeting) => (
                          <div
                            key={meeting.id}
                            id={`meeting-card-${meeting.id}`}
                            className="group bg-white hover:border-gold/45 hover:bg-stone-50/25 border-2 border-stone-150 rounded-[24px] p-5.5 flex flex-col justify-between transition-all duration-300 shadow-sm relative overflow-hidden text-right"
                          >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-gold to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                            <div className="space-y-2 text-right flex-1 flex flex-col justify-between">
                              <div>
                                {/* Compact Card Header: Title + Coordinator beside it */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1 mb-0">
                                  <h4 className="arabic-serif text-base sm:text-lg font-black text-stone-950 group-hover:text-amber-805 transition-colors block leading-relaxed">
                                    {meeting.title}
                                  </h4>
                                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-955 bg-amber-500/10 border border-amber-200/20 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5 w-fit self-start sm:self-auto arabic-sans leading-none">
                                    <User className="w-3.5 h-3.5 text-gold shrink-0" />
                                    <span>إشراف: {meeting.responsible}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Compact Row Grid for Schedule & Location (Replacing tall stacked list, back inline) */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 mt-2 border-t border-dashed border-stone-200">
                                <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-150 min-w-0">
                                  <CalendarDays className="w-4 h-4 text-gold shrink-0" />
                                  <div className="flex flex-col text-right min-w-0">
                                    <span className="text-[9px] font-bold text-stone-400 arabic-sans mb-1 select-none">التوقيت</span>
                                    <span className="arabic-sans text-[11px] sm:text-xs font-bold text-stone-900 whitespace-pre-line leading-relaxed" title={meeting.schedule}>{meeting.schedule}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 bg-amber-500/[0.01] px-3 py-2 rounded-xl border border-amber-500/[0.05] min-w-0">
                                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                                  <div className="flex flex-col text-right min-w-0">
                                    <span className="text-[9px] font-bold text-stone-400 arabic-sans mb-1 select-none">المكان</span>
                                    <span className="arabic-sans text-[11px] sm:text-xs font-semibold text-stone-700 whitespace-normal leading-relaxed" title={meeting.location}>{meeting.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 px-6 bg-stone-50 border border-stone-200/50 rounded-[2rem] space-y-3" id="no-filtered-meetings">
                        <span className="text-4xl block">📆</span>
                        <h4 className="arabic-serif text-lg font-bold text-stone-800">لا توجد اجتماعات مبرمجة في هذا اليوم</h4>
                        <p className="arabic-sans text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                          يرجى اختيار يوم آخر من قائمة الأيام بالأعلى لتصفح الجداول المتاحة بسهولة.
                        </p>
                        <button
                          onClick={() => setSelectedMeetingDay('الكل')}
                          className="px-4 py-2 mt-2 bg-stone-900 text-gold rounded-xl text-xs font-bold border border-gold/10 hover:bg-stone-800 transition-colors cursor-pointer"
                        >
                          عرض كافة الاجتماعات الكنسية
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* ======================= SECTION 3: TASBEHA SCHEDULE ======================= */}
              {visibleSection === 'tasbeha' && (
                <section id="section-tasbeha" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="tasbeha-schedule-grid">
                    {tasbehaSchedule.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-gradient-to-br from-white to-stone-50/40 rounded-[2rem] border-2 border-stone-150 hover:border-gold/45 hover:shadow-lg hover:bg-white transition-all duration-300 flex flex-col justify-between relative group text-right p-6 sm:p-7 overflow-hidden"
                      >
                        {/* Premium Dynamic Top Gradient Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-gold to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                        <div className="space-y-4">
                          {/* Top row with day badge */}
                          <div className="flex items-center justify-between pb-3 border-b border-dashed border-stone-200/80">
                            <div className="flex items-center gap-2 bg-stone-950 text-gold px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm arabic-serif shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping inline-block" />
                              <span>يوم {item.day}</span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-1">
                            <h4 className="arabic-serif text-base sm:text-lg font-black text-stone-950 leading-relaxed group-hover:text-amber-850 transition-colors duration-300 min-h-[44px] flex items-center">
                              {item.type}
                            </h4>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-solid border-stone-100 space-y-3">
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
                  <div className="space-y-6" id="spiritual-confessions-root">
                    {/* Grid of Priest Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="confession-unified-grid" dir="rtl">
                      {confessionList.map((c, idx) => {
                        const hasSchedule = c.schedule.length > 0;
                        return (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedConfessionPriest(c)}
                            className="bg-gradient-to-br from-white to-stone-50/50 border-2 border-stone-150 hover:border-gold/45 hover:shadow-xl rounded-[32px] p-6 shadow-sm flex flex-col justify-between transition-all duration-300 relative group overflow-hidden cursor-pointer active:scale-98"
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
                                  <h4 className="arabic-serif text-lg sm:text-xl font-black text-stone-950 group-hover:text-amber-805 transition-colors duration-200 leading-normal">
                                    {c.father}
                                  </h4>
                                  <p className="text-[11px] sm:text-xs text-stone-500 font-bold arabic-sans mt-0.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block animate-pulse shrink-0" />
                                    كاهن كنيسة مارمرقس بشبرا
                                  </p>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-stone-150/50 text-right">
                                {hasSchedule ? (
                                  <div className="text-xs font-semibold text-stone-605 flex items-center gap-1.5 arabic-sans">
                                    <Clock className="w-4 h-4 text-amber-600/70 shrink-0" />
                                    <span>يتوفر مواعيد ثابتة للجلوس والاعتراف أسبوعياً</span>
                                  </div>
                                ) : (
                                  <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 arabic-sans">
                                    <QrCode className="w-4 h-4 text-amber-700 shrink-0" />
                                    <span>الحجز عبر تفعيل نظام الكود (QR) بالتنسيق المباشر</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-5 w-full py-3 bg-stone-900 text-gold rounded-2xl flex items-center justify-center gap-2 text-xs font-bold font-sans border border-gold/10 group-hover:bg-amber-900 group-hover:text-white transition-colors">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span className="arabic-sans">عرض جدول المواعيد</span>
                            </div>
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
                  {/* Clean, Premium Side-by-side Segmented Controls */}
                  <div className="grid grid-cols-2 gap-2 w-full max-w-sm mx-auto bg-stone-100/80 p-1.5 rounded-[1.25rem] border border-stone-200/60 select-none" id="education-day-switcher" dir="rtl">
                    <button
                      onClick={() => setEducationDay('الجمعة')}
                      className={`py-3.5 px-2 text-center rounded-xl text-xs sm:text-sm font-bold transition-all duration-250 cursor-pointer select-none leading-snug ${
                        educationDay === 'الجمعة'
                          ? 'bg-stone-950 text-gold shadow-3xs'
                          : 'text-stone-600 hover:text-stone-905 hover:bg-white/50'
                      }`}
                    >
                      <span className="arabic-serif">يوم الجمعة</span>
                    </button>
                    <button
                      onClick={() => setEducationDay('الأحد')}
                      className={`py-3.5 px-2 text-center rounded-xl text-xs sm:text-sm font-bold transition-all duration-250 cursor-pointer select-none leading-snug ${
                        educationDay === 'الأحد'
                          ? 'bg-stone-950 text-gold shadow-3xs'
                          : 'text-stone-600 hover:text-stone-905 hover:bg-white/50'
                      }`}
                    >
                      <span className="arabic-serif">يوم الأحد</span>
                    </button>
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

      <AnimatePresence>
        {selectedConfessionPriest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedConfessionPriest(null)}
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-stone-200 overflow-y-auto max-h-[85vh] text-right z-10"
              dir="rtl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedConfessionPriest(null)}
                className="absolute top-6 left-6 p-2 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors cursor-pointer z-20"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6 pt-2">
                {/* Priest Profile Header */}
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-stone-900 border-2 border-gold/30 text-gold flex items-center justify-center shadow-md mx-auto">
                    <CrossIcon className="w-8 h-8 text-gold" />
                  </div>
                  <div>
                    <h3 className="arabic-serif text-2xl font-black text-stone-950">{selectedConfessionPriest.father}</h3>
                    <p className="text-xs text-stone-500 font-bold arabic-sans mt-1">كاهن كنيسة مارمرقس بشبرا</p>
                  </div>
                </div>

                {/* Priest Schedule or Notes */}
                {selectedConfessionPriest.schedule.length > 0 ? (
                  <div className="space-y-3 pt-4 border-t border-stone-150">
                    <p className="text-sm text-stone-505 font-bold arabic-sans block mb-1">مواعيد جلسات الإرشاد والاعتراف:</p>
                    <div className="space-y-2">
                      {selectedConfessionPriest.schedule.map((slot, sIdx) => (
                        <div 
                          key={sIdx} 
                          className="flex justify-between items-center p-3.5 rounded-2xl border border-stone-150 bg-stone-50 text-stone-700 hover:bg-gold/[0.03] transition-colors"
                        >
                          <span className="font-bold px-3 py-1 bg-amber-500/10 text-amber-950 border border-amber-200/30 rounded-lg text-xs">
                            {slot.day}
                          </span>
                          <span className="font-bold text-stone-900 text-sm" dir="rtl">
                            {slot.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-stone-150 text-sm text-stone-700 leading-relaxed italic flex items-start gap-2 bg-stone-50 p-4 rounded-2xl">
                    <span className="text-gold text-sm mt-0.5 shrink-0 select-none">ℹ️</span>
                    <span className="font-bold text-stone-800 leading-normal">{selectedConfessionPriest.notes}</span>
                  </div>
                )}

                {/* Extra QR Reservation Note */}
                {(selectedConfessionPriest.father.includes('بيشوي') || selectedConfessionPriest.father.includes('فيلوباتير')) && (
                  <div className="p-4 bg-amber-500/[0.04] border border-amber-500/10 rounded-2xl text-amber-900 text-sm leading-relaxed flex items-center gap-2.5 space-x-2">
                    <div className="p-1.5 bg-gold/15 rounded-xl ml-2">
                      <QrCode className="w-5 h-5 text-amber-700 shrink-0 animate-pulse" />
                    </div>
                    <span className="font-semibold arabic-sans">يتاح الحجز المسبق لجلسته عبر الأكواد (QR) لدى ممثلي لجنة الأمانة.</span>
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
