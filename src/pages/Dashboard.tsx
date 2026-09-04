import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp, FileText, Search, Calculator, MessageSquare,
  MapPin, DollarSign, ArrowRight, Building2,
  CheckCircle2, Store, Plus, AlertTriangle, Target, BarChart3,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness } from '../contexts/BusinessContext'
import Button from '../components/ui/Button'
import { 
  calculateProjectCost, calculateViabilityScore, recommendSchemes,
  formatCurrency 
} from '../lib/financial-engine'
import { generateFeasibilityReport } from '../lib/feasibility-report'
import { useState } from 'react'

export default function Dashboard() {
  const { profile } = useAuth()
  const { profiles, business, isComplete } = useBusiness()
  const { t } = useTranslation()
  const [downloading, setDownloading] = useState(false)

  function handleDownloadReport() {
    if (!business) return
    setDownloading(true)
    try {
      const doc = generateFeasibilityReport({
        businessName: business.name,
        businessType: business.businessType,
        businessDescription: business.businessDescription,
        location: business.location,
        investmentAmount: business.investmentAmount,
        monthlyIncome: business.monthlyIncome,
        existingLoans: business.existingLoans,
        workingCapital: business.workingCapital,
        equipmentCost: business.equipmentCost,
        age: business.age,
        gender: business.gender,
        category: business.category,
        isNewBusiness: true,
      })
      doc.save(`biznex-feasibility-${business.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } finally {
      setDownloading(false)
    }
  }

  // Build a financial profile from the business context
  const finProfile = business ? {
    availableMargin: business.investmentAmount,
    projectCost: 0,
    businessType: business.businessType,
    monthlyExpectedRevenue: business.monthlyIncome,
    monthlyOperatingCost: Math.round(business.monthlyIncome * 0.65),
    isNewBusiness: true,
    existingLoans: business.existingLoans,
    age: business.age,
    gender: business.gender,
    category: business.category,
    location: business.location,
    isRural: true,
  } : null

  const viability = finProfile ? calculateViabilityScore(finProfile, 0, 6) : null
  const projectBreakdown = business ? calculateProjectCost(business.investmentAmount) : null
  const applicableSchemes = finProfile ? recommendSchemes(finProfile) : []

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

      {/* ─── BIZNEX BUSINESS READINESS SCORE ─── */}
      {business && viability && (
        <div className="card p-5" style={{ borderLeft: '3px solid var(--accent-bright)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--accent-dim)' }}>
                <Target size={20} style={{ color: 'var(--accent-bright)' }} />
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  BIZNEX BUSINESS READINESS
                </h2>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Based on your {business.name} profile
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: 'var(--accent-bright)' }}>
                {viability.totalScore}
                <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/100</span>
              </div>
              <p className="text-xs font-semibold" style={{ 
                color: viability.grade === 'Strong' ? 'var(--success)' : 
                       viability.grade === 'Good' ? 'var(--accent-bright)' :
                       viability.grade === 'Moderate' ? 'var(--warning)' : 'var(--danger)' 
              }}>
                {viability.grade}
              </p>
            </div>
          </div>

          {/* Score breakdown bars */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Market Opportunity', value: viability.breakdown.marketOpportunity },
              { label: 'Financial Feasibility', value: viability.breakdown.financialFeasibility },
              { label: 'Funding Fit', value: viability.breakdown.fundingFit },
              { label: 'Risk Level', value: viability.breakdown.riskLevel },
              { label: 'Competition', value: viability.breakdown.competitionFit },
              { label: 'Preparedness', value: viability.breakdown.preparedness },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.value}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-strong)' }}>
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      width: `${item.value}%`,
                      background: item.value >= 70 ? 'var(--success)' : item.value >= 45 ? 'var(--accent-bright)' : 'var(--warning)'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="p-3 rounded-lg" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-bright)' }}>
              Recommended Next Step
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {viability.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* ─── PROJECT COST OVERVIEW ─── */}
      {business && projectBreakdown && (
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

          {/* Financial summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Project Cost</p>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(projectBreakdown.projectCost)}
              </p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Your Contribution (10%)</p>
              <p className="text-sm font-bold" style={{ color: 'var(--accent-bright)' }}>
                {formatCurrency(projectBreakdown.beneficiaryMargin)}
              </p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Potential Financing (90%)</p>
              <p className="text-sm font-bold" style={{ color: 'var(--info)' }}>
                {formatCurrency(projectBreakdown.institutionalFinancing)}
              </p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Matching Schemes</p>
              <p className="text-sm font-bold" style={{ color: 'var(--accent-bright)' }}>
                {applicableSchemes.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── FEATURE CARDS ─── */}
      {isComplete && (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
            {t('dashboard.quickInsights', { name: business?.name })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                icon: TrendingUp, label: t('dashboard.marketDemand'), 
                value: projectBreakdown ? formatCurrency(projectBreakdown.projectCost) : '—',
                sub: 'Estimated project cost',
                path: '/market-analysis',
              },
              {
                icon: Search, label: t('dashboard.eligibleSchemes'), 
                value: `${applicableSchemes.length}`,
                sub: applicableSchemes.length > 0 ? applicableSchemes[0].schemeName : 'No schemes found',
                path: '/scheme-finder',
              },
              {
                icon: Calculator, label: t('dashboard.loanEligible'), 
                value: projectBreakdown ? formatCurrency(projectBreakdown.institutionalFinancing) : '—',
                sub: 'Potential institutional finance',
                path: '/loan-calculator',
              },
              {
                icon: DollarSign, label: t('dashboard.fundingPlan'), 
                value: business?.investmentAmount ? formatCurrency(business.investmentAmount) : '—',
                sub: 'Available margin capital',
                path: '/funding-advisor',
              },
              {
                icon: Store, label: t('dashboard.nearbyCompetitors'), 
                value: t('dashboard.found', { count: '—' }),
                sub: `${business?.radius || 10} km radius`,
                path: '/nearby-competitors',
              },
              {
                icon: MapPin, label: t('dashboard.localInsights'), 
                value: business?.location?.split(',')[0] || '—',
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

      {/* ─── CTA: Generate Report ─── */}
      {business && viability && viability.totalScore > 30 && (
        <div className="card p-5 text-center" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
          <BarChart3 size={24} className="mx-auto mb-2" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Ready for a Complete Analysis?
          </h3>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            Generate a full feasibility report with market analysis, financial structuring, and scheme recommendations.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button size="sm" onClick={handleDownloadReport} loading={downloading}>
              <FileText size={14} />
              Generate Full Report
            </Button>
            <Link to="/market-analysis">
              <Button variant="secondary" size="sm">
                <TrendingUp size={14} />
                View Market Opportunity
              </Button>
            </Link>
            <Link to="/funding-advisor">
              <Button variant="ghost" size="sm">
                <DollarSign size={14} />
                Optimize Funding
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
