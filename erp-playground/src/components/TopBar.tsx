import { Search, Bell, User, Plus, ChevronDown } from 'lucide-react';

interface TopBarProps {
  onOpenSettings: () => void;
}

export default function TopBar({ onOpenSettings }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search records, invoices, or help..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-md transition-colors group"
        >
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <User className="w-5 h-5" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-none">Admin User</p>
            <p className="text-[10px] text-slate-500 leading-none mt-1">Enterprise Plan</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          <span>Global Action</span>
        </button>
      </div>
    </header>
  );
}
