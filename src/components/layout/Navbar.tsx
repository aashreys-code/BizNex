import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, ArrowRight, Globe, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import Button from '../ui/Button'

const allLanguages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'हिन्दी', native: 'Hindi' },
  { code: 'te', label: 'తెలుగు', native: 'Telugu' },
  { code: 'ta', label: 'தமிழ்', native: 'Tamil' },
  { code: 'kn', label: 'ಕನ್ನಡ', native: 'Kannada' },
  { code: 'mr', label: 'मराठी', native: 'Marathi' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { i18n } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = allLanguages.find(l => l.code === i18n.language) || allLanguages[0]

  const isLanding = location.pathname === '/'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: isDark ? 'rgba(20, 20, 20, 0.9)' : 'rgba(240, 237, 228, 0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={isDark ? '/logo-dark.svg' : '/logo-light.svg'} alt="BizNex" className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
              <span style={{ color: 'var(--text-primary)' }}>Biz</span>
              <span style={{ color: 'var(--accent-bright)' }}>Nex</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isLanding && (
              <>
                {[
                  { href: '#features', label: 'Features' },
                  { href: '#how-it-works', label: 'How It Works' },
                  { href: '#team', label: 'Team' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-[13px] font-medium transition-colors duration-150"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-bright)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </a>
                ))}
              </>
            )}

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[13px] font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <Globe size={14} />
                <span className="hidden sm:inline">{currentLang.native}</span>
                <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-lg overflow-hidden z-50"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-lg)' }}>
                  {allLanguages.map(lang => (
                    <button key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); localStorage.setItem('biznex-lang', lang.code); setLangOpen(false) }}
                      className="w-full text-left px-3 py-2 text-[13px] font-medium transition-colors flex items-center gap-2"
                      style={{ color: i18n.language === lang.code ? 'var(--accent-bright)' : 'var(--text-secondary)', background: i18n.language === lang.code ? 'var(--accent-dim)' : 'transparent' }}
                      onMouseEnter={(e) => { if (i18n.language !== lang.code) (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)' }}
                      onMouseLeave={(e) => { if (i18n.language !== lang.code) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[11px] opacity-60">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-bright)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={signOut}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  aria-label="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="group">
                    Get Started
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 rounded-lg"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{ background: isDark ? 'rgba(20, 20, 20, 0.98)' : 'rgba(240, 237, 228, 0.98)', borderTop: '1px solid var(--border)' }}
          >
            <div className="px-4 py-3 space-y-2">
              {isLanding && (
                <>
                  {[
                    { href: '#features', label: 'Features' },
                    { href: '#how-it-works', label: 'How It Works' },
                    { href: '#team', label: 'Team' },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block py-2 text-[13px] font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </>
              )}
              {/* Mobile Language Selector */}
              <div className="py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Language</p>
                <div className="flex flex-wrap gap-1.5">
                  {allLanguages.map(lang => (
                    <button key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); localStorage.setItem('biznex-lang', lang.code) }}
                      className="px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                      style={{ background: i18n.language === lang.code ? 'var(--accent-dim)' : 'var(--bg-surface)', color: i18n.language === lang.code ? 'var(--accent-bright)' : 'var(--text-secondary)', border: `1px solid ${i18n.language === lang.code ? 'var(--accent-bright)' : 'var(--border)'}` }}
                    >
                      {lang.native}
                    </button>
                  ))}
                </div>
              </div>
              {user ? (
                <>
                  <Link to="/dashboard" className="block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" className="w-full" onClick={() => { signOut(); setIsOpen(false) }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" className="block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
