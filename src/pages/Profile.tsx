import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  User, Mail, Phone, MapPin, Globe, Building2,
  ArrowLeft, Calendar, Shield, Briefcase,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useBusiness } from '../contexts/BusinessContext'
import { ScrollReveal, GlowCard } from '../components/react-bits'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Profile() {
  const { profile } = useAuth()
  const { profiles, activeId } = useBusiness()

  const userName = profile?.name || 'User'
  const userInitial = userName[0]?.toUpperCase() || 'U'

  const infoItems = [
    { icon: User, label: 'Full Name', value: profile?.name || '—' },
    { icon: Mail, label: 'Email', value: profile?.email || '—' },
    { icon: Phone, label: 'Mobile', value: profile?.mobile || '—' },
    { icon: MapPin, label: 'Village', value: profile?.village || '—' },
    { icon: MapPin, label: 'District', value: profile?.district || '—' },
    { icon: MapPin, label: 'State', value: profile?.state || '—' },
    { icon: Globe, label: 'Language', value: profile?.language || 'English' },
    { icon: Shield, label: 'Role', value: profile?.role || 'user' },
    { icon: Calendar, label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>
          <Link to="/dashboard">
            <Button variant="secondary" size="sm">
              <ArrowLeft size={14} />
              Dashboard
            </Button>
          </Link>
        </div>
      </ScrollReveal>

      {/* Profile Card */}
      <ScrollReveal delay={0.05}>
        <Card className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-moss-400/20 border-2 border-moss-400/30 flex items-center justify-center">
                <span className="text-4xl font-bold text-moss-400 font-display">{userInitial}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-charcoal-900 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
              <p className="text-gray-400 text-sm mb-3">{profile?.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {profile?.district && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                    📍 {profile.district}, {profile.state}
                  </span>
                )}
                {profile?.role && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-moss-400/10 text-moss-400 border border-moss-400/20">
                    {profile.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                  </span>
                )}
                {profiles.length > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Briefcase size={10} className="inline mr-1" />
                    {profiles.length} Business{profiles.length !== 1 ? 'es' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </ScrollReveal>

      {/* Personal Information */}
      <ScrollReveal delay={0.1}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User size={18} className="text-moss-400" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {infoItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm text-white font-medium truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Business Profiles */}
      <ScrollReveal delay={0.15}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 size={18} className="text-moss-400" />
              My Businesses
            </h3>
            <Link to="/business-profile">
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </Link>
          </div>
          {profiles.length === 0 ? (
            <div className="text-center py-8">
              <Building2 size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-3">No business profiles yet</p>
              <Link to="/business-profile">
                <Button size="sm">Create One</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    activeId === p.id
                      ? 'bg-moss-400/5 border border-moss-400/20'
                      : 'glass'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    activeId === p.id
                      ? 'bg-moss-400/20 text-moss-400'
                      : 'bg-white/5 text-gray-400'
                  }`}>
                    <Building2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      {activeId === p.id && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-moss-400/20 text-moss-400">Active</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {p.businessType} · {p.location} · ₹{p.investmentAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </ScrollReveal>
    </div>
  )
}
