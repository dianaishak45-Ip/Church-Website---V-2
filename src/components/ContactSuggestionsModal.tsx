import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X,
  Send, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  User,
  Tags,
  FileText
} from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '../lib/firebase';

type SubjectType = 'اقتراح' | 'استفسار' | 'طلب صلاة' | 'شكر وإشادة';

interface ContactSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSuggestionsModal({ isOpen, onClose }: ContactSuggestionsModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'اقتراح' as SubjectType,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const subjectOptions: { value: SubjectType; label: string; desc: string }[] = [
    { value: 'اقتراح', label: 'اقتراح جديد', desc: 'لمشاركتنا أفكار لتطوير الخدمة والأنشطة' },
    { value: 'استفسار', label: 'استفسار عام', desc: 'للسؤال عن المواعيد أو الخدمات الدينية' },
    { value: 'طلب صلاة', label: 'طلب صلاة / خدمة', desc: 'لإرسال اسمائكم لرفعها بالقداس والصلوات' },
    { value: 'شكر وإشادة', label: 'شكر وتقدير', desc: 'لتوجيه كلمة طيبة للآباء الكهنة أو الخدام' }
  ];

  const validateForm = () => {
    if (!formData.name.trim()) return 'يرجى إدخال الاسم الكامل.';
    if (formData.name.trim().length > 100) return 'الاسم طويل جداً (الحد الأقصى ١٠٠ حرف).';
    if (!formData.message.trim()) return 'يرجى كتابة محتوى الرسالة.';
    if (formData.message.trim().length > 2000) return 'الرسالة طويلة جداً (الحد الأقصى ٢٠٠٠ حرف).';
    
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        return 'صيغة البريد الإلكتروني غير صحيحة.';
      }
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9+\s\-()]{6,30}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        return 'رقم الهاتف غير صحيح (يرجى إدخال أرقام صحيحة).';
      }
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Build document fields strictly following schema and rules
      const payload: Record<string, any> = {
        name: formData.name.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp()
      };

      if (formData.email.trim()) {
        payload.email = formData.email.trim();
      }
      if (formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }
      if (formData.subject) {
        payload.subject = formData.subject;
      }

      // 1. Attempt writing to Firestore as backup if available
      try {
        await addDoc(collection(db, 'suggestions'), payload);
      } catch (fErr) {
        console.warn('[Firestore] Write bypassed or failed:', fErr);
      }

      // 2. Fetch API to submit custom suggestions and send server email
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject,
          message: formData.message.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'فشل إرسال الاقتراح عبر البريد الإلكتروني.');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'اقتراح',
        message: ''
      });
      
      // Auto-close after successful submit with some delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 5000);

    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(
        err.message || 'عذراً، حدث خطأ أثناء إرسال اقتراحك. يرجى مراجعة اتصال الإنترنت الخاص بك أو المحاولة لاحقاً.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[9999]"
          />

          {/* Dialog Panel Wrapper */}
          <div className="fixed inset-0 overflow-y-auto z-[10000] flex items-center justify-center p-2 sm:p-4" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl border border-stone-100 shadow-2xl p-4 sm:p-5 text-right overflow-hidden space-y-3.5 max-h-[95vh] flex flex-col"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 text-stone-400 hover:text-stone-800 transition-colors p-1 hover:bg-stone-50 rounded-full"
                title="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="space-y-1 pb-2 border-b border-stone-100 pr-1 shrink-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/10 text-gold rounded-full text-[9px] font-bold arabic-sans tracking-wider border border-gold/20">
                  <MessageSquare className="w-2.5 h-2.5" />
                  الاقتراحات والتواصل السريع
                </div>
                <h3 className="arabic-serif text-lg font-bold text-stone-900 leading-tight">شاركنا رأيك وطلبك</h3>
                <p className="arabic-sans text-stone-500 text-[10px] sm:text-[11px] leading-relaxed max-w-sm hidden sm:block">
                  يسعدنا استقبال مقترحاتكم واستفساراتكم لإرسالها مباشرة إلى سكرتارية الكنيسة.
                </p>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto no-scrollbar pr-0.5 pl-0.5 flex-1 py-1">
                {/* Subject selector as Dropdown instead of cards */}
                <div className="space-y-1">
                  <label className="arabic-sans text-[10px] font-bold text-stone-700 flex items-center gap-1">
                    <Tags className="w-3 h-3 text-gold" />
                    نوع الرسالة والموضوع <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value as SubjectType })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-xs arabic-sans bg-stone-50/50 font-medium text-stone-800 cursor-pointer"
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value} className="text-stone-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Highly compact grid with 3 columns: Name, Phone, Email */}
                <div className="grid sm:grid-cols-3 gap-2">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="arabic-sans text-[10px] font-bold text-stone-600 flex items-center gap-1">
                      <User className="w-3 h-3 text-stone-400" />
                      الاسم بالكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="الاسم الكامل"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-xs arabic-sans bg-stone-50/30 font-medium text-stone-800"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="arabic-sans text-[10px] font-bold text-stone-600 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      رقم الهاتف (اختياري)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01xxxxxxxxx"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-xs arabic-sans bg-stone-50/30 text-stone-800 text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="arabic-sans text-[10px] font-bold text-stone-600 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-stone-400" />
                      البريد (اختياري)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-xs arabic-sans bg-stone-50/30 text-stone-800 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <label className="arabic-sans text-[10px] font-bold text-stone-600 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-stone-400" />
                    تفاصيل الرسالة أو المقترح <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب هنا مقترحك أو أسماء طلب الصلاة للرفع بالقداس الإلهي..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 outline-none focus:border-gold focus:ring-1 focus:ring-gold/10 text-xs arabic-sans bg-stone-50/30 font-medium leading-relaxed resize-none text-stone-800"
                  />
                </div>

                {/* Inline Alerts inside Modal */}
                <AnimatePresence mode="wait">
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="arabic-sans text-[9px] font-bold leading-normal">
                        تم إرسال رسالتك ومقترحك بنجاح! يسعدنا تلقي دعمكم وتفعيل مقترحاتكم لخدمة الجميع ببركة صلوات القديس مارمرقس.
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-2.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-lg flex items-start gap-2"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="arabic-sans text-[9px] leading-normal font-medium">
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-3 rounded-lg font-bold arabic-sans flex items-center justify-center gap-1.5 text-white shadow-sm transition-all text-[11px] ${
                    loading
                      ? 'bg-stone-400 cursor-not-allowed'
                      : 'bg-stone-900 hover:bg-gold hover:shadow-md'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري الإرسال للبريد...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>إرسال الاقتراح والطلب</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
