import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp, FileText, Search, Calculator, MessageSquare,
  MapPin, DollarSign, ArrowRight, Building2,
  CheckCircle2, Store, Plus,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness } from '../contexts/BusinessContext'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const { profile } = useAuth()
  const { profiles, business, isComplete } = useBusiness()
  const { t } = useTranslation()

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="surface-elevated p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
              {t('dashboard.welcome', { name: profile?.name || 'Entrepreneur' })}
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
                {profiles.length}
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('dashboard.profiles')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* No profiles */}
      {profiles.length === 0 && (
        <div className="card p-8 text-center">
          <Building2 size={40} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
          <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{t('dashboard.createProfile')}</h3>
          <p className="text-sm mb-5 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {t('dashboard.createProfileDesc')}
          </p>
          <Link to="/business-profile">
            <Button>
              <Plus size={16} />
              {t('dashboard.createBusinessProfile')}
            </Button>
          </Link>
        </div>
      )}

      {/* Active profile info */}
      {business && (
        <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-bright)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--accent-dim)' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--accent-bright)' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{business.name}</h3>
                <span className="badge badge-success">{t('dashboard.activeProfile')}</span>
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
              <Button variant="ghost" size="sm">{t('dashboard.manage')}</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Insights */}
      {isComplete && (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
            {t('dashboard.quickInsights', { name: business?.name })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                icon: TrendingUp, label: t('dashboard.marketDemand'), value: '7/10',
                sub: t('dashboard.typeInLocation', { type: business?.businessType, location: business?.location?.split(',')[0] }),
                path: '/market-analysis',
              },
              {
                icon: Search, label: t('dashboard.eligibleSchemes'), value: '5',
                sub: t('dashboard.category', { category: business?.category }),
                path: '/scheme-finder',
              },
              {
                icon: Calculator, label: t('dashboard.loanEligible'), value: `₹${business?.investmentAmount ? (business.investmentAmount * 2).toLocaleString('en-IN') : '—'}`,
                sub: business?.monthlyIncome ? `₹${business.monthlyIncome.toLocaleString('en-IN')}/mo income` : t('dashboard.addIncomeForEstimate'),
                path: '/loan-calculator',
              },
              {
                icon: DollarSign, label: t('dashboard.fundingPlan'), value: t('dashboard.kOwn', { amount: business?.investmentAmount ? Math.round(business.investmentAmount * 0.3 / 1000) : 0 }),
                sub: business?.investmentAmount ? t('dashboard.kLoanSubsidy', { amount: Math.round(business.investmentAmount * 0.7 / 1000) }) : t('dashboard.addCostsForPlan'),
                path: '/funding-advisor',
              },
              {
                icon: Store, label: t('dashboard.nearbyCompetitors'), value: t('dashboard.found', { count: 5 }),
                sub: t('dashboard.kmRadius', { radius: 12 }),
                path: '/nearby-competitors',
              },
              {
                icon: MapPin, label: t('dashboard.localInsights'), value: business?.location?.split(',')[0] || '—',
                sub: t('dashboard.localInsightsDesc'),
                path: '/insights',
              },
            ].map((card, i) => (
              <Link key={i} to={card.path}>
                <div className="card h-full group cursor-pointer p-4">
                  <div className="flex items-start justify-between mb-2">
                    <card.icon size={18} style={{ color: 'var(--accent-bright)' }} />
                    <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
                  <p className="text-base font-bold mb-0.5" style={{ color: 'var(--accent-bright)' }}>{card.value}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{card.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
