import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || ''
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

async function callGroq(messages: ChatMessage[]) {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured on server')
  }
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'qwen/qwen3.8-27b',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data.choices[0].message.content
}

async function callGemini(prompt: string) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured on server')
  }
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    }
  )
  return response.data.candidates[0].content.parts[0].text
}

async function callAI(messages: ChatMessage[] | string) {
  try {
    if (typeof messages === 'string') {
      return await callGroq([{ role: 'user', content: messages }])
    }
    return await callGroq(messages)
  } catch {
    if (typeof messages === 'string') {
      return await callGemini(messages)
    }
    return await callGemini(messages.map((m) => m.content).join('\n'))
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type, payload } = req.body

    if (!type) {
      return res.status(400).json({ error: 'Missing type parameter' })
    }

    let result: any

    switch (type) {
      case 'chat': {
        const { messages, systemPrompt } = payload
        const fullMessages: ChatMessage[] = [
          { role: 'system', content: systemPrompt },
          ...messages,
        ]
        result = await callAI(fullMessages)
        break
      }

      case 'analyze-market': {
        const { prompt } = payload
        const raw = await callAI(prompt)
        result = JSON.parse(raw)
        break
      }

      case 'generate-plan': {
        const { prompt } = payload
        result = await callAI(prompt)
        break
      }

      case 'calculate-loan': {
        const { prompt } = payload
        const raw = await callAI(prompt)
        result = JSON.parse(raw)
        break
      }

      case 'get-insights': {
        const { prompt } = payload
        const raw = await callAI(prompt)
        result = JSON.parse(raw)
        break
      }

      case 'get-funding': {
        const { prompt } = payload
        const raw = await callAI(prompt)
        result = JSON.parse(raw)
        break
      }

      default:
        return res.status(400).json({ error: `Unknown type: ${type}` })
    }

    return res.status(200).json({ result })
  } catch (error: any) {
    console.error('AI API Error:', error.message)
    return res.status(500).json({
      error: 'AI request failed',
      message: error.message,
    })
  }
}
