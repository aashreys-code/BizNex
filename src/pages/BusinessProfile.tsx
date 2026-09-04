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
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Business Profiles</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Manage multiple businesses — switch between them anytime
              </p>
            </div>
            <Button onClick={startCreate}>
              <Plus size={16} />
              New Profile
            </Button>
          </div>
        </div>

        {profiles.length === 0 ? (
          <div>
            <Card className="p-10 text-center">
              <Building2 size={36} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>No Business Profiles Yet</h3>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                Create your first business profile to unlock all features.
              </p>
              <Button onClick={startCreate}>
                <Plus size={16} />
                Create First Profile
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-3">
            {profiles.map((p, i) => (
              <div>
                <div
                  className="card card-interactive p-4 flex items-center gap-3 cursor-pointer"
                  style={{
                    borderLeft: activeId === p.id ? '3px solid var(--accent-bright)' : '3px solid transparent',
                  }}
                  onClick={() => setActiveId(p.id)}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: activeId === p.id ? 'var(--accent-dim)' : 'var(--bg-surface)' }}>
                    <Building2 size={18} style={{ color: activeId === p.id ? 'var(--accent-bright)' : 'var(--text-muted)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                      {activeId === p.id && (
                        <span className="badge badge-success">Active</span>
                      )}
                    </div>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {p.businessType} · {p.location} · ₹{p.investmentAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(p) }}
                      className="p-1.5 rounded-md transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(p.id) }}
                      className="p-1.5 rounded-md transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
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
      {/* Header */}        <div>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setView('list')} className="p-1.5 rounded-md transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{isEdit ? 'Edit Profile' : 'New Profile'}</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {isEdit ? 'Update your business details' : 'Enter your business details — all features will use this data'}
              </p>
            </div>
          </div>
        </div>

      {/* Step Indicator */}
      <div>
        <div className="flex items-center justify-between card p-3">
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
      </div>

      {/* Steps */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 0 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Building2 size={16} style={{ color: 'var(--accent-bright)' }} />
              Profile Name
            </h2>
            <Input
              label="Give this business a name"
              placeholder="e.g., My Grocery Store, Dairy Farm, Tailoring Shop"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              icon={<Building2 size={18} />}
            />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              This helps you identify the profile when switching between businesses.
            </p>
          </Card>
        )}

        {step === 1 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <User size={16} style={{ color: 'var(--accent-bright)' }} />
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
            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Briefcase size={16} style={{ color: 'var(--accent-bright)' }} />
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
            <Input
              label="Location (District, State)"
              placeholder="e.g., Anantapur, Andhra Pradesh"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              icon={<MapPin size={18} />}
            />
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <IndianRupee size={16} style={{ color: 'var(--accent-bright)' }} />
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
