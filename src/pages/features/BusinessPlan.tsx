import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { FileText, MapPin, IndianRupee, Loader2, Download, Copy, Edit3, ChevronUp, ChevronDown } from 'lucide-react'
import { generateBusinessPlan } from '../../lib/ai'
import { AnimatePresence } from 'motion/react'
import { useAuth } from '../../contexts/AuthContext'
import { useBusiness } from '../../contexts/BusinessContext'

import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'

const businessTypes = [
  { value: 'dairy-farm', label: 'Dairy Farm' },
  { value: 'grocery-store', label: 'Grocery Store' },
  { value: 'tailoring', label: 'Tailoring Shop' },
  { value: 'food-processing', label: 'Food Processing' },
  { value: 'textile', label: 'Textile Business' },
  { value: 'agriculture', label: 'Agriculture/Farming' },
  { value: 'poultry', label: 'Poultry Farm' },
  { value: 'fishery', label: 'Fishery' },
  { value: 'handicrafts', label: 'Handicrafts' },
  { value: 'digital-services', label: 'Digital Services' },
  { value: 'education', label: 'Education/Tuition' },
  { value: 'healthcare', label: 'Healthcare Clinic' },
  { value: 'transport', label: 'Transport Service' },
  { value: 'other', label: 'Other' },
]

export default function BusinessPlan() {
  const { profile } = useAuth()
  const { business, isComplete } = useBusiness()
  const { t } = useTranslation()
  const [businessType, setBusinessType] = useState(business?.businessType || '')
  const [budget, setBudget] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [location, setLocation] = useState(business?.location || profile?.district || '')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState('')
  const [copied, setCopied] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!plan && !loading) handleGenerate()
  }, [])

  async function handleGenerate() {
    const type = businessType || business?.businessType || ''
    const bud = budget || (business?.investmentAmount ? String(business.investmentAmount) : '')
    const loc = location || business?.location || ''
    if (!type || !bud || !loc) return
    setLoading(true)
    try {
      const result = await generateBusinessPlan({ businessType: type, budget: Number(bud), location: loc })
      setPlan(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(plan)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{t('businessPlan.title')}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('businessPlan.subtitle')}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select label={t('businessPlan.businessType')} value={businessType} onChange={(e) => setBusinessType(e.target.value)} options={businessTypes} />
                <Input label={t('businessPlan.budget')} type="number" value={budget} onChange={(e) => setBudget(e.target.value)} icon={<IndianRupee size={16} />} />
                <Input label={t('businessPlan.location')} value={location} onChange={(e) => setLocation(e.target.value)} icon={<MapPin size={16} />} />
              </div>
              <div className="mt-3">
                <Button onClick={() => { setShowEdit(false); handleGenerate() }} loading={loading}>
                  <FileText size={16} />{t('businessPlan.regeneratePlan')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {plan && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('businessPlan.yourPlan')}</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy size={14} />
                  {copied ? t('businessPlan.copied') : t('businessPlan.copy')}
                </Button>
                <Button variant="secondary" size="sm">
                  <Download size={14} />
                  {t('businessPlan.downloadPDF')}
                </Button>
              </div>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {plan}
            </div>
          </Card>
        </motion.div>
      )}

      {loading && (
        <Card className="p-10 text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t('businessPlan.generating')}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('businessPlan.generatingDesc')}</p>
        </Card>
      )}
    </div>
  )
}
