import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Loader2, Users, BookOpen, TrendingUp, Building2, Edit3, ChevronUp, ChevronDown } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { getInsights } from '../../lib/ai'
import { useAuth } from '../../contexts/AuthContext'
import { useBusiness } from '../../contexts/BusinessContext'
import { ScrollReveal } from '../../components/react-bits'
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

const PIE_COLORS = ['var(--accent-bright)', 'var(--info)', 'var(--warning)']

export default function InsightsEngine() {
  const { profile } = useAuth()
  const { business, isComplete } = useBusiness()
  const [location, setLocation] = useState(business?.location || profile?.district || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InsightData | null>(null)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!result && !loading) handleSearch()
  }, [])

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

  const parsePercent = (s: string) => Number(s.replace('%', '')) || 0
  const employmentData = result
    ? [
        { name: 'Employed', value: parsePercent(result.employmentStats.employed) },
        { name: 'Self-Employed', value: parsePercent(result.employmentStats.selfEmployed) },
        { name: 'Unemployed', value: parsePercent(result.employmentStats.unemployed) },
      ]
    : []

  const tooltipStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-strong)',
    borderRadius: '8px',
    fontSize: '12px',
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ScrollReveal>
        <div>
          <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Hyper-Local Insights</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Discover data-driven insights about your area</p>
        </div>
      </ScrollReveal>

      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
        >
          <Edit3 size={12} />{showEdit ? 'Hide' : 'Edit Location'}{showEdit ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="p-5">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input label="Location" placeholder="e.g., Anantapur, Andhra Pradesh" value={location} onChange={(e) => setLocation(e.target.value)} icon={<MapPin size={16} />} />
                </div>
                <Button onClick={() => { setLoading(true); getInsights(location).then(d => { setResult(d); setLoading(false) }).catch(() => setLoading(false)) }} loading={loading}>
                  <MapPin size={16} />Refresh
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Location Header */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} style={{ color: 'var(--accent-bright)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{location}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Users, label: 'Population', value: result.population },
                { icon: BookOpen, label: 'Literacy Rate', value: result.literacyRate },
                { icon: TrendingUp, label: 'Infra Score', value: `${result.infrastructureScore}/10` },
                { icon: Building2, label: 'Digital Adoption', value: result.digitalAdoption },
              ].map((stat, i) => (
                <div key={i} className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <stat.icon size={16} className="mx-auto mb-1" style={{ color: 'var(--accent-bright)' }} />
                  <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Local Demand Trends</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={result.demandTrends.map(d => ({
                  category: d.category.split(' ').slice(0, 2).join(' '),
                  score: d.trend === 'growing' ? 80 : d.trend === 'stable' ? 50 : 20,
                  trend: d.trend,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="category" stroke="var(--text-muted)" fontSize={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                    {result.demandTrends.map((d, i) => (
                      <Cell key={i} fill={d.trend === 'growing' ? 'var(--success)' : d.trend === 'stable' ? 'var(--warning)' : 'var(--danger)'} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Employment Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={employmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" labelLine={false}
                    label={({ cx, cy, midAngle, outerRadius, name, value }) => {
                      const RADIAN = Math.PI / 180
                      const radius = outerRadius + 14
                      const x = cx + radius * Math.cos(-midAngle * RADIAN)
                      const y = cy + radius * Math.sin(-midAngle * RADIAN)
                      return (
                        <text x={x} y={y} fill="var(--text-secondary)" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10}>
                          {`${name} ${value}%`}
                        </text>
                      )
                    }}
                  >
                    {employmentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Major Industries</h3>
              <div className="flex flex-wrap gap-1.5">
                {result.majorIndustries.map((industry, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-md"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {industry}
                  </span>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Nearby Markets</h3>
              <div className="flex flex-wrap gap-1.5">
                {result.nearbyMarkets.map((market, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-md"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {market}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Top Business Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {result.topBusinessOpportunities.map((opp, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent-bright)' }}>
                    {i + 1}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{opp}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Agricultural Profile</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{result.agriculturalProfile}</p>
          </Card>
        </motion.div>
      )}

      {loading && (
        <Card className="p-10 text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Gathering Insights...</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Analyzing data for your location.</p>
        </Card>
      )}
    </div>
  )
}
