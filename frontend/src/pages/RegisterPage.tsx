import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TrendingUp, Mail, Lock, User, ArrowRight, Moon, Sun, Eye, EyeOff, ShieldCheck, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { registerApi } from '../api/auth';

export const RegisterPage = () => {
  const { login } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { token, user } = await registerApi(form.name, form.email, form.password, form.role);
      login(token, user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field: keyof typeof errors) =>
    `w-full py-2.5 rounded-xl border text-sm outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 ${
      errors[field] ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
    }`;

  const perks = [
    { icon: ShieldCheck, title: 'Secure by default', desc: 'JWT auth with bcrypt password hashing' },
    { icon: Briefcase, title: 'Role-based access', desc: 'Admin and Sales roles with fine-grained permissions' },
    { icon: TrendingUp, title: 'Real-time insights', desc: 'Track leads across every stage of your pipeline' },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-950">

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex w-[480px] flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 flex-col justify-between p-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">SmartLeads</span>
        </div>

        {/* Perks */}
        <div className="relative z-10 space-y-3">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon size={17} className="text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{title}</div>
                <div className="text-indigo-200 text-xs mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-indigo-200 text-sm">Start managing your leads in under 2 minutes.</p>
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
            <span className="text-sm text-gray-400">Have an account?</span>
            <Link to="/login" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1.5">Create account</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Join SmartLeads and start tracking leads</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className={`${inputCls('name')} pl-10 pr-4`} />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={`${inputCls('email')} pl-10 pr-4`} />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" className={`${inputCls('password')} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'sales', label: 'Sales User', icon: Briefcase },
                    { value: 'admin', label: 'Admin', icon: ShieldCheck },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm({ ...form, role: value })}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                        form.role === value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 mt-2"
              >
                {loading
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <> Create Account <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /> </>
                }
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
