import { useState, useRef, FormEvent, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartHandshake, 
  Smartphone, 
  Building, 
  Coins, 
  Copy, 
  Check, 
  QrCode, 
  UploadCloud, 
  X, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Info,
  Calendar,
  DollarSign
} from 'lucide-react';
import { db, collection, addDoc, serverTimestamp, isFirestoreAvailable } from '../lib/firebase';
import { useSEO } from '../hooks/useSEO';

type MethodType = 'instapay' | 'bank' | 'cash';

interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swift: string;
  branch: string;
}

export default function DonationsView() {
  useSEO({
    title: 'العطاء والتبرعات - كنيسة مارمرقس بشبرا',
    description: 'ساهم بتبّرعك لدعم خدمات كنيسة القديس مارمرقس الرسولي بشبرا، رعاية أخوة الرب وعمار الكنيسة من خلال حساباتنا البنكية وعبر تطبيق إيستاباي (InstaPay).',
    keywords: 'تبرعات الكنيسة, تبرع مارمرقس شبرا, حساب بنك كنيسة مارمرقس بشبرا, إيستاباي الكنيسة, أخوة الرب شبرا',
  });

  const [activeMethod, setActiveMethod] = useState<MethodType>('instapay');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    amount: '',
    destination: 'تبرع عام وعمار الكنيسة',
    transactionRef: '',
    transactionDate: new Date().toISOString().split('T')[0],
    prayerRequest: '',
  });

  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Bank Data
  const bankAccounts: BankAccount[] = [
    {
      bankName: 'البنك الأهلي المصري (NBE)',
      accountName: 'مطرانية شبرا - كنيسة القديس مارمرقس الرسول بشبرا',
      accountNumber: '10130701441',
      iban: 'EG490003010100000001013070144',
      swift: 'NBEGEGCX',
      branch: 'فرع شبرا',
    },
    {
      bankName: 'بنك الإسكندرية (Alex Bank)',
      accountName: 'كنيسة الشهيد العظيم مارمرقس الرسول بشبرا',
      accountNumber: '144001925001',
      iban: 'EG560022014400000144001925001',
      swift: 'ALEXEGCX',
      branch: 'فرع روض الفرج',
    }
  ];

  const instapayAddress = 'stmarkshoubra@instapay';

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  // Image upload handling
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة كبير جداً. الحد الأقصى المسموح به هو ٥ ميجابايت.');
      return;
    }

    // Check file type
    if (!file.type.match(/image\/*/)) {
      setError('يرجى اختيار صورة صالحة فقط (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptImage(reader.result as string);
      setReceiptName(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const removeReceipt = () => {
    setReceiptImage(null);
    setReceiptName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setError('يرجى إدخال مبلغ تبرع صحيح أكبر من صفر.');
      return;
    }

    setLoading(true);

    try {
      const donationPayload = {
        name: formData.name.trim() || 'فاعل خير',
        phone: formData.phone.trim() || 'غير محدد',
        email: formData.email.trim() || 'غير محدد',
        amount: Number(formData.amount),
        destination: formData.destination,
        transactionRef: formData.transactionRef.trim() || 'غير محدد',
        transactionDate: formData.transactionDate,
        prayerRequest: formData.prayerRequest.trim() || 'لا يوجد',
        method: activeMethod,
        receiptImage: receiptImage || null,
        receiptName: receiptName || null,
        submittedAt: new Date().toISOString(),
      };

      // 1. Attempt writing to Firebase Firestore
      if (isFirestoreAvailable) {
        try {
          await addDoc(collection(db, 'donations'), {
            ...donationPayload,
            createdAt: serverTimestamp()
          });
        } catch (fErr) {
          console.warn('[Firestore] Saving bypassing or offline:', fErr);
        }
      } else {
        console.log('[Firestore] Skipping write because client is offline or unconfigured.');
      }

      // 2. Send email notification via endpoint
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationPayload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'حدث خطأ أثناء معالجة الطلب كنسياً.');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        amount: '',
        destination: 'تبرع عام وعمار الكنيسة',
        transactionRef: '',
        transactionDate: new Date().toISOString().split('T')[0],
        prayerRequest: '',
      });
      setReceiptImage(null);
      setReceiptName(null);

    } catch (err: any) {
      console.error('Donation submission error:', err);
      setError(
        err.message || 'عذراً، حدث خطأ أثناء إرسال الإخطار. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.'
      );
    } finally {
      setLoading(false);
    }
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="purposes-list">
            {[
              { title: 'خدمة أخوة الرب والعائلات المستورة', desc: 'توزيع مساعدات شهرية وعلاج ونفقات معيشية.' },
              { title: 'عمار وصيانة مبنى الكنيسة والخدمات', desc: 'سداد فواتير المرافق، ترميمات وصيانة دورية.' },
              { title: 'أنشطة مدارس الأحد والشباب', desc: 'تجهيز المناهج، الكورسات الروحية، والرحلات.' },
              { title: 'احتياجات الهيكل والمذبح الشريف', desc: 'شراء كير عشور، أواني الخدمة، الأباركة، والقرابين.' }
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
                      'اضغط على خيار الدفع بواسطة "عنوان دفع IPA" (Instapay Address).',
                      'أدخل عنوان دفع الكنيسة الرسمي الموضع بالجانب.',
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

                <div className="flex items-start gap-2.5 p-3 bg-amber-50/60 border border-amber-100 rounded-2xl text-stone-700 text-xs leading-relaxed">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                  <p className="arabic-sans">
                    <strong className="font-bold">ملاحظة هامة:</strong> بعد إتمام التحويل يرجى تصوير شاشة هاتفك (إثبات نجاح العملية) وملء "نموذج إخطار التبرع" بالأسفل لرفع الأسماء بالقداس وإدراج التبرع أوتوماتيكياً في سجلات الدفاتر للمراجعة والتدقيق الكنسي.
                  </p>
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
                  <div>
                    <span className="text-[10px] bg-emerald-500 text-white font-bold arabic-sans px-2.5 py-1 rounded-full shadow-md shadow-emerald-950/20">نشط وحصري ⚡</span>
                  </div>
                </div>

                {/* Main Visual Block */}
                <div className="my-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-stone-300 tracking-wider">Instapay ID (IPA)</span>
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-colors">
                      <span className="font-sans font-semibold tracking-wide text-xs sm:text-sm text-amber-300 select-all" dir="ltr">
                        {instapayAddress}
                      </span>
                      <button
                        onClick={() => copyToClipboard(instapayAddress, 'instapay')}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedField === 'instapay'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 text-stone-300 hover:text-white'
                        }`}
                        title="نسخ العنوان"
                      >
                        {copiedField === 'instapay' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Simulated Decorative QR Code block */}
                  <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-2xl">
                    {/* Simulated QR block layout */}
                    <div className="w-16 h-16 bg-white rounded-xl p-1 shrink-0 flex flex-wrap items-center justify-center relative overflow-hidden shadow-inner">
                      <div className="grid grid-cols-5 gap-0.5 w-[56px] h-[56px] opacity-90">
                        {Array.from({ length: 25 }).map((_, i) => {
                          const isFilled = (i % 2 === 0 && i !== 12) || i < 4 || i > 20 || i % 5 === 0;
                          return (
                            <div 
                              key={i} 
                              className={`w-2.5 h-2.5 rounded-xs ${isFilled ? 'bg-indigo-950' : 'bg-stone-50'}`} 
                            />
                          );
                        })}
                      </div>
                      {/* Cross/St Mark center badge decoration */}
                      <div className="absolute inset-0 m-auto w-5 h-5 bg-stone-900 border border-white rounded-full flex items-center justify-center text-gold text-[8px] font-bold">
                        ✚
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="arabic-sans text-[10px] font-bold text-indigo-200">الرمز السريع للتبرع الفوري</span>
                      <p className="arabic-sans text-[9px] text-stone-300 leading-normal">
                        امسح الرمز بواسطة تطبيق InstaPay أو قم بطلب التحويل لعنوان الدفع مباشرة.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card footer details */}
                <div className="flex justify-between items-center text-[10px] text-indigo-200">
                  <div className="text-right">
                    <span className="opacity-60 block">اسم المستفيد الكنسي</span>
                    <span className="arabic-serif font-bold text-white text-xs mt-0.5 block">كنيسة مارمرقس بشبرا</span>
                  </div>
                  <div className="text-left font-sans">
                    <span className="opacity-60 block">Status</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5 justify-end">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      Online
                    </span>
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
              className="grid sm:grid-cols-2 gap-6"
            >
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
                        <h3 className="arabic-serif text-base font-bold text-stone-900">{account.bankName}</h3>
                      </div>
                      <span className="text-[10px] bg-stone-100 text-stone-500 font-sans px-2 py-0.5 rounded-md">{account.branch}</span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100/80 space-y-1">
                      <span className="text-[9px] font-bold text-stone-400 font-sans block uppercase">Account Name / اسم الحساب</span>
                      <p className="arabic-sans text-xs font-bold text-stone-800 leading-normal">{account.accountName}</p>
                    </div>

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
                        <span>السويفت كود: {account.swift}</span>
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
                    <span className="arabic-sans">التحويل متاح محلياً ودولياً</span>
                  </div>
                </div>
              ))}
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

      {/* Confirmation Form Details */}
      <div className="grid md:grid-cols-12 gap-8 items-start" id="form-section">
        {/* Left Side: Notice Explanation */}
        <div className="md:col-span-4 space-y-6">
          <div className="custom-panel !mb-0 space-y-4">
            <h3 className="arabic-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2.5">إثبات وإخطار التبرع</h3>
            <p className="arabic-sans text-stone-600 text-xs leading-relaxed text-justify">
              خطوتك لإثبات وتحصيل المعاملة عبر الإنترنت تساعد سكرتارية التدقيق المالي في التأكد من ترحيل الدفع لصندوق الرعاية أو الصندوق المختار، بالإضافة لثقة الصلوات وحفظ الدفاتر القانونية.
            </p>
            
            <div className="space-y-3" id="notice-benefits">
              <div className="flex items-start gap-2 text-xs text-stone-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="arabic-sans font-medium">تسجيل التبرع باسمك أو بصورة سرية (فاعل خير).</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-stone-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="arabic-sans font-medium">تحديد وجه الصرف بدقة مئة في المئة.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-stone-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="arabic-sans font-medium">ذكر الأسماء المحددة في مذبح القداس الإلهي بطلب صلاة.</span>
              </div>
            </div>
          </div>

          <div className="custom-panel !mb-0 !bg-gold/5 border !border-gold/20 flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-1">
              <h4 className="arabic-serif font-bold text-stone-850 text-sm">ذكر نفوس الراحلين والمرضى</h4>
              <p className="arabic-sans text-[11px] text-stone-600 leading-relaxed text-justify">
                "لأن من يعترف بي قدام الناس أعترف أنا به أيضاً قدام أبي الذي في السماوات". بمساهمتك وتبرعك، يتم تلاوة طلب صلاة خاص من قِبَل الآباء الموقرين عقب صلوات الصلح والتحاليل بالهيكل الشريف.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="md:col-span-8">
          <div className="custom-panel !mb-0 space-y-5" id="donation-panel">
            <h3 className="arabic-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">نموذج إخطار الكنيسة بالتبرع (إثبات التحويل)</h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="arabic-sans text-xs font-bold text-stone-700">الاسم بالكامل (أو اكتب "فاعل خير")</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="فاعل خير"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 arabic-sans"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="arabic-sans text-xs font-bold text-stone-700 flex justify-between">
                    <span>قيمة التبرع (جنيه مصري) <span className="text-red-500">*</span></span>
                    {formData.amount && !isNaN(Number(formData.amount)) && (
                      <span className="text-[10px] text-gold font-bold">بميزان العطاء والكرم</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="500"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-left font-sans pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400 font-bold text-[10px]">
                      جم (EGP)
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="arabic-sans text-xs font-bold text-stone-700">رقم الهاتف للتواصل أو التأكيد</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-left"
                    dir="ltr"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="arabic-sans text-xs font-bold text-stone-700">البريد الإلكتروني (اختياري)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Donation Destination */}
                <div className="space-y-1">
                  <label className="arabic-sans text-xs font-bold text-stone-700">أوجه الصرف والجهة المستهدفة للبركة</label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 bg-white cursor-pointer font-medium text-stone-700 font-sans"
                  >
                    <option value="تبرع عام وعمار الكنيسة">تبرع عام وعمار الكنيسة 🏠</option>
                    <option value="خدمة أخوة الرب والعائلات المستورة">خدمة أخوة الرب والعائلات المستورة 🤝</option>
                    <option value="شراء احتياجات المذبح والهيكل الشريف">شراء احتياجات المذبح والهيكل الشريف 🏺</option>
                    <option value="احتياجات مدارس الأحد والأنشطة والتعليم">احتياجات مدارس الأحد والأنشطة والتعليم 📖</option>
                    <option value="علاج المرضى والعمليات الجراحية العاجلة">علاج المرضى والعمليات الجراحية العاجلة ⚕️</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="arabic-sans text-xs font-bold text-stone-700">تاريخ المعاملة والتحويل</label>
                  <input
                    type="date"
                    required
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-left font-sans"
                  />
                </div>
              </div>

              {/* Transaction Reference/Operation ID */}
              <div className="space-y-1">
                <label className="arabic-sans text-xs font-bold text-stone-700 flex justify-between">
                  <span>الرقم المرجعي للتحويل / رقم العملية (Reference ID)</span>
                  <span className="text-[10px] text-stone-400">موجود في إيصال إيستاباي أو إشعار البنك</span>
                </label>
                <input
                  type="text"
                  value={formData.transactionRef}
                  onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                  placeholder="مثال: 2541249764 أو غير محدد"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-left font-sans"
                  dir="ltr"
                />
              </div>

              {/* Names to mention in liturgy */}
              <div className="space-y-1">
                <label className="arabic-sans text-xs font-bold text-stone-700">أسماء للذكر في القداس الإلهي والصلوات (طلبات شفاء، سفر، نجاح، نياح نفوس..)</label>
                <textarea
                  rows={2}
                  value={formData.prayerRequest}
                  onChange={(e) => setFormData({ ...formData, prayerRequest: e.target.value })}
                  placeholder="مثال: اذكر يا رب عبيدك (فلان وفلان لطلب الشفاء)، تذكار نياح المرحوم (فلان).."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 resize-none font-medium leading-relaxed text-stone-700"
                />
              </div>

              {/* Upload Receipt Section */}
              <div className="space-y-1.5">
                <label className="arabic-sans text-xs font-bold text-stone-700">صورة إيصال التحويل / لقطة الشاشة (إثبات الدفع)</label>
                
                {receiptImage ? (
                  <div className="relative border border-stone-200 p-3 rounded-2xl bg-stone-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-white">
                        <img src={receiptImage} alt="Receipt thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-right">
                        <span className="arabic-sans font-bold text-xs text-stone-850 block truncate max-w-[200px] sm:max-w-xs">{receiptName}</span>
                        <span className="text-[10px] text-emerald-600 block flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          تم تحميل الصورة بنجاح
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeReceipt}
                      className="p-1.5 hover:bg-red-50 hover:text-red-600 text-stone-400 rounded-full transition-colors"
                      title="إزالة الإيصال"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-gold bg-gold/5' 
                        : 'border-stone-200 hover:border-gold hover:bg-stone-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2 animate-bounce" />
                    <span className="arabic-sans text-xs font-bold text-stone-700 block">اسحب وأفلت صورة الإيصال هنا، أو انقر للتصفح</span>
                    <p className="text-[10px] text-stone-400 mt-1">الملفات المدعومة: JPG, PNG, WebP (الحد الأقصى: ٥ ميجابايت)</p>
                  </div>
                )}
              </div>

              {/* Notifications Container */}
              <AnimatePresence mode="wait">
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-start gap-3 shadow-inner"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="arabic-serif font-bold text-emerald-950 text-sm">تم إرسال إخطار التبرع بنجاح!</h4>
                      <p className="arabic-sans text-xs leading-relaxed opacity-90 text-justify">
                        شكرًا لتعويضكم وعطائكم المقبول ببركة صلوات القديس والشهيد مارمرقس الرسولي. تم تسجيل المعاملة وسيتم رفع قائمة الأسماء المذكورة بالهيكل الشريف لصلوات القداس الإلهي بالبركة والنعمة.
                      </p>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="arabic-sans text-xs leading-relaxed font-semibold">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-2xl font-bold arabic-sans flex items-center justify-center gap-2 text-white shadow-md hover:shadow-lg transition-all text-xs cursor-pointer ${
                  loading
                    ? 'bg-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-gold'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري معالجة وإرسال إثبات التبرع...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4.5 h-4.5" />
                    <span>تأكيد وإرسال إخطار التبرع وعرض الطلبات</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
