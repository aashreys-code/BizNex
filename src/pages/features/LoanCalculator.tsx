import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Calculator, IndianRupee, Loader2, Edit3, ChevronUp, ChevronDown } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { calculateLoan } from '../../lib/ai'
import { AnimatePresence } from 'motion/react'
import { useBusiness } from '../../contexts/BusinessContext'
import { useTheme } from '../../contexts/ThemeContext'
import { chartColors, tooltipContentStyle } from '../../lib/chartColors'

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

export default function LoanCalculator() {
  const { business, isComplete } = useBusiness()
  const { isDark } = useTheme()
  const c = chartColors(isDark)
  const PIE_COLORS = [c.accent, c.warning, c.info]
  const [monthlyIncome, setMonthlyIncome] = useState(business?.monthlyIncome ? String(business.monthlyIncome) : '')
  const [existingLoans, setExistingLoans] = useState(business?.existingLoans ? String(business.existingLoans) : '')
  const [businessType, setBusinessType] = useState(business?.businessType || '')
  const [investmentRequirement, setInvestmentRequirement] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LoanResult | null>(null)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!result && !loading) handleCalculate()
  }, [])

  async function handleCalculate() {
    const inc = monthlyIncome || (business?.monthlyIncome ? String(business.monthlyIncome) : '')
    const type = businessType || business?.businessType || ''
    const req = investmentRequirement || (business?.investmentAmount ? String(business.investmentAmount) : '')
    if (!inc || !type || !req) return
    setLoading(true)
    try {
      const data = await calculateLoan({ monthlyIncome: Number(inc), existingLoans: Number(existingLoans || business?.existingLoans || 0), businessType: type, investmentRequirement: Number(req) })
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

  const tooltipStyle = tooltipContentStyle(isDark)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Loan Eligibility Calculator</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Calculate your eligibility, EMI, and repayment schedule</p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
        >
          <Edit3 size={12} />{showEdit ? 'Hide' : 'Edit Details'}{showEdit ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Monthly Income (₹)" type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} icon={<IndianRupee size={16} />} />
                <Input label="Existing Loans (₹)" type="number" value={existingLoans} onChange={(e) => setExistingLoans(e.target.value)} icon={<IndianRupee size={16} />} />
                <Select label="Business Type" value={businessType} onChange={(e) => setBusinessType(e.target.value)} options={[{ value: 'dairy', label: 'Dairy' }, { value: 'retail', label: 'Retail' }, { value: 'manufacturing', label: 'Manufacturing' }, { value: 'services', label: 'Services' }, { value: 'agriculture', label: 'Agriculture' }]} />
                <Input label="Investment Required (₹)" type="number" value={investmentRequirement} onChange={(e) => setInvestmentRequirement(e.target.value)} icon={<IndianRupee size={16} />} />
              </div>
              <div className="mt-3">
                <Button onClick={() => { setShowEdit(false); handleCalculate() }} loading={loading}>
                  <Calculator size={16} />Recalculate
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Eligibility Score', value: `${result.eligibilityScore}/100` },
              { label: 'Loan Amount', value: `₹${result.eligibleLoanAmount.toLocaleString('en-IN')}` },
              { label: 'Est. EMI', value: `₹${result.estimatedEMI.toLocaleString('en-IN')}` },
              { label: 'Repayment Period', value: result.repaymentTenure },
            ].map((metric, i) => (
              <div key={i} className="card p-3 text-center">
                <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{metric.label}</p>
                <p className="text-base font-bold" style={{ color: 'var(--accent-bright)' }}>{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card p-4" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Estimated monthly repayment: <strong style={{ color: 'var(--accent-bright)' }}>₹{result.estimatedEMI.toLocaleString('en-IN')}</strong>.
              At this repayment level, your projected cash flow remains {result.eligibilityScore >= 60 ? 'positive' : 'tight — consider reducing the loan amount'}.
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>EMI Breakdown</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" labelLine={false}
                    label={({ cx, cy, midAngle, outerRadius, name, percent }) => {
                      const RADIAN = Math.PI / 180
                      const radius = outerRadius + 14
                      const x = cx + radius * Math.cos(-midAngle * RADIAN)
                      const y = cy + radius * Math.sin(-midAngle * RADIAN)
                      return (
                        <text x={x} y={y} fill={c.label} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10}>
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      )
                    }}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]} />
                  <Legend verticalAlign="bottom" height={30} formatter={(value) => <span style={{ color: c.label, fontSize: 11 }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Repayment Schedule</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={result.monthlyRepaymentSchedule}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                  <XAxis dataKey="month" stroke={c.axis} fontSize={11} />
                  <YAxis stroke={c.axis} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]} />
                  <Legend />
                  <Bar dataKey="principal" fill={c.accent} name="Principal" radius={[3, 3, 0, 0]} opacity={0.85} />
                  <Bar dataKey="interest" fill={c.warning} name="Interest" radius={[3, 3, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Recommended Banks */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommended Banks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>Bank</th>
                    <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>Interest Rate</th>
                    <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>Processing Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {result.recommendedBanks.map((bank, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2.5 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>{bank.name}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--accent-bright)' }}>{bank.interestRate}</td>
                      <td className="py-2.5 px-3" style={{ color: 'var(--text-secondary)' }}>{bank.processingFee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {loading && (
        <Card className="p-10 text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Calculating Eligibility...</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Analyzing your financial profile against bank requirements.</p>
        </Card>
      )}
    </div>
  )
}
