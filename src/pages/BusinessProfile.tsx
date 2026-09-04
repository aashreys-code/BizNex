import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  MapPin, Briefcase, IndianRupee, Building2, CheckCircle2,
  Plus, Trash2, Edit3, ArrowLeft, ArrowRight, Search, Mic,
  ChevronRight, Store, Tractor, Scissors, Smartphone, ShoppingBag,
  Coffee, Wrench, Heart, Star, Package,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness, BusinessProfile as BP } from '../contexts/BusinessContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import LocationSearch from '../components/ui/LocationSearch'

const BUSINESS_CATEGORIES = [
  { id: 'grocery', label: 'Grocery / Kirana Store', icon: ShoppingBag, desc: 'Daily essentials for your community' },
  { id: 'dairy', label: 'Dairy / Milk Shop', icon: Coffee, desc: 'Milk, curd, and dairy products' },
  { id: 'tailoring', label: 'Tailoring / Stitching', icon: Scissors, desc: 'Clothes stitching and alterations' },
  { id: 'mobile', label: 'Mobile Repair Shop', icon: Smartphone, desc: 'Phone repair and accessories' },
  { id: 'food', label: 'Restaurant / Food Stall', icon: Coffee, desc: 'Meals, snacks, and tea' },
  { id: 'bakery', label: 'Bakery / Sweets Shop', icon: Package, desc: 'Bread, cake, and sweets' },
  { id: 'fertilizer', label: 'Fertilizer / Seed Shop', icon: Tractor, desc: 'Agricultural inputs for farmers' },
  { id: 'hardware', label: 'Hardware / Repair Shop', icon: Wrench, desc: 'Tools, parts, and repairs' },
  { id: 'beauty', label: 'Beauty Parlor / Salon', icon: Heart, desc: 'Beauty and grooming services' },
  { id: 'general', label: 'General Store / Retail', icon: Store, desc: 'Mixed products for daily needs' },
  { id: 'other', label: 'Something Else', icon: Star, desc: 'Tell us about your business idea' },
]

const INVESTMENT_PRESETS = [
  { amount: 25000, label: '₹25K', desc: 'Small start' },
  { amount: 50000, label: '₹50K', desc: 'Basic setup' },
  { amount: 100000, label: '₹1 Lakh', desc: 'Standard' },
  { amount: 250000, label: '₹2.5 Lakh', desc: 'Good foundation' },
  { amount: 500000, label: '₹5 Lakh', desc: 'Full setup' },
  { amount: 1000000, label: '₹10 Lakh', desc: 'Premium' },
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
  const [customBusinessType, setCustomBusinessType] = useState('')
  const [form, setForm] = useState<Omit<BP, 'id' | 'createdAt'>>({
    ...EMPTY,
    location: profile?.district && profile?.state
      ? `${profile.district}, ${profile.state}`
      : '',
  })

  const update = useCallback(<K extends keyof Omit<BP, 'id' | 'createdAt'>>(key: K, value: Omit<BP, 'id' | 'createdAt'>[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }, [])

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
    // Auto-generate name from business type if empty
    const name = form.name.trim() || form.businessType || 'My Business'
    const data = { ...form, name }
    
    if (editingId) {
      updateProfile(editingId, data)
      toast.success('Profile updated!')
    } else {
      addProfile(data)
      toast.success('Profile created! Let\'s analyze your market.')
      navigate('/dashboard')
    }
    setView('list')
  }

  function canNext() {
    if (step === 0) return !!form.locationData?.district
    if (step === 1) return !!form.businessType
    if (step === 2) return form.investmentAmount > 0
    if (step === 3) return true // existing/new is optional
    return true
  }

  // ─── Profile List View ───
  if (view === 'list') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Your Businesses</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Manage your business profiles
            </p>
          </div>
          <Button onClick={startCreate}>
            <Plus size={16} />
            New Business
          </Button>
        </div>

        {profiles.length === 0 ? (
          <Card className="p-10 text-center">
            <Building2 size={36} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
            <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>No Businesses Yet</h3>
            <p className="text-sm mb-5 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Tell us about your business idea and we'll help you plan it.
            </p>
            <Button onClick={startCreate}>
              <Plus size={16} />
              Start Your First Business
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {profiles.map(p => (
              <div
                key={p.id}
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
                    {activeId === p.id && <span className="badge badge-success">Active</span>}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                    {p.businessType} · {p.location} · ₹{p.investmentAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); startEdit(p) }}
                    className="p-1.5 rounded-md transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <Edit3 size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id) }}
                    className="p-1.5 rounded-md transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ─── Create / Edit Wizard ───
  const isEdit = view === 'edit'
  const totalSteps = 5

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setView('list')} className="p-1.5 rounded-md transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit Business' : 'Tell Us About Your Business'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Step {step + 1} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-strong)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--accent-bright)' }}
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Step 1: Location */}
          {step === 0 && (
            <Card className="p-6 space-y-5">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'var(--accent-dim)' }}>
                  <MapPin size={28} style={{ color: 'var(--accent-bright)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Where do you want to start your business?
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Search for your village, town, or area
                </p>
              </div>
              <LocationSearch
                value={form.location}
                locationData={form.locationData}
                onSelect={(loc) => {
                  update('location', loc.shortName)
                  update('locationData', {
                    village: loc.village || '',
                    block: loc.block || '',
                    district: loc.district || '',
                    state: loc.state || '',
                    lat: loc.lat,
                    lng: loc.lng,
                    source: loc.source,
                  })
                }}
              />
              {form.locationData && (
                <div className="p-3 rounded-lg" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
                  <p className="text-xs font-medium" style={{ color: 'var(--accent-bright)' }}>📍 Selected Location</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{form.location}</p>
                  {form.locationData.source && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Source: {form.locationData.source}
                    </p>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Step 2: Business Type */}
          {step === 1 && (
            <Card className="p-6 space-y-5">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'var(--accent-dim)' }}>
                  <Briefcase size={28} style={{ color: 'var(--accent-bright)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  What kind of business do you want to start?
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Pick the closest match
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BUSINESS_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'other') {
                        update('businessType', customBusinessType || 'Other')
                      } else {
                        update('businessType', cat.label)
                      }
                    }}
                    className="p-3 rounded-xl text-left transition-all duration-150"
                    style={{
                      background: form.businessType === cat.label ? 'var(--accent-dim)' : 'var(--bg-surface)',
                      border: form.businessType === cat.label
                        ? '2px solid var(--accent-bright)'
                        : '2px solid var(--border)',
                    }}
                  >
                    <cat.icon size={20} style={{
                      color: form.businessType === cat.label ? 'var(--accent-bright)' : 'var(--text-muted)'
                    }} />
                    <p className="text-xs font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>
                      {cat.label}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {cat.desc}
                    </p>
                  </button>
                ))}
              </div>
              {form.businessType === 'Something Else' && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Tell us your business idea..."
                    value={customBusinessType}
                    onChange={(e) => {
                      setCustomBusinessType(e.target.value)
                      update('businessType', e.target.value)
                    }}
                    className="input-field w-full"
                  />
                </div>
              )}
            </Card>
          )}

          {/* Step 3: Investment */}
          {step === 2 && (
            <Card className="p-6 space-y-5">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'var(--accent-dim)' }}>
                  <IndianRupee size={28} style={{ color: 'var(--accent-bright)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  How much money can you invest?
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  This is your own money — not a loan
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {INVESTMENT_PRESETS.map(preset => (
                  <button
                    key={preset.amount}
                    onClick={() => update('investmentAmount', preset.amount)}
                    className="p-4 rounded-xl text-center transition-all duration-150"
                    style={{
                      background: form.investmentAmount === preset.amount ? 'var(--accent-dim)' : 'var(--bg-surface)',
                      border: form.investmentAmount === preset.amount
                        ? '2px solid var(--accent-bright)'
                        : '2px solid var(--border)',
                    }}
                  >
                    <p className="text-base font-bold" style={{
                      color: form.investmentAmount === preset.amount ? 'var(--accent-bright)' : 'var(--text-primary)'
                    }}>
                      {preset.label}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {preset.desc}
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Or enter a custom amount
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>₹</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={form.investmentAmount || ''}
                    onChange={(e) => update('investmentAmount', Number(e.target.value))}
                    className="input-field pl-8 w-full"
                  />
                </div>
              </div>
              {form.investmentAmount > 0 && (
                <div className="p-3 rounded-lg" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    💡 With ₹{form.investmentAmount.toLocaleString('en-IN')} of your own money, 
                    your total project cost could be around ₹{(form.investmentAmount / 0.10).toLocaleString('en-IN')} 
                    (using government scheme financing for the rest).
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Step 4: New or Existing */}
          {step === 3 && (
            <Card className="p-6 space-y-5">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'var(--accent-dim)' }}>
                  <Store size={28} style={{ color: 'var(--accent-bright)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Do you already have a business?
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  This helps us give you better advice
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => update('existingLoans', 0)}
                  className="p-6 rounded-xl text-center transition-all duration-150"
                  style={{
                    background: form.existingLoans === 0 ? 'var(--accent-dim)' : 'var(--bg-surface)',
                    border: form.existingLoans === 0
                      ? '2px solid var(--accent-bright)'
                      : '2px solid var(--border)',
                  }}
                >
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: 'var(--bg-card)' }}>
                    <Star size={24} style={{ color: form.existingLoans === 0 ? 'var(--accent-bright)' : 'var(--text-muted)' }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>New Business</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>I'm just getting started</p>
                </button>
                <button
                  onClick={() => update('existingLoans', 1)}
                  className="p-6 rounded-xl text-center transition-all duration-150"
                  style={{
                    background: form.existingLoans > 0 ? 'var(--accent-dim)' : 'var(--bg-surface)',
                    border: form.existingLoans > 0
                      ? '2px solid var(--accent-bright)'
                      : '2px solid var(--border)',
                  }}
                >
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: 'var(--bg-card)' }}>
                    <Building2 size={24} style={{ color: form.existingLoans > 0 ? 'var(--accent-bright)' : 'var(--text-muted)' }} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Existing Business</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>I already run a business</p>
                </button>
              </div>
            </Card>
          )}

          {/* Step 5: Review & Create */}
          {step === 4 && (
            <Card className="p-6 space-y-5">
              <div className="text-center mb-4">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'var(--accent-dim)' }}>
                  <CheckCircle2 size={28} style={{ color: 'var(--accent-bright)' }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Let's analyze your area
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Here's what we know about your business
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg flex items-center justify-between" style={{ background: 'var(--bg-surface)' }}>
                  <div>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>LOCATION</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{form.location || 'Not set'}</p>
                  </div>
                  <button onClick={() => setStep(0)} className="text-xs" style={{ color: 'var(--accent-bright)' }}>Edit</button>
                </div>
                <div className="p-3 rounded-lg flex items-center justify-between" style={{ background: 'var(--bg-surface)' }}>
                  <div>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>BUSINESS TYPE</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{form.businessType || 'Not set'}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs" style={{ color: 'var(--accent-bright)' }}>Edit</button>
                </div>
                <div className="p-3 rounded-lg flex items-center justify-between" style={{ background: 'var(--bg-surface)' }}>
                  <div>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>YOUR INVESTMENT</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--accent-bright)' }}>
                      {form.investmentAmount > 0 ? `₹${form.investmentAmount.toLocaleString('en-IN')}` : 'Not set'}
                    </p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs" style={{ color: 'var(--accent-bright)' }}>Edit</button>
                </div>
                <div className="p-3 rounded-lg flex items-center justify-between" style={{ background: 'var(--bg-surface)' }}>
                  <div>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>BUSINESS STATUS</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {form.existingLoans === 0 ? 'New Business' : 'Existing Business'}
                    </p>
                  </div>
                  <button onClick={() => setStep(3)} className="text-xs" style={{ color: 'var(--accent-bright)' }}>Edit</button>
                </div>
              </div>

              {form.locationData && (
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>DETECTED COORDINATES</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Lat: {form.locationData.lat?.toFixed(4)}, Lng: {form.locationData.lng?.toFixed(4)}
                  </p>
                  {form.locationData.source && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Source: {form.locationData.source}
                    </p>
                  )}
                </div>
              )}
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => step === 0 ? setView('list') : setStep(s => s - 1)}
        >
          <ArrowLeft size={16} />
          {step === 0 ? 'Back' : 'Previous'}
        </Button>
        <div className="flex gap-3">
          {step < totalSteps - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
              Continue
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <CheckCircle2 size={16} />
              {isEdit ? 'Save Changes' : 'Start Analysis'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
