import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  User, Mail, Phone, MapPin, Globe, Building2,
  ArrowLeft, Calendar, Shield, Briefcase, Pencil, Save, X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness } from '../contexts/BusinessContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'

const states = [
  { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
  { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil-nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'west-bengal', label: 'West Bengal' },
]

const languages = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'marathi', label: 'Marathi' },
]

export default function Profile() {
  const { profile, updateProfile } = useAuth()
  const { profiles, activeId } = useBusiness()
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    mobile: profile?.mobile || '',
    village: profile?.village || '',
    district: profile?.district || '',
    state: profile?.state || '',
    language: profile?.language || '',
  })

  const userName = profile?.name || 'User'
  const userInitial = userName[0]?.toUpperCase() || 'U'

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { error } = await updateProfile(formData)
      if (error) {
        toast.error(error)
      } else {
        toast.success('Profile updated successfully!')
        setEditing(false)
      }
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      mobile: profile?.mobile || '',
      village: profile?.village || '',
      district: profile?.district || '',
      state: profile?.state || '',
      language: profile?.language || '',
    })
    setEditing(false)
  }

  const infoItems = [
    { icon: User, label: 'Full Name', value: profile?.name || '\u2014' },
    { icon: Mail, label: 'Email', value: profile?.email || '\u2014' },
    { icon: Phone, label: 'Mobile', value: profile?.mobile || '\u2014' },
    { icon: MapPin, label: 'Village', value: profile?.village || '\u2014' },
    { icon: MapPin, label: 'District', value: profile?.district || '\u2014' },
    { icon: MapPin, label: 'State', value: profile?.state || '\u2014' },
    { icon: Globe, label: 'Language', value: profile?.language || 'English' },
    { icon: Shield, label: 'Role', value: profile?.role || 'user' },
    { icon: Calendar, label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '\u2014' },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-lg "
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('profile.title')}</h1>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button variant="secondary" size="sm" onClick={handleCancel}>
                  <X size={14} />
                  {t('common.cancel')}
                </Button>
                <Button size="sm" onClick={handleSave} loading={saving}>
                  <Save size={14} />
                  {t('profile.saveChanges')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  <Pencil size={14} />
                  {t('profile.editProfile')}
                </Button>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft size={14} />
                    {t('nav.dashboard')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div>
        <Card className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent-dim)', border: '2px solid var(--accent-bright)' }}>
                <span className="text-3xl font-bold" style={{ color: 'var(--accent-bright)' }}>{userInitial}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-charcoal-900 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{userName}</h2>
              <p className="text-sm mb-2.5" style={{ color: 'var(--text-secondary)' }}>{profile?.email}</p>
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {profile?.district && (
                  <span className="badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {profile.district}, {profile.state}
                  </span>
                )}
                {profile?.role && (
                  <span className="badge badge-accent">
                    {profile.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                )}
                {profiles.length > 0 && (
                  <span className="badge badge-info">
                    <Briefcase size={10} className="inline mr-1" />
                    {profiles.length} Business{profiles.length !== 1 ? 'es' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Personal Information */}
      <div>
        <Card className="p-6">            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <User size={16} style={{ color: 'var(--accent-bright)' }} />
            {t('profile.personalInfo')}
          </h3>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('profile.fullName')}
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  icon={<User size={18} />}
                />
                <Input
                  label={t('profile.email')}
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  icon={<Mail size={18} />}
                />
                <Input
                  label={t('profile.mobile')}
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => updateField('mobile', e.target.value)}
                  icon={<Phone size={18} />}
                />
                <Input
                  label={t('profile.village')}
                  value={formData.village}
                  onChange={(e) => updateField('village', e.target.value)}
                  icon={<MapPin size={18} />}
                />
                <Input
                  label={t('profile.district')}
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  icon={<MapPin size={18} />}
                />
                <Select
                  label={t('profile.state')}
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  options={states}
                />
                <Select
                  label={t('auth.preferredLanguage')}
                  value={formData.language}
                  onChange={(e) => updateField('language', e.target.value)}
                  options={languages}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {infoItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: 'var(--accent-dim)' }}>
                    <item.icon size={14} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Business Profiles */}
      <div>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Building2 size={16} style={{ color: 'var(--accent-bright)' }} />
              {t('profile.myBusinesses')}
            </h3>
            <Link to="/business-profile">
              <Button variant="ghost" size="sm">
                {t('dashboard.manage')}
              </Button>
            </Link>
          </div>
          {profiles.length === 0 ? (
            <div className="text-center py-8">
              <Building2 size={28} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-2" />
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{t('profile.noBusinesses')}</p>
              <Link to="/business-profile">
                <Button size="sm">{t('profile.createOne')}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all"
                  style={{
                    background: activeId === p.id ? 'var(--accent-dim)' : 'var(--bg-surface)',
                    border: activeId === p.id ? '1px solid var(--accent-bright)' : '1px solid var(--border)',
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: activeId === p.id ? 'var(--accent-dim)' : 'var(--bg-card)' }}>
                    <Building2 size={16} style={{ color: activeId === p.id ? 'var(--accent-bright)' : 'var(--text-muted)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                      {activeId === p.id && (
                        <span className="badge badge-success">Active</span>
                      )}
                    </div>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                      {p.businessType} · {p.location} · ₹{p.investmentAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
