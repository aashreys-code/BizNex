import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { TrendingUp, MapPin, IndianRupee, Loader2, Download } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import { analyzeMarket } from '../../lib/ai'
import { useAuth } from '../../contexts/AuthContext'
import { useBusiness } from '../../contexts/BusinessContext'
import { ScrollReveal, GlowCard } from '../../components/react-bits'
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
  const [businessIdea, setBusinessIdea] = useState(business?.businessDescription || business?.businessType || '')
  const [location, setLocation] = useState(business?.location || profile?.district || '')
  const [investmentAmount, setInvestmentAmount] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MarketResult | null>(null)

  useEffect(() => {
    if (isComplete && !result && !loading) {
      handleAnalyze()
    }
  }, [isComplete])

  async function handleAnalyze() {
    const idea = businessIdea || business?.businessType || ''
    const loc = location || business?.location || ''
    const invest = investmentAmount || (business?.investmentAmount ? String(business.investmentAmount) : '')
    if (!idea || !loc || !invest) return
    setLoading(true)
    try {
      const data = await analyzeMarket({
        businessIdea: idea,
        location: loc,
        investmentAmount: Number(invest),
      })
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <TrendingUp size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Hyper-Local Market Analysis</h1>
            <p className="text-gray-400 text-sm">Analyze demand, competition, and revenue potential</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Input Form */}
      <ScrollReveal delay={0.1}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Enter Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <TextArea
                label="Business Idea"
                placeholder="e.g., I want to start a dairy farm in my village to supply milk to nearby towns..."
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
              />
            </div>
            <Input
              label="Location"
              placeholder="e.g., Anantapur, Andhra Pradesh"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={<MapPin size={18} />}
            />
            <Input
              label="Investment Amount (₹)"
              placeholder="e.g., 500000"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              icon={<IndianRupee size={18} />}
            />
          </div>
          <div className="mt-4">
            <Button onClick={handleAnalyze} loading={loading}>
              <TrendingUp size={18} />
              Analyze Market
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
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Market Demand', value: `${result.marketDemandScore}/10`, color: 'text-primary-400' },
              { label: 'Competition', value: result.competitionLevel, color: 'text-accent-400' },
              { label: 'Est. Monthly Income', value: `₹${result.estimatedMonthlyIncome.toLocaleString('en-IN')}`, color: 'text-blue-400' },
              { label: 'Risk Level', value: result.riskLevel, color: result.riskLevel === 'Low' ? 'text-green-400' : result.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400' },
            ].map((metric, i) => (
              <GlowCard key={i} className="text-center p-4">
                <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
              </GlowCard>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demand Chart */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Market Demand Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={result.demandChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="demand" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue Forecast */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Revenue Forecast</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={result.revenueForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* SWOT Analysis */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">SWOT Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Strengths', items: result.swotAnalysis.strengths, color: 'green' },
                { title: 'Weaknesses', items: result.swotAnalysis.weaknesses, color: 'red' },
                { title: 'Opportunities', items: result.swotAnalysis.opportunities, color: 'blue' },
                { title: 'Threats', items: result.swotAnalysis.threats, color: 'orange' },
              ].map((section, i) => (
                <div key={i} className={`p-4 rounded-xl border border-${section.color}-500/20 bg-${section.color}-500/5`}>
                  <h4 className={`font-semibold text-${section.color}-400 mb-2`}>{section.title}</h4>
                  <ul className="space-y-1">
                    {section.items.map((item, j) => (
                      <li key={j} className="text-sm text-gray-300">• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Resources & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-3">Required Resources</h3>
              <ul className="space-y-2">
                {result.requiredResources.map((resource, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-primary-400" />
                    {resource}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-accent-400" />
                    {rec}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button variant="secondary">
              <Download size={18} />
              Download PDF Report
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
