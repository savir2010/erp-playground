import { 
  TrendingUp, 
  Package, 
  Activity, 
  Clock, 
  MoreVertical, 
  Download, 
  Filter, 
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  Share2,
  Archive,
  Lock,
  Unlock,
  Settings,
  HelpCircle,
  FileText,
  Mail
} from 'lucide-react';
import { RECENT_TRANSACTIONS } from '../constants';
import { cn } from '../lib/utils';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useState, FormEvent } from 'react';

const sparklineData = [
  { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 }, 
  { value: 500 }, { value: 900 }, { value: 700 }, { value: 1000 }
];

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
  color: string;
}

function MetricCard({ title, value, change, isPositive, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className={cn("p-2 rounded-md", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="h-10 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? "#10b981" : "#ef4444"} 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        <p className={cn(
          "text-xs font-bold mt-1 flex items-center gap-1",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? "+" : ""}{change}
          <span className="text-slate-400 font-normal">vs last month</span>
        </p>
      </div>
    </div>
  );
}

export default function Dashboard({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [formData, setFormData] = useState({
    entity: '',
    category: 'Software',
    amount: '',
    date: '',
    tags: [] as string[]
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFormSubmit();
    setFormData({ entity: '', category: 'Software', amount: '', date: '', tags: [] });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
        Global logistics
      </h2>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Revenue" 
          value="$1,284,500" 
          change="12.5%" 
          isPositive={true} 
          icon={TrendingUp} 
          color="bg-blue-600"
        />
        <MetricCard 
          title="Active Shipments" 
          value="42" 
          change="8.2%" 
          isPositive={true} 
          icon={Package} 
          color="bg-indigo-600"
        />
        <MetricCard 
          title="System Latency" 
          value="24ms" 
          change="-4.1%" 
          isPositive={false} 
          icon={Activity} 
          color="bg-slate-700"
        />
        <MetricCard 
          title="Pending Approvals" 
          value="18" 
          change="15.0%" 
          isPositive={false} 
          icon={Clock} 
          color="bg-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
            <div className="flex gap-2">
              <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_TRANSACTIONS.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{trx.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{trx.entity}</td>
                    <td className="px-4 py-3 text-slate-600">{trx.category}</td>
                    <td className="px-4 py-3 font-mono font-medium">${trx.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500">{trx.date}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        trx.status === 'Paid' ? "bg-green-100 text-green-700" :
                        trx.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-slate-200 bg-slate-50/30 text-center">
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto">
              <RefreshCw className="w-3 h-3" />
              Load More Transactions
            </button>
          </div>
        </div>

        {/* Quick Entry Form */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Quick Entry</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entity Name</label>
              <input 
                required
                type="text" 
                value={formData.entity}
                onChange={e => setFormData({...formData, entity: e.target.value})}
                placeholder="e.g. Acme Corp" 
                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                >
                  <option>Software</option>
                  <option>Hardware</option>
                  <option>Shipping</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount ($)</label>
                <input 
                  required
                  type="number" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00" 
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</label>
              <input 
                required
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags</label>
              <div className="flex flex-wrap gap-2 p-2 border border-dashed border-slate-200 rounded min-h-[40px]">
                {['Urgent', 'Q1', 'Taxable'].map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold flex items-center gap-1">
                    {tag}
                    <button type="button" className="hover:text-red-500">×</button>
                  </span>
                ))}
                <button type="button" className="text-[10px] font-bold text-blue-600 hover:underline">+ Add Tag</button>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded transition-all active:scale-[0.98] shadow-md"
            >
              Submit Transaction
            </button>
          </form>
        </div>
      </div>

      {/* Button Wall */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Admin Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-all shadow-sm">
            <Plus className="w-3.5 h-3.5" /> Create New
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-all shadow-sm">
            <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 rounded text-xs font-bold hover:bg-slate-50 transition-all">
            <Edit className="w-3.5 h-3.5" /> Edit Config
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded text-xs font-bold hover:bg-slate-200 transition-all">
            <Eye className="w-3.5 h-3.5" /> Preview All
          </button>
          <button
            type="button"
            data-widget-action="export-data"
            className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-blue-600 text-blue-600 rounded text-xs font-bold hover:bg-blue-50 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span data-widget-highlight="export-data">Export Data</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition-all">
            <Archive className="w-3.5 h-3.5" /> Archive Old
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded text-xs font-bold transition-all">
            <Lock className="w-3.5 h-3.5" /> Lock Period
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded text-xs font-bold transition-all">
            <Unlock className="w-3.5 h-3.5" /> Unlock All
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded text-xs font-bold hover:bg-indigo-100 transition-all">
            <Mail className="w-3.5 h-3.5" /> Send Reports
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded text-xs font-bold hover:bg-amber-100 transition-all">
            <HelpCircle className="w-3.5 h-3.5" /> Support Tic
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded text-xs font-bold hover:bg-green-100 transition-all">
            <FileText className="w-3.5 h-3.5" /> Audit Log
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 text-slate-400 rounded text-xs font-bold hover:border-slate-400 hover:text-slate-600 transition-all">
            <Plus className="w-3.5 h-3.5" /> Custom
          </button>
        </div>
      </div>
    </div>
  );
}
