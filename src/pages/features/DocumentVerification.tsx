import { useState } from 'react'
import { motion } from 'motion/react'
import { Upload, FileCheck, FileX, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { ScrollReveal } from '../../components/react-bits'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

interface UploadedDoc {
  id: string
  name: string
  type: string
  size: string
  status: 'uploaded' | 'verifying' | 'verified' | 'issue'
  issues?: string[]
}

const documentTypes = [
  { type: 'aadhaar', label: 'Aadhaar Card', required: true },
  { type: 'pan', label: 'PAN Card', required: true },
  { type: 'business-registration', label: 'Business Registration', required: false },
  { type: 'address-proof', label: 'Address Proof', required: false },
  { type: 'income-certificate', label: 'Income Certificate', required: false },
]

export default function DocumentVerification() {
  const [documents, setDocuments] = useState<UploadedDoc[]>([])

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>, docType: string) {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const newDoc: UploadedDoc = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: docType,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        status: 'uploaded',
      }
      setDocuments((prev) => [...prev, newDoc])

      setTimeout(() => {
        setDocuments((prev) => prev.map((doc) => doc.id === newDoc.id ? { ...doc, status: 'verifying' as const } : doc))
      }, 500)

      setTimeout(() => {
        const hasIssue = Math.random() > 0.7
        setDocuments((prev) => prev.map((doc) =>
          doc.id === newDoc.id
            ? { ...doc, status: hasIssue ? 'issue' as const : 'verified' as const, issues: hasIssue ? ['Document quality could be improved', 'Please ensure all text is clearly visible'] : undefined }
            : doc
        ))
      }, 2500)
    })
  }

  function removeDocument(id: string) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const verifiedCount = documents.filter((d) => d.status === 'verified').length
  const issueCount = documents.filter((d) => d.status === 'issue').length
  const requiredDocs = documentTypes.filter((d) => d.required)
  const uploadedTypes = documents.map((d) => d.type)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ScrollReveal>
        <div>
          <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Document Verification</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Upload and verify your documents with AI</p>
        </div>
      </ScrollReveal>

      {/* Status Summary */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Verified', value: verifiedCount, color: 'var(--success)' },
            { label: 'Processing', value: documents.length - verifiedCount - issueCount, color: 'var(--warning)' },
            { label: 'Issues Found', value: issueCount, color: 'var(--danger)' },
          ].map((stat, i) => (
            <div key={i} className="card p-3 text-center">
              <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Required Documents Check */}
      <ScrollReveal delay={0.15}>
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Required Documents</h2>
          <div className="space-y-1.5">
            {requiredDocs.map((doc) => {
              const isUploaded = uploadedTypes.includes(doc.type)
              return (
                <div key={doc.type} className="flex items-center gap-2.5 p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  {isUploaded ? (
                    <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                  ) : (
                    <AlertCircle size={16} style={{ color: 'var(--warning)' }} />
                  )}
                  <span className="text-xs" style={{ color: isUploaded ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                    {doc.label}
                  </span>
                  {!isUploaded && (
                    <span className="text-[10px] ml-auto font-medium" style={{ color: 'var(--warning)' }}>Required</span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </ScrollReveal>

      {/* Upload Areas */}
      <ScrollReveal delay={0.2}>
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Upload Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documentTypes.map((doc) => (
              <label
                key={doc.type}
                className="flex flex-col items-center justify-center p-5 rounded-lg cursor-pointer transition-colors"
                style={{ border: '2px dashed var(--border-strong)', background: 'var(--bg-surface)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-bright)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}
              >
                <Upload size={20} style={{ color: 'var(--text-muted)' }} className="mb-2" />
                <span className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                  {doc.label}
                  {doc.required && <span className="ml-1" style={{ color: 'var(--danger)' }}>*</span>}
                </span>
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleUpload(e, doc.type)} />
              </label>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <ScrollReveal>
          <Card className="p-4">
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Uploaded Documents</h2>
            <div className="space-y-2">
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                  <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      background: doc.status === 'verified' ? 'rgba(34,197,94,0.12)' : doc.status === 'issue' ? 'rgba(239,68,68,0.12)' : doc.status === 'verifying' ? 'rgba(234,179,8,0.12)' : 'var(--accent-dim)',
                    }}>
                    {doc.status === 'verified' ? <FileCheck size={16} style={{ color: 'var(--success)' }} /> :
                     doc.status === 'issue' ? <FileX size={16} style={{ color: 'var(--danger)' }} /> :
                     doc.status === 'verifying' ? <Loader2 size={16} className="animate-spin" style={{ color: 'var(--warning)' }} /> :
                     <FileText size={16} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{doc.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {doc.type.replace('-', ' ')} · {doc.size} ·{' '}
                      <span style={{
                        color: doc.status === 'verified' ? 'var(--success)' : doc.status === 'issue' ? 'var(--danger)' : doc.status === 'verifying' ? 'var(--warning)' : 'var(--text-muted)'
                      }}>
                        {doc.status === 'verifying' ? 'Verifying...' : doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </p>
                    {doc.issues && (
                      <ul className="mt-1">
                        {doc.issues.map((issue, i) => (
                          <li key={i} className="text-[10px]" style={{ color: 'var(--danger)' }}>• {issue}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button onClick={() => removeDocument(doc.id)} className="text-xs font-medium transition-colors shrink-0"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>
          </Card>
        </ScrollReveal>
      )}
    </div>
  )
}
