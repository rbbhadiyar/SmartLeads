import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield, Zap, Users, Moon, Sun, TrendingUp, Filter, Download, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const features = [
  { icon: Shield,    title: 'JWT Authentication',  desc: 'Secure login and registration with bcrypt password hashing and protected routes.' },
  { icon: BarChart3, title: 'Lead Analytics',       desc: 'Track leads across all stages — New, Contacted, Qualified, and Lost.' },
  { icon: Filter,    title: 'Advanced Filtering',   desc: 'Filter by status, source, debounced search by name or email. All filters work together.' },
  { icon: Zap,       title: 'Backend Pagination',   desc: 'Skip/limit pagination with metadata. 10 records per page, blazing fast queries.' },
  { icon: Users,     title: 'Role-Based Access',    desc: 'Admin manages all leads. Sales users manage only their own. CSV export for admins.' },
  { icon: Download,  title: 'CSV Export',           desc: 'One-click export of all leads to CSV. Admin-only feature built into the API.' },
];

const mockLeads = [
  { name: 'Ram Bhanwar Bhadiyar', email: 'ram@example.com',    status: 'Qualified', source: 'Website',   statusColor: 'bg-green-100 text-green-700' },
  { name: 'Priya Sharma',         email: 'priya@example.com',  status: 'New',       source: 'Instagram', statusColor: 'bg-blue-100 text-blue-700' },
  { name: 'Arjun Mehta',          email: 'arjun@example.com',  status: 'Contacted', source: 'Referral',  statusColor: 'bg-amber-100 text-amber-700' },
  { name: 'Sneha Patel',          email: 'sneha@example.com',  status: 'Lost',      source: 'Website',   statusColor: 'bg-red-100 text-red-700' },
];

export const LandingPage = () => {
  const { dark, toggleDark } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">SmartLeads</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
          Full-Stack MERN Dashboard
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900 dark:text-white">
          Manage Leads
          <br />
          <span className="text-indigo-600 dark:text-indigo-400">Smarter & Faster</span>
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          A professional lead management dashboard built with React, TypeScript, Node.js, and MongoDB.
          Track, filter, and convert leads with role-based access control.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
          >
            Start for Free <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold px-8 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {[
            { value: '10x',   label: 'Faster Tracking' },
            { value: '100%',  label: 'TypeScript' },
            { value: 'RBAC',  label: 'Role-Based Access' },
            { value: 'REST',  label: 'Clean API' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl">
          {/* Browser bar */}
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 flex justify-center">
              <div className="bg-white dark:bg-gray-700 rounded-md px-4 py-1 text-xs text-gray-400 w-48 text-center">
                localhost:5173/dashboard
              </div>
            </div>
          </div>

          {/* Mock dashboard body */}
          <div className="bg-white dark:bg-gray-900 p-5">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-base font-bold text-gray-900 dark:text-white">Leads Dashboard</div>
                <div className="text-xs text-gray-400 mt-0.5">Welcome back, Ram Bhanwar Bhadiyar</div>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 font-medium">Export CSV</div>
                <div className="px-3 py-1.5 rounded-lg bg-indigo-600 text-xs text-white font-medium">+ Add Lead</div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Total Leads', val: '24', color: 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' },
                { label: 'Qualified',   val: '8',  color: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300' },
                { label: 'Contacted',   val: '6',  color: 'bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300' },
                { label: 'Lost',        val: '3',  color: 'bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-300' },
              ].map((c) => (
                <div key={c.label} className={`rounded-xl p-3 ${c.color}`}>
                  <div className="text-xl font-bold">{c.val}</div>
                  <div className="text-xs opacity-80">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Search bar */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
              <div className="w-28 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2.5 grid grid-cols-5 gap-4">
                {['Name', 'Email', 'Status', 'Source', 'Actions'].map((h) => (
                  <div key={h} className="text-xs font-semibold text-gray-400 uppercase">{h}</div>
                ))}
              </div>
              {mockLeads.map((lead) => (
                <div key={lead.name} className="px-4 py-3 grid grid-cols-5 gap-4 items-center border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{lead.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 truncate">{lead.email}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${lead.statusColor}`}>{lead.status}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{lead.source}</span>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-700" />
                    <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-700" />
                    <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Everything you need</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Built with production-grade patterns and clean architecture.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center mb-4">
                <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-indigo-200 text-lg mb-8 max-w-lg mx-auto">
            Create your account and start managing leads in minutes.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-xl"
          >
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <TrendingUp size={12} className="text-white" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">SmartLeads</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <CheckCircle2 size={14} className="text-green-500" />
            Built with React · TypeScript · Node.js · MongoDB
          </div>
        </div>
      </footer>
    </div>
  );
};
