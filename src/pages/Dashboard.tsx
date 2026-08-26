import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  TrendingUp, FileText, Search, Calculator, MessageSquare,
  MapPin, DollarSign, Upload, ArrowRight, Building2,
  CheckCircle2, Store, BarChart3, Sparkles, Plus,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness } from '../contexts/BusinessContext'
import { ScrollReveal, CountUp, GlowCard } from '../components/react-bits'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const featureLinks = [
  { icon: TrendingUp, title: 'Market Analysis', path: '/market-analysis', color: 'from-green-500 to-emerald-500' },
  { icon: FileText, title: 'Business Plan', path: '/business-plan', color: 'from-blue-500 to-cyan-500' },
  { icon: Search, title: 'Scheme Finder', path: '/scheme-finder', color: 'from-purple-500 to-violet-500' },
  { icon: Calculator, title: 'Loan Calculator', path: '/loan-calculator', color: 'from-orange-500 to-amber-500' },
  { icon: MessageSquare, title: 'AI Assistant', path: '/ai-assistant', color: 'from-pink-500 to-rose-500' },
  { icon: MapPin, title: 'Local Insights', path: '/insights', color: 'from-teal-500 to-cyan-500' },
  { icon: DollarSign, title: 'Funding Advisor', path: '/funding-advisor', color: 'from-indigo-500 to-blue-500' },
  { icon: Upload, title: 'Documents', path: '/document-verification', color: 'from-red-500 to-orange-500' },
  { icon: Store, title: 'Competitors', path: '/nearby-competitors', color: 'from-violet-500 to-purple-600' },
]

export default function Dashboard() {
  const { profile } = useAuth()
  const { profiles, business, isComplete } = useBusiness()

  return (
    <div className="space-y-8">
      {/* Welcome Panel */}
      <ScrollReveal>
        <div className="glass-strong rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Welcome back, {profile?.name || 'Entrepreneur'}! 👋
              </h1>
              <p className="text-gray-400">
                {profile?.village && `${profile.village}, `}
                {profile?.district && `${profile.district}, `}
                {profile?.state}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">
                  <CountUp to={profiles.length} />
                </div>
                <p className="text-xs text-gray-400">Profiles</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-400">
                  <CountUp to={isComplete ? 9 : 0} />
                </div>
                <p className="text-xs text-gray-400">Features Ready</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* No profiles — show create prompt */}
      {profiles.length === 0 && (
        <ScrollReveal delay={0.1}>
          <Card className="p-8 text-center">
            <Building2 size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Create Your First Business Profile</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Add a business profile to unlock all features — market analysis, schemes,
              loan calculator, competitors, and more.
            </p>
            <Link to="/business-profile">
              <Button>
                <Plus size={16} />
                Create Business Profile
              </Button>
            </Link>
          </Card>
        </ScrollReveal>
      )}

      {/* Active profile info */}
      {business && (
        <ScrollReveal delay={0.1}>
          <Card className="p-5 border border-moss-400/20 bg-moss-400/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-moss-400/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} className="text-moss-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-white">{business.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-moss-400/20 text-moss-400 font-medium">
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    business.businessType,
                    business.location,
                    business.investmentAmount ? `₹${business.investmentAmount.toLocaleString('en-IN')}` : null,
                    business.category,
                  ].filter(Boolean).map((tag, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link to="/business-profile">
                <Button variant="ghost" size="sm">Manage Profiles</Button>
              </Link>
            </div>
          </Card>
        </ScrollReveal>
      )}

      {/* Auto Analysis Cards */}
      {isComplete && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-moss-400" />
            Quick Insights for {business?.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: TrendingUp, label: 'Market Demand', value: '7/10',
                sub: `${business?.businessType} in ${business?.location?.split(',')[0]}`,
                color: 'text-green-400', path: '/market-analysis',
              },
              {
                icon: Search, label: 'Eligible Schemes', value: '5+',
                sub: `${business?.category} category`,
                color: 'text-purple-400', path: '/scheme-finder',
              },
              {
                icon: Calculator, label: 'Loan Eligible', value: `₹${business?.investmentAmount ? (business.investmentAmount * 2).toLocaleString('en-IN') : '—'}`,
                sub: business?.monthlyIncome ? `₹${business.monthlyIncome.toLocaleString('en-IN')}/mo income` : 'Add income for estimate',
                color: 'text-orange-400', path: '/loan-calculator',
              },
              {
                icon: DollarSign, label: 'Funding Plan', value: `${business?.investmentAmount ? Math.round(business.investmentAmount * 0.3 / 1000) : 0}K own`,
                sub: `${business?.investmentAmount ? `${Math.round(business.investmentAmount * 0.7 / 1000)}K loan + subsidy` : 'Add costs for plan'}`,
                color: 'text-blue-400', path: '/funding-advisor',
              },
              {
                icon: Store, label: 'Nearby Competitors', value: '5 found',
                sub: `${business?.radius || 10} km radius`,
                color: 'text-violet-400', path: '/nearby-competitors',
              },
              {
                icon: MapPin, label: 'Local Insights', value: business?.location?.split(',')[0] || '—',
                sub: 'Population, demand, opportunities',
                color: 'text-teal-400', path: '/insights',
              },
            ].map((card, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <Link to={card.path}>
                  <GlowCard className="h-full group cursor-pointer p-5">
                    <div className="flex items-start justify-between mb-3">
                      <card.icon size={20} className={card.color} />
                      <ArrowRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                    <p className={`text-xl font-bold ${card.color} mb-1`}>{card.value}</p>
                    <p className="text-xs text-gray-500">{card.sub}</p>
                  </GlowCard>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* Feature Links */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">All Features</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {featureLinks.map((action, i) => (
            <ScrollReveal key={i} delay={i * 0.03}>
              <Link to={action.path}>
                <div className="glass rounded-xl p-4 group hover:bg-white/5 transition-all duration-200 cursor-pointer h-full">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon size={20} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-white group-hover:text-moss-400 transition-colors">
                    {action.title}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <ScrollReveal>
        <div className="flex flex-wrap gap-3">
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
              <BarChart3 size={14} />
              View Competitors
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    </div>
  )
}
