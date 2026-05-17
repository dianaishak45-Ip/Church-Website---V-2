import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Book, FileText, Sun, Calendar as CalendarIcon, Quote, RefreshCw, AlertCircle } from 'lucide-react';

interface Reading {
  title: string;
  ref: string;
  text: string;
}

interface KatamarsData {
  copticDate: string;
  synaxarium: {
    title: string;
    text: string;
  };
  readings: Reading[];
  dailyVerse: {
    text: string;
    ref: string;
  };
}

export default function DailyReadingsView() {
  const [data, setData] = useState<KatamarsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('السنكسار');

  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('ar-EG', options);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/katamars');
        
        if (!response.ok) {
          throw new Error('فشل في تحميل القراءات');
        }

        const rawData = await response.json();
        
        const BIBLE_BOOKS_AR: Record<string, string> = {
          'Matthew': 'متى',
          'Mark': 'مرقس',
          'Luke': 'لوقا',
          'John': 'يوحنا',
          'Acts': 'أعمال الرسل',
          'Romans': 'رومية',
          '1 Corinthians': 'كورنثوس الأولى',
          '2 Corinthians': 'كورنثوس الثانية',
          'Galatians': 'غلاطية',
          'Ephesians': 'أفسس',
          'Philippians': 'فيلبي',
          'Colossians': 'كولوسي',
          '1 Thessalonians': 'تسالونيكي الأولى',
          '2 Thessalonians': 'تسالونيكي الثانية',
          '1 Timothy': 'تيموثاوس الأولى',
          '2 Timothy': 'تيموثاوس الثانية',
          'Titus': 'تيطس',
          'Philemon': 'فليمون',
          'Hebrews': 'عبرانيين',
          'James': 'يعقوب',
          '1 Peter': 'بطرس الأولى',
          '2 Peter': 'بطرس الثانية',
          '1 John': 'يوحنا الأولى',
          '2 John': 'يوحنا الثانية',
          '3 John': 'يوحنا الثالثة',
          'Jude': 'يهوذا',
          'Psalms': 'مزامير'
        };

        const translateBook = (name: string) => BIBLE_BOOKS_AR[name] || name;

        // Helper to extract text and reference from the api.coptic.io structure
        const extractReading = (readingArray: any[], defaultTitle: string) => {
          if (!readingArray || readingArray.length === 0) {
            return { title: defaultTitle, ref: '---', text: 'لا يوجد نص متاح حالياً' };
          }

          let fullText = '';
          let references: string[] = [];

          readingArray.forEach(book => {
            book.chapters?.forEach((chapter: any) => {
              references.push(`${translateBook(book.bookName)} ${chapter.chapterNum}`);
              chapter.verses?.forEach((verse: any) => {
                fullText += ` ${verse.text}`;
              });
            });
          });

          return {
            title: defaultTitle,
            ref: references.join('; '),
            text: fullText.trim() || 'لا يوجد نص متاح حالياً'
          };
        };

        const COPTIC_MONTHS_AR: Record<string, string> = {
          'Thout': 'توت',
          'Paopi': 'بابه',
          'Hathor': 'هاتور',
          'Kiahk': 'كيهك',
          'Tobi': 'طوبة',
          'Meshir': 'أمشير',
          'Paremhat': 'برمهات',
          'Baramouda': 'برمودة',
          'Pashons': 'بشنس',
          'Paoni': 'بؤونة',
          'Epip': 'أبيب',
          'Mesori': 'مسرى',
          'Nasie': 'نسيء',
          'Pi Kogi Enavot': 'نسيء'
        };

        const translateDate = (dateStr: string) => {
          if (!dateStr) return '---';
          let result = dateStr;
          Object.entries(COPTIC_MONTHS_AR).forEach(([en, ar]) => {
            result = result.replace(en, ar);
          });
          return result;
        };

        const transformedData: KatamarsData = {
          copticDate: translateDate(rawData.fullDate?.dateString),
          synaxarium: {
            title: rawData.Synaxarium?.map((s: any) => s.name).join(' - ') || 'تذكار اليوم',
            text: rawData.Synaxarium?.map((s: any) => s.text).join('\n\n') || 'لا يوجد معلومات متاحة حالياً.'
          },
          readings: [
            extractReading(rawData.Pauline, 'البولس'),
            extractReading(rawData.Catholic, 'الكاثوليكون'),
            extractReading(rawData.Acts, 'الإبركسيس'),
            extractReading(rawData.LGospel, 'إنجيل القداس')
          ],
          dailyVerse: {
            text: 'كُلُّ شَيْءٍ مُسْتَطَاعٌ لِلْمُؤْمِنِ.',
            ref: '(مرقس ٩ : ٢٣)'
          }
        };

        // If we have a gospel reading, use a snippet as the daily verse
        if (rawData.LGospel?.[0]?.chapters?.[0]?.verses?.[0]) {
          const firstVerse = rawData.LGospel[0].chapters[0].verses[0];
          transformedData.dailyVerse = {
            text: firstVerse.text.substring(0, 100) + (firstVerse.text.length > 100 ? '...' : ''),
            ref: `(${translateBook(rawData.LGospel[0].bookName)} ${rawData.LGospel[0].chapters[0].chapterNum} : ${firstVerse.num})`
          };
        }

        setData(transformedData);
        setError(null);
      } catch (err) {
        console.error('API Error:', err);
        setError('حدث خطأ أثناء تحميل القراءات. قد يكون هناك مشكلة في الاتصال بالمصدر.');
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <RefreshCw className="w-12 h-12 text-gold animate-spin" />
        <p className="arabic-sans text-stone-500 animate-pulse text-lg">جاري تحميل كلمة الله...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <div className="w-20 h-20 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="arabic-serif text-2xl font-bold text-stone-800">عذراً، حدث خطأ ما</h2>
          <p className="arabic-sans text-stone-500">{error || 'لا يمكن الوصول إلى البيانات حالياً'}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-stone-900 text-white rounded-xl hover:bg-amber-700 transition-colors arabic-sans font-bold shadow-lg"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const tabs = ['السنكسار', ...data.readings.map(r => r.title)];

  return (
    <div className="max-w-5xl mx-auto pb-24 lg:pb-12 text-right" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold arabic-sans uppercase tracking-widest border border-gold/20">
          <Sun className="w-3 h-3" />
          غذاء الروح
        </div>
        <h1 className="arabic-serif text-5xl lg:text-7xl font-bold text-stone-900 leading-tight">القراءات اليومية</h1>
        <p className="arabic-sans text-stone-500 text-xl font-medium">{formattedDate} - {data.copticDate}</p>
      </div>

      {/* Persistent Verse/Coptic Date on Mobile/Desktop */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
         <div className="lg:col-span-2">
            <div className="bg-gold rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center gap-6 shadow-lg border border-gold/20">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <Quote className="w-8 h-8 text-white/50" />
              </div>
              <div className="space-y-2 text-center md:text-right">
                <p className="arabic-serif text-xl md:text-2xl leading-relaxed">"{data.dailyVerse.text}"</p>
                <p className="arabic-sans text-sm font-bold opacity-80">{data.dailyVerse.ref}</p>
              </div>
            </div>
         </div>
         <div className="hidden lg:block">
            <div className="custom-panel !p-6 h-full flex flex-col justify-center">
              <h3 className="arabic-serif text-xl font-bold text-stone-800 mb-2">النتيجة القبطية</h3>
              <p className="arabic-serif text-3xl font-bold text-gold">{data.copticDate}</p>
            </div>
         </div>
      </div>

      {/* Sticky Navigation Tabs */}
      <div className="sticky top-20 z-30 mb-8 -mx-4 lg:mx-0 px-4 lg:px-0">
        <div className="bg-white/90 backdrop-blur-md border border-stone-100 rounded-3xl p-2 shadow-xl flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl arabic-serif text-lg font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-gold text-white shadow-md' 
                  : 'text-stone-500 hover:bg-stone-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'السنكسار' ? (
                <section className="custom-panel !p-8 lg:!p-12 space-y-8">
                  <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
                    <FileText className="w-8 h-8 text-gold" />
                    <h2 className="arabic-serif text-3xl font-bold text-stone-800">السنكسار - {data.copticDate}</h2>
                  </div>
                  
                  <div className="space-y-8 arabic-serif text-stone-800 leading-[2.2] text-2xl">
                    <div className="p-8 lg:p-10 bg-gold/5 rounded-[2.5rem] border-r-8 border-gold">
                      <h3 className="font-bold text-3xl text-stone-900 mb-6 leading-normal">{data.synaxarium.title}</h3>
                      <p className="whitespace-pre-line">{data.synaxarium.text}</p>
                    </div>
                  </div>
                </section>
              ) : (
                data.readings.filter(r => r.title === activeTab).map((reading, i) => (
                  <div 
                    key={i}
                    className="custom-panel !p-8 lg:!p-12 space-y-8"
                  >
                    <div className="flex justify-between items-start border-b border-stone-50 pb-6">
                      <div className="flex items-center gap-3">
                        <Book className="w-8 h-8 text-gold" />
                        <h3 className="arabic-serif text-3xl font-bold text-stone-800">{reading.title}</h3>
                      </div>
                      <span className="text-xs font-bold text-gold bg-gold/10 px-4 py-1 rounded-full arabic-sans">نص مختار</span>
                    </div>
                    <div className="arabic-sans text-xl font-bold text-stone-400">{reading.ref}</div>
                    <p className="arabic-serif text-stone-700 leading-[2.2] text-2xl lg:text-3xl relative pr-4 lg:pr-8 whitespace-pre-line">
                      "{reading.text}"
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar Info/Quick Links */}
        <div className="lg:col-span-1 space-y-6">
          <div className="custom-panel !p-6 space-y-4">
            <h4 className="arabic-serif font-bold text-stone-800 border-b border-stone-50 pb-2">عن القراءات</h4>
            <p className="arabic-sans text-xs text-stone-500 leading-relaxed">
              تتغير القراءات اليومية تلقائياً حسب طقس الكنيسة وترتيب القطمارس (Katamars).
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

