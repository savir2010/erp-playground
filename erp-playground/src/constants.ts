import { 
  LayoutDashboard, 
  Calculator, 
  ShoppingCart, 
  Users, 
  Truck, 
  Warehouse, 
  UserCircle, 
  BarChart3, 
  Settings, 
  Terminal,
  LucideIcon 
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'accounting', label: 'Accounting', icon: Calculator, path: '/accounting' },
  { id: 'procurement', label: 'Procurement', icon: ShoppingCart, path: '/procurement' },
  { id: 'crm', label: 'CRM', icon: Users, path: '/crm' },
  { id: 'logistics', label: 'Logistics', icon: Truck, path: '/logistics' },
  { id: 'warehouse', label: 'Warehouse', icon: Warehouse, path: '/warehouse' },
  { id: 'hr', label: 'HR Management', icon: UserCircle, path: '/hr' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'api-logs', label: 'API Logs', icon: Terminal, path: '/api-logs' },
];

export interface Transaction {
  id: string;
  date: string;
  entity: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  category: string;
}

export const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-001', date: '2024-03-10', entity: 'Global Logistics Inc', amount: 12500.00, status: 'Paid', category: 'Shipping' },
  { id: 'TRX-002', date: '2024-03-11', entity: 'Tech Solutions Ltd', amount: 3400.50, status: 'Pending', category: 'Software' },
  { id: 'TRX-003', date: '2024-03-12', entity: 'Office Depot', amount: 850.00, status: 'Overdue', category: 'Supplies' },
  { id: 'TRX-004', date: '2024-03-12', entity: 'Amazon Web Services', amount: 4200.00, status: 'Paid', category: 'Infrastructure' },
  { id: 'TRX-005', date: '2024-03-13', entity: 'Stripe Payout', amount: 25000.00, status: 'Paid', category: 'Revenue' },
  { id: 'TRX-006', date: '2024-03-14', entity: 'Marketing Agency X', amount: 1500.00, status: 'Pending', category: 'Marketing' },
];
