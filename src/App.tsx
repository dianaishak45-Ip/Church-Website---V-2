import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import HistoryView from './components/HistoryView';
import ClergyView from './components/ClergyView';
import GalleryView from './components/GalleryView';
import PatronSaintView from './components/PatronSaintView';
import DailyReadingsView from './components/DailyReadingsView';
import ChurchServicesView from './components/ChurchServicesView';
import DonationsView from './components/DonationsView';
import MikhailIbrahimView from './components/MikhailIbrahimView';
import ContactSuggestionsModal from './components/ContactSuggestionsModal';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'contact_suggestions') {
      setIsSuggestionsOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    const [baseTab, subSection] = activeTab.split(':');
    switch (baseTab) {
      case 'home': return <HomeView onTabChange={handleTabChange} onOpenSuggestions={() => setIsSuggestionsOpen(true)} />;
      case 'history': return <HistoryView />;
      case 'saint': return <PatronSaintView />;
      case 'readings': return <DailyReadingsView />;
      case 'services': return <ChurchServicesView initialSection={subSection as any} />;
      case 'gallery': return <GalleryView />;
      case 'clergy': return <ClergyView />;
      case 'abona_mikhail': return <MikhailIbrahimView />;
      case 'donations': return <DonationsView />;
      default: return <HomeView onTabChange={handleTabChange} onOpenSuggestions={() => setIsSuggestionsOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen font-sans relative">
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      <main className="max-w-7xl mx-auto pt-8 lg:pt-32 pb-24 px-4 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onTabChange={handleTabChange} />

      {/* Floating Suggestions & Contact Button */}
      <div className="fixed bottom-6 left-6 lg:bottom-8 lg:left-8 z-50 flex items-center gap-3 group" dir="rtl">
        {/* Tooltip */}
        <div className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-stone-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg border border-white/10 pointer-events-none arabic-sans whitespace-nowrap">
          الاقتراحات والتواصل السريع 💬
        </div>

        {/* FAB Button */}
        <button
          onClick={() => setIsSuggestionsOpen(true)}
          className="w-14 h-14 bg-stone-900 border border-gold/40 text-gold rounded-full flex items-center justify-center hover:bg-gold hover:text-stone-900 shadow-xl transition-all duration-300 relative cursor-pointer group-hover:scale-105 active:scale-95"
          title="الاقتراحات والتواصل"
        >
          {/* Subtle pulse background */}
          <span className="absolute inset-0 rounded-full bg-gold/20 animate-ping opacity-40 duration-1000" />
          
          <MessageSquare className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
        </button>
      </div>

      {/* Suggestions and Contact Form Modal */}
      <ContactSuggestionsModal 
        isOpen={isSuggestionsOpen} 
        onClose={() => setIsSuggestionsOpen(false)} 
      />
    </div>
  );
}