import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

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
  { value: 'hindi', label: 'हिन्दी (Hindi)' },
  { value: 'telugu', label: 'తెలుగు (Telugu)' },
  { value: 'tamil', label: 'தமிழ் (Tamil)' },
  { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'marathi', label: 'मराठी (Marathi)' },
]

export default function RegisterPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    village: '',
    district: '',
    state: '',
    language: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        mobile: formData.mobile,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        language: formData.language,
      })

      if (error) {
        toast.error(error.message || t('common.error'))
      } else {
        toast.success('Account created! Please check your email for verification.')
        navigate('/dashboard')
      }
    } catch {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-14 pb-12 px-4" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {t('auth.joinBizNex')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('auth.signUpDesc')}</p>
        </div>

        <div className="surface-elevated p-6">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label={t('auth.name')}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              icon={<User size={16} />}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('auth.email')}
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                icon={<Mail size={16} />}
                required
              />
              <Input
                label={t('auth.mobileNumber')}
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.mobile}
                onChange={(e) => updateField('mobile', e.target.value)}
                icon={<Phone size={16} />}
                required
              />
            </div>

            <div className="relative">
              <Input
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                icon={<Lock size={16} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('auth.village')}
                placeholder="Your village"
                value={formData.village}
                onChange={(e) => updateField('village', e.target.value)}
                icon={<MapPin size={16} />}
              />
              <Input
                label={t('auth.district')}
                placeholder="Your district"
                value={formData.district}
                onChange={(e) => updateField('district', e.target.value)}
                icon={<MapPin size={16} />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label={t('auth.state')}
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

            <Button type="submit" className="w-full" loading={loading}>
              {t('auth.createAccount')}
            </Button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-semibold" style={{ color: 'var(--accent-bright)' }}>
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
