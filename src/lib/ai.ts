import axios from 'axios'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

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

// OpenAI API call
async function callOpenAI(messages: ChatMessage[], model = 'gpt-4') {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data.choices[0].message.content
}

// Gemini API call
async function callGemini(prompt: string) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    }
  )
  return response.data.candidates[0].content.parts[0].text
}

// Smart API selector - tries OpenAI first, falls back to Gemini
async function callAI(messages: ChatMessage[] | string) {
  try {
    if (typeof messages === 'string') {
      return await callGemini(messages)
    }
    return await callOpenAI(messages)
  } catch {
    if (typeof messages === 'string') {
      return await callOpenAI([{ role: 'user', content: messages }])
    }
    return await callGemini(messages.map(m => m.content).join('\n'))
  }
}

export async function analyzeMarket(data: MarketAnalysisRequest) {
  const prompt = `You are a business analyst expert for rural India. Analyze the following business opportunity:

Business Idea: ${data.businessIdea}
Location: ${data.location}
Investment Amount: ₹${data.investmentAmount.toLocaleString('en-IN')}

Provide a comprehensive market analysis in JSON format with:
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

  const result = await callAI(prompt)
  try {
    return JSON.parse(result)
  } catch {
    return {
      marketDemandScore: 7,
      competitionLevel: 'Medium',
      estimatedMonthlyIncome: 25000,
      growthPotential: 'High',
      riskLevel: 'Medium',
      requiredResources: ['Shop space', 'Initial inventory', 'Marketing budget'],
      targetCustomers: 'Local residents and nearby villages',
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
        strengths: ['Low investment required', 'Growing local demand'],
        weaknesses: ['Limited brand awareness initially'],
        opportunities: ['Government subsidies available', 'Growing digital adoption'],
        threats: ['Competition from established players'],
      },
      recommendations: ['Start small and scale gradually', 'Leverage government schemes'],
    }
  }
}

export async function generateBusinessPlan(data: BusinessPlanRequest) {
  const prompt = `Create a detailed business plan for a rural Indian entrepreneur:

Business Type: ${data.businessType}
Budget: ₹${data.budget.toLocaleString('en-IN')}
Location: ${data.location}

Generate a comprehensive business plan with:
1. Executive Summary
2. Market Analysis
3. Target Customer Segment
4. Revenue Model
5. Cost Breakdown (itemized)
6. Marketing Strategy
7. Growth Plan (6 months, 1 year, 3 years)
8. Risk Assessment
9. Key Metrics to Track

Format the response as structured sections with clear headings. Be specific to rural Indian context.`

  return await callAI(prompt)
}

export async function findSchemes(userProfile: {
  age: number
  gender: string
  businessType: string
  income: number
  investmentNeeded: number
  category: string
}) {
  const prompt = `Based on the following profile, recommend the best government schemes for an Indian entrepreneur:

Age: ${userProfile.age}
Gender: ${userProfile.gender}
Business Type: ${userProfile.businessType}
Annual Income: ₹${userProfile.income.toLocaleString('en-IN')}
Investment Needed: ₹${userProfile.investmentNeeded.toLocaleString('en-IN')}
Category: ${userProfile.category}

Recommend from these schemes: PMEGP, MUDRA Loan, Stand-Up India, PM SVANidhi, NRLM, CGTMSE, and any other relevant schemes.

For each scheme, provide:
{
  "schemes": [
    {
      "name": "Scheme Name",
      "eligibilityScore": <1-100>,
      "benefits": "description",
      "maxLoanAmount": "₹ amount",
      "interestRate": "percentage",
      "requiredDocuments": ["doc1", "doc2"],
      "applicationProcess": "step by step",
      "applicationLink": "official URL if known"
    }
  ]
}
Return ONLY the JSON.`

  const result = await callAI(prompt)
  try {
    return JSON.parse(result)
  } catch {
    return {
      schemes: [
        {
          name: 'MUDRA Loan',
          eligibilityScore: 85,
          benefits: 'Collateral-free loan up to ₹10 lakh for small businesses',
          maxLoanAmount: '₹10,00,000',
          interestRate: '8-12% per annum',
          requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Address Proof'],
          applicationProcess: 'Apply through participating banks or online via Udyamimitra portal',
          applicationLink: 'https://www.udyamimitra.in',
        },
        {
          name: 'PMEGP',
          eligibilityScore: 80,
          benefits: 'Government subsidy of 25-35% on project cost',
          maxLoanAmount: '₹25,00,000',
          interestRate: '4-8% per annum (subsidized)',
          requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Project Report', 'Caste Certificate (if applicable)'],
          applicationProcess: 'Apply online through KVIC portal or District Industries Center',
          applicationLink: 'https://www.kvic.org.in',
        },
      ],
    }
  }
}

export async function calculateLoan(data: {
  monthlyIncome: number
  existingLoans: number
  businessType: string
  investmentRequirement: number
}) {
  const prompt = `Calculate loan eligibility for:

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

  const result = await callAI(prompt)
  try {
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
      ],
      monthlyRepaymentSchedule: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        emi: Math.round(emi),
        principal: Math.round(emi * 0.7),
        interest: Math.round(emi * 0.3),
        balance: Math.round(loanAmount - (emi * 0.7 * (i + 1))),
      })),
    }
  }
}

export async function chatWithAI(
  messages: ChatMessage[],
  language = 'English'
): Promise<string> {
  const systemPrompt = `You are BizPulse, a friendly and knowledgeable business advisor for rural Indian entrepreneurs. 
You help with business ideas, government schemes, loan guidance, and market insights.
Respond in ${language}. Be helpful, encouraging, and provide practical advice.
Keep responses concise but informative. Use simple language.`

  const fullMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages,
  ]

  return await callAI(fullMessages)
}

export async function getInsights(location: string) {
  const prompt = `Provide hyper-local business insights for ${location}, India.

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

  const result = await callAI(prompt)
  try {
    return JSON.parse(result)
  } catch {
    return {
      population: '2,50,000',
      literacyRate: '68%',
      majorIndustries: ['Agriculture', 'Textiles', 'Small Manufacturing'],
      demandTrends: [
        { category: 'Agricultural Products', trend: 'growing' },
        { category: 'Digital Services', trend: 'growing' },
        { category: 'Traditional Retail', trend: 'stable' },
      ],
      topBusinessOpportunities: [
        'Organic farming supply chain',
        'Digital payment services',
        'Cold storage facility',
        'Skill training center',
      ],
      agriculturalProfile: 'Primarily rice, wheat, and vegetable farming with seasonal variations',
      employmentStats: { employed: '35%', selfEmployed: '25%', unemployed: '15%' },
      nearbyMarkets: ['Weekly Haat', 'District Market', 'APMC Market'],
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
  const prompt = `Find similar nearby businesses near ${data.location}, India within ~${data.radius} km radius for comparison with a ${data.businessType}.

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

  const result = await callAI(prompt)
  try {
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
  const prompt = `Provide funding structure advice for:

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

  const result = await callAI(prompt)
  try {
    return JSON.parse(result)
  } catch {
    return {
      selfFunding: { percentage: 30, amount: data.totalCost * 0.3 },
      governmentLoans: [
        { scheme: 'PMEGP', amount: data.totalCost * 0.4, subsidy: '25% government subsidy' },
      ],
      bankLoans: [
        { bank: 'SBI', amount: data.totalCost * 0.2, interestRate: '8.5% p.a.' },
      ],
      subsidies: [
        { name: 'PMEGP Subsidy', amount: data.totalCost * 0.25, eligibility: 'All categories eligible' },
      ],
      totalFundingPlan: {
        ownContribution: data.totalCost * 0.3,
        loanAmount: data.totalCost * 0.6,
        subsidyAmount: data.totalCost * 0.1,
      },
      monthlyCashFlow: Array.from({ length: 6 }, (_, i) => ({
        month: `M${i + 1}`,
        inflow: 20000 + i * 5000,
        outflow: 15000 + i * 2000,
      })),
    }
  }
}
