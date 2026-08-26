import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { MapPin, Loader2, Users, BookOpen, TrendingUp, Building2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { getInsights } from '../../lib/ai'
import { useAuth } from '../../contexts/AuthContext'
import { useBusiness } from '../../contexts/BusinessContext'
import { ScrollReveal, GlowCard } from '../../components/react-bits'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

interface InsightData {
  population: string
  literacyRate: string
  majorIndustries: string[]
  demandTrends: { category: string; trend: string }[]
  topBusinessOpportunities: string[]
  agriculturalProfile: string
  employmentStats: { employed: string; selfEmployed: string; unemployed: string }
  nearbyMarkets: string[]
  infrastructureScore: number
  digitalAdoption: string
}

const COLORS = ['#22c55e', '#f97316', '#3b82f6', '#8b5cf6']

export default function InsightsEngine() {
  const { profile } = useAuth()
  const { business, isComplete } = useBusiness()
  const [location, setLocation] = useState(business?.location || profile?.district || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InsightData | null>(null)

  useEffect(() => {
    if (isComplete && !result && !loading) handleSearch()
  }, [isComplete])

  async function handleSearch() {
    const loc = location || business?.location || ''
    if (!loc) return
    setLoading(true)
    try {
      const data = await getInsights(loc)
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const employmentData = result
    ? [
        { name: 'Employed', value: Number(result.employmentStats.employed) },
        { name: 'Self-Employed', value: Number(result.employmentStats.selfEmployed) },
        { name: 'Unemployed', value: Number(result.employmentStats.unemployed) },
      ]
    : []

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <MapPin size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Hyper-Local Insights Engine</h1>
            <p className="text-gray-400 text-sm">Discover data-driven insights about your area</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Search */}
      <ScrollReveal delay={0.1}>
        <Card className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                label="Enter Location"
                placeholder="e.g., Anantapur, Andhra Pradesh"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={<MapPin size={18} />}
              />
            </div>
            <Button onClick={handleSearch} loading={loading}>
              <MapPin size={18} />
              Get Insights
            </Button>
          </div>
        </Card>
      </ScrollReveal>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Population', value: result.population, color: 'text-primary-400' },
              { icon: BookOpen, label: 'Literacy Rate', value: result.literacyRate, color: 'text-blue-400' },
              { icon: TrendingUp, label: 'Infra Score', value: `${result.infrastructureScore}/10`, color: 'text-accent-400' },
              { icon: Building2, label: 'Digital Adoption', value: result.digitalAdoption, color: 'text-purple-400' },
            ].map((stat, i) => (
              <GlowCard key={i} className="text-center p-4">
                <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
                <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </GlowCard>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Demand Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={result.demandTrends.map(d => ({
                  category: d.category.split(' ').slice(0, 2).join(' '),
                  score: d.trend === 'growing' ? 80 : d.trend === 'stable' ? 50 : 20,
                  trend: d.trend,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {result.demandTrends.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.trend === 'growing' ? '#22c55e' : d.trend === 'stable' ? '#f97316' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Employment Statistics</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={employmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {employmentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-3">Major Industries</h3>
              <div className="flex flex-wrap gap-2">
                {result.majorIndustries.map((industry, i) => (
                  <span key={i} className="text-sm px-3 py-1 rounded-full glass text-gray-300">
                    {industry}
                  </span>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-white mb-3">Nearby Markets</h3>
              <div className="flex flex-wrap gap-2">
                {result.nearbyMarkets.map((market, i) => (
                  <span key={i} className="text-sm px-3 py-1 rounded-full glass text-gray-300">
                    {market}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-3">Top Business Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.topBusinessOpportunities.map((opp, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-300">{opp}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-2">Agricultural Profile</h3>
            <p className="text-gray-300 text-sm">{result.agriculturalProfile}</p>
          </Card>
        </motion.div>
      )}

      {loading && (
        <Card className="p-12 text-center">
          <Loader2 size={48} className="text-teal-400 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Gathering Insights...</h3>
          <p className="text-gray-400">Analyzing data for your location.</p>
        </Card>
      )}
    </div>
  )
}
