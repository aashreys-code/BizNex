import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { MessageSquare, Send, Mic, Volume2, Globe, Loader2, UserCheck, AlertTriangle, X } from 'lucide-react'
import { chatWithAI } from '../../lib/ai'
import { useAuth } from '../../contexts/AuthContext'
import { useBusiness } from '../../contexts/BusinessContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const languages = [
  { code: 'English', label: 'English' },
  { code: 'Hindi', label: 'हिन्दी' },
  { code: 'Telugu', label: 'తెలుగు' },
  { code: 'Tamil', label: 'தமிழ்' },
  { code: 'Kannada', label: 'ಕನ್ನಡ' },
  { code: 'Marathi', label: 'मराठी' },
]

const quickPrompts = [
  'What business can I start with ₹1 lakh?',
  'Tell me about MUDRA loan eligibility',
  'How to apply for PMEGP scheme?',
  'Best dairy farming practices in rural areas',
]

export default function AIAssistant() {
  const { profile } = useAuth()
  const { business } = useBusiness()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Namaste! I'm your BizNex assistant. I can help you with:\n\n• Business ideas and feasibility\n• Government scheme information\n• Loan guidance and eligibility\n• Market insights for your area\n\nHow can I help you today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState(business?.preferredLanguage || profile?.language || 'English')
  const [showAdvisorModal, setShowAdvisorModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(text?: string) {
    const message = text || input.trim()
    if (!message || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      const response = await chatWithAI(chatHistory, language)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>AI Assistant</h1>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Multilingual business advisor</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field text-xs py-1.5 px-2.5 max-w-[120px]"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs px-2.5 py-1.5 rounded-lg transition-colors"
              style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-bright)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[80%] rounded-lg p-3"
              style={{
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              }}
            >
              <p className="text-sm whitespace-pre-wrap" style={{ color: msg.role === 'user' ? 'white' : 'var(--text-primary)' }}>{msg.content}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px]" style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === 'assistant' && (
                  <button style={{ color: 'var(--text-muted)' }} className="hover:opacity-80 transition-opacity">
                    <Volume2 size={11} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="card p-3">
              <div className="flex items-center gap-1.5">
                <Loader2 size={14} className="animate-spin" style={{ color: 'var(--accent-bright)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="card p-2.5">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type your message in ${language}...`}
            className="flex-1 bg-transparent resize-none focus:outline-none max-h-24 text-sm"
            style={{ color: 'var(--text-primary)' }}
            rows={1}
          />
          <button style={{ color: 'var(--text-muted)' }} className="p-1.5 hover:opacity-80 transition-opacity">
            <Mic size={18} />
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2 rounded-lg text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--accent)' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Human Advisor Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAdvisorModal(true)}
          className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-bright))',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          }}
        >
          <UserCheck size={15} />
          <span>Talk to Human Advisor</span>
        </button>
      </div>

      {/* Human Advisor Warning Modal */}
      {showAdvisorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-sm w-full p-6 space-y-4"
            style={{ background: 'var(--bg-card)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full" style={{ background: 'rgba(251, 191, 36, 0.15)' }}>
                  <AlertTriangle size={18} style={{ color: '#fbbf24' }} />
                </div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Human Advisor</h3>
              </div>
              <button
                onClick={() => setShowAdvisorModal(false)}
                className="p-1 rounded-lg transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                You are about to request a <strong style={{ color: 'var(--text-primary)' }}>human business advisor</strong> for personalized guidance.
              </p>
              <div className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary, var(--bg-page))', border: '1px solid var(--border)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  ⏱️ <strong style={{ color: 'var(--text-secondary)' }}>Please note:</strong> Human advisor connections may take some time, especially during peak hours. An advisor will review your business profile and get back to you as soon as possible.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAdvisorModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{ background: 'var(--bg-page)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAdvisorModal(false)
                  const advisorMsg: Message = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `🧑‍💼 **Human Advisor Request Submitted**\n\nYour request has been forwarded to our team of business advisors. A certified advisor will review your profile and connect with you shortly.\n\nIn the meantime, feel free to continue using this AI assistant for any quick questions.\n\nThank you for your patience!`,
                    timestamp: new Date(),
                  }
                  setMessages((prev) => [...prev, advisorMsg])
                }}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                Request Advisor
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
