import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Mail, Lock, User, Phone, MapPin, Globe, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { BlurText, ParticlesBg } from '../../components/react-bits'
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
        toast.error(error.message || 'Registration failed')
      } else {
        toast.success('Account created! Please check your email for verification.')
        navigate('/dashboard')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative pt-16 pb-12 px-4 bg-charcoal-950">
      <ParticlesBg particleCount={30} color="#21F1A8" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-strong rounded-3xl p-8">
          <div className="text-center mb-8">
            <BlurText
              text="Join BizNex"
              className="text-3xl font-bold font-display text-white mb-2"
            />
            <p className="text-gray-400">Create your free account and start your business journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              icon={<User size={18} />}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                icon={<Mail size={18} />}
                required
              />
              <Input
                label="Mobile Number"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.mobile}
                onChange={(e) => updateField('mobile', e.target.value)}
                icon={<Phone size={18} />}
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                icon={<Lock size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Village"
                placeholder="Your village"
                value={formData.village}
                onChange={(e) => updateField('village', e.target.value)}
                icon={<MapPin size={18} />}
              />
              <Input
                label="District"
                placeholder="Your district"
                value={formData.district}
                onChange={(e) => updateField('district', e.target.value)}
                icon={<MapPin size={18} />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="State"
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                options={states}
              />
              <Select
                label="Preferred Language"
                value={formData.language}
                onChange={(e) => updateField('language', e.target.value)}
                options={languages}
              />
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
