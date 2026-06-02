import { useState, useMemo } from 'react';
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

export default function ChurchServicesView() {
  useSEO({
    title: 'أنشطة وخدمات الكنيسة - كنيسة مارمرقس بشبرا',
    description: 'تعرف بالتفصيل على الخدمات الروحية والمجتمعية، مواعيد التسبحة الكنسية السنوية والكيهكية، واجتماعات التربية الكنسية ومدارس الأحد بكنيسة مارمرقس بشبرا.',
    keywords: 'مستشفى مارمرقس بشبرا, مواعيد التسبحة, الخدمات الروحية, التربية الكنسية, مدارس الأحد, اعترافات الآباء الكهنة',
  });

  const [activeTab, setActiveTab] = useState<TabType>('society');
  const [meetingSearch, setMeetingSearch] = useState('');
  const [confessionTab, setConfessionTab] = useState<'days' | 'fathers'>('days');
  const [selectedConfessionDay, setSelectedConfessionDay] = useState<string>('الجمعة');
  const [selectedConfessionFather, setSelectedConfessionFather] = useState<string>('all');
  
  // New upgraded states
  const [spiritualSubTab, setSpiritualSubTab] = useState<'confessions' | 'meetings'>('confessions');
  const [educationDay, setEducationDay] = useState<'الجمعة' | 'الأحد'>('الجمعة');

  // Extracted navigation tabs with exact details
  const tabsList = [
    { id: 'society' as TabType, label: 'الخدمات المجتمعية', icon: HeartHandshake, desc: 'الرعاية الطبية والمصايف والخلوات والمساعدات' },
    { id: 'spiritual' as TabType, label: 'الخدمات الروحية الأسبوعية', icon: Flame, desc: 'الاجتماعات، والقداسات، وسر الاعتراف والتوجيه' },
    { id: 'tasbeha' as TabType, label: 'مواعيد التسبحة الكنسية', icon: Music, desc: 'التسبحة السنوية والأسبوعية ونصف الليل العطرة' },
    { id: 'education' as TabType, label: 'التربية الكنسية ومدارس الأحد', icon: GraduationCap, desc: 'منهجية التعليم اللاهوتي وبناء عقيدة النشء والشباب' }
  ];

  // Filters for Spiritual meetings
  const filteredMeetings = useMemo(() => {
    if (!meetingSearch.trim()) return spiritualMeetings;
    return spiritualMeetings.filter(m => 
      m.title.includes(meetingSearch) || 
      m.desc.includes(meetingSearch) || 
      m.responsible.includes(meetingSearch) ||
      m.location.includes(meetingSearch)
    );
  }, [meetingSearch]);

  // Father confessors mapped by day
  const confessionsByDay = useMemo(() => {
    const list: { father: string; time: string; location?: string }[] = [];
    confessionList.forEach(c => {
      c.schedule.forEach(s => {
        if (s.day === selectedConfessionDay) {
          list.push({
            father: c.father,
            time: s.time,
            location: s.location || 'مزار أو مقر الكنيسة'
          });
        }
      });
    });
    return list;
  }, [selectedConfessionDay]);

  // Separated classifications of social services (Marsa Matruh and Dream Land vs others)
  const specialResorts = useMemo(() => {
    return societyServices.filter(s => s.id === 'san-mark-marsa' || s.id === 'obour-land');
  }, []);

  const generalSociety = useMemo(() => {
    return societyServices.filter(s => s.id !== 'san-mark-marsa' && s.id !== 'obour-land');
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 text-right" dir="rtl" id="church-services-root">
      
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-4xl mx-auto px-4" id="services-header">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 text-stone-900 rounded-full text-xs font-bold arabic-sans border border-gold/20 leading-none">
          خدمتكم بركة لنا ومحبة لقاء ✨
        </div>
        <h1 className="arabic-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-950 leading-tight">
          الخدمات الكنسية والأنشطة
        </h1>
        <p className="arabic-sans text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
          تفتخر كنيسة القديس مارمرقس الرسولي العريقة بشبرا بتوفير وبث خدمات روحية واجتماعية شاملة ترعى الروح وتبني الجسد وتساند أبناء وبنات الكنيسة ببركة صلوات الآباء الأجلاء.
        </p>
      </div>

      {/* Universal Horizontally Aligned 4 Tabs Navigation Hub */}
      <div className="w-full px-2 sm:px-4 space-y-8" id="services-container">
        
        {/* PREMIUM HORIZONTAL TABS HUB (Unified desktop & mobile on one seamless line) */}
        <div className="w-full overflow-x-auto scrollbar-none pb-1" id="services-navigation-hub" dir="rtl">
          <div className="flex md:grid md:grid-cols-4 gap-4 pb-2 md:pb-0 min-w-[900px] md:min-w-0" dir="rtl">
            {tabsList.map((tab) => {
              const isActive = activeTab === tab.id;
              let badgeCount = '';
              if (tab.id === 'society') badgeCount = `${societyServices.length} خدمات`;
              if (tab.id === 'spiritual') badgeCount = `${spiritualMeetings.length} لقاءات`;
              if (tab.id === 'tasbeha') badgeCount = `${tasbehaSchedule.length} مواعيد`;
              if (tab.id === 'education') badgeCount = `${educationSchedule.length} مراحل`;

              return (
                <button
                  key={tab.id}
                  id={`tab-button-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center p-5 rounded-[24px] border-2 transition-all duration-300 relative overflow-hidden group cursor-pointer w-full text-right ${
                    isActive
                      ? 'bg-stone-900 border-gold shadow-lg text-white'
                      : 'bg-white border-stone-150 text-stone-850 hover:bg-stone-50/70 hover:border-stone-300 shadow-sm'
                  }`}
                >
                  {/* Glowing background hint on hover/active */}
                  <div className={`absolute top-0 left-0 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 ${
                    isActive ? 'bg-gold/15 opacity-100' : 'bg-gold/5 opacity-0 group-hover:opacity-100'
                  }`} />

                  {/* Icon and Text side-by-side on a single row */}
                  <div className="flex items-center gap-4 w-full justify-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'bg-gold text-stone-900' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <tab.icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col text-right">
                      <span className={`arabic-serif text-lg sm:text-xl font-black transition-colors leading-tight ${
                        isActive ? 'text-gold' : 'text-stone-950'
                      }`}>
                        {tab.label}
                      </span>
                      <span className="arabic-sans text-[11px] text-stone-400 font-bold leading-normal mt-0.5">
                        {badgeCount}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Massive Details Canvas (Occupying full screen width with magnificent spacing) */}
        <div className="w-full min-w-0" id="services-details-canvas">
          <AnimatePresence mode="wait">
            
            {/* ======================= TAB 1: SERVICES (SOCIETY) ======================= */}
            {activeTab === 'society' && (
              <motion.div
                key="society-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-right"
                id="pane-society-services"
              >
                {/* Categorized and Segmented Social Services (Marsa Matrouh & Dream Land isolated) */}
                <div className="space-y-12">
                  {/* Classification 1: بيوت المؤتمرات والمصايف والرحلات الخارجية */}
                  <div className="space-y-6" id="special-retreats-section">
                    <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
                      <span className="text-2xl">🏡</span>
                      <h3 className="arabic-serif text-xl sm:text-2xl font-black text-stone-950">
                        بيوت المؤتمرات والمصايف والرحلات الخارجية
                      </h3>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="special-retreats-grid">
                      {specialResorts.map((service) => (
                        <SocietyServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  </div>

                  {/* Classification 2: الخدمات التنموية */}
                  <div className="space-y-6 pt-4" id="general-society-section">
                    <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
                      <span className="text-2xl">🏥</span>
                      <h3 className="arabic-serif text-xl sm:text-2xl font-black text-stone-950">
                        الخدمات التنموية
                      </h3>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="general-society-grid">
                      {generalSociety.map((service) => (
                        <SocietyServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================= TAB 2: SPIRITUAL SERVICES ======================= */}
            {activeTab === 'spiritual' && (
              <motion.div
                key="spiritual-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-right"
                id="pane-spiritual-services"
              >
                {/* Custom Split Segmented Switcher */}
                <div className="bg-white border border-stone-150 p-1.5 rounded-2xl flex shadow-sm w-full" id="spiritual-segment-controller">
                  <button
                    onClick={() => setSpiritualSubTab('confessions')}
                    className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all cursor-pointer arabic-sans ${
                      spiritualSubTab === 'confessions'
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    ☦️ سر الاعتراف المقدس وجدول الآباء
                  </button>
                  <button
                    onClick={() => setSpiritualSubTab('meetings')}
                    className={`flex-1 py-3 text-center text-xs font-bold rounded-xl transition-all cursor-pointer arabic-sans ${
                      spiritualSubTab === 'meetings'
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    👥 الاجتماعات والأنشطة الأسبوعية
                  </button>
                </div>

                {/* A: CONFESSIONS TAB PATH */}
                {spiritualSubTab === 'confessions' && (
                  <div className="space-y-6" id="spiritual-confessions-root">
                    <div className="bg-stone-900 text-white rounded-3xl p-6 md:p-8 border border-stone-850 shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1.5">
                          <span className="inline-block px-2.5 py-0.5 bg-gold/15 text-gold border border-gold/30 rounded text-[10px] font-bold arabic-sans">سر التوبة والاعتراف</span>
                          <h3 className="arabic-serif text-lg sm:text-xl font-bold">بوابة حجز وجلسات اعترافات الآباء الأجلاء</h3>
                          <p className="arabic-sans text-stone-300 text-xs leading-relaxed max-w-xl">
                            سر الإرشاد الروحي وطريق التوبة، تفضل بمطالعة مواعيد وساعات تلاقي الآباء الكهنة للتناول والصلوات والاعترافات.
                          </p>
                        </div>

                        {/* Toggle switch for confessions logic */}
                        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl shrink-0">
                          <button
                            onClick={() => setConfessionTab('days')}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                              confessionTab === 'days' ? 'bg-gold text-stone-950 shadow-sm' : 'text-stone-300'
                            }`}
                          >
                            مبوبة بالأيام
                          </button>
                          <button
                            onClick={() => setConfessionTab('fathers')}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                              confessionTab === 'fathers' ? 'bg-gold text-stone-950 shadow-sm' : 'text-stone-300'
                            }`}
                          >
                            مبوبة بالآباء
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CONFESSIONS SUB-TAB 1: BY DAYS */}
                    {confessionTab === 'days' ? (
                      <div className="bg-white border border-stone-150 rounded-3xl p-6 space-y-6 shadow-sm" id="confession-by-days">
                        <div className="flex flex-wrap gap-2 pb-4 border-b border-stone-100" dir="rtl">
                          {['الجمعة', 'السبت', 'الأحد', 'الإثنين', 'الأربعاء', 'الخميس'].map((day) => (
                            <button
                              key={day}
                              onClick={() => setSelectedConfessionDay(day)}
                              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                selectedConfessionDay === day
                                  ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                                  : 'bg-stone-50 border-stone-150 text-stone-750 hover:bg-stone-100'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5" dir="rtl">
                          {confessionsByDay.length > 0 ? (
                            confessionsByDay.map((item, idx) => (
                              <div key={idx} className="bg-stone-50/50 hover:bg-stone-55 border border-stone-105 rounded-2xl p-4.5 space-y-3 hover:border-gold/20 transition-all duration-200">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-stone-900 text-gold flex items-center justify-center font-bold text-xs">
                                    ☦️
                                  </div>
                                  <span className="arabic-serif text-sm font-bold text-stone-900">{item.father}</span>
                                </div>
                                <div className="space-y-1.5 pt-2.5 border-t border-stone-150 text-[11.5px] text-stone-650">
                                  <p className="flex items-center gap-2 font-medium text-stone-900">
                                    <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                                    <span>الميعاد: {item.time}</span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                    <span>الموقع: {item.location}</span>
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-center py-8 text-stone-500 text-xs sm:text-sm arabic-sans">
                              لا تتوفر ساعات اعتراف مسجلة بهذا اليوم للآباء حالياً. يرجى الترتيب المباشر مع سكرتارية الخدمة.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* CONFESSIONS SUB-TAB 2: BY FATHERS */
                      <div className="bg-white border border-stone-150 rounded-3xl p-6 space-y-6 shadow-sm" id="confession-by-fathers">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                          <span className="text-xs text-stone-505 font-bold arabic-sans block">اختر الآب الكاهن لمطالعة مواعيده طوال الأسبوع:</span>
                          <select
                            value={selectedConfessionFather}
                            onChange={(e) => setSelectedConfessionFather(e.target.value)}
                            className="bg-stone-50 border border-stone-200 text-stone-850 px-3 py-2 rounded-xl font-bold text-xs focus:ring-1 focus:ring-gold outline-none w-full sm:w-64 cursor-pointer"
                          >
                            <option value="all">كل الآباء الكهنة</option>
                            {confessionList.map((c) => (
                              <option key={c.father} value={c.father}>{c.father}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          {confessionList
                            .filter(c => selectedConfessionFather === 'all' || c.father === selectedConfessionFather)
                            .map((c, idx) => (
                              <div key={idx} className="bg-stone-50/40 hover:bg-white border border-stone-105 hover:border-gold/30 hover:shadow-md rounded-2xl p-5 flex flex-col justify-between transition-all duration-300">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full bg-stone-900 text-gold flex items-center justify-center font-bold text-xs">
                                      ☦️
                                    </div>
                                    <span className="arabic-serif text-sm sm:text-base font-bold text-stone-900">{c.father}</span>
                                  </div>

                                  {c.schedule.length > 0 ? (
                                    <div className="space-y-2 pt-2 border-t border-stone-100">
                                      {c.schedule.map((slot, sIdx) => (
                                        <div key={sIdx} className="flex justify-between items-center text-[11px] bg-white p-2 rounded-lg border border-stone-100">
                                          <span className="font-bold text-stone-900 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">{slot.day}</span>
                                          <span className="text-stone-700 font-medium" dir="rtl">{slot.time}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed italic fill-stone-500">
                                      {c.notes}
                                    </div>
                                  )}
                                </div>

                                {/* QR Code notice for specific fathers */}
                                {(c.father.includes('بيشوي') || c.father.includes('فيلوباتير')) && (
                                  <div className="mt-4 p-2 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-[10px] leading-relaxed flex items-center gap-1.5">
                                    <QrCode className="w-4.5 h-4.5 text-gold shrink-0" />
                                    <span>الحجز المسبق متاح عبر الأكواد (QR) لدى ممثلي لجنة الأمانة.</span>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                    {/* B: WEEKLY SPIRITUAL MEETINGS TAB PATH */}
                    {spiritualSubTab === 'meetings' && (
                      <div className="space-y-6" id="spiritual-meetings-root">
                        {/* Meetings display list */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {spiritualMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          id={`meeting-card-${meeting.id}`}
                          className="group bg-white hover:border-gold/40 hover:bg-stone-50/20 border-2 border-stone-150 rounded-[28px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm relative overflow-hidden text-right"
                        >
                          {/* Glowing background hint on hover/active */}
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-gold to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                          <div className="space-y-3.5 text-right">
                            <div className="space-y-1">
                              <h4 className="arabic-serif text-xl sm:text-2xl font-black text-stone-950 group-hover:text-amber-800 transition-colors block leading-relaxed">
                                {meeting.title}
                              </h4>
                            </div>

                            {/* New spacious and highly readable detail rows */}
                            <div className="space-y-3 pt-4 border-t border-dashed border-stone-200">
                              {/* Timing row */}
                              <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-150">
                                <CalendarDays className="w-5 h-5 text-gold shrink-0" />
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] sm:text-xs font-bold text-stone-400 arabic-sans leading-none mb-1">التوقيت</span>
                                  <span className="arabic-sans text-sm sm:text-base font-bold text-stone-900">{meeting.schedule}</span>
                                </div>
                              </div>

                              {/* Location row */}
                              <div className="flex items-center gap-3 bg-amber-500/[0.02] px-3.5 py-2.5 rounded-xl border border-amber-500/[0.06]">
                                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] sm:text-xs font-bold text-stone-400 arabic-sans leading-none mb-1">المكان</span>
                                  <span className="arabic-sans text-sm sm:text-base font-semibold text-stone-700 leading-normal">{meeting.location}</span>
                                </div>
                              </div>

                              {/* Coordinator row */}
                              <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-150">
                                <User className="w-5 h-5 text-gold shrink-0" />
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] sm:text-xs font-bold text-stone-400 arabic-sans leading-none mb-1">أمانة وإشراف الخدمة</span>
                                  <span className="arabic-sans text-sm sm:text-base font-bold text-stone-900">{meeting.responsible}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ======================= TAB 3: TASBEHA SCHEDULE ======================= */}
            {activeTab === 'tasbeha' && (
              <motion.div
                key="tasbeha-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-right"
                id="pane-tasbeha-schedule"
              >
                {/* MODERN REFINED LITURGICAL CARD GRID (Replacing Timeline format) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2" id="tasbeha-schedule-grid">
                  {tasbehaSchedule.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-[24px] border border-stone-200/80 hover:border-gold/30 p-6 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group text-right"
                    >
                      {/* Smooth top styling gradient line to ground design */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500/80 via-gold/80 to-amber-600/80 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                      <div className="space-y-4">
                        {/* Day & Subtag Row */}
                        <div className="flex justify-between items-center pb-3.5 border-b border-stone-100">
                          {/* Day Badge */}
                          <div className="flex items-center gap-2 bg-stone-900 text-gold px-3.5 py-1.5 rounded-xl font-bold text-sm sm:text-base arabic-serif shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            يوم {item.day}
                          </div>
                        </div>

                        {/* Title of liturgical activity */}
                        <div className="space-y-2 pt-1">
                          <h4 className="arabic-serif text-base sm:text-lg font-black text-stone-900 leading-relaxed group-hover:text-amber-700 transition-colors duration-300">
                            {item.type}
                          </h4>
                        </div>
                      </div>

                      {/* Schedule details section always pushed to bottom */}
                      <div className="mt-6 pt-4 border-t border-dashed border-stone-150 space-y-3">
                        {/* Time box */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-100">
                          <Clock className="w-4 h-4 text-gold shrink-0" />
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] font-bold text-stone-400 arabic-sans leading-none mb-0.5">التوقيت</span>
                            <span className="arabic-sans text-xs sm:text-sm font-bold text-stone-900" dir="rtl">
                              {item.time}
                            </span>
                          </div>
                        </div>

                        {/* Location box */}
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
              </motion.div>
            )}

            {/* ======================= TAB 4: EDUCATION / SUNDAY SCHOOL ======================= */}
            {activeTab === 'education' && (
              <motion.div
                key="education-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8 text-right"
                id="pane-education-curriculum"
              >
                {/* Refined Segmented Switcher to eliminate long scrolling */}
                <div className="bg-white border-2 border-stone-150 p-2 rounded-[24px] flex shadow-md max-w-lg mx-auto" id="education-day-switcher" dir="rtl">
                  <button
                    onClick={() => setEducationDay('الجمعة')}
                    className={`flex-1 py-4 text-center text-base sm:text-lg font-black rounded-2xl transition-all cursor-pointer arabic-serif flex items-center justify-center gap-2 ${
                      educationDay === 'الجمعة'
                        ? 'bg-stone-900 text-gold shadow-md'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>📅</span>
                    اجتماعات يوم الجمعة
                  </button>
                  <button
                    onClick={() => setEducationDay('الأحد')}
                    className={`flex-1 py-4 text-center text-base sm:text-lg font-black rounded-2xl transition-all cursor-pointer arabic-serif flex items-center justify-center gap-2 ${
                      educationDay === 'الأحد'
                        ? 'bg-stone-900 text-gold shadow-md'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>⛪</span>
                    اجتماعات يوم الأحد
                  </button>
                </div>

                {/* Grid list of ultra-modern, high-contrast, compact details cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="education-cards-list">
                  {educationSchedule
                    .filter(item => item.day === educationDay)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-stone-150 hover:border-gold hover:bg-stone-50/20 rounded-[28px] p-6 sm:p-7 transition-all duration-300 shadow-sm flex flex-col justify-between gap-5 group text-right relative overflow-hidden"
                      >
                        {/* Golden slide strip on hover */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-gold to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                        <div className="space-y-3">
                          {/* Super prominent, clean, large class target heading */}
                          <h4 className="arabic-serif text-xl sm:text-2xl font-black text-stone-950 group-hover:text-amber-800 transition-colors duration-250 leading-relaxed">
                            {item.target}
                          </h4>
                        </div>

                        {/* Metas/Schedules Row always grounded at the bottom */}
                        <div className="space-y-3 pt-4 border-t border-dashed border-stone-200">
                          {/* Time details table */}
                          <div className="flex items-center gap-3 bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-150">
                            <Clock className="w-4.5 h-4.5 text-gold shrink-0" />
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] font-bold text-stone-400 arabic-sans leading-none mb-1">التوقيت</span>
                              <span className="arabic-sans text-xs sm:text-sm font-bold text-stone-900">
                                {item.time}
                              </span>
                            </div>
                          </div>

                          {/* Location details table with 'الموقع' label */}
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
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
