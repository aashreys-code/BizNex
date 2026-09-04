import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { DollarSign, Loader2, IndianRupee, Landmark, Gift, Edit3, ChevronUp, ChevronDown, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts'
import { AnimatePresence } from 'motion/react'
import { useBusiness } from '../../contexts/BusinessContext'
import { useTheme } from '../../contexts/ThemeContext'
import { chartColors, tooltipContentStyle } from '../../lib/chartColors'
import {
  calculateProjectCost, calculateFundingStrategy, projectCashFlow,
  calculateEMI, formatCurrency, type FundingStrategy,
} from '../../lib/financial-engine'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

export default function FundingAdvisor() {
  const { business } = useBusiness()
  const { isDark } = useTheme()
  const { t } = useTranslation()
  const c = chartColors(isDark)

  const [marginInput, setMarginInput] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FundingStrategy | null>(null)
  const [cashFlowData, setCashFlowData] = useState<ReturnType<typeof projectCashFlow>>([])
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!result && !loading) handleGetAdvice()
  }, [])

  async function handleGetAdvice() {
    const margin = Number(marginInput || business?.investmentAmount || 0)
    if (margin <= 0) return
    setLoading(true)

    setTimeout(() => {
      const finProfile = {
        availableMargin: margin,
        projectCost: 0,
        businessType: business?.businessType || 'retail',
        monthlyExpectedRevenue: business?.monthlyIncome || Math.round(margin / 0.10 * 0.06),
        monthlyOperatingCost: Math.round((business?.monthlyIncome || margin / 0.10 * 0.06) * 0.65),
        isNewBusiness: true,
        existingLoans: business?.existingLoans || 0,
        age: business?.age || 30,
        gender: business?.gender || 'Male',
        category: business?.category || 'General',
        location: business?.location || '',
        isRural: true,
      }

      const strategy = calculateFundingStrategy(finProfile)
      setResult(strategy)

      // Calculate cash flow projection
      if (strategy.emi) {
        const cf = projectCashFlow(finProfile, strategy.emi, 12)
        setCashFlowData(cf)
      }

      setLoading(false)
    }, 600)
  }

  const tooltipStyle = tooltipContentStyle(isDark)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          Funding Strategy Advisor
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Integrated funding plan: your contribution + institutional finance + government schemes
        </p>
      </div>

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
                <Input label="Available Margin Capital (₹)" type="number" value={marginInput} onChange={(e) => setMarginInput(e.target.value)} icon={<IndianRupee size={16} />} />
              </div>
              <div className="mt-3">
                <Button onClick={() => { setShowEdit(false); handleGetAdvice() }} loading={loading}>
                  <DollarSign size={16} />Refresh Funding Plan
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <Card className="p-10 text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Building Your Funding Strategy...</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Calculating optimal funding structure.</p>
        </Card>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

          {/* ─── FUNDING STRATEGY SUMMARY ─── */}
          <div className="card p-5" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--accent-bright)' }}>
              Your Funding Strategy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>PROJECT COST</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(result.projectCost)}</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>YOUR CONTRIBUTION</p>
                <p className="text-lg font-bold" style={{ color: 'var(--accent-bright)' }}>{formatCurrency(result.ownContribution)}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>10% margin</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>POTENTIAL FINANCE</p>
                <p className="text-lg font-bold" style={{ color: 'var(--info)' }}>{formatCurrency(result.potentialInstitutionalFinance)}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>90% institutional</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>BEST SCHEME</p>
                <p className="text-sm font-bold" style={{ color: 'var(--accent-bright)' }}>
                  {result.recommendedScheme?.schemeName || 'None'}
                </p>
                {result.recommendedScheme && (
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {result.recommendedScheme.interestRate}% p.a.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ─── EMI & REPAYMENT ─── */}
          {result.emi && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Monthly EMI', value: formatCurrency(result.emi.monthlyEMI) },
                { label: 'Total Interest', value: formatCurrency(result.emi.totalInterest) },
                { label: 'Total Repayment', value: formatCurrency(result.emi.totalRepayment) },
                { label: 'EMI/Income Ratio', value: `${(result.emiToIncomeRatio * 100).toFixed(1)}%` },
              ].map((metric, i) => (
                <div key={i} className="card p-3 text-center">
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{metric.label}</p>
                  <p className="text-base font-bold" style={{ color: 'var(--accent-bright)' }}>{metric.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* ─── AFFORDABILITY CHECK ─── */}
          <div className={`card p-4 flex items-start gap-3 ${result.canAffordEMI ? '' : 'border-[var(--warning)]'}`}
            style={{ 
              background: result.canAffordEMI ? 'rgba(34,197,94,0.06)' : 'rgba(234,179,8,0.06)',
              border: `1px solid ${result.canAffordEMI ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)'}`,
            }}>
            {result.canAffordEMI ? (
              <CheckCircle2 size={18} style={{ color: 'var(--success)' }} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={18} style={{ color: 'var(--warning)' }} className="mt-0.5 shrink-0" />
            )}
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: result.canAffordEMI ? 'var(--success)' : 'var(--warning)' }}>
                {result.canAffordEMI ? '✅ EMI is Affordable' : '⚠️ EMI May Be Tight'}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {result.canAffordEMI 
                  ? `Your EMI of ${formatCurrency(result.emi?.monthlyEMI || 0)} is ${(result.emiToIncomeRatio * 100).toFixed(1)}% of expected revenue — within the recommended 40% threshold.`
                  : `Your EMI of ${formatCurrency(result.emi?.monthlyEMI || 0)} is ${(result.emiToIncomeRatio * 100).toFixed(1)}% of expected revenue. Consider reducing the project scope or increasing revenue projections.`
                }
              </p>
            </div>
          </div>

          {/* ─── CASH FLOW CHART ─── */}
          {cashFlowData.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                12-Month Cash Flow Projection
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                  <XAxis dataKey="month" stroke={c.axis} fontSize={11} />
                  <YAxis stroke={c.axis} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value)]} />
                  <Legend />
                  <Bar dataKey="revenue" fill={c.success} name="Revenue" radius={[3, 3, 0, 0]} opacity={0.85} />
                  <Bar dataKey="operatingCost" fill={c.warning} name="Operating Cost" radius={[3, 3, 0, 0]} opacity={0.85} />
                  <Bar dataKey="loanRepayment" fill={c.danger} name="Loan Repayment" radius={[3, 3, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* ─── CUMULATIVE CASH FLOW LINE ─── */}
          {cashFlowData.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Cumulative Cash Flow
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                  <XAxis dataKey="month" stroke={c.axis} fontSize={11} />
                  <YAxis stroke={c.axis} fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), 'Cumulative']} />
                  <Line type="monotone" dataKey="cumulativeCashFlow" stroke={c.accent} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                Note: Projections are estimates based on your input. Actual results may vary. Revenue assumes gradual ramp-up.
              </p>
            </Card>
          )}

          {/* ─── WHY THIS SCHEME ─── */}
          {result.recommendedScheme && (
            <Card>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Why {result.recommendedScheme.schemeName}?
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {result.recommendedScheme.reason}
              </p>
              {result.recommendedScheme.moratoriumMonths > 0 && (
                <p className="text-xs leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>
                  <strong>During moratorium ({result.recommendedScheme.moratoriumMonths} months):</strong> You pay only interest on the loan.
                  Full EMI repayment begins after the moratorium period. This gives your business time to ramp up revenue.
                </p>
              )}
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
