import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Download, Pencil, Trash2, Eye, Users, Target, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { LeadFiltersBar } from '../components/LeadFiltersBar';
import { LeadForm } from '../components/LeadForm';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/ui/StatusBadge';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { fetchLeads, fetchLeadStats, createLead, updateLead, deleteLead, exportCSV } from '../api/leads';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatDateTime, getInitials } from '../utils/formatters';
import type { Lead, LeadFilters, LeadFormData, PaginationMeta } from '../types';

const DEFAULT_META: PaginationMeta = { total: 0, page: 1, limit: 10, totalPages: 1 };

interface Stats { total: number; qualified: number; contacted: number; lost: number; }

export const DashboardPage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, qualified: 0, contacted: 0, lost: 0 });
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1 });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const [modalState, setModalState] = useState<{ type: 'create' | 'edit' | 'view' | null; lead?: Lead }>({ type: null });
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);

  const refreshStats = useCallback(() => {
    fetchLeadStats()
      .then((data) => setStats({
        total: data.total,
        qualified: data.Qualified,
        contacted: data.Contacted,
        lost: data.Lost,
      }))
      .catch(() => {});
  }, []);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchLeads({ ...filters, search: debouncedSearch || undefined });
      setLeads(res.data);
      setMeta(res.meta);
    } catch {
      setError(true);
      toast.error('Could not connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => { loadLeads(); }, [loadLeads]);
  useEffect(() => { refreshStats(); }, [refreshStats]);

  const handleFilter = (key: keyof LeadFilters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));

  const handleSearch = (v: string) => {
    setSearchInput(v);
    setFilters((f) => ({ ...f, page: 1 }));
  };

  const handleCreate = async (data: LeadFormData) => {
    await createLead(data);
    toast.success('Lead created!');
    setModalState({ type: null });
    loadLeads();
    refreshStats();
  };

  const handleUpdate = async (data: LeadFormData) => {
    await updateLead(modalState.lead!._id, data);
    toast.success('Lead updated!');
    setModalState({ type: null });
    loadLeads();
    refreshStats();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLead(deleteTarget._id);
      toast.success('Lead deleted');
      setDeleteTarget(null);
      loadLeads();
      refreshStats();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Welcome back,{' '}
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">{user?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <button
                onClick={handleExport}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {exporting
                  ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <Download size={15} />}
                Export CSV
              </button>
            )}
            <button
              onClick={() => setModalState({ type: 'create' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
            >
              <Plus size={16} /> Add Lead
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Leads"  value={stats.total}     icon={Users}        bg="bg-indigo-50 dark:bg-indigo-900/30"  iconColor="text-indigo-600 dark:text-indigo-400" />
          <StatCard label="Qualified"    value={stats.qualified} icon={Target}       bg="bg-green-50 dark:bg-green-900/30"    iconColor="text-green-600 dark:text-green-400" />
          <StatCard label="Contacted"    value={stats.contacted} icon={TrendingUp}   bg="bg-amber-50 dark:bg-amber-900/30"    iconColor="text-amber-600 dark:text-amber-400" />
          <StatCard label="Lost"         value={stats.lost}      icon={AlertCircle}  bg="bg-red-50 dark:bg-red-900/30"        iconColor="text-red-500 dark:text-red-400" />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <LeadFiltersBar
            filters={{ ...filters, search: searchInput }}
            onSearch={handleSearch}
            onFilter={handleFilter}
          />
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

          {/* Error state */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <AlertCircle size={26} className="text-red-500" />
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-200">Cannot connect to server</p>
              <p className="text-sm text-gray-400 mt-1 mb-5">Make sure the backend is running on port 5000</p>
              <button
                onClick={loadLeads}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all"
              >
                <RefreshCw size={15} /> Retry
              </button>
            </div>

          /* Loading skeleton */
          ) : loading ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center h-10">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 skeleton rounded-full flex-shrink-0" />
                    <div className="h-3.5 flex-1 skeleton" />
                  </div>
                  <div className="h-3.5 flex-1 skeleton" />
                  <div className="h-6 w-20 skeleton rounded-full" />
                  <div className="h-3.5 w-20 skeleton" />
                  <div className="h-3.5 w-24 skeleton" />
                  <div className="flex gap-1.5">
                    <div className="w-7 h-7 skeleton rounded-lg" />
                    <div className="w-7 h-7 skeleton rounded-lg" />
                    <div className="w-7 h-7 skeleton rounded-lg" />
                  </div>
                </div>
              ))}
            </div>

          /* Empty state */
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Users size={28} className="text-gray-400" />
              </div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">No leads found</p>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                {searchInput || filters.status || filters.source
                  ? 'Try clearing your filters'
                  : 'Add your first lead to get started'}
              </p>
              {!searchInput && !filters.status && !filters.source && (
                <button
                  onClick={() => setModalState({ type: 'create' })}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
                >
                  <Plus size={15} /> Add First Lead
                </button>
              )}
            </div>

          /* Table */
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="group hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {getInitials(lead.name)}
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{lead.email}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={lead.status} /></td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{lead.source}</td>
                      <td className="px-5 py-3.5 text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setModalState({ type: 'view', lead })}
                            className="p-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setModalState({ type: 'edit', lead })}
                            className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(lead)}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && meta.totalPages > 1 && (
          <Pagination meta={meta} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
        )}
      </main>

      {/* ── Modals ── */}
      <Modal open={modalState.type === 'create'} onClose={() => setModalState({ type: null })} title="Add New Lead">
        <LeadForm onSubmit={handleCreate} onCancel={() => setModalState({ type: null })} />
      </Modal>

      <Modal open={modalState.type === 'edit'} onClose={() => setModalState({ type: null })} title="Edit Lead">
        {modalState.lead && (
          <LeadForm initial={modalState.lead} onSubmit={handleUpdate} onCancel={() => setModalState({ type: null })} />
        )}
      </Modal>

      <Modal open={modalState.type === 'view'} onClose={() => setModalState({ type: null })} title="Lead Details">
        {modalState.lead && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {modalState.lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 dark:text-white text-lg truncate">{modalState.lead.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{modalState.lead.email}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                <StatusBadge status={modalState.lead.status} />
              </div>
            </div>
            {[
              { label: 'Source', value: modalState.lead.source },
              { label: 'Created By', value: modalState.lead.createdBy?.name || '—' },
              { label: 'Created At', value: formatDateTime(modalState.lead.createdAt) },
              { label: 'Last Updated', value: formatDateTime(modalState.lead.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Lead">
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Delete "{deleteTarget?.name}"?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
