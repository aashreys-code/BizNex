import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Search, Loader2, ExternalLink, FileCheck, IndianRupee, Clock } from 'lucide-react'
import { findSchemes } from '../../lib/ai'
import { useBusiness } from '../../contexts/BusinessContext'
import { ScrollReveal, GlowCard } from '../../components/react-bits'
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
  const [age, setAge] = useState(business?.age ? String(business.age) : '')
  const [gender, setGender] = useState(business?.gender?.toLowerCase() || '')
  const [businessType, setBusinessType] = useState(business?.businessType || '')
  const [income, setIncome] = useState(business?.monthlyIncome ? String(business.monthlyIncome * 12) : '')
  const [investmentNeeded, setInvestmentNeeded] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [category, setCategory] = useState(business?.category?.toLowerCase() || '')
  const [loading, setLoading] = useState(false)
  const [schemes, setSchemes] = useState<Scheme[]>([])

  useEffect(() => {
    if (isComplete && schemes.length === 0 && !loading) handleFind()
  }, [isComplete])

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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
            <Search size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Government Scheme Finder</h1>
            <p className="text-gray-400 text-sm">Find schemes you're eligible for with AI matching</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Input Form */}
      <ScrollReveal delay={0.1}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Age"
              type="number"
              placeholder="e.g., 35"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
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
                { value: 'food-processing', label: 'Food Processing' },
              ]}
            />
            <Input
              label="Annual Income (₹)"
              type="number"
              placeholder="e.g., 200000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              icon={<IndianRupee size={18} />}
            />
            <Input
              label="Investment Needed (₹)"
              type="number"
              placeholder="e.g., 500000"
              value={investmentNeeded}
              onChange={(e) => setInvestmentNeeded(e.target.value)}
              icon={<IndianRupee size={18} />}
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'general', label: 'General' },
                { value: 'obc', label: 'OBC' },
                { value: 'sc', label: 'SC' },
                { value: 'st', label: 'ST' },
                { value: 'women', label: 'Women Entrepreneur' },
                { value: 'minority', label: 'Minority' },
              ]}
            />
          </div>
          <div className="mt-4">
            <Button onClick={handleFind} loading={loading}>
              <Search size={18} />
              Find Eligible Schemes
            </Button>
          </div>
        </Card>
      </ScrollReveal>

      {/* Results */}
      {schemes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recommended Schemes</h2>
          {schemes.map((scheme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlowCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{scheme.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        scheme.eligibilityScore >= 80
                          ? 'bg-green-500/20 text-green-400'
                          : scheme.eligibilityScore >= 60
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {scheme.eligibilityScore}% Match
                      </span>
                    </div>
                  </div>
                  {scheme.applicationLink && (
                    <a
                      href={scheme.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300"
                    >
                      Apply <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <p className="text-gray-300 text-sm mb-4">{scheme.benefits}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <IndianRupee size={16} className="text-primary-400" />
                    <span className="text-gray-400">Max Loan:</span>
                    <span className="text-white font-medium">{scheme.maxLoanAmount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileCheck size={16} className="text-accent-400" />
                    <span className="text-gray-400">Interest:</span>
                    <span className="text-white font-medium">{scheme.interestRate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-gray-400">Docs Required:</span>
                    <span className="text-white font-medium">{scheme.requiredDocuments.length} documents</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Required Documents</h4>
                    <ul className="space-y-1">
                      {scheme.requiredDocuments.map((doc, j) => (
                        <li key={j} className="text-sm text-gray-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Application Process</h4>
                    <p className="text-sm text-gray-300">{scheme.applicationProcess}</p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <Card className="p-12 text-center">
          <Loader2 size={48} className="text-purple-400 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Finding Eligible Schemes...</h3>
          <p className="text-gray-400">Matching your profile against 50+ government schemes.</p>
        </Card>
      )}
    </div>
  )
}
