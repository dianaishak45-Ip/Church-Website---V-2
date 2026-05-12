import { ChurchEvent, Servant } from './types';

export const EVENTS: ChurchEvent[] = [
  {
    id: '1',
    title: 'القداس الإلهي الأول',
    category: 'mass',
    day: 'الأحد',
    time: '06:00 ص - 08:30 ص',
    description: 'القداس المبكر لخدمة الموظفين والطلاب.'
  },
  {
    id: '2',
    title: 'القداس الإلهي الثاني',
    category: 'mass',
    day: 'الأحد',
    time: '08:30 ص - 11:00 ص',
    description: 'القداس الرئيسي للكنيسة.'
  },
  {
    id: '3',
    title: 'اجتماع الشباب',
    category: 'meeting',
    day: 'الجمعة',
    time: '07:00 م - 09:00 م',
    description: 'اجتماع روحي وترفيهي لشباب الكنيسة.'
  },
  {
    id: '4',
    title: 'مدارس الأحد',
    category: 'activity',
    day: 'الجمعة',
    time: '10:00 ص - 12:00 م',
    description: 'خدمة التربية الكنسية للأطفال.'
  },
  {
    id: '5',
    title: 'قداس الأربعاء',
    category: 'mass',
    day: 'الأربعاء',
    time: '07:00 ص - 09:00 ص',
  }
];

export const SERVANTS: Servant[] = [
  {
    id: 'p1',
    name: 'القمص أنجيلوس ميخائيل',
    role: 'كاهن الكنيسة',
    image: 'https://picsum.photos/seed/priest1/400/400',
    specialty: 'الإرشاد الأسري والاعترافات',
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس']
  },
  {
    id: 'p2',
    name: 'القس بيشوي كمال',
    role: 'كاهن الشباب',
    image: 'https://picsum.photos/seed/priest2/400/400',
    specialty: 'خدمة الشباب والمغتربين',
    availableDays: ['الأحد', 'الجمعة', 'الأربعاء']
  },
  {
    id: 's1',
    name: 'الأستاذ مرقس إدوارد',
    role: 'خادم أمين المرفق',
    image: 'https://picsum.photos/seed/servant1/400/400',
    specialty: 'خدمة أخوة الرب',
    availableDays: ['الإثنين', 'الأربعاء']
  }
];
