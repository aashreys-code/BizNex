import { useState, useEffect } from 'react'

import { TrendingUp, MapPin, IndianRupee, Loader2, Download, Edit3, ChevronUp, ChevronDown } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import { analyzeMarket } from '../../lib/ai'

import { useAuth } from '../../contexts/AuthContext'
import { useBusiness } from '../../contexts/BusinessContext'
import { useTheme } from '../../contexts/ThemeContext'
import { chartColors, tooltipContentStyle } from '../../lib/chartColors'

import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import TextArea from '../../components/ui/TextArea'
import Card from '../../components/ui/Card'

interface MarketResult {
  marketDemandScore: number
  competitionLevel: string
  estimatedMonthlyIncome: number
  growthPotential: string
  riskLevel: string
  requiredResources: string[]
  targetCustomers: string
  demandChart: { month: string; demand: number }[]
  revenueForecast: { month: string; revenue: number }[]
  swotAnalysis: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  recommendations: string[]
}

export default function MarketAnalysis() {
  const { profile } = useAuth()
  const { business, isComplete } = useBusiness()
  const { isDark } = useTheme()
  const c = chartColors(isDark)
  const [businessIdea, setBusinessIdea] = useState(business?.businessDescription || business?.businessType || '')
  const [location, setLocation] = useState(business?.location || profile?.district || '')
  const [investmentAmount, setInvestmentAmount] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MarketResult | null>(null)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!result && !loading) handleAnalyze()
  }, [])

  async function handleAnalyze() {
    const idea = businessIdea || business?.businessType || ''
    const loc = location || business?.location || ''
    const invest = investmentAmount || (business?.investmentAmount ? String(business.investmentAmount) : '')
    if (!idea || !loc || !invest) return
    setLoading(true)
    try {
      const data = await analyzeMarket({ businessIdea: idea, location: loc, investmentAmount: Number(invest) })
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const tooltipStyle = tooltipContentStyle(isDark)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Hyper-Local Market Analysis</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Analyze demand, competition, and revenue potential</p>
      </div>

      {/* Edit Toggle */}
      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
        >
          <Edit3 size={12} />{showEdit ? 'Hide' : 'Edit Details'}{showEdit ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      {showEdit && (
            <Card className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <TextArea label="Business Idea" value={businessIdea} onChange={(e) => setBusinessIdea(e.target.value)} />
                </div>
                <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} icon={<MapPin size={16} />} />
                <Input label="Investment Amount (₹)" type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(e.target.value)} icon={<IndianRupee size={16} />} />
              </div>
              <div className="mt-3">
                <Button onClick={() => { setShowEdit(false); handleAnalyze() }} loading={loading}>
                  <TrendingUp size={16} />Refresh Analysis
                </Button>
              </div>
            </Card>
        )}

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Market Demand', value: `${result.marketDemandScore}/10` },
              { label: 'Competition', value: result.competitionLevel },
              { label: 'Est. Monthly Income', value: `₹${result.estimatedMonthlyIncome.toLocaleString('en-IN')}` },
              { label: 'Risk Level', value: result.riskLevel },
            ].map((metric, i) => (
              <div key={i} className="card p-3 text-center">
                <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{metric.label}</p>
                <p className="text-base font-bold" style={{ color: 'var(--accent-bright)' }}>{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Insight */}
          <div className="card p-4" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-bright)' }}>BizNex Insight</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Market demand for {business?.businessType || 'this business'} in {business?.location || 'your area'} is {result.marketDemandScore >= 7 ? 'strong' : result.marketDemandScore >= 5 ? 'moderate' : 'developing'}.
              Competition is {result.competitionLevel.toLowerCase()}. Estimated monthly income: ₹{result.estimatedMonthlyIncome.toLocaleString('en-IN')}.
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Market Demand Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.demandChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                  <XAxis dataKey="month" stroke={c.axis} fontSize={11} />
                  <YAxis stroke={c.axis} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="demand" stroke={c.accent} strokeWidth={2} dot={{ fill: c.accent, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Projected Revenue Over 6 Months</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={result.revenueForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                  <XAxis dataKey="month" stroke={c.axis} fontSize={11} />
                  <YAxis stroke={c.axis} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill={c.accent} radius={[3, 3, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Business Opportunity Assessment */}
          <Card>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Business Opportunity Assessment</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>What Works</p>
                <div className="space-y-1">
                  {result.swotAnalysis.strengths.map((s, i) => (
                    <p key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {s}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Watch Out For</p>
                <div className="space-y-1">
                  {result.swotAnalysis.weaknesses.map((w, i) => (
                    <p key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {w}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Where to Grow</p>
                <div className="space-y-1">
                  {result.swotAnalysis.opportunities.map((o, i) => (
                    <p key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {o}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Key Risks</p>
                <div className="space-y-1">
                  {result.swotAnalysis.threats.map((t, i) => (
                    <p key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>• {t}</p>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Resources & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Required Resources</h3>
              <ul className="space-y-1.5">
                {result.requiredResources.map((resource, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent-bright)' }} />
                    {resource}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommendations</h3>
              <ul className="space-y-1.5">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent-bright)' }} />
                    {rec}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary">
              <Download size={16} />
              Download PDF Report
            </Button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <Card className="p-10 text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Analyzing Market Data...</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Our AI is evaluating market conditions for your business.</p>
        </Card>
      )}
    </div>
  )
}
