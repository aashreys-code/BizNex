import axios from 'axios'
import { governmentSchemes, findMatchingSchemes, scoreScheme } from './schemes-data'
import { findDistrictData, findStateData } from './census-data'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const hasApiKeys = Boolean(GROQ_API_KEY || GEMINI_API_KEY)

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface MarketAnalysisRequest {
  businessIdea: string
  location: string
  investmentAmount: number
}

interface BusinessPlanRequest {
  businessType: string
  budget: number
  location: string
}

// Groq API call (primary - ultra fast)
async function callGroq(messages: ChatMessage[]) {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured')
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

// Gemini API call (fallback)
async function callGemini(prompt: string) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    }
  )
  return response.data.candidates[0].content.parts[0].text
}

// Smart API selector - tries Groq first (fast), falls back to Gemini
async function callAI(messages: ChatMessage[] | string) {
  if (!hasApiKeys) {
    throw new Error('No API keys configured')
  }
  try {
    if (typeof messages === 'string') {
      // For string prompts, wrap in messages for Groq
      return await callGroq([{ role: 'user', content: messages }])
    }
    return await callGroq(messages)
  } catch {
    // Fallback to Gemini
    if (typeof messages === 'string') {
      return await callGemini(messages)
    }
    return await callGemini(messages.map(m => m.content).join('\n'))
  }
}

export async function analyzeMarket(data: MarketAnalysisRequest) {
  const prompt = `You are a senior data analyst and business advisor specializing in rural Indian markets. Analyze the following business opportunity with data-driven insights:

Business Idea: ${data.businessIdea}
Location: ${data.location}
Investment Amount: ₹${data.investmentAmount.toLocaleString('en-IN')}

Provide a comprehensive market analysis in JSON format:
{
  "marketDemandScore": <1-10>,
  "competitionLevel": "<Low|Medium|High>",
  "estimatedMonthlyIncome": <number in INR>,
  "growthPotential": "<Low|Medium|High>",
  "riskLevel": "<Low|Medium|High>",
  "requiredResources": ["list", "of", "resources"],
  "targetCustomers": "<description>",
  "demandChart": [{"month": "Jan", "demand": <number>}, ...],
  "revenueForecast": [{"month": "Jan", "revenue": <number>}, ...],
  "swotAnalysis": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "opportunities": ["..."],
    "threats": ["..."]
  },
  "recommendations": ["..."]
}
Return ONLY the JSON, no markdown.`

  try {
    const result = await callAI(prompt)
    return JSON.parse(result)
  } catch {
    return {
      marketDemandScore: 7,
      competitionLevel: 'Medium',
      estimatedMonthlyIncome: 25000,
      growthPotential: 'High',
      riskLevel: 'Medium',
      requiredResources: ['Shop space', 'Initial inventory', 'Marketing budget', 'Supplier connections', 'Local delivery vehicle'],
      targetCustomers: 'Local residents, nearby villages, and small businesses in the area',
      demandChart: [
        { month: 'Jan', demand: 60 }, { month: 'Feb', demand: 65 },
        { month: 'Mar', demand: 70 }, { month: 'Apr', demand: 75 },
        { month: 'May', demand: 80 }, { month: 'Jun', demand: 85 },
      ],
      revenueForecast: [
        { month: 'Jan', revenue: 15000 }, { month: 'Feb', revenue: 18000 },
        { month: 'Mar', revenue: 22000 }, { month: 'Apr', revenue: 25000 },
        { month: 'May', revenue: 30000 }, { month: 'Jun', revenue: 35000 },
      ],
      swotAnalysis: {
        strengths: ['Low investment required', 'Growing local demand', 'Strong community network'],
        weaknesses: ['Limited brand awareness initially', 'Seasonal demand fluctuations'],
        opportunities: ['Government subsidies available', 'Growing digital adoption', 'Untapped nearby villages'],
        threats: ['Competition from established players', 'Rising material costs'],
      },
      recommendations: [
        'Start small and scale gradually based on demand',
        'Leverage government schemes like MUDRA for initial funding',
        'Build a strong local presence through word-of-mouth',
        'Consider online ordering for wider reach',
      ],
    }
  }
}

export async function generateBusinessPlan(data: BusinessPlanRequest) {
  const prompt = `You are a business strategist and data analyst. Create a detailed, data-driven business plan for a rural Indian entrepreneur:

Business Type: ${data.businessType}
Budget: ₹${data.budget.toLocaleString('en-IN')}
Location: ${data.location}

Generate a comprehensive business plan with:
1. Executive Summary
2. Market Analysis (with data points)
3. Target Customer Segment
4. Revenue Model
5. Cost Breakdown (itemized with percentages)
6. Marketing Strategy
7. Growth Plan (6 months, 1 year, 3 years with projections)
8. Risk Assessment (with mitigation strategies)
9. Key Metrics to Track (KPIs)

Format the response as structured sections with clear headings. Be specific to rural Indian context. Include numerical projections where possible.`

  try {
    return await callAI(prompt)
  } catch {
    return `# Business Plan: ${data.businessType}\n\n## 1. Executive Summary\nThis ${data.businessType} venture in ${data.location} aims to serve the growing local demand with an initial investment of ₹${data.budget.toLocaleString('en-IN')}. The business targets local residents and nearby villages, leveraging community networks and digital presence for growth.\n\n## 2. Market Analysis\nThe local market shows strong demand for ${data.businessType} services. With limited competition in the immediate area, there is a significant opportunity to capture market share. The area's growing population and increasing disposable income support a positive outlook.\n\n## 3. Target Customer Segment\n- Primary: Local residents aged 18-55\n- Secondary: Small businesses and self-help groups\n- Tertiary: Nearby village communities\n\n## 4. Revenue Model\n- Direct sales of products/services\n- Subscription-based repeat customers\n- Seasonal promotions and festival offers\n- Bulk orders for local businesses\n\n## 5. Cost Breakdown\n| Item | Cost (₹) |\n|------|----------|\n| Shop/Space Setup | ${(data.budget * 0.25).toLocaleString('en-IN')} |\n| Initial Inventory | ${(data.budget * 0.30).toLocaleString('en-IN')} |\n| Equipment | ${(data.budget * 0.15).toLocaleString('en-IN')} |\n| Marketing | ${(data.budget * 0.10).toLocaleString('en-IN')} |\n| Working Capital | ${(data.budget * 0.15).toLocaleString('en-IN')} |\n| Contingency | ${(data.budget * 0.05).toLocaleString('en-IN')} |\n\n## 6. Marketing Strategy\n- Word-of-mouth through local influencers and SHG networks\n- Social media presence on WhatsApp and Facebook\n- Participate in local haats and melas\n- Partner with nearby shops for cross-promotion\n\n## 7. Growth Plan\n**6 Months:** Establish brand, build customer base of 200+ regular customers\n**1 Year:** Expand product range, hire 1-2 employees, achieve break-even\n**3 Years:** Open second location, build online presence, ₹5L+ annual profit\n\n## 8. Risk Assessment\n- **Low Risk:** Strong local demand, low competition\n- **Medium Risk:** Seasonal fluctuations, supply chain disruptions\n- **Mitigation:** Diversify products, maintain 3-month cash reserve\n\n## 9. Key Metrics to Track\n- Monthly revenue and profit margins\n- Customer retention rate\n- Inventory turnover\n- Customer satisfaction scores\n- Digital engagement metrics`
  }
}

export async function findSchemes(userProfile: {
  age: number
  gender: string
  businessType: string
  income: number
  investmentNeeded: number
  category: string
}) {
  // Use real structured scheme data instead of LLM guessing
  const matched = findMatchingSchemes(userProfile)
  const scored = matched
    .map(s => ({
      ...s,
      eligibilityScore: scoreScheme(s, userProfile),
    }))
    .sort((a, b) => b.eligibilityScore - a.eligibilityScore)
    .slice(0, 8) // top 8 matches

  return {
    schemes: scored.map(s => ({
      name: s.name,
      eligibilityScore: s.eligibilityScore,
      benefits: s.description,
      maxLoanAmount: s.maxLoanAmount,
      interestRate: s.interestRate,
      requiredDocuments: s.requiredDocuments,
      applicationProcess: s.applicationProcess,
      applicationLink: s.applicationLink,
    }))
  }
}

export async function calculateLoan(data: {
  monthlyIncome: number
  existingLoans: number
  businessType: string
  investmentRequirement: number
}) {
  const prompt = `You are a financial analyst specializing in rural Indian lending. Calculate loan eligibility for:

Monthly Income: ₹${data.monthlyIncome.toLocaleString('en-IN')}
Existing Loans: ₹${data.existingLoans.toLocaleString('en-IN')}
Business Type: ${data.businessType}
Investment Required: ₹${data.investmentRequirement.toLocaleString('en-IN')}

Provide in JSON:
{
  "eligibilityScore": <1-100>,
  "eligibleLoanAmount": <number>,
  "estimatedEMI": <number>,
  "repaymentTenure": "X years",
  "recommendedBanks": [{"name": "...", "interestRate": "...", "processingFee": "..."}],
  "monthlyRepaymentSchedule": [{"month": 1, "emi": <number>, "principal": <number>, "interest": <number>, "balance": <number>}]
}
Return ONLY the JSON.`

  try {
    const result = await callAI(prompt)
    return JSON.parse(result)
  } catch {
    const loanAmount = Math.min(data.investmentRequirement, data.monthlyIncome * 24)
    const interestRate = 0.09 / 12
    const tenure = 36
    const emi = (loanAmount * interestRate * Math.pow(1 + interestRate, tenure)) / (Math.pow(1 + interestRate, tenure) - 1)
    return {
      eligibilityScore: 72,
      eligibleLoanAmount: loanAmount,
      estimatedEMI: Math.round(emi),
      repaymentTenure: '3 years',
      recommendedBanks: [
        { name: 'SBI', interestRate: '8.5% p.a.', processingFee: '1%' },
        { name: 'PNB', interestRate: '9% p.a.', processingFee: '0.5%' },
        { name: 'HDFC Bank', interestRate: '9.5% p.a.', processingFee: '1.5%' },
        { name: 'Bank of Baroda', interestRate: '8.75% p.a.', processingFee: '0.75%' },
      ],
      monthlyRepaymentSchedule: (() => {
        let balance = loanAmount
        return Array.from({ length: 12 }, (_, i) => {
          const interestPart = Math.round(balance * interestRate)
          const principalPart = Math.round(emi) - interestPart
          balance = Math.max(0, balance - principalPart)
          return {
            month: i + 1,
            emi: Math.round(emi),
            principal: principalPart,
            interest: interestPart,
            balance: Math.round(balance),
          }
        })
      })(),
    }
  }
}

interface BusinessProfileContext {
  name: string
  businessType: string
  businessDescription: string
  location: string
  investmentAmount: number
  monthlyIncome: number
  existingLoans: number
  workingCapital: number
  equipmentCost: number
  age: number
  gender: string
  category: string
}

export async function chatWithAI(
  messages: ChatMessage[],
  language = 'English',
  businessProfile?: BusinessProfileContext | null,
  userName?: string
): Promise<string> {
  let profileContext = ''
  if (businessProfile) {
    profileContext = `

## ACTIVE BUSINESS PROFILE
The user currently has the following business profile selected:
- Profile Name: ${businessProfile.name}
- Business Type: ${businessProfile.businessType}
- Description: ${businessProfile.businessDescription || 'N/A'}
- Location: ${businessProfile.location}
- Investment: ₹${businessProfile.investmentAmount.toLocaleString('en-IN')}
- Monthly Income: ₹${businessProfile.monthlyIncome.toLocaleString('en-IN')}
- Existing Loans: ₹${businessProfile.existingLoans.toLocaleString('en-IN')}
- Working Capital: ₹${businessProfile.workingCapital.toLocaleString('en-IN')}
- Equipment Cost: ₹${businessProfile.equipmentCost.toLocaleString('en-IN')}
- Owner Age: ${businessProfile.age}, Gender: ${businessProfile.gender}, Category: ${businessProfile.category}

Use this profile data to personalize all advice. When the user asks general questions, relate the answer back to their specific business. Reference their investment amount, income, location, and business type in your responses.`
  }

  const userNameBlock = userName ? `\nThe user's name is ${userName}. Address them by name occasionally.` : ''

  const systemPrompt = `You are BizNex AI, a senior data analyst and business advisor specializing in Indian entrepreneurship.

Your expertise includes:
- Data-driven business analysis and feasibility studies
- Government scheme optimization and eligibility matching
- Financial modeling, loan structuring, and ROI analysis
- Market research, competitor analysis, and demand forecasting
- Risk assessment with quantitative scoring
- Revenue projections and cash flow planning

Communication style:
- Respond in ${language}
- Use data points, numbers, and percentages when possible
- Be encouraging but realistic — base advice on data, not just optimism
- Keep responses concise but actionable
- When analyzing, always mention key metrics (demand score, risk level, ROI)
- Use simple language that entrepreneurs can understand
- Always reference the user's active business profile when giving advice
${userNameBlock}${profileContext}

You are here to help users make informed business decisions backed by data.`

  const fullMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages,
  ]

  try {
    return await callAI(fullMessages)
  } catch {
    // Smart mock responses based on the user's last message
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || ''
    
    if (lastMsg.includes('mudra') || lastMsg.includes('loan')) {
      return `🏦 **MUDRA Loan Analysis**\n\n📊 **Quick Stats:**\n• Approval Rate: ~85% for Shishu category\n• Average Processing Time: 7-10 days\n• Interest Rate: 8-12% p.a.\n\n**Categories:**\n• **Shishu** – Up to ₹50,000 (Best for beginners, highest approval)\n• **Kishore** – ₹50,000 to ₹5 lakh (Requires basic business plan)\n• **Tarun** – ₹5 lakh to ₹10 lakh (Needs detailed project report)\n\n**Eligibility:** Any Indian citizen aged 18+ with a business plan\n**Documents:** Aadhaar, PAN, Business Plan, Address Proof\n\n💡 *Data Insight: Shishu category has 90%+ approval rate. Start there if you're new!*`
    }
    
    if (lastMsg.includes('scheme') || lastMsg.includes('government')) {
      return `🏛️ **Government Schemes — Eligibility Analysis**\n\n📊 **Your Best Matches (by eligibility score):**\n\n1. **MUDRA Loan** — Score: 85/100\n   • Collateral-free up to ₹10 lakh\n   • Fastest approval (7-10 days)\n\n2. **PM SVANidhi** — Score: 75/100\n   • ₹50,000 for street vendors\n   • 7% interest subsidy\n\n3. **PMEGP** — Score: 80/100\n   • 25-35% government subsidy\n   • Requires 2-3 week training\n\n4. **Stand-Up India** — Score: 70/100\n   • ₹10 lakh to ₹1 crore\n   • For SC/ST/Women entrepreneurs\n\n💡 *Use the Scheme Finder tool to get a personalized eligibility report based on your profile!*`
    }
    
    if (lastMsg.includes('business') || lastMsg.includes('idea') || lastMsg.includes('start')) {
      return `💡 **Business Opportunity Analysis for Rural India**\n\n📊 **Top Opportunities by ROI Potential:**\n\n🏪 **Retail (Grocery/General Store)**\n• Investment: ₹1-3 lakh | Monthly Revenue: ₹25-50K\n• Risk: Low | Demand Score: 8/10\n\n🌾 **Dairy Farming**\n• Investment: ₹2-5 lakh | Monthly Revenue: ₹30-60K\n• Risk: Medium | Demand Score: 9/10\n\n🔧 **Mobile Repair Shop**\n• Investment: ₹50K-1 lakh | Monthly Revenue: ₹15-30K\n• Risk: Low | Demand Score: 7/10\n\n📦 **Fertilizer/Seed Shop**\n• Investment: ₹3-5 lakh | Monthly Revenue: ₹40-80K\n• Risk: Medium | Demand Score: 8/10\n\n💡 *Use the Business Plan feature to get a detailed financial model for any of these!*`
    }
    
    if (lastMsg.includes('hello') || lastMsg.includes('hi') || lastMsg.includes('namaste')) {
      return `Namaste! 🙏 Welcome to BizNex AI\n\nI'm your **data analyst & business advisor**. I can help you with:\n\n📊 **Data Analysis**\n• Market demand scoring & forecasting\n• Competitor analysis & gap identification\n• Revenue projections & break-even analysis\n\n💡 **Business Advisory**\n• Personalized business recommendations\n• Risk assessment with quantitative scores\n• Growth strategy planning\n\n🏛️ **Government Schemes**\n• Eligibility matching & scoring\n• Loan optimization advice\n• Application guidance\n\nWhat would you like to analyze today?`
    }
    
    return `Thank you for your question! As your data analyst, here's what I can help with:\n\n📊 **Market Analysis** — Demand scoring, competitor mapping, revenue forecasting\n💡 **Business Planning** — Financial models, cost breakdowns, growth projections\n🏛️ **Scheme Matching** — Eligibility scoring, loan optimization\n💰 **Financial Advisory** — EMI calculations, ROI analysis, cash flow planning\n\n💡 *Tip: For detailed analysis, use the dedicated feature pages in the sidebar. For quick questions, just ask me here!*\n\nWhat specific analysis do you need?`
  }
}

export async function getInsights(location: string) {
  // First, check our real census data for this location
  const district = findDistrictData(location)
  const state = findStateData(location)
  
  if (district) {
    // Return real data from our census database
    return {
      population: district.population,
      literacyRate: district.literacyRate,
      majorIndustries: district.majorIndustries,
      demandTrends: district.topBusinessOpportunities.slice(0, 5).map(opp => ({
        category: opp.split(' ').slice(0, 3).join(' '),
        trend: 'growing' as const,
      })),
      topBusinessOpportunities: district.topBusinessOpportunities,
      agriculturalProfile: district.agriculturalProfile,
      employmentStats: district.employmentStats,
      nearbyMarkets: district.nearbyMarkets,
      infrastructureScore: district.infrastructureScore,
      digitalAdoption: district.digitalAdoption,
    }
  }
  
  if (state) {
    // Return state-level data
    return {
      population: state.population,
      literacyRate: state.literacyRate,
      majorIndustries: state.majorSectors,
      demandTrends: state.majorSectors.slice(0, 5).map(s => ({
        category: s,
        trend: 'growing' as const,
      })),
      topBusinessOpportunities: state.majorSectors.map(s => `${s}-related opportunities in ${state.capitalCity} region`),
      agriculturalProfile: `${state.state} economy is driven by ${state.majorSectors.join(', ')}. GDP per capita: ${state.gdpPerCapita}.`,
      employmentStats: { employed: '35%', selfEmployed: '22%', unemployed: '12%' },
      nearbyMarkets: ['Weekly Haat', 'District Market', 'APMC Market'],
      infrastructureScore: 6,
      digitalAdoption: 'Medium' as const,
    }
  }
  
  // Fallback: use AI with location name for unknown locations
  const prompt = `You are a hyper-local market research analyst. Provide data-driven business insights for ${location}, India.

Include:
{
  "population": "estimated number",
  "literacyRate": "percentage",
  "majorIndustries": ["industry1", "industry2"],
  "demandTrends": [{"category": "...", "trend": "growing|stable|declining"}],
  "topBusinessOpportunities": ["..."],
  "agriculturalProfile": "description",
  "employmentStats": {"employed": "X%", "selfEmployed": "X%", "unemployed": "X%"},
  "nearbyMarkets": ["market1", "market2"],
  "infrastructureScore": <1-10>,
  "digitalAdoption": "Low|Medium|High"
}
Return ONLY the JSON.`

  try {
    const result = await callAI(prompt)
    return JSON.parse(result)
  } catch {
    return {
      population: '2,50,000',
      literacyRate: '68%',
      majorIndustries: ['Agriculture', 'Textiles', 'Small Manufacturing', 'Retail', 'Services'],
      demandTrends: [
        { category: 'Agricultural Products', trend: 'growing' },
        { category: 'Digital Services', trend: 'growing' },
        { category: 'Traditional Retail', trend: 'stable' },
        { category: 'Healthcare', trend: 'growing' },
        { category: 'Education', trend: 'stable' },
      ],
      topBusinessOpportunities: [
        'Organic farming supply chain',
        'Digital payment services',
        'Cold storage facility',
        'Skill training center',
        'Healthcare clinic',
        'E-commerce delivery service',
      ],
      agriculturalProfile: 'Primarily rice, wheat, and vegetable farming with seasonal variations. Good irrigation coverage with growing interest in organic and high-value crops.',
      employmentStats: { employed: '35%', selfEmployed: '25%', unemployed: '15%' },
      nearbyMarkets: ['Weekly Haat', 'District Market', 'APMC Market', 'Industrial Area Market'],
      infrastructureScore: 6,
      digitalAdoption: 'Medium',
    }
  }
}

export async function findNearbyBusinesses(data: {
  businessType: string
  location: string
  radius: number
}) {
  const prompt = `You are a competitive intelligence analyst. Find similar nearby businesses near ${data.location}, India within ~${data.radius} km radius for comparison with a ${data.businessType}.

Provide realistic competitor data in JSON:
{
  "userBusiness": {
    "name": "Your ${data.businessType}",
    "lat": <latitude>,
    "lng": <longitude>,
    "popularity": <1-100>,
    "demand": <1-100>,
    "monthlyRevenue": <number>,
    "rating": <1-5>,
    "progressScore": <1-100>
  },
  "competitors": [
    {
      "name": "Business Name",
      "type": "subtype",
      "lat": <latitude>,
      "lng": <longitude>,
      "distance": <km>,
      "popularity": <1-100>,
      "demand": <1-100>,
      "monthlyRevenue": <number>,
      "rating": <1-5>,
      "progressScore": <1-100>,
      "established": <year>,
      "strengths": ["..."],
      "weaknesses": ["..."],
      "specialties": ["..."]
    }
  ],
  "marketSummary": {
    "totalCompetitors": <number>,
    "averageDemand": <1-100>,
    "averagePopularity": <1-100>,
    "marketSaturation": "Low|Medium|High",
    "bestOpportunity": "description",
    "threatLevel": "Low|Medium|High"
  },
  "demandTrend": [{"month": "Jan", "demand": <number>}, ...],
  "popularityComparison": [{"name": "...", "score": <number>}],
  "recommendations": ["..."]
}
Use realistic coordinates near ${data.location}. Return ONLY the JSON.`

  try {
    const result = await callAI(prompt)
    return JSON.parse(result)
  } catch {
    // Fallback with realistic mock data centered around Anantapur
    const baseLat = 14.68
    const baseLng = 77.59
    return {
      userBusiness: {
        name: `Your ${data.businessType}`,
        lat: baseLat,
        lng: baseLng,
        popularity: 45,
        demand: 62,
        monthlyRevenue: 35000,
        rating: 3.8,
        progressScore: 55,
      },
      competitors: [
        {
          name: 'Ravi General Store',
          type: 'Retail',
          lat: baseLat + 0.012,
          lng: baseLng + 0.008,
          distance: 1.8,
          popularity: 72,
          demand: 68,
          monthlyRevenue: 55000,
          rating: 4.2,
          progressScore: 70,
          established: 2018,
          strengths: ['Prime location', 'Loyal customer base'],
          weaknesses: ['Limited product range'],
          specialties: ['Daily essentials', 'Mobile recharge'],
        },
        {
          name: 'Lakshmi Traders',
          type: 'Wholesale',
          lat: baseLat - 0.015,
          lng: baseLng + 0.022,
          distance: 3.2,
          popularity: 65,
          demand: 72,
          monthlyRevenue: 82000,
          rating: 4.0,
          progressScore: 68,
          established: 2015,
          strengths: ['Bulk pricing', 'Wide distribution'],
          weaknesses: ['Higher minimum orders'],
          specialties: ['Agricultural supplies', 'Fertilizers'],
        },
        {
          name: 'Sri Venkateswara Mart',
          type: 'Retail',
          lat: baseLat + 0.008,
          lng: baseLng - 0.018,
          distance: 2.5,
          popularity: 58,
          demand: 55,
          monthlyRevenue: 42000,
          rating: 3.5,
          progressScore: 52,
          established: 2020,
          strengths: ['Competitive prices', 'Home delivery'],
          weaknesses: ['New brand, low trust'],
          specialties: ['Groceries', 'Household items'],
        },
        {
          name: 'Kiran Electronics',
          type: 'Specialty',
          lat: baseLat - 0.006,
          lng: baseLng - 0.012,
          distance: 1.5,
          popularity: 80,
          demand: 75,
          monthlyRevenue: 95000,
          rating: 4.5,
          progressScore: 82,
          established: 2012,
          strengths: ['Brand partnerships', 'Service center'],
          weaknesses: ['Premium pricing'],
          specialties: ['Electronics', 'Appliance repair'],
        },
        {
          name: 'Priya Fashion Hub',
          type: 'Fashion',
          lat: baseLat + 0.02,
          lng: baseLng - 0.005,
          distance: 2.8,
          popularity: 70,
          demand: 65,
          monthlyRevenue: 68000,
          rating: 4.1,
          progressScore: 72,
          established: 2019,
          strengths: ['Trendy collection', 'Online presence'],
          weaknesses: ['Seasonal demand'],
          specialties: ['Ethnic wear', 'Accessories'],
        },
      ],
      marketSummary: {
        totalCompetitors: 5,
        averageDemand: 67,
        averagePopularity: 69,
        marketSaturation: 'Medium',
        bestOpportunity: 'Underserved niche in premium grocery delivery and organic products',
        threatLevel: 'Medium',
      },
      demandTrend: [
        { month: 'Jan', demand: 55 }, { month: 'Feb', demand: 58 },
        { month: 'Mar', demand: 62 }, { month: 'Apr', demand: 60 },
        { month: 'May', demand: 65 }, { month: 'Jun', demand: 68 },
        { month: 'Jul', demand: 72 }, { month: 'Aug', demand: 70 },
        { month: 'Sep', demand: 74 }, { month: 'Oct', demand: 78 },
        { month: 'Nov', demand: 82 }, { month: 'Dec', demand: 85 },
      ],
      popularityComparison: [
        { name: 'Kiran Electronics', score: 80 },
        { name: 'Ravi General Store', score: 72 },
        { name: 'Priya Fashion Hub', score: 70 },
        { name: 'Lakshmi Traders', score: 65 },
        { name: 'Sri Venkateswara', score: 58 },
        { name: 'Your Business', score: 45 },
      ],
      recommendations: [
        'Focus on unique product categories competitors lack',
        'Build online presence and delivery capability',
        'Leverage government schemes for expansion funding',
        'Partner with local suppliers for better margins',
      ],
    }
  }
}

export async function getFundingAdvice(data: {
  businessType: string
  totalCost: number
  workingCapital: number
  equipmentCost: number
}) {
  const prompt = `You are a financial structuring expert. Provide optimal funding structure advice for:

Business: ${data.businessType}
Total Cost: ₹${data.totalCost.toLocaleString('en-IN')}
Working Capital: ₹${data.workingCapital.toLocaleString('en-IN')}
Equipment Cost: ₹${data.equipmentCost.toLocaleString('en-IN')}

Recommend a funding structure with:
{
  "selfFunding": {"percentage": <number>, "amount": <number>},
  "governmentLoans": [{"scheme": "...", "amount": <number>, "subsidy": "..."}],
  "bankLoans": [{"bank": "...", "amount": <number>, "interestRate": "..."}],
  "subsidies": [{"name": "...", "amount": <number>, "eligibility": "..."}],
  "totalFundingPlan": {"ownContribution": <number>, "loanAmount": <number>, "subsidyAmount": <number>},
  "monthlyCashFlow": [{"month": "M1", "inflow": <number>, "outflow": <number>}]
}
Return ONLY the JSON.`

  try {
    const result = await callAI(prompt)
    return JSON.parse(result)
  } catch {
    return {
      selfFunding: { percentage: 30, amount: data.totalCost * 0.3 },
      governmentLoans: [
        { scheme: 'PMEGP', amount: data.totalCost * 0.4, subsidy: '25% government subsidy' },
        { scheme: 'MUDRA Loan', amount: data.totalCost * 0.2, subsidy: 'Collateral-free, subsidized rate' },
      ],
      bankLoans: [
        { bank: 'SBI', amount: data.totalCost * 0.15, interestRate: '8.5% p.a.' },
        { bank: 'PNB', amount: data.totalCost * 0.1, interestRate: '9% p.a.' },
      ],
      subsidies: [
        { name: 'PMEGP Subsidy', amount: data.totalCost * 0.25, eligibility: 'All categories eligible' },
        { name: 'State MSME Subsidy', amount: data.totalCost * 0.1, eligibility: 'Manufacturing units eligible' },
      ],
      totalFundingPlan: {
        ownContribution: data.totalCost * 0.3,
        loanAmount: data.totalCost * 0.55,
        subsidyAmount: data.totalCost * 0.15,
      },
      monthlyCashFlow: Array.from({ length: 6 }, (_, i) => ({
        month: `M${i + 1}`,
        inflow: 20000 + i * 5000,
        outflow: 15000 + i * 2000,
      })),
    }
  }
}
