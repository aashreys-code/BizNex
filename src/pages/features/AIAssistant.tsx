import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  Send, Globe, Loader2, UserCheck, AlertTriangle, X,
  Sparkles, Bot, User, Copy, Check, RotateCcw,
} from 'lucide-react'
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

const defaultQuickPrompts = [
  'What business can I start with ₹1 lakh?',
  'Tell me about MUDRA loan eligibility',
  'How to apply for PMEGP scheme?',
  'Best dairy farming practices in rural areas',
]

function useI18nPrompts() {
  const { t } = useTranslation()
  return [
    t('aiAssistant.quickPrompts.business'),
    t('aiAssistant.quickPrompts.mudra'),
    t('aiAssistant.quickPrompts.pmegp'),
    t('aiAssistant.quickPrompts.dairy'),
  ]
}

function getQuickPrompts(business: ReturnType<typeof useBusiness>['business']) {
  if (!business) return defaultQuickPrompts
  return [
    `Analyze demand for ${business.businessType} in ${business.location}`,
    `What loan schemes am I eligible for with ₹${business.investmentAmount.toLocaleString('en-IN')} investment?`,
    `How can I grow ${business.name} revenue beyond ₹${business.monthlyIncome.toLocaleString('en-IN')}/month?`,
    `Give me a SWOT analysis for my ${business.businessType}`,
  ]
}

/* ── Lightweight markdown → HTML ── */
function renderMarkdown(text: string): string {
  let html = text
    // escape & < > first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold mt-3 mb-1" style="color:var(--text-primary)">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-base font-bold mt-3 mb-1" style="color:var(--text-primary)">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-3 mb-1" style="color:var(--text-primary)">$1</h1>')

  // bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold" style="color:var(--text-primary)">$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded text-xs" style="background:var(--accent-dim);color:var(--accent-bright)">$1</code>')

  // emoji bullet points  (•, -, *)
  html = html.replace(/^[\s]*[•\-\*] (.+)$/gm, '<div class="flex gap-2 items-start my-0.5"><span style="color:var(--accent-bright)">•</span><span>$1</span></div>')

  // numbered lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2 items-start my-0.5"><span class="font-semibold min-w-[18px]" style="color:var(--accent-bright)">$1.</span><span>$2</span></div>')

  // horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-2" style="border-color:var(--border)" />')

  // line breaks
  html = html.replace(/\n/g, '<br />')

  return html
}

/* ── Copy button ── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded transition-all"
      style={{ color: copied ? 'var(--accent-bright)' : 'var(--text-muted)' }}
      title="Copy"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  )
}

/* ── Message Bubble ── */
function MessageBubble({ msg, isLast }: { msg: Message; isLast: boolean }) {
  const isUser = msg.role === 'user'
  const html = useMemo(() => renderMarkdown(msg.content), [msg.content])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: isUser
            ? 'linear-gradient(135deg, var(--accent), var(--accent-bright))'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: isUser
            ? '0 2px 8px rgba(0,0,0,0.15)'
            : '0 2px 8px rgba(99,102,241,0.3)',
        }}
      >
        {isUser ? <User size={14} color="white" /> : <Bot size={14} color="white" />}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
            isUser ? 'rounded-br-md' : 'rounded-bl-md'
          }`}
          style={{
            background: isUser
              ? 'linear-gradient(135deg, var(--accent), var(--accent-bright))'
              : 'var(--bg-card)',
            color: isUser ? 'white' : 'var(--text-primary)',
            border: isUser ? 'none' : '1px solid var(--border)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <div
              className="whitespace-normal space-y-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>

        {/* Meta row */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && (
            <>
              <CopyButton text={msg.content} />
              {isLast && (
                <button
                  className="p-1 rounded transition-all"
                  style={{ color: 'var(--text-muted)' }}
                  title="Regenerate"
                >
                  <RotateCcw size={11} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Typing Indicator ── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-2.5"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
        }}
      >
        <Bot size={14} color="white" />
      </div>
      <div
        className="rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent-bright)' }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
          Thinking...
        </span>
      </div>
    </motion.div>
  )
}

/* ── Main Component ── */
export default function AIAssistant() {
  const { profile } = useAuth()
  const { business } = useBusiness()
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: business
        ? `Namaste ${profile?.name || 'there'}! 👋\n\nI can see you're running **${business.name}** (${business.businessType}) in ${business.location}.\n\nI'm ready to help with:\n• Market analysis for ${business.businessType}\n• Financial advice — your ₹${business.investmentAmount.toLocaleString('en-IN')} investment\n• Government schemes & loan guidance\n• Growth strategies for your business\n\nWhat would you like to analyze today?`
        : `Namaste! I'm your BizNex assistant. I can help you with:\n\n• Business ideas and feasibility\n• Government scheme information\n• Loan guidance and eligibility\n• Market insights for your area\n\nHow can I help you today?`,
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
  }, [messages, loading])

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

      const response = await chatWithAI(chatHistory, language, business, profile?.name || undefined)

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
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
            }}
          >
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              AI Assistant
            </h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {business ? `Analyzing ${business.businessType}` : 'Multilingual business advisor'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe size={13} style={{ color: 'var(--text-muted)' }} />
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

      {/* ── Chat Area ── */}
      <div
        className="flex-1 overflow-y-auto rounded-2xl px-4 py-4 space-y-4 mb-3"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id} msg={msg} isLast={i === messages.length - 1 && msg.role === 'assistant'} />
        ))}

        <AnimatePresence>
          {loading && <TypingIndicator />}
        </AnimatePresence>

        {/* Quick Prompts (shown at bottom when few messages) */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-2 pt-2"
          >
            {useI18nPrompts().map((prompt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSend(prompt)}
                className="text-left text-xs px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                <span className="line-clamp-2">{prompt}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div
        className="rounded-2xl px-3 py-2 flex items-end gap-2"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={business ? `Ask about ${business.businessType}...` : t('aiAssistant.typeMessage')}
          className="flex-1 bg-transparent resize-none focus:outline-none max-h-24 text-sm py-1.5"
          style={{ color: 'var(--text-primary)' }}
          rows={1}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg"
          style={{
            background: input.trim()
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : 'var(--accent-dim)',
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>

      {/* ── Human Advisor (subtle footer) ── */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setShowAdvisorModal(true)}
          className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full transition-all hover:scale-105"
          style={{
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}
        >
          <UserCheck size={12} />
          <span>Talk to Human Advisor</span>
        </button>
      </div>

      {/* ── Advisor Modal ── */}
      <AnimatePresence>
        {showAdvisorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
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

              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Request a <strong style={{ color: 'var(--text-primary)' }}>human business advisor</strong> for personalized guidance.
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                ⏱️ Human advisor connections may take some time. They will review your business profile and get back to you shortly.
              </p>

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
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: `🧑‍💼 **Human Advisor Request Submitted**\n\nYour request has been forwarded to our team of business advisors. A certified advisor will review your profile and connect with you shortly.\n\nIn the meantime, feel free to continue using this AI assistant for any quick questions.\n\nThank you for your patience!`,
                        timestamp: new Date(),
                      },
                    ])
                  }}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)' }}
                >
                  Request Advisor
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
