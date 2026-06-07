import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartHandshake, 
  Smartphone, 
  Building, 
  Coins, 
  Copy, 
  Check, 
  Info,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

type MethodType = 'instapay' | 'bank' | 'cash';

interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swift: string;
  branch: string;
  currency?: string;
  churchId?: string;
}

export default function DonationsView() {
  useSEO({
    title: 'العطاء والتبرعات - كنيسة مارمرقس بشبرا',
    description: 'ساهم بتبّرعك لدعم خدمات كنيسة القديس مارمرقس الرسولي بشبرا، رعاية أخوة الرب وعمار الكنيسة من خلال حساباتنا البنكية وعبر تطبيق إيستاباي (InstaPay).',
    keywords: 'تبرعات الكنيسة, تبرع مارمرقس شبرا, حساب بنك كنيسة مارمرقس بشبرا, إيستاباي الكنيسة, أخوة الرب شبرا',
  });

  const [activeMethod, setActiveMethod] = useState<MethodType>('instapay');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Bank Data
  const bankAccounts: BankAccount[] = [
    {
      bankName: 'بنك كريدي أجريكول',
      accountName: 'كنيسة مارمرقس (MAR MARCUS CHURCH)',
      accountNumber: '11018180293666',
      iban: 'EG270036000100011018180293666',
      swift: 'AGRIEGCXXXX',
      branch: 'الفرع الرئيسي',
      currency: 'حساب بالجنيه المصري EGP',
      churchId: '101259177'
    },
    {
      bankName: 'بنك كريدي أجريكول',
      accountName: 'كنيسة مارمرقس (MAR MARCUS CHURCH)',
      accountNumber: '11018400063244',
      iban: 'EG930036000100011018400063244',
      swift: 'AGRIEGCXXXX',
      branch: 'الفرع الرئيسي',
      currency: 'حساب بالدولار الأمريكي USD',
      churchId: '101259177'
    }
  ];

  const instapayAccountNum = '01015010000554';

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 lg:pb-0 text-right" dir="rtl" id="donations-container">
      {/* Page Header */}
      <div className="text-center space-y-5" id="donations-header">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold arabic-sans border border-gold/20 shadow-inner">
          <HeartHandshake className="w-4 h-4" />
          العطاء والبركة الكنسية
        </div>
        <h1 className="arabic-serif text-3xl lg:text-5xl font-bold text-stone-900 leading-tight">العطاء وقربان المحبة</h1>
        <p className="arabic-serif text-gold font-medium max-w-2xl mx-auto text-base sm:text-lg leading-relaxed italic">
          "كُلُّ وَاحِدٍ كَمَا يَنْوِي بِقَلْبِهِ، لَيْسَ عَنْ حُزْنٍ أَوِ اضْطِرَارٍ. لأَنَّ الْمُعْطِيَ الْمَسْرُورَ يُحِبُّهُ اللهُ" <span className="text-xs text-stone-400 font-sans not-italic block mt-1">(٢ كورنثوس ٩: ٧)</span>
        </p>
      </div>

      {/* Intro Box */}
      <div className="custom-panel !bg-gradient-to-br !from-white !to-stone-50/50 relative overflow-hidden" id="info-panel">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="arabic-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Coins className="w-6 h-6 text-gold" />
              أين تذهب مساهماتكم وتبرعاتكم؟
            </h3>
            <p className="arabic-sans text-stone-600 text-sm leading-relaxed text-justify max-w-4xl">
              تبرعاتكم للمساهمة في بناء وعمار بيت الله هي بركة عظيمة، وتساهم الكنيسة بكل أمانة في توجيه هذه العطايا لرعاية العائلات والنفوس المحتاجة وعمار مباني الخدمات المتعددة.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="purposes-list">
            {[
              { title: 'خدمة أخوة الرب والعائلات المستورة', desc: 'توزيع مساعدات شهرية وعلاج ونفقات معيشية.' },
              { title: 'عمار وصيانة مبنى الكنيسة والخدمات', desc: 'سداد فواتير المرافق، ترميمات وصيانة دورية.' },
              { title: 'احتياجات الهيكل والمذبح', desc: 'شراء كير عشور، أواني الخدمة، الأباركة، والقرابين.' }
            ].map((purpose, idx) => (
              <div key={idx} className="flex gap-2.5 items-start bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="arabic-sans font-bold text-stone-800 text-xs">{purpose.title}</h4>
                  <p className="arabic-sans text-[10px] text-stone-500 leading-relaxed text-justify">{purpose.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation and Select Method Section */}
      <div className="space-y-6" id="method-section">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h2 className="arabic-serif text-2xl font-bold text-stone-900">طرق المساهمة والتحويل</h2>
            <p className="arabic-sans text-stone-500 text-xs">يرجى اختيار طريقة الدفع الأنسب لكم للحصول على التفاصيل</p>
          </div>
          
          {/* Method Tabs */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200/50 w-full md:w-auto" id="method-tabs">
            {[
              { id: 'instapay', label: 'تطبيق InstaPay', icon: Smartphone },
              { id: 'bank', label: 'تحويل بنكي', icon: Building },
              { id: 'cash', label: 'تبرع نقدي مباشر', icon: Coins }
            ].map((method) => {
              const Icon = method.icon;
              const isActive = activeMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setActiveMethod(method.id as MethodType)}
                  className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold arabic-sans transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-stone-900 text-white shadow-md' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Method Detail Cards */}
        <AnimatePresence mode="wait">
          {activeMethod === 'instapay' && (
            <motion.div
              key="instapay"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-12 gap-6 items-stretch"
            >
              {/* Instapay Card details */}
              <div className="md:col-span-7 custom-panel !mb-0 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="arabic-serif text-lg font-bold text-stone-900">شرح التبرع عبر InstaPay</h3>
                      <p className="arabic-sans text-stone-400 text-2xs">عبر أي تطبيق بنكي مشترك في شبكة المدفوعات اللحظية المصرية</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3.5 pr-2">
                    {[
                      'افتح تطبيق InstaPay على هاتفك المحمول.',
                      'اختر خدمة "إرسال نقود" (Send Money) من الصفحة الرئيسية.',
                      'اضغط على خيار الدفع بواسطة "حساب بنكي" (Bank Account).',
                      'اختر "بنك القاهرة" ثم أدخل رقم حساب الكنيسة الرسمي الموضح بالجانب.',
                      'اكتب المبلغ المراد تحويله، ثم اضغط على إرسال وأدخل الرقم السري IPN PIN لتأكيد التحويل.'
                    ].map((step, idx) => (
                      <div key={idx} className="flex gap-3 text-xs leading-relaxed text-stone-600 font-medium">
                        <span className="font-bold text-indigo-600 bg-indigo-50/70 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instapay Tech Visual Mock Card */}
              <div className="md:col-span-5 bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white rounded-[24px] p-6 lg:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                
                {/* Visual Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                      <Smartphone className="w-4 h-4 text-indigo-300" />
                    </div>
                    <span className="font-sans font-bold text-xs tracking-wider uppercase text-indigo-200">Instant Payments</span>
                  </div>
                </div>

                {/* Main Visual Block */}
                <div className="my-6 space-y-4">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-indigo-200">
                      <span>حساب انستاباي بالبنك</span>
                      <span>InstaPay Account</span>
                    </div>
                    
                    <div className="space-y-2.5 text-right">
                      <div>
                        <span className="text-[10px] text-stone-300 block">الاسم المستفيد</span>
                        <span className="arabic-serif font-bold text-xs text-white leading-relaxed block">كنيسه مارمرقس القبطيه الارثوذكسيه بشبرا</span>
                      </div>
                      
                      <div className="border-t border-white/5 pt-2.5 flex justify-between items-center gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-stone-300 block">رقم الحساب</span>
                          <span className="font-sans font-bold text-sm text-yellow-300 tracking-wider block">{instapayAccountNum}</span>
                          <span className="arabic-sans text-xs text-yellow-300 font-medium block">٠١٠١٥٠١٠٠٠٠٥٥٤</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(instapayAccountNum, 'instapay')}
                          className={`p-2 rounded-xl transition-all shrink-0 ${
                            copiedField === 'instapay'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white'
                          }`}
                          title="نسخ رقم التفويض/الحساب"
                        >
                          {copiedField === 'instapay' ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2.5">
                        <div>
                          <span className="text-[10px] text-stone-300 block">البنك</span>
                          <span className="arabic-sans font-bold text-xs text-white">بنك القاهرة</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-300 block">الفرع</span>
                          <span className="arabic-sans font-bold text-xs text-white">فرع خلوصي</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeMethod === 'bank' && (
            <motion.div
              key="bank"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Bank Accounts Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {bankAccounts.map((account, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white rounded-3xl border border-stone-200 p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 bg-gold/10 text-gold rounded-xl flex items-center justify-center">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="arabic-serif text-sm font-bold text-stone-900 leading-tight">{account.bankName}</h3>
                            <span className="text-[10px] text-stone-500 font-sans">{account.branch}</span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-500/10 text-amber-700 font-bold arabic-sans px-2.5 py-1 rounded-full">{account.currency}</span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100/80 space-y-1">
                        <span className="text-[9px] font-bold text-stone-400 font-sans block uppercase">Account Name / اسم الحساب</span>
                        <p className="arabic-sans text-xs font-bold text-stone-800 leading-normal">{account.accountName}</p>
                      </div>

                      {/* Church ID Field */}
                      {account.churchId && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 font-sans font-sans">
                            <span>CHURCH ID (المعرف الكنسي)</span>
                            <span>كود التعريف</span>
                          </div>
                          <div className="flex items-center justify-between bg-white border border-stone-100 p-2.5 rounded-xl">
                            <span className="font-sans font-bold text-stone-800 tracking-wider text-xs select-all">{account.churchId}</span>
                            <button
                              onClick={() => copyToClipboard(account.churchId!, `${idx}-churchid`)}
                              className={`flex items-center gap-1 text-[10px] font-bold arabic-sans px-2.5 py-1 rounded-lg transition-all ${
                                copiedField === `${idx}-churchid`
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-stone-100 hover:bg-gold hover:text-white text-stone-600'
                              }`}
                            >
                              {copiedField === `${idx}-churchid` ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>تم النسخ</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>نسخ الكود</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Account Number Field */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 font-sans">
                          <span>ACCOUNT NUMBER</span>
                          <span>رقم الحساب</span>
                        </div>
                        <div className="flex items-center justify-between bg-white border border-stone-100 p-2.5 rounded-xl">
                          <span className="font-sans font-bold text-stone-800 tracking-wider text-xs select-all">{account.accountNumber}</span>
                          <button
                            onClick={() => copyToClipboard(account.accountNumber, `${idx}-acc`)}
                            className={`flex items-center gap-1 text-[10px] font-bold arabic-sans px-2.5 py-1 rounded-lg transition-all ${
                              copiedField === `${idx}-acc`
                                ? 'bg-emerald-500 text-white'
                                : 'bg-stone-100 hover:bg-gold hover:text-white text-stone-600'
                            }`}
                          >
                            {copiedField === `${idx}-acc` ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>تم النسخ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>نسخ الرقم</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* IBAN Field */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 font-sans">
                          <span>IBAN (الآيبان الدولي)</span>
                          <span>رقم الحساب الدولي</span>
                        </div>
                        <div className="flex items-center justify-between bg-white border border-stone-100 p-2.5 rounded-xl">
                          <span className="font-sans font-bold text-stone-700 tracking-tight text-[10px] break-all max-w-[70%] select-all" dir="ltr">{account.iban}</span>
                          <button
                            onClick={() => copyToClipboard(account.iban, `${idx}-iban`)}
                            className={`flex items-center gap-1 text-[10px] font-bold arabic-sans px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                              copiedField === `${idx}-iban`
                                ? 'bg-emerald-500 text-white'
                                : 'bg-stone-100 hover:bg-gold hover:text-white text-stone-600'
                            }`}
                          >
                            {copiedField === `${idx}-iban` ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>تم النسخ</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>نسخ الحساب</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-stone-100 pt-3 text-[10px] text-stone-400 flex justify-between items-center font-sans">
                      <span>SWIFT: {account.swift}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Church Address & Contact Box from flyer */}
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-right">
                <div className="space-y-1">
                  <span className="arabic-sans font-bold text-xs text-stone-850 block">كنيسة الشهيد العظيم مارمرقس الرسول القبطية الارثوذكسية – بحدائق شبرا</span>
                  <p className="arabic-sans text-stone-600 text-[11px] leading-relaxed">
                    العنوان الرسمي: ٣٧ ش عبد اللطيف الفحام – شبرا مصر
                  </p>
                </div>
                <div className="border-r border-stone-200 pr-4 shrink-0 font-sans py-1 text-right md:text-left md:border-r-0 md:pr-0">
                  <span className="arabic-sans text-[10px] text-stone-400 block">رقم هاتف الكنيسة للتأكيد والاستفسار</span>
                  <a href="tel:0222059340" className="font-sans text-xs font-bold text-stone-800 hover:text-gold block" dir="ltr">
                    (02) 22059340
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {activeMethod === 'cash' && (
            <motion.div
              key="cash"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="custom-panel !mb-0 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 text-gold rounded-xl flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="arabic-serif text-lg font-bold text-stone-900">التبرع النقدي المباشر بالكنيسة</h3>
                  <p className="arabic-sans text-stone-400 text-2xs">عن طريق زيارة مكتب العلاقات المالية الاشتراكات والسكرتارية بالكنيسة</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'مكتب سكرتارية الاشتراكات',
                    desc: 'يتواجد موظفو الحسابات يومياً بمقر السكرتارية بالطابق الأرضي في الكنيسة، ويتم إصدار شهادة استلام تبرع (إيصال رسمي معتمد) مختومة وخاصة بنوع تبرعك.'
                  },
                  {
                    title: 'مواعيد العمل والاستقبال',
                    desc: 'المكتب مفتوح لاستقبالكم طوال أيام الأسبوع من الساعة ٩:٠٠ صباحاً وحتى الساعة ٩:٠٠ مساءً، ما عدا فترات إقامة القداسات الصباحية الهامة والمناسبات الكنسية.'
                  },
                  {
                    title: 'مع الآباء الكهنة مباشرة',
                    desc: 'يمكنكم تقديم التبرعات الرمزية أو العطايا العينية لسر الاعتراف والإرشاد إلى الآباء الكهنة مباشرة عقب القداس الإلهي، أو بالتنسيق مع وكيل الحسابات المالي.'
                  }
                ].map((box, id) => (
                  <div key={id} className="bg-white p-5 rounded-2xl border border-stone-150 shadow-sm space-y-2">
                    <h4 className="arabic-sans font-bold text-stone-800 text-sm border-r-3 border-gold pr-2.5">{box.title}</h4>
                    <p className="arabic-sans text-xs text-stone-500 leading-relaxed text-justify">{box.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 gap-4">
                <div className="flex items-center gap-2 text-stone-600 text-xs text-right">
                  <Info className="w-4.5 h-4.5 text-gold shrink-0" />
                  <span className="arabic-sans">لأي تساؤلات مالية خاصة بالتبرعات والوقف الاستثماري، يرجى التنسيق والاتصال على الرقم الخاص بالأب الوكيل المالي: <strong className="font-bold underline text-stone-900">0224316533</strong></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
