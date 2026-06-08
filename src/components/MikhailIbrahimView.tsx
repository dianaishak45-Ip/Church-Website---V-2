import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star, Heart, Award, ArrowUpRight, Flame } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import frMikhailIbrahimImg from '../assets/images/fr_mikhail_ibrahim.png';

export default function MikhailIbrahimView() {
  useSEO({
    title: 'أبونا القديس ميخائيل إبراهيم - كنيسة مارمرقس بشبرا',
    description: 'تعرف على سيرة القديس المعاصر الأب القمص ميخائيل إبراهيم، رجل الصلاة والشفافية الروحية، الأب الروحي لقداسة البابا شنودة الثالث كاهن كنيستنا المبارك.',
    keywords: 'أبونا ميخائيل إبراهيم, القمص ميخائيل ابراهيم, كنيسة مارمرقس بشبرا, البابا شنودة الثالث, قديس معاصر, آباء كنيسة شبرا',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 lg:pb-0 text-right" dir="rtl">
      {/* Target Title & Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-block px-4 py-1.5 bg-gold/15 text-gold rounded-full text-xs font-black uppercase tracking-wider arabic-sans border border-gold/20">
          منارات مضيئة في تاريخ كنيستنا ✨
        </div>
        <h1 className="arabic-serif text-4xl sm:text-5xl lg:text-6xl font-black text-stone-950 leading-tight">
          أبونا القمص ميخائيل إبراهيم
        </h1>
        <p className="arabic-sans text-stone-600 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed">
          رجل الصلاة والدموع والشفافية الروحية، الأب الروحي ومعلم الاعتراف للعديد من الأباء المطارنة وعلى رأسهم طيب الذكر مثلث الرحمات قداسة البابا شنودة الثالث.
        </p>
      </motion.div>

      {/* Hero Iconography Panel with Saint Profile */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 shadow-2xl border border-stone-850 p-6 sm:p-10 lg:p-14 flex flex-col md:flex-row gap-8 items-center">
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[2rem] overflow-hidden border-4 border-white bg-white shrink-0 shadow-lg relative z-10 flex items-center justify-center p-1">
          <img 
            src={frMikhailIbrahimImg}
            alt="صورة أبونا ميخائيل إبراهيم" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-white space-y-4 relative z-10 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">١٨٩٩م - ١٩٧٥م</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">كاهن كنيستنا (١٩٥٦م - ١٩٧٥م)</span>
          </div>
          <h2 className="arabic-serif text-2xl sm:text-3xl font-black text-gold">"كنت من وراء منبره مستمعاً لتعليم حي"</h2>
          <p className="arabic-sans text-stone-300 text-xs sm:text-sm leading-relaxed text-justify">
            بهذه الكلمات رثى البابا شنودة الثالث أباه الروحي قائلاً: "كان أباً للجميع، نموذجاً حياً للمعلم الصامت والإنجيل المعاش، إن صلاته على المذبح كانت تصعد كرائحة بخور طيبة، وكان دائماً يسبق غيره بالتواضع الصادق والانسحاق أمام عظمة الله الكبير."
          </p>
        </div>
      </section>

      {/* Beautiful Inspirational Quotes Slider / Static Treasury */}
      <section className="bg-stone-50 border border-stone-200/80 rounded-[2rem] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-xl pointer-events-none" />
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-gold rounded-full" />
            <h3 className="arabic-serif text-xl sm:text-2xl font-black text-stone-950">مقتطفات من كلماته وتدابيره الروحية</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6" dir="rtl">
            {[
              { text: "«سامحني يا سيدي.. هذه العبارة البسيطة التي كان يتمتم بها أبونا ميخائيل إبراهيم بكل تواضع للجميع تعكس عمق الزهد وإنكار الذات الكامل الذي عاش فيه.»" },
              { text: "«إن الذين يدخلون للمذبح بغير انسحاق واعتراف بضعفهم يحرمون أنفسهم من بركة حضور الله، فالصلاة الحقيقية هي حديث قلب جريح تائب مع إلهه الحبيب.»" },
              { text: "«يا بني، دع التدبير الإلهي يقود دفتك، ولا تسبق نعمة الله بذكائك أو خططك، فعندما يستسلم الإنسان لمشيئة الله تتبدد جبال الهموم أمامه بكل سهولة.»" },
              { text: "«محبتك لأعدائك ليست اختياراً بل هي الباب الذهبي لدخول ملكوت الإله، لأن المسيح على عود الصليب صرخ طالباً الصفح لصالبيه حتى ترث البشرية الغفران.»" }
            ].map((quote, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-150 relative shadow-3xs flex flex-col justify-between">
                <span className="text-3xl text-gold font-serif leading-none h-4 absolute top-2 right-3 select-none">“</span>
                <p className="arabic-sans text-stone-700 text-xs sm:text-sm leading-relaxed text-justify pr-5 pt-3">
                  {quote.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Trait Cards Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4 custom-panel"
        >
          <div className="flex items-center gap-3 text-gold">
            <Flame className="w-7 h-7" />
            <h3 className="arabic-serif text-xl sm:text-2xl font-bold">حياة الصلاة الحارة</h3>
          </div>
          <div className="arabic-sans text-stone-600 text-sm space-y-3 text-justify leading-relaxed">
            <p>
              كان القداس الإلهي لأبونا ميخائيل هو السماء على الأرض. كان لا يقف على المذبح إلا والدموع تبلل وجهه وصدره، يحكي من عاصروه أنه كان ينسخ الصلوات بخشوع عظيم يُشعر المصلين بقوة حضور الملائكة والقدوسين.
            </p>
            <p>
              لم تكن صلاته مقتصرة على المذبح الكنسي فحسب، بل اتسع قلبه بالصلاة من أجل المعوقين، المرضى، منكري الإيمان، والبلاد كلها، فوهبه الله شفافية عجيبة واستجابات فورية لطلباته الصادقة.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4 custom-panel"
        >
          <div className="flex items-center gap-3 text-gold">
            <Award className="w-7 h-7" />
            <h3 className="arabic-serif text-xl sm:text-2xl font-bold">التواضع الرهيب وإنكار الذات</h3>
          </div>
          <div className="arabic-sans text-stone-600 text-sm space-y-3 text-justify leading-relaxed">
            <p>
              على الرغم من اتساع شهرته الروحية وسؤال عظام الأساقفة لإرشاده، لم يقبل يوماً تمجيداً أو كرامة شخصية. كان يرفض أن يُقبل أحد يده مفضلاً أن يقبل هو أيادي تلاميذه وخراف رعيته المباركة.
            </p>
            <p>
              حتى حينما انتقل للخدمة بكنيسة مارمرقس بشبرا في عام ١٩٥٦م، تعامل مع الآباء الأصغر سناً بكل خضوع واحترام، وكان يبادر بخدمة الجميع وسد حاجات الفقراء وأخوة الرب في الخفاء التام وبصمت وقرار حكيم.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Section - Highlights of His Spiritual Relationship with Pope Shenouda III */}
      <section className="bg-gold rounded-[2.5rem] p-8 lg:p-12 border border-gold/10 grid lg:grid-cols-3 gap-8 shadow-xl text-white">
        <div className="lg:col-span-2 space-y-5">
          <h3 className="arabic-serif text-2xl lg:text-3xl font-bold text-white border-r-4 border-white/40 pr-4 leading-none">
            أبوته لقداسة البابا شنودة الثالث
          </h3>
          <p className="arabic-sans text-xs sm:text-sm text-stone-100 leading-relaxed text-justify">
            لقد حظي أبونا ميخائيل إبراهيم بمكانة سامية في وجدان الكنيسة القبطية ليس فقط من أجل طهارته الفردية بل لخدمته المحورية، حيث اختاره قداسة البابا شنودة الثالث ليكون مرشده الروحي وأميناً لاعترافه منذ كان البابا راهباً باسم أنطونيوس السرياني ثم أسقفاً للتعليم وحتي بعد جلوسه على الكرسي المرقسي.
          </p>
          <ul className="space-y-3 pt-2 text-stone-200">
            <li className="flex gap-3 items-start text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-white mt-2 shrink-0 animate-pulse" />
              <span>ألقى قداسته محاضرات عديدة تفصل فضائله، معتبراً إياه مدرسة لاهوتية تطبيقية متكاملة.</span>
            </li>
            <li className="flex gap-3 items-start text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-white mt-2 shrink-0 animate-pulse" />
              <span>شهد البابا بروح الأبوة العجيبة التي كان أبونا ميخائيل يحرص عليها طيلة خدمته المقدسة.</span>
            </li>
            <li className="flex gap-3 items-start text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-white mt-2 shrink-0 animate-pulse" />
              <span>كتب قداسته أبيات شعر تخلّد ذكرى انتقال هذا البار، وظل مزار المدفون بجوار مزار مارمرقس مقصداً مفضلاً له.</span>
            </li>
          </ul>
        </div>
        <div className="hidden lg:flex items-center justify-center relative">
          <div className="absolute inset-0 bg-amber-500/20 rotate-6 rounded-[2rem] border border-white/10" />
          <div className="relative z-10 w-full h-48 bg-stone-900/60 rounded-[2rem] p-4 flex flex-col justify-center text-center space-y-2 border border-white/20">
            <span className="text-4xl">⛪</span>
            <span className="arabic-serif text-lg font-bold text-gold">مدفون بالكاتدرائية</span>
            <span className="arabic-sans text-[11px] text-stone-200">بجوار جسد مارمرقس الرسول مباشرة بتدبير خاص من البابا شنودة.</span>
          </div>
        </div>
      </section>

      {/* Historical Milestones */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-6 bg-amber-600 rounded-full" />
          <h3 className="arabic-serif text-xl sm:text-2xl font-black text-stone-950">محطات هامة في حياته</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { tag: "الميلاد والنشأة", val: "٢٠ أبريل ١٨٩٩م", desc: "ولد ببلدة ميت دمسيس وعمل كمعين بوزارة الداخلية برتبة موظف مخلص ومثابر قبل دعوة الإله للكهنوت." },
            { tag: "السيامة الكهنوتية", val: "١٦ سبتمبر ١٩٥١م", desc: "سيم كاهناً على كنيسة كفر عبده بالمنوفية، ثم انتقل بتدبير سماوي إلى كنيسة القديس مارمرقس بشبرا عام ١٩٥٦م." },
            { tag: "الانتقال السعيد", val: "٢٦ مارس ١٩٧٥م", desc: "لبى نداء الفردوس المقدس في أسبوع الآلام الشريف، وصلى عليه قداسة البابا شنودة الثالث في جنازة مهيبة شهدت وفاء قل نظيره." }
          ].map((mile, i) => (
            <div key={i} className="bg-white border-2 border-stone-150 p-5 rounded-2xl relative group hover:border-gold/30 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gold arabic-sans bg-gold/10 px-2 py-0.5 rounded-full block w-fit">{mile.tag}</span>
                <h4 className="arabic-serif text-lg font-bold text-stone-900">{mile.val}</h4>
                <p className="arabic-sans text-stone-500 text-xs leading-relaxed text-justify">{mile.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concluding Tribute / Call to Visit Shrine of Father Mikhail */}
      <section className="text-center space-y-6 py-8 border-t border-stone-200">
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="arabic-serif text-2xl font-bold text-stone-950">بركة صلواته تشملنا جميعاً</h3>
          <p className="arabic-sans text-stone-600 text-sm leading-relaxed">
            يذكر شعب كنيسة مارمرقس بشبرا بكل فخر واعتزاز السنوات الطويلة التي بارك فيها أبونا ميخائيل خدمتهم وأبوابهم، وما زالت كنيستنا تحتفظ بتذكاراته ورائحة مسكراته الروحية المعطرة حتى يومنا هذا لبركة الأجيال المتتالية.
          </p>
        </div>
        <div className="w-16 h-1 bg-gold mx-auto rounded-full" />
      </section>
    </div>
  );
}
