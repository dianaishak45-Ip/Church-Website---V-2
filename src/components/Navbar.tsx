import { Calendar, Home, Book, LayoutGrid, History, Users } from 'lucide-react';
import logoImg from '../images/logo.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'history', label: 'تاريخ الكنيسة', icon: History },
    { id: 'clergy', label: 'الآباء الكهنة', icon: Users },
    { id: 'readings', label: 'القراءات', icon: Book },
    { id: 'services', label: 'خدمات الكنيسة', icon: LayoutGrid },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto bg-white/95 backdrop-blur-md border-t lg:border-t-0 lg:border-b-2 border-gold/20 lg:border-gold z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="p-1 bg-white rounded-xl shadow-sm border border-gold/10">
              <img 
                src={logoImg} 
                alt="Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="arabic-serif font-bold text-xl text-stone-800">كنيسة مارمرقس بشبرا</span>
          </div>
          
          <div className="flex flex-1 overflow-x-auto no-scrollbar lg:justify-end lg:gap-1 px-2 lg:px-0">
            <div className="flex items-center gap-1 lg:gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-xl transition-all min-w-[72px] lg:min-w-0 ${
                      isActive 
                        ? 'text-gold lg:bg-gold/10 font-bold' 
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                    <span className="text-[10px] lg:text-sm arabic-sans whitespace-nowrap">{tab.label}</span>
                    {isActive && (
                      <div className="lg:hidden w-1 h-1 bg-gold rounded-full mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}