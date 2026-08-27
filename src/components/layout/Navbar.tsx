import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import Button from '../ui/Button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  const isLanding = location.pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.svg" alt="BizNex Logo" className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold font-display tracking-tight">
              <span className="text-white">Biz</span>
              <span className="text-moss-400">Nex</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {isLanding && (
              <>
                <a href="#features" className="text-gray-400 hover:text-moss-400 transition-colors text-sm font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-400 hover:text-moss-400 transition-colors text-sm font-medium">
                  How It Works
                </a>
                <a href="#schemes" className="text-gray-400 hover:text-moss-400 transition-colors text-sm font-medium">
                  Schemes
                </a>
                <a href="#team" className="text-gray-400 hover:text-moss-400 transition-colors text-sm font-medium">
                  Team
                </a>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-moss-400"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-red-400"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="md:hidden glass-dark border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              {isLanding && (
                <>
                  <a href="#features" className="block text-gray-300 hover:text-moss-400 py-2" onClick={() => setIsOpen(false)}>
                    Features
                  </a>
                  <a href="#how-it-works" className="block text-gray-300 hover:text-moss-400 py-2" onClick={() => setIsOpen(false)}>
                    How It Works
                  </a>
                  <a href="#schemes" className="block text-gray-300 hover:text-moss-400 py-2" onClick={() => setIsOpen(false)}>
                    Schemes
                  </a>
                  <a href="#team" className="block text-gray-300 hover:text-moss-400 py-2" onClick={() => setIsOpen(false)}>
                    Team
                  </a>
                </>
              )}
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
