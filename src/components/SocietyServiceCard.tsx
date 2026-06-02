import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { SocietyService } from '../data/churchServicesData';

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.031 0C5.39.002.016 5.378 0 12.019a11.967 11.967 0 0 0 1.6 5.992L0 24l6.155-1.613a11.942 11.942 0 0 0 5.867 1.543l.006.001c6.643 0 12.017-5.376 12.022-12.019A12.014 12.014 0 0 0 12.031 0zm6.544 17.02c-.275.772-1.579 1.488-2.228 1.558-.553.058-1.272.29-3.71-.722-3.116-1.294-5.12-4.46-5.275-4.665-.156-.206-1.25-1.666-1.25-3.181 0-1.516.793-2.26.108-2.585-.275-.083-.712-.132-.992-.132-.234 0-.585.088-.891.424-.311.341-1.185 1.163-1.185 2.836 0 1.674 1.216 3.292 1.383 3.518.167.227 2.394 3.659 5.8 5.132 2.831 1.226 3.504.981 4.175.918.67-.063 2.16-.883 2.463-1.737.303-.854.303-1.587.212-1.737-.091-.151-.341-.24-.712-.424zM12.03 21.796c-1.896-.001-3.754-.51-5.374-1.472l-.386-.23-3.664.961.978-3.57-.253-.404a9.756 9.756 0 0 1-1.5-5.26c.004-5.412 4.406-9.81 9.818-9.81 2.624 0 5.09 1.022 6.945 2.879 1.854 1.856 2.873 4.324 2.871 6.946-.008 5.414-4.412 9.814-9.824 9.814z"/>
  </svg>
);

interface ServiceCardImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  fallbackDesc: string;
  fallbackIcon?: string;
}

function ServiceCardImage({ src, alt, fallbackTitle, fallbackDesc, fallbackIcon }: ServiceCardImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
    img.onerror = () => {
      setIsError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (isError) {
    return (
      <div className="w-full h-[160px] mb-2 flex flex-col items-center justify-center text-center animate-fade-in px-4">
        {fallbackIcon && (
          <div className="w-12 h-12 rounded-3xl bg-amber-500/[0.07] border border-amber-500/10 flex items-center justify-center text-amber-600 mb-2 shadow-sm text-base">
            {fallbackIcon}
          </div>
        )}
        <h4 className="arabic-serif text-sm sm:text-base font-black text-stone-900 mb-1 leading-relaxed">{fallbackTitle}</h4>
        <p className="arabic-sans text-[10.5px] text-stone-500 font-bold leading-normal">{fallbackDesc}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex items-center justify-center relative min-h-0 max-h-[160px] mb-2">
      {!isLoaded && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-stone-300">
          <span className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-amber-500 animate-spin" />
        </div>
      )}
      <img
        src={src}
        loading="eager"
        referrerPolicy="no-referrer"
        className={`max-w-full max-h-full object-contain rounded-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-opacity duration-300 group-hover:scale-102 z-10 ${
          isLoaded ? 'opacity-100' : 'opacity-0 absolute'
        }`}
        alt={alt}
      />
    </div>
  );
}

interface SocietyServiceCardProps {
  service: SocietyService;
  key?: string | number;
}

export default function SocietyServiceCard({ service }: SocietyServiceCardProps) {
  return (
    <div
      id={`service-card-${service.id}`}
      className="group bg-white rounded-3xl border border-stone-200/80 p-6 flex flex-col items-center justify-between text-center hover:border-amber-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm h-[360px] w-full relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-500/[0.01] pointer-events-none" />
      
      {service.id === 'san-mark-marsa' ? (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          <ServiceCardImage
            src="/assets/images/st-mark-marsa.webp"
            alt="سان مارك - بيت مارمرقس بمرسى مطروح"
            fallbackTitle="سان مارك"
            fallbackDesc="بيت مارمرقس بمرسى مطروح"
            fallbackIcon="🏖️"
          />

          {/* WhatsApp Booking section */}
          <div className="mt-auto pt-3 border-t border-stone-100 w-full flex flex-col items-center gap-2 shrink-0" id="marsa-whatsapp-container">
            <span className="arabic-sans text-[11px] text-stone-500 font-bold leading-normal">
              للحجز أو الاستعلام من خلال الواتس :
            </span>
            <a
              href="https://wa.me/201096457504"
              target="_blank"
              rel="noreferrer"
              className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl border border-emerald-200 hover:border-emerald-600 transition-all duration-300 text-xs font-bold shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span className="font-mono text-[12px] leading-none" dir="ltr">01096457504</span>
            </a>
          </div>
        </div>
      ) : service.id === 'obour-land' ? (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          <ServiceCardImage
            src="/assets/images/st-mark-obour.webp"
            alt="أرض الإجلاء بالعبور (تأسست في عام ٢٠٠٨)"
            fallbackTitle="أرض الإجلاء"
            fallbackDesc="تأسست في عام ٢٠٠٨ بالعبور"
            fallbackIcon="🏡"
          />

          {/* Specific Booking details with Phone icon and CTA button */}
          <div className="mt-auto pt-3 border-t border-stone-100 w-full flex flex-col items-center gap-2.5 shrink-0" id="obour-booking-container">
            <span className="arabic-sans text-[11px] text-stone-500 font-bold leading-normal">
              للحجز أو الاستعلام
            </span>
            <a
              href="tel:01224947537"
              className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-900 text-stone-700 hover:text-amber-400 rounded-xl border border-stone-200 hover:border-stone-900 transition-all duration-300 text-xs font-bold shadow-sm select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="arabic-sans">اتصل الآن:</span>
              <span className="font-mono font-black tracking-normal select-all" dir="ltr">01224947537</span>
            </a>
          </div>
        </div>
      ) : service.id === 'st-mark-hospital' ? (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          <ServiceCardImage
            src="/assets/images/st-mark-hospital.webp"
            alt="مستشفى القديس مارمرقس بشبرا"
            fallbackTitle="مستشفى القديس مارمرقس بشبرا"
            fallbackDesc="صرح طبي متكامل لخدمة أهالي شبرا ورعاية طبية متميزة"
            fallbackIcon="🏥"
          />

          {/* Specific Booking details with Phone icon and CTA button */}
          <div className="mt-auto pt-3 border-t border-stone-100 w-full flex flex-col items-center gap-2.5 shrink-0" id="hospital-booking-container">
            <span className="arabic-sans text-[11px] text-stone-500 font-bold leading-normal">
              للحجز أو الاستعلام
            </span>
            <a
              href="tel:01227327025"
              className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-900 text-stone-700 hover:text-amber-400 rounded-xl border border-stone-200 hover:border-stone-900 transition-all duration-300 text-xs font-bold shadow-sm select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="arabic-sans">اتصل الآن:</span>
              <span className="font-mono font-black tracking-normal select-all" dir="ltr">01227327025</span>
            </a>
          </div>
        </div>
      ) : service.id === 'ark-of-salvation' ? (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          <ServiceCardImage
            src="/assets/images/ark-of-salvation.webp"
            alt="بيت سفينة النجاة بوادي النطرون"
            fallbackTitle="بيت سفينة النجاة بوادي النطرون"
            fallbackDesc="بيت للخلوات الروحية ومعسكرات التربية الكنسية والأنشطة الكشفية"
            fallbackIcon="⛵"
          />

          {/* Specific Booking details with Phone icon and CTA button */}
          <div className="mt-auto pt-3 border-t border-stone-100 w-full flex flex-col items-center gap-2.5 shrink-0" id="safina-booking-container">
            <span className="arabic-sans text-[11px] text-stone-500 font-bold leading-normal">
              للحجز أو الاستعلام
            </span>
            <a
              href="tel:01271141331"
              className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-900 text-stone-700 hover:text-amber-400 rounded-xl border border-stone-200 hover:border-stone-900 transition-all duration-300 text-xs font-bold shadow-sm select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="arabic-sans">اتصل الآن:</span>
              <span className="font-mono font-black tracking-normal select-all" dir="ltr">01271141331</span>
            </a>
          </div>
        </div>
      ) : service.id === 'st-mark-nursery-school' ? (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          <ServiceCardImage
            src="/assets/images/st-mark-nursery-school.webp"
            alt="St. Mark Nursery (حضانة مارمرقس النموذجية)"
            fallbackTitle="St. Mark Nursery"
            fallbackDesc="حضانة كنسية لتربية وتأسيس النشء وفقاً لمناهج تفاعلية حديثة"
            fallbackIcon="🧸"
          />

          {/* Specific Booking details with Phone icon and CTA button */}
          <div className="mt-auto pt-3 border-t border-stone-100 w-full flex flex-col items-center gap-2.5 shrink-0" id="nursery-booking-container">
            <span className="arabic-sans text-[11px] text-stone-500 font-bold leading-normal">
              للحجز أو الاستعلام
            </span>
            <a
              href="tel:0224323009"
              className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-900 text-stone-700 hover:text-amber-400 rounded-xl border border-stone-200 hover:border-stone-900 transition-all duration-300 text-xs font-bold shadow-sm select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="arabic-sans">اتصل الآن:</span>
              <span className="font-mono font-black tracking-normal select-all" dir="ltr">0224323009</span>
            </a>
          </div>
        </div>
      ) : service.id === 'dialysis-unit' ? (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          <ServiceCardImage
            src="/assets/images/dialysis-unit.webp"
            alt="وحدة ماري مرقس لأمراض الكلى وغسيل الماكينات"
            fallbackTitle="وحدة ماري مرقس لأمراض الكلى"
            fallbackDesc="رعاية طبية تخصصية متكاملة لمرضى الكلى وغسيل الكلوي التخصصي"
            fallbackIcon="🏥"
          />

          {/* Specific Booking details with Phone icon and CTA button */}
          <div className="mt-auto pt-3 border-t border-stone-100 w-full flex flex-col items-center gap-2.5 shrink-0" id="dialysis-booking-container">
            <span className="arabic-sans text-[11px] text-stone-500 font-bold leading-normal">
              للحجز أو الاستعلام
            </span>
            <a
              href="tel:0222048344"
              className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-900 text-stone-700 hover:text-amber-400 rounded-xl border border-stone-200 hover:border-stone-900 transition-all duration-300 text-xs font-bold shadow-sm select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="arabic-sans">اتصل الآن:</span>
              <span className="font-mono font-black tracking-normal select-all" dir="ltr">0222048344</span>
            </a>
          </div>
        </div>
      ) : service.id === 'wedding-booking' ? (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          <ServiceCardImage
            src="/assets/images/wedding-booking.webp"
            alt="سكرتارية حجز الأفراح والأكاليل الكنسية"
            fallbackTitle="سكرتارية حجز الأفراح"
            fallbackDesc="تنسيق وحجز مواعيد الأكاليل المقدسة والخطوبات بقاعات الكنيسة"
            fallbackIcon="💍"
          />

          {/* Specific Booking details with Phone icon and CTA button */}
          <div className="mt-auto pt-3 border-t border-stone-100 w-full flex flex-col items-center gap-2.5 shrink-0" id="wedding-booking-container">
            <span className="arabic-sans text-[11px] text-stone-500 font-bold leading-normal">
              للحجز أو الاستعلام
            </span>
            <a
              href="tel:0103719185"
              className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-900 text-stone-700 hover:text-amber-400 rounded-xl border border-stone-200 hover:border-stone-900 transition-all duration-300 text-xs font-bold shadow-sm select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="arabic-sans">اتصل الآن:</span>
              <span className="font-mono font-black tracking-normal select-all" dir="ltr">0103719185</span>
            </a>
          </div>
        </div>
      ) : service.id === 'special-needs-nursery' ? (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          <ServiceCardImage
            src="/assets/images/special-needs-nursery.webp"
            alt="حضانة ذوي الاحتياجات الخاصة وتنمية المهارات"
            fallbackTitle="حضانة ذوي الاحتياجات الخاصة"
            fallbackDesc="تأسيس وتعليم مخصص للأطفال الغاليين من ذوي القدرات والاحتياجات"
            fallbackIcon="👼"
          />

          {/* Specific Booking details with Phone icon and CTA button */}
          <div className="mt-auto pt-3 border-t border-stone-100 w-full flex flex-col items-center gap-2.5" id="special-needs-booking-container">
            <span className="arabic-sans text-[11px] text-stone-500 font-bold leading-normal">
              للحجز أو الاستعلام
            </span>
            <a
              href="tel:0222022514"
              className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-900 text-stone-700 hover:text-amber-400 rounded-xl border border-stone-200 hover:border-stone-900 transition-all duration-300 text-xs font-bold shadow-sm select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="arabic-sans">اتصل الآن:</span>
              <span className="font-mono font-black tracking-normal select-all" dir="ltr">0222022514</span>
            </a>
          </div>
        </div>
      ) : service.id === 'virgin-elderly' ? (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          <ServiceCardImage
            src="/assets/images/virgin-elderly.webp"
            alt="دار العذراء ومارمرقس لرعاية المسنات"
            fallbackTitle="دار العذراء ومارمرقس لرعاية المسنات"
            fallbackDesc="رعاية نموذجية كافية وحانية لأمهاتنا كبار السن بإشراف طبي ونفسي وافتقادي متكامل"
            fallbackIcon="👵"
          />

          {/* Specific Booking details with Phone icon and CTA button */}
          <div className="mt-auto pt-3 border-t border-stone-100 w-full flex flex-col items-center gap-2.5" id="elderly-booking-container">
            <span className="arabic-sans text-[11px] text-stone-500 font-bold leading-normal">
              للحجز أو الاستعلام
            </span>
            <a
              href="tel:0222015278"
              className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-900 text-stone-700 hover:text-amber-400 rounded-xl border border-stone-200 hover:border-stone-900 transition-all duration-300 text-xs font-bold shadow-sm select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="arabic-sans">اتصل الآن:</span>
              <span className="font-mono font-black tracking-normal select-all" dir="ltr">0222015278</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
          {/* Content Section */}
          <div className="flex-grow flex items-center justify-center px-1 mb-4">
            <h4 className="relative z-10 arabic-serif text-sm sm:text-base font-extrabold text-stone-900 group-hover:text-amber-900 transition-colors duration-200 leading-relaxed">
              {service.title}
            </h4>
          </div>
        </div>
      )}

      {/* Action Button & Tooltip Wrapper */}
      {service.id !== 'san-mark-marsa' && service.id !== 'obour-land' && service.id !== 'st-mark-hospital' && service.id !== 'ark-of-salvation' && service.id !== 'st-mark-nursery-school' && service.id !== 'dialysis-unit' && service.id !== 'wedding-booking' && service.id !== 'special-needs-nursery' && service.id !== 'virgin-elderly' && (
        <div className="relative group/btn-tooltip w-full">
          {/* Tooltip containing "WhatsApp" or "Call" based on contact method */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-stone-900 text-white text-[11px] font-bold rounded-xl opacity-0 scale-95 pointer-events-none group-hover/btn-tooltip:opacity-100 group-hover/btn-tooltip:scale-100 transition-all duration-250 z-30 shadow-xl whitespace-nowrap flex items-center gap-1.5 border border-stone-800">
            {service.isWhatsapp ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-sans">مراسلة واتساب | WhatsApp</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-sans">اتصال هاتفي | Call</span>
              </>
            )}
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
          </div>

          <a
            href={service.isWhatsapp ? `https://wa.me/${service.phone.replace(/[^0-9]/g, '')}` : `tel:${service.phone}`}
            target={service.isWhatsapp ? "_blank" : undefined}
            rel={service.isWhatsapp ? "noreferrer" : undefined}
            className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-900 text-stone-700 hover:text-amber-400 rounded-xl border border-stone-205 hover:border-stone-900 transition-all duration-300 text-xs font-bold shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {service.isWhatsapp ? (
              <WhatsAppIcon className="w-4 h-4 text-green-500 shrink-0 group-hover/btn-tooltip:text-green-400" />
            ) : (
              <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0 group-hover/btn-tooltip:text-amber-400" />
            )}
            <span className="font-mono text-[11.5px] leading-none" dir="ltr">{service.phone}</span>
          </a>
        </div>
      )}
    </div>
  );
}
