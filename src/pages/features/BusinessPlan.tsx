import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { FileText, MapPin, IndianRupee, Loader2, Download, Copy, Edit3, ChevronUp, ChevronDown } from 'lucide-react'
import { generateBusinessPlan } from '../../lib/ai'
import { AnimatePresence } from 'motion/react'
import { useAuth } from '../../contexts/AuthContext'
import { useBusiness } from '../../contexts/BusinessContext'
import { ScrollReveal, GlowCard } from '../../components/react-bits'
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
      const result = await generateBusinessPlan({
        businessType: type,
        budget: Number(bud),
        location: loc,
      })
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Business Plan Generator</h1>
            <p className="text-gray-400 text-sm">Create a comprehensive business plan in minutes</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Edit Toggle */}
      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          <Edit3 size={14} />{showEdit ? 'Hide' : 'Edit Details'}{showEdit ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Business Type" value={businessType} onChange={(e) => setBusinessType(e.target.value)} options={businessTypes} />
                <Input label="Budget (₹)" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} icon={<IndianRupee size={18} />} />
                <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} icon={<MapPin size={18} />} />
              </div>
              <div className="mt-4">
                <Button onClick={() => { setShowEdit(false); handleGenerate() }} loading={loading}>
                  <FileText size={18} />Regenerate Plan
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Plan */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Your Business Plan</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy size={16} />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="secondary" size="sm">
                  <Download size={16} />
                  Download PDF
                </Button>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                {plan}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-12 text-center">
          <Loader2 size={48} className="text-primary-400 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Generating Your Business Plan...</h3>
          <p className="text-gray-400">Our AI is analyzing your business details and creating a comprehensive plan.</p>
        </Card>
      )}
    </div>
  )
}
