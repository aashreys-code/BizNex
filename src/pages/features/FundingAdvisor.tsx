import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { DollarSign, Loader2, IndianRupee, Landmark, Gift, Edit3, ChevronUp, ChevronDown } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { getFundingAdvice } from '../../lib/ai'
import { AnimatePresence } from 'motion/react'
import { useBusiness } from '../../contexts/BusinessContext'
import { useTheme } from '../../contexts/ThemeContext'
import { chartColors, tooltipContentStyle } from '../../lib/chartColors'
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
  const { business, isComplete } = useBusiness()
  const { isDark } = useTheme()
  const { t } = useTranslation()
  const c = chartColors(isDark)
  const [businessType, setBusinessType] = useState(business?.businessType || '')
  const [totalCost, setTotalCost] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [workingCapital, setWorkingCapital] = useState(business?.workingCapital ? String(business.workingCapital) : '')
  const [equipmentCost, setEquipmentCost] = useState(business?.equipmentCost ? String(business.equipmentCost) : '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FundingResult | null>(null)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!result && !loading) handleGetAdvice()
  }, [])

  async function handleGetAdvice() {
    const type = businessType || business?.businessType || ''
    const cost = totalCost || (business?.investmentAmount ? String(business.investmentAmount) : '')
    const wc = workingCapital || (business?.workingCapital ? String(business.workingCapital) : '')
    const ec = equipmentCost || (business?.equipmentCost ? String(business.equipmentCost) : '')
    if (!type || !cost || !wc || !ec) return
    setLoading(true)
    try {
      const data = await getFundingAdvice({ businessType: type, totalCost: Number(cost), workingCapital: Number(wc), equipmentCost: Number(ec) })
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
        <div>
          <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{t('fundingAdvisor.title')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('fundingAdvisor.subtitle')}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
        >
          <Edit3 size={12} />{showEdit ? t('common.hide') : t('common.editDetails')}{showEdit ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select label={t('fundingAdvisor.businessType')} value={businessType} onChange={(e) => setBusinessType(e.target.value)} options={[{ value: 'dairy', label: 'Dairy Farm' }, { value: 'retail', label: 'Retail Store' }, { value: 'food-processing', label: 'Food Processing' }, { value: 'manufacturing', label: 'Manufacturing' }, { value: 'services', label: 'Services' }]} />
                <Input label={t('fundingAdvisor.totalCost')} type="number" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} icon={<IndianRupee size={16} />} />
                <Input label={t('fundingAdvisor.workingCapital')} type="number" value={workingCapital} onChange={(e) => setWorkingCapital(e.target.value)} icon={<IndianRupee size={16} />} />
                <Input label={t('fundingAdvisor.equipmentCost')} type="number" value={equipmentCost} onChange={(e) => setEquipmentCost(e.target.value)} icon={<IndianRupee size={16} />} />
              </div>
              <div className="mt-3">
                <Button onClick={() => { setShowEdit(false); handleGetAdvice() }} loading={loading}>
                  <DollarSign size={16} />{t('fundingAdvisor.refreshAnalysis')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Funding Plan Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: t('fundingAdvisor.ownContribution'), value: `₹${result.totalFundingPlan.ownContribution.toLocaleString('en-IN')}` },
              { label: t('fundingAdvisor.loanAmount'), value: `₹${result.totalFundingPlan.loanAmount.toLocaleString('en-IN')}` },
              { label: t('fundingAdvisor.subsidyAmount'), value: `₹${result.totalFundingPlan.subsidyAmount.toLocaleString('en-IN')}` },
            ].map((item, i) => (
              <div key={i} className="card p-3 text-center">
                <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                <p className="text-base font-bold" style={{ color: 'var(--accent-bright)' }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Cash Flow Chart */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{t('fundingAdvisor.projectedCashFlow')}</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={result.monthlyCashFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
                <XAxis dataKey="month" stroke={c.axis} fontSize={11} />
                <YAxis stroke={c.axis} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`]} />
                <Legend />
                <Bar dataKey="inflow" fill={c.success} name="Inflow" radius={[3, 3, 0, 0]} opacity={0.85} />
                <Bar dataKey="outflow" fill={c.danger} name="Outflow" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Funding Sources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} style={{ color: 'var(--accent-bright)' }} />
                <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t('fundingAdvisor.selfFunding')}</h3>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                <p className="text-lg font-bold" style={{ color: 'var(--accent-bright)' }}>{result.selfFunding.percentage}%</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>₹{result.selfFunding.amount.toLocaleString('en-IN')}</p>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-2">
                <Landmark size={14} style={{ color: 'var(--info)' }} />
                <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t('fundingAdvisor.governmentLoans')}</h3>
              </div>
              <div className="space-y-2">
                {result.governmentLoans.map((loan, i) => (
                  <div key={i} className="p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{loan.scheme}</p>
                    <p className="text-[11px]" style={{ color: 'var(--info)' }}>₹{loan.amount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{loan.subsidy}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-2">
                <Gift size={14} style={{ color: 'var(--accent-bright)' }} />
                <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t('fundingAdvisor.subsidies')}</h3>
              </div>
              <div className="space-y-2">
                {result.subsidies.map((sub, i) => (
                  <div key={i} className="p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{sub.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--accent-bright)' }}>₹{sub.amount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{sub.eligibility}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {loading && (
        <Card className="p-10 text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t('fundingAdvisor.analyzing')}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('fundingAdvisor.analyzingDesc')}</p>
        </Card>
      )}
    </div>
  )
}
