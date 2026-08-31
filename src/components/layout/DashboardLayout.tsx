import { useState, useRef, useEffect, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, TrendingUp, FileText, Search, Calculator,
  MessageSquare, MapPin, DollarSign, Upload, Shield, Building2,
  Menu, X, LogOut, Sun, Moon,  ChevronDown,
  BarChart3, Globe,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useBusiness } from '../../contexts/BusinessContext'

const allLanguages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'मराठी' },
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
  const { t, i18n } = useTranslation()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  const navGroups = [
    {
      label: t('nav.overview'),
      items: [
        { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      ],
    },
    {
      label: t('nav.business'),
      items: [
        { path: '/market-analysis', label: t('nav.marketAnalysis'), icon: TrendingUp },
        { path: '/business-plan', label: t('nav.businessPlan'), icon: FileText },
        { path: '/nearby-competitors', label: t('nav.competitors'), icon: BarChart3 },
        { path: '/insights', label: t('nav.localInsights'), icon: MapPin },
      ],
    },
    {
      label: t('nav.funding'),
      items: [
        { path: '/scheme-finder', label: t('nav.schemeFinder'), icon: Search },
        { path: '/funding-advisor', label: t('nav.fundingAdvisor'), icon: DollarSign },
        { path: '/loan-calculator', label: t('nav.loanCalculator'), icon: Calculator },
      ],
    },
    {
      label: t('nav.tools'),
      items: [
        { path: '/ai-assistant', label: t('nav.aiAssistant'), icon: MessageSquare },
      ],
    },
    {
      label: t('nav.account'),
      items: [
        { path: '/business-profile', label: t('nav.businessProfile'), icon: Building2 },
      ],
    },
  ]

  const allNavItems = navGroups.flatMap(g => g.items)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src={isDark ? '/logo-dark.svg' : '/logo-light.svg'} alt="BizNex" className="w-8 h-8 group-hover:scale-105 transition-transform" />
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                <span style={{ color: 'var(--text-primary)' }}>Biz</span>
                <span style={{ color: 'var(--accent-bright)' }}>Nex</span>
              </span>
            </Link>
          </div>

          {/* Nav Groups */}
          <nav className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
                        style={{
                          background: isActive ? 'var(--accent-dim)' : 'transparent',
                          color: isActive ? 'var(--accent-bright)' : 'var(--text-secondary)',
                          borderLeft: isActive ? '2px solid var(--accent-bright)' : '2px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)'
                            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.background = 'transparent'
                            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                          }
                        }}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            {profile?.role === 'admin' && (
              <div>
                <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                  ADMIN
                </p>
                <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
                  style={{
                    background: location.pathname.startsWith('/admin') ? 'var(--accent-dim)' : 'transparent',
                    color: location.pathname.startsWith('/admin') ? 'var(--accent-bright)' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!location.pathname.startsWith('/admin')) {
                      (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!location.pathname.startsWith('/admin')) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                    }
                  }}
                >
                  <Shield size={16} />
                  Admin Panel
                </Link>
              </div>
            )}
          </nav>

          {/* Bottom */}
          <div className="p-3 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
              >
                <Globe size={16} />
                {allLanguages.find(l => l.code === i18n.language)?.label || 'English'}
                <ChevronDown size={12} className={`ml-auto transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-full rounded-lg overflow-hidden z-50"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-lg)' }}>
                  {allLanguages.map(lang => (
                    <button key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); localStorage.setItem('biznex-lang', lang.code); setLangOpen(false) }}
                      className="w-full text-left px-3 py-1.5 text-[12px] font-medium transition-colors"
                      style={{ color: i18n.language === lang.code ? 'var(--accent-bright)' : 'var(--text-secondary)', background: i18n.language === lang.code ? 'var(--accent-dim)' : 'transparent' }}
                      onMouseEnter={(e) => { if (i18n.language !== lang.code) (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)' }}
                      onMouseLeave={(e) => { if (i18n.language !== lang.code) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? t('nav.lightMode') : t('nav.darkMode')}
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; (e.currentTarget as HTMLElement).style.color = 'var(--danger)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
            >
              <LogOut size={16} />
              {t('nav.signOut')}
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
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 px-4 h-12 flex items-center gap-4"
          style={{
            background: isDark ? 'rgba(20, 20, 20, 0.9)' : 'rgba(240, 237, 228, 0.9)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Open sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1" />

          {/* Business Switcher */}
          {profiles.length > 0 && (
            <select
              value={activeId || ''}
              onChange={(e) => setActiveId(e.target.value)}
              className="input-field text-xs py-1.5 px-2.5 max-w-[160px] cursor-pointer"
              style={{ fontSize: '12px' }}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-lg transition-colors"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent-bright)' }}
              >
                {userInitial}
              </div>
              <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--text-secondary)' }}>{userName}</span>
              <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1.5 w-48 rounded-lg overflow-hidden"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-strong)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  <div className="p-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{userName}</p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{profile?.email}</p>
                  </div>
                  <div className="p-1.5">

                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/business-profile') }}
                      className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
                    >
                      <Building2 size={14} />
                      Business Profiles
                    </button>
                    <button
                      onClick={() => { setDropdownOpen(false); signOut() }}
                      className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
                      style={{ color: 'var(--danger)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <LogOut size={14} />
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
