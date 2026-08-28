import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  TrendingUp, FileText, Search, Calculator, MessageSquare,
  MapPin, DollarSign, ArrowRight, Building2,
  CheckCircle2, Store, Plus, Lightbulb, Target,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness } from '../contexts/BusinessContext'
import { ScrollReveal, CountUp } from '../components/react-bits'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const { profile } = useAuth()
  const { profiles, business, isComplete } = useBusiness()

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Panel */}
      <ScrollReveal>
        <div className="surface-elevated p-5 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                Welcome back, {profile?.name || 'Entrepreneur'}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {profile?.village && `${profile.village}, `}
                {profile?.district && `${profile.district}, `}
                {profile?.state}
              </p>
            </div>
            <div className="flex gap-5">
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: 'var(--accent-bright)' }}>
                  <CountUp to={profiles.length} />
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Profiles</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: 'var(--accent-bright)' }}>
                  <CountUp to={isComplete ? 9 : 0} />
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Features Ready</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* No profiles — show create prompt */}
      {profiles.length === 0 && (
        <ScrollReveal delay={0.1}>
          <div className="card p-8 text-center">
            <Building2 size={40} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
            <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Create Your First Business Profile</h3>
            <p className="text-sm mb-5 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Add a business profile to unlock all features — market analysis, schemes,
              loan calculator, competitors, and more.
            </p>
            <Link to="/business-profile">
              <Button>
                <Plus size={16} />
                Create Business Profile
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      )}

      {/* Active profile info */}
      {business && (
        <ScrollReveal delay={0.1}>
          <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-bright)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-dim)' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--accent-bright)' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{business.name}</h3>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    business.businessType,
                    business.location,
                    business.investmentAmount ? `₹${business.investmentAmount.toLocaleString('en-IN')}` : null,
                    business.category,
                  ].filter(Boolean).map((tag, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link to="/business-profile">
                <Button variant="ghost" size="sm">Manage</Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Quick Insights */}
      {isComplete && (
        <div>
          <ScrollReveal delay={0.15}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Lightbulb size={16} style={{ color: 'var(--accent-bright)' }} />
              Quick Insights for {business?.name}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                icon: TrendingUp, label: 'Market Demand', value: '7/10',
                sub: `${business?.businessType} in ${business?.location?.split(',')[0]}`,
                path: '/market-analysis',
              },
              {
                icon: Search, label: 'Eligible Schemes', value: '5+',
                sub: `${business?.category} category`,
                path: '/scheme-finder',
              },
              {
                icon: Calculator, label: 'Loan Eligible', value: `₹${business?.investmentAmount ? (business.investmentAmount * 2).toLocaleString('en-IN') : '—'}`,
                sub: business?.monthlyIncome ? `₹${business.monthlyIncome.toLocaleString('en-IN')}/mo income` : 'Add income for estimate',
                path: '/loan-calculator',
              },
              {
                icon: DollarSign, label: 'Funding Plan', value: `${business?.investmentAmount ? Math.round(business.investmentAmount * 0.3 / 1000) : 0}K own`,
                sub: `${business?.investmentAmount ? `${Math.round(business.investmentAmount * 0.7 / 1000)}K loan + subsidy` : 'Add costs for plan'}`,
                path: '/funding-advisor',
              },
              {
                icon: Store, label: 'Nearby Competitors', value: '5 found',
                sub: `${business?.radius || 10} km radius`,
                path: '/nearby-competitors',
              },
              {
                icon: MapPin, label: 'Local Insights', value: business?.location?.split(',')[0] || '—',
                sub: 'Population, demand, opportunities',
                path: '/insights',
              },
            ].map((card, i) => (
              <ScrollReveal key={i} delay={0.15 + i * 0.04}>
                <Link to={card.path}>
                  <div className="card card-interactive h-full group cursor-pointer p-4">
                    <div className="flex items-start justify-between mb-2">
                      <card.icon size={18} style={{ color: 'var(--accent-bright)' }} />
                      <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
                    <p className="text-base font-bold mb-0.5" style={{ color: 'var(--accent-bright)' }}>{card.value}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{card.sub}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* Next Best Action */}
      {isComplete && (
        <ScrollReveal delay={0.3}>
          <div className="card p-4" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-3">
              <Target size={18} style={{ color: 'var(--accent-bright)' }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--accent-bright)' }}>Recommended Next Step</p>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Apply for MUDRA Kishore</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Based on your investment requirement of ₹{business?.investmentAmount?.toLocaleString('en-IN')}, the MUDRA Kishore category (₹50K–₹5L) is the best fit. Collateral-free with competitive rates.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* All Features */}
      <div>
        <ScrollReveal delay={0.35}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>All Features</h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {[
            { icon: TrendingUp, title: 'Market Analysis', path: '/market-analysis' },
            { icon: FileText, title: 'Business Plan', path: '/business-plan' },
            { icon: Search, title: 'Scheme Finder', path: '/scheme-finder' },
            { icon: Calculator, title: 'Loan Calculator', path: '/loan-calculator' },
            { icon: MessageSquare, title: 'AI Assistant', path: '/ai-assistant' },
            { icon: MapPin, title: 'Local Insights', path: '/insights' },
            { icon: DollarSign, title: 'Funding Advisor', path: '/funding-advisor' },
            { icon: Building2, title: 'Documents', path: '/document-verification' },
            { icon: Store, title: 'Competitors', path: '/nearby-competitors' },
          ].map((action, i) => (
            <ScrollReveal key={i} delay={0.35 + i * 0.03}>
              <Link to={action.path}>
                <div className="card card-interactive group cursor-pointer p-3.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5"
                    style={{ background: 'var(--accent-dim)' }}>
                    <action.icon size={16} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {action.title}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <ScrollReveal delay={0.5}>
        <div className="flex flex-wrap gap-2">
          <Link to="/ai-assistant">
            <Button variant="secondary" size="sm">
              <MessageSquare size={14} />
              Chat with AI
            </Button>
          </Link>
          <Link to="/scheme-finder">
            <Button variant="secondary" size="sm">
              <Search size={14} />
              Find Schemes
            </Button>
          </Link>
          <Link to="/nearby-competitors">
            <Button variant="secondary" size="sm">
              <Store size={14} />
              View Competitors
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    </div>
  )
}
