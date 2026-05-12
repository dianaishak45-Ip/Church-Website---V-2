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

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 lg:pb-0">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold arabic-sans uppercase tracking-widest border border-gold/20">
          <Sun className="w-3 h-3" />
          غذاء الروح
        </div>
        <h1 className="arabic-serif text-5xl lg:text-7xl font-bold text-stone-900 leading-tight">القراءات اليومية</h1>
        <p className="arabic-sans text-stone-500 text-xl font-medium">{formattedDate}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 text-right" dir="rtl">
        <div className="lg:col-span-2 space-y-8">
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

          <div className="grid md:grid-cols-1 gap-8">
            {data.readings.map((reading, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="custom-panel !p-8 lg:!p-10 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <h3 className="arabic-serif text-3xl font-bold text-gold leading-normal">{reading.title}</h3>
                  <span className="text-[10px] font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded">نص مختار</span>
                </div>
                <div className="arabic-sans text-base font-bold text-stone-400">{reading.ref}</div>
                <p className="arabic-serif text-stone-700 leading-[2.2] text-2xl relative pr-10">
                  <Quote className="absolute right-0 top-0 w-8 h-8 text-stone-100 -z-10" />
                  "{reading.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gold rounded-[2.5rem] p-8 lg:p-10 text-white space-y-6 shadow-xl">
            <h3 className="arabic-serif text-3xl font-bold">آية اليوم</h3>
            <div className="p-8 bg-white/10 rounded-[2rem] border border-white/20 text-3xl arabic-serif leading-[1.8]">
              "{data.dailyVerse.text}"
              <div className="text-right text-base mt-6 font-bold opacity-80 arabic-sans">{data.dailyVerse.ref}</div>
            </div>
          </div>

          <div className="custom-panel !p-8 space-y-6">
            <h3 className="arabic-serif text-2xl font-bold text-stone-800">النتيجة القبطية</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gold/5 p-6 rounded-[1.5rem]">
                <span className="arabic-sans text-stone-500">اليوم القبطي</span>
                <span className="arabic-serif font-bold text-gold text-2xl">{data.copticDate}</span>
              </div>
              <div className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl text-stone-400 text-xs text-center border-t border-stone-100 pt-4 leading-relaxed arabic-sans">
                تتغير القراءات يومياً حسب ترتيب القطمارس الكنسي.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
