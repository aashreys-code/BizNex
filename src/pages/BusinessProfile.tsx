import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  User, Briefcase, MapPin, IndianRupee, Globe, ArrowRight,
  CheckCircle2, Building2, Landmark, TrendingUp,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness, BusinessProfile as BP, DEFAULT } from '../contexts/BusinessContext'
import { ScrollReveal, GlowCard } from '../components/react-bits'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import TextArea from '../components/ui/TextArea'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'

const categories = [
  { value: 'General', label: 'General' },
  { value: 'SC', label: 'Scheduled Caste (SC)' },
  { value: 'ST', label: 'Scheduled Tribe (ST)' },
  { value: 'OBC', label: 'Other Backward Class (OBC)' },
  { value: 'Minority', label: 'Minority' },
  { value: 'Women', label: 'Women Entrepreneur' },
]

const genders = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
]

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिन्दी (Hindi)' },
  { value: 'Telugu', label: 'తెలుగు (Telugu)' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)' },
  { value: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'Marathi', label: 'मराठी (Marathi)' },
]

const businessTypes = [
  'Grocery Store', 'General Store', 'Medical Shop', 'Electronics Shop',
  'Clothing Store', 'Tailoring Shop', 'Beauty Parlor', 'Mobile Repair Shop',
  'Dairy Farm', 'Poultry Farm', 'Fishery', 'Organic Farming',
  'Fertilizer & Seed Shop', 'Hardware Store', 'Water Purification',
  'Restaurant / Food Stall', 'Bakery', 'Tea Stall',
  'Transport / Delivery', 'Printing & Photocopy',
  'Coaching Center', 'Cyber Cafe',
  'Textile Manufacturing', 'Food Processing',
  'Other',
]

const steps = [
  { icon: User, label: 'Personal' },
  { icon: Briefcase, label: 'Business' },
  { icon: IndianRupee, label: 'Financial' },
  { icon: CheckCircle2, label: 'Review' },
]

export default function BusinessProfilePage() {
  const { profile } = useAuth()
  const { business, setBusiness } = useBusiness()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<BP>(
    business || {
      ...DEFAULT,
      location: profile?.district && profile?.state
        ? `${profile.district}, ${profile.state}`
        : '',
    }
  )

  function update<K extends keyof BP>(key: K, value: BP[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function canNext() {
    if (step === 0) return form.age > 0 && form.gender && form.category
    if (step === 1) return form.businessType && form.location
    if (step === 2) return form.investmentAmount > 0
    return true
  }

  function handleSave() {
    setBusiness(form)
    toast.success('Business profile saved!')
    navigate('/dashboard')
  }

  const investStr = form.investmentAmount ? `₹${form.investmentAmount.toLocaleString('en-IN')}` : '—'
  const monthlyStr = form.monthlyIncome ? `₹${form.monthlyIncome.toLocaleString('en-IN')}` : '—'

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-moss-400 to-green-600 flex items-center justify-center">
            <Building2 size={24} className="text-charcoal-950" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Business Profile</h1>
            <p className="text-gray-400 text-sm">
              Enter your details once — all features will use this data automatically
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Step Indicator */}
      <ScrollReveal delay={0.05}>
        <div className="flex items-center justify-between glass rounded-2xl p-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  i < step
                    ? 'bg-moss-400 text-charcoal-950'
                    : i === step
                    ? 'bg-moss-400/20 border border-moss-400/40 text-moss-400'
                    : 'bg-white/5 text-gray-500'
                }`}
              >
                {i < step ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                i <= step ? 'text-white' : 'text-gray-500'
              }`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full ${
                  i < step ? 'bg-moss-400' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Form Steps */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 0: Personal */}
        {step === 0 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <User size={20} className="text-moss-400" />
              Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                placeholder="e.g., 30"
                value={form.age || ''}
                onChange={(e) => update('age', Number(e.target.value))}
                icon={<User size={18} />}
              />
              <Select
                label="Gender"
                value={form.gender}
                onChange={(e) => update('gender', e.target.value)}
                options={genders}
              />
            </div>
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              options={categories}
            />
            <Select
              label="Preferred Language"
              value={form.preferredLanguage}
              onChange={(e) => update('preferredLanguage', e.target.value)}
              options={languages}
            />
          </Card>
        )}

        {/* Step 1: Business */}
        {step === 1 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Briefcase size={20} className="text-moss-400" />
              Business Details
            </h2>
            <Select
              label="Business Type"
              value={form.businessType}
              onChange={(e) => update('businessType', e.target.value)}
              options={businessTypes.map((b) => ({ value: b, label: b }))}
            />
            {form.businessType === 'Other' && (
              <Input
                label="Custom Business Type"
                placeholder="Describe your business"
                value={form.businessType === 'Other' ? '' : form.businessType}
                onChange={(e) => update('businessType', e.target.value)}
                icon={<Briefcase size={18} />}
              />
            )}
            <TextArea
              label="Business Description (optional)"
              placeholder="Describe your business idea, target customers, what makes it unique..."
              value={form.businessDescription}
              onChange={(e) => update('businessDescription', e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location (District, State)"
                placeholder="e.g., Anantapur, Andhra Pradesh"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                icon={<MapPin size={18} />}
              />
              <Input
                label="Competitor Search Radius (km)"
                type="number"
                placeholder="10"
                value={form.radius}
                onChange={(e) => update('radius', Number(e.target.value) || 10)}
                icon={<MapPin size={18} />}
              />
            </div>
          </Card>
        )}

        {/* Step 2: Financial */}
        {step === 2 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <IndianRupee size={20} className="text-moss-400" />
              Financial Details
            </h2>
            <p className="text-sm text-gray-400">
              These values help us calculate loan eligibility, funding structure, and market analysis.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Total Investment Amount (₹)"
                type="number"
                placeholder="e.g., 500000"
                value={form.investmentAmount || ''}
                onChange={(e) => update('investmentAmount', Number(e.target.value))}
                icon={<IndianRupee size={18} />}
              />
              <Input
                label="Expected Monthly Income (₹)"
                type="number"
                placeholder="e.g., 30000"
                value={form.monthlyIncome || ''}
                onChange={(e) => update('monthlyIncome', Number(e.target.value))}
                icon={<TrendingUp size={18} />}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Existing Loans (₹)"
                type="number"
                placeholder="0 if none"
                value={form.existingLoans || ''}
                onChange={(e) => update('existingLoans', Number(e.target.value))}
                icon={<Landmark size={18} />}
              />
              <Input
                label="Working Capital Needed (₹)"
                type="number"
                placeholder="e.g., 100000"
                value={form.workingCapital || ''}
                onChange={(e) => update('workingCapital', Number(e.target.value))}
                icon={<IndianRupee size={18} />}
              />
            </div>
            <Input
              label="Equipment Cost (₹)"
              type="number"
              placeholder="e.g., 200000"
              value={form.equipmentCost || ''}
              onChange={(e) => update('equipmentCost', Number(e.target.value))}
              icon={<Building2 size={18} />}
            />
          </Card>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle2 size={20} className="text-moss-400" />
              Review Your Profile
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Business Type', value: form.businessType },
                { label: 'Location', value: form.location },
                { label: 'Category', value: form.category },
                { label: 'Age', value: `${form.age} years` },
                { label: 'Gender', value: form.gender },
                { label: 'Language', value: form.preferredLanguage },
                { label: 'Investment', value: investStr },
                { label: 'Monthly Income', value: monthlyStr },
                { label: 'Existing Loans', value: form.existingLoans ? `₹${form.existingLoans.toLocaleString('en-IN')}` : 'None' },
                { label: 'Working Capital', value: form.workingCapital ? `₹${form.workingCapital.toLocaleString('en-IN')}` : '—' },
                { label: 'Equipment Cost', value: form.equipmentCost ? `₹${form.equipmentCost.toLocaleString('en-IN')}` : '—' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl glass">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className="text-sm text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            {form.businessDescription && (
              <div className="p-3 rounded-xl glass">
                <p className="text-xs text-gray-400 mb-1">Business Description</p>
                <p className="text-sm text-gray-300">{form.businessDescription}</p>
              </div>
            )}
            <div className="p-4 rounded-xl bg-moss-400/5 border border-moss-400/20">
              <p className="text-sm text-moss-400 font-medium mb-1">What happens next?</p>
              <p className="text-xs text-gray-400">
                All features — Market Analysis, Business Plan, Scheme Finder, Loan Calculator,
                AI Assistant, Insights, Funding Advisor, and Competitors — will automatically
                use this data. No need to re-enter details on each page!
              </p>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        <div className="flex gap-3">
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={!canNext()}
            >
              Next
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <CheckCircle2 size={16} />
              Save & Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
