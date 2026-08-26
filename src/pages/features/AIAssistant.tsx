import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { MessageSquare, Send, Mic, Volume2, Globe, Loader2 } from 'lucide-react'
import { chatWithAI } from '../../lib/ai'
import { useAuth } from '../../contexts/AuthContext'
import { useBusiness } from '../../contexts/BusinessContext'
import { ScrollReveal, GlowCard } from '../../components/react-bits'
import Card from '../../components/ui/Card'

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
      content: `Namaste! 🙏 I'm your BizPulse assistant. I can help you with:\n\n• Business ideas and feasibility\n• Government scheme information\n• Loan guidance and eligibility\n• Market insights for your area\n\nHow can I help you today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState(business?.preferredLanguage || profile?.language || 'English')
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
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <MessageSquare size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
              <p className="text-gray-400 text-sm">Multilingual business advisor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500/50"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-charcoal-900">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-sm px-3 py-1.5 rounded-full glass hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-primary-500/20 border border-primary-500/20'
                  : 'glass'
              }`}
            >
              <p className="text-sm text-gray-200 whitespace-pre-wrap">{msg.content}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === 'assistant' && (
                  <button className="text-gray-500 hover:text-primary-400 transition-colors">
                    <Volume2 size={12} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="text-primary-400 animate-spin" />
                <span className="text-sm text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass rounded-2xl p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type your message in ${language}...`}
            className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none max-h-32 text-sm"
            rows={1}
          />
          <button className="p-2 text-gray-400 hover:text-primary-400 transition-colors">
            <Mic size={20} />
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2 bg-primary-500 rounded-xl text-white hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
