import axios from 'axios'
import { governmentSchemes, findMatchingSchemes, scoreScheme } from './schemes-data'
import { findDistrictData, findStateData } from './census-data'
import { queryNearbyBusinesses, type OverpassBusiness } from './overpass'
import { geocodeLocation } from './geocoding'

// API base URL - in production this hits Vercel serverless functions,
// in dev it proxies to localhost:5000 (see vite.config.ts)
const API_BASE = '/api'

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

// Call the serverless API route for AI requests
async function callServerAI(type: string, payload: Record<string, any>): Promise<any> {
  const response = await axios.post(`${API_BASE}/ai`, { type, payload })
  return response.data.result
}

export async function analyzeMarket(data: MarketAnalysisRequest) {
  const prompt = `You are a senior data analyst and business advisor specializing in rural Indian markets. Analyze the following business opportunity with data-driven insights:\n\nBusiness Idea: ${data.businessIdea}\nLocation: ${data.location}\nInvestment Amount: ₹${data.investmentAmount.toLocaleString('en-IN')}\n\nProvide a comprehensive market analysis in JSON format:\n{\n  \"marketDemandScore\": <1-10>,\n  \"competitionLevel\": \"<Low|Medium|High>\",\n  \"estimatedMonthlyIncome\": <number in INR>,\n  \"growthPotential\": \"<Low|Medium|High>\",\n  \"riskLevel\": \"<Low|Medium|High>\",\n  \"requiredResources\": [\"list\", \"of\", \"resources\"],\n  \"targetCustomers\": \"<description>\",\n  \"demandChart\": [{\"month\": \"Jan\", \"demand\": <number>}, ...],\n  \"revenueForecast\": [{\"month\": \"Jan\", \"revenue\": <number>}, ...],\n  \"swotAnalysis\": {\n    \"strengths\": [\"...\"],\n    \"weaknesses\": [\"...\"],\n    \"opportunities\": [\"...\"],\n    \"threats\": [\"...\"]\n  },\n  \"recommendations\": [\"...\"]\n}\nReturn ONLY the JSON, no markdown.`

  try {
    return await callServerAI('analyze-market', { prompt })
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
  const prompt = `You are a business strategist and data analyst. Create a detailed, data-driven business plan for a rural Indian entrepreneur:\n\nBusiness Type: ${data.businessType}\nBudget: ₹${data.budget.toLocaleString('en-IN')}\nLocation: ${data.location}\n\nGenerate a comprehensive business plan with:\n1. Executive Summary\n2. Market Analysis (with data points)\n3. Target Customer Segment\n4. Revenue Model\n5. Cost Breakdown (itemized with percentages)\n6. Marketing Strategy\n7. Growth Plan (6 months, 1 year, 3 years with projections)\n8. Risk Assessment (with mitigation strategies)\n9. Key Metrics to Track (KPIs)\n\nFormat the response as structured sections with clear headings. Be specific to rural Indian context. Include numerical projections where possible.`

  try {
    return await callServerAI('generate-plan', { prompt })
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
  const prompt = `You are a financial analyst specializing in rural Indian lending. Calculate loan eligibility for:\n\nMonthly Income: ₹${data.monthlyIncome.toLocaleString('en-IN')}\nExisting Loans: ₹${data.existingLoans.toLocaleString('en-IN')}\nBusiness Type: ${data.businessType}\nInvestment Required: ₹${data.investmentRequirement.toLocaleString('en-IN')}\n\nProvide in JSON:\n{\n  \"eligibilityScore\": <1-100>,\n  \"eligibleLoanAmount\": <number>,\n  \"estimatedEMI\": <number>,\n  \"repaymentTenure\": \"X years\",\n  \"recommendedBanks\": [{\"name\": \"...\", \"interestRate\": \"...\", \"processingFee\": \"...\"}],\n  \"monthlyRepaymentSchedule\": [{\"month\": 1, \"emi\": <number>, \"principal\": <number>, \"interest\": <number>, \"balance\": <number>}]\n}\nReturn ONLY the JSON.`

  try {
    return await callServerAI('calculate-loan', { prompt })
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
    // Calculate financial context from the profile
    const projectCost = Math.round(businessProfile.investmentAmount / 0.10)
    const institutionalFinance = Math.round(projectCost * 0.90)
    
    // Determine applicable schemes
    const applicableSchemes: string[] = []
    if (projectCost <= 140000) applicableSchemes.push('Micro Finance Scheme (6.5% p.a., 3yr, 3mo moratorium)')
    if (projectCost > 140000 && projectCost <= 5000000) applicableSchemes.push('Term Loan Scheme (8% p.a., 7yr, 6mo moratorium)')
    if (projectCost <= 50000) applicableSchemes.push('MUDRA Shishu (up to ₹50K, collateral-free)')
    if (projectCost > 50000 && projectCost <= 500000) applicableSchemes.push('MUDRA Kishore (up to ₹5L, collateral-free)')
    if (businessProfile.age >= 18) applicableSchemes.push('PMEGP (25-35% subsidy for new businesses)')
    
    profileContext = `\n\n## ACTIVE BUSINESS PROFILE\nThe user currently has the following business profile selected:\n- Profile Name: ${businessProfile.name}\n- Business Type: ${businessProfile.businessType}\n- Description: ${businessProfile.businessDescription || 'N/A'}\n- Location: ${businessProfile.location}\n- Investment: ₹${businessProfile.investmentAmount.toLocaleString('en-IN')}\n- Monthly Income: ₹${businessProfile.monthlyIncome.toLocaleString('en-IN')}\n- Existing Loans: ₹${businessProfile.existingLoans.toLocaleString('en-IN')}\n- Working Capital: ₹${businessProfile.workingCapital.toLocaleString('en-IN')}\n- Equipment Cost: ₹${businessProfile.equipmentCost.toLocaleString('en-IN')}\n- Owner Age: ${businessProfile.age}, Gender: ${businessProfile.gender}, Category: ${businessProfile.category}\n\n## CALCULATED FINANCIAL DATA (deterministic, do not override)\n- Project Cost: ₹${projectCost.toLocaleString('en-IN')} (= margin ÷ 0.10)\n- Your Contribution (10%): ₹${businessProfile.investmentAmount.toLocaleString('en-IN')}\n- Institutional Finance (90%): ₹${institutionalFinance.toLocaleString('en-IN')}\n- Applicable Schemes: ${applicableSchemes.join('; ') || 'None identified'}\n\nUse this profile data to personalize all advice. When the user asks about money, loans, or feasibility, reference the CALCULATED FINANCIAL DATA above. The AI should EXPLAIN these calculations, not invent new ones. Never suggest different project cost calculations than what is shown above.`
  }

  const userNameBlock = userName ? `\nThe user's name is ${userName}. Address them by name occasionally.` : ''

  const systemPrompt = `You are BizNex AI, a senior data analyst and business advisor specializing in Indian entrepreneurship.\n\nYour expertise includes:\n- Data-driven business analysis and feasibility studies\n- Government scheme optimization and eligibility matching\n- Financial modeling, loan structuring, and ROI analysis\n- Market research, competitor analysis, and demand forecasting\n- Risk assessment with quantitative scoring\n- Revenue projections and cash flow planning\n\nCommunication style:\n- Respond in ${language}\n- Use data points, numbers, and percentages when possible\n- Be encouraging but realistic — base advice on data, not just optimism\n- Keep responses concise but actionable\n- When analyzing, always mention key metrics (demand score, risk level, ROI)\n- Use simple language that entrepreneurs can understand\n- Always reference the user's active business profile when giving advice\n${userNameBlock}${profileContext}\n\nYou are here to help users make informed business decisions backed by data.`

  const fullMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages,
  ]

  try {
    return await callServerAI('chat', { messages: fullMessages, systemPrompt })
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
  const prompt = `You are a hyper-local market research analyst. Provide data-driven business insights for ${location}, India.\n\nInclude:\n{\n  \"population\": \"estimated number\",\n  \"literacyRate\": \"percentage\",\n  \"majorIndustries\": [\"industry1\", \"industry2\"],\n  \"demandTrends\": [{\"category\": \"...\", \"trend\": \"growing|stable|declining\"}],\n  \"topBusinessOpportunities\": [\"...\"],\n  \"agriculturalProfile\": \"description\",\n  \"employmentStats\": {\"employed\": \"X%\", \"selfEmployed\": \"X%\", \"unemployed\": \"X%\"},\n  \"nearbyMarkets\": [\"market1\", \"market2\"],\n  \"infrastructureScore\": <1-10>,\n  \"digitalAdoption\": \"Low|Medium|High\"\n}\nReturn ONLY the JSON.`

  try {
    return await callServerAI('get-insights', { prompt })
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
  radius?: number
}) {
  const radius = data.radius || 12

  // Get real local context from census data
  const district = findDistrictData(data.location)
  const state = findStateData(data.location)

  // Use Nominatim geocoding for real coordinates from any location string
  let bLat: number
  let bLng: number

  const geo = await geocodeLocation(data.location)
  if (geo) {
    bLat = geo.lat
    bLng = geo.lng
  } else if (district) {
    // Fallback to known district coordinates
    const coords: Record<string, [number, number]> = {
      'anantapur': [14.68, 77.59], 'chittoor': [13.22, 79.11],
      'visakhapatnam': [17.69, 83.22], 'guntur': [16.31, 80.44],
      'hyderabad': [17.39, 78.49], 'bengaluru urban': [12.97, 77.59],
      'madurai': [9.92, 78.12], 'pune': [18.52, 73.86],
      'lucknow': [26.85, 80.95], 'patna': [25.60, 85.10],
      'jaipur': [26.92, 75.79], 'indore': [22.72, 75.86],
      'warangal': [17.97, 79.59], 'nellore': [14.44, 79.99],
      'kurnool': [15.83, 78.04], 'coimbatore': [11.01, 76.97],
      'kanpur': [26.45, 80.35], 'nagpur': [21.15, 79.09],
      'mysore': [12.30, 76.66],
    }
    const fallback = coords[district.district.toLowerCase()]
    bLat = fallback ? fallback[0] : 14.68
    bLng = fallback ? fallback[1] : 77.59
  } else {
    bLat = 14.68
    bLng = 77.59
  }

  const avgIncome = district?.avgMonthlyIncome || 15000
  const infraScore = district?.infrastructureScore || 6
  const digital = district?.digitalAdoption || 'Medium'
  const industries = district?.majorIndustries || ['Agriculture', 'Retail', 'Services']

  // Try Overpass API first for real business data
  const businessType = data.businessType.toLowerCase()
  const overpassResults = await queryNearbyBusinesses(data.businessType, bLat, bLng, radius)

  let generatedCompetitors: any[]

  if (overpassResults.length > 0) {
    // Map real Overpass data to our Competitor interface
    generatedCompetitors = mapOverpassToCompetitors(overpassResults, bLat, bLng, avgIncome)
  } else {
    // Fall back to mock data if Overpass returns nothing
    generatedCompetitors = generateLocalCompetitors(
      businessType, data.location, bLat, bLng, avgIncome, radius
    )
  }

    const avgPop = Math.round(generatedCompetitors.reduce((s, c) => s + c.popularity, 0) / generatedCompetitors.length)
    const avgDem = Math.round(generatedCompetitors.reduce((s, c) => s + c.demand, 0) / generatedCompetitors.length)
    const avgRev = Math.round(generatedCompetitors.reduce((s, c) => s + c.monthlyRevenue, 0) / generatedCompetitors.length)

    return {
      userBusiness: {
        name: `Your ${data.businessType}`,
        lat: bLat,
        lng: bLng,
        popularity: Math.round(avgPop * 0.6),
        demand: Math.round(avgDem * 0.85),
        monthlyRevenue: Math.round(avgRev * 0.5),
        rating: 3.6,
        progressScore: Math.round(avgPop * 0.55),
      },
      competitors: generatedCompetitors,
      marketSummary: {
        totalCompetitors: generatedCompetitors.length,
        averageDemand: avgDem,
        averagePopularity: avgPop,
        marketSaturation: generatedCompetitors.length >= 6 ? 'High' : generatedCompetitors.length >= 4 ? 'Medium' : 'Low',
        bestOpportunity: getMarketGap(businessType, industries, digital, avgIncome),
        threatLevel: avgPop > 70 ? 'High' : avgPop > 50 ? 'Medium' : 'Low',
      },
      demandTrend: [
        { month: 'Jan', demand: 50 }, { month: 'Feb', demand: 53 },
        { month: 'Mar', demand: 57 }, { month: 'Apr', demand: 55 },
        { month: 'May', demand: 60 }, { month: 'Jun', demand: 63 },
        { month: 'Jul', demand: 67 }, { month: 'Aug', demand: 65 },
        { month: 'Sep', demand: 70 }, { month: 'Oct', demand: 75 },
        { month: 'Nov', demand: 80 }, { month: 'Dec', demand: 83 },
      ],
      popularityComparison: [
        ...generatedCompetitors.slice(0, 5).map(c => ({ name: c.name, score: c.popularity })),
        { name: 'Your Business', score: Math.round(avgPop * 0.55) },
      ],
      marketGaps: generateMarketGaps(businessType, industries, digital, avgIncome, infraScore),
      recommendations: generateRecommendations(businessType, data.location, avgIncome, digital, infraScore, generatedCompetitors.length),
      dataSource: (overpassResults.length > 0 ? 'live' : 'simulated') as 'live' | 'simulated',
    }
}

// Keep backward compat — old callers may still pass radius
export type { }

/** Generate realistic local competitors based on business type and area economics */
function generateLocalCompetitors(
  businessType: string,
  location: string,
  baseLat: number,
  baseLng: number,
  avgIncome: number,
  radius: number
) {
  // Map business types to realistic competitor types
  const competitorProfiles: Record<string, { type: string; names: string[]; specialties: string[]; strengths: string[]; weaknesses: string[] }[]> = {
    'grocery': [
      { type: 'Direct', names: ['Ravi Provision Store', 'Sri Lakshmi Kirana', 'Balaji General Store', 'Suresh & Sons'], specialties: ['Daily essentials', 'Home delivery', 'Credit accounts'], strengths: ['Established customer base', 'Prime location', 'Trust factor'], weaknesses: ['No online presence', 'Limited stock variety'] },
      { type: 'Indirect', names: ['DMart Nearby', 'Reliance Fresh', 'More Megastore'], specialties: ['Branded products', 'Discount pricing', 'One-stop shop'], strengths: ['Bulk buying power', 'Brand trust', 'Modern systems'], weaknesses: ['Higher prices for small quantities', 'Less personal service'] },
    ],
    'dairy': [
      { type: 'Direct', names: ['Amul Parlour', 'Nandini Dairy', 'Heritage Milk Point', 'Local Milk Cooperative'], specialties: ['Fresh milk', 'Curd & paneer', 'Home delivery'], strengths: ['Brand recognition', 'Daily fresh supply', 'Loyal customers'], weaknesses: ['Limited product range', 'Low margins'] },
      { type: 'Indirect', names: ['Ghee & Sweets Shop', 'Juice Corner', 'Health Food Store'], specialties: ['Value-added products', 'Health drinks', 'Traditional sweets'], strengths: ['Higher margins', 'Niche market'], weaknesses: ['Seasonal demand', 'Storage requirements'] },
    ],
    'tailoring': [
      { type: 'Direct', names: ['Fashion Stitching Center', 'Ram Tailors', 'Meera Boutique', 'Smart Stitch'], specialties: ['Stitching', 'Alterations', 'Designer wear'], strengths: ['Skilled workers', 'Quick turnaround', 'Local reputation'], weaknesses: ['Outdated designs', 'No online ordering'] },
      { type: 'Indirect', names: ['Ready-Made Garment Shop', 'Textile Showroom', 'Wedding Collection'], specialties: ['Branded clothing', 'Bulk orders', 'Special occasions'], strengths: ['Variety', 'No wait time'], weaknesses: ['Higher prices', 'Less customization'] },
    ],
    'mobile': [
      { type: 'Direct', names: ['Quick Fix Mobiles', 'Cell Care', 'Mobile Mandi', 'Tech Repair Hub'], specialties: ['Screen repair', 'Software issues', 'Accessories'], strengths: ['Fast service', 'Spare parts availability', 'Walk-in customers'], weaknesses: ['No certification', 'Limited brand service'] },
      { type: 'Indirect', names: ['Electronics Showroom', 'Smartphone Store', 'Gadget World'], specialties: ['New phones', 'EMI options', 'Brand authorized'], strengths: ['Warranty service', 'Trade-in offers'], weaknesses: ['Higher price points'] },
    ],
    'restaurant': [
      { type: 'Direct', names: ['Annapurna Hotel', 'Spice Garden', 'Green Leaf Restaurant', 'Tiffin Service'], specialties: ['Home-style meals', 'South Indian', 'Thali'], strengths: ['Regular customers', 'Good taste', 'Affordable prices'], weaknesses: ['Slow service', 'Hygiene concerns'] },
      { type: 'Indirect', names: ['Street Food Stalls', 'Chai Tapri', 'Bakery & Snacks', 'Cloud Kitchen'], specialties: ['Quick bites', 'Snacks', 'Online delivery'], strengths: ['Low prices', 'Convenience'], weaknesses: ['Quality inconsistency', 'No seating'] },
    ],
    'beauty': [
      { type: 'Direct', names: ['Glow Beauty Parlour', 'Lakme Studio', 'Shringar Salon', 'Ruby Beauty Care'], specialties: ['Facial', 'Hair styling', 'Bridal makeup'], strengths: ['Skilled staff', 'Brand products', 'Reputation'], weaknesses: ['High prices', 'Long wait times'] },
      { type: 'Indirect', names: ['Ayurvedic Spa', 'Mehendi Artist', 'Home Salon Service'], specialties: ['Natural treatments', 'Bridal services', 'Doorstep service'], strengths: ['Personal touch', 'Niche services'], weaknesses: ['Limited capacity', 'No walk-in'] },
    ],
    'fertilizer': [
      { type: 'Direct', names: ['Krishna AgroInputs', 'Green Valley Seeds', 'FarmTech Supply', 'Cooperative Society'], specialties: ['Fertilizers', 'Seeds', 'Pesticides'], strengths: ['Expert advice', 'Bulk rates', 'Government tie-ups'], weaknesses: ['Counterfeit risk', 'Seasonal demand'] },
      { type: 'Indirect', names: ['Hardware & Irrigation Store', 'Solar Equipment Shop', 'Agricultural Equipment Rental'], specialties: ['Equipment', 'Irrigation', 'Machinery'], strengths: ['Higher margins', 'Essential items'], weaknesses: ['High investment', 'Slow inventory turn'] },
    ],
  }

  // Find matching profile or generate generic
  const matchedProfiles = competitorProfiles[businessType] || [
    { type: 'Direct', names: ['City Center Mart', 'Apollo Store', 'Local Retail Hub', 'Daily Needs Shop'], specialties: ['Core products', 'Local services', 'Daily essentials'], strengths: ['Established', 'Good location', 'Customer loyalty'], weaknesses: ['Limited innovation', 'No digital presence'] },
    { type: 'Indirect', names: ['Online Delivery Hub', 'Wholesale Market', 'Supermarket Chain'], specialties: ['Convenience', 'Bulk options', 'Variety'], strengths: ['Price advantage', 'Modern systems'], weaknesses: ['Less personal', 'Higher setup cost'] },
  ]

  const competitors = matchedProfiles.flatMap(profile =>
    profile.names.slice(0, 3).map((name, i) => ({
      name,
      type: profile.type,
      lat: baseLat + (Math.random() - 0.5) * (radius * 0.008),
      lng: baseLng + (Math.random() - 0.5) * (radius * 0.008),
      distance: Math.round((0.5 + Math.random() * (radius - 0.5)) * 10) / 10,
      popularity: Math.round(50 + Math.random() * 35),
      demand: Math.round(45 + Math.random() * 40),
      monthlyRevenue: Math.round((avgIncome * (1.5 + Math.random() * 4)) / 1000) * 1000,
      rating: Math.round((3.2 + Math.random() * 1.5) * 10) / 10,
      progressScore: Math.round(40 + Math.random() * 45),
      established: 2012 + Math.floor(Math.random() * 12),
      strengths: profile.strengths.slice(0, 2 + Math.floor(Math.random() * 2)),
      weaknesses: profile.weaknesses.slice(0, 1 + Math.floor(Math.random() * 2)),
      specialties: profile.specialties.slice(0, 2 + Math.floor(Math.random() * 2)),
    }))
  )

  return competitors
}

/** Map real Overpass API results to our Competitor interface */
function mapOverpassToCompetitors(
  businesses: OverpassBusiness[],
  userLat: number,
  userLng: number,
  avgIncome: number
) {
  return businesses.map((b) => {
    // Calculate distance from user's business
    const R = 6371 // Earth radius in km
    const dLat = ((b.lat - userLat) * Math.PI) / 180
    const dLng = ((b.lng - userLng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    // Estimate metrics based on distance and business type
    // Closer businesses tend to be more relevant/established
    const proximityFactor = Math.max(0.4, 1 - distance / 10)
    const popularity = Math.round(45 + proximityFactor * 35 + Math.random() * 15)
    const demand = Math.round(40 + proximityFactor * 30 + Math.random() * 20)
    const revenue = Math.round((avgIncome * (1 + proximityFactor * 3 + Math.random() * 2)) / 1000) * 1000

    return {
      name: b.name,
      type: b.type,
      lat: b.lat,
      lng: b.lng,
      distance: Math.round(distance * 10) / 10,
      popularity: Math.min(popularity, 95),
      demand: Math.min(demand, 95),
      monthlyRevenue: revenue,
      rating: Math.round((3.0 + proximityFactor * 1.5 + Math.random() * 0.5) * 10) / 10,
      progressScore: Math.round(35 + proximityFactor * 40 + Math.random() * 10),
      established: 2010 + Math.floor(Math.random() * 15),
      strengths: generateStrengths(b),
      weaknesses: generateWeaknesses(b),
      specialties: [b.type, ...(b.category === 'shop' ? ['Retail'] : ['Services'])],
    }
  })
}

/** Generate realistic strengths for a real business */
function generateStrengths(b: OverpassBusiness): string[] {
  const pool = [
    'Established local presence',
    'Loyal customer base',
    'Prime location',
    'Competitive pricing',
    'Quality products',
    'Good word-of-mouth',
    'Consistent service',
    'Wide product range',
  ]
  if (b.phone) pool.push('Accepts phone orders')
  if (b.openingHours) pool.push('Clear operating hours')
  if (b.website) pool.push('Has online presence')
  // Pick 2-3 random strengths
  return pool.sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2))
}

/** Generate realistic weaknesses for a real business */
function generateWeaknesses(b: OverpassBusiness): string[] {
  const pool = [
    'Limited online presence',
    'Narrow product selection',
    'Inconsistent hours',
    'Higher prices than competitors',
    'No delivery service',
    'Small store footprint',
  ]
  if (!b.website) pool.push('No website or social media')
  if (!b.phone) pool.push('Hard to contact remotely')
  return pool.sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 2))
}

/** Generate market gap analysis based on local context */
function generateMarketGaps(
  businessType: string,
  industries: string[],
  digital: string,
  avgIncome: number,
  infraScore: number
) {
  const gaps: { gap: string; opportunity: string; potentialImpact: 'High' | 'Medium' | 'Low' }[] = []

  if (digital === 'Low' || digital === 'Medium') {
    gaps.push({
      gap: 'Limited digital presence among local competitors',
      opportunity: 'Offer online ordering, WhatsApp catalog, or Google Maps listing to capture tech-savvy customers',
      potentialImpact: 'High',
    })
  }

  if (avgIncome < 20000) {
    gaps.push({
      gap: 'Price-sensitive market with few budget-friendly options',
      opportunity: 'Introduce smaller pack sizes, EMI options, or credit-based buying for daily essentials',
      potentialImpact: 'High',
    })
  }

  if (infraScore < 7) {
    gaps.push({
      gap: 'Poor logistics and supply chain infrastructure',
      opportunity: 'Partner with local transport or set up a small warehouse to ensure consistent stock availability',
      potentialImpact: 'Medium',
    })
  }

  if (industries.includes('Agriculture') || industries.some(i => i.toLowerCase().includes('agri'))) {
    gaps.push({
      gap: 'Seasonal income fluctuations in agricultural communities',
      opportunity: 'Diversify with off-season products or services aligned with harvest cycles',
      potentialImpact: 'Medium',
    })
  }

  gaps.push({
    gap: 'Lack of loyalty programs or repeat-customer incentives',
    opportunity: 'Introduce a simple points system, referral discounts, or monthly membership for regular buyers',
    potentialImpact: 'Medium',
  })

  return gaps
}

/** Generate actionable recommendations based on local context */
function generateRecommendations(
  businessType: string,
  location: string,
  avgIncome: number,
  digital: string,
  infraScore: number,
  competitorCount: number
) {
  const recs: string[] = []

  if (competitorCount >= 5) {
    recs.push(`Market has ${competitorCount} competitors — differentiate by offering unique value (home delivery, loyalty rewards, or specialized products)`) 
  }

  if (digital === 'Low' || digital === 'Medium') {
    recs.push(`Digital adoption is ${digital.toLowerCase()} in this area — create a Google Business profile and WhatsApp Business account to stand out from competitors who lack online presence`)
  }

  if (avgIncome < 15000) {
    recs.push(`Average income in ${location} is ₹${avgIncome.toLocaleString('en-IN')}/month — price products for affordability and consider offering credit/EMI options`)
  } else if (avgIncome > 25000) {
    recs.push(`Average income in ${location} is ₹${avgIncome.toLocaleString('en-IN')}/month — customers can afford premium products; consider adding a premium tier`)
  }

  recs.push('Apply for PMEGP or MUDRA loan to fund expansion — government subsidies can cover 25-35% of your investment')
  recs.push('Visit local APMC markets and haats weekly to understand competitor pricing and spot supply chain opportunities')
  recs.push('Build relationships with local SHGs and farmer cooperatives for bulk buying advantages and steady customer base')

  return recs
}

/** Get a specific market gap based on business type and area */
function getMarketGap(businessType: string, industries: string[], digital: string, avgIncome: number): string {
  if (digital === 'Low') return `Most ${businessType} competitors in this area lack any digital presence — first-mover advantage in online visibility`
  if (avgIncome < 15000) return `Price-sensitive market with few budget-friendly ${businessType} options — opportunity for affordable offerings`
  if (industries.some(i => i.toLowerCase().includes('agri'))) return `Agricultural economy with seasonal demand cycles — opportunity for off-season diversification`
  return `Growing market with moderate competition — room for a quality-focused ${businessType} with modern customer experience`
}

export async function getFundingAdvice(data: {
  businessType: string
  totalCost: number
  workingCapital: number
  equipmentCost: number
}) {
  const prompt = `You are a financial structuring expert. Provide optimal funding structure advice for:\n\nBusiness: ${data.businessType}\nTotal Cost: ₹${data.totalCost.toLocaleString('en-IN')}\nWorking Capital: ₹${data.workingCapital.toLocaleString('en-IN')}\nEquipment Cost: ₹${data.equipmentCost.toLocaleString('en-IN')}\n\nRecommend a funding structure with:\n{\n  \"selfFunding\": {\"percentage\": <number>, \"amount\": <number>},\n  \"governmentLoans\": [{\"scheme\": \"...\", \"amount\": <number>, \"subsidy\": \"...\"}],\n  \"bankLoans\": [{\"bank\": \"...\", \"amount\": <number>, \"interestRate\": \"...\"}],\n  \"subsidies\": [{\"name\": \"...\", \"amount\": <number>, \"eligibility\": \"...\"}],\n  \"totalFundingPlan\": {\"ownContribution\": <number>, \"loanAmount\": <number>, \"subsidyAmount\": <number>},\n  \"monthlyCashFlow\": [{\"month\": \"M1\", \"inflow\": <number>, \"outflow\": <number>}]\n}\nReturn ONLY the JSON.`

  try {
    return await callServerAI('get-funding', { prompt })
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
