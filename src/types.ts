export interface ChurchEvent {
  id: string;
  title: string;
  category: 'mass' | 'activity' | 'meeting';
  day: string; // e.g., 'الأحد'
  time: string;
  description?: string;
  date?: string;
}

export interface Servant {
  id: string;
  name: string;
  role: string;
  image: string;
  specialty?: string;
  availableDays: string[];
}
