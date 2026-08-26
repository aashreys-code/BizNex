import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  User, Briefcase, MapPin, IndianRupee, ArrowRight,
  CheckCircle2, Building2, Landmark, TrendingUp, Plus,
  Trash2, Edit3, ArrowLeft,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness, BusinessProfile as BP } from '../contexts/BusinessContext'
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

const EMPTY: Omit<BP, 'id' | 'createdAt'> = {
  name: '',
  age: 30,
  gender: 'Male',
  category: 'General',
  businessType: '',
  businessDescription: '',
  location: '',
  radius: 10,
  investmentAmount: 0,
  monthlyIncome: 0,
  existingLoans: 0,
  workingCapital: 0,
  equipmentCost: 0,
  preferredLanguage: 'English',
}

type View = 'list' | 'create' | 'edit'

export default function BusinessProfilePage() {
  const { profile } = useAuth()
  const { profiles, activeId, business, addProfile, updateProfile, deleteProfile, setActiveId } = useBusiness()
  const navigate = useNavigate()
  const [view, setView] = useState<View>('list')
  const [step, setStep] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<BP, 'id' | 'createdAt'>>({
    ...EMPTY,
    location: profile?.district && profile?.state
      ? `${profile.district}, ${profile.state}`
      : '',
  })

  function update<K extends keyof Omit<BP, 'id' | 'createdAt'>>(key: K, value: Omit<BP, 'id' | 'createdAt'>[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function startCreate() {
    setForm({
      ...EMPTY,
      location: profile?.district && profile?.state
        ? `${profile.district}, ${profile.state}`
        : '',
    })
    setEditingId(null)
    setStep(0)
    setView('create')
  }

  function startEdit(p: BP) {
    setForm({
      name: p.name,
      age: p.age,
      gender: p.gender,
      category: p.category,
      businessType: p.businessType,
      businessDescription: p.businessDescription,
      location: p.location,
      radius: p.radius,
      investmentAmount: p.investmentAmount,
      monthlyIncome: p.monthlyIncome,
      existingLoans: p.existingLoans,
      workingCapital: p.workingCapital,
      equipmentCost: p.equipmentCost,
      preferredLanguage: p.preferredLanguage,
    })
    setEditingId(p.id)
    setStep(0)
    setView('edit')
  }

  function handleDelete(id: string) {
    deleteProfile(id)
    toast.success('Profile deleted')
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error('Please enter a profile name')
      return
    }
    if (editingId) {
      updateProfile(editingId, form)
      toast.success('Profile updated!')
    } else {
      addProfile(form)
      toast.success('Profile created!')
    }
    setView('list')
  }

  function canNext() {
    if (step === 0) return form.name.trim().length > 0
    if (step === 1) return form.age > 0 && form.gender && form.category
    if (step === 2) return form.businessType && form.location
    if (step === 3) return form.investmentAmount > 0
    return true
  }

  // Profile list view
  if (view === 'list') {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-moss-400 to-green-600 flex items-center justify-center">
                <Building2 size={24} className="text-charcoal-950" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Business Profiles</h1>
                <p className="text-gray-400 text-sm">
                  Manage multiple businesses — switch between them anytime
                </p>
              </div>
            </div>
            <Button onClick={startCreate}>
              <Plus size={16} />
              New Profile
            </Button>
          </div>
        </ScrollReveal>

        {profiles.length === 0 ? (
          <ScrollReveal delay={0.1}>
            <Card className="p-12 text-center">
              <Building2 size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Business Profiles Yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first business profile to unlock all features.
              </p>
              <Button onClick={startCreate}>
                <Plus size={16} />
                Create First Profile
              </Button>
            </Card>
          </ScrollReveal>
        ) : (
          <div className="space-y-3">
            {profiles.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.05}>
                <div
                  className={`glass rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 ${
                    activeId === p.id
                      ? 'border border-moss-400/30 bg-moss-400/5'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => setActiveId(p.id)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    activeId === p.id
                      ? 'bg-moss-400/20 text-moss-400'
                      : 'bg-white/5 text-gray-400'
                  }`}>
                    <Building2 size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold truncate">{p.name}</p>
                      {activeId === p.id && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-moss-400/20 text-moss-400 font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {p.businessType} · {p.location} · ₹{p.investmentAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(p) }}
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(p.id) }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Create / Edit form view
  const isEdit = view === 'edit'
  const steps = [
    { icon: User, label: 'Profile' },
    { icon: User, label: 'Personal' },
    { icon: Briefcase, label: 'Business' },
    { icon: IndianRupee, label: 'Financial' },
  ]

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setView('list')} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Profile' : 'New Profile'}</h1>
            <p className="text-gray-400 text-sm">
              {isEdit ? 'Update your business details' : 'Enter your business details — all features will use this data'}
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

      {/* Steps */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 0 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 size={20} className="text-moss-400" />
              Profile Name
            </h2>
            <Input
              label="Give this business a name"
              placeholder="e.g., My Grocery Store, Dairy Farm, Tailoring Shop"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              icon={<Building2 size={18} />}
            />
            <p className="text-xs text-gray-500">
              This helps you identify the profile when switching between businesses.
            </p>
          </Card>
        )}

        {step === 1 && (
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

        {step === 2 && (
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

        {step === 3 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <IndianRupee size={20} className="text-moss-400" />
              Financial Details
            </h2>
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
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => step === 0 ? setView('list') : setStep((s) => s - 1)}
        >
          <ArrowLeft size={16} />
          {step === 0 ? 'Back to List' : 'Back'}
        </Button>
        <div className="flex gap-3">
          {step < 3 ? (
            <Button onClick={() => setStep((s) => Math.min(3, s + 1))} disabled={!canNext()}>
              Next
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <CheckCircle2 size={16} />
              {isEdit ? 'Save Changes' : 'Create Profile'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
