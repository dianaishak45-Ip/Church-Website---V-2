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
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView onTabChange={setActiveTab} />;
      case 'history': return <HistoryView />;
      case 'saint': return <PatronSaintView />;
      case 'readings': return <DailyReadingsView />;
      case 'services': return <ChurchServicesView />;
      case 'gallery': return <GalleryView />;
      case 'clergy': return <ClergyView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
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

      <Footer onTabChange={setActiveTab} />
    </div>
  );
}

