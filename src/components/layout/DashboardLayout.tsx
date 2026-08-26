import { useState, useRef, useEffect, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard, TrendingUp, FileText, Search, Calculator,
  MessageSquare, MapPin, DollarSign, Upload, Shield, Building2,
  Menu, X, LogOut, Sun, Moon, User, ChevronDown,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useBusiness } from '../../contexts/BusinessContext'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/market-analysis', label: 'Market Analysis', icon: TrendingUp },
  { path: '/business-plan', label: 'Business Plan', icon: FileText },
  { path: '/scheme-finder', label: 'Scheme Finder', icon: Search },
  { path: '/loan-calculator', label: 'Loan Calculator', icon: Calculator },
  { path: '/ai-assistant', label: 'AI Assistant', icon: MessageSquare },
  { path: '/insights', label: 'Local Insights', icon: MapPin },
  { path: '/funding-advisor', label: 'Funding Advisor', icon: DollarSign },
  { path: '/document-verification', label: 'Documents', icon: Upload },
  { path: '/nearby-competitors', label: 'Competitors', icon: MapPin },
  { path: '/business-profile', label: 'Business Profile', icon: Building2 },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const userName = profile?.name || 'User'
  const userInitial = userName[0]?.toUpperCase() || 'U'
  const { isDark, toggleTheme } = useTheme()
  const { profiles, activeId, business, setActiveId } = useBusiness()

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-dark border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-white/5">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.svg" alt="BizPulse Logo" className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold font-display tracking-tight">
                <span className="text-white">Biz</span>
                <span className="text-moss-400">Pulse</span>
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-moss-400/10 text-moss-400 border border-moss-400/20 shadow-lg shadow-moss-400/5'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-moss-400' : ''} />
                  {item.label}
                </Link>
              )
            })}

            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-moss-400/10 text-moss-400 border border-moss-400/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield size={18} />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Active Profile */}
          {profiles.length > 0 && (
            <div className="px-3 py-2 border-t border-white/5">
              <p className="text-xs text-gray-500 mb-2 px-1">Active Business</p>
              <select
                value={activeId || ''}
                onChange={(e) => setActiveId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-moss-400/50 cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-charcoal-900">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Bottom */}
          <div className="p-3 border-t border-white/5 space-y-1">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-moss-400 hover:bg-white/5 transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-dark border-b border-white/5 px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1" />

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-moss-400/20 border border-moss-400/30 flex items-center justify-center text-moss-400 font-bold text-sm">
                {userInitial}
              </div>
              <span className="text-sm font-medium text-white hidden sm:block">{userName}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 glass-dark rounded-xl border border-white/10 shadow-xl overflow-hidden"
                >
                  <div className="p-3 border-b border-white/5">
                    <p className="text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/profile') }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/business-profile') }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Building2 size={16} />
                      Business Profiles
                    </button>
                    <button
                      onClick={() => { setDropdownOpen(false); signOut() }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
