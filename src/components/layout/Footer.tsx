import { Link } from 'react-router-dom'
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 border-t border-white/5 relative overflow-hidden">
      {/* Subtle moss glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-moss-400/5 blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.svg" alt="BizNex Logo" className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold font-display tracking-tight">
                <span className="text-white">Biz</span>
                <span className="text-moss-400">Nex</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering rural entrepreneurs with AI-driven business advisory and financial solutions.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#features" className="hover:text-moss-400 transition-colors">Market Analysis</a></li>
              <li><a href="#features" className="hover:text-moss-400 transition-colors">Business Plans</a></li>
              <li><a href="#features" className="hover:text-moss-400 transition-colors">Scheme Finder</a></li>
              <li><a href="#features" className="hover:text-moss-400 transition-colors">Loan Calculator</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#schemes" className="hover:text-moss-400 transition-colors">Government Schemes</a></li>
              <li><a href="#how-it-works" className="hover:text-moss-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-moss-400 transition-colors">Documentation</a></li>
              <li><a href="#contact" className="hover:text-moss-400 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
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
                  className="p-2.5 rounded-xl glass hover:bg-moss-400/10 hover:border-moss-400/30 transition-all duration-300 text-gray-500 hover:text-moss-400"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © 2024 BizNex. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1.5">
            Made with <Heart size={14} className="text-moss-400 fill-moss-400" /> for Rural India
          </p>
        </div>
      </div>
    </footer>
  )
}
