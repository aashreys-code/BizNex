import { Clock, Shield, AlertCircle } from 'lucide-react'
import Card from '../../components/ui/Card'

export default function AdminPanel() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-red-500 flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Panel</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage users, schemes, and analytics</p>
          </div>
        </div>
      </div>

      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
          <Clock size={32} style={{ color: 'var(--accent-bright)' }} />
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Coming Soon</h2>
        <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Full admin functionality with real-time user management, scheme management, and analytics dashboard
          is currently under development. The previous version showed demo data only.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'var(--accent-dim)', color: 'var(--accent-bright)' }}>
          <AlertCircle size={12} />
          Real admin features require a backend integration — currently not implemented
        </div>
      </Card>
    </div>
  )
}
