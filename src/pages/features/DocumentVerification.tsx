import { AlertCircle, Clock } from 'lucide-react'
import Card from '../../components/ui/Card'

const documentTypes = [
  { type: 'aadhaar', label: 'Aadhaar Card', required: true },
  { type: 'pan', label: 'PAN Card', required: true },
  { type: 'business-registration', label: 'Business Registration', required: false },
  { type: 'address-proof', label: 'Address Proof', required: false },
  { type: 'income-certificate', label: 'Income Certificate', required: false },
]

export default function DocumentVerification() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Document Verification</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Upload and verify your documents with AI</p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
          <Clock size={32} style={{ color: 'var(--accent-bright)' }} />
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Coming Soon</h2>
        <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          AI-powered document verification using OCR and intelligent analysis is currently under development. 
          This feature will verify Aadhaar, PAN, business registration, and income certificates.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'var(--accent-dim)', color: 'var(--accent-bright)' }}>
          <AlertCircle size={12} />
          The upload feature shown previously was a preview — not real verification
        </div>
      </Card>

      {/* Required Documents Info */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Required Documents</h2>
        <div className="space-y-1.5">
          {documentTypes.map((doc) => (
            <div key={doc.type} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
              <AlertCircle size={16} style={{ color: doc.required ? 'var(--warning)' : 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {doc.label}
                {doc.required && <span className="ml-1 font-medium" style={{ color: 'var(--warning)' }}>Required</span>}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
