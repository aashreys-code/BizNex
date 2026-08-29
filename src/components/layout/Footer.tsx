import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function Footer() {
  const { isDark } = useTheme()
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src={isDark ? '/logo-dark.svg' : '/logo-light.svg'} alt="BizNex" className="w-8 h-8 group-hover:scale-105 transition-transform" />
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                <span style={{ color: 'var(--text-primary)' }}>Biz</span>
                <span style={{ color: 'var(--accent-bright)' }}>Nex</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Empowering rural entrepreneurs with AI-driven business advisory and financial solutions.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-3 text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Features</h4>
            <ul className="space-y-2">
              {['Market Analysis', 'Business Plans', 'Scheme Finder', 'Loan Calculator'].map((item) => (
                <li key={item}>
                  <a href="#features" className="text-sm transition-colors duration-150" style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-bright)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3 text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Resources</h4>
            <ul className="space-y-2">
              {[
                { href: '#how-it-works', label: 'How It Works' },
                { href: '#team', label: 'Team' },
                { href: '#contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm transition-colors duration-150" style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-bright)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="font-semibold mb-3 text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Get Started</h4>
            <ul className="space-y-2">
              {[
                { to: '/register', label: 'Create Account' },
                { to: '/login', label: 'Sign In' },
                { href: '#features', label: 'Explore Features' },
              ].map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="text-sm transition-colors duration-150" style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-bright)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm transition-colors duration-150" style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-bright)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2025 BizNex. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            Made with <Heart size={12} style={{ color: 'var(--accent-bright)' }} className="fill-current" /> for Rural India
          </p>
        </div>
      </div>
    </footer>
  )
}
