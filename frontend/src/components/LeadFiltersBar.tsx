import { Search, X } from 'lucide-react';
import type { LeadFilters as Filters, LeadSource, LeadStatus } from '../types';

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

interface LeadFiltersProps {
  filters: Filters;
  onSearch: (v: string) => void;
  onFilter: (key: keyof Filters, value: string) => void;
}

export const LeadFiltersBar = ({ filters, onSearch, onFilter }: LeadFiltersProps) => {
  const hasActiveFilters = filters.status || filters.source || filters.search;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-9 pr-9 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-400"
            placeholder="Search by name or email..."
            value={filters.search || ''}
            onChange={e => onSearch(e.target.value)}
          />
          {filters.search && (
            <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={filters.sort || 'latest'}
          onChange={e => onFilter('sort', e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all sm:w-36"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={() => { onSearch(''); onFilter('status', ''); onFilter('source', ''); }}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 self-center mr-1">Status:</span>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => onFilter('status', filters.status === s ? '' : s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
              filters.status === s
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            {s}
          </button>
        ))}
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 self-center ml-2 mr-1">Source:</span>
        {SOURCES.map(s => (
          <button
            key={s}
            onClick={() => onFilter('source', filters.source === s ? '' : s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
              filters.source === s
                ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/20'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
