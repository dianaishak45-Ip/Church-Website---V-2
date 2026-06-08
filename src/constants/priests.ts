import frMarkosImg from '../assets/images/fr_markos_dawoud.png';
import frEstafanosImg from '../assets/images/fr_estafanos_azer.png';
import frYoussefImg from '../assets/images/fr_youssef_youssef.png';
import frMorkosMonirImg from '../assets/images/fr_morkos_monir.png';
import frMataJosephImg from '../assets/images/fr_mata_joseph.png';
import frYouhanaSaadImg from '../assets/images/fr_youhana_saad.png';
import frLokaFahmyImg from '../assets/images/fr_loka_fahmy.png';
import frMinaMikhail from '../assets/images/fr_mina_mikhail.png';
import frMikhailIbrahimImg from '../assets/images/fr_mikhail_ibrahim.png';
import frMikhailNaguibImg from '../assets/images/fr_mikhail_naguib.png';
import frBemanGeorgeImg from '../assets/images/fr_beman_george.png';
import frMorkosFathyImg from '../assets/images/fr_morkos_fathy.png';
import frLukaKostantinImg from '../assets/images/fr_luka_kostantin.png';
import frBarsoumBoshraImg from '../assets/images/fr_barsoum_boshra.png';
import frKyrillosKamalImg from '../assets/images/fr_kyrillos_kamal.png';
import frAntoniosMofeedImg from '../assets/images/fr_antonios_mofeed.png';
import frBishoyAhdyImg from '../assets/images/fr_bishoy_ahdy.png';
import frYouhanaMahfouzImg from '../assets/images/fr_youhana_mahfouz.jpg';
import frYohanaImg from '../assets/images/fr_yohana_girgis.jpg';
import frPhilopaterSamyImg from '../assets/images/fr_philopater_samy.jpg';

// missing files, use undefined
const PRIEST_PLACEHOLDER = undefined;

export interface Priest {
  name: string;
  ordination: string;
  promotion: string;
  status: 'تنيح' | 'حالي' | 'سابق';
  note: string;
  image?: string;
  title?: string;
  summary?: string[];
  birthDate?: string;
}

export const CLERGY_DATA: Priest[] = [
  {
    name: 'أبونا القمص مرقس داود',
    ordination: '1948 م.',
    promotion: '12 سبتمبر 1975 م.',
    status: 'تنيح',
    note: '',
    image: frMarkosImg,
    title: 'صديق الكتاب المقدس',
    summary: [
      'ولد عام 1897 باسم "حافظ" في إمبابة وتخرج من الكلية الإكليريكية عام 1918 تحت إشراف القديس حبيب جرجس.',
      'ساهم في تأسيس أكثر من 14 كنيسة في الإسكندرية والمنصورة والوجه البحري من خلال نشاطه في جمعية أصدقاء الكتاب المقدس.',
      'خدم في إثيوبيا لمدة 10 سنوات (1944-1954) كمدير ومؤسس للكلية اللاهوتية بأديس أبابا، وأتقن اللغة الأمهرية للتواصل مع شعبه.',
      'أهداه الإمبراطور هيلاسلاسي "نجمة إثيوبيا الذهبية" تقديراً لخدماته الجليلة وتوجيهات الكنيسة الإثيوبية.',
      'رائد الترجمة في العصر الحديث بأكثر من 151 كتاباً، منها تفسير متى هنري وسيرة القديسين أثناسيوس وأنطونيوس.',
      'اشتهر بلقب "صديق الكتاب المقدس" لتعلقه الشديد بكلمة الله وحفظه الفائق للآيات، وكان شعاره "سياسة القلب المفتوح والبيت المفتوح والذهن المفتوح".'
    ]
  },
  {
    name: 'أبونا القمص اسطفانوس عازر سرجيوس',
    ordination: '24 مايو 1966 م.',
    promotion: '19 فبراير 1988 م.',
    status: 'تنيح',
    note: '',
    image: frEstafanosImg,
    title: 'رجل العمل الرعوي والتدبير',
    summary: [
      'نشأ في الكنيسة كخادم وتتلمذ على يد الآباء الرواد (مرقس وميخائل ويوحنا) وسيم في يوم عيد الشهيد إسطفانوس.',
      'اشتهر بلقب "الشاب الشيخ" لوقاره ونضجه المبكر مع احتفاظه بحيوية ونشاط الشباب في الخدمة.',
      'كان شعلة نشاط لا تنطفئ في الافتقاد، وخدمة القرى (المنيرة، سنديون، القشيش)، والاشراف على المبانى والمشاريع الكنسية.',
      'اهتم إهتماماً خاصاً بإخوة الرب والطلبة المغتربين واليتيمات ببيت مار جرجس، وكان عضواً فاعلاً بالمجلس الإكليريكي العام.',
      'تميز بابتسامة وديعة لا تفارق وجهه وقدرة فائقة على حل المشكلات الزوجية والعائلية بروح الحكمة والأبوة.',
      'سجل العديد من المحاضرات اللاهوتية والتعليمية الهامة، وتنيح بسلام عام 1989 تاركاً بصمات معمارية وروحية لا تمحى.'
    ]
  },
  {
    name: 'أبونا القمص يوحنا جرجس',
    ordination: '16 أكتوبر 1960 م.',
    promotion: '14 نوفمبر 1975 م.',
    status: 'تنيح',
    note: '',
    image: frYohanaImg,
    title: 'المعلم والأب',
    summary: [
      'ولد عام 1902 وعمل مدرساً ومفتشاً للتعليم، وسيم كاهناً عام 1960 كأول كاهن يرسّم على مذبح الكنيسة الجديدة.',
      'كان واعظاً ماهراً ومعلماً من الطراز الأول، تميز بفصاحة اللغة العربية وصوته الرخيم الذي جعل عظاته مرجعاً للأجيال.',
      'أدخل القداسات الحبشية المعرّبة لتراث الكنيسة الأرثوذكسية وسجلها بصوته، وكان أول من أسس نظام "القداسين" يوم الجمعة بالقاهرة.',
      'مثل الكنيسة القبطية في مؤتمرات مسكونية عالمية باليونان والفاتيكان، وكان ضمن الوفد الرسمي لاسترجاع رفات مار مرقس عام 1968.',
      'تميز بروح الأبوة والغيرة المقدسة على المذبح والخدمة، وكان عضواً بارزاً في المجلس الإكليريكي العام بالقاهرة.',
      'عاش حياة الإيمان والتدبير الإلهي، واشتهر بشفاعته المستمرة بالسيدة العذراء والشهيد أبانوب النهيسي.'
    ]
  },
  {
    name: 'أبونا القمص ميخائيل إبراهيم يوسف',
    ordination: '16 سبتمبر 1951 م.',
    promotion: 'مايو 1952 م.',
    status: 'تنيح',
    note: '',
    image: frMikhailIbrahimImg,
    title: 'سفير من السماء',
    summary: [
      'ولد عام 1899 واشتهر بلقب "سفير من السماء" لشفافيته الروحية العالية وعيشه حياة الإنجيل المعاش.',
      'سيم كاهناً عام 1951 على كنيسة كفر عبده ثم انتقل للخدمة بكنيسة مار مرقس بشبرا عام 1956، ليكون أحد أعمدتها النيرة.',
      'كان الأب الروحي لقداسة البابا شنودة الثالث والعديد من الآباء المطارنة والأساقفة، وشهد الجميع بقداسة حياته وعمق صلاته.',
      'أرسى مبادئ روحية عميقة في الخدمة منها "مجانية الخدمة" والتواضع التام بعبارته الشهيرة "سامحني يا سيدي".',
      'منحه الله مواهب روحية عديدة منها الشفافية، شفاء الأمراض، وإخراج الشياطين، وكان وجهه يضيء أثناء الصلاة على المذبح.',
      'تنيح بسلام عام 1975 في أسبوع الآلام، ودُفن بجوار مزار القديس مار مرقس بالكاتدرائية بناءً على رغبة قداسة البابا.'
    ]
  },
  {
    name: 'أبونا القمص مينا ميخائيل',
    ordination: '28 مايو 1972 م.',
    promotion: '2 مارس 1975 م.',
    status: 'سابق',
    note: 'يخدم بكنيسة أخرى',
    image: frMinaMikhail
  },
  {
    name: 'أبونا القمص ميخائيل نجيب غالي',
    ordination: '13 إبريل 1975 م.',
    promotion: '3 يونيو 2003 م.',
    status: 'تنيح',
    note: '',
    image: frMikhailNaguibImg
  },
  {
    name: 'أبونا القمص لوقا قسطنطين عوض الله',
    ordination: '14 يناير 1979 م.',
    promotion: '14 نوفمبر 1998 م.',
    status: 'تنيح',
    note: '',
    image: frLukaKostantinImg
  },
  {
    name: 'أبونا القمص بيمن جورج سعيد عبد السيد',
    ordination: '19 فبراير 1988 م.',
    promotion: '17 مارس 2017 م.',
    status: 'حالي',
    note: '',
    image: frBemanGeorgeImg,
    birthDate: '15 سبتمبر 1949 م.'
  },
  {
    name: 'أبونا القمص برسوم بشرى جرجس',
    ordination: '19 فبراير 1988 م.',
    promotion: '17 مارس 2017 م.',
    status: 'حالي',
    note: '',
    image: frBarsoumBoshraImg,
    birthDate: '13 يونيو 1960 م.'
  },
  {
    name: 'أبونا القمص مرقس فتحي صادق حنا',
    ordination: '19 يونيو 1994 م.',
    promotion: '3 مارس 2013 م.',
    status: 'سابق',
    note: 'يخدم بكنيسة أخرى',
    image: frMorkosFathyImg
  },
  {
    name: 'أبونا القمص يوسف يوسف يوسف رزق',
    ordination: '14 نوفمبر 2000 م.',
    promotion: '17 مارس 2022 م.',
    status: 'حالي',
    note: '',
    image: frYoussefImg,
    birthDate: '13 يونيو 1961 م.'
  },
  {
    name: 'أبونا القس كيرلس كمال فخري سوريال',
    ordination: '7 يونيو 2009 م.',
    promotion: '',
    status: 'حالي',
    note: '',
    image: frKyrillosKamalImg,
    birthDate: '20 يناير 1974 م.'
  },
  {
    name: 'أبونا القس أنطونيوس مفيد محارب',
    ordination: '7 يونيو 2009 م.',
    promotion: '',
    status: 'حالي',
    note: '',
    image: frAntoniosMofeedImg,
    birthDate: '30 يناير 1973 م.'
  },
  {
    name: 'أبونا القس ميخائيل مقار ثابت قلته',
    ordination: '7 يونيو 2009 م.',
    promotion: '',
    status: 'حالي',
    note: '',
    image: undefined,
    birthDate: '17 يوليو 1976 م.'
  },
  {
    name: 'أبونا القس مرقس منير سمير ميخائيل',
    ordination: '16 نوفمبر 2014 م.',
    promotion: '',
    status: 'حالي',
    note: '',
    image: frMorkosMonirImg,
    birthDate: '13 سبتمبر 1969 م.'
  },
  {
    name: 'أبونا القس يوحنا محفوظ',
    ordination: '16 نوفمبر 2014 م.',
    promotion: '',
    status: 'تنيح',
    note: '',
    image: frYouhanaMahfouzImg
  },
  {
    name: 'أبونا القس متي جوزيف',
    ordination: '19 فبراير 2026 م.',
    promotion: '',
    status: 'حالي',
    note: '',
    image: frMataJosephImg,
    birthDate: '29 يوليو 1988 م.'
  },
  {
    name: 'أبونا القس لوقا فهمي',
    ordination: '19 فبراير 2026 م.',
    promotion: '',
    status: 'حالي',
    note: '',
    image: frLokaFahmyImg,
    birthDate: '29 أغسطس 1989 م.'
  },
  {
    name: 'أبونا القس يوحنا سعد',
    ordination: '19 فبراير 2026 م.',
    promotion: '',
    status: 'حالي',
    note: '',
    image: frYouhanaSaadImg,
    birthDate: '3 يونيو 1991 م.'
  },
  {
    name: 'أبونا القس بيشوي عهدى',
    ordination: '26 نوفمبر 2022 م.',
    promotion: '',
    status: 'حالي',
    note: '',
    image: frBishoyAhdyImg,
    title: '',
    summary: [],
    birthDate: '15 أبريل 1980 م.'
  },
  {
    name: 'أبونا القس فيلوباتير سامي',
    ordination: '26 نوفمبر 2022 م.',
    promotion: '',
    status: 'حالي',
    note: '',
    image: frPhilopaterSamyImg,
    birthDate: '25 يوليو 1983 م.'
  }
];