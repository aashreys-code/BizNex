import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Search, ArrowUpRight, Building2, MapPin, AlertTriangle } from 'lucide-react'

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
                {[
                  { name: 'MUDRA Loan', amount: '₹10 Lakh', match: '95%', tag: 'Best Match' },
                  { name: 'PMEGP', amount: '₹25 Lakh', match: '82%', tag: 'High Eligibility' },
                  { name: 'Stand-Up India', amount: '₹1 Crore', match: '68%', tag: 'Women Entrepreneur' },
                ].map((scheme, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-2.5 rounded-md"
                    style={{ background: i === 0 ? 'var(--accent-dim)' : 'transparent' }}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={14} style={{ color: i === 0 ? 'var(--accent-bright)' : 'var(--text-muted)' }} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{scheme.name}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{scheme.amount}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold" style={{ color: i === 0 ? 'var(--accent-bright)' : 'var(--text-secondary)' }}>
                        {scheme.match}
                      </p>
                      <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{scheme.tag}</p>
                    </div>
                  </div>
                ))}
              </div>
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
