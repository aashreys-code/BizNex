import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  TrendingUp,
  FileText,
  Search,
  Calculator,
  MessageSquare,
  MapPin,
  DollarSign,
  Upload,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { ScrollReveal, CountUp, GlowCard } from '../components/react-bits'

const quickActions = [
  {
    icon: TrendingUp,
    title: 'Market Analysis',
    description: 'Analyze demand, competition & revenue for your business idea',
    path: '/market-analysis',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FileText,
    title: 'Business Plan',
    description: 'Generate a comprehensive business plan in minutes',
    path: '/business-plan',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Search,
    title: 'Scheme Finder',
    description: 'Find government schemes you are eligible for',
    path: '/scheme-finder',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Calculator,
    title: 'Loan Calculator',
    description: 'Check your loan eligibility and EMI estimates',
    path: '/loan-calculator',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: MessageSquare,
    title: 'AI Assistant',
    description: 'Chat with our AI advisor in your language',
    path: '/ai-assistant',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: MapPin,
    title: 'Local Insights',
    description: 'Explore data about your area and opportunities',
    path: '/insights',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: DollarSign,
    title: 'Funding Advisor',
    description: 'Get personalized funding structure recommendations',
    path: '/funding-advisor',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Upload,
    title: 'Document Verification',
    description: 'Upload and verify your business documents',
    path: '/document-verification',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: MapPin,
    title: 'Nearby Competitors',
    description: 'Find similar businesses, compare demand & popularity',
    path: '/nearby-competitors',
    color: 'from-violet-500 to-purple-600',
  },
]

export default function Dashboard() {
  const { profile } = useAuth()

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
                  <CountUp to={3} />
                </div>
                <p className="text-xs text-gray-400">Reports</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-400">
                  <CountUp to={5} />
                </div>
                <p className="text-xs text-gray-400">Ideas Analyzed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  <CountUp to={2} />
                </div>
                <p className="text-xs text-gray-400">Schemes Applied</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <Link to={action.path}>
                <GlowCard className="h-full group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{action.description}</p>
                  <div className="flex items-center gap-1 text-sm text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Get Started <ArrowRight size={14} />
                  </div>
                </GlowCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <ScrollReveal>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={20} className="text-gray-400" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {[
              { action: 'Analyzed dairy farm business in Anantapur', time: '2 hours ago', icon: TrendingUp },
              { action: 'Generated business plan for textile shop', time: '1 day ago', icon: FileText },
              { action: 'Found 3 eligible government schemes', time: '2 days ago', icon: Search },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <activity.icon size={16} className="text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
