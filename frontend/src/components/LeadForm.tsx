import { useState } from 'react';
import type { Lead, LeadFormData, LeadSource, LeadStatus } from '../types';

const STATUSES: { value: LeadStatus; color: string }[] = [
  { value: 'New', color: 'border-blue-400 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { value: 'Contacted', color: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  { value: 'Qualified', color: 'border-green-400 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' },
  { value: 'Lost', color: 'border-red-400 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400' },
];

const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

interface LeadFormProps {
  initial?: Lead;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
}

const fieldClass = (hasError: boolean) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 ${
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
      : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
  }`;

export const LeadForm = ({ initial, onSubmit, onCancel }: LeadFormProps) => {
  const [form, setForm] = useState<LeadFormData>({
    name: initial?.name || '',
    email: initial?.email || '',
    status: initial?.status || 'New',
    source: initial?.source || 'Website',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try { await onSubmit(form); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Full Name</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className={fieldClass(!!errors.name)} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Email Address</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className={fieldClass(!!errors.email)} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Status</label>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map(({ value, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, status: value })}
              className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                form.status === value ? color : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Source */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Source</label>
        <div className="grid grid-cols-3 gap-2">
          {SOURCES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setForm({ ...form, source: s })}
              className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                form.source === s
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
          {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (initial ? 'Update Lead' : 'Create Lead')}
        </button>
      </div>
    </form>
  );
};
