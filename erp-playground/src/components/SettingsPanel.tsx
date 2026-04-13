import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  User,
  CreditCard,
  Bell,
  Shield,
  Users,
  Database,
  Activity,
  HelpCircle,
  Building2,
  Mail,
  Smartphone,
  KeyRound,
  Download,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type SectionId =
  | 'account'
  | 'billing'
  | 'usage'
  | 'notifications'
  | 'security'
  | 'team'
  | 'data'
  | 'support';

const navItems: { id: SectionId; label: string; icon: typeof User }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'billing', label: 'Billing & plan', icon: CreditCard },
  { id: 'usage', label: 'Usage', icon: Activity },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'team', label: 'Team & access', icon: Users },
  { id: 'data', label: 'Data & privacy', icon: Database },
  { id: 'support', label: 'Support', icon: HelpCircle },
];

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description ? (
          <p className="text-xs text-slate-500 mt-0.5 max-w-md">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('account');
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [invoiceAlerts, setInvoiceAlerts] = useState(true);

  useEffect(() => {
    if (isOpen) setActiveSection('account');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    document.getElementById(`settings-section-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <motion.button
            type="button"
            aria-label="Close settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative flex h-full w-full max-w-3xl flex-col bg-slate-50 shadow-2xl border-l border-slate-200"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Settings
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organization, billing, and workspace preferences
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              <nav className="shrink-0 border-b border-slate-200 bg-white px-2 py-3 md:w-52 md:border-b-0 md:border-r md:py-4">
                <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible custom-scrollbar">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal ${
                          activeSection === id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 opacity-80" />
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <section
                  id="settings-section-account"
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                    Account
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 shrink-0">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-3 min-w-0">
                      <div>
                        <p className="text-base font-bold text-slate-900">Admin User</p>
                        <p className="text-sm text-slate-500">admin@enterprise.demo</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          <Building2 className="w-3.5 h-3.5" />
                          Acme Global Logistics
                        </span>
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 border border-amber-100">
                          Owner
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Edit profile
                      </button>
                    </div>
                  </div>
                </section>

                <section
                  id="settings-section-billing"
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                    Billing & plan
                  </h3>
                  <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4 mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-blue-800 uppercase tracking-wide">
                          Current plan
                        </p>
                        <p className="text-lg font-bold text-slate-900 mt-1">
                          Enterprise
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Renews Feb 14, 2026 · $2,400 / month
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        Manage subscription
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium text-slate-500 uppercase">
                        Default payment method
                      </p>
                      <button
                        type="button"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Replace card
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-white shadow-md">
                      <div className="relative px-6 py-8 sm:px-8 sm:py-10 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950">
                        <div className="flex items-start justify-between gap-4">
                          <span className="rounded bg-white/15 px-2 py-1 text-[10px] font-bold tracking-wider text-white/90">
                            VISA CREDIT
                          </span>
                          <span className="text-xs font-medium text-white/60">
                            Primary
                          </span>
                        </div>
                        <p className="mt-8 font-mono text-lg sm:text-xl tracking-[0.2em] text-white/95">
                          4242&nbsp;4242&nbsp;4242&nbsp;4242
                        </p>
                        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 text-sm">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/50">
                              Cardholder
                            </p>
                            <p className="mt-0.5 font-medium tracking-wide">
                              ADMIN USER
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/50">
                              Expires
                            </p>
                            <p className="mt-0.5 font-mono font-medium">09 / 2028</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <dl className="grid gap-x-6 gap-y-4 rounded-lg border border-slate-200 bg-slate-50/80 p-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Payment method ID
                        </dt>
                        <dd className="mt-1 font-mono text-sm text-slate-900 break-all">
                          pm_1QxEnterprise9fK2mL8vDemo
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Fingerprint
                        </dt>
                        <dd className="mt-1 font-mono text-sm text-slate-900 break-all">
                          fp_v1_a1B2c3D4e5F6g7H8i9J0
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Issuer
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900">Chase Bank USA, N.A.</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Country & ZIP
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900">United States · 94107</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Billing address
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900 leading-relaxed">
                          Acme Global Logistics
                          <br />
                          450 Townsend Street, Floor 4
                          <br />
                          San Francisco, CA 94107
                          <br />
                          United States
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          CVC check
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-emerald-700">Passed</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          AVS (address)
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-emerald-700">
                          Match · postal code
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Added on
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900">March 12, 2024 at 9:14 AM PST</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Last charged
                        </dt>
                        <dd className="mt-1 text-sm text-slate-900">January 1, 2026 · INV-2401</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-medium text-slate-500 uppercase mb-2">
                      Recent invoices
                    </p>
                    <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                      {[
                        { id: 'INV-2401', date: 'Jan 1, 2026', amount: '$2,400.00', status: 'Paid' },
                        { id: 'INV-2331', date: 'Dec 1, 2025', amount: '$2,400.00', status: 'Paid' },
                        { id: 'INV-2260', date: 'Nov 1, 2025', amount: '$2,200.00', status: 'Paid' },
                      ].map((inv) => (
                        <li
                          key={inv.id}
                          className="flex items-center justify-between gap-2 bg-white px-4 py-3 text-sm hover:bg-slate-50/80"
                        >
                          <span className="font-mono text-slate-700">{inv.id}</span>
                          <span className="text-slate-500 text-xs hidden sm:inline">
                            {inv.date}
                          </span>
                          <span className="font-medium text-slate-900">{inv.amount}</span>
                          <span className="text-xs font-medium text-emerald-600">{inv.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section
                  id="settings-section-usage"
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                    Usage
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'API requests (this month)', used: 78, cap: 100, unit: 'k' },
                      { label: 'Seats in use', used: 42, cap: 50, unit: '' },
                      { label: 'Attached storage', used: 1.8, cap: 5, unit: ' TB' },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">{row.label}</span>
                          <span className="font-medium text-slate-900">
                            {row.used}
                            {row.unit} / {row.cap}
                            {row.unit}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{ width: `${Math.min(100, (row.used / row.cap) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section
                  id="settings-section-notifications"
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">
                    Notifications
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Choose how we reach you for billing, security, and product updates.
                  </p>
                  <Toggle
                    checked={emailDigest}
                    onChange={setEmailDigest}
                    label="Weekly digest email"
                    description="Summary of shipments, invoices, and exceptions."
                  />
                  <Toggle
                    checked={pushAlerts}
                    onChange={setPushAlerts}
                    label="Browser push alerts"
                    description="Real-time alerts for approvals and SLA breaches."
                  />
                  <Toggle
                    checked={invoiceAlerts}
                    onChange={setInvoiceAlerts}
                    label="Invoice & payment emails"
                    description="Receipts, failed charges, and renewal reminders."
                  />
                </section>

                <section
                  id="settings-section-security"
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                    Security
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <KeyRound className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Password</p>
                          <p className="text-xs text-slate-500">Last changed 94 days ago</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Change
                      </button>
                    </li>
                    <li className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Two-factor authentication
                          </p>
                          <p className="text-xs text-slate-500">Authenticator app</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600">On</span>
                    </li>
                    <li className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Recovery email</p>
                          <p className="text-xs text-slate-500">ops-recovery@acme.demo</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </li>
                  </ul>
                </section>

                <section
                  id="settings-section-team"
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                    Team & access
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-2">Member</th>
                          <th className="px-4 py-2">Role</th>
                          <th className="px-4 py-2 hidden sm:table-cell">Last active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { name: 'Admin User', email: 'admin@enterprise.demo', role: 'Owner', active: 'Now' },
                          { name: 'Jordan Lee', email: 'j.lee@acme.demo', role: 'Finance', active: '2h ago' },
                          { name: 'Sam Rivera', email: 's.rivera@acme.demo', role: 'Ops', active: 'Yesterday' },
                        ].map((u) => (
                          <tr key={u.email} className="bg-white hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <p className="font-medium text-slate-900">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{u.role}</td>
                            <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">
                              {u.active}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Invite member
                  </button>
                </section>

                <section
                  id="settings-section-data"
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                    Data & privacy
                  </h3>
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-slate-400" />
                        <span>
                          <span className="block text-sm font-medium text-slate-900">
                            Export organization data
                          </span>
                          <span className="block text-xs text-slate-500">
                            CSV & JSON bundles for compliance
                          </span>
                        </span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    </button>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Data processing agreement and subprocessors are available in the trust
                      center. Retention defaults to 7 years for financial records unless your
                      policy overrides.
                    </p>
                  </div>
                </section>

                <section
                  id="settings-section-support"
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm mb-2"
                >
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                    Support
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={(e) => e.preventDefault()}
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help center
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                      onClick={(e) => e.preventDefault()}
                    >
                      Contact success manager
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 mt-4">
                    Enterprise SLA: 1h response on critical issues · 24/7 phone queue
                  </p>
                </section>
              </div>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
