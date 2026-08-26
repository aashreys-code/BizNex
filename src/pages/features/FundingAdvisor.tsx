import { useState } from 'react'
import { motion } from 'motion/react'
import { DollarSign, Loader2, IndianRupee, Landmark, Gift } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { getFundingAdvice } from '../../lib/ai'
import { ScrollReveal, GlowCard } from '../../components/react-bits'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'

interface FundingResult {
  selfFunding: { percentage: number; amount: number }
  governmentLoans: { scheme: string; amount: number; subsidy: string }[]
  bankLoans: { bank: string; amount: number; interestRate: string }[]
  subsidies: { name: string; amount: number; eligibility: string }[]
  totalFundingPlan: { ownContribution: number; loanAmount: number; subsidyAmount: number }
  monthlyCashFlow: { month: string; inflow: number; outflow: number }[]
}

export default function FundingAdvisor() {
  const [businessType, setBusinessType] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [workingCapital, setWorkingCapital] = useState('')
  const [equipmentCost, setEquipmentCost] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FundingResult | null>(null)

  async function handleGetAdvice() {
    if (!businessType || !totalCost || !workingCapital || !equipmentCost) return
    setLoading(true)
    try {
      const data = await getFundingAdvice({
        businessType,
        totalCost: Number(totalCost),
        workingCapital: Number(workingCapital),
        equipmentCost: Number(equipmentCost),
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
            <DollarSign size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Funding Advisor</h1>
            <p className="text-gray-400 text-sm">Get personalized funding structure recommendations</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Input */}
      <ScrollReveal delay={0.1}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Business Cost Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Business Type"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              options={[
                { value: 'dairy', label: 'Dairy Farm' },
                { value: 'retail', label: 'Retail Store' },
                { value: 'food-processing', label: 'Food Processing' },
                { value: 'manufacturing', label: 'Manufacturing' },
                { value: 'services', label: 'Services' },
              ]}
            />
            <Input
              label="Total Cost (₹)"
              type="number"
              placeholder="e.g., 1000000"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              icon={<IndianRupee size={18} />}
            />
            <Input
              label="Working Capital (₹)"
              type="number"
              placeholder="e.g., 200000"
              value={workingCapital}
              onChange={(e) => setWorkingCapital(e.target.value)}
              icon={<IndianRupee size={18} />}
            />
            <Input
              label="Equipment Cost (₹)"
              type="number"
              placeholder="e.g., 500000"
              value={equipmentCost}
              onChange={(e) => setEquipmentCost(e.target.value)}
              icon={<IndianRupee size={18} />}
            />
          </div>
          <div className="mt-4">
            <Button onClick={handleGetAdvice} loading={loading} disabled={!businessType || !totalCost || !workingCapital || !equipmentCost}>
              <DollarSign size={18} />
              Get Funding Advice
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
          {/* Funding Plan Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlowCard className="text-center p-4">
              <p className="text-xs text-gray-400 mb-1">Own Contribution</p>
              <p className="text-xl font-bold text-primary-400">₹{result.totalFundingPlan.ownContribution.toLocaleString('en-IN')}</p>
            </GlowCard>
            <GlowCard className="text-center p-4">
              <p className="text-xs text-gray-400 mb-1">Loan Amount</p>
              <p className="text-xl font-bold text-blue-400">₹{result.totalFundingPlan.loanAmount.toLocaleString('en-IN')}</p>
            </GlowCard>
            <GlowCard className="text-center p-4">
              <p className="text-xs text-gray-400 mb-1">Subsidy Amount</p>
              <p className="text-xl font-bold text-accent-400">₹{result.totalFundingPlan.subsidyAmount.toLocaleString('en-IN')}</p>
            </GlowCard>
          </div>

          {/* Cash Flow Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Projected Monthly Cash Flow</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={result.monthlyCashFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
                />
                <Legend />
                <Bar dataKey="inflow" fill="#22c55e" name="Inflow" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflow" fill="#ef4444" name="Outflow" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Funding Sources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Self Funding */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={18} className="text-primary-400" />
                <h3 className="font-semibold text-white">Self Funding</h3>
              </div>
              <div className="text-center p-4 glass rounded-xl">
                <p className="text-2xl font-bold text-primary-400">{result.selfFunding.percentage}%</p>
                <p className="text-sm text-gray-400">₹{result.selfFunding.amount.toLocaleString('en-IN')}</p>
              </div>
            </Card>

            {/* Government Loans */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Landmark size={18} className="text-blue-400" />
                <h3 className="font-semibold text-white">Government Loans</h3>
              </div>
              <div className="space-y-3">
                {result.governmentLoans.map((loan, i) => (
                  <div key={i} className="p-3 glass rounded-xl">
                    <p className="text-sm font-medium text-white">{loan.scheme}</p>
                    <p className="text-xs text-blue-400">₹{loan.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">{loan.subsidy}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Subsidies */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Gift size={18} className="text-accent-400" />
                <h3 className="font-semibold text-white">Subsidies</h3>
              </div>
              <div className="space-y-3">
                {result.subsidies.map((sub, i) => (
                  <div key={i} className="p-3 glass rounded-xl">
                    <p className="text-sm font-medium text-white">{sub.name}</p>
                    <p className="text-xs text-accent-400">₹{sub.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">{sub.eligibility}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {loading && (
        <Card className="p-12 text-center">
          <Loader2 size={48} className="text-indigo-400 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Analyzing Funding Options...</h3>
          <p className="text-gray-400">Finding the best funding structure for your business.</p>
        </Card>
      )}
    </div>
  )
}
