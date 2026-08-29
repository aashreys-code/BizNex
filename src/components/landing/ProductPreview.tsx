import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Search, ArrowUpRight, Building2, MapPin, AlertTriangle, X, Check, ExternalLink } from 'lucide-react'

export default function ProductPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const [selectedScheme, setSelectedScheme] = useState<number | null>(null)

  const schemeDetails = [
    {
      name: 'MUDRA Loan',
      fullName: 'Pradhan Mantri MUDRA Yojana',
      amount: 'Up to ₹10 Lakh',
      match: '95%',
      tag: 'Best Match',
      description: 'Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. No collateral required.',
      eligibility: ['Non-corporate business', 'Micro or small enterprise', 'Annual turnover up to ₹25 crore'],
      benefits: ['No collateral required', 'Flexible repayment up to 7 years', 'Subsidized interest rates', 'Quick processing'],
      howToApply: 'Apply through any MUDRA lending partner — banks, NBFCs, or MFIs. Submit business plan and KYC documents.',
      color: '#21F1A8',
    },
    {
      name: 'PMEGP',
      fullName: 'Prime Minister Employment Generation Programme',
      amount: 'Up to ₹25 Lakh',
      match: '82%',
      tag: 'High Eligibility',
      description: 'Credit-linked subsidy scheme for generating self-employment through new micro-enterprises.',
      eligibility: ['Age 18+', '8th pass minimum', 'Project cost up to ₹50 lakh (manufacturing) / ₹20 lakh (services)'],
      benefits: ['15–35% subsidy on project cost', 'No income ceiling', 'Covers both manufacturing & services', 'Training provided'],
      howToApply: 'Apply online at kvic.org.in through District Industries Centre. Complete entrepreneurship training.',
      color: '#3b82f6',
    },
    {
      name: 'Stand-Up India',
      fullName: 'Stand-Up India Scheme',
      amount: '₹10 Lakh – ₹1 Crore',
      match: '68%',
      tag: 'Women Entrepreneur',
      description: 'Facilitates bank loans between ₹10 lakh and ₹1 crore for greenfield enterprises by SC/ST or women entrepreneurs.',
      eligibility: ['SC/ST or Woman entrepreneur', 'Age 18+', 'Greenfield enterprise', 'Not a copy of existing enterprise'],
      benefits: ['Loan from ₹10L to ₹1Cr', '7-year repayment period', 'Margin money support available', 'Handholding support'],
      howToApply: 'Apply through standupmitra.in or your nearest bank branch. Refinance through NCGTC.',
      color: '#a78bfa',
    },
  ]

  return (
    <div ref={containerRef} className="relative">
      {/* Browser chrome */}
      <div
        className="rounded-t-xl overflow-hidden"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderBottom: 'none',
        }}
      >
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--text-muted)', opacity: 0.3 }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--text-muted)', opacity: 0.3 }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--text-muted)', opacity: 0.3 }} />
          </div>
          <div
            className="flex-1 ml-3 px-3 py-1 rounded-md text-[11px] font-mono"
            style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            biznex.app/dashboard
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div
        className="rounded-b-xl overflow-hidden"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderTop: 'none',
        }}
      >
        <div className="p-4 md:p-6 space-y-4">
          {/* Top row: Welcome + Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Welcome card */}
            <div
              className="md:col-span-1 p-4 rounded-lg"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                Good Morning
              </p>
              <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Priya Sharma
              </p>
              <div className="flex items-center gap-1.5">
                <MapPin size={12} style={{ color: 'var(--accent-bright)' }} />
                <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  Jaipur, Rajasthan
                </p>
              </div>
            </div>

            {/* Stat cards */}
            {[
              { icon: TrendingUp, label: 'Market Score', value: '8.2/10', color: 'var(--accent-bright)' },
              { icon: Search, label: 'Eligible Schemes', value: '6 Found', color: '#3b82f6' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-lg flex items-center gap-3"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                  transition: `all 0.5s ease ${0.2 + i * 0.1}s`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${stat.color}12` }}
                >
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                  <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Middle row: Market Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Market demand chart placeholder */}
            <div
              className="p-4 rounded-lg"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s ease 0.4s',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Tailoring Business — Jaipur
                </p>
                <ArrowUpRight size={12} style={{ color: 'var(--accent-bright)' }} />
              </div>
              {/* Mini bar chart */}
              <div className="flex items-end gap-1.5 h-16">
                {[40, 55, 45, 70, 85, 65, 78, 90, 72, 88, 95, 82].map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: isVisible ? `${v}%` : '0%',
                      background: i === 10 ? 'var(--accent-bright)' : 'var(--accent)',
                      opacity: i === 10 ? 0.9 : 0.25,
                      transition: `height 0.6s ease ${0.5 + i * 0.04}s`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Jan</p>
                <p className="text-[10px]" style={{ color: 'var(--accent-bright)' }}>Dec → Peak Demand</p>
              </div>
            </div>

            {/* Scheme recommendation */}
            <div
              className="p-4 rounded-lg"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s ease 0.5s',
              }}
            >
              <p className="text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
                Recommended for You
              </p>
              <div className="space-y-2">
                {schemeDetails.map((scheme, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-2.5 rounded-md cursor-pointer group transition-all duration-150"
                    style={{ background: i === 0 ? 'var(--accent-dim)' : 'transparent' }}
                    onClick={() => setSelectedScheme(i)}
                    onMouseEnter={(e) => {
                      if (i !== 0) e.currentTarget.style.background = 'var(--accent-dim)'
                    }}
                    onMouseLeave={(e) => {
                      if (i !== 0) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={14} style={{ color: i === 0 ? 'var(--accent-bright)' : 'var(--text-muted)' }} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{scheme.name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{scheme.amount}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="text-xs font-bold" style={{ color: i === 0 ? 'var(--accent-bright)' : 'var(--text-secondary)' }}>
                          {scheme.match}
                        </p>
                        <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{scheme.tag}</p>
                      </div>
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Scheme Detail Popup */}
              {selectedScheme !== null && (
                <SchemePopup
                  scheme={schemeDetails[selectedScheme]}
                  onClose={() => setSelectedScheme(null)}
                />
              )}
            </div>
          </div>

          {/* Bottom row: Insights */}
          <div
            className="p-3 rounded-lg flex items-center gap-3"
            style={{
              background: 'rgba(245, 158, 11, 0.06)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 0.5s ease 0.7s',
            }}
          >
            <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
            <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Market Alert:</span>{' '}
              Competitor density in your area increased 12% this quarter. Consider differentiating your service offering.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Scheme Detail Popup ──────────────────────── */
interface SchemePopupProps {
  scheme: {
    name: string
    fullName: string
    amount: string
    match: string
    tag: string
    description: string
    eligibility: string[]
    benefits: string[]
    howToApply: string
    color: string
  }
  onClose: () => void
}

function SchemePopup({ scheme, onClose }: SchemePopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl p-0 overflow-hidden"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          className="px-6 pt-5 pb-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: scheme.color }}
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: `${scheme.color}18`, color: scheme.color }}
                >
                  {scheme.match} Match
                </span>
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {scheme.name}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {scheme.fullName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors shrink-0"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <X size={18} />
            </button>
          </div>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold"
            style={{ background: 'var(--accent-dim)', color: scheme.color }}
          >
            {scheme.amount}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {scheme.description}
          </p>

          {/* Benefits */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Benefits
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {scheme.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <Check size={12} className="mt-0.5 shrink-0" style={{ color: scheme.color }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Eligibility
            </p>
            <div className="space-y-1">
              {scheme.eligibility.map((e, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <span className="text-[10px] font-bold w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'var(--accent-dim)', color: scheme.color }}>
                    {i + 1}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{e}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Apply */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              How to Apply
            </p>
            <p className="text-xs leading-relaxed p-3 rounded-lg" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
              {scheme.howToApply}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
            style={{ background: scheme.color, color: '#0e0e0e' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
