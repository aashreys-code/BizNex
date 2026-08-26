import { useState } from 'react'
import { motion } from 'motion/react'
import { Upload, FileCheck, FileX, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { ScrollReveal, GlowCard } from '../../components/react-bits'
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

      // Simulate AI verification
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === newDoc.id
              ? { ...doc, status: 'verifying' as const }
              : doc
          )
        )
      }, 500)

      setTimeout(() => {
        const hasIssue = Math.random() > 0.7
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === newDoc.id
              ? {
                  ...doc,
                  status: hasIssue ? 'issue' as const : 'verified' as const,
                  issues: hasIssue ? ['Document quality could be improved', 'Please ensure all text is clearly visible'] : undefined,
                }
              : doc
          )
        )
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
    <div className="space-y-8 max-w-5xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Upload size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Document Verification</h1>
            <p className="text-gray-400 text-sm">Upload and verify your documents with AI</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Status Summary */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-3 gap-4">
          <GlowCard className="text-center p-4">
            <p className="text-2xl font-bold text-primary-400">{verifiedCount}</p>
            <p className="text-xs text-gray-400">Verified</p>
          </GlowCard>
          <GlowCard className="text-center p-4">
            <p className="text-2xl font-bold text-yellow-400">{documents.length - verifiedCount - issueCount}</p>
            <p className="text-xs text-gray-400">Processing</p>
          </GlowCard>
          <GlowCard className="text-center p-4">
            <p className="text-2xl font-bold text-red-400">{issueCount}</p>
            <p className="text-xs text-gray-400">Issues Found</p>
          </GlowCard>
        </div>
      </ScrollReveal>

      {/* Required Documents Check */}
      <ScrollReveal delay={0.15}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Required Documents</h2>
          <div className="space-y-2">
            {requiredDocs.map((doc) => {
              const isUploaded = uploadedTypes.includes(doc.type)
              return (
                <div key={doc.type} className="flex items-center gap-3 p-3 rounded-xl glass">
                  {isUploaded ? (
                    <CheckCircle2 size={18} className="text-primary-400" />
                  ) : (
                    <AlertCircle size={18} className="text-yellow-400" />
                  )}
                  <span className={`text-sm ${isUploaded ? 'text-gray-300' : 'text-yellow-300'}`}>
                    {doc.label}
                  </span>
                  {!isUploaded && (
                    <span className="text-xs text-yellow-400 ml-auto">Required</span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </ScrollReveal>

      {/* Upload Areas */}
      <ScrollReveal delay={0.2}>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upload Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentTypes.map((doc) => (
              <label
                key={doc.type}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-xl hover:border-primary-500/30 hover:bg-white/5 transition-all cursor-pointer"
              >
                <Upload size={24} className="text-gray-500 mb-2" />
                <span className="text-sm text-gray-400 text-center">
                  {doc.label}
                  {doc.required && <span className="text-red-400 ml-1">*</span>}
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleUpload(e, doc.type)}
                />
              </label>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <ScrollReveal>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Uploaded Documents</h2>
            <div className="space-y-3">
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 glass rounded-xl"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    doc.status === 'verified'
                      ? 'bg-green-500/20'
                      : doc.status === 'issue'
                      ? 'bg-red-500/20'
                      : doc.status === 'verifying'
                      ? 'bg-yellow-500/20'
                      : 'bg-white/5'
                  }`}>
                    {doc.status === 'verified' ? (
                      <FileCheck size={20} className="text-green-400" />
                    ) : doc.status === 'issue' ? (
                      <FileX size={20} className="text-red-400" />
                    ) : doc.status === 'verifying' ? (
                      <Loader2 size={20} className="text-yellow-400 animate-spin" />
                    ) : (
                      <FileText size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-400">
                      {doc.type.replace('-', ' ')} • {doc.size} •{' '}
                      <span className={
                        doc.status === 'verified' ? 'text-green-400' :
                        doc.status === 'issue' ? 'text-red-400' :
                        doc.status === 'verifying' ? 'text-yellow-400' :
                        'text-gray-400'
                      }>
                        {doc.status === 'verifying' ? 'Verifying...' : doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </p>
                    {doc.issues && (
                      <ul className="mt-1">
                        {doc.issues.map((issue, i) => (
                          <li key={i} className="text-xs text-red-400">• {issue}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="text-gray-500 hover:text-red-400 text-sm"
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
