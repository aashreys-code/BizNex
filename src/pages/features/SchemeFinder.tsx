import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Search, Loader2, ExternalLink, IndianRupee, Edit3, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react'
import { findSchemes } from '../../lib/ai'
import { AnimatePresence } from 'motion/react'
import { useBusiness } from '../../contexts/BusinessContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'

interface Scheme {
  name: string
  eligibilityScore: number
  benefits: string
  maxLoanAmount: string
  interestRate: string
  requiredDocuments: string[]
  applicationProcess: string
  applicationLink: string
}

export default function SchemeFinder() {
  const { business, isComplete } = useBusiness()
  const { t } = useTranslation()
  const [age, setAge] = useState(business?.age ? String(business.age) : '')
  const [gender, setGender] = useState(business?.gender?.toLowerCase() || '')
  const [businessType, setBusinessType] = useState(business?.businessType || '')
  const [income, setIncome] = useState(business?.monthlyIncome ? String(business.monthlyIncome * 12) : '')
  const [investmentNeeded, setInvestmentNeeded] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [category, setCategory] = useState(business?.category?.toLowerCase() || '')
  const [loading, setLoading] = useState(false)
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [showEdit, setShowEdit] = useState(false)
  const [expandedScheme, setExpandedScheme] = useState<number | null>(null)

  useEffect(() => {
    if (schemes.length === 0 && !loading) handleFind()
  }, [])

  async function handleFind() {
    setLoading(true)
    try {
      const result = await findSchemes({
        age: Number(age || business?.age || 30),
        gender: gender || business?.gender || 'Male',
        businessType: businessType || business?.businessType || '',
        income: Number(income || (business?.monthlyIncome ? business.monthlyIncome * 12 : 200000)),
        investmentNeeded: Number(investmentNeeded || business?.investmentAmount || 500000),
        category: category || business?.category || 'General',
      })
      setSchemes(result.schemes)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function getScoreBadge(score: number) {
    if (score >= 80) return <span className="badge badge-success">{score}% Match</span>
    if (score >= 60) return <span className="badge badge-warning">{score}% Match</span>
    return <span className="badge badge-danger">{score}% Match</span>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div>
          <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{t('schemeFinder.title')}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('schemeFinder.subtitle')}</p>
        </div>
      </div>

      {/* Edit Toggle */}
      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
        >
          <Edit3 size={12} />{showEdit ? t('schemeFinder.hideProfile') : t('schemeFinder.editProfile')}{showEdit ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input label={t('schemeFinder.age')} type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                <Select label={t('schemeFinder.gender')} value={gender} onChange={(e) => setGender(e.target.value)} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
                <Select label={t('schemeFinder.businessType')} value={businessType} onChange={(e) => setBusinessType(e.target.value)} options={[{ value: 'dairy', label: 'Dairy' }, { value: 'retail', label: 'Retail' }, { value: 'manufacturing', label: 'Manufacturing' }, { value: 'services', label: 'Services' }, { value: 'agriculture', label: 'Agriculture' }, { value: 'food-processing', label: 'Food Processing' }]} />
                <Input label={t('schemeFinder.annualIncome')} type="number" value={income} onChange={(e) => setIncome(e.target.value)} icon={<IndianRupee size={16} />} />
                <Input label={t('schemeFinder.investmentNeeded')} type="number" value={investmentNeeded} onChange={(e) => setInvestmentNeeded(e.target.value)} icon={<IndianRupee size={16} />} />
                <Select label={t('schemeFinder.category')} value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: 'general', label: 'General' }, { value: 'obc', label: 'OBC' }, { value: 'sc', label: 'SC' }, { value: 'st', label: 'ST' }, { value: 'women', label: 'Women Entrepreneur' }, { value: 'minority', label: 'Minority' }]} />
              </div>
              <div className="mt-3">
                <Button onClick={() => { setShowEdit(false); handleFind() }} loading={loading}>
                  <Search size={16} />{t('schemeFinder.refreshSchemes')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {schemes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{t('schemeFinder.recommendedSchemes')}</h2>
          {schemes.map((scheme, i) => {
            const isExpanded = expandedScheme === i
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getScoreBadge(scheme.eligibilityScore)}
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{scheme.name}</h3>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{scheme.maxLoanAmount} max · {scheme.interestRate}</p>
                      </div>
                    </div>
                    {scheme.applicationLink && (
                      <a href={scheme.applicationLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: 'var(--accent-bright)' }}>
                        Apply <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{scheme.benefits}</p>

                  {/* Why You Match */}
                  <button onClick={() => setExpandedScheme(isExpanded ? null : i)}
                    className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                    style={{ color: 'var(--accent-bright)' }}>
                    <CheckCircle2 size={14} />
                    {isExpanded ? t('common.hideDetails') : t('schemeFinder.whyYouMatch')}
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{t('schemeFinder.requiredDocuments')}</p>
                              <ul className="space-y-1">
                                {scheme.requiredDocuments.map((doc, j) => (
                                  <li key={j} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--accent-bright)' }} />
                                    {doc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{t('schemeFinder.applicationProcess')}</p>
                              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{scheme.applicationProcess}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* No results */}
      {!loading && schemes.length === 0 && (
        <Card className="p-10 text-center">
          <Search size={36} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t('schemeFinder.noSchemes') || 'No matching schemes found'}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('schemeFinder.noSchemesDesc') || 'Try adjusting your profile details or category to find eligible schemes.'}</p>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card className="p-10 text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t('schemeFinder.loading')}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('schemeFinder.loadingDesc')}</p>
        </Card>
      )}
    </div>
  )
}
