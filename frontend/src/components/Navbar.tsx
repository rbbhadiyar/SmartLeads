import { Moon, Sun, LogOut, TrendingUp, ChevronDown, LayoutDashboard, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials } from '../utils/formatters';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = getInitials(user?.name || 'User');
  const isAdmin = user?.role === 'admin';

  // Avatar gradient cycles based on initials for variety
  const avatarGradients = [
    'from-indigo-500 to-violet-600',
    'from-violet-500 to-purple-600',
    'from-blue-500 to-indigo-600',
    'from-cyan-500 to-blue-600',
  ];
  const avatarGradient = avatarGradients[(user?.name?.charCodeAt(0) ?? 0) % avatarGradients.length];

  return (
    <nav
      className="sticky top-0 z-50 nav-border"
      style={{
        background: dark
          ? 'rgba(7, 7, 16, 0.72)'
          : 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'saturate(180%) blur(24px)',
        WebkitBackdropFilter: 'saturate(180%) blur(24px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          {/* Animated logo icon */}
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-sm tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              SmartLeads
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide">
              Dashboard
            </span>
          </div>
        </Link>

        {/* ── Nav links (center) ── */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {[
            { to: '/',          label: 'Home',      icon: Home },
            { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          ].map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                {label}
                {active && (
                  <span className="w-1 h-1 rounded-full bg-indigo-500 ml-0.5" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            title={dark ? 'Switch to light' : 'Switch to dark'}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 group"
          >
            <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
            />
            {dark
              ? <Sun size={17} strokeWidth={2} className="relative" />
              : <Moon size={17} strokeWidth={2} className="relative" />
            }
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-0.5" />

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl transition-all ${
                dropdownOpen
                  ? 'bg-gray-100 dark:bg-white/8'
                  : 'hover:bg-gray-100 dark:hover:bg-white/8'
              }`}
              style={dropdownOpen ? { background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' } : {}}
            >
              {/* Avatar with glow */}
              <div className="relative flex-shrink-0">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${avatarGradient} opacity-30 blur-sm`} />
                <div className={`relative w-7 h-7 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xs font-bold`}>
                  {initials}
                </div>
              </div>

              {/* Name + role */}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight max-w-28 truncate">
                  {user?.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-violet-500' : 'bg-indigo-400'}`} />
                  <span className="text-xs text-gray-400 capitalize leading-none">{user?.role}</span>
                </div>
              </div>

              <ChevronDown
                size={13}
                strokeWidth={2.5}
                className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* ── Dropdown ── */}
            {dropdownOpen && (
              <div
                className="dropdown-animate absolute right-0 mt-2 w-60 rounded-2xl overflow-hidden z-50"
                style={{
                  background: dark
                    ? 'rgba(13, 13, 26, 0.92)'
                    : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: dark
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: dark
                    ? '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)'
                    : '0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(99,102,241,0.08)',
                }}
              >
                {/* Profile header */}
                <div className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${avatarGradient} opacity-40 blur-md`} />
                      <div className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                        {initials}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                          isAdmin
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300'
                            : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                        }`}>
                          {isAdmin ? '👑 Admin' : '💼 Sales'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px mx-3" style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

                {/* Menu items */}
                <div className="p-2">
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/20 transition-colors flex-shrink-0">
                      <LogOut size={13} strokeWidth={2.5} />
                    </div>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
