import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Calculator, IndianRupee, Loader2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { calculateLoan } from '../../lib/ai'
import { useBusiness } from '../../contexts/BusinessContext'
import { ScrollReveal, GlowCard } from '../../components/react-bits'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'

interface LoanResult {
  eligibilityScore: number
  eligibleLoanAmount: number
  estimatedEMI: number
  repaymentTenure: string
  recommendedBanks: { name: string; interestRate: string; processingFee: string }[]
  monthlyRepaymentSchedule: { month: number; emi: number; principal: number; interest: number; balance: number }[]
}

const COLORS = ['#22c55e', '#f97316', '#3b82f6']

export default function LoanCalculator() {
  const { business, isComplete } = useBusiness()
  const [monthlyIncome, setMonthlyIncome] = useState(business?.monthlyIncome ? String(business.monthlyIncome) : '')
  const [existingLoans, setExistingLoans] = useState(business?.existingLoans ? String(business.existingLoans) : '')
  const [businessType, setBusinessType] = useState(business?.businessType || '')
  const [investmentRequirement, setInvestmentRequirement] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LoanResult | null>(null)

  useEffect(() => {
    if (isComplete && !result && !loading) handleCalculate()
  }, [isComplete])

  async function handleCalculate() {
    const inc = monthlyIncome || (business?.monthlyIncome ? String(business.monthlyIncome) : '')
    const type = businessType || business?.businessType || ''
    const req = investmentRequirement || (business?.investmentAmount ? String(business.investmentAmount) : '')
    if (!inc || !type || !req) return
    setLoading(true)
    try {
      const data = await calculateLoan({
        monthlyIncome: Number(inc),
        existingLoans: Number(existingLoans || business?.existingLoans || 0),
        businessType: type,
        investmentRequirement: Number(req),
      })
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const pieData = result
    ? [
        { name: 'Principal', value: result.estimatedEMI * 0.7 },
        { name: 'Interest', value: result.estimatedEMI * 0.3 },
        { name: 'Processing', value: result.eligibleLoanAmount * 0.01 },
      ]
    : []

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Calculator size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Loan Eligibility Calculator</h1>
            <p className="text-gray-400 text-sm">Calculate your eligibility, EMI, and repayment schedule</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Input Form */}
      <ScrollReveal delay={0.1}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Financial Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Monthly Income (₹)"
              type="number"
              placeholder="e.g., 25000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              icon={<IndianRupee size={18} />}
            />
            <Input
              label="Existing Loans (₹)"
              type="number"
              placeholder="e.g., 0"
              value={existingLoans}
              onChange={(e) => setExistingLoans(e.target.value)}
              icon={<IndianRupee size={18} />}
            />
            <Select
              label="Business Type"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              options={[
                { value: 'dairy', label: 'Dairy' },
                { value: 'retail', label: 'Retail' },
                { value: 'manufacturing', label: 'Manufacturing' },
                { value: 'services', label: 'Services' },
                { value: 'agriculture', label: 'Agriculture' },
              ]}
            />
            <Input
              label="Investment Required (₹)"
              type="number"
              placeholder="e.g., 500000"
              value={investmentRequirement}
              onChange={(e) => setInvestmentRequirement(e.target.value)}
              icon={<IndianRupee size={18} />}
            />
          </div>
          <div className="mt-4">
            <Button onClick={handleCalculate} loading={loading}>
              <Calculator size={18} />
              Calculate Eligibility
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
              { label: 'Eligibility Score', value: `${result.eligibilityScore}/100`, color: 'text-primary-400' },
              { label: 'Loan Amount', value: `₹${result.eligibleLoanAmount.toLocaleString('en-IN')}`, color: 'text-blue-400' },
              { label: 'Est. EMI', value: `₹${result.estimatedEMI.toLocaleString('en-IN')}`, color: 'text-accent-400' },
              { label: 'Repayment Period', value: result.repaymentTenure, color: 'text-purple-400' },
            ].map((metric, i) => (
              <GlowCard key={i} className="text-center p-4">
                <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
              </GlowCard>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">EMI Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="value"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
                      const RADIAN = Math.PI / 180
                      const radius = outerRadius + 20
                      const x = cx + radius * Math.cos(-midAngle * RADIAN)
                      const y = cy + radius * Math.sin(-midAngle * RADIAN)
                      return (
                        <text x={x} y={y} fill="#d1d5db" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      )
                    }}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Repayment Schedule</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={result.monthlyRepaymentSchedule}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} label={{ value: 'Month', position: 'bottom', fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]}
                  />
                  <Legend />
                  <Bar dataKey="principal" fill="#22c55e" name="Principal" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interest" fill="#f97316" name="Interest" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Recommended Banks */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Recommended Banks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Bank</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Interest Rate</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Processing Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {result.recommendedBanks.map((bank, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-medium">{bank.name}</td>
                      <td className="py-3 px-4 text-primary-400">{bank.interestRate}</td>
                      <td className="py-3 px-4 text-gray-300">{bank.processingFee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {loading && (
        <Card className="p-12 text-center">
          <Loader2 size={48} className="text-orange-400 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Calculating Eligibility...</h3>
          <p className="text-gray-400">Analyzing your financial profile against bank requirements.</p>
        </Card>
      )}
    </div>
  )
}
