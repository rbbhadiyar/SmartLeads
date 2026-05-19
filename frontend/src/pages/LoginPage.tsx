import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TrendingUp, Mail, Lock, ArrowRight, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loginApi } from '../api/auth';

export const LoginPage = () => {
  const { login } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<typeof form>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = { email: '', password: '' };
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { token, user } = await loginApi(form.email, form.password);
      login(token, user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (err: string) =>
    `w-full py-2.5 rounded-xl border text-sm outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 ${
      err ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
    }`;

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-950">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex w-[480px] flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 flex-col justify-between p-10">
        {/* dot grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">SmartLeads</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-5">
          {/* Mini card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">R</div>
              <div className="min-w-0">
                <div className="text-white font-semibold text-sm truncate">Ram Bhanwar Bhadiyar</div>
                <div className="text-indigo-200 text-xs">New Lead · Website</div>
              </div>
              <div className="ml-auto flex-shrink-0 bg-green-400/20 text-green-300 text-xs px-2.5 py-1 rounded-full font-medium">Qualified</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[['24', 'New'], ['8', 'Contacted'], ['12', 'Qualified']].map(([n, l]) => (
                <div key={l} className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-white font-bold text-lg">{n}</div>
                  <div className="text-indigo-200 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Track every lead,<br />close every deal.</h2>
            <p className="text-indigo-200 text-sm leading-relaxed">Manage your sales pipeline with powerful filters, real-time search, and role-based access control.</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-2 text-indigo-200 text-sm">
          <div className="flex -space-x-2">
            {['A', 'B', 'C'].map(l => (
              <div key={l} className="w-7 h-7 rounded-full bg-white/20 border-2 border-indigo-600 flex items-center justify-center text-white text-xs font-bold">{l}</div>
            ))}
          </div>
          <span>Trusted by sales teams worldwide</span>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <TrendingUp size={13} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">SmartLeads</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <span className="text-sm text-gray-400">No account?</span>
            <Link to="/register" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Sign up</Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1.5">Welcome back</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to your SmartLeads account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`${inputCls(errors.email)} pl-10 pr-4`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className={`${inputCls(errors.password)} pl-10 pr-10`}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 mt-2"
              >
                {loading
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <> Sign In <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /> </>
                }
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
