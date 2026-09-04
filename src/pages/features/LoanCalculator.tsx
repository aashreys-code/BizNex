import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Calculator, IndianRupee, Loader2, Edit3, ChevronUp, ChevronDown, Info, AlertTriangle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts'
import { useBusiness } from '../../contexts/BusinessContext'
import { useTheme } from '../../contexts/ThemeContext'
import { chartColors, tooltipContentStyle } from '../../lib/chartColors'
import {
  calculateProjectCost, calculateEMI, recommendSchemes,
  formatCurrency, type EMIResult, type ProjectCostBreakdown, type SchemeRecommendation,
} from '../../lib/financial-engine'

import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'

export default function LoanCalculator() {
  const { business } = useBusiness()
  const { isDark } = useTheme()
  const { t } = useTranslation()
  const c = chartColors(isDark)
  const PIE_COLORS = [c.accent, c.warning, c.info]

  const [marginInput, setMarginInput] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  // Deterministic results
  const [projectCost, setProjectCost] = useState<ProjectCostBreakdown | null>(null)
  const [schemes, setSchemes] = useState<SchemeRecommendation[]>([])
  const [selectedScheme, setSelectedScheme] = useState<SchemeRecommendation | null>(null)
  const [emiResult, setEmiResult] = useState<EMIResult | null>(null)

  useEffect(() => {
    if (!projectCost) handleCalculate()
  }, [])

  function handleCalculate() {
    const margin = Number(marginInput || business?.investmentAmount || 0)
    if (margin <= 0) return
    setLoading(true)
    
    // Simulate brief loading for UX
    setTimeout(() => {
      const breakdown = calculateProjectCost(margin)
      setProjectCost(breakdown)

      const profile = {
        availableMargin: margin,
        projectCost: breakdown.projectCost,
        businessType: business?.businessType || 'retail',
        monthlyExpectedRevenue: business?.monthlyIncome || Math.round(breakdown.projectCost * 0.06),
        monthlyOperatingCost: Math.round((business?.monthlyIncome || breakdown.projectCost * 0.06) * 0.65),
        isNewBusiness: true,
        existingLoans: business?.existingLoans || 0,
        age: business?.age || 30,
        gender: business?.gender || 'Male',
        category: business?.category || 'General',
        location: business?.location || '',
        isRural: true,
      }

      const matchedSchemes = recommendSchemes(profile)
      setSchemes(matchedSchemes)

      // Pick best scheme (lowest interest)
      const best = matchedSchemes
        .filter(s => s.applicable && breakdown.institutionalFinancing <= s.maxLoanAmount)
        .sort((a, b) => a.interestRate - b.interestRate)[0] || matchedSchemes[0] || null

      setSelectedScheme(best)

      if (best) {
        const loanAmount = Math.min(breakdown.institutionalFinancing, best.maxLoanAmount)
        const emi = calculateEMI(loanAmount, best.interestRate, best.repaymentYears, best.moratoriumMonths)
        setEmiResult(emi)
      }

      setLoading(false)
    }, 600)
  }

  const pieData = emiResult && projectCost
    ? [
        { name: 'Principal', value: emiResult.loanAmount },
        { name: 'Total Interest', value: emiResult.totalInterest },
        { name: 'Your Margin', value: projectCost.beneficiaryMargin },
      ]
    : []

  // Chart data: monthly EMI breakdown over time
  const emiChartData = emiResult
    ? emiResult.repaymentSchedule.filter(m => !m.isMoratorium).slice(0, 24).map(m => ({
        month: m.month - (emiResult.moratoriumMonths || 0),
        principal: m.principal,
        interest: m.interest,
        balance: m.balance,
      }))
    : []

  const tooltipStyle = tooltipContentStyle(isDark)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          Loan Eligibility & Repayment Calculator
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Deterministic calculations — no AI guessing. Based on SIH financing rules.
        </p>
      </div>

      {/* Edit Toggle */}
      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <Edit3 size={12} />{showEdit ? t('common.hide') : t('common.editDetails')}{showEdit ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input 
                  label="Available Margin Capital (₹)" 
                  type="number" 
                  value={marginInput} 
                  onChange={(e) => setMarginInput(e.target.value)} 
                  icon={<IndianRupee size={16} />} 
                  placeholder="e.g., 50000"
                />
              </div>
              <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                Your margin capital determines the project cost. Rule: Project Cost = Margin ÷ 10%
              </p>
              <div className="mt-3">
                <Button onClick={() => { setShowEdit(false); handleCalculate() }}>
                  <Calculator size={16} />Recalculate
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <Card className="p-10 text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Calculating Financial Structure...
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Applying SIH financing rules to your profile.
          </p>
        </Card>
      )}

      {/* Results */}
      {!loading && emiResult && projectCost && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

          {/* ─── PROJECT COST BREAKDOWN ─── */}
          <div className="card p-5" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent-bright)' }}>
              <Info size={14} />
              How Your Project Cost Was Calculated
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Your Margin (10%)</p>
                <p className="text-lg font-bold" style={{ color: 'var(--accent-bright)' }}>
                  {formatCurrency(projectCost.beneficiaryMargin)}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Total Project Cost</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(projectCost.projectCost)}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  = Margin ÷ 0.10
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Institutional Finance (90%)</p>
                <p className="text-lg font-bold" style={{ color: 'var(--info)' }}>
                  {formatCurrency(projectCost.institutionalFinancing)}
                </p>
              </div>
            </div>
          </div>

          {/* ─── KEY METRICS ─── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Loan Amount', value: formatCurrency(emiResult.loanAmount) },
              { label: 'Monthly EMI', value: formatCurrency(emiResult.monthlyEMI) },
              { label: 'Total Interest', value: formatCurrency(emiResult.totalInterest) },
              { label: 'Total Repayment', value: formatCurrency(emiResult.totalRepayment) },
            ].map((metric, i) => (
              <div key={i} className="card p-3 text-center">
                <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{metric.label}</p>
                <p className="text-base font-bold" style={{ color: 'var(--accent-bright)' }}>{metric.value}</p>
              </div>
            ))}
          </div>

          {/* ─── SCHEME DETAILS ─── */}
          {selectedScheme && (
            <div className="card p-4" style={{ borderLeft: '3px solid var(--accent-bright)' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Recommended Scheme: {selectedScheme.schemeName}
                </h3>
                <span className="badge badge-accent">
                  {selectedScheme.interestRate}% p.a.
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                {selectedScheme.reason}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Repayment</p>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selectedScheme.repaymentYears} years
                  </p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Moratorium</p>
                  <p className="text-xs font-bold" style={{ color: 'var(--accent-bright)' }}>
                    {selectedScheme.moratoriumMonths} months
                  </p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Max Loan</p>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(selectedScheme.maxLoanAmount)}
                  </p>
                </div>
              </div>
              {selectedScheme.moratoriumMonths > 0 && (
                <div className="mt-2 p-2 rounded-lg flex items-center gap-2" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
                  <AlertTriangle size={12} style={{ color: 'var(--warning)' }} />
                  <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    During the {selectedScheme.moratoriumMonths}-month moratorium, you pay only interest. Full EMI starts after moratorium.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ─── ALL APPLICABLE SCHEMES ─── */}
          {schemes.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                All Applicable Schemes for Your Project Cost
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>Scheme</th>
                      <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>Interest</th>
                      <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>Tenure</th>
                      <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>Moratorium</th>
                      <th className="text-left py-2.5 px-3 font-medium" style={{ color: 'var(--text-muted)' }}>Max Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map((scheme, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                        className={scheme === selectedScheme ? 'bg-[var(--accent-dim)]' : ''}>
                        <td className="py-2.5 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                          {scheme.schemeName}
                          {scheme === selectedScheme && <span className="ml-1 badge badge-accent text-[9px]">Best</span>}
                        </td>
                        <td className="py-2.5 px-3" style={{ color: 'var(--accent-bright)' }}>{scheme.interestRate}% p.a.</td>
                        <td className="py-2.5 px-3" style={{ color: 'var(--text-secondary)' }}>{scheme.repaymentYears} years</td>
                        <td className="py-2.5 px-3" style={{ color: 'var(--text-secondary)' }}>{scheme.moratoriumMonths} months</td>
                        <td className="py-2.5 px-3" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(scheme.maxLoanAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ─── CHARTS ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pie chart: Cost breakdown */}
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Funding Structure
              </h3>
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
                    }}>
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value)]} />
                  <Legend verticalAlign="bottom" height={30} formatter={(value) => <span style={{ color: c.label, fontSize: 11 }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Bar chart: EMI breakdown over time */}
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Monthly Repayment Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={emiChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                  <XAxis dataKey="month" stroke={c.axis} fontSize={11} label={{ value: 'Month', position: 'bottom', fontSize: 10, fill: c.axis }} />
                  <YAxis stroke={c.axis} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value)]} />
                  <Legend />
                  <Bar dataKey="principal" fill={c.accent} name="Principal" radius={[3, 3, 0, 0]} opacity={0.85} />
                  <Bar dataKey="interest" fill={c.warning} name="Interest" radius={[3, 3, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* ─── BALANCE OVER TIME LINE CHART ─── */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Loan Balance Over Time
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={emiChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                <XAxis dataKey="month" stroke={c.axis} fontSize={11} />
                <YAxis stroke={c.axis} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Balance']} />
                <Line type="monotone" dataKey="balance" stroke={c.accent} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* ─── USER-FRIENDLY SUMMARY ─── */}
          <div className="card p-4" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
            <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--accent-bright)' }}>
              💡 What This Means For You
            </h3>
            <div className="text-xs leading-relaxed space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <p>
                <strong>How much do I need?</strong> Your total project cost is {formatCurrency(projectCost.projectCost)}.
              </p>
              <p>
                <strong>How much can I borrow?</strong> Up to {formatCurrency(projectCost.institutionalFinancing)} through {selectedScheme?.schemeName || 'a government scheme'}.
              </p>
              <p>
                <strong>How much do I repay?</strong> {formatCurrency(emiResult.monthlyEMI)} per month for {selectedScheme?.repaymentYears || 3} years.
              </p>
              <p>
                <strong>When does repayment begin?</strong> 
                {selectedScheme && selectedScheme.moratoriumMonths > 0
                  ? ` After ${selectedScheme.moratoriumMonths} months of moratorium (during which you pay only interest).`
                  : ' Repayment starts from month 1.'
                }
              </p>
              <p>
                <strong>Can my business cash flow support this?</strong> 
                {business?.monthlyIncome 
                  ? ` Your expected monthly income of ${formatCurrency(business.monthlyIncome)} is ${business.monthlyIncome > emiResult.monthlyEMI * 2 ? 'comfortably above' : 'tight against'} the EMI of ${formatCurrency(emiResult.monthlyEMI)}.`
                  : ' Add your expected monthly income to the business profile for a cash flow analysis.'
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
