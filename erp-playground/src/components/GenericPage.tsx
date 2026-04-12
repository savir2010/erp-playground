import { motion } from 'motion/react';
import { SIDEBAR_ITEMS } from '../constants';
import { LucideIcon } from 'lucide-react';

interface GenericPageProps {
  pageId: string;
}

export default function GenericPage({ pageId }: GenericPageProps) {
  const page = SIDEBAR_ITEMS.find(item => item.id === pageId);
  const Icon = page?.icon as LucideIcon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        {Icon && <Icon className="w-10 h-10 text-slate-400" />}
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{page?.label} Module</h2>
      <p className="text-slate-500 max-w-md">
        This is the {page?.label} module playground. In a production environment, this page would contain specific tools and data related to {page?.label.toLowerCase()}.
      </p>
      
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-6 border border-slate-200 rounded-lg bg-white shadow-sm animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-slate-50 rounded w-full mb-2"></div>
            <div className="h-3 bg-slate-50 rounded w-5/6"></div>
          </div>
        ))}
      </div>
      
      <button className="mt-10 px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
        Initialize {page?.label} Setup
      </button>
    </motion.div>
  );
}
