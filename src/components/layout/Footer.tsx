import { Link } from 'react-router-dom'
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react'
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
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Features</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><a href="#features" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Market Analysis</a></li>
              <li><a href="#features" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Business Plans</a></li>
              <li><a href="#features" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Scheme Finder</a></li>
              <li><a href="#features" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Loan Calculator</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Resources</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><a href="#schemes" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Government Schemes</a></li>
              <li><a href="#how-it-works" className="hover:underline" style={{ color: 'var(--text-muted)' }}>How It Works</a></li>
              <li><a href="#" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Documentation</a></li>
              <li><a href="#contact" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Support</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Connect</h4>
            <div className="flex gap-2">
              {[
                { icon: Github, label: 'GitHub' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Mail, label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="p-2 rounded-lg transition-all duration-150"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-bright)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2024 BizNex. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            Made with <Heart size={14} style={{ color: 'var(--accent-bright)' }} className="fill-current" /> for Rural India
          </p>
        </div>
      </div>
    </footer>
  )
}
