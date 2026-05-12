import { motion } from 'motion/react';
import { BookOpen, Star, MapPin, Anchor } from 'lucide-react';

export default function PatronSaintView() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 lg:pb-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-block px-4 py-1 bg-gold/10 text-gold rounded-full text-sm font-bold uppercase tracking-wider arabic-sans border border-gold/20">
          شفيع الكنيسة
        </div>
        <h1 className="arabic-serif text-5xl lg:text-7xl font-bold text-stone-900 leading-tight">
          القديس مارمرقس الرسول
        </h1>
        <p className="arabic-sans text-stone-500 max-w-2xl mx-auto text-lg lg:text-xl leading-relaxed">
          كاروز الديار المصرية، أحد السبعين رسولاً، كاتب الإنجيل الثاني بالترتيب، ومؤسس الكنيسة القبطية الأرثوذكسية.
        </p>
      </motion.div>

      <section className="relative overflow-hidden rounded-[3rem] aspect-[21/9] bg-stone-200 shadow-2xl border-4 border-white/50">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/StMarkEvangelist.jpg/1200px-StMarkEvangelist.jpg" 
          alt="أيقونة القديس مارمرقس" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent flex items-end p-8 lg:p-16">
          <div className="text-white space-y-2">
            <h2 className="arabic-serif text-3xl font-bold italic">"سلام لمارمرقس ناظر الإله"</h2>
            <p className="arabic-sans opacity-80 text-sm">من تماجيد الكنيسة القبطية</p>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6 custom-panel"
        >
          <div className="flex items-center gap-3 text-gold">
            <BookOpen className="w-8 h-8" />
            <h3 className="arabic-serif text-3xl font-bold">نشأته وإيمانه</h3>
          </div>
          <div className="arabic-sans text-stone-600 space-y-4 text-justify leading-relaxed">
            <p>
              ولد يوحنا الملقب مرقس في مدينة القيروان (إحدى المدن الخمس الغربية بليبيا)، من أبوين يهوديين. نزحت عائلته إلى فلسطين حيث التفت إلى تعاليم السيد المسيح.
            </p>
            <p>
              كان بيت أمه (مريم) هو "العليّة" الشهيرة التي أكل فيها الرب مع تلاميذه الفصح، واجتمع فيها الرسل يوم الخماسين، لذا يُلقب بـ "ناظر الإله" لأنه رأى الرب عياناً.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6 custom-panel"
        >
          <div className="flex items-center gap-3 text-gold">
            <MapPin className="w-8 h-8" />
            <h3 className="arabic-serif text-3xl font-bold">كرازته في مصر</h3>
          </div>
          <div className="arabic-sans text-stone-600 space-y-4 text-justify leading-relaxed">
            <p>
              دخل مارمرقس مدينة الإسكندرية في حدود عام 61 ميلادية. وعندما تمزق حذاؤه، ذهب إلى إسكافي يدعى "أنانيانوس" ليصلحه. وأثناء العمل غرز المخرز في يد الإسكافي فصرخ: "يا الله الواحد".
            </p>
            <p>
              هنا بدأ الرسول يتحدث معه عن الإله الحقيقي، فآمن أنانيانوس وأهله، فكانوا أول ثمار الكنيسة المصرية العريقة التي أسسها مارمرقس بدمائه.
            </p>
          </div>
        </motion.div>
      </div>

      <section className="bg-gold rounded-[3rem] p-8 lg:p-16 border border-gold/10 grid lg:grid-cols-3 gap-8 shadow-xl text-white">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="arabic-serif text-3xl font-bold text-white border-r-4 border-white/40 pr-4">أهم أعماله الروحية</h3>
          <ul className="space-y-6">
            {[
              { icon: BookOpen, title: 'إنجيل مرقس', desc: 'أول إنجيل كُتب، تميز بالتركيز على أعمال القوة ومعجزات السيد المسيح.' },
              { icon: Anchor, title: 'القداس الكيرلسي', icon2: Anchor, desc: 'وضع القديس مرقس نواة القداس الإلهي الذي سلمه للبابا كيرلس الأول لاحقاً.' },
              { icon: Star, title: 'المدرسة اللاهوتية', desc: 'أسس مدرسة الإسكندرية اللاهوتية التي أصبحت منارة الفكر اللاهوتي في العالم أجمع.' },
            ].map((work, idx) => (
              <li key={idx} className="flex gap-4 items-start group">
                <div className="shrink-0 w-10 h-10 bg-white/10 rounded-xl shadow-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-gold transition-colors border border-white/20">
                  <work.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="arabic-serif text-xl font-bold text-white">{work.title}</h4>
                  <p className="arabic-sans text-sm text-white/80 leading-relaxed">{work.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:block relative">
          <div className="absolute inset-0 bg-amber-200 rotate-6 rounded-[2rem]" />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Saint_Mark_the_Evangelist_Icon.jpg" 
            alt="أيقونة روحية للقديس مارمرقس" 
            className="relative z-10 w-full h-full object-cover rounded-[2rem] shadow-xl border-4 border-white"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <section className="text-center space-y-8 py-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="arabic-serif text-3xl font-bold text-stone-900 leading-tight">استشهاده وعيده</h3>
          <p className="arabic-sans text-stone-600 leading-relaxed italic">
            "نال إكليل الشهادة في مدينة الإسكندرية في 30 برمودة (8 مايو) عام 68م تقريباً، بعد أن طاف به الوثنيون في شوارع المدينة، وما زالت كنيستنا تحتفل بعيده سنوياً بفرح روحي عظيم."
          </p>
        </div>
        <div className="w-24 h-1 bg-amber-700 mx-auto rounded-full" />
      </section>
    </div>
  );
}
