import axios from 'axios'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const hasApiKeys = Boolean(OPENAI_API_KEY || GEMINI_API_KEY)

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
  if (!hasApiKeys) {
    throw new Error('No API keys configured')
  }
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

  try {
    return await callAI(prompt)
  } catch {
    return `# Business Plan: ${data.businessType}

## 1. Executive Summary
This ${data.businessType} venture in ${data.location} aims to serve the growing local demand with an initial investment of ₹${data.budget.toLocaleString('en-IN')}. The business targets local residents and nearby villages, leveraging community networks and digital presence for growth.

## 2. Market Analysis
The local market shows strong demand for ${data.businessType} services. With limited competition in the immediate area, there is a significant opportunity to capture market share. The area's growing population and increasing disposable income support a positive outlook.

## 3. Target Customer Segment
- Primary: Local residents aged 18-55
- Secondary: Small businesses and self-help groups
- Tertiary: Nearby village communities

## 4. Revenue Model
- Direct sales of products/services
- Subscription-based repeat customers
- Seasonal promotions and festival offers
- Bulk orders for local businesses

## 5. Cost Breakdown
| Item | Cost (₹) |
|------|----------|
| Shop/Space Setup | ${(data.budget * 0.25).toLocaleString('en-IN')} |
| Initial Inventory | ${(data.budget * 0.30).toLocaleString('en-IN')} |
| Equipment | ${(data.budget * 0.15).toLocaleString('en-IN')} |
| Marketing | ${(data.budget * 0.10).toLocaleString('en-IN')} |
| Working Capital | ${(data.budget * 0.15).toLocaleString('en-IN')} |
| Contingency | ${(data.budget * 0.05).toLocaleString('en-IN')} |

## 6. Marketing Strategy
- Word-of-mouth through local influencers and SHG networks
- Social media presence on WhatsApp and Facebook
- Participate in local haats and melas
- Partner with nearby shops for cross-promotion

## 7. Growth Plan
**6 Months:** Establish brand, build customer base of 200+ regular customers
**1 Year:** Expand product range, hire 1-2 employees, achieve break-even
**3 Years:** Open second location, build online presence, ₹5L+ annual profit

## 8. Risk Assessment
- **Low Risk:** Strong local demand, low competition
- **Medium Risk:** Seasonal fluctuations, supply chain disruptions
- **Mitigation:** Diversify products, maintain 3-month cash reserve

## 9. Key Metrics to Track
- Monthly revenue and profit margins
- Customer retention rate
- Inventory turnover
- Customer satisfaction scores
- Digital engagement metrics`
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

  try {
    const result = await callAI(prompt)
    return JSON.parse(result)
  } catch {
    return {
      schemes: [
        {
          name: 'MUDRA Loan',
          eligibilityScore: 85,
          benefits: 'Collateral-free loan up to ₹10 lakh for small businesses. Three categories: Shishu (up to ₹50K), Kishore (₹50K-5L), Tarun (₹5L-10L).',
          maxLoanAmount: '₹10,00,000',
          interestRate: '8-12% per annum',
          requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Address Proof', 'Passport-size Photo'],
          applicationProcess: '1. Visit your nearest bank branch or NBFC\n2. Submit application with required documents\n3. Bank verifies and processes within 7-10 days\n4. Loan disbursement directly to your account',
          applicationLink: 'https://www.udyamimitra.in',
        },
        {
          name: 'PMEGP',
          eligibilityScore: 80,
          benefits: 'Government subsidy of 25-35% on project cost. For rural areas, subsidy is 25% for general and 35% for SC/ST/OBC categories.',
          maxLoanAmount: '₹25,00,000',
          interestRate: '4-8% per annum (subsidized)',
          requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Project Report', 'Caste Certificate (if applicable)', 'Education qualification proof'],
          applicationProcess: '1. Register on KVIC portal (kvic.org.in)\n2. Fill online application with project details\n3. Submit at District Industries Center\n4. Training period of 2-3 weeks\n5. Loan processing and disbursement',
          applicationLink: 'https://www.kvic.org.in',
        },
        {
          name: 'Stand-Up India',
          eligibilityScore: 70,
          benefits: 'Loans from ₹10 lakh to ₹1 crore for SC/ST and women entrepreneurs. Covers 75% of project cost.',
          maxLoanAmount: '₹1,00,00,000',
          interestRate: 'MCLR + 3% (approx 11-14%)',
          requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Caste Certificate / Women Entrepreneur Proof', 'Project Report', 'Education Documents'],
          applicationProcess: '1. Apply through standupmitra.in portal\n2. Select your lead bank\n3. Submit project report and documents\n4. Bank processes within 30-45 days',
          applicationLink: 'https://www.standupmitra.in',
        },
        {
          name: 'PM SVANidhi',
          eligibilityScore: 75,
          benefits: 'Working capital loan up to ₹50,000 for street vendors. 7% interest subsidy. First loan is collateral-free.',
          maxLoanAmount: '₹50,000',
          interestRate: '7% subsidized (effective ~2-3%)',
          requiredDocuments: ['Aadhaar Card', 'Vending Certificate / Identity Certificate', 'Bank Account Details'],
          applicationProcess: '1. Apply on pmvanidhi.mohua.gov.in\n2. Upload identity and vending proof\n3. Loan approved within 7 days\n4. Repay in monthly installments over 1 year',
          applicationLink: 'https://pmvanidhi.mohua.gov.in',
        },
        {
          name: 'CGTMSE',
          eligibilityScore: 65,
          benefits: 'Collateral-free loans up to ₹5 crore for MSMEs. Government guarantees 75% of the loan amount to the bank.',
          maxLoanAmount: '₹5,00,00,000',
          interestRate: '8-12% per annum',
          requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business Registration', 'GST Returns', 'Bank Statements (6 months)', 'Project Report'],
          applicationProcess: '1. Visit any CGTMSE-member bank\n2. Submit application with business documents\n3. Bank appraises and submits to CGTMSE\n4. Guarantee sanction within 30 days\n5. Loan disbursement',
          applicationLink: 'https://www.cgtmse.in',
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

export async function chatWithAI(
  messages: ChatMessage[],
  language = 'English'
): Promise<string> {
  const systemPrompt = `You are BizNex, a friendly and knowledgeable business advisor for rural Indian entrepreneurs. 
You help with business ideas, government schemes, loan guidance, and market insights.
Respond in ${language}. Be helpful, encouraging, and provide practical advice.
Keep responses concise but informative. Use simple language.`

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
      return `🏦 **MUDRA Loan** is perfect for small businesses! Here's what you need to know:

• **Shishu** – Up to ₹50,000 (for starting out)
• **Kishore** – ₹50,000 to ₹5 lakh (for growing businesses)  
• **Tarun** – ₹5 lakh to ₹10 lakh (for established businesses)

**Eligibility:** Any Indian citizen with a business plan
**Documents needed:** Aadhaar, PAN, Business Plan, Address Proof
**Where to apply:** Any bank branch or online at udyamimitra.in

💡 *Tip: Shishu category has the easiest approval process. Start there if you're new!*`
    }
    
    if (lastMsg.includes('scheme') || lastMsg.includes('government')) {
      return `🏛️ **Top Government Schemes for Entrepreneurs:**

1. **MUDRA Loan** – Collateral-free up to ₹10 lakh
2. **PMEGP** – 25-35% government subsidy on project cost
3. **Stand-Up India** – ₹10 lakh to ₹1 crore for SC/ST/Women
4. **PM SVANidhi** – ₹50,000 working capital for street vendors
5. **CGTMSE** – Collateral-free loans up to ₹5 crore

Visit the **Scheme Finder** feature in BizNex to check which ones you're eligible for based on your profile! 🎯`
    }
    
    if (lastMsg.includes('business') || lastMsg.includes('idea') || lastMsg.includes('start')) {
      return `💡 **Great business ideas for rural India:**

🏪 **Retail:** Grocery store, general store, medical shop
🌾 **Agriculture:** Organic farming, dairy, poultry, fishery
🔧 **Services:** Mobile repair, beauty parlor, tailoring
📦 **Supply:** Fertilizer/seed shop, hardware store, water purification

**Steps to get started:**
1. Research local demand (use our Market Analysis tool!)
2. Create a business plan (we can generate one for you)
3. Check eligible government schemes
4. Apply for funding through MUDRA or PMEGP

What type of business interests you? I can help you plan it out! 🚀`
    }
    
    if (lastMsg.includes('hello') || lastMsg.includes('hi') || lastMsg.includes('namaste')) {
      return `Namaste! 🙏 Welcome to BizNex!

I'm here to help you with:
• 💡 Business ideas and planning
• 🏛️ Government scheme information
• 🏦 Loan eligibility and guidance
• 📊 Market insights for your area

What would you like to know about today?`
    }
    
    return `Thank you for your question! Here are some things I can help with:

• **Business Planning** – I can help you create a business plan
• **Government Schemes** – Learn about MUDRA, PMEGP, and more
• **Loan Guidance** – Check your eligibility and compare banks
• **Market Insights** – Understand demand in your area

💡 *For the best experience, try using the dedicated feature pages in the sidebar for detailed analysis!*

Is there anything specific you'd like to know?`
  }
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
