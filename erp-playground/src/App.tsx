import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import SettingsPanel from './components/SettingsPanel';
import Dashboard from './components/Dashboard';
import GenericPage from './components/GenericPage';
import SuccessModal from './components/SuccessModal';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    (window as unknown as { __ERP_ACTIVE_TAB__?: string }).__ERP_ACTIVE_TAB__ =
      activeTab;
    window.dispatchEvent(
      new CustomEvent('erp-active-tab', { detail: { tab: activeTab } }),
    );
  }, [activeTab]);

  const handleFormSubmit = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenSettings={() => setSettingsOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' ? (
                <Dashboard onFormSubmit={handleFormSubmit} />
              ) : (
                <GenericPage pageId={activeTab} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          ERP Playground v2.4.0-build.882 &copy; 2024 Enterprise Solutions Group
        </footer>
      </div>

      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        message="Your transaction has been recorded and synced across the ERP network."
      />

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
