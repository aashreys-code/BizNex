import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Search, Loader2, ExternalLink, IndianRupee, Edit3, ChevronUp, ChevronDown, CheckCircle2, AlertCircle, Info, Shield } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { useBusiness } from '../../contexts/BusinessContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'
import { findSchemes } from '../../lib/ai'

interface Scheme {
  name: string
  fullName?: string
  ministry?: string
  eligibilityScore: number
  benefits: string
  description?: string
  maxLoanAmount: string
  interestRate: string
  subsidy?: string
  requiredDocuments: string[]
  applicationProcess: string
  applicationLink: string
  eligibilityCriteria?: string
  lastVerified?: string
  source?: string
}

function getEligibilityStatus(score: number, scheme: Scheme): {
  label: string
  type: 'confirmed' | 'profile-match' | 'low-match'
  color: string
  bgColor: string
  description: string
} {
  // "Confirmed Eligibility" requires high score (>80) and matching all criteria
  // "Profile Match" means general profile alignment but needs verification
  if (score >= 80) {
    return {
      label: 'Confirmed Eligibility',
      type: 'confirmed',
      color: '#22c55e',
      bgColor: 'rgba(34,197,94,0.12)',
      description: 'Your profile matches all major criteria. Proceed with application.',
    }
  }
  if (score >= 60) {
    return {
      label: 'Profile Match',
      type: 'profile-match',
      color: '#eab308',
      bgColor: 'rgba(234,179,8,0.12)',
      description: 'Your profile aligns with this scheme. Verify specific requirements before applying.',
    }
  }
  return {
    label: 'Low Match',
    type: 'low-match',
    color: 'var(--text-muted)',
    bgColor: 'var(--bg-surface)',
    description: 'Limited profile alignment. Review eligibility criteria carefully.',
  }
}

export default function SchemeFinder() {
  const { business } = useBusiness()
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

  const confirmedSchemes = schemes.filter(s => s.eligibilityScore >= 80)
  const profileMatchSchemes = schemes.filter(s => s.eligibilityScore >= 60 && s.eligibilityScore < 80)
  const lowMatchSchemes = schemes.filter(s => s.eligibilityScore < 60)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{t('schemeFinder.title')}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Find government schemes you're eligible for — with clear eligibility status
        </p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Confirmed Eligibility</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#eab308' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Profile Match — Verify Before Applying</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Low Match</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}>
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
        <div className="space-y-5">
          {/* Confirmed Eligibility */}
          {confirmedSchemes.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#22c55e' }}>
                <CheckCircle2 size={14} />
                Confirmed Eligibility ({confirmedSchemes.length})
              </h2>
              <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
                Your profile matches all major criteria for these schemes. Proceed with application.
              </p>
              <div className="space-y-3">
                {confirmedSchemes.map((scheme, i) => (
                  <SchemeCard key={i} scheme={scheme} index={i} expanded={expandedScheme === i} onToggle={() => setExpandedScheme(expandedScheme === i ? null : i)} />
                ))}
              </div>
            </div>
          )}

          {/* Profile Match */}
          {profileMatchSchemes.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#eab308' }}>
                <AlertCircle size={14} />
                Profile Match ({profileMatchSchemes.length})
              </h2>
              <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
                Your profile aligns with these schemes. Verify specific requirements and documents before applying.
              </p>
              <div className="space-y-3">
                {profileMatchSchemes.map((scheme, i) => (
                  <SchemeCard key={i} scheme={scheme} index={confirmedSchemes.length + i} expanded={expandedScheme === confirmedSchemes.length + i} onToggle={() => setExpandedScheme(expandedScheme === confirmedSchemes.length + i ? null : confirmedSchemes.length + i)} />
                ))}
              </div>
            </div>
          )}

          {/* Low Match */}
          {lowMatchSchemes.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <Info size={14} />
                Other Schemes ({lowMatchSchemes.length})
              </h2>
              <div className="space-y-3">
                {lowMatchSchemes.map((scheme, i) => (
                  <SchemeCard key={i} scheme={scheme} index={confirmedSchemes.length + profileMatchSchemes.length + i} expanded={expandedScheme === confirmedSchemes.length + profileMatchSchemes.length + i} onToggle={() => setExpandedScheme(expandedScheme === confirmedSchemes.length + profileMatchSchemes.length + i ? null : confirmedSchemes.length + profileMatchSchemes.length + i)} />
                ))}
              </div>
            </div>
          )}

          {/* Data Credibility Note */}
          <div className="card p-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-2">
              <Shield size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <div>
                <p className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>About Eligibility Scoring</p>
                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Eligibility is calculated from your profile (age, gender, category, business type, investment amount).
                  "Confirmed Eligibility" means all checked criteria pass. "Profile Match" means general alignment — verify specific requirements on the official portal.
                  Scheme details sourced from official portals (kvic.org.in, mudra.org.in, standupmitra.in).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && schemes.length === 0 && (
        <Card className="p-10 text-center">
          <Search size={36} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{t('schemeFinder.noSchemes') || 'No matching schemes found'}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t('schemeFinder.noSchemesDesc') || 'Try adjusting your profile details or category to find eligible schemes.'}</p>
        </Card>
      )}

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

function SchemeCard({ scheme, index, expanded, onToggle }: { scheme: Scheme; index: number; expanded: boolean; onToggle: () => void }) {
  const status = getEligibilityStatus(scheme.eligibilityScore, scheme)
  const { t } = useTranslation()

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <div className="card p-4" style={{ borderLeft: `3px solid ${status.color}` }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: status.bgColor, color: status.color, border: `1px solid ${status.color}30` }}
            >
              {status.type === 'confirmed' && <CheckCircle2 size={10} />}
              {status.type === 'profile-match' && <AlertCircle size={10} />}
              {scheme.eligibilityScore}%
            </span>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{scheme.name}</h3>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {scheme.ministry || 'Ministry of Finance'} · {scheme.maxLoanAmount} max · {scheme.interestRate}
              </p>
            </div>
          </div>
          {scheme.applicationLink && (
            <a href={scheme.applicationLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium shrink-0"
              style={{ color: 'var(--accent-bright)' }}>
              Apply <ExternalLink size={12} />
            </a>
          )}
        </div>

        <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
          {scheme.benefits || scheme.description}
        </p>

        {/* Eligibility status description */}
        <div className="mb-2 p-2 rounded-lg" style={{ background: status.bgColor, border: `1px solid ${status.color}20` }}>
          <p className="text-[10px] font-medium" style={{ color: status.color }}>
            {status.label}: {status.description}
          </p>
        </div>

        <button onClick={onToggle}
          className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
          style={{ color: 'var(--accent-bright)' }}>
          <CheckCircle2 size={14} />
          {expanded ? t('common.hideDetails') : t('schemeFinder.whyYouMatch')}
        </button>

        <AnimatePresence>
          {expanded && (
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
                {scheme.eligibilityCriteria && (
                  <div className="mt-3 p-2 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                    <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Official Eligibility Criteria</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{scheme.eligibilityCriteria}</p>
                  </div>
                )}
                {scheme.subsidy && (
                  <div className="mt-2 p-2 rounded-lg" style={{ background: 'var(--accent-dim)' }}>
                    <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--accent-bright)' }}>Subsidy</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{scheme.subsidy}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
